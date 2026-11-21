import React, { useState } from 'react';
import { THREAT_PROFILES } from '../../data/threatsData';

interface ScoreGaugeProps {
  score: number;
  tier: string;
}

export const SecurityScoreGauge: React.FC<ScoreGaugeProps> = ({ score, tier }) => {
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const arcFraction = 0.75; // 270 degree gauge
  const totalArc = circumference * arcFraction;
  const filledArc = totalArc * (Math.max(0, Math.min(100, score)) / 100);

  const tierColor =
    score >= 80
      ? { stroke: '#10B981', text: 'text-emerald-400', label: 'Hardened Posture' }
      : score >= 55
        ? { stroke: '#22D3EE', text: 'text-cyan-400', label: 'Resilient Posture' }
        : score >= 30
          ? { stroke: '#F59E0B', text: 'text-amber-400', label: 'Developing Posture' }
          : { stroke: '#F43F5E', text: 'text-rose-400', label: 'Needs Hardening' };

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg className="w-44 h-44 -rotate-[225deg]" viewBox="0 0 160 160" aria-hidden="true">
        <defs>
          <linearGradient id="scoreArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor={tierColor.stroke} />
          </linearGradient>
        </defs>
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="rgba(148, 163, 184, 0.14)"
          strokeWidth="12"
          strokeDasharray={`${totalArc} ${circumference}`}
          strokeLinecap="round"
        />
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="url(#scoreArcGrad)"
          strokeWidth="12"
          strokeDasharray={`${filledArc} ${circumference}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 500ms cubic-bezier(0.16, 1, 0.3, 1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
        <span className="text-4xl font-bold font-display tracking-tight text-slate-50 tabular-nums">
          {score}
        </span>
        <span className="text-xs font-mono text-slate-400 tabular-nums">out of 100</span>
        <span className={`mt-1.5 text-xs font-semibold ${tierColor.text}`}>{tier}</span>
      </div>
    </div>
  );
};

interface RadarAxis {
  label: string;
  value: number;
}

export const PostureRadarChart: React.FC<{ axes: RadarAxis[] }> = ({ axes }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const cx = 140;
  const cy = 128;
  const maxR = 82;
  const levels = [25, 50, 75, 100];

  const getPoint = (index: number, valuePercent: number) => {
    const angle = (Math.PI * 2 * index) / axes.length - Math.PI / 2;
    const r = (Math.max(8, valuePercent) / 100) * maxR;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle)
    };
  };

  const polygonPoints = axes
    .map((axis, i) => {
      const pt = getPoint(i, axis.value);
      return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 280 256" className="w-full max-w-[290px] h-auto overflow-visible">
        <defs>
          <linearGradient id="radarFill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(34, 211, 238, 0.32)" />
            <stop offset="100%" stopColor="rgba(16, 185, 129, 0.24)" />
          </linearGradient>
        </defs>

        {/* Concentric rings */}
        {levels.map((lvl) => {
          const pts = axes
            .map((_, i) => {
              const p = getPoint(i, lvl);
              return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
            })
            .join(' ');
          return (
            <polygon
              key={lvl}
              points={pts}
              fill="none"
              stroke="rgba(148, 163, 184, 0.14)"
              strokeWidth="1"
            />
          );
        })}

        {/* Axis spokes */}
        {axes.map((_, i) => {
          const outer = getPoint(i, 100);
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={outer.x}
              y2={outer.y}
              stroke="rgba(148, 163, 184, 0.16)"
              strokeWidth="1"
            />
          );
        })}

        {/* Active data polygon */}
        <polygon
          points={polygonPoints}
          fill="url(#radarFill)"
          stroke="#22D3EE"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Vertices & labels */}
        {axes.map((axis, i) => {
          const pt = getPoint(i, axis.value);
          const labelPt = getPoint(i, 122);
          const isHovered = hoveredIdx === i;
          return (
            <g
              key={axis.label}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="cursor-pointer"
            >
              <circle
                cx={pt.x}
                cy={pt.y}
                r={isHovered ? 6 : 4}
                fill={isHovered ? '#34D399' : '#22D3EE'}
                stroke="#060B14"
                strokeWidth="2"
              />
              <text
                x={labelPt.x}
                y={labelPt.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-slate-300 text-[10.5px] font-medium"
              >
                {axis.label}
              </text>
              <text
                x={labelPt.x}
                y={labelPt.y + 13}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-cyan-300 text-[10px] font-mono tabular-nums"
              >
                {axis.value}%
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export const ThreatLandscapeChart: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>(THREAT_PROFILES[0].id);
  const selected = THREAT_PROFILES.find((t) => t.id === selectedId) ?? THREAT_PROFILES[0];

  const maxShare = Math.max(...THREAT_PROFILES.map((t) => t.prevalenceShare));

  return (
    <div className="space-y-4">
      <div className="space-y-2.5">
        {THREAT_PROFILES.map((threat) => {
          const widthPct = Math.round((threat.prevalenceShare / maxShare) * 100);
          const isSelected = threat.id === selectedId;
          const barColor =
            threat.severity === 'Critical'
              ? 'from-cyan-400 to-blue-500'
              : threat.severity === 'High'
                ? 'from-emerald-400 to-cyan-500'
                : 'from-blue-400 to-indigo-500';

          return (
            <button
              key={threat.id}
              type="button"
              onClick={() => setSelectedId(threat.id)}
              className={`w-full text-left rounded-lg px-3 py-2 transition-colors border ${
                isSelected
                  ? 'bg-slate-800/80 border-cyan-500/40'
                  : 'bg-transparent border-transparent hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center justify-between gap-3 text-xs mb-1.5">
                <span className="font-medium text-slate-200 truncate">{threat.name}</span>
                <span className="font-mono text-cyan-300 tabular-nums shrink-0">
                  {threat.prevalenceShare}% incident share
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-800/90 overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${barColor}`}
                  style={{
                    width: `${widthPct}%`,
                    transition: 'width 350ms cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                />
              </div>
            </button>
          );
        })}
      </div>

      <div className="rounded-lg bg-[#09101E] border border-slate-800 p-3.5 text-xs text-slate-300">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="font-semibold text-slate-100">{selected.name}</span>
          <span className="text-slate-400 font-mono">{selected.category} · {selected.severity}</span>
        </div>
        <p className="text-slate-400 leading-relaxed">{selected.summary}</p>
      </div>
    </div>
  );
};
