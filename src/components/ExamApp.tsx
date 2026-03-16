"use client";

import { useState, useCallback } from "react";
import {
  QUESTIONS,
  SCENARIOS,
  DOMAIN_COLORS,
  type Question,
  type Domain,
} from "@/data/questions";
import styles from "./ExamApp.module.css";

type Screen = "intro" | "scenario" | "question" | "results";
type FilterMode = "all" | Domain;

interface Answer {
  questionId: number;
  selected: number;
  correct: boolean;
}

interface ExamState {
  screen: Screen;
  filterMode: FilterMode;
  questions: Question[];
  currentIndex: number;
  selected: number | null;
  submitted: boolean;
  answers: Answer[];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const DOMAIN_FILTERS: { label: string; value: FilterMode }[] = [
  { label: "All domains", value: "all" },
  { label: "Agentic", value: "Agentic Architecture & Orchestration" },
  { label: "Tool Design", value: "Tool Design & MCP Integration" },
  { label: "Claude Code", value: "Claude Code Configuration & Workflows" },
  { label: "Prompt Eng.", value: "Prompt Engineering & Structured Output" },
  { label: "Context & Reliability", value: "Context Management & Reliability" },
];

const SCENARIO_COLORS: Record<string, string> = {
  blue: "var(--blue)",
  green: "var(--green)",
  purple: "var(--purple)",
  orange: "var(--orange)",
  pink: "var(--pink)",
};

const SCENARIO_BG: Record<string, string> = {
  blue: "var(--blue-bg)",
  green: "var(--green-bg)",
  purple: "var(--purple-bg)",
  orange: "var(--orange-bg)",
  pink: "var(--pink-bg)",
};

const SCENARIO_TEXT: Record<string, string> = {
  blue: "var(--blue-text)",
  green: "var(--green-text)",
  purple: "var(--purple-text)",
  orange: "var(--orange-text)",
  pink: "var(--pink-text)",
};

export default function ExamApp() {
  const [state, setState] = useState<ExamState>({
    screen: "intro",
    filterMode: "all",
    questions: [],
    currentIndex: 0,
    selected: null,
    submitted: false,
    answers: [],
  });

  const startExam = useCallback((mode: FilterMode) => {
    const pool =
      mode === "all"
        ? QUESTIONS
        : QUESTIONS.filter((q) => q.domain === mode);
    setState({
      screen: "scenario",
      filterMode: mode,
      questions: shuffle(pool),
      currentIndex: 0,
      selected: null,
      submitted: false,
      answers: [],
    });
  }, []);

  const beginSection = useCallback(() => {
    setState((s) => ({ ...s, screen: "question" }));
  }, []);

  const selectOption = useCallback(
    (i: number) => {
      if (state.submitted) return;
      setState((s) => ({ ...s, selected: i }));
    },
    [state.submitted]
  );

  const submitAnswer = useCallback(() => {
    if (state.selected === null) return;
    const q = state.questions[state.currentIndex];
    const correct = state.selected === q.correct;
    setState((s) => ({
      ...s,
      submitted: true,
      answers: [
        ...s.answers,
        { questionId: q.id, selected: s.selected!, correct },
      ],
    }));
  }, [state.selected, state.questions, state.currentIndex]);

  const nextQuestion = useCallback(() => {
    const next = state.currentIndex + 1;
    if (next >= state.questions.length) {
      setState((s) => ({ ...s, screen: "results" }));
      return;
    }
    const prevScenario = state.questions[state.currentIndex].scenario;
    const nextScenario = state.questions[next].scenario;
    setState((s) => ({
      ...s,
      currentIndex: next,
      selected: null,
      submitted: false,
      screen: prevScenario !== nextScenario ? "scenario" : "question",
    }));
  }, [state.currentIndex, state.questions]);

  const reset = useCallback(() => {
    setState((s) => ({
      ...s,
      screen: "intro",
      questions: [],
      currentIndex: 0,
      selected: null,
      submitted: false,
      answers: [],
    }));
  }, []);

  const currentQ = state.questions[state.currentIndex];
  const correctCount = state.answers.filter((a) => a.correct).length;
  const totalQ = state.questions.length;

  if (state.screen === "intro") {
    return <IntroScreen onStart={startExam} />;
  }

  return (
    <div className={styles.shell}>
      {/* Top bar */}
      <header className={styles.topbar}>
        <button className={styles.logoBtn} onClick={reset}>
          <span className={styles.logoMark}>A</span>
          <span className={styles.logoText}>Architect Prep</span>
        </button>
        {state.screen !== "results" && (
          <div className={styles.scoreChip}>
            {correctCount} / {totalQ}
          </div>
        )}
      </header>

      <main className={styles.main}>
        {state.screen === "scenario" && currentQ && (
          <ScenarioScreen q={currentQ} idx={state.currentIndex} total={totalQ} onBegin={beginSection} />
        )}
        {state.screen === "question" && currentQ && (
          <QuestionScreen
            q={currentQ}
            idx={state.currentIndex}
            total={totalQ}
            selected={state.selected}
            submitted={state.submitted}
            onSelect={selectOption}
            onSubmit={submitAnswer}
            onNext={nextQuestion}
          />
        )}
        {state.screen === "results" && (
          <ResultsScreen
            questions={state.questions}
            answers={state.answers}
            onRetake={() => startExam(state.filterMode)}
            onHome={reset}
          />
        )}
      </main>
    </div>
  );
}

function IntroScreen({ onStart }: { onStart: (mode: FilterMode) => void }) {
  const [selected, setSelected] = useState<FilterMode>("all");

  return (
    <div className={styles.introShell}>
      <div className={styles.introContent}>
        <div className={styles.introBadge}>Beta</div>
        <h1 className={styles.introTitle}>Claude Architect<br />Certification Prep</h1>
        <p className={styles.introSubtitle}>
          Practice exam based on the official Foundations certification guide.
          Scenario-based questions across all 5 domains, with explanations after
          each answer.
        </p>

        <div className={styles.statsRow}>
          {[
            { val: "15", label: "questions" },
            { val: "5", label: "domains" },
            { val: "720", label: "to pass" },
            { val: "90 min", label: "real exam" },
          ].map((s) => (
            <div key={s.label} className={styles.statItem}>
              <span className={styles.statVal}>{s.val}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>

        <div className={styles.filterSection}>
          <p className={styles.filterLabel}>Focus area</p>
          <div className={styles.filterGrid}>
            {DOMAIN_FILTERS.map((f) => (
              <button
                key={f.value}
                className={`${styles.filterChip} ${selected === f.value ? styles.filterChipActive : ""}`}
                onClick={() => setSelected(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <button className={styles.startBtn} onClick={() => onStart(selected)}>
          Start practice exam
        </button>

        <p className={styles.disclaimer}>
          Practice mode — explanations shown after each answer
        </p>
      </div>
    </div>
  );
}

function ScenarioScreen({
  q, idx, total, onBegin,
}: {
  q: Question; idx: number; total: number; onBegin: () => void;
}) {
  const scenario = SCENARIOS[q.scenario];
  const color = SCENARIO_COLORS[q.scenarioColor];
  const bg = SCENARIO_BG[q.scenarioColor];
  const text = SCENARIO_TEXT[q.scenarioColor];

  return (
    <div className={styles.card}>
      <div
        className={styles.scenarioBadge}
        style={{ background: bg, color: text }}
      >
        Scenario {idx + 1} of {total}
      </div>
      <div className={styles.scenarioAccent} style={{ background: color }} />
      <h2 className={styles.scenarioTitle}>{q.scenario}</h2>
      <p className={styles.scenarioDesc}>{scenario.description}</p>
      <button className={styles.primaryBtn} onClick={onBegin}>
        Begin section
      </button>
    </div>
  );
}

function QuestionScreen({
  q, idx, total, selected, submitted, onSelect, onSubmit, onNext,
}: {
  q: Question;
  idx: number;
  total: number;
  selected: number | null;
  submitted: boolean;
  onSelect: (i: number) => void;
  onSubmit: () => void;
  onNext: () => void;
}) {
  const progress = ((idx) / total) * 100;
  const isLast = idx === total - 1;
  const isCorrect = submitted && selected === q.correct;

  return (
    <div className={styles.questionWrap}>
      {/* Progress */}
      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
      </div>

      <div className={styles.card}>
        {/* Meta row */}
        <div className={styles.metaRow}>
          <span
            className={styles.domainTag}
            style={{ color: DOMAIN_COLORS[q.domain] }}
          >
            {q.domain}
          </span>
          <span className={styles.qCounter}>
            {idx + 1} / {total}
          </span>
        </div>

        {/* Question */}
        <p className={styles.questionText}>{q.q}</p>

        {/* Options */}
        <div className={styles.options}>
          {q.opts.map((opt, i) => {
            let variant = "";
            if (submitted) {
              if (i === q.correct) variant = styles.optCorrect;
              else if (i === selected) variant = styles.optWrong;
            } else if (i === selected) {
              variant = styles.optSelected;
            }
            return (
              <button
                key={i}
                className={`${styles.option} ${variant}`}
                onClick={() => onSelect(i)}
              >
                <span className={styles.optLetter}>
                  {["A", "B", "C", "D"][i]}
                </span>
                <span className={styles.optText}>{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {submitted && (
          <div
            className={`${styles.explanation} ${isCorrect ? styles.explanationCorrect : styles.explanationWrong}`}
          >
            <span className={styles.explanationLabel}>
              {isCorrect ? "Correct" : "Incorrect"}
            </span>
            <p>{q.explanation}</p>
          </div>
        )}

        {/* Action */}
        <div className={styles.actionRow}>
          {!submitted ? (
            <button
              className={styles.primaryBtn}
              onClick={onSubmit}
              disabled={selected === null}
            >
              Submit answer
            </button>
          ) : (
            <button className={styles.primaryBtn} onClick={onNext}>
              {isLast ? "See results" : "Next question"} →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ResultsScreen({
  questions, answers, onRetake, onHome,
}: {
  questions: Question[];
  answers: Answer[];
  onRetake: () => void;
  onHome: () => void;
}) {
  const correct = answers.filter((a) => a.correct).length;
  const total = questions.length;
  const pct = Math.round((correct / total) * 100);
  const scaledScore = Math.round(100 + (correct / total) * 900);
  const passed = scaledScore >= 720;

  // Domain breakdown
  const domainMap: Record<string, { correct: number; total: number }> = {};
  questions.forEach((q, i) => {
    if (!domainMap[q.domain]) domainMap[q.domain] = { correct: 0, total: 0 };
    domainMap[q.domain].total++;
    if (answers[i]?.correct) domainMap[q.domain].correct++;
  });

  return (
    <div className={styles.resultsWrap}>
      <div className={styles.card}>
        <div className={styles.resultsMeta}>
          <div
            className={styles.scoreRing}
            style={{ borderColor: passed ? "var(--correct)" : "var(--wrong)" }}
          >
            <span
              className={styles.scoreNum}
              style={{ color: passed ? "var(--correct)" : "var(--wrong)" }}
            >
              {scaledScore}
            </span>
            <span className={styles.scoreOf}>/ 1000</span>
          </div>
          <div>
            <h2 className={styles.resultTitle}>
              {passed ? "Practice complete" : "Keep studying"}
            </h2>
            <p className={styles.resultSubtitle}>
              {correct}/{total} correct · {pct}% accuracy ·{" "}
              <span style={{ color: passed ? "var(--correct)" : "var(--wrong)" }}>
                {passed ? "Pass" : "Fail"} (720 to pass)
              </span>
            </p>
          </div>
        </div>

        {/* Domain breakdown */}
        <div className={styles.domainBreakdown}>
          <p className={styles.breakdownLabel}>By domain</p>
          {Object.entries(domainMap).map(([domain, data]) => {
            const d = data as { correct: number; total: number };
            const dpct = d.total > 0 ? Math.round((d.correct / d.total) * 100) : 0;
            const barColor =
              dpct >= 70
                ? "var(--correct)"
                : dpct >= 50
                ? "var(--orange)"
                : "var(--wrong)";
            return (
              <div key={domain} className={styles.domainRow}>
                <span className={styles.domainName}>{domain}</span>
                <div className={styles.domainBar}>
                  <div
                    className={styles.domainBarFill}
                    style={{ width: `${dpct}%`, background: barColor }}
                  />
                </div>
                <span className={styles.domainScore}>
                  {d.correct}/{d.total}
                </span>
              </div>
            );
          })}
        </div>

        <div className={styles.resultsActions}>
          <button className={styles.ghostBtn} onClick={onHome}>
            Back to menu
          </button>
          <button className={styles.primaryBtn} onClick={onRetake}>
            Retake exam
          </button>
        </div>
      </div>
    </div>
  );
}
