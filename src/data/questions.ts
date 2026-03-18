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
  "Financial Document Processing Pipeline": {
    color: "blue",
    description:
      "You are building an automated pipeline that processes financial documents — earnings reports, SEC filings, and analyst notes — using Claude. The system extracts structured data, runs validation checks, and feeds downstream analytics. Accuracy and auditability are critical.",
  },
  "Enterprise Knowledge Base Agent": {
    color: "green",
    description:
      "You are building an internal knowledge base agent for a 2,000-person engineering org. The agent answers questions about internal tools, policies, and architecture by searching a private MCP-connected knowledge base. It must cite sources, stay within scope, and gracefully handle gaps.",
  },
  "Automated Code Review Platform": {
    color: "purple",
    description:
      "You are building an automated code review platform that integrates with GitHub. Claude reviews pull requests for security issues, performance problems, and style violations. The system must produce consistent, actionable, low-noise feedback at scale.",
  },
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
  // ── Financial Document Processing Pipeline ──────────────────────────────
  {
    id: 16,
    scenario: "Financial Document Processing Pipeline",
    scenarioColor: "blue",
    domain: "Prompt Engineering & Structured Output",
    q: "Your pipeline extracts 12 fields from earnings reports. For common fields like revenue and EPS it achieves 98% accuracy, but for complex derived fields like 'adjusted EBITDA excluding one-time charges' it drops to 71%. Adding more extraction instructions hasn't helped. What is the most effective way to improve accuracy on these complex fields?",
    opts: [
      "Switch to a two-step approach: first extract the raw financial data verbatim, then run a separate prompt to apply the transformation logic to derive the complex fields",
      "Add more detailed definitions of each complex field to the system prompt, with examples of how they differ from standard GAAP metrics",
      "Increase temperature to allow the model more flexibility in interpreting ambiguous financial terminology",
      "Use a larger model for the full extraction pass so it has more capacity to handle both simple and complex fields simultaneously",
    ],
    correct: 0,
    explanation:
      "Separating extraction from transformation is the right architectural move. The first step captures raw numbers faithfully; the second step applies well-defined calculation logic to derive complex fields. This isolates two different failure modes. Option B has already been tried and failed. Option C is counterproductive — temperature increases randomness, which hurts precision tasks. Option D may marginally help but doesn't address the root cause: conflating extraction and transformation in a single pass.",
  },
  {
    id: 17,
    scenario: "Financial Document Processing Pipeline",
    scenarioColor: "blue",
    domain: "Context Management & Reliability",
    q: "Your pipeline processes 200-page SEC filings. The full document exceeds Claude's context window. You're seeing cases where data extracted from page 180 contradicts page 12, and the model resolves the conflict by favoring whichever chunk was processed last. What architecture best handles long financial documents reliably?",
    opts: [
      "Chunk documents by section (MD&A, financial statements, footnotes) and process each chunk independently, then run a reconciliation pass over all extracted values to resolve conflicts deterministically",
      "Summarize the full document first to fit within context, then extract from the summary",
      "Process the full document in a single pass using the largest available context window model",
      "Extract only from the first 50 pages since financial highlights are typically front-loaded in SEC filings",
    ],
    correct: 0,
    explanation:
      "Chunking by semantic section + a reconciliation pass is the correct pattern for long documents. Each section is extracted with full attention, and conflicts are resolved explicitly by business logic (e.g., audited statements take precedence over MD&A prose). Option B loses precision — summaries compress exactly the detail you need to extract. Option C still hits context limits for very long filings and doesn't solve the conflict resolution problem. Option D misses critical data in footnotes and financial statements that are often in the latter half.",
  },
  {
    id: 18,
    scenario: "Financial Document Processing Pipeline",
    scenarioColor: "blue",
    domain: "Tool Design & MCP Integration",
    q: "Your MCP tool validate_financial_data takes extracted fields and checks them against regulatory constraints. Currently it returns a boolean pass/fail. Downstream, the agent needs to decide whether to auto-approve, flag for human review, or reject entirely — but with only a boolean result it always routes to human review on failure. What change to the tool output would most improve autonomous decision-making?",
    opts: [
      "Return a structured result with: validation_status (pass/warn/fail), a list of specific failed checks with severity levels, and suggested remediation for each failure",
      "Return a numeric confidence score (0–100) representing overall data quality",
      "Return a list of failed field names so the agent knows which fields to re-extract",
      "Return a human-readable summary paragraph describing what failed and why",
    ],
    correct: 0,
    explanation:
      "Structured output with severity levels gives the agent the context it needs to make nuanced routing decisions — warn-level issues can auto-approve with a flag, fail-level issues route to humans, and critical failures reject outright. Option B's single score loses the specificity needed for action. Option C tells the agent what failed but not how serious it is. Option D is unstructured text that the agent must parse, introducing fragility in a reliability-critical pipeline.",
  },
  {
    id: 19,
    scenario: "Financial Document Processing Pipeline",
    scenarioColor: "blue",
    domain: "Agentic Architecture & Orchestration",
    q: "Your pipeline runs 500 document extractions per day. Each extraction calls Claude 3 times (extract, validate, summarize). Costs are 3x your budget. You need to cut costs while maintaining accuracy on the extraction step, which is the most critical. What is the best cost optimization strategy?",
    opts: [
      "Use a smaller, faster model for the validate and summarize steps while keeping the most capable model only for the extraction step",
      "Switch all three steps to the smallest available model and add a human spot-check on 10% of outputs",
      "Batch all 500 daily documents and run them overnight using the Message Batches API for 50% cost savings across all steps",
      "Cache extraction results for 30 days so identical documents don't need re-processing",
    ],
    correct: 0,
    explanation:
      "Routing by task complexity is the most targeted approach. Validation (checking constraints) and summarization (templated output) are well-suited for smaller models. Extraction of nuanced financial fields genuinely needs the best model. Option B sacrifices accuracy on the most critical step. Option C's 50% batch discount helps but doesn't address the fundamental over-spend on low-complexity tasks. Option D helps for duplicates but SEC filings are unique documents — cache hit rate would be near zero.",
  },

  // ── Enterprise Knowledge Base Agent ─────────────────────────────────────
  {
    id: 20,
    scenario: "Enterprise Knowledge Base Agent",
    scenarioColor: "green",
    domain: "Tool Design & MCP Integration",
    q: "Your knowledge base MCP tool search_docs returns the top 10 results by vector similarity. Engineers report the agent frequently returns confident answers that are outdated — the content exists in the index but was superseded by newer documents. What is the most effective fix?",
    opts: [
      "Add last_modified date and a superseded_by field to each document's metadata, and update the tool description to instruct the agent to prefer recent documents and check for supersession",
      "Reduce the number of results returned from 10 to 3, forcing the model to use only the highest-confidence matches",
      "Add a recency bias to the vector similarity score so newer documents rank higher regardless of semantic match",
      "Implement a post-retrieval reranker that scores results by both semantic relevance and recency before returning them to the agent",
    ],
    correct: 3,
    explanation:
      "A post-retrieval reranker that combines semantic relevance and recency is the most robust solution. It keeps retrieval broad (catching all candidates) while ensuring the agent sees the best candidates ranked first. Option A helps but relies on the agent reliably reading and applying metadata — LLMs don't always follow such instructions consistently. Option B reduces coverage and may miss the correct answer. Option C blindly boosts new docs even when an older document is the authoritative source.",
  },
  {
    id: 21,
    scenario: "Enterprise Knowledge Base Agent",
    scenarioColor: "green",
    domain: "Agentic Architecture & Orchestration",
    q: "The agent handles 300 queries per day. Analysis shows 60% are simple factual lookups (single doc retrieval), 30% require synthesizing across 3–5 documents, and 10% are complex research questions requiring 10+ document reads and multi-step reasoning. All queries currently use the same single-agent architecture. What change gives the best cost/quality tradeoff?",
    opts: [
      "Route queries through a lightweight classifier first, then handle simple lookups with a fast small model, medium queries with a mid-tier model, and complex research queries with the most capable model",
      "Always use the most capable model to guarantee quality across all query types",
      "Use a small model for all queries and escalate to a human expert when confidence is low",
      "Limit the agent to simple and medium queries only; reject complex research questions with a suggestion to contact a human expert",
    ],
    correct: 0,
    explanation:
      "Tiered routing by complexity is the optimal cost/quality pattern. A fast classifier adds minimal cost, and matching model capability to task complexity avoids paying top-tier prices for simple lookups that a small model handles perfectly. Option B maximizes quality but wastes cost on 60% of queries. Option C trades quality for cost in a way that hurts the 30% of medium queries unnecessarily. Option D eliminates value for the highest-value queries the system is uniquely suited to answer.",
  },
  {
    id: 22,
    scenario: "Enterprise Knowledge Base Agent",
    scenarioColor: "green",
    domain: "Claude Code Configuration & Workflows",
    q: "Your team uses Claude Code to build and iterate on the knowledge base agent. Different team members keep overriding each other's CLAUDE.md conventions — one engineer prefers TypeScript strict mode, another disables it. How should you enforce shared conventions across the team?",
    opts: [
      "Commit a project-level CLAUDE.md to the repo root with the team's agreed conventions, and treat it like any other shared config file — changes require PR review",
      "Have each engineer maintain their own ~/.claude/CLAUDE.md with personal preferences and avoid a shared project CLAUDE.md",
      "Use Claude Code's settings.json to lock specific conventions so they cannot be overridden by individual CLAUDE.md files",
      "Document conventions in the README and rely on code review to catch deviations",
    ],
    correct: 0,
    explanation:
      "A version-controlled project CLAUDE.md with a PR review process is the correct pattern. It gives Claude Code shared context for all team members while keeping changes auditable and deliberate — the same governance you'd apply to ESLint config or tsconfig. Option B creates divergent contexts per engineer, defeating the purpose. Option C misrepresents how settings.json works — it configures Claude Code behavior, not code conventions. Option D is advisory only and doesn't surface deviations until after code is written.",
  },
  {
    id: 23,
    scenario: "Enterprise Knowledge Base Agent",
    scenarioColor: "green",
    domain: "Context Management & Reliability",
    q: "The agent's conversation history grows long over multi-turn sessions. After 15+ turns, you observe it losing track of constraints stated at the start (e.g., 'only reference documents from the security team'). What is the most reliable way to preserve critical constraints across long conversations?",
    opts: [
      "Re-inject critical constraints into the system prompt on every turn rather than relying on them persisting in conversation history",
      "Summarize the conversation history periodically and replace old turns with the summary to free up context space",
      "Instruct the agent to repeat the active constraints back to the user at the start of each response",
      "Limit conversations to 10 turns maximum and prompt the user to start a new session",
    ],
    correct: 0,
    explanation:
      "Constraints in the system prompt are refreshed on every turn by design — they're the most reliable location for invariant rules. Conversation history is subject to attention degradation at long contexts. Option B helps with context length but risks losing constraint details in the summary. Option C adds noise to responses and doesn't fix the underlying reliability issue. Option D is an artificial limit that degrades UX and doesn't address the root cause.",
  },

  // ── Automated Code Review Platform ──────────────────────────────────────
  {
    id: 24,
    scenario: "Automated Code Review Platform",
    scenarioColor: "purple",
    domain: "Prompt Engineering & Structured Output",
    q: "Your code review system produces findings in free-text paragraphs. Engineers report they can't quickly scan for severity or find actionable items. You want structured output with: severity (critical/major/minor), file path, line range, issue description, and suggested fix. What is the most reliable way to enforce this structure?",
    opts: [
      "Define a tool with a JSON schema matching the desired structure and have the model call that tool to report each finding",
      "Add a strict output format specification to the system prompt with a markdown template for each finding",
      "Parse the free-text output with a regex post-processor that extracts the relevant fields",
      "Fine-tune the model on examples of correctly formatted review outputs",
    ],
    correct: 0,
    explanation:
      "Tool use with a JSON schema is the most reliable mechanism for structured output — the model's tool_use response is schema-validated by the API, eliminating format drift. Each finding becomes a tool call with guaranteed field presence and types. Option B relies on prompt instructions which have non-zero failure rates, especially for long outputs with many findings. Option C creates brittle parsing that breaks on format variations. Option D requires labeled data, compute infrastructure, and ongoing maintenance.",
  },
  {
    id: 25,
    scenario: "Automated Code Review Platform",
    scenarioColor: "purple",
    domain: "Agentic Architecture & Orchestration",
    q: "Your review platform runs on PRs with 1–200 changed files. Small PRs (1–5 files) get excellent reviews. Large PRs (50+ files) get shallow, inconsistent reviews — some files get detailed feedback, others are skipped entirely. What architectural change best addresses this?",
    opts: [
      "Split large PRs into logical file groups (by module/directory), review each group independently, then merge findings with a deduplication pass",
      "Set a hard limit of 20 files per PR and reject larger PRs with a message asking developers to split them",
      "Use a larger context window model for PRs above a file threshold to process everything in one pass",
      "Run three independent review passes on the full PR and surface only findings that appear in at least two passes",
    ],
    correct: 0,
    explanation:
      "Grouping by module and reviewing each group independently gives each file dedicated attention proportional to its complexity. The deduplication pass handles cross-file issues. Option B shifts burden to developers and creates friction without improving the system. Option C helps at the margins but doesn't solve attention dilution — a 200-file review in a single pass will still be shallow for most files regardless of context size. Option D's consensus approach suppresses bugs that might only be caught in one pass.",
  },
  {
    id: 26,
    scenario: "Automated Code Review Platform",
    scenarioColor: "purple",
    domain: "Tool Design & MCP Integration",
    q: "You want to give the review agent access to your internal style guide and security policies via MCP. The documents total 400KB. Every review currently injects the full documents into the prompt, consuming 35% of the context window. What is the best way to reduce context usage while preserving review quality?",
    opts: [
      "Create a search_guidelines MCP tool that retrieves only the relevant guideline sections based on the file type and detected issue category",
      "Compress the style guide to a 2-page summary and use that instead of the full documents",
      "Cache the guidelines in the system prompt so they're not counted against the per-request context limit",
      "Remove the style guide from context entirely and rely on Claude's training knowledge of common style conventions",
    ],
    correct: 0,
    explanation:
      "A retrieval tool that fetches only relevant sections (e.g., Python style rules when reviewing a .py file) dramatically reduces context usage while maintaining precision. The agent retrieves exactly what it needs per review. Option B loses the specific rules that make reviews accurate — a summary can't substitute for the actual constraints. Option C misunderstands how context works; system prompt tokens are counted the same as other tokens. Option D removes the org-specific rules that make the review valuable in the first place.",
  },
  {
    id: 27,
    scenario: "Automated Code Review Platform",
    scenarioColor: "purple",
    domain: "Context Management & Reliability",
    q: "Your platform reviews 1,000 PRs per day. Occasionally (about 2% of cases), the review agent enters a loop: it calls a tool, gets an error, calls the same tool again with identical parameters, gets the same error, and repeats until it hits the turn limit. What is the most effective way to prevent this?",
    opts: [
      "Track tool call history within each agent run and add a programmatic check that terminates the run with a structured error if the same tool is called with the same parameters more than twice",
      "Increase the turn limit so the agent has more attempts to recover from transient errors",
      "Add retry logic with exponential backoff directly inside the tool implementation",
      "Add a system prompt instruction: 'If a tool call fails twice with the same error, stop and report the failure'",
    ],
    correct: 0,
    explanation:
      "Programmatic loop detection at the orchestration layer is deterministic and doesn't rely on the model following instructions. Tracking call history and enforcing a hard stop guarantees the loop can't continue past a defined threshold. Option B makes the problem worse by allowing more looping iterations. Option C addresses transient network errors but not the case where the model keeps retrying a semantically wrong call. Option D is prompt-based and non-deterministic — the model that's already looping is unlikely to reliably follow this instruction.",
  },

  // ── Additional cross-domain questions ────────────────────────────────────
  {
    id: 28,
    scenario: "Multi-Agent Research System",
    scenarioColor: "purple",
    domain: "Agentic Architecture & Orchestration",
    q: "Your coordinator agent needs to decide whether to run subagents in parallel or sequentially. For a report on 'competitive landscape of EV battery manufacturers,' it currently runs all 6 subagents in parallel. The synthesis agent then receives contradictory information because each subagent made different assumptions about the scope. What change best addresses this?",
    opts: [
      "Add a planning step where the coordinator generates a shared research brief — including scope, definitions, and time bounds — before dispatching subagents, so all agents operate under the same assumptions",
      "Run subagents sequentially so each can read the previous agent's output before starting",
      "Add a conflict-resolution prompt to the synthesis agent instructing it to identify and resolve contradictions",
      "Limit the number of parallel subagents to 3 to reduce the chance of contradictory assumptions",
    ],
    correct: 0,
    explanation:
      "A shared research brief eliminates assumption divergence at the source — all subagents operate from the same scope and definitions, so their outputs are compatible before synthesis. Option B sacrifices the latency benefits of parallelism without fully solving the problem (sequential agents can still make different assumptions if the brief isn't explicit). Option C pushes the problem downstream to synthesis, which can't reliably resolve contradictions it has no ground truth for. Option D reduces parallelism without fixing the root cause.",
  },
  {
    id: 29,
    scenario: "Customer Support Resolution Agent",
    scenarioColor: "blue",
    domain: "Tool Design & MCP Integration",
    q: "Your process_refund MCP tool currently takes refund_amount as a float. In production, the agent occasionally passes amounts like 149.999999 (floating-point imprecision) instead of 150.00, causing downstream payment processing errors. What is the best fix?",
    opts: [
      "Change the tool to accept refund_amount as a string and perform parsing and rounding to 2 decimal places inside the tool implementation before passing to the payment system",
      "Add a system prompt instruction telling the agent to always round monetary values to 2 decimal places before calling process_refund",
      "Add input validation in the tool that rejects amounts with more than 2 decimal places and returns an error for the agent to retry",
      "Switch refund_amount to an integer representing cents to avoid floating-point issues entirely",
    ],
    correct: 3,
    explanation:
      "Using integers (cents) is the standard practice for monetary values in payment systems — it eliminates floating-point imprecision by design. 15000 cents is unambiguously $150.00. Option A moves the problem to string parsing which introduces its own edge cases. Option B relies on prompt instructions for a numerical precision problem — non-deterministic and inappropriate. Option C causes unnecessary retry loops instead of preventing the issue.",
  },
  {
    id: 30,
    scenario: "Code Generation with Claude Code",
    scenarioColor: "green",
    domain: "Claude Code Configuration & Workflows",
    q: "A junior engineer on your team is using Claude Code for the first time. They run a task in direct execution mode that deletes 200 test fixture files, believing them to be generated artifacts. They were hand-crafted. How should you configure Claude Code to prevent this class of mistake for less experienced users?",
    opts: [
      "Set allowedTools in the project's settings.json to exclude destructive bash commands, and configure Claude Code to require explicit confirmation before any file deletion",
      "Restrict junior engineers from using Claude Code until they complete an internal training course",
      "Add a CLAUDE.md instruction: 'Never delete files without asking the user for confirmation first'",
      "Enable plan mode by default so all tasks require an approval step before execution",
    ],
    correct: 0,
    explanation:
      "allowedTools in settings.json provides deterministic, enforceable guardrails at the tool level — destructive operations can be blocked or require confirmation regardless of how the task is phrased. Option B is a process solution, not a technical one, and doesn't protect against mistakes during legitimate use. Option C relies on prompt instructions which are probabilistic — Claude may still proceed if the instruction is ambiguous. Option D adds friction for all tasks, including safe ones, and still allows deletion after the plan is approved.",
  },
  {
    id: 31,
    scenario: "Structured Data Extraction",
    scenarioColor: "pink",
    domain: "Prompt Engineering & Structured Output",
    q: "Your extraction system processes contracts in English, French, and German. English extractions achieve 96% accuracy, but French and German are at 78%. The prompts and schema are identical across all languages. What is the most effective first step to close this gap?",
    opts: [
      "Add 3–5 few-shot examples in each target language showing correct extraction from documents similar to your actual contracts",
      "Translate all incoming documents to English before extraction, then translate extracted values back to the original language",
      "Switch to a multilingual embedding model for the retrieval step to improve document chunking quality",
      "Add explicit language detection to the system prompt and include language-specific extraction notes for French and German",
    ],
    correct: 0,
    explanation:
      "Few-shot examples in the target language are the highest-leverage first step. They give the model concrete patterns for the language and domain-specific terminology used in French and German contracts, directly addressing the performance gap. Option B works but introduces translation errors on legal terminology and adds latency. Option C addresses retrieval, not the extraction accuracy problem. Option D may help marginally but language-specific notes are less effective than concrete examples.",
  },
  {
    id: 32,
    scenario: "Structured Data Extraction",
    scenarioColor: "pink",
    domain: "Context Management & Reliability",
    q: "Your extraction pipeline processes 10,000 documents per day. You notice that for documents with ambiguous data (e.g., two different effective dates in the same contract), the model silently picks one without flagging the ambiguity. Downstream systems treat all extracted data as high-confidence. What is the best way to surface ambiguity explicitly?",
    opts: [
      "Extend the output schema to include a confidence field (high/medium/low) and an ambiguity_notes string for each extracted field, and instruct the model to populate these when multiple valid interpretations exist",
      "Add a post-processing step that runs a second extraction pass and flags fields where the two passes disagree",
      "Route all documents with more than 5 pages to human review, since longer documents are more likely to contain ambiguities",
      "Increase the extraction prompt's specificity with rules for resolving each known type of ambiguity",
    ],
    correct: 0,
    explanation:
      "Extending the schema to capture confidence and ambiguity notes makes uncertainty a first-class output. Downstream systems can then make informed decisions about which fields to auto-process vs. route for human review. Option B is a useful validation technique but adds latency and cost, and two passes disagreeing only catches some ambiguities. Option C uses document length as a proxy for ambiguity, which is imprecise. Option D tries to enumerate all ambiguity types upfront, which is impossible for novel document variations.",
  },
  {
    id: 33,
    scenario: "Claude Code for Continuous Integration",
    scenarioColor: "orange",
    domain: "Agentic Architecture & Orchestration",
    q: "Your CI pipeline uses Claude Code to auto-fix lint errors after each commit. On a branch with 47 accumulated lint errors, Claude Code enters a cycle: fixes some errors, introduces new ones during fixes, then tries to fix the new ones. The pipeline never converges. What is the best fix?",
    opts: [
      "Run Claude Code in a single focused pass with a hard limit on the number of fix attempts, and fail the pipeline cleanly if lint errors remain rather than looping indefinitely",
      "Increase the retry limit so Claude Code has more attempts to reach a clean state",
      "Run the linter after each individual file fix and stop immediately if new errors are introduced",
      "Switch to a deterministic auto-formatter (e.g., Prettier) for style issues and use Claude Code only for semantic/logic lint violations",
    ],
    correct: 3,
    explanation:
      "Using deterministic formatters for style issues is the right architectural separation. Formatters like Prettier are idempotent and guaranteed to converge — they can't introduce new style errors. Claude Code is then reserved for non-deterministic semantic issues where it genuinely adds value. Option A limits looping but doesn't fix the root cause. Option B makes the problem worse. Option C adds overhead and still doesn't prevent the model from re-introducing errors in subsequent files.",
  },
  {
    id: 34,
    scenario: "Financial Document Processing Pipeline",
    scenarioColor: "blue",
    domain: "Agentic Architecture & Orchestration",
    q: "Your pipeline must comply with SOC 2 audit requirements. Auditors need a complete log of every AI decision made during document processing — which model was used, what data was passed in, and what was returned. Currently none of this is logged. What is the minimal addition that satisfies audit requirements without redesigning the pipeline?",
    opts: [
      "Add structured logging at each API call boundary: log the model ID, sanitized input (with PII redacted), output, timestamp, and a document trace ID that links all calls for a single document",
      "Store the full raw API request and response for every call in a write-once audit log",
      "Generate a human-readable summary of each document's processing steps and store it alongside the extracted data",
      "Enable Anthropic's usage dashboard and export monthly reports to satisfy auditor requests",
    ],
    correct: 0,
    explanation:
      "Structured logging at API boundaries with PII redaction and trace IDs satisfies audit requirements in a targeted way: it captures what decisions were made, by which model, on what data, and links all calls in a processing chain. Option B stores full payloads which risks logging sensitive financial data in violation of data minimization principles — and is harder to query for audits. Option C is too informal for SOC 2, which requires machine-readable, tamper-evident logs. Option D provides aggregate usage data, not decision-level audit trails.",
  },
  {
    id: 35,
    scenario: "Enterprise Knowledge Base Agent",
    scenarioColor: "green",
    domain: "Prompt Engineering & Structured Output",
    q: "The knowledge base agent is supposed to say 'I don't have information on that' when a topic isn't in the knowledge base. Instead, it frequently answers from training knowledge, sometimes incorrectly, and without citing any sources. The system prompt says 'only answer from the knowledge base.' What is the most reliable fix?",
    opts: [
      "Restructure the agent flow so it must call the search_docs tool before every response, and if the tool returns no results, it returns a fixed 'no information found' response rather than generating freely",
      "Strengthen the system prompt instruction: 'You must ONLY use information retrieved from the knowledge base. Never use your training knowledge.'",
      "Add few-shot examples showing the agent correctly refusing to answer out-of-scope questions",
      "Fine-tune the model on examples of correct in-scope and out-of-scope behavior",
    ],
    correct: 0,
    explanation:
      "Making the tool call mandatory and tying the response path to tool results is a programmatic guarantee — the agent cannot skip retrieval and answer from training knowledge. The 'no results → fixed response' path eliminates the generation decision entirely for out-of-scope queries. Option B has already been tried (system prompt instructions) and fails because the model still falls back to training knowledge probabilistically. Option C helps at the margins but doesn't provide the deterministic guarantee needed. Option D is disproportionate effort when an architectural fix solves it.",
  },
  {
    id: 36,
    scenario: "Automated Code Review Platform",
    scenarioColor: "purple",
    domain: "Claude Code Configuration & Workflows",
    q: "Your team wants Claude Code to automatically run the test suite and check for type errors after every code change it makes, without requiring a developer to manually trigger these checks. How should you configure this?",
    opts: [
      "Define post-edit hooks in settings.json that run npm test and tsc --noEmit automatically after each file edit",
      "Add a CLAUDE.md instruction: 'After every code change, run the test suite and type checker before completing the task'",
      "Create a custom /check slash command that developers invoke after Claude Code finishes making changes",
      "Configure Claude Code to always enter plan mode, where the plan must include a testing step before execution proceeds",
    ],
    correct: 0,
    explanation:
      "Hooks in settings.json are executed by the Claude Code harness automatically — they're not subject to the model deciding whether to run them. This gives you deterministic post-edit validation without relying on the model to follow instructions. Option B is prompt-based and non-deterministic — the model may skip checks if it considers the task complete. Option C requires manual developer action, defeating the purpose of automation. Option D adds plan overhead for every task and still doesn't guarantee tests run after edits.",
  },
  {
    id: 37,
    scenario: "Multi-Agent Research System",
    scenarioColor: "purple",
    domain: "Tool Design & MCP Integration",
    q: "Your MCP server exposes 23 tools to the coordinator agent. Evaluation shows the coordinator frequently selects the wrong tool for the first 3 turns of each session before self-correcting. Token usage is high because of these failed attempts. What is the most effective fix?",
    opts: [
      "Group tools into namespaced categories (search_*, analyze_*, report_*) and expose only the relevant category's tools based on the current phase of the research workflow",
      "Add more detailed descriptions to all 23 tools so the coordinator has better information to choose from",
      "Reduce the total number of tools to 10 by consolidating related functionality into fewer, broader tools",
      "Add few-shot examples to the system prompt showing correct tool selection for common research tasks",
    ],
    correct: 0,
    explanation:
      "Exposing only phase-relevant tools reduces the decision space dramatically. If the coordinator is in the 'search' phase, presenting 5 search tools instead of all 23 makes correct selection far more likely. This is the principle of least privilege applied to tool availability. Option B helps but doesn't reduce cognitive load when choosing from 23 options. Option C forces trade-offs between specificity and broadness that degrade tool usefulness. Option D adds token overhead and helps with known patterns but not novel research tasks.",
  },
  {
    id: 38,
    scenario: "Customer Support Resolution Agent",
    scenarioColor: "blue",
    domain: "Prompt Engineering & Structured Output",
    q: "Your support agent's responses vary significantly in length and tone — sometimes terse, sometimes overly apologetic, sometimes using technical jargon with non-technical customers. You've added tone instructions to the system prompt but variance persists. What technique would most reliably produce consistent response style?",
    opts: [
      "Add 5–6 few-shot examples to the system prompt covering different request types (refund, technical issue, billing) that each demonstrate the exact desired tone, length, and vocabulary level",
      "Specify a target word count range (e.g., '50–100 words') and explicit tone adjectives in the system prompt",
      "Run a second Claude call after each response to score it on tone/length and regenerate if it scores below threshold",
      "Fine-tune a smaller model specifically on your approved historical support responses",
    ],
    correct: 0,
    explanation:
      "Few-shot examples demonstrate style concretely across different request types — they're far more effective than abstract tone descriptions. Seeing 'exactly this response for a refund request' is more actionable for the model than 'be warm and concise.' Option B is already the approach that's failing. Option C adds latency and cost and creates a feedback loop that may not converge quickly. Option D is effective long-term but disproportionate when few-shot examples haven't been tried yet.",
  },
  {
    id: 39,
    scenario: "Code Generation with Claude Code",
    scenarioColor: "green",
    domain: "Agentic Architecture & Orchestration",
    q: "A developer asks Claude Code to 'refactor the authentication module.' Claude Code interprets this as a license to restructure the entire auth system, changes the public API surface, renames exported functions, and breaks 14 downstream consumers. The developer only wanted internal cleanup. What CLAUDE.md configuration would best prevent this scope creep?",
    opts: [
      "Add a project convention: 'Treat all public API surfaces (exported functions, types, and interfaces) as immutable unless the request explicitly says to change them. Ask for confirmation before modifying any public API.'",
      "Require Claude Code to always use plan mode for any refactoring task",
      "Add a convention: 'Always limit changes to the files explicitly mentioned in the request'",
      "Configure allowedTools to exclude file creation so Claude Code can only modify existing files",
    ],
    correct: 0,
    explanation:
      "Defining public API immutability as an explicit convention directly constrains the failure mode: Claude Code renamed exported functions, which are public API. This rule prevents the specific harm with a targeted constraint. Option B adds plan overhead for all refactors but doesn't prevent a well-intentioned plan that still changes public APIs. Option C is too restrictive — refactoring legitimately touches files not mentioned explicitly. Option D prevents new file creation, which is unrelated to the API breakage.",
  },
  {
    id: 40,
    scenario: "Structured Data Extraction",
    scenarioColor: "pink",
    domain: "Tool Design & MCP Integration",
    q: "Your extraction pipeline needs to handle 8 different document types (invoices, contracts, receipts, purchase orders, etc.), each with a different schema. Currently you have one extraction prompt that handles all types. Accuracy is mediocre across all types. What tool design best improves accuracy?",
    opts: [
      "Create a separate extraction tool per document type, each with its own schema and type-specific examples, and use a lightweight classifier to route documents to the correct tool before extraction",
      "Create one universal schema with optional fields for all document types combined, using a single extraction tool",
      "Add document type detection to the existing prompt and conditionally include type-specific instructions within the same prompt",
      "Fine-tune a model on labeled examples from all 8 document types simultaneously",
    ],
    correct: 0,
    explanation:
      "Separate tools per document type with a routing classifier is the cleanest architecture. Each tool has a focused schema and examples, giving the model clear signal about what to extract. The classifier adds minimal overhead and ensures the right tool is selected. Option B's universal schema is ambiguous — the model must infer which optional fields apply, degrading accuracy. Option C keeps the single-prompt approach that's already producing mediocre results. Option D may help long-term but ignores the architectural root cause.",
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
