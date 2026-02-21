import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, BarChart2, Users, Star } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line, ReferenceLine } from 'recharts';

const COLORS = ['#00ff41', '#00f3ff', '#ff00ff', '#fcee0a'];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-black-900 border border-neon-bright p-2 font-mono text-xs">
                <p className="text-neon-bright mb-1">{label}</p>
                {payload.map((e, i) => (
                    <p key={i} className="text-white flex gap-2 justify-between">
                        <span className="text-gray-400">{e.name}:</span>
                        <span className="text-neon-green">{e.value}</span>
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const GrowthBenchmarks = ({ data }) => {
    const analysis = useMemo(() => {
        if (!data) return null;

        const commits = data.commit_activity || [];
        const weeklyTotals = commits.map(w => w.total || 0);

        // Split into months (4 weeks each)
        const months = [];
        for (let i = 0; i < 12; i++) {
            const slice = weeklyTotals.slice(i * 4, (i + 1) * 4);
            const total = slice.reduce((s, c) => s + c, 0);
            const monthLabel = (() => {
                const d = new Date();
                d.setMonth(d.getMonth() - (11 - i));
                return d.toLocaleString('default', { month: 'short' });
            })();
            months.push({ label: monthLabel, commits: total, index: i });
        }

        // Month-over-Month Growth
        const momGrowth = months.map((m, i) => {
            const prev = i > 0 ? months[i - 1].commits : months[0].commits;
            const growth = prev > 0 ? Math.round(((m.commits - prev) / prev) * 100) : 0;
            return { ...m, growth };
        });

        // Benchmark comparisons (approximate tiers)
        const annualCommits = weeklyTotals.reduce((s, c) => s + c, 0);
        const stars = data.summary?.stars || 0;
        const forks = data.summary?.forks || 0;

        const benchmarks = [
            {
                metric: 'Annual Commits',
                yours: annualCommits,
                beginner: 50,
                intermediate: 200,
                advanced: 500,
                top: 1000,
                unit: 'commits/yr',
            },
            {
                metric: 'Stars',
                yours: stars,
                beginner: 1,
                intermediate: 50,
                advanced: 500,
                top: 2000,
                unit: 'stars',
            },
            {
                metric: 'Forks',
                yours: forks,
                beginner: 0,
                intermediate: 10,
                advanced: 100,
                top: 500,
                unit: 'forks',
            },
        ];

        const getLevel = (yours, tiers) => {
            if (yours >= tiers.top) return { label: '🏆 Top', color: '#fcee0a' };
            if (yours >= tiers.advanced) return { label: '⚡ Advanced', color: '#ff00ff' };
            if (yours >= tiers.intermediate) return { label: '🔵 Intermediate', color: '#00f3ff' };
            if (yours >= tiers.beginner) return { label: '🟢 Beginner', color: '#00ff41' };
            return { label: '⚪ Starting', color: '#4b5563' };
        };

        const benchmarksWithLevel = benchmarks.map(b => ({
            ...b,
            ...getLevel(b.yours, b),
        }));

        // Best month, worst month
        const sortedMonths = [...months].sort((a, b) => b.commits - a.commits);
        const bestMonth = sortedMonths[0];
        const worstMonth = sortedMonths[sortedMonths.length - 1];

        return { momGrowth, benchmarksWithLevel, bestMonth, worstMonth, annualCommits };
    }, [data]);

    if (!analysis) return null;

    const { momGrowth, benchmarksWithLevel, bestMonth, worstMonth, annualCommits } = analysis;
    const latestMoM = momGrowth[momGrowth.length - 1]?.growth || 0;

    return (
        <div className="glass-card !p-0 overflow-hidden border-neon-dim/20 bg-black-800/80">
            {/* Header */}
            <div className="p-4 border-b border-neon-dim/20 bg-neon-dim/5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-neon-bright" />
                    <h3 className="text-neon-bright font-bold text-xs uppercase tracking-[0.2em]">Growth Insights & Benchmarks</h3>
                </div>
                <span className={`text-[10px] font-mono font-bold flex items-center gap-1 ${latestMoM >= 0 ? 'text-neon-bright' : 'text-red-400'}`}>
                    {latestMoM >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    MoM: {latestMoM >= 0 ? '+' : ''}{latestMoM}%
                </span>
            </div>

            <div className="p-6 space-y-6">
                {/* Summary Row */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    <div className="border border-neon-dim/20 bg-black-900/50 p-3 text-center">
                        <div className="text-neon-bright text-2xl font-black">{annualCommits}</div>
                        <div className="text-[9px] text-gray-500 uppercase tracking-wider">Annual Commits</div>
                    </div>
                    <div className="border border-neon-bright/20 bg-neon-bright/5 p-3 text-center">
                        <div className="text-neon-bright text-sm font-bold">{bestMonth?.label || 'N/A'}</div>
                        <div className="text-[9px] text-gray-500 uppercase tracking-wider">Best Month</div>
                        <div className="text-[10px] text-neon-dim">{bestMonth?.commits} commits</div>
                    </div>
                    <div className="border border-red-500/20 bg-red-500/5 p-3 text-center">
                        <div className="text-red-400 text-sm font-bold">{worstMonth?.label || 'N/A'}</div>
                        <div className="text-[9px] text-gray-500 uppercase tracking-wider">Slowest Month</div>
                        <div className="text-[10px] text-red-400/60">{worstMonth?.commits} commits</div>
                    </div>
                </div>

                {/* Month-over-Month Bar Chart */}
                <div>
                    <h4 className="text-[10px] text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <BarChart2 className="w-3 h-3" /> Month-over-Month Growth %
                    </h4>
                    <div className="h-36 sm:h-44 container-grid-bg">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={momGrowth.slice(1)} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" strokeOpacity={0.2} vertical={false} />
                                <XAxis dataKey="label" stroke="#4b5563" fontSize={9} tickLine={false} axisLine={false} />
                                <YAxis stroke="#008F11" fontSize={9} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} />
                                <ReferenceLine y={0} stroke="#008F11" strokeDasharray="3 3" strokeOpacity={0.5} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="growth" name="MoM Growth %">
                                    {momGrowth.slice(1).map((entry, i) => (
                                        <Cell key={i} fill={entry.growth >= 0 ? '#00ff41' : '#ff3131'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Benchmark Comparison */}
                <div>
                    <h4 className="text-[10px] text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Users className="w-3 h-3" /> Benchmark vs. Developer Tiers
                    </h4>
                    <div className="space-y-4">
                        {benchmarksWithLevel.map((b, i) => {
                            const maxVal = b.top;
                            const yoursPct = Math.min(100, Math.round((Math.log10(b.yours + 1) / Math.log10(maxVal + 1)) * 100));
                            const tiers = [
                                { label: 'Bgn', val: b.beginner, pct: Math.round((Math.log10(b.beginner + 1) / Math.log10(maxVal + 1)) * 100) },
                                { label: 'Int', val: b.intermediate, pct: Math.round((Math.log10(b.intermediate + 1) / Math.log10(maxVal + 1)) * 100) },
                                { label: 'Adv', val: b.advanced, pct: Math.round((Math.log10(b.advanced + 1) / Math.log10(maxVal + 1)) * 100) },
                                { label: 'Top', val: b.top, pct: 100 },
                            ];
                            return (
                                <div key={i} className="space-y-2">
                                    <div className="flex items-center justify-between text-[10px] font-mono">
                                        <span className="text-gray-400 uppercase">{b.metric}</span>
                                        <span style={{ color: b.color }} className="font-bold">{b.label}</span>
                                    </div>
                                    <div className="relative w-full h-4 bg-black-900 border border-neon-dim/10 overflow-hidden">
                                        {/* Tier markers */}
                                        {tiers.map((t, ti) => (
                                            <div
                                                key={ti}
                                                className="absolute top-0 bottom-0 w-px bg-neon-dim/30 z-10"
                                                style={{ left: `${t.pct}%` }}
                                                title={`${t.label}: ${t.val}`}
                                            />
                                        ))}
                                        {/* Your score */}
                                        <div
                                            className="h-full transition-all duration-1000"
                                            style={{ width: `${yoursPct}%`, background: b.color, boxShadow: `0 0 8px ${b.color}80` }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-[8px] text-gray-600 font-mono">
                                        <span>Yours: {b.yours.toLocaleString()}</span>
                                        <span className="flex gap-2">
                                            {tiers.map(t => <span key={t.label}>{t.label}:{t.val >= 1000 ? `${(t.val / 1000).toFixed(0)}k` : t.val}</span>)}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="h-6 border-t border-neon-dim/10 bg-black-900/50 flex items-center justify-between px-4 text-[9px] text-gray-500 font-mono uppercase tracking-wider">
                <span>GROWTH_ENGINE :: BENCHMARKED</span>
                <span>PERIOD: 12M</span>
            </div>
        </div>
    );
};

export default GrowthBenchmarks;
