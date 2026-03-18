export type Domain =
  | "Agentic Architecture & Orchestration"
  | "Tool Design & MCP Integration"
  | "Claude Code Configuration & Workflows"
  | "Prompt Engineering & Structured Output"
  | "Context Management & Reliability";

export type ScenarioColor = "blue" | "green" | "purple" | "orange" | "pink";

// Client-safe question — no correct index, no explanation
export interface ClientQuestion {
  id: number;
  scenario: string;
  scenarioColor: ScenarioColor;
  domain: Domain;
  q: string;
  opts: string[];
}

export interface ScenarioMeta {
  color: ScenarioColor;
  description: string;
}

export interface AnswerResult {
  correct: boolean;
  correctIndex: number;
  explanation: string;
}

export interface QuestionsResponse {
  questions: ClientQuestion[];
  scenarios: Record<string, ScenarioMeta>;
  domainColors: Record<Domain, string>;
  domainWeights: Record<Domain, number>;
}
