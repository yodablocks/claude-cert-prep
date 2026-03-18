import { NextResponse } from "next/server";
import { QUESTIONS, SCENARIOS, DOMAIN_COLORS, DOMAIN_WEIGHTS } from "@/data/questions";

// Strip correct answer index and explanation before sending to client
const clientQuestions = QUESTIONS.map(({ correct, explanation, ...rest }) => rest);

export async function GET() {
  return NextResponse.json({
    questions: clientQuestions,
    scenarios: SCENARIOS,
    domainColors: DOMAIN_COLORS,
    domainWeights: DOMAIN_WEIGHTS,
  });
}
