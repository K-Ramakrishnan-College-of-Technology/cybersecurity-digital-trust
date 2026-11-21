import React, { useMemo, useState } from 'react';
import { Check, CheckSquare, Copy, Search } from 'lucide-react';
import { SECURITY_CHECKLIST_ITEMS } from '../../data/trustAndQuizData';
import { ChecklistDomain } from '../../types/security';

interface ChecklistViewProps {
  completedIds: string[];
  onToggleItem: (itemId: string, itemTitle: string) => void;
}

const DOMAINS: ('All' | ChecklistDomain)[] = [
  'All',
  'Account & Identity',
  'Device & Software',
  'Network & Browsing',
  'Privacy & Backup'
];

export const ChecklistView: React.FC<ChecklistViewProps> = ({
  completedIds,
  onToggleItem
}) => {
  const [domainFilter, setDomainFilter] = useState<'All' | ChecklistDomain>('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedSummary, setCopiedSummary] = useState(false);

  const totalCount = SECURITY_CHECKLIST_ITEMS.length;
  const completedCount = completedIds.length;
  const overallPercent = Math.round((completedCount / totalCount) * 100);

  const domainMetrics = useMemo(() => {
    const groups: ChecklistDomain[] = [
      'Account & Identity',
      'Device & Software',
      'Network & Browsing',
      'Privacy & Backup'
    ];
    return groups.map((domain) => {
      const items = SECURITY_CHECKLIST_ITEMS.filter((i) => i.domain === domain);
      const done = items.filter((i) => completedIds.includes(i.id)).length;
      return {
        domain,
        done,
        total: items.length,
        percent: Math.round((done / items.length) * 100)
      };
    });
  }, [completedIds]);

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return SECURITY_CHECKLIST_ITEMS.filter((item) => {
      const done = completedIds.includes(item.id);
      const matchDomain = domainFilter === 'All' || item.domain === domainFilter;
      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'completed' && done) ||
        (statusFilter === 'pending' && !done);
      const matchQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q);
      return matchDomain && matchStatus && matchQuery;
    });
  }, [completedIds, domainFilter, searchQuery, statusFilter]);

  const handleExportMarkdown = async () => {
    const lines = [
      `# Personal Security Hardening Checklist (${overallPercent}% Complete)`,
      '',
      ...SECURITY_CHECKLIST_ITEMS.map((item) => {
        const mark = completedIds.includes(item.id) ? 'x' : ' ';
        return `- [${mark}] **${item.title}** (${item.domain} · ${item.priority})`;
      })
    ];
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 1800);
    } catch {
      // Clipboard unavailable in restricted sandbox
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <section className="surface-panel rounded-xl p-5 sm:p-6 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-cyan-300 font-medium">
              <span>Personal Hardening Tracker</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-400 tabular-nums">
                {completedCount} of {totalCount} controls verified
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-display text-slate-50">
              Digital Security Checklist
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Mark completed controls as you harden your accounts, devices, home network, and privacy posture.
            </p>
          </div>

          <button
            type="button"
            onClick={handleExportMarkdown}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-800 text-slate-100 border border-slate-700 hover:border-cyan-400/40 whitespace-nowrap shrink-0 self-start md:self-auto"
          >
            {copiedSummary ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-cyan-300" />
            )}
            <span>{copiedSummary ? 'Copied Markdown Report' : 'Copy Checklist Summary'}</span>
          </button>
        </div>

        {/* Overall Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium">Overall Completion</span>
            <span className="font-mono font-semibold text-emerald-400 tabular-nums">
              {overallPercent}%
            </span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400"
              style={{ width: `${overallPercent}%`, transition: 'width 350ms ease-out' }}
            />
          </div>
        </div>

        {/* 4 Domain Progress Mini-Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 pt-1">
          {domainMetrics.map((dm) => (
            <div
              key={dm.domain}
              className="rounded-lg bg-[#080F1D] border border-slate-800 p-3 space-y-1.5"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-200 truncate">{dm.domain}</span>
                <span className="font-mono text-cyan-300 tabular-nums shrink-0">
                  {dm.done}/{dm.total}
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-cyan-400"
                  style={{ width: `${dm.percent}%`, transition: 'width 300ms ease-out' }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Filter Toolbar */}
      <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-center gap-1 p-1 bg-[#0C1424] rounded-lg border border-slate-800 overflow-x-auto">
          {DOMAINS.map((dom) => (
            <button
              key={dom}
              type="button"
              onClick={() => setDomainFilter(dom)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                domainFilter === dom
                  ? 'bg-cyan-500/15 text-cyan-300'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {dom}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
          <div className="flex items-center gap-1 p-1 bg-[#0C1424] rounded-lg border border-slate-800">
            {(['all', 'pending', 'completed'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded text-xs font-medium capitalize whitespace-nowrap ${
                  statusFilter === st
                    ? 'bg-slate-800 text-slate-100'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="relative flex-1 sm:w-56">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter controls..."
              aria-label="Filter security checklist controls"
              className="w-full rounded-lg bg-[#0C1424] border border-slate-800 focus:border-cyan-400 focus:outline-none pl-9 pr-3 py-2 text-xs text-slate-100 placeholder:text-slate-500"
            />
          </div>
        </div>
      </section>

      {/* Checklist Items */}
      <section className="space-y-2.5">
        {filteredItems.length === 0 ? (
          <div className="surface-panel rounded-xl p-8 text-center text-xs text-slate-400">
            No checklist items match your current filter.
          </div>
        ) : (
          filteredItems.map((item) => {
            const isChecked = completedIds.includes(item.id);
            const priorityClass =
              item.priority === 'Critical'
                ? 'text-rose-400'
                : item.priority === 'High'
                  ? 'text-amber-300'
                  : 'text-cyan-300';

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onToggleItem(item.id, item.title)}
                aria-pressed={isChecked}
                className={`w-full text-left rounded-xl p-4 sm:p-5 border transition-colors flex items-start gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                  isChecked
                    ? 'bg-emerald-500/6 border-emerald-500/30'
                    : 'surface-panel hover:border-cyan-400/40'
                }`}
              >
                <div
                  className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                    isChecked
                      ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                      : 'bg-[#070D19] border-slate-600 text-transparent'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span
                      className={`text-sm font-semibold ${
                        isChecked ? 'text-emerald-200' : 'text-slate-100'
                      }`}
                    >
                      {item.title}
                    </span>
                    <span className="text-[11px] text-slate-400 shrink-0">
                      {item.domain} <span aria-hidden="true">·</span>{' '}
                      <span className={priorityClass}>{item.priority}</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                  <div className="flex items-center gap-1.5 text-[11px] text-cyan-300/90 pt-0.5">
                    <CheckSquare className="w-3.5 h-3.5 shrink-0" />
                    <span>{item.impactNote}</span>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </section>
    </div>
  );
};
