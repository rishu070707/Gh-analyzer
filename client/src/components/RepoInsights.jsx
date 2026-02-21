import React, { useMemo } from 'react';
import { Database, Activity, Users, Clock, Target, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#00ff41', '#00f3ff', '#ff00ff', '#fcee0a', '#bc13fe', '#ff3131'];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-black-900 border border-neon-bright p-2 shadow-[0_0_10px_rgba(0,255,65,0.3)]">
                <p className="text-neon-bright font-mono text-xs mb-1">{label}</p>
                {payload.map((e, i) => (
                    <p key={i} className="text-white text-xs flex gap-3 justify-between">
                        <span className="text-gray-400">{e.name}:</span>
                        <span className="text-neon-green font-mono">{e.value}</span>
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const MetricChip = ({ label, value, color = '#00ff41', icon }) => (
    <div className="border border-neon-dim/20 bg-black-900/50 p-3 flex flex-col gap-1">
        <div className="flex items-center gap-1 text-gray-500" style={{ color }}>
            {icon}
            <span className="text-[9px] uppercase tracking-wider">{label}</span>
        </div>
        <div className="text-white font-bold text-lg font-mono" style={{ textShadow: `0 0 8px ${color}60` }}>
            {value}
        </div>
    </div>
);

const RepoInsights = ({ data }) => {
    const insights = useMemo(() => {
        if (!data) return null;

        const commits = data.commit_activity || [];
        const weeklyTotals = commits.map(w => w.total || 0);
        const totalCommits = weeklyTotals.reduce((s, c) => s + c, 0);
        const activeWeeks = weeklyTotals.filter(c => c > 0).length;
        const peakWeek = Math.max(...weeklyTotals, 0);
        const avgWeekly = (totalCommits / Math.max(weeklyTotals.length, 1)).toFixed(1);

        // Complexity: based on language count and contributor diversity
        const langCount = Object.keys(data.languages || {}).length;
        const contributorCount = (data.contributors || []).length;
        const complexity = Math.min(10, Math.round((langCount * 1.5 + Math.log10(contributorCount + 1) * 2)));

        // Velocity: recent 4 weeks vs previous 4 weeks
        const recent4 = weeklyTotals.slice(-4).reduce((s, c) => s + c, 0);
        const prev4 = weeklyTotals.slice(-8, -4).reduce((s, c) => s + c, 0);
        const velocity = prev4 > 0 ? Math.round(((recent4 - prev4) / prev4) * 100) : 0;

        // Repo "age" category
        const created = new Date(data.summary?.created_at);
        const ageMonths = Math.round((Date.now() - created.getTime()) / (1000 * 60 * 60 * 24 * 30));

        // Monthly commit breakdown (last 12 weeks grouped in 4)
        const monthlyGroups = [
            { label: '9-12w', commits: weeklyTotals.slice(0, 4).reduce((s, c) => s + c, 0) },
            { label: '5-8w', commits: weeklyTotals.slice(4, 8).reduce((s, c) => s + c, 0) },
            { label: '1-4w', commits: weeklyTotals.slice(-8, -4).reduce((s, c) => s + c, 0) },
            { label: 'Recent', commits: weeklyTotals.slice(-4).reduce((s, c) => s + c, 0) },
        ];

        // Issue health
        const totalIssues = (data.summary?.total_issues_closed || 0) + (data.summary?.open_issues || 0);
        const closureRate = data.health?.closure_rate || 0;

        // Contributor concentration
        const totalContribs = (data.contributors || []).reduce((s, c) => s + c.contributions, 0);
        const topContribPct = totalContribs > 0
            ? Math.round(((data.contributors?.[0]?.contributions || 0) / totalContribs) * 100)
            : 0;

        return {
            totalCommits, activeWeeks, peakWeek, avgWeekly, complexity, velocity,
            ageMonths, monthlyGroups, closureRate, totalIssues, topContribPct, contributorCount
        };
    }, [data]);

    if (!insights) return null;

    return (
        <div className="glass-card !p-0 overflow-hidden border-neon-dim/20 bg-black-800/80">
            {/* Header */}
            <div className="p-4 border-b border-neon-dim/20 bg-neon-dim/5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-neon-bright" />
                    <h3 className="text-neon-bright font-bold text-xs uppercase tracking-[0.2em]">Advanced Repo Insights</h3>
                </div>
                <span className="text-[10px] text-neon-dim font-mono">DEEP_ANALYSIS</span>
            </div>

            <div className="p-6 space-y-6">
                {/* Key Metric Chips */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                    <MetricChip label="Avg Commits/Wk" value={insights.avgWeekly} icon={<Activity className="w-3 h-3" />} color="#00ff41" />
                    <MetricChip label="Complexity Score" value={`${insights.complexity}/10`} icon={<Zap className="w-3 h-3" />} color="#00f3ff" />
                    <MetricChip label="Velocity" value={`${insights.velocity >= 0 ? '+' : ''}${insights.velocity}%`} icon={<Target className="w-3 h-3" />} color={insights.velocity >= 0 ? '#00ff41' : '#ff3131'} />
                    <MetricChip label="Repo Age" value={`${insights.ageMonths}mo`} icon={<Clock className="w-3 h-3" />} color="#fcee0a" />
                </div>

                {/* Monthly Commit Bar Chart */}
                <div>
                    <h4 className="text-[10px] text-gray-500 uppercase tracking-widest mb-3">Commit Activity (Quarterly View)</h4>
                    <div className="h-40 sm:h-48 container-grid-bg">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={insights.monthlyGroups} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" strokeOpacity={0.2} vertical={false} />
                                <XAxis dataKey="label" stroke="#4b5563" fontSize={9} tickLine={false} axisLine={false} />
                                <YAxis stroke="#008F11" fontSize={9} tickLine={false} axisLine={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="commits" name="Commits" radius={[0, 0, 0, 0]}>
                                    {insights.monthlyGroups.map((_, i) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Health Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    {[
                        {
                            label: 'Contributor Concentration',
                            value: `${insights.topContribPct}%`,
                            sub: `Top contributor owns ${insights.topContribPct}% of commits`,
                            color: insights.topContribPct > 80 ? '#ff3131' : '#00ff41',
                            risk: insights.topContribPct > 80 ? 'HIGH RISK' : 'HEALTHY'
                        },
                        {
                            label: 'Issue Resolution',
                            value: `${insights.closureRate.toFixed(1)}%`,
                            sub: `${insights.totalIssues} total issues tracked`,
                            color: insights.closureRate > 70 ? '#00ff41' : insights.closureRate > 40 ? '#fcee0a' : '#ff3131',
                            risk: insights.closureRate > 70 ? 'EXCELLENT' : insights.closureRate > 40 ? 'AVERAGE' : 'POOR'
                        },
                        {
                            label: 'Activity Consistency',
                            value: `${insights.activeWeeks}w / 52w`,
                            sub: `Active weeks with commits`,
                            color: insights.activeWeeks > 30 ? '#00ff41' : insights.activeWeeks > 15 ? '#fcee0a' : '#ff3131',
                            risk: insights.activeWeeks > 30 ? 'CONSISTENT' : insights.activeWeeks > 15 ? 'MODERATE' : 'SPARSE'
                        },
                    ].map((m, i) => (
                        <div key={i} className="border border-neon-dim/20 bg-black-900/40 p-4">
                            <div className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">{m.label}</div>
                            <div className="text-2xl font-black mb-1" style={{ color: m.color }}>{m.value}</div>
                            <div className="text-[9px] font-mono text-gray-600">{m.sub}</div>
                            <div className="mt-2 inline-block px-2 py-0.5 text-[8px] border font-bold uppercase" style={{ borderColor: `${m.color}40`, color: m.color, background: `${m.color}10` }}>{m.risk}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="h-6 border-t border-neon-dim/10 bg-black-900/50 flex items-center justify-between px-4 text-[9px] text-gray-500 font-mono uppercase tracking-wider">
                <span>REPO_INSIGHTS :: DEEP_SCAN_COMPLETE</span>
                <span>PEAK: {insights.peakWeek} COMMITS/WK</span>
            </div>
        </div>
    );
};

export default RepoInsights;
