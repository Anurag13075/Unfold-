import {
  answerCopilotQuery,
  classifyConfirmationIntent,
  detectCopilotToolCall,
} from "@/lib/copilot";
import { getProactiveInsight } from "@/lib/copilot-insights";
import {
  describeCopilotToolConsequence,
  executeCopilotTool,
  type PendingCopilotToolCall,
} from "@/lib/copilot-tools";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const insight = await getProactiveInsight(userId);
  return NextResponse.json({ insight });
}

export async function POST(req: Request) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const question = typeof body.question === "string" ? body.question.trim() : "";
  const conversationHistory = Array.isArray(body.conversationHistory) ? body.conversationHistory : [];
  const pendingToolCall = body.pendingToolCall as PendingCopilotToolCall | null | undefined;

  if (!question) {
    return NextResponse.json({ error: "Question is required" }, { status: 400 });
  }

  if (pendingToolCall?.name) {
    const intent = await classifyConfirmationIntent(question);

    if (intent === "deny") {
      return NextResponse.json({
        answer: "Cancelled. I did not execute the pending action.",
        pendingToolCall: null,
        actionExecuted: false,
      });
    }

    if (intent === "unclear") {
      return NextResponse.json({
        answer: "I still need a clear confirmation before executing that action. Reply with Confirm or Cancel.",
        pendingToolCall,
        requiresConfirmation: true,
        actionExecuted: false,
      });
    }

    const host = req.headers.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const result = await executeCopilotTool({
      userId,
      toolCall: pendingToolCall,
      baseUrl: `${protocol}://${host}`,
    });

    return NextResponse.json({
      answer: result.message,
      pendingToolCall: null,
      actionExecuted: result.success,
      result,
    });
  }

  const toolCall = await detectCopilotToolCall(question, conversationHistory);
  if (toolCall) {
    const consequence = await describeCopilotToolConsequence(userId, toolCall);
    if (!consequence.ok) {
      return NextResponse.json({
        answer: consequence.message,
        pendingToolCall: null,
        actionExecuted: false,
      });
    }

    return NextResponse.json({
      answer: consequence.message,
      pendingToolCall: consequence.pendingToolCall,
      requiresConfirmation: true,
      actionExecuted: false,
    });
  }

  const answer = await answerCopilotQuery(userId, question, conversationHistory);
  return NextResponse.json({ answer, pendingToolCall: null });
}
