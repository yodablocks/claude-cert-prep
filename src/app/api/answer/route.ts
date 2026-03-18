import { NextRequest, NextResponse } from "next/server";
import { QUESTIONS } from "@/data/questions";

export async function POST(req: NextRequest) {
  const { questionId, selected } = await req.json();

  const question = QUESTIONS.find((q) => q.id === questionId);
  if (!question) {
    return NextResponse.json({ error: "Question not found" }, { status: 404 });
  }

  const correct = selected === question.correct;

  return NextResponse.json({
    correct,
    correctIndex: question.correct,
    explanation: question.explanation,
  });
}
