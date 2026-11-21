import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  FileWarning,
  Link2,
  MailCheck,
  ShieldAlert,
  ShieldCheck
} from 'lucide-react';
import { PHISHING_SCENARIOS } from '../../data/phishingData';
import { PhishingAnswerRecord } from '../../types/security';

interface PhishingLabViewProps {
  answers: Record<string, PhishingAnswerRecord>;
  onRecordAnswer: (
    scenarioId: string,
    userMarkedPhishing: boolean,
    isCorrect: boolean,
    subject: string
  ) => void;
}

export const PhishingLabView: React.FC<PhishingLabViewProps> = ({
  answers,
  onRecordAnswer
}) => {
  const [selectedId, setSelectedId] = useState<string>(PHISHING_SCENARIOS[0].id);
  const [filterMode, setFilterMode] = useState<'all' | 'pending' | 'completed'>('all');
  const [showRawHeaders, setShowRawHeaders] = useState(false);
  const [hoveredUrl, setHoveredUrl] = useState<string | null>(null);
  const [highlightIndicators, setHighlightIndicators] = useState(true);

  const filteredScenarios = useMemo(() => {
    return PHISHING_SCENARIOS.filter((s) => {
      const done = Boolean(answers[s.id]);
      if (filterMode === 'pending') return !done;
      if (filterMode === 'completed') return done;
      return true;
    });
  }, [answers, filterMode]);

  const activeScenario =
    PHISHING_SCENARIOS.find((s) => s.id === selectedId) ?? PHISHING_SCENARIOS[0];
  const activeAnswer = answers[activeScenario.id];

  const completedCount = Object.keys(answers).length;
  const correctCount = Object.values(answers).filter((a) => a.isCorrect).length;
  const accuracy =
    completedCount > 0 ? Math.round((correctCount / completedCount) * 100) : 0;

  const handleVerdict = (markAsPhishing: boolean) => {
    const isCorrect = markAsPhishing === activeScenario.isPhishing;
    onRecordAnswer(
      activeScenario.id,
      markAsPhishing,
      isCorrect,
      activeScenario.subject
    );
  };

  const handleNextUnanswered = () => {
    const next = PHISHING_SCENARIOS.find((s) => s.id !== activeScenario.id && !answers[s.id]);
    if (next) {
      setSelectedId(next.id);
      setHoveredUrl(null);
    } else {
      const idx = PHISHING_SCENARIOS.findIndex((s) => s.id === activeScenario.id);
      const nextCyclic = PHISHING_SCENARIOS[(idx + 1) % PHISHING_SCENARIOS.length];
      setSelectedId(nextCyclic.id);
      setHoveredUrl(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Score Strip */}
      <section className="surface-panel rounded-xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-cyan-300 font-medium">
            <span>Simulated Inbox Training</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-400">Safe Local Sandbox (External Links Disabled)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-slate-50">
            Phishing Detection Lab
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Inspect sender addresses, SPF/DKIM alignment, hover link previews, and attachments to distinguish real alerts from credential-harvesting traps.
          </p>
        </div>

        <div className="flex items-center gap-6 shrink-0 bg-[#080F1D] border border-slate-800 rounded-lg px-4 py-3">
          <div>
            <div className="text-[11px] text-slate-400">Reviewed</div>
            <div className="text-lg font-bold font-mono text-slate-100 tabular-nums">
              {completedCount}/{PHISHING_SCENARIOS.length}
            </div>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <div className="text-[11px] text-slate-400">Accuracy</div>
            <div className="text-lg font-bold font-mono text-emerald-400 tabular-nums">
              {completedCount > 0 ? `${accuracy}%` : '—'}
            </div>
          </div>
        </div>
      </section>

      {/* Split Inbox Workspace */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Message Queue */}
        <div className="lg:col-span-4 surface-panel rounded-xl overflow-hidden">
          <div className="p-3.5 border-b border-slate-800 flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-slate-200">Inbox Queue</span>
            <div className="flex items-center gap-1 bg-[#070D19] p-0.5 rounded-md border border-slate-800">
              {(['all', 'pending', 'completed'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setFilterMode(mode)}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium capitalize transition-colors whitespace-nowrap ${
                    filterMode === mode
                      ? 'bg-cyan-500/20 text-cyan-300'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-slate-800/70 max-h-[580px] overflow-y-auto">
            {filteredScenarios.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                No messages match this filter.
              </div>
            ) : (
              filteredScenarios.map((scenario) => {
                const isSelected = scenario.id === activeScenario.id;
                const record = answers[scenario.id];
                return (
                  <button
                    key={scenario.id}
                    type="button"
                    onClick={() => {
                      setSelectedId(scenario.id);
                      setHoveredUrl(null);
                    }}
                    className={`w-full text-left p-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-400 ${
                      isSelected ? 'bg-cyan-500/10' : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-[11px] text-slate-400 mb-1">
                      <span className="font-medium text-slate-300 truncate">
                        {scenario.senderName}
                      </span>
                      <span className="font-mono shrink-0">{scenario.difficulty}</span>
                    </div>
                    <div className="text-xs font-semibold text-slate-100 line-clamp-2 mb-1.5">
                      {scenario.subject}
                    </div>
                    <div className="flex items-center justify-between gap-2 text-[11px]">
                      <span className="text-slate-500 truncate">{scenario.category}</span>
                      {record ? (
                        <span
                          className={`inline-flex items-center gap-1 font-medium shrink-0 ${
                            record.isCorrect ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {record.isCorrect ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <AlertTriangle className="w-3.5 h-3.5" />
                          )}
                          <span>{record.isCorrect ? 'Correct' : 'Missed'}</span>
                        </span>
                      ) : (
                        <span className="text-cyan-300 font-medium shrink-0">Needs review</span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Simulated Email Reader & Inspection Controls */}
        <div className="lg:col-span-8 surface-panel rounded-xl overflow-hidden flex flex-col">
          {/* Email Header Metadata */}
          <div className="p-5 sm:p-6 border-b border-slate-800 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>{activeScenario.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeScenario.timestamp}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeScenario.difficulty}</span>
                </div>
                <h2 className="text-lg font-bold font-display text-slate-50">
                  {activeScenario.subject}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setShowRawHeaders((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 text-slate-200 border border-slate-700 hover:border-cyan-400/40 whitespace-nowrap shrink-0"
              >
                <Eye className="w-3.5 h-3.5 text-cyan-300" />
                <span>{showRawHeaders ? 'Hide Auth Headers' : 'Inspect Auth Headers'}</span>
              </button>
            </div>

            <div className="rounded-lg bg-[#080F1D] border border-slate-800 p-3.5 text-xs space-y-1.5">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="text-slate-400 w-16">From:</span>
                <span className="font-semibold text-slate-100">{activeScenario.senderName}</span>
                <span
                  className={`font-mono ${
                    activeAnswer && highlightIndicators && activeScenario.isPhishing
                      ? 'text-amber-300 underline decoration-amber-400/60'
                      : 'text-cyan-300'
                  }`}
                >
                  &lt;{activeScenario.senderEmail}&gt;
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="text-slate-400 w-16">Reply-To:</span>
                <span className="font-mono text-slate-300">{activeScenario.replyToEmail}</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="text-slate-400 w-16">To:</span>
                <span className="font-mono text-slate-400">{activeScenario.recipientEmail}</span>
              </div>

              {showRawHeaders && (
                <div className="pt-2.5 mt-2.5 border-t border-slate-800 grid grid-cols-3 gap-2 font-mono text-[11px]">
                  <div className="rounded bg-[#0C1424] px-2.5 py-1.5 border border-slate-800">
                    <span className="text-slate-400">SPF: </span>
                    <span
                      className={
                        activeScenario.spfStatus === 'PASS' ? 'text-emerald-400' : 'text-rose-400'
                      }
                    >
                      {activeScenario.spfStatus}
                    </span>
                  </div>
                  <div className="rounded bg-[#0C1424] px-2.5 py-1.5 border border-slate-800">
                    <span className="text-slate-400">DKIM: </span>
                    <span
                      className={
                        activeScenario.dkimStatus === 'PASS' ? 'text-emerald-400' : 'text-rose-400'
                      }
                    >
                      {activeScenario.dkimStatus}
                    </span>
                  </div>
                  <div className="rounded bg-[#0C1424] px-2.5 py-1.5 border border-slate-800">
                    <span className="text-slate-400">DMARC: </span>
                    <span
                      className={
                        activeScenario.dmarcStatus === 'PASS' ? 'text-emerald-400' : 'text-rose-400'
                      }
                    >
                      {activeScenario.dmarcStatus}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Email Body Sandbox */}
          <div className="p-5 sm:p-6 space-y-4 bg-[#0A1120]">
            {activeScenario.bodyParagraphs.map((para, idx) => (
              <p key={idx} className="text-sm text-slate-200 leading-relaxed">
                {para}
              </p>
            ))}

            {activeScenario.links.length > 0 && (
              <div className="pt-2 space-y-2">
                <div className="text-xs text-slate-400">
                  Hover or focus link below to preview real destination URL safely:
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeScenario.links.map((lnk, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onMouseEnter={() => setHoveredUrl(lnk.actualUrl)}
                      onMouseLeave={() => setHoveredUrl(null)}
                      onFocus={() => setHoveredUrl(lnk.actualUrl)}
                      onBlur={() => setHoveredUrl(null)}
                      onClick={() => setHoveredUrl(lnk.actualUrl)}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium bg-blue-500/15 text-cyan-300 border border-cyan-400/30 hover:bg-blue-500/25 transition-colors"
                    >
                      <Link2 className="w-3.5 h-3.5 shrink-0" />
                      <span>{lnk.displayText}</span>
                    </button>
                  ))}
                </div>
                <div className="rounded-md bg-[#060B14] border border-slate-800 px-3 py-2 font-mono text-[11px] text-slate-300 flex items-center gap-2 overflow-x-auto">
                  <span className="text-slate-500 shrink-0">Link Preview:</span>
                  <span className={hoveredUrl ? 'text-amber-300' : 'text-slate-500'}>
                    {hoveredUrl ?? 'Hover over a simulated link above to inspect its true URL'}
                  </span>
                </div>
              </div>
            )}

            {activeScenario.attachment && (
              <div className="rounded-lg bg-[#080F1D] border border-slate-800 p-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <FileWarning
                    className={`w-5 h-5 shrink-0 ${
                      activeScenario.attachment.isDangerous ? 'text-amber-400' : 'text-slate-400'
                    }`}
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-mono text-slate-100 truncate">
                      {activeScenario.attachment.filename}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Attachment · {activeScenario.attachment.size} · Disabled in sandbox
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Decision Bar */}
          <div className="p-5 sm:p-6 border-t border-slate-800 bg-[#0C1424] space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs font-medium text-slate-300">
                Your Security Classification:
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => handleVerdict(true)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                    activeAnswer?.userMarkedPhishing === true
                      ? 'bg-rose-500 text-white'
                      : 'bg-rose-500/15 text-rose-300 border border-rose-500/35 hover:bg-rose-500/25'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Report Phishing</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleVerdict(false)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                    activeAnswer?.userMarkedPhishing === false
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/35 hover:bg-emerald-500/25'
                  }`}
                >
                  <MailCheck className="w-4 h-4" />
                  <span>Mark Legitimate</span>
                </button>
              </div>
            </div>

            {/* Feedback & Indicator Breakdown */}
            {activeAnswer && (
              <div
                className={`rounded-xl border p-4 space-y-3 ${
                  activeAnswer.isCorrect
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : 'bg-rose-500/10 border-rose-500/30'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {activeAnswer.isCorrect ? (
                      <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                    <span className="text-sm font-semibold text-slate-100">
                      {activeAnswer.isCorrect ? 'Accurate Triage' : 'Incorrect Classification'} —{' '}
                      {activeScenario.isPhishing
                        ? 'This message is a Phishing attempt.'
                        : 'This message is Legitimate.'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setHighlightIndicators((p) => !p)}
                      className="text-xs font-medium text-slate-300 hover:text-white underline"
                    >
                      {highlightIndicators ? 'Hide hints' : 'Show hints'}
                    </button>
                    <button
                      type="button"
                      onClick={handleNextUnanswered}
                      className="px-3 py-1.5 rounded-md text-xs font-semibold bg-cyan-500 text-slate-950 hover:bg-cyan-400 whitespace-nowrap"
                    >
                      Next Message
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed">
                  {activeScenario.explanation}
                </p>

                {highlightIndicators && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
                    {activeScenario.indicators.map((ind) => (
                      <div
                        key={ind.id}
                        className="rounded-lg bg-[#080F1D]/90 border border-slate-800 p-3 text-xs space-y-1"
                      >
                        <div className="font-semibold text-cyan-300">{ind.label}</div>
                        <p className="text-slate-300 leading-relaxed">{ind.detail}</p>
                        {ind.highlightedText && (
                          <div className="font-mono text-[11px] text-amber-300 break-all pt-0.5">
                            {ind.highlightedText}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
