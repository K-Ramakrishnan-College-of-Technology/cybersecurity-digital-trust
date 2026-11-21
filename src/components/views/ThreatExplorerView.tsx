import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck
} from 'lucide-react';
import { THREAT_PROFILES } from '../../data/threatsData';
import { ThreatCategory } from '../../types/security';

interface ThreatExplorerViewProps {
  reviewedThreats: string[];
  onToggleReviewed: (threatId: string, threatName: string) => void;
}

export const ThreatExplorerView: React.FC<ThreatExplorerViewProps> = ({
  reviewedThreats,
  onToggleReviewed
}) => {
  const [selectedId, setSelectedId] = useState<string>(THREAT_PROFILES[0].id);
  const [categoryFilter, setCategoryFilter] = useState<'All' | ThreatCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredThreats = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return THREAT_PROFILES.filter((threat) => {
      const matchesCat = categoryFilter === 'All' || threat.category === categoryFilter;
      const matchesSearch =
        !q ||
        threat.name.toLowerCase().includes(q) ||
        threat.summary.toLowerCase().includes(q) ||
        threat.overview.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [categoryFilter, searchQuery]);

  const activeThreat =
    THREAT_PROFILES.find((t) => t.id === selectedId) ?? THREAT_PROFILES[0];
  const isReviewed = reviewedThreats.includes(activeThreat.id);

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <section className="surface-panel rounded-xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-cyan-300 font-medium">
              <span>Threat Intelligence Library</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-400 tabular-nums">
                {reviewedThreats.length}/{THREAT_PROFILES.length} briefings reviewed
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-display text-slate-50">
              Cyber Threat Explorer
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Understand how modern attacks operate across human, infrastructure, and data vectors—alongside concrete prevention and incident response playbooks.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-1 p-1 bg-[#070D19] rounded-lg border border-slate-800 overflow-x-auto">
            {(['All', 'Human-Targeted', 'Infrastructure', 'Data & Identity'] as const).map(
              (cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                    categoryFilter === cat
                      ? 'bg-cyan-500/15 text-cyan-300'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search threats..."
              aria-label="Search cyber threats"
              className="w-full rounded-lg bg-[#070D19] border border-slate-800 focus:border-cyan-400 focus:outline-none pl-9 pr-3 py-2 text-xs text-slate-100 placeholder:text-slate-500"
            />
          </div>
        </div>
      </section>

      {/* Split Layout: Threat Cards + Detailed Playbook */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 space-y-3">
          {filteredThreats.length === 0 ? (
            <div className="surface-panel rounded-xl p-6 text-center text-xs text-slate-400">
              No threats match your search or category filter.
            </div>
          ) : (
            filteredThreats.map((threat) => {
              const isSelected = threat.id === activeThreat.id;
              const reviewed = reviewedThreats.includes(threat.id);
              const severityColor =
                threat.severity === 'Critical'
                  ? 'text-rose-400'
                  : threat.severity === 'High'
                    ? 'text-amber-300'
                    : 'text-cyan-300';

              return (
                <button
                  key={threat.id}
                  type="button"
                  onClick={() => setSelectedId(threat.id)}
                  className={`w-full text-left rounded-xl p-4 transition-colors border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                    isSelected
                      ? 'bg-[#101C33] border-cyan-400/50'
                      : 'surface-panel hover:border-cyan-500/30 hover:bg-[#0E1729]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-[11px] mb-1.5">
                    <span className="text-slate-400">
                      {threat.category} <span aria-hidden="true">·</span>{' '}
                      <span className={severityColor}>{threat.severity}</span>
                    </span>
                    {reviewed && (
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-medium shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Reviewed</span>
                      </span>
                    )}
                  </div>
                  <h2 className="text-sm font-bold font-display text-slate-100 mb-1">
                    {threat.name}
                  </h2>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {threat.summary}
                  </p>
                </button>
              );
            })
          )}
        </div>

        {/* Threat Detail Playbook */}
        <div className="lg:col-span-7 surface-panel rounded-xl p-6 space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>{activeThreat.category}</span>
                <span aria-hidden="true">·</span>
                <span className="text-amber-300 font-medium">{activeThreat.severity} Risk</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">
                  {activeThreat.prevalenceShare}% incident share
                </span>
              </div>
              <h2 className="text-xl font-bold font-display text-slate-50">
                {activeThreat.name}
              </h2>
            </div>

            <button
              type="button"
              onClick={() => onToggleReviewed(activeThreat.id, activeThreat.name)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                isReviewed
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/35 hover:bg-emerald-500/25'
                  : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isReviewed ? 'Reviewed' : 'Mark Module Reviewed'}</span>
            </button>
          </div>

          {/* Attack Overview */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-cyan-300">Attack Overview</h3>
            <p className="text-sm text-slate-200 leading-relaxed">{activeThreat.overview}</p>
          </div>

          {/* Kill Chain Progression */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-cyan-300">Typical Attack Progression</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeThreat.killChain.map((step) => (
                <div
                  key={step.stage}
                  className="rounded-lg bg-[#080F1D] border border-slate-800 p-3.5 space-y-1"
                >
                  <div className="text-xs font-semibold text-slate-100">{step.stage}</div>
                  <p className="text-xs text-slate-400 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Warning Signs */}
          <div className="rounded-lg bg-amber-500/8 border border-amber-500/25 p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Early Warning Signs</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-200 list-disc pl-5">
              {activeThreat.warningSigns.map((sign, i) => (
                <li key={i}>{sign}</li>
              ))}
            </ul>
          </div>

          {/* Prevention vs Mitigation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg bg-[#080F1D] border border-slate-800 p-4 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Prevention Controls</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300 list-disc pl-4">
                {activeThreat.prevention.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg bg-[#080F1D] border border-slate-800 p-4 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>Incident Mitigation</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300 list-disc pl-4">
                {activeThreat.mitigation.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
            <Shield className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>Educational threat modeling reference for defensive awareness only.</span>
          </div>
        </div>
      </section>
    </div>
  );
};
