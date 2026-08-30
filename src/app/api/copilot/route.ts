import { answerCopilotQuery } from "@/lib/copilot";
import { getProactiveInsight } from "@/lib/copilot-insights";
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

  if (!question) {
    return NextResponse.json({ error: "Question is required" }, { status: 400 });
  }

  const answer = await answerCopilotQuery(userId, question, conversationHistory);
  return NextResponse.json({ answer });
}
