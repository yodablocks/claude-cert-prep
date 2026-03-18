"use client";

import { useState, useCallback, useEffect } from "react";
import type {
  ClientQuestion,
  Domain,
  QuestionsResponse,
  AnswerResult,
} from "@/data/types";
import styles from "./ExamApp.module.css";

type Screen = "intro" | "scenario" | "question" | "results" | "review";
type FilterMode = "all" | Domain;

interface Answer {
  questionId: number;
  selected: number;
  correct: boolean;
  correctIndex: number;
  explanation: string;
}

interface ExamState {
  screen: Screen;
  filterMode: FilterMode;
  questions: ClientQuestion[];
  currentIndex: number;
  selected: number | null;
  submitted: boolean;
  submitting: boolean;
  answers: Answer[];
  answerResult: AnswerResult | null;
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
  const [meta, setMeta] = useState<QuestionsResponse | null>(null);
  const [loadError, setLoadError] = useState(false);

  const [state, setState] = useState<ExamState>({
    screen: "intro",
    filterMode: "all",
    questions: [],
    currentIndex: 0,
    selected: null,
    submitted: false,
    submitting: false,
    answers: [],
    answerResult: null,
  });

  useEffect(() => {
    fetch("/api/questions")
      .then((r) => r.json())
      .then(setMeta)
      .catch(() => setLoadError(true));
  }, []);

  const startExam = useCallback(
    (mode: FilterMode) => {
      if (!meta) return;
      const pool =
        mode === "all"
          ? meta.questions
          : meta.questions.filter((q) => q.domain === mode);
      setState({
        screen: "scenario",
        filterMode: mode,
        questions: shuffle(pool),
        currentIndex: 0,
        selected: null,
        submitted: false,
        submitting: false,
        answers: [],
        answerResult: null,
      });
    },
    [meta]
  );

  const beginSection = useCallback(() => {
    setState((s) => ({ ...s, screen: "question" }));
  }, []);

  const selectOption = useCallback(
    (i: number) => {
      if (state.submitted || state.submitting) return;
      setState((s) => ({ ...s, selected: i }));
    },
    [state.submitted, state.submitting]
  );

  const submitAnswer = useCallback(async () => {
    if (state.selected === null || state.submitting) return;
    const q = state.questions[state.currentIndex];

    setState((s) => ({ ...s, submitting: true }));

    const res = await fetch("/api/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId: q.id, selected: state.selected }),
    });
    const result: AnswerResult = await res.json();

    setState((s) => ({
      ...s,
      submitting: false,
      submitted: true,
      answerResult: result,
      answers: [
        ...s.answers,
        {
          questionId: q.id,
          selected: s.selected!,
          correct: result.correct,
          correctIndex: result.correctIndex,
          explanation: result.explanation,
        },
      ],
    }));
  }, [state.selected, state.questions, state.currentIndex, state.submitting]);

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
      submitting: false,
      answerResult: null,
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
      submitting: false,
      answers: [],
      answerResult: null,
    }));
  }, []);

  const currentQ = state.questions[state.currentIndex];
  const correctCount = state.answers.filter((a) => a.correct).length;
  const totalQ = state.questions.length;

  if (loadError) {
    return (
      <div className={styles.introShell}>
        <div className={styles.introContent}>
          <p style={{ color: "var(--wrong)" }}>Failed to load questions. Please refresh.</p>
        </div>
      </div>
    );
  }

  if (state.screen === "intro") {
    return <IntroScreen onStart={startExam} loading={!meta} />;
  }

  return (
    <div className={styles.shell}>
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
        {state.screen === "scenario" && currentQ && meta && (
          <ScenarioScreen
            q={currentQ}
            idx={state.currentIndex}
            total={totalQ}
            scenarios={meta.scenarios}
            onBegin={beginSection}
          />
        )}
        {state.screen === "question" && currentQ && meta && (
          <QuestionScreen
            q={currentQ}
            idx={state.currentIndex}
            total={totalQ}
            selected={state.selected}
            submitted={state.submitted}
            submitting={state.submitting}
            answerResult={state.answerResult}
            domainColors={meta.domainColors}
            onSelect={selectOption}
            onSubmit={submitAnswer}
            onNext={nextQuestion}
          />
        )}
        {state.screen === "results" && meta && (
          <ResultsScreen
            questions={state.questions}
            answers={state.answers}
            onRetake={() => startExam(state.filterMode)}
            onHome={reset}
            onReview={() => setState((s) => ({ ...s, screen: "review" }))}
          />
        )}
        {state.screen === "review" && meta && (
          <ReviewScreen
            questions={state.questions}
            answers={state.answers}
            domainColors={meta.domainColors}
            onBack={() => setState((s) => ({ ...s, screen: "results" }))}
          />
        )}
      </main>
    </div>
  );
}

function IntroScreen({
  onStart,
  loading,
}: {
  onStart: (mode: FilterMode) => void;
  loading: boolean;
}) {
  const [selected, setSelected] = useState<FilterMode>("all");

  return (
    <div className={styles.introShell}>
      <div className={styles.introContent}>
        <div className={styles.introBadge}>Beta</div>
        <h1 className={styles.introTitle}>
          Claude Architect
          <br />
          Certification Prep
        </h1>
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
                className={`${styles.filterChip} ${
                  selected === f.value ? styles.filterChipActive : ""
                }`}
                onClick={() => setSelected(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <button
          className={styles.startBtn}
          onClick={() => onStart(selected)}
          disabled={loading}
        >
          {loading ? "Loading…" : "Start practice exam"}
        </button>

        <p className={styles.disclaimer}>
          Practice mode — explanations shown after each answer
        </p>
      </div>
    </div>
  );
}

function ScenarioScreen({
  q,
  idx,
  total,
  scenarios,
  onBegin,
}: {
  q: ClientQuestion;
  idx: number;
  total: number;
  scenarios: QuestionsResponse["scenarios"];
  onBegin: () => void;
}) {
  const scenario = scenarios[q.scenario];
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
      <p className={styles.scenarioDesc}>{scenario?.description}</p>
      <button className={styles.primaryBtn} onClick={onBegin}>
        Begin section
      </button>
    </div>
  );
}

function QuestionScreen({
  q,
  idx,
  total,
  selected,
  submitted,
  submitting,
  answerResult,
  domainColors,
  onSelect,
  onSubmit,
  onNext,
}: {
  q: ClientQuestion;
  idx: number;
  total: number;
  selected: number | null;
  submitted: boolean;
  submitting: boolean;
  answerResult: AnswerResult | null;
  domainColors: Record<string, string>;
  onSelect: (i: number) => void;
  onSubmit: () => void;
  onNext: () => void;
}) {
  const progress = (idx / total) * 100;
  const isLast = idx === total - 1;
  const isCorrect = submitted && answerResult?.correct;

  return (
    <div className={styles.questionWrap}>
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className={styles.card}>
        <div className={styles.metaRow}>
          <span
            className={styles.domainTag}
            style={{ color: domainColors[q.domain] }}
          >
            {q.domain}
          </span>
          <span className={styles.qCounter}>
            {idx + 1} / {total}
          </span>
        </div>

        <p className={styles.questionText}>{q.q}</p>

        <div className={styles.options}>
          {q.opts.map((opt, i) => {
            let variant = "";
            if (submitted && answerResult) {
              if (i === answerResult.correctIndex) variant = styles.optCorrect;
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

        {submitted && answerResult && (
          <div
            className={`${styles.explanation} ${
              isCorrect ? styles.explanationCorrect : styles.explanationWrong
            }`}
          >
            <span className={styles.explanationLabel}>
              {isCorrect ? "Correct" : "Incorrect"}
            </span>
            <p>{answerResult.explanation}</p>
          </div>
        )}

        <div className={styles.actionRow}>
          {!submitted ? (
            <button
              className={styles.primaryBtn}
              onClick={onSubmit}
              disabled={selected === null || submitting}
            >
              {submitting ? "Checking…" : "Submit answer"}
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

function ReviewScreen({
  questions,
  answers,
  domainColors,
  onBack,
}: {
  questions: ClientQuestion[];
  answers: Answer[];
  domainColors: Record<string, string>;
  onBack: () => void;
}) {
  const [idx, setIdx] = useState(0);
  const q = questions[idx];
  const a = answers[idx];

  return (
    <div className={styles.reviewWrap}>
      {/* Dot navigation */}
      <div className={styles.reviewDots}>
        {answers.map((ans, i) => (
          <button
            key={i}
            className={`${styles.reviewDot} ${ans.correct ? styles.reviewDotCorrect : styles.reviewDotWrong} ${i === idx ? styles.reviewDotActive : ""}`}
            onClick={() => setIdx(i)}
            aria-label={`Question ${i + 1}`}
          />
        ))}
      </div>

      <div className={styles.card}>
        {/* Header */}
        <div className={styles.reviewHeader}>
          <div>
            <span
              className={`${styles.reviewResultBadge} ${a.correct ? styles.reviewResultBadgeCorrect : styles.reviewResultBadgeWrong}`}
            >
              {a.correct ? "✓ Correct" : "✗ Incorrect"}
            </span>
          </div>
          <div className={styles.reviewNav}>
            <button
              className={styles.reviewNavBtn}
              onClick={() => setIdx((i) => i - 1)}
              disabled={idx === 0}
            >
              ‹
            </button>
            <span className={styles.reviewCounter}>{idx + 1} / {questions.length}</span>
            <button
              className={styles.reviewNavBtn}
              onClick={() => setIdx((i) => i + 1)}
              disabled={idx === questions.length - 1}
            >
              ›
            </button>
          </div>
        </div>

        {/* Domain */}
        <div className={styles.metaRow}>
          <span className={styles.domainTag} style={{ color: domainColors[q.domain] }}>
            {q.domain}
          </span>
          <span className={styles.qCounter}>{q.scenario}</span>
        </div>

        {/* Question */}
        <p className={styles.questionText}>{q.q}</p>

        {/* Options */}
        <div className={styles.options}>
          {q.opts.map((opt, i) => {
            let variant = "";
            if (i === a.correctIndex) variant = styles.optCorrect;
            else if (i === a.selected && !a.correct) variant = styles.optWrong;
            return (
              <div key={i} className={`${styles.option} ${variant}`}>
                <span className={styles.optLetter}>{["A", "B", "C", "D"][i]}</span>
                <span className={styles.optText}>{opt}</span>
              </div>
            );
          })}
        </div>

        {/* Explanation */}
        <div className={`${styles.explanation} ${a.correct ? styles.explanationCorrect : styles.explanationWrong}`}>
          <span className={styles.explanationLabel}>Explanation</span>
          <p>{a.explanation}</p>
        </div>

        <div className={styles.reviewActions}>
          <button className={styles.ghostBtn} onClick={onBack}>
            ← Back to results
          </button>
        </div>
      </div>
    </div>
  );
}

function ResultsScreen({
  questions,
  answers,
  onRetake,
  onHome,
  onReview,
}: {
  questions: ClientQuestion[];
  answers: Answer[];
  onRetake: () => void;
  onHome: () => void;
  onReview: () => void;
}) {
  const correct = answers.filter((a) => a.correct).length;
  const total = questions.length;
  const pct = Math.round((correct / total) * 100);
  const scaledScore = Math.round(100 + (correct / total) * 900);
  const passed = scaledScore >= 720;

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
            style={{
              borderColor: passed ? "var(--correct)" : "var(--wrong)",
            }}
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
              <span
                style={{ color: passed ? "var(--correct)" : "var(--wrong)" }}
              >
                {passed ? "Pass" : "Fail"} (720 to pass)
              </span>
            </p>
          </div>
        </div>

        <div className={styles.domainBreakdown}>
          <p className={styles.breakdownLabel}>By domain</p>
          {Object.entries(domainMap).map(([domain, data]) => {
            const dpct =
              data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
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
                  {data.correct}/{data.total}
                </span>
              </div>
            );
          })}
        </div>

        <div className={styles.resultsActions}>
          <button className={styles.ghostBtn} onClick={onHome}>
            Back to menu
          </button>
          <button className={styles.ghostBtn} onClick={onReview}>
            Review answers
          </button>
          <button className={styles.primaryBtn} onClick={onRetake}>
            Retake exam
          </button>
        </div>
      </div>
    </div>
  );
}
