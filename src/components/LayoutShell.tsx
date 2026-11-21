import React, { useState } from 'react';
import {
  Activity,
  Award,
  CheckSquare,
  Download,
  KeyRound,
  Lock,
  MailWarning,
  Menu,
  RotateCcw,
  Shield,
  ShieldAlert,
  X
} from 'lucide-react';
import { ModuleId } from '../types/security';

interface NavItem {
  id: ModuleId;
  label: string;
  shortDesc: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Security Dashboard',
    shortDesc: 'Live posture score, threat analytics, and activity overview',
    icon: Activity
  },
  {
    id: 'phishing',
    label: 'Phishing Detection Lab',
    shortDesc: 'Inspect simulated emails, headers, and deceptive URLs',
    icon: MailWarning
  },
  {
    id: 'passwords',
    label: 'Password Security Lab',
    shortDesc: 'Local entropy analysis, crack resistance, and passphrases',
    icon: KeyRound
  },
  {
    id: 'threats',
    label: 'Cyber Threat Explorer',
    shortDesc: 'Kill-chain anatomy, prevention, and mitigation playbooks',
    icon: ShieldAlert
  },
  {
    id: 'trust',
    label: 'Digital Trust & Privacy',
    shortDesc: 'MFA comparisons, encryption, permissions, and footprint',
    icon: Lock
  },
  {
    id: 'quiz',
    label: 'Cybersecurity Quiz',
    shortDesc: 'Interactive knowledge assessment and cohort benchmark',
    icon: Award
  },
  {
    id: 'checklist',
    label: 'Security Checklist',
    shortDesc: 'Actionable personal hardening controls and completion tracking',
    icon: CheckSquare
  }
];

interface LayoutShellProps {
  activeModule: ModuleId;
  onSelectModule: (id: ModuleId) => void;
  overallScore: number;
  scoreTier: string;
  onResetProgress: () => void;
  children: React.ReactNode;
}

export const LayoutShell: React.FC<LayoutShellProps> = ({
  activeModule,
  onSelectModule,
  overallScore,
  scoreTier,
  onResetProgress,
  children
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const currentNav = NAV_ITEMS.find((n) => n.id === activeModule) ?? NAV_ITEMS[0];

  const handleNavigate = (id: ModuleId) => {
    onSelectModule(id);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#060B14] text-slate-100 flex flex-col lg:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-[#080F1D] border-r border-cyan-500/15">
        <div className="h-16 px-5 flex items-center gap-2.5 border-b border-slate-800/80">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center shrink-0">
            <Shield className="w-4 h-4 text-cyan-300" />
          </div>
          <span className="font-display font-semibold text-sm tracking-tight text-slate-50 whitespace-nowrap truncate">
            Cybersecurity &amp; Trust
          </span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" aria-label="Primary Navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                  isActive
                    ? 'bg-cyan-500/12 text-cyan-300 border border-cyan-400/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-300' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800/80 space-y-3">
          <div className="rounded-lg bg-[#0C1424] border border-slate-800 p-3">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
              <span>Digital Security Score</span>
              <span className="font-mono text-cyan-300 tabular-nums">{overallScore}/100</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden mb-1.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400"
                style={{ width: `${overallScore}%`, transition: 'width 400ms ease-out' }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Tier: {scoreTier}</span>
              <span>Local training</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <a
              href="/docs/Cybersecurity_Digital_Trust_Report.pdf"
              download="Cybersecurity_Digital_Trust_Report.pdf"
              className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg text-[11px] font-medium bg-[#0C1424] border border-slate-800 text-cyan-300 hover:border-cyan-400/40 hover:bg-slate-800/60 transition-colors whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5 shrink-0" />
              <span>Report PDF</span>
            </a>
            <a
              href="/docs/Cybersecurity_Digital_Trust_Presentation.pptx"
              download="Cybersecurity_Digital_Trust_Presentation.pptx"
              className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg text-[11px] font-medium bg-[#0C1424] border border-slate-800 text-emerald-300 hover:border-emerald-400/40 hover:bg-slate-800/60 transition-colors whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5 shrink-0" />
              <span>Slides PPTX</span>
            </a>
          </div>

          {!confirmReset ? (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Progress</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onResetProgress();
                  setConfirmReset(false);
                }}
                className="flex-1 px-2.5 py-1.5 rounded-md text-xs font-medium bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30"
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="flex-1 px-2.5 py-1.5 rounded-md text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Shell */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Top Header Bar (compact 3-zone contract, <=15% mobile height) */}
        <header className="sticky top-0 z-30 h-16 bg-[#060B14]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-300 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="hidden sm:inline">Cybersecurity &amp; Digital Trust</span>
                <span className="hidden sm:inline" aria-hidden="true">/</span>
                <span className="text-cyan-300 font-medium truncate">{currentNav.label}</span>
              </div>
              <p className="text-xs text-slate-400 truncate hidden md:block">
                {currentNav.shortDesc}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="hidden sm:inline text-xs text-slate-400 font-mono tabular-nums">
              Score: <strong className="text-emerald-400">{overallScore}%</strong>
            </span>
            <button
              type="button"
              onClick={() =>
                handleNavigate(activeModule === 'checklist' ? 'dashboard' : 'checklist')
              }
              className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
            >
              {activeModule === 'checklist' ? 'Back to Dashboard' : 'Security Checklist'}
            </button>
          </div>
        </header>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />
            <div className="relative w-72 max-w-[85vw] bg-[#080F1D] border-r border-slate-800 h-full flex flex-col p-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-cyan-300" />
                  <span className="font-display font-semibold text-sm text-slate-100">
                    Cybersecurity &amp; Trust
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-100"
                  aria-label="Close navigation menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeModule === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleNavigate(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-400/30'
                          : 'text-slate-300 hover:bg-slate-800/60'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
              <div className="pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    onResetProgress();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-800"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Local Progress</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Viewport Container */}
        <main className="flex-1 cyber-grid-bg">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
