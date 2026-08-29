import { auth } from "@/lib/auth";
import { getRouteClusters } from "@/lib/data";
import { createServiceClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id || "demo-user-1";

    const clusters = await getRouteClusters(userId);
    const activeClusters = clusters.filter((c) => c.status === "active");

    // Generate Razorpay Smart Router JSON config
    const rules = activeClusters.map((cluster, idx) => ({
      rule_id: `undrop_rule_${cluster.id.substring(0, 8)}`,
      name: `Undrop Auto-Failover: ${cluster.issuer} ${cluster.method}`,
      priority: idx + 1,
      enabled: true,
      conditions: [
        {
          field: "payment.method",
          operator: "equals",
          value: cluster.method.toLowerCase(),
        },
        {
          field: "payment.bank",
          operator: "equals",
          value: cluster.issuer.toUpperCase(),
        },
        {
          field: "error.code",
          operator: "equals",
          value: cluster.error_code,
        },
      ],
      actions: [
        {
          type: "reroute",
          target_terminal: `${cluster.issuer.toLowerCase()}_backup_gateway`,
          max_retry_attempts: 2,
        },
        {
          type: "suggest_alt_method",
          preferred_methods: ["card", "upi_collect"],
        },
      ],
      created_by: "Undrop Agentic Route Intelligence",
      created_at: new Date().toISOString(),
    }));

    const smartRouterConfigPayload = {
      merchant_id: userId,
      schema_version: "2024.1",
      generator: "Undrop Agentic Revenue Recovery Engine",
      total_active_rules: rules.length,
      rules: rules.length > 0 ? rules : [
        {
          rule_id: "undrop_rule_default_1",
          name: "Undrop Auto-Failover: HDFC UPI Intent",
          priority: 1,
          enabled: true,
          conditions: [
            { field: "payment.method", operator: "equals", value: "upi" },
            { field: "payment.bank", operator: "equals", value: "HDFC" },
          ],
          actions: [
            { type: "reroute", target_terminal: "icici_secondary_gateway", max_retry_attempts: 2 },
          ],
          created_by: "Undrop Agentic Route Intelligence",
          created_at: new Date().toISOString(),
        },
      ],
    };

    return NextResponse.json({
      success: true,
      config: smartRouterConfigPayload,
      jsonFormatted: JSON.stringify(smartRouterConfigPayload, null, 2),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to generate router config" }, { status: 500 });
  }
}
