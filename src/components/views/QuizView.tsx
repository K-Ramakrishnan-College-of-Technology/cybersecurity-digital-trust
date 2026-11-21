import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Award,
  CheckCircle2,
  ChevronRight,
  RotateCcw,
  Trophy
} from 'lucide-react';
import { QUIZ_QUESTIONS, SIMULATED_LEADERBOARD } from '../../data/trustAndQuizData';

interface QuizViewProps {
  bestScore: number | null;
  lastScore: number | null;
  attempts: number;
  userHandle: string;
  onSetUserHandle: (handle: string) => void;
  onCompleteQuiz: (scorePercent: number, correctCount: number, totalCount: number) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  bestScore,
  lastScore,
  attempts,
  userHandle,
  onSetUserHandle,
  onCompleteQuiz
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [finished, setFinished] = useState(false);
  const [handleInput, setHandleInput] = useState(userHandle);

  const currentQuestion = QUIZ_QUESTIONS[currentIdx];
  const currentChoice = selectedAnswers[currentQuestion.id];
  const hasAnsweredCurrent = currentChoice !== undefined;

  const correctCount = useMemo(() => {
    return QUIZ_QUESTIONS.filter((q) => selectedAnswers[q.id] === q.correctIndex).length;
  }, [selectedAnswers]);

  const handleSelectOption = (optionIdx: number) => {
    if (hasAnsweredCurrent) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIdx
    }));
  };

  const handleAdvance = () => {
    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx((i) => i + 1);
    } else {
      const scorePct = Math.round((correctCount / QUIZ_QUESTIONS.length) * 100);
      setFinished(true);
      onCompleteQuiz(scorePct, correctCount, QUIZ_QUESTIONS.length);
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setCurrentIdx(0);
    setFinished(false);
  };

  const rankedLeaderboard = useMemo(() => {
    const effectiveScore = bestScore ?? lastScore ?? 0;
    const entries = [...SIMULATED_LEADERBOARD];
    if (attempts > 0 || finished) {
      entries.push({
        id: 'current-user',
        handle: userHandle,
        role: 'Current Learner',
        scorePercent: effectiveScore,
        completedDate: 'Today',
        isCurrentUser: true
      });
    }
    return entries.sort((a, b) => b.scorePercent - a.scorePercent);
  }, [attempts, bestScore, finished, lastScore, userHandle]);

  const progressPercent = Math.round(
    ((currentIdx + (hasAnsweredCurrent ? 1 : 0)) / QUIZ_QUESTIONS.length) * 100
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="surface-panel rounded-xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-cyan-300 font-medium">
            <span>Knowledge Assessment</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-400 tabular-nums">
              {QUIZ_QUESTIONS.length} scenario questions
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-slate-50">
            Cybersecurity &amp; Digital Trust Quiz
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Test your decision-making across phishing, passkeys, transport encryption, OAuth scopes, and ransomware recovery.
          </p>
        </div>

        <div className="flex items-center gap-5 shrink-0 bg-[#080F1D] border border-slate-800 rounded-lg px-4 py-3">
          <div>
            <div className="text-[11px] text-slate-400">Best Score</div>
            <div className="text-lg font-bold font-mono text-emerald-400 tabular-nums">
              {bestScore !== null ? `${bestScore}%` : '—'}
            </div>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <div className="text-[11px] text-slate-400">Attempts</div>
            <div className="text-lg font-bold font-mono text-slate-100 tabular-nums">
              {attempts}
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Quiz Engine */}
        <div className="lg:col-span-7 surface-panel rounded-xl p-6 space-y-5">
          {!finished ? (
            <>
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium tabular-nums">
                    Question {currentIdx + 1} of {QUIZ_QUESTIONS.length}
                  </span>
                  <span className="text-slate-400">
                    {currentQuestion.domain} <span aria-hidden="true">·</span>{' '}
                    {currentQuestion.difficulty}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400"
                    style={{ width: `${progressPercent}%`, transition: 'width 300ms ease-out' }}
                  />
                </div>
              </div>

              {/* Question Prompt */}
              <h2 className="text-base sm:text-lg font-semibold font-display text-slate-50 leading-snug">
                {currentQuestion.question}
              </h2>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQuestion.options.map((opt, idx) => {
                  const isChosen = currentChoice === idx;
                  const isCorrectOpt = idx === currentQuestion.correctIndex;

                  let styleClass =
                    'bg-[#080F1D] border-slate-800 text-slate-200 hover:border-cyan-400/50';
                  if (hasAnsweredCurrent) {
                    if (isCorrectOpt) {
                      styleClass = 'bg-emerald-500/15 border-emerald-400/60 text-emerald-200';
                    } else if (isChosen && !isCorrectOpt) {
                      styleClass = 'bg-rose-500/15 border-rose-400/60 text-rose-200';
                    } else {
                      styleClass = 'bg-[#080F1D] border-slate-800/70 text-slate-500';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={hasAnsweredCurrent}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full text-left rounded-xl p-4 border text-sm transition-colors flex items-start gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${styleClass}`}
                    >
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 shrink-0 mt-0.5">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="leading-relaxed">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation & Next Button */}
              {hasAnsweredCurrent && (
                <div className="space-y-4 pt-2">
                  <div
                    className={`rounded-xl p-4 border text-xs space-y-1.5 ${
                      currentChoice === currentQuestion.correctIndex
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-100'
                        : 'bg-amber-500/10 border-amber-500/30 text-amber-100'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-semibold">
                      {currentChoice === currentQuestion.correctIndex ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>Correct Answer</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                          <span>Review Concept</span>
                        </>
                      )}
                    </div>
                    <p className="leading-relaxed text-slate-200">
                      {currentQuestion.explanation}
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleAdvance}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors"
                    >
                      <span>
                        {currentIdx < QUIZ_QUESTIONS.length - 1
                          ? 'Next Question'
                          : 'View Final Results'}
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Final Results Summary */
            <div className="space-y-6 py-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Assessment Complete</div>
                    <h2 className="text-2xl font-bold font-display text-slate-50 tabular-nums">
                      {Math.round((correctCount / QUIZ_QUESTIONS.length) * 100)}% ({correctCount}/
                      {QUIZ_QUESTIONS.length})
                    </h2>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRetake}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-cyan-500 text-slate-950 hover:bg-cyan-400 whitespace-nowrap shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retake Assessment</span>
                </button>
              </div>

              <div className="space-y-2.5">
                <h3 className="text-xs font-semibold text-slate-300">Question Breakdown</h3>
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {QUIZ_QUESTIONS.map((q, idx) => {
                    const correct = selectedAnswers[q.id] === q.correctIndex;
                    return (
                      <div
                        key={q.id}
                        className="rounded-lg bg-[#080F1D] border border-slate-800 p-3 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="min-w-0">
                          <span className="font-mono text-slate-400 mr-2">Q{idx + 1}</span>
                          <span className="text-slate-200 truncate">{q.question}</span>
                        </div>
                        <span
                          className={`font-semibold shrink-0 ${
                            correct ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {correct ? 'Correct' : 'Missed'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Simulated Cohort Leaderboard */}
        <div className="lg:col-span-5 surface-panel rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-300" />
              <h2 className="text-base font-semibold font-display text-slate-100">
                Cohort Benchmark Leaderboard
              </h2>
            </div>
            <span className="text-[11px] text-slate-400">Simulated Cohort</span>
          </div>

          <p className="text-xs text-slate-400">
            Sample training cohort scores for educational comparison. Complete the quiz to place your local session on the board.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSetUserHandle(handleInput);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={handleInput}
              onChange={(e) => setHandleInput(e.target.value)}
              maxLength={28}
              aria-label="Local display handle"
              placeholder="Your display handle"
              className="flex-1 rounded-lg bg-[#070D19] border border-slate-800 focus:border-cyan-400 focus:outline-none px-3 py-1.5 text-xs text-slate-100"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-200 hover:bg-slate-700 whitespace-nowrap shrink-0"
            >
              Update Handle
            </button>
          </form>

          <div className="divide-y divide-slate-800/80 border border-slate-800 rounded-lg overflow-hidden bg-[#080F1D]">
            {rankedLeaderboard.map((entry, rankIdx) => (
              <div
                key={entry.id}
                className={`px-3.5 py-2.5 flex items-center justify-between gap-3 text-xs ${
                  entry.isCurrentUser ? 'bg-cyan-500/12' : ''
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-mono text-slate-400 w-5 tabular-nums">
                    #{rankIdx + 1}
                  </span>
                  <div className="min-w-0">
                    <div
                      className={`font-semibold truncate ${
                        entry.isCurrentUser ? 'text-cyan-300' : 'text-slate-100'
                      }`}
                    >
                      {entry.handle}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      {entry.role} · {entry.completedDate}
                    </div>
                  </div>
                </div>
                <span className="font-mono font-semibold text-emerald-400 tabular-nums shrink-0">
                  {entry.scorePercent}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
