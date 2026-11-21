import React, { useState } from 'react';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  CheckSquare,
  KeyRound,
  Lock,
  MailWarning,
  Shield,
  ShieldAlert
} from 'lucide-react';
import { ActivityLogEntry, ModuleId } from '../../types/security';
import {
  PostureRadarChart,
  SecurityScoreGauge,
  ThreatLandscapeChart
} from '../charts/SecurityCharts';

interface DashboardViewProps {
  metrics: {
    overallScore: number;
    scoreTier: string;
    phishingCompleted: number;
    phishingCorrect: number;
    phishingTotal: number;
    phishingAccuracy: number;
    checklistCount: number;
    checklistTotal: number;
    checklistPercent: number;
    threatsCount: number;
    threatsTotal: number;
    trustCount: number;
    trustTotal: number;
    quizScore: number;
    radarAxes: { label: string; value: number }[];
  };
  activityLog: ActivityLogEntry[];
  onNavigate: (id: ModuleId) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  metrics,
  activityLog,
  onNavigate
}) => {
  const [activityFilter, setActivityFilter] = useState<'all' | ModuleId>('all');
  const [heroImgFailed, setHeroImgFailed] = useState(false);

  const filteredActivity =
    activityFilter === 'all'
      ? activityLog
      : activityLog.filter((item) => item.module === activityFilter);

  const quickModules: {
    id: ModuleId;
    title: string;
    metric: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      id: 'phishing',
      title: 'Phishing Detection Lab',
      metric: `${metrics.phishingCompleted}/${metrics.phishingTotal} triaged`,
      description: 'Inspect simulated inbox messages, spoofed headers, and hidden URLs.',
      icon: MailWarning
    },
    {
      id: 'passwords',
      title: 'Password Security Lab',
      metric: '100% local analysis',
      description: 'Test entropy, rule-based cracking weaknesses, and generate passphrases.',
      icon: KeyRound
    },
    {
      id: 'threats',
      title: 'Cyber Threat Explorer',
      metric: `${metrics.threatsCount}/${metrics.threatsTotal} studied`,
      description: 'Explore malware, ransomware, DDoS, and social engineering playbooks.',
      icon: ShieldAlert
    },
    {
      id: 'trust',
      title: 'Digital Trust & Privacy',
      metric: `${metrics.trustCount}/${metrics.trustTotal} pillars`,
      description: 'Compare MFA methods, audit app permissions, and inspect encryption.',
      icon: Lock
    },
    {
      id: 'quiz',
      title: 'Cybersecurity Quiz',
      metric: metrics.quizScore > 0 ? `Best: ${metrics.quizScore}%` : 'Not attempted',
      description: 'Verify your defense instincts across 10 scenario-based questions.',
      icon: Award
    },
    {
      id: 'checklist',
      title: 'Security Checklist',
      metric: `${metrics.checklistCount}/${metrics.checklistTotal} controls`,
      description: 'Track practical account, device, network, and backup hardening steps.',
      icon: CheckSquare
    }
  ];

  return (
    <div className="space-y-6">
      {/* Hero Overview Split */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8 surface-panel rounded-xl overflow-hidden flex flex-col justify-between relative">
          <div className="grid grid-cols-1 md:grid-cols-12 h-full">
            <div className="md:col-span-7 p-6 sm:p-7 flex flex-col justify-between gap-5">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-cyan-300 font-medium">
                  <span>Interactive Security Training</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-400">Educational Simulation Environment</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-slate-50 leading-tight [text-wrap:balance]">
                  Cybersecurity &amp; Digital Trust Command Center
                </h1>
                <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
                  Build practical resilience against modern online threats. Analyze simulated phishing emails, test credential entropy locally, explore attack kill chains, and harden your personal digital footprint.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => onNavigate('phishing')}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                >
                  <span>Start Phishing Lab</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('passwords')}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-800/80 text-slate-100 border border-slate-700 hover:border-cyan-400/40 hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
                >
                  <span>Test Password Strength</span>
                </button>
              </div>
            </div>

            <div className="md:col-span-5 relative min-h-[200px] bg-[#070E1C] border-t md:border-t-0 md:border-l border-slate-800/80 overflow-hidden">
              {!heroImgFailed ? (
                <img
                  src="/src/assets/images/hero_cyber_shield_1795275235037.jpg"
                  alt="Cryptographic shield protecting connected digital trust nodes"
                  referrerPolicy="no-referrer"
                  onError={() => setHeroImgFailed(true)}
                  className="w-full h-full object-cover opacity-90"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#0B162B] to-[#060B14]">
                  <Shield className="w-12 h-12 text-cyan-400 mb-2" />
                  <span className="text-xs text-slate-400 text-center">Digital Trust Architecture</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C1424] via-transparent to-transparent md:bg-gradient-to-r md:from-[#0C1424]/70 md:via-transparent md:to-transparent pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Live Overall Security Score Card */}
        <div className="lg:col-span-4 surface-panel rounded-xl p-6 flex flex-col items-center justify-between text-center glow-cyan">
          <div className="w-full flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium text-slate-200">Overall Security Score</span>
            <span className="font-mono tabular-nums">Live Posture</span>
          </div>

          <SecurityScoreGauge score={metrics.overallScore} tier={metrics.scoreTier} />

          <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
            Updates automatically as you complete checklist controls, phishing simulations, threat briefings, and quizzes.
          </p>
        </div>
      </section>

      {/* 4-Column KPI Strip */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="surface-panel rounded-xl p-4 sm:p-5">
          <div className="text-xs text-slate-400 mb-1">Phishing Detection</div>
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-2xl font-bold font-display text-slate-50 tabular-nums">
              {metrics.phishingCorrect}/{metrics.phishingTotal}
            </span>
            <span className="text-xs font-mono text-cyan-300 tabular-nums">
              {metrics.phishingCompleted > 0 ? `${metrics.phishingAccuracy}% accuracy` : '0 triaged'}
            </span>
          </div>
          <div className="mt-3 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-cyan-400"
              style={{
                width: `${(metrics.phishingCorrect / metrics.phishingTotal) * 100}%`,
                transition: 'width 400ms ease-out'
              }}
            />
          </div>
        </div>

        <div className="surface-panel rounded-xl p-4 sm:p-5">
          <div className="text-xs text-slate-400 mb-1">Security Checklist</div>
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-2xl font-bold font-display text-slate-50 tabular-nums">
              {metrics.checklistCount}/{metrics.checklistTotal}
            </span>
            <span className="text-xs font-mono text-emerald-400 tabular-nums">
              {metrics.checklistPercent}% hardened
            </span>
          </div>
          <div className="mt-3 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-400"
              style={{ width: `${metrics.checklistPercent}%`, transition: 'width 400ms ease-out' }}
            />
          </div>
        </div>

        <div className="surface-panel rounded-xl p-4 sm:p-5">
          <div className="text-xs text-slate-400 mb-1">Quiz Mastery</div>
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-2xl font-bold font-display text-slate-50 tabular-nums">
              {metrics.quizScore > 0 ? `${metrics.quizScore}%` : '—'}
            </span>
            <span className="text-xs font-mono text-blue-300 tabular-nums">
              {metrics.quizScore >= 80 ? 'Passed benchmark' : 'Target 80%+'}
            </span>
          </div>
          <div className="mt-3 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-blue-400"
              style={{ width: `${metrics.quizScore}%`, transition: 'width 400ms ease-out' }}
            />
          </div>
        </div>

        <div className="surface-panel rounded-xl p-4 sm:p-5">
          <div className="text-xs text-slate-400 mb-1">Threat &amp; Trust Modules</div>
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-2xl font-bold font-display text-slate-50 tabular-nums">
              {metrics.threatsCount + metrics.trustCount}/{metrics.threatsTotal + metrics.trustTotal}
            </span>
            <span className="text-xs font-mono text-slate-300 tabular-nums">Topics reviewed</span>
          </div>
          <div className="mt-3 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400"
              style={{
                width: `${((metrics.threatsCount + metrics.trustCount) / (metrics.threatsTotal + metrics.trustTotal)) * 100}%`,
                transition: 'width 400ms ease-out'
              }}
            />
          </div>
        </div>
      </section>

      {/* Visual Analytics Row */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 surface-panel rounded-xl p-6">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="text-base font-semibold font-display text-slate-100">
                Defense Posture Matrix
              </h2>
              <p className="text-xs text-slate-400">
                Domain coverage across identity, phishing, privacy, devices, and threats
              </p>
            </div>
          </div>
          <PostureRadarChart axes={metrics.radarAxes} />
        </div>

        <div className="lg:col-span-7 surface-panel rounded-xl p-6">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="text-base font-semibold font-display text-slate-100">
                Threat Vector Prevalence Breakdown
              </h2>
              <p className="text-xs text-slate-400">
                Select any threat vector below to inspect incident share and defense summary
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('threats')}
              className="text-xs font-medium text-cyan-300 hover:text-cyan-200 whitespace-nowrap shrink-0"
            >
              Open Explorer →
            </button>
          </div>
          <ThreatLandscapeChart />
        </div>
      </section>

      {/* Learning Modules Grid */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold font-display text-slate-100">
            Interactive Labs &amp; Learning Modules
          </h2>
          <span className="text-xs text-slate-400">6 hands-on workspaces</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {quickModules.map((mod) => {
            const Icon = mod.icon;
            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => onNavigate(mod.id)}
                className="group text-left surface-panel rounded-xl p-5 hover:border-cyan-400/40 hover:bg-[#101B30] transition-colors flex flex-col justify-between gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-300">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-mono text-slate-400 tabular-nums">
                      {mod.metric}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold font-display text-slate-100 group-hover:text-cyan-300 transition-colors">
                    {mod.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{mod.description}</p>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-medium text-cyan-300">
                  <span>Open module</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Security Activity Feed */}
      <section className="surface-panel rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-semibold font-display text-slate-100">
              Security Activity Log
            </h2>
            <p className="text-xs text-slate-400">
              Recent actions recorded during your local awareness session
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-[#070D19] rounded-lg border border-slate-800 overflow-x-auto">
            {(
              [
                { id: 'all', label: 'All' },
                { id: 'phishing', label: 'Phishing' },
                { id: 'checklist', label: 'Checklist' },
                { id: 'quiz', label: 'Quiz' },
                { id: 'threats', label: 'Threats' }
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActivityFilter(tab.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                  activityFilter === tab.id
                    ? 'bg-cyan-500/15 text-cyan-300'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {filteredActivity.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400 border border-dashed border-slate-800 rounded-lg">
            No activity recorded yet in this filter. Complete a simulation or checklist control to see updates here.
          </div>
        ) : (
          <div className="divide-y divide-slate-800/70">
            {filteredActivity.slice(0, 8).map((entry) => (
              <div
                key={entry.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div className="flex items-start sm:items-center gap-2.5 min-w-0">
                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 mt-0.5 sm:mt-0 ${
                      entry.outcome === 'positive'
                        ? 'text-emerald-400'
                        : entry.outcome === 'warning'
                          ? 'text-amber-400'
                          : 'text-cyan-400'
                    }`}
                  />
                  <div className="min-w-0">
                    <span className="font-medium text-slate-200">{entry.action}</span>
                    <span className="mx-1.5 text-slate-600" aria-hidden="true">·</span>
                    <span className="text-slate-400">{entry.detail}</span>
                  </div>
                </div>
                <span className="font-mono text-slate-500 tabular-nums shrink-0 pl-6 sm:pl-0">
                  {entry.timestamp}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
