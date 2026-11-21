import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Check,
  Copy,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  RefreshCw,
  ShieldCheck,
  Trash2
} from 'lucide-react';
import {
  analyzePasswordLocally,
  generatePassphraseLocal,
  generateRandomPasswordLocal
} from '../../utils/passwordAnalyzer';

interface PasswordLabViewProps {
  onPasswordTested: () => void;
}

const DEMO_PATTERNS = [
  {
    label: 'Password123!',
    why: 'Uses dictionary root + 123 + single trailing symbol. Cracked instantly by rule engines.'
  },
  {
    label: 'Summer2026!',
    why: 'Season + current year is among the top 500 corporate password patterns.'
  },
  {
    label: 'P@ssw0rd_qwerty',
    why: 'Predictable leetspeak (@/0) + keyboard walk adds near-zero real entropy.'
  },
  {
    label: 'Cedar-Lantern-Fjord-Orion-48',
    why: '4+ unrelated words with separator and random digits resist dictionary & GPU cracking.'
  }
];

export const PasswordLabView: React.FC<PasswordLabViewProps> = ({ onPasswordTested }) => {
  const [candidate, setCandidate] = useState('');
  const [showText, setShowText] = useState(false);
  const [generatedCredential, setGeneratedCredential] = useState(() =>
    generatePassphraseLocal(4)
  );
  const [copiedGenerated, setCopiedGenerated] = useState(false);

  const analysis = useMemo(() => analyzePasswordLocally(candidate), [candidate]);

  useEffect(() => {
    if (candidate.length >= 4) {
      onPasswordTested();
    }
  }, [candidate.length, onPasswordTested]);

  const strengthVisual = useMemo(() => {
    switch (analysis.strengthLevel) {
      case 'Resilient':
        return { bar: 'bg-emerald-400', text: 'text-emerald-400', label: 'Resilient' };
      case 'Strong':
        return { bar: 'bg-cyan-400', text: 'text-cyan-300', label: 'Strong' };
      case 'Moderate':
        return { bar: 'bg-blue-400', text: 'text-blue-300', label: 'Moderate' };
      case 'Weak':
        return { bar: 'bg-amber-400', text: 'text-amber-300', label: 'Weak' };
      case 'Critical':
        return { bar: 'bg-rose-500', text: 'text-rose-400', label: 'Critical Risk' };
      default:
        return { bar: 'bg-slate-700', text: 'text-slate-400', label: 'Awaiting Input' };
    }
  }, [analysis.strengthLevel]);

  const handleCopyGenerated = async () => {
    try {
      await navigator.clipboard.writeText(generatedCredential);
      setCopiedGenerated(true);
      setTimeout(() => setCopiedGenerated(false), 1800);
    } catch {
      // Clipboard blocked in restricted frame; user can copy manually
    }
  };

  return (
    <div className="space-y-6">
      {/* Privacy Assurance Banner */}
      <section className="surface-panel rounded-xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
            <Lock className="w-3.5 h-3.5" />
            <span>100% Client-Side Processing</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-400">Zero Storage or Network Transmission</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-slate-50">
            Password Security Lab
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Evaluate password entropy, pattern predictability, and offline brute-force resistance entirely inside your browser memory. Never enter a real banking or primary password.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Live Local Analyzer */}
        <div className="lg:col-span-7 surface-panel rounded-xl p-6 space-y-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <label htmlFor="password-lab-input" className="text-sm font-semibold text-slate-100">
                Test Password or Passphrase
              </label>
              {candidate && (
                <button
                  type="button"
                  onClick={() => setCandidate('')}
                  className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Memory</span>
                </button>
              )}
            </div>

            <div className="relative flex items-center">
              <input
                id="password-lab-input"
                type={showText ? 'text' : 'password'}
                value={candidate}
                onChange={(e) => setCandidate(e.target.value)}
                autoComplete="off"
                spellCheck={false}
                placeholder="Type a sample password to test locally..."
                className="w-full rounded-lg bg-[#070D19] border border-slate-700 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 px-4 py-3 pr-12 text-sm font-mono text-slate-100 placeholder:text-slate-500"
              />
              <button
                type="button"
                onClick={() => setShowText((s) => !s)}
                aria-label={showText ? 'Hide password text' : 'Show password text'}
                className="absolute right-3 p-1.5 rounded text-slate-400 hover:text-slate-200"
              >
                {showText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Strength Bar & Entropy Telemetry */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">
                Estimated Strength:{' '}
                <strong className={strengthVisual.text}>{strengthVisual.label}</strong>
              </span>
              <span className="font-mono text-slate-300 tabular-nums">
                {analysis.effectiveEntropyBits} bits effective entropy · {analysis.length} chars
              </span>
            </div>

            <div className="h-2.5 w-full rounded-full bg-slate-800 overflow-hidden">
              <div
                className={`h-full rounded-full ${strengthVisual.bar}`}
                style={{
                  width: `${analysis.scorePercent}%`,
                  transition: 'width 280ms cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              />
            </div>

            {/* Character Diversity Checklist */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
              {[
                { label: 'Lowercase (a-z)', met: analysis.hasLower },
                { label: 'Uppercase (A-Z)', met: analysis.hasUpper },
                { label: 'Numbers (0-9)', met: analysis.hasNumber },
                { label: 'Symbols (!@#)', met: analysis.hasSymbol }
              ].map((item) => (
                <div
                  key={item.label}
                  className={`rounded-lg px-3 py-2 border flex items-center gap-2 ${
                    item.met
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-[#080F1D] border-slate-800 text-slate-500'
                  }`}
                >
                  <Check className={`w-3.5 h-3.5 shrink-0 ${item.met ? 'opacity-100' : 'opacity-30'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Estimated Crack Resistance */}
          <div className="space-y-2.5 pt-2 border-t border-slate-800/80">
            <h2 className="text-xs font-semibold text-slate-300">
              Estimated Brute-Force Resistance (Educational Model)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-lg bg-[#080F1D] border border-slate-800 p-3.5">
                <div className="text-[11px] text-slate-400 mb-1">Online Login (100/sec)</div>
                <div className="text-sm font-bold font-mono text-slate-100 tabular-nums">
                  {analysis.crackEstimates.onlineRateLimited}
                </div>
              </div>
              <div className="rounded-lg bg-[#080F1D] border border-slate-800 p-3.5">
                <div className="text-[11px] text-slate-400 mb-1">Slow Hash bcrypt (10k/sec)</div>
                <div className="text-sm font-bold font-mono text-cyan-300 tabular-nums">
                  {analysis.crackEstimates.offlineSlowBcrypt}
                </div>
              </div>
              <div className="rounded-lg bg-[#080F1D] border border-slate-800 p-3.5">
                <div className="text-[11px] text-slate-400 mb-1">Leaked Fast Hash GPU (10B/s)</div>
                <div className="text-sm font-bold font-mono text-amber-300 tabular-nums">
                  {analysis.crackEstimates.offlineFastGpu}
                </div>
              </div>
            </div>
          </div>

          {/* Warnings & Actionable Guidance */}
          <div className="space-y-3 pt-2 border-t border-slate-800/80">
            {analysis.warnings.length > 0 && (
              <div className="rounded-lg bg-rose-500/10 border border-rose-500/30 p-3.5 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-rose-300">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Detected Structural Weaknesses</span>
                </div>
                <ul className="space-y-1 text-xs text-rose-200/90 list-disc pl-5">
                  {analysis.warnings.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="rounded-lg bg-[#080F1D] border border-slate-800 p-3.5 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Hardening Guidance</span>
              </div>
              <ul className="space-y-1 text-xs text-slate-300 list-disc pl-5">
                {analysis.suggestions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right: Weak Password Pitfalls + CSPRNG Passphrase Generator */}
        <div className="lg:col-span-5 space-y-6">
          {/* Why Weak Passwords Fail */}
          <div className="surface-panel rounded-xl p-6 space-y-4">
            <div>
              <h2 className="text-base font-semibold font-display text-slate-100">
                Why Predictable Passwords Fail
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Click any sample pattern to inspect how dictionary &amp; rule attacks shrink effective entropy.
              </p>
            </div>

            <div className="space-y-2.5">
              {DEMO_PATTERNS.map((demo) => (
                <button
                  key={demo.label}
                  type="button"
                  onClick={() => {
                    setCandidate(demo.label);
                    setShowText(true);
                  }}
                  className="w-full text-left rounded-lg bg-[#080F1D] border border-slate-800 hover:border-cyan-400/40 p-3 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-mono text-xs font-semibold text-cyan-300 truncate">
                      {demo.label}
                    </span>
                    <span className="text-[11px] text-slate-400 shrink-0">Load sample</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{demo.why}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Local CSPRNG Passphrase Generator */}
          <div className="surface-panel rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-emerald-400" />
              <h2 className="text-base font-semibold font-display text-slate-100">
                Local CSPRNG Generator
              </h2>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Uses <code className="text-cyan-300">window.crypto.getRandomValues</code> locally to create high-entropy credentials.
            </p>

            <div className="rounded-lg bg-[#070D19] border border-slate-800 p-3.5 flex items-center justify-between gap-3">
              <span className="font-mono text-xs sm:text-sm text-emerald-300 break-all">
                {generatedCredential}
              </span>
              <button
                type="button"
                onClick={handleCopyGenerated}
                className="p-2 rounded-md bg-slate-800 text-slate-200 hover:bg-slate-700 shrink-0"
                aria-label="Copy generated credential"
              >
                {copiedGenerated ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setGeneratedCredential(generatePassphraseLocal(4))}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-cyan-500 text-slate-950 hover:bg-cyan-400 whitespace-nowrap"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>4-Word Passphrase</span>
              </button>
              <button
                type="button"
                onClick={() => setGeneratedCredential(generateRandomPasswordLocal(18))}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-slate-800 text-slate-200 border border-slate-700 hover:border-cyan-400/40 whitespace-nowrap"
              >
                <span>18-Char Random</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setCandidate(generatedCredential);
                  setShowText(true);
                }}
                className="text-xs font-medium text-cyan-300 hover:text-cyan-200 px-2 py-1.5"
              >
                Analyze in Lab →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
