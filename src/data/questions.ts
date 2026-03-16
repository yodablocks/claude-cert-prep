export type Domain =
  | "Agentic Architecture & Orchestration"
  | "Tool Design & MCP Integration"
  | "Claude Code Configuration & Workflows"
  | "Prompt Engineering & Structured Output"
  | "Context Management & Reliability";

export type ScenarioColor = "blue" | "green" | "purple" | "orange" | "pink";

export interface Question {
  id: number;
  scenario: string;
  scenarioColor: ScenarioColor;
  domain: Domain;
  q: string;
  opts: string[];
  correct: number;
  explanation: string;
}

export const SCENARIOS: Record<string, { color: ScenarioColor; description: string }> = {
  "Customer Support Resolution Agent": {
    color: "blue",
    description:
      "You are building a customer support resolution agent using the Claude Agent SDK. The agent handles high-ambiguity requests like returns, billing disputes, and account issues through custom MCP tools (get_customer, lookup_order, process_refund, escalate_to_human). Your target is 80%+ first-contact resolution while knowing when to escalate.",
  },
  "Code Generation with Claude Code": {
    color: "green",
    description:
      "You are using Claude Code to accelerate software development. Your team uses it for code generation, refactoring, debugging, and documentation — integrating it with custom slash commands, CLAUDE.md configurations, and plan mode vs direct execution workflows.",
  },
  "Multi-Agent Research System": {
    color: "purple",
    description:
      "You are building a multi-agent research system using the Claude Agent SDK. A coordinator agent delegates to specialized subagents for web search, document analysis, synthesis, and report generation. The system produces comprehensive, cited reports.",
  },
  "Claude Code for Continuous Integration": {
    color: "orange",
    description:
      "You are integrating Claude Code into your CI/CD pipeline. The system runs automated code reviews, generates test cases, and provides feedback on pull requests. You need to design prompts that provide actionable feedback and minimize false positives.",
  },
  "Structured Data Extraction": {
    color: "pink",
    description:
      "You are building a structured data extraction system using Claude. The system extracts information from unstructured documents, validates output using JSON schemas, and maintains high accuracy. It must handle edge cases gracefully and integrate with downstream systems.",
  },
};

export const QUESTIONS: Question[] = [
  {
    id: 1,
    scenario: "Customer Support Resolution Agent",
    scenarioColor: "blue",
    domain: "Agentic Architecture & Orchestration",
    q: "Production data shows that in 12% of cases, your agent skips get_customer entirely and calls lookup_order using only the customer's stated name, occasionally leading to misidentified accounts and incorrect refunds. What change would most effectively address this reliability issue?",
    opts: [
      "Add a programmatic prerequisite that blocks lookup_order and process_refund calls until get_customer has returned a verified customer ID",
      "Enhance the system prompt to state that customer verification via get_customer is mandatory before any order operations",
      "Add few-shot examples showing the agent always calling get_customer first, even when customers volunteer order details",
      "Implement a routing classifier that analyzes each request and enables only the subset of tools appropriate for that request type",
    ],
    correct: 0,
    explanation:
      "When a specific tool sequence is required for critical business logic (like verifying customer identity before processing refunds), programmatic enforcement provides deterministic guarantees that prompt-based approaches cannot. Options B and C rely on probabilistic LLM compliance, which is insufficient when errors have financial consequences. Option D addresses tool availability rather than tool ordering, which is not the actual problem.",
  },
  {
    id: 2,
    scenario: "Customer Support Resolution Agent",
    scenarioColor: "blue",
    domain: "Tool Design & MCP Integration",
    q: "Production logs show the agent frequently calls get_customer when users ask about orders (e.g., 'check my order #12345'), instead of calling lookup_order. Both tools have minimal descriptions ('Retrieves customer information' / 'Retrieves order details') and accept similar identifier formats. What's the most effective first step to improve tool selection reliability?",
    opts: [
      "Add few-shot examples to the system prompt demonstrating correct tool selection patterns, with 5–8 examples showing order-related queries routing to lookup_order",
      "Expand each tool's description to include input formats it handles, example queries, edge cases, and boundaries explaining when to use it versus similar tools",
      "Implement a routing layer that parses user input before each turn and pre-selects the appropriate tool based on detected keywords and identifier patterns",
      "Consolidate both tools into a single lookup_entity tool that accepts any identifier and internally determines which backend to query",
    ],
    correct: 1,
    explanation:
      "Tool descriptions are the primary mechanism LLMs use for tool selection. When descriptions are minimal, models lack the context to differentiate between similar tools. Option B directly addresses this root cause with a low-effort, high-leverage fix. Few-shot examples (A) add token overhead without fixing the underlying issue. A routing layer (C) is over-engineered and bypasses the LLM's natural language understanding. Consolidating tools (D) is a valid architectural choice but requires more effort than a 'first step' warrants when the immediate problem is inadequate descriptions.",
  },
  {
    id: 3,
    scenario: "Customer Support Resolution Agent",
    scenarioColor: "blue",
    domain: "Context Management & Reliability",
    q: "Your agent achieves 55% first-contact resolution, well below the 80% target. Logs show it escalates straightforward cases (standard damage replacements with photo evidence) while attempting to autonomously handle complex situations requiring policy exceptions. What's the most effective way to improve escalation calibration?",
    opts: [
      "Add explicit escalation criteria to your system prompt with few-shot examples demonstrating when to escalate versus resolve autonomously",
      "Have the agent self-report a confidence score (1–10) before each response and automatically route requests to humans when confidence falls below a threshold",
      "Deploy a separate classifier model trained on historical tickets to predict which requests need escalation before the main agent begins processing",
      "Implement sentiment analysis to detect customer frustration levels and automatically escalate when negative sentiment exceeds a threshold",
    ],
    correct: 0,
    explanation:
      "Adding explicit escalation criteria with few-shot examples directly addresses the root cause: unclear decision boundaries. This is the proportionate first response before adding infrastructure. Option B fails because LLM self-reported confidence is poorly calibrated — the agent is already incorrectly confident on hard cases. Option C is over-engineered, requiring labeled data and ML infrastructure when prompt optimization hasn't been tried. Option D solves a different problem entirely; sentiment doesn't correlate with case complexity, which is the actual issue.",
  },
  {
    id: 4,
    scenario: "Code Generation with Claude Code",
    scenarioColor: "green",
    domain: "Claude Code Configuration & Workflows",
    q: "You want to create a custom /review slash command that runs your team's standard code review checklist. This command should be available to every developer when they clone or pull the repository. Where should you create this command file?",
    opts: [
      "In the .claude/commands/ directory in the project repository",
      "In ~/.claude/commands/ in each developer's home directory",
      "In the CLAUDE.md file at the project root",
      "In a .claude/config.json file with a commands array",
    ],
    correct: 0,
    explanation:
      "Project-scoped custom slash commands should be stored in the .claude/commands/ directory within the repository. These commands are version-controlled and automatically available to all developers when they clone or pull the repo. Option B (~/.claude/commands/) is for personal commands that aren't shared via version control. Option C (CLAUDE.md) is for project instructions and context, not command definitions. Option D describes a configuration mechanism that doesn't exist in Claude Code.",
  },
  {
    id: 5,
    scenario: "Code Generation with Claude Code",
    scenarioColor: "green",
    domain: "Claude Code Configuration & Workflows",
    q: "You've been assigned to restructure the team's monolithic application into microservices. This will involve changes across dozens of files and requires decisions about service boundaries and module dependencies. Which approach should you take?",
    opts: [
      "Enter plan mode to explore the codebase, understand dependencies, and design an implementation approach before making changes",
      "Start with direct execution and make changes incrementally, letting the implementation reveal the natural service boundaries",
      "Use direct execution with comprehensive upfront instructions detailing exactly how each service should be structured",
      "Begin in direct execution mode and only switch to plan mode if you encounter unexpected complexity during implementation",
    ],
    correct: 0,
    explanation:
      "Plan mode is designed for complex tasks involving large-scale changes, multiple valid approaches, and architectural decisions — exactly what monolith-to-microservices restructuring requires. It enables safe codebase exploration and design before committing to changes. Option B risks costly rework when dependencies are discovered late. Option C assumes you already know the right structure without exploring the code. Option D ignores that the complexity is already stated in the requirements, not something that might emerge later.",
  },
  {
    id: 6,
    scenario: "Code Generation with Claude Code",
    scenarioColor: "green",
    domain: "Claude Code Configuration & Workflows",
    q: "Your codebase has distinct areas with different coding conventions. Test files are spread throughout the codebase alongside the code they test (e.g., Button.test.tsx next to Button.tsx), and you want all tests to follow the same conventions regardless of location. What's the most maintainable way to ensure Claude automatically applies the correct conventions when generating code?",
    opts: [
      "Create rule files in .claude/rules/ with YAML frontmatter specifying glob patterns to conditionally apply conventions based on file paths",
      "Consolidate all conventions in the root CLAUDE.md file under headers for each area, relying on Claude to infer which section applies",
      "Create skills in .claude/skills/ for each code type that include the relevant conventions in their SKILL.md files",
      "Place a separate CLAUDE.md file in each subdirectory containing that area's specific conventions",
    ],
    correct: 0,
    explanation:
      ".claude/rules/ with glob patterns (e.g., **/*.test.tsx) allows conventions to be automatically applied based on file paths regardless of directory location — essential for test files spread throughout the codebase. Option B relies on inference rather than explicit matching, making it unreliable. Option C requires manual skill invocation, contradicting the need for deterministic automatic application. Option D can't easily handle files spread across many directories since CLAUDE.md files are directory-bound.",
  },
  {
    id: 7,
    scenario: "Multi-Agent Research System",
    scenarioColor: "purple",
    domain: "Agentic Architecture & Orchestration",
    q: "After running the system on the topic 'impact of AI on creative industries,' the final reports cover only visual arts, completely missing music, writing, and film production. The coordinator's logs show it decomposed the topic into three subtasks: 'AI in digital art creation,' 'AI in graphic design,' and 'AI in photography.' What is the most likely root cause?",
    opts: [
      "The synthesis agent lacks instructions for identifying coverage gaps in the findings it receives from other agents",
      "The coordinator agent's task decomposition is too narrow, resulting in subagent assignments that don't cover all relevant domains of the topic",
      "The web search agent's queries are not comprehensive enough and need to be expanded to cover more creative industry sectors",
      "The document analysis agent is filtering out sources related to non-visual creative industries due to overly restrictive relevance criteria",
    ],
    correct: 1,
    explanation:
      "The coordinator's logs reveal the root cause directly: it decomposed 'creative industries' into only visual arts subtasks (digital art, graphic design, photography), completely omitting music, writing, and film. The subagents executed their assigned tasks correctly — the problem is what they were assigned. Options A, C, and D incorrectly blame downstream agents that are working correctly within their assigned scope.",
  },
  {
    id: 8,
    scenario: "Multi-Agent Research System",
    scenarioColor: "purple",
    domain: "Context Management & Reliability",
    q: "The web search subagent times out while researching a complex topic. You need to design how this failure information flows back to the coordinator agent. Which error propagation approach best enables intelligent recovery?",
    opts: [
      "Return structured error context to the coordinator including the failure type, the attempted query, any partial results, and potential alternative approaches",
      "Implement automatic retry logic with exponential backoff within the subagent, returning a generic 'search unavailable' status only after all retries are exhausted",
      "Catch the timeout within the subagent and return an empty result set marked as successful",
      "Propagate the timeout exception directly to a top-level handler that terminates the entire research workflow",
    ],
    correct: 0,
    explanation:
      "Structured error context gives the coordinator the information it needs to make intelligent recovery decisions — whether to retry with a modified query, try an alternative approach, or proceed with partial results. Option B's generic status hides valuable context from the coordinator, preventing informed decisions. Option C suppresses the error by marking failure as success, which prevents any recovery and risks incomplete research outputs. Option D terminates the entire workflow unnecessarily when recovery strategies could succeed.",
  },
  {
    id: 9,
    scenario: "Multi-Agent Research System",
    scenarioColor: "purple",
    domain: "Tool Design & MCP Integration",
    q: "The synthesis agent frequently needs to verify specific claims while combining findings. Currently, verification requires 2–3 round trips through the coordinator to the web search agent, increasing latency by 40%. Evaluation shows 85% of verifications are simple fact-checks (dates, names, statistics) while 15% require deeper investigation. What's the most effective approach to reduce overhead while maintaining system reliability?",
    opts: [
      "Give the synthesis agent a scoped verify_fact tool for simple lookups, while complex verifications continue delegating to the web search agent through the coordinator",
      "Have the synthesis agent accumulate all verification needs and return them as a batch to the coordinator at the end of its pass",
      "Give the synthesis agent access to all web search tools so it can handle any verification need directly without round-trips through the coordinator",
      "Have the web search agent proactively cache extra context around each source during initial research, anticipating what the synthesis agent might need to verify",
    ],
    correct: 0,
    explanation:
      "Option A applies the principle of least privilege by giving the synthesis agent only what it needs for the 85% common case (simple fact verification) while preserving the existing coordination pattern for complex cases. Option B's batching approach creates blocking dependencies since synthesis steps may depend on earlier verified facts. Option C over-provisions the synthesis agent, violating separation of concerns. Option D relies on speculative caching that cannot reliably predict what the synthesis agent will need to verify.",
  },
  {
    id: 10,
    scenario: "Claude Code for Continuous Integration",
    scenarioColor: "orange",
    domain: "Claude Code Configuration & Workflows",
    q: 'Your pipeline script runs claude "Analyze this pull request for security issues" but the job hangs indefinitely. Logs indicate Claude Code is waiting for interactive input. What\'s the correct approach to run Claude Code in an automated pipeline?',
    opts: [
      'Add the -p flag: claude -p "Analyze this pull request for security issues"',
      "Set the environment variable CLAUDE_HEADLESS=true before running the command",
      'Redirect stdin from /dev/null: claude "Analyze this pull request for security issues" < /dev/null',
      '--Add the --batch flag: claude --batch "Analyze this pull request for security issues"',
    ],
    correct: 0,
    explanation:
      "The -p (or --print) flag is the documented way to run Claude Code in non-interactive mode. It processes the prompt, outputs the result to stdout, and exits without waiting for user input — exactly what CI/CD pipelines require. The other options reference non-existent features (CLAUDE_HEADLESS environment variable, --batch flag) or use Unix workarounds that don't properly address Claude Code's command syntax.",
  },
  {
    id: 11,
    scenario: "Claude Code for Continuous Integration",
    scenarioColor: "orange",
    domain: "Prompt Engineering & Structured Output",
    q: "Your team has two workflows: (1) a blocking pre-merge check that must complete before developers can merge, and (2) a technical debt report generated overnight for review the next morning. Your manager proposes switching both to the Message Batches API for its 50% cost savings. How should you evaluate this proposal?",
    opts: [
      "Use batch processing for the technical debt reports only; keep real-time calls for pre-merge checks",
      "Switch both workflows to batch processing with status polling to check for completion",
      "Keep real-time calls for both workflows to avoid batch result ordering issues",
      "Switch both to batch processing with a timeout fallback to real-time if batches take too long",
    ],
    correct: 0,
    explanation:
      "The Message Batches API offers 50% cost savings but has processing times up to 24 hours with no guaranteed latency SLA. This makes it unsuitable for blocking pre-merge checks where developers wait for results, but ideal for overnight batch jobs like technical debt reports. Option B is wrong because relying on 'often faster' completion isn't acceptable for blocking workflows. Option C reflects a misconception — batch results can be correlated using custom_id fields. Option D adds unnecessary complexity when the simpler solution is matching each API to its appropriate use case.",
  },
  {
    id: 12,
    scenario: "Claude Code for Continuous Integration",
    scenarioColor: "orange",
    domain: "Prompt Engineering & Structured Output",
    q: "A pull request modifies 14 files across the stock tracking module. Your single-pass review produces inconsistent results: detailed feedback for some files but superficial comments for others, obvious bugs missed, and contradictory feedback — flagging a pattern as problematic in one file while approving identical code elsewhere. How should you restructure the review?",
    opts: [
      "Split into focused passes: analyze each file individually for local issues, then run a separate integration-focused pass examining cross-file data flow",
      "Require developers to split large PRs into smaller submissions of 3–4 files before the automated review runs",
      "Switch to a higher-tier model with a larger context window to give all 14 files adequate attention in one pass",
      "Run three independent review passes on the full PR and only flag issues that appear in at least two of the three runs",
    ],
    correct: 0,
    explanation:
      "Splitting reviews into focused passes directly addresses the root cause: attention dilution when processing many files at once. File-by-file analysis ensures consistent depth, while a separate integration pass catches cross-file issues. Option B shifts burden to developers without improving the system. Option C misunderstands that larger context windows don't solve attention quality issues. Option D would suppress detection of real bugs by requiring consensus on issues that may only be caught intermittently.",
  },
  {
    id: 13,
    scenario: "Claude Code for Continuous Integration",
    scenarioColor: "orange",
    domain: "Prompt Engineering & Structured Output",
    q: "Your automated reviews identify valid issues but developers report the feedback isn't actionable. Findings say things like 'complex ticket allocation logic' or 'potential null pointer' without specifying what to change. When you add detailed instructions like 'always include specific fix suggestions,' the model still produces inconsistent output — sometimes detailed, sometimes vague. What prompting technique would most reliably produce consistently actionable feedback?",
    opts: [
      "Expand the context window to include more of the surrounding codebase so the model has sufficient information to suggest specific fixes",
      "Implement a two-pass approach where one prompt identifies issues and a second prompt generates fixes, allowing specialization",
      "Add 3–4 few-shot examples showing the exact format you want: issue identified, code location, specific fix suggestion",
      "Further refine the instructions with more explicit requirements for each part of the feedback format (location, issue, severity, suggested fix)",
    ],
    correct: 2,
    explanation:
      "Few-shot examples are the most effective technique when detailed instructions alone produce inconsistent results. By showing exactly what 'actionable feedback' looks like — issue + location + specific fix — you give the model a concrete template to follow, not just a description to interpret. Option A (more context) doesn't fix the output format problem. Option B (two-pass) is over-engineered for a formatting issue. Option D is the approach that's already been tried and failed — more instructions didn't help.",
  },
  {
    id: 14,
    scenario: "Structured Data Extraction",
    scenarioColor: "pink",
    domain: "Prompt Engineering & Structured Output",
    q: "Your extraction system needs to reliably produce structured output from invoices and contracts. You've tried asking Claude to return JSON in the system prompt, but the model sometimes returns markdown-formatted JSON, sometimes plain JSON, and occasionally adds explanatory text before the JSON block. What's the most reliable approach to guarantee schema-compliant structured output?",
    opts: [
      "Add 'Return ONLY raw JSON, no markdown formatting or explanation' to your system prompt and use output parsing with retry on failure",
      "Use tool_use with a JSON schema defining your extraction fields and extract the structured data from the tool_use response",
      "Implement a post-processing step that uses regex to strip markdown formatting and extract the JSON from Claude's response",
      "Ask Claude to wrap output in XML tags like <json> and parse the content between those tags",
    ],
    correct: 1,
    explanation:
      "Tool use with JSON schemas is the most reliable approach for guaranteed schema-compliant structured output, eliminating JSON syntax errors entirely. The model's tool_use response is structurally guaranteed to match the schema. Option A relies on prompt instructions which have a non-zero failure rate. Option C adds fragile post-processing that can fail on edge cases. Option D uses a custom wrapper that doesn't enforce schema compliance and still requires parsing.",
  },
  {
    id: 15,
    scenario: "Structured Data Extraction",
    scenarioColor: "pink",
    domain: "Prompt Engineering & Structured Output",
    q: "Your invoice extraction tool has required fields for vendor_name, invoice_number, and total_amount, but some invoices are missing these fields. The model is fabricating plausible-looking values rather than returning null. How should you fix this?",
    opts: [
      "Add explicit instructions to the system prompt: 'If a field is not present in the document, return null for that field'",
      "Make the fields optional (nullable) in your JSON schema so the model understands these fields may legitimately be absent",
      "Add few-shot examples showing correct extraction from invoices where some fields are missing, demonstrating null returns",
      "Switch to a two-step approach: first classify whether each field is present, then extract only the fields confirmed as present",
    ],
    correct: 1,
    explanation:
      "Designing schema fields as optional (nullable) is the correct fix because it communicates through the schema itself — the authoritative source of truth — that these fields may legitimately be absent. When required fields exist in the schema, the model feels compelled to satisfy them. Option A (system prompt instructions) is better than nothing but less reliable than schema design. Option C (few-shot examples) helps but doesn't address the root schema constraint. Option D over-engineers a solution when a simple schema change suffices.",
  },
];

export const DOMAIN_WEIGHTS: Record<Domain, number> = {
  "Agentic Architecture & Orchestration": 27,
  "Tool Design & MCP Integration": 18,
  "Claude Code Configuration & Workflows": 20,
  "Prompt Engineering & Structured Output": 20,
  "Context Management & Reliability": 15,
};

export const DOMAIN_COLORS: Record<Domain, string> = {
  "Agentic Architecture & Orchestration": "#7F77DD",
  "Tool Design & MCP Integration": "#1D9E75",
  "Claude Code Configuration & Workflows": "#BA7517",
  "Prompt Engineering & Structured Output": "#D4537E",
  "Context Management & Reliability": "#378ADD",
};
