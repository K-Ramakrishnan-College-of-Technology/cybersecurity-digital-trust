import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  Key,
  Lock,
  ShieldCheck,
  Smartphone
} from 'lucide-react';
import {
  MFA_COMPARISONS,
  PERMISSION_AUDIT_ITEMS,
  TRUST_PILLARS
} from '../../data/trustAndQuizData';

interface DigitalTrustViewProps {
  exploredPillars: string[];
  onExplorePillar: (pillarId: string, pillarTitle: string) => void;
}

export const DigitalTrustView: React.FC<DigitalTrustViewProps> = ({
  exploredPillars,
  onExplorePillar
}) => {
  const [selectedPillarId, setSelectedPillarId] = useState<string>(TRUST_PILLARS[0].id);
  const [selectedMfaId, setSelectedMfaId] = useState<string>('fido2-passkey');
  const [tlsEnabled, setTlsEnabled] = useState<boolean>(true);
  const [permissionJudgements, setPermissionJudgements] = useState<
    Record<string, 'allow' | 'deny'>
  >({});

  const activePillar =
    TRUST_PILLARS.find((p) => p.id === selectedPillarId) ?? TRUST_PILLARS[0];
  const activeMfa =
    MFA_COMPARISONS.find((m) => m.id === selectedMfaId) ?? MFA_COMPARISONS[3];

  const handleSelectPillar = (id: string, title: string) => {
    setSelectedPillarId(id);
    onExplorePillar(id, title);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="surface-panel rounded-xl p-5 sm:p-6 space-y-1">
        <div className="flex items-center gap-2 text-xs text-cyan-300 font-medium">
          <span>Privacy &amp; Digital Trust</span>
          <span aria-hidden="true">·</span>
          <span className="text-slate-400 tabular-nums">
            {exploredPillars.length}/{TRUST_PILLARS.length} pillars studied
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold font-display text-slate-50">
          Digital Trust &amp; Privacy Lab
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
          Explore core privacy principles, compare authentication factor resilience, inspect TLS encryption in transit, and audit over-privileged app permissions.
        </p>
      </section>

      {/* 6 Learning Pillars + Detail Panel */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
          {TRUST_PILLARS.map((pillar) => {
            const isSelected = pillar.id === activePillar.id;
            const explored = exploredPillars.includes(pillar.id);
            return (
              <button
                key={pillar.id}
                type="button"
                onClick={() => handleSelectPillar(pillar.id, pillar.title)}
                className={`text-left rounded-xl p-4 border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                  isSelected
                    ? 'bg-[#101C33] border-cyan-400/50'
                    : 'surface-panel hover:border-cyan-500/30 hover:bg-[#0E1729]'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-sm font-semibold font-display text-slate-100">
                    {pillar.title}
                  </span>
                  {explored && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                </div>
                <p className="text-xs text-slate-400">{pillar.subtitle}</p>
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-7 surface-panel rounded-xl p-6 space-y-5">
          <div className="space-y-1 pb-4 border-b border-slate-800">
            <span className="text-xs text-cyan-300 font-medium">{activePillar.subtitle}</span>
            <h2 className="text-xl font-bold font-display text-slate-50">
              {activePillar.title}
            </h2>
          </div>

          <p className="text-sm text-slate-200 leading-relaxed">{activePillar.summary}</p>

          <div className="space-y-2.5">
            <h3 className="text-xs font-semibold text-cyan-300">Actionable Key Takeaways</h3>
            <ul className="space-y-2">
              {activePillar.keyTakeaways.map((point, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 rounded-lg bg-[#080F1D] border border-slate-800 p-3 text-xs text-slate-200 leading-relaxed"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg bg-cyan-500/8 border border-cyan-500/25 p-4 text-xs text-slate-200">
            <span className="font-semibold text-cyan-300">Core Rule of Thumb: </span>
            {activePillar.bestPractice}
          </div>
        </div>
      </section>

      {/* Interactive Simulations Row */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* MFA Resistance Simulator */}
        <div className="lg:col-span-6 surface-panel rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-cyan-300" />
            <h2 className="text-base font-semibold font-display text-slate-100">
              MFA Method Resilience Simulator
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Compare how different authentication factors hold up against real-world takeover techniques.
          </p>

          <div className="grid grid-cols-2 gap-2">
            {MFA_COMPARISONS.map((method) => (
              <button
                key={method.id}
                type="button"
                onClick={() => setSelectedMfaId(method.id)}
                className={`px-3 py-2 rounded-lg text-xs font-medium text-left border transition-colors ${
                  selectedMfaId === method.id
                    ? 'bg-cyan-500/15 border-cyan-400/50 text-cyan-200'
                    : 'bg-[#080F1D] border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {method.name}
              </button>
            ))}
          </div>

          <div className="rounded-lg bg-[#080F1D] border border-slate-800 p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-slate-100">{activeMfa.name}</span>
              <span
                className={`text-xs font-semibold ${
                  activeMfa.verdict === 'Phishing-Resistant'
                    ? 'text-emerald-400'
                    : activeMfa.verdict === 'Strong'
                      ? 'text-cyan-300'
                      : activeMfa.verdict === 'Partial Protection'
                        ? 'text-amber-300'
                        : 'text-rose-400'
                }`}
              >
                {activeMfa.verdict}
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              {[
                { label: 'Phishing Proxy Resistance', val: activeMfa.phishingResistance },
                { label: 'SIM-Swap Resistance', val: activeMfa.simSwapResistance },
                { label: 'Credential Stuffing Defense', val: activeMfa.credentialStuffingResistance }
              ].map((bar) => (
                <div key={bar.label}>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>{bar.label}</span>
                    <span className="font-mono tabular-nums">{bar.val}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        bar.val >= 90
                          ? 'bg-emerald-400'
                          : bar.val >= 50
                            ? 'bg-cyan-400'
                            : 'bg-rose-400'
                      }`}
                      style={{ width: `${bar.val}%`, transition: 'width 300ms ease-out' }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-slate-400 leading-relaxed pt-1">{activeMfa.summary}</p>
          </div>
        </div>

        {/* TLS / Encryption in Transit Visualizer */}
        <div className="lg:col-span-6 surface-panel rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <h2 className="text-base font-semibold font-display text-slate-100">
                Transport Encryption (HTTP vs HTTPS/TLS)
              </h2>
            </div>

            <div className="flex items-center gap-1 p-1 bg-[#070D19] rounded-lg border border-slate-800">
              <button
                type="button"
                onClick={() => setTlsEnabled(false)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  !tlsEnabled ? 'bg-rose-500/20 text-rose-300' : 'text-slate-400'
                }`}
              >
                Plain HTTP
              </button>
              <button
                type="button"
                onClick={() => setTlsEnabled(true)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  tlsEnabled ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400'
                }`}
              >
                HTTPS / TLS 1.3
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-400">
            Toggle encryption state to see what a passive Wi-Fi eavesdropper observes on the wire.
          </p>

          <div className="rounded-lg bg-[#060B14] border border-slate-800 p-4 font-mono text-xs space-y-2">
            <div className="flex items-center justify-between text-[11px] pb-2 border-b border-slate-800">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                Network Wire Capture Preview
              </span>
              <span className={tlsEnabled ? 'text-emerald-400' : 'text-rose-400'}>
                {tlsEnabled ? 'Encrypted Ciphertext' : 'Readable Plaintext'}
              </span>
            </div>

            {tlsEnabled ? (
              <div className="text-emerald-300/90 break-all leading-relaxed space-y-1">
                <div>TLSv1.3 Record Layer · Application Data</div>
                <div className="text-slate-400">
                  0x4a 0x9f 0xe2 0x18 0x7c 0xb1 0x04 0xd8 0x55 0xa3 0x91 0x6e 0x2f 0xc0 0x8b 0x19 0xdd 0x73 0x41 0xf2 0x09 0xaa 0x3b 0x62...
                </div>
                <div className="text-[11px] text-emerald-400 pt-1">
                  Session cookies, form fields, and API tokens are cryptographically sealed.
                </div>
              </div>
            ) : (
              <div className="text-rose-300 leading-relaxed space-y-1">
                <div>POST /auth/login HTTP/1.1</div>
                <div>Host: unencrypted-portal.example</div>
                <div className="text-amber-300">
                  username=alex.chen&amp;session_token=sk_live_94810a
                </div>
                <div className="text-[11px] text-rose-400 pt-1">
                  Any attacker on the same public Wi-Fi router can read or alter these values.
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* App Permission & OAuth Scope Audit Sandbox */}
      <section className="surface-panel rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-cyan-300" />
          <h2 className="text-base font-semibold font-display text-slate-100">
            Interactive App Permission &amp; OAuth Audit
          </h2>
        </div>
        <p className="text-xs text-slate-400">
          Evaluate each permission request below: should you grant it or deny it as excessive?
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PERMISSION_AUDIT_ITEMS.map((item) => {
            const choice = permissionJudgements[item.id];
            const isCorrect =
              choice === undefined
                ? null
                : (choice === 'deny') === item.isExcessive;

            return (
              <div
                key={item.id}
                className="rounded-xl bg-[#080F1D] border border-slate-800 p-4 flex flex-col justify-between gap-3"
              >
                <div className="space-y-1.5">
                  <div className="text-xs font-semibold text-cyan-300">{item.appContext}</div>
                  <div className="text-sm font-medium text-slate-100">{item.permission}</div>
                  <p className="text-xs text-slate-400">
                    Stated reason: &ldquo;{item.requestedReason}&rdquo;
                  </p>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setPermissionJudgements((prev) => ({ ...prev, [item.id]: 'allow' }))
                      }
                      className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        choice === 'allow'
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                          : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      Allow Access
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setPermissionJudgements((prev) => ({ ...prev, [item.id]: 'deny' }))
                      }
                      className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        choice === 'deny'
                          ? 'bg-rose-500/20 border-rose-400 text-rose-200'
                          : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      Deny / Restrict
                    </button>
                  </div>

                  {choice && (
                    <div
                      className={`rounded-lg p-2.5 text-xs flex items-start gap-2 ${
                        isCorrect
                          ? 'bg-emerald-500/10 border border-emerald-500/25 text-emerald-200'
                          : 'bg-amber-500/10 border border-amber-500/25 text-amber-200'
                      }`}
                    >
                      {isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      )}
                      <span>{item.explanation}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
