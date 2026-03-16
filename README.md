# Claude Architect Prep

Practice exam for the **Claude Certified Architect — Foundations** certification.

Scenario-based questions across all 5 domains, with explanations shown after each answer (practice mode).

## Quickstart — GitHub → Vercel

### 1. Create the GitHub repo

```bash
cd claude-cert-prep
git init
git add .
git commit -m "feat: initial exam app"
# create repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/claude-cert-prep.git
git push -u origin main
```

### 2. Deploy to Vercel (free)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import** next to your `claude-cert-prep` repo
3. Vercel auto-detects Next.js — no config needed
4. Click **Deploy**

Every push to `main` triggers a new deploy automatically.

### 3. Run locally

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Exam domains covered

| Domain | Weight |
|--------|--------|
| Agentic Architecture & Orchestration | 27% |
| Tool Design & MCP Integration | 18% |
| Claude Code Configuration & Workflows | 20% |
| Prompt Engineering & Structured Output | 20% |
| Context Management & Reliability | 15% |

## Expanding the question bank

All questions live in `src/data/questions.ts`. Add a new entry following the `Question` interface — the exam engine picks it up automatically. No other files need to change.

```ts
{
  id: 16,
  scenario: "Customer Support Resolution Agent",
  scenarioColor: "blue",
  domain: "Agentic Architecture & Orchestration",
  q: "Your question text here...",
  opts: ["Option A", "Option B", "Option C", "Option D"],
  correct: 0,          // 0-indexed
  explanation: "Why A is correct...",
}
```

## Tech stack

- **Next.js 16** (App Router)
- **TypeScript**
- **CSS Modules** — zero external UI library
- Mobile-first, dark mode native (system preference)
- GitHub Actions CI — build check on every push
