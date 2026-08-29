import crypto from "crypto";
import { encrypt } from "../src/lib/encryption";
import { setMockServiceClient } from "../src/lib/supabase";
import { getTransactions } from "../src/lib/data";
import { POST as perMerchantPost } from "../src/app/api/webhooks/razorpay/[userId]/route";
import { POST as legacyPost } from "../src/app/api/webhooks/razorpay/route";

// In-memory mock DB for offline acceptance testing
const mockUsers = new Map<string, any>();
const mockTransactions = new Map<string, any>();
const mockAgentActions: any[] = [];
const mockRecoveryMessages: any[] = [];

function setupMockSupabase() {
  const mockClient = {
    from: (table: string) => {
      return {
        select: (...args: any[]) => {
          let filterCol: string | null = null;
          let filterVal: any = null;

          const queryObj = {
            eq: (col: string, val: any) => {
              filterCol = col;
              filterVal = val;
              return queryObj;
            },
            order: (col: string, opts: any) => {
              return queryObj;
            },
            maybeSingle: async () => {
              if (table === "users" && filterCol === "id") {
                const u = mockUsers.get(filterVal);
                return { data: u || null, error: null };
              }
              if (table === "transactions" && filterCol === "id") {
                const t = mockTransactions.get(filterVal);
                return { data: t || null, error: null };
              }
              return { data: null, error: null };
            },
            single: async () => {
              if (table === "users" && filterCol === "id") {
                const u = mockUsers.get(filterVal);
                return { data: u || null, error: null };
              }
              return { data: null, error: null };
            },
            then: (resolve: any) => {
              if (table === "transactions" && filterCol === "user_id") {
                const list = Array.from(mockTransactions.values()).filter((t) => t.user_id === filterVal);
                resolve({ data: list, error: null });
              } else if (table === "users" && filterCol === "id") {
                const u = mockUsers.get(filterVal);
                resolve({ data: u ? [u] : [], error: null });
              } else {
                resolve({ data: [], error: null });
              }
            },
          };
          return queryObj;
        },
        upsert: (payload: any) => {
          const items = Array.isArray(payload) ? payload : [payload];
          if (table === "users") {
            for (const item of items) {
              const existing = mockUsers.get(item.id) || {};
              mockUsers.set(item.id, { ...existing, ...item });
            }
          } else if (table === "transactions") {
            for (const item of items) {
              mockTransactions.set(item.id, item);
            }
          }
          const res = { error: null, data: items[0] || null };
          return {
            ...res,
            select: () => ({
              single: async () => ({ data: items[0] || null, error: null }),
            }),
            then: (resolve: any) => resolve(res),
          };
        },
        update: (payload: any) => ({
          eq: (col: string, val: any) => {
            if (table === "users" && mockUsers.has(val)) {
              const u = mockUsers.get(val);
              mockUsers.set(val, { ...u, ...payload });
            }
            return Promise.resolve({ error: null });
          },
        }),
        insert: async (payload: any) => {
          if (table === "agent_actions") mockAgentActions.push(payload);
          if (table === "recovery_messages") mockRecoveryMessages.push(payload);
          return { error: null };
        },
      };
    },
  };

  setMockServiceClient(mockClient);
}

async function runAcceptanceTests() {
  console.log("=== STARTING MULTI-TENANT RAZORPAY ACCEPTANCE TESTS ===");
  setupMockSupabase();

  const userAId = "test-user-a";
  const userASecret = "secret_key_user_a_789";

  const userBId = "test-user-b";
  const userBSecret = "secret_key_user_b_456";

  const userCId = "test-user-c-no-secret";

  // Create test users
  mockUsers.set(userAId, {
    id: userAId,
    email: "usera@example.com",
    name: "Merchant A",
    workspace_name: "Workspace A",
    razorpay_webhook_secret_enc: encrypt(userASecret),
  });

  mockUsers.set(userBId, {
    id: userBId,
    email: "userb@example.com",
    name: "Merchant B",
    workspace_name: "Workspace B",
    razorpay_webhook_secret_enc: encrypt(userBSecret),
  });

  mockUsers.set(userCId, {
    id: userCId,
    email: "userc@example.com",
    name: "Merchant C",
    workspace_name: "Workspace C",
    razorpay_webhook_secret_enc: null,
  });

  // Create payment failed payload for User A
  const payloadA = JSON.stringify({
    event: "payment.failed",
    payload: {
      payment: {
        entity: {
          id: "pay_test_user_a_001",
          amount: 50000,
          currency: "INR",
          method: "card",
          bank: "HDFC",
          error_code: "BAD_REQUEST_ERROR",
          error_description: "Payment failed test A",
          notes: { merchant: "Merchant A Store" },
        },
      },
    },
  });

  const sigA = crypto
    .createHmac("sha256", userASecret)
    .update(payloadA)
    .digest("hex");

  // TEST 1: User A webhook with User A signature -> SHOULD SUCCEED (200)
  console.log("\n--- TEST 1: User A webhook with valid signature ---");
  const reqA = new Request(`http://localhost:3000/api/webhooks/razorpay/${userAId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-razorpay-signature": sigA,
    },
    body: payloadA,
  });

  const resA = await perMerchantPost(reqA, { params: { userId: userAId } });
  const dataA = await resA.json();
  console.log("Response status:", resA.status, dataA);
  if (resA.status !== 200) {
    throw new Error(`Test 1 Failed: expected status 200, got ${resA.status}`);
  }

  // Create payment failed payload for User B
  const payloadB = JSON.stringify({
    event: "payment.failed",
    payload: {
      payment: {
        entity: {
          id: "pay_test_user_b_001",
          amount: 75000,
          currency: "INR",
          method: "upi",
          bank: "ICICI",
          error_code: "GATEWAY_ERROR",
          error_description: "Payment failed test B",
          notes: { merchant: "Merchant B Store" },
        },
      },
    },
  });

  const sigB = crypto
    .createHmac("sha256", userBSecret)
    .update(payloadB)
    .digest("hex");

  // TEST 2: User B webhook with User B signature -> SHOULD SUCCEED (200)
  console.log("\n--- TEST 2: User B webhook with valid signature ---");
  const reqB = new Request(`http://localhost:3000/api/webhooks/razorpay/${userBId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-razorpay-signature": sigB,
    },
    body: payloadB,
  });

  const resB = await perMerchantPost(reqB, { params: { userId: userBId } });
  const dataB = await resB.json();
  console.log("Response status:", resB.status, dataB);
  if (resB.status !== 200) {
    throw new Error(`Test 2 Failed: expected status 200, got ${resB.status}`);
  }

  // TEST 3: Multi-tenant isolation check — User A signature sent to User B endpoint -> MUST REJECT (400)
  console.log("\n--- TEST 3: Cross-tenant attack (User A signature sent to User B endpoint) ---");
  const reqCross = new Request(`http://localhost:3000/api/webhooks/razorpay/${userBId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-razorpay-signature": sigA, // Signed with User A's secret!
    },
    body: payloadA,
  });

  const resCross = await perMerchantPost(reqCross, { params: { userId: userBId } });
  const dataCross = await resCross.json();
  console.log("Response status:", resCross.status, dataCross);
  if (resCross.status !== 400 || dataCross.error !== "Invalid signature") {
    throw new Error(`Test 3 Failed: expected 400 Invalid signature, got ${resCross.status} ${JSON.stringify(dataCross)}`);
  }

  // TEST 4: Unconfigured secret check — Webhook sent to User C who has no secret -> MUST REJECT (400)
  console.log("\n--- TEST 4: Webhook for user with unconfigured secret ---");
  const reqUnconfig = new Request(`http://localhost:3000/api/webhooks/razorpay/${userCId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-razorpay-signature": "fakesig",
    },
    body: payloadA,
  });

  const resUnconfig = await perMerchantPost(reqUnconfig, { params: { userId: userCId } });
  const dataUnconfig = await resUnconfig.json();
  console.log("Response status:", resUnconfig.status, dataUnconfig);
  if (resUnconfig.status !== 400 || dataUnconfig.error !== "Webhook secret not configured") {
    throw new Error(`Test 4 Failed: expected 400 Webhook secret not configured, got ${resUnconfig.status}`);
  }

  // TEST 5: Data isolation check via getTransactions
  console.log("\n--- TEST 5: Data isolation check via getTransactions ---");
  const txnsA = await getTransactions(userAId);
  const txnsB = await getTransactions(userBId);

  console.log(`User A transactions count: ${txnsA.length}`);
  console.log(`User B transactions count: ${txnsB.length}`);

  const hasCrossLeakedInA = txnsA.some((t) => t.razorpay_payment_id === "pay_test_user_b_001");
  const hasCrossLeakedInB = txnsB.some((t) => t.razorpay_payment_id === "pay_test_user_a_001");

  if (hasCrossLeakedInA || hasCrossLeakedInB) {
    throw new Error("Test 5 Failed: Data leaked across tenant boundaries!");
  }

  if (txnsA.length !== 1 || txnsA[0].razorpay_payment_id !== "pay_test_user_a_001") {
    throw new Error(`Test 5 Failed: User A transactions list incorrect: ${JSON.stringify(txnsA)}`);
  }
  if (txnsB.length !== 1 || txnsB[0].razorpay_payment_id !== "pay_test_user_b_001") {
    throw new Error(`Test 5 Failed: User B transactions list incorrect: ${JSON.stringify(txnsB)}`);
  }

  // TEST 6: Legacy route compatibility check
  console.log("\n--- TEST 6: Legacy webhook route check ---");
  const reqLegacy = new Request("http://localhost:3000/api/webhooks/razorpay", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      event: "payment.failed",
      payload: {
        payment: {
          entity: {
            id: "pay_legacy_001",
            amount: 10000,
            currency: "INR",
            method: "netbanking",
            bank: "SBI",
          },
        },
      },
    }),
  });

  const resLegacy = await legacyPost(reqLegacy);
  const dataLegacy = await resLegacy.json();
  console.log("Legacy Route Response:", resLegacy.status, dataLegacy);
  if (resLegacy.status !== 200) {
    throw new Error(`Test 6 Failed: Legacy route returned ${resLegacy.status}`);
  }

  console.log("\nALL ACCEPTANCE TESTS PASSED SUCCESSFULLY! ✅");
}

runAcceptanceTests().catch((err) => {
  console.error("\n❌ ACCEPTANCE TEST FAILED:", err);
  process.exit(1);
});
