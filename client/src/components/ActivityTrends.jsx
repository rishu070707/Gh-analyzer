import React, { useMemo, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-black-900 border border-neon-bright p-2 shadow-[0_0_10px_rgba(0,255,65,0.3)] min-w-[150px]">
                <p className="text-neon-bright font-mono text-xs mb-1 uppercase tracking-wider">{label}</p>
                {payload.map((entry, i) => (
                    <p key={i} className="text-white text-sm font-bold flex justify-between items-center gap-4">
                        <span className="text-gray-400 capitalize text-xs">{entry.name}:</span>
                        <span className="text-neon-green font-mono">{entry.value}</span>
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const ActivityTrends = ({ data }) => {
    const [range, setRange] = useState(52); // weeks to show

    const { weeklyData, insight, growth } = useMemo(() => {
        if (!data) return { weeklyData: [], insight: {}, growth: 0 };

        let activity = data.commit_activity || [];
        if (activity.length === 0 && data.participation?.all) {
            activity = data.participation.all.map((count, index) => ({ total: count, week: index }));
        }

        const sliced = activity.slice(-range);
        const weeklyData = sliced.map((week, index) => {
            const date = new Date();
            date.setDate(date.getDate() - ((sliced.length - index) * 7));
            return {
                week: `W${index + 1}`,
                label: date.toLocaleString('default', { month: 'short', day: 'numeric' }),
                commits: week.total || 0,
            };
        });

        // Moving average (4-week window)
        const withMA = weeklyData.map((d, i) => {
            const window = weeklyData.slice(Math.max(0, i - 3), i + 1);
            const avg = Math.round(window.reduce((s, w) => s + w.commits, 0) / window.length);
            return { ...d, movingAvg: avg };
        });

        // Growth: compare last quarter vs previous quarter
        const half = Math.floor(withMA.length / 2);
        const firstHalf = withMA.slice(0, half).reduce((s, w) => s + w.commits, 0);
        const secondHalf = withMA.slice(half).reduce((s, w) => s + w.commits, 0);
        const growth = firstHalf > 0 ? Math.round(((secondHalf - firstHalf) / firstHalf) * 100) : 0;

        const totalWeekly = weeklyData.reduce((s, w) => s + w.commits, 0);
        const peakWeek = weeklyData.reduce((max, w) => w.commits > max.commits ? w : max, { commits: 0, label: 'N/A' });
        const activeWeeks = weeklyData.filter(w => w.commits > 0).length;

        return {
            weeklyData: withMA,
            insight: {
                total: totalWeekly,
                peak: peakWeek,
                activeWeeks,
                avgPerWeek: totalWeekly > 0 ? (totalWeekly / weeklyData.length).toFixed(1) : 0
            },
            growth
        };
    }, [data, range]);

    const isGrowth = growth >= 0;

    return (
        <div className="glass-card !p-0 overflow-hidden border-neon-dim/20 bg-black-800/80">
            {/* Header */}
            <div className="p-4 border-b border-neon-dim/20 bg-neon-dim/5 flex justify-between items-center flex-wrap gap-2">
                <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-neon-bright" />
                    <h3 className="text-neon-bright font-bold text-xs uppercase tracking-[0.2em]">Activity Trends</h3>
                </div>
                {/* Range selector */}
                <div className="flex gap-1">
                    {[12, 26, 52].map(r => (
                        <button
                            key={r}
                            onClick={() => setRange(r)}
                            className={`text-[9px] px-2 py-1 font-mono uppercase border transition-all duration-200 ${range === r
                                ? 'bg-neon-dim text-black border-neon-bright font-bold'
                                : 'border-neon-dim/30 text-neon-dim hover:border-neon-bright'
                                }`}
                        >
                            {r === 12 ? '3M' : r === 26 ? '6M' : '12M'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Growth Banner */}
            <div className="px-4 sm:px-6 pt-3 sm:pt-4 pb-2 flex flex-wrap items-center gap-2 sm:gap-4">
                <div className={`flex items-center gap-2 px-3 py-1.5 border text-[10px] sm:text-xs font-bold font-mono ${isGrowth ? 'border-neon-bright/50 text-neon-bright bg-neon-bright/5' : 'border-red-500/50 text-red-400 bg-red-500/5'}`}>
                    {isGrowth ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                    <span>{isGrowth ? '+' : ''}{growth}% vs prev period</span>
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-4 text-[9px] sm:text-[10px] text-gray-500 font-mono">
                    <span>TOTAL: <span className="text-white">{insight.total}</span></span>
                    <span>AVG/WK: <span className="text-white">{insight.avgPerWeek}</span></span>
                    <span>ACTIVE: <span className="text-white">{insight.activeWeeks}w</span></span>
                    <span>PEAK: <span className="text-white">{insight.peak?.commits}</span></span>
                </div>
            </div>

            {/* Chart */}
            <div className="h-52 sm:h-64 w-full px-2 sm:px-4 pb-4 container-grid-bg">
                {weeklyData.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                        <p className="text-neon-dim text-xs uppercase animate-pulse">NO DATA AVAILABLE</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="bgTrend" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#00ff41" stopOpacity={0.25} />
                                    <stop offset="95%" stopColor="#00ff41" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="bgMA" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#00f3ff" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#00f3ff" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" strokeOpacity={0.3} vertical={false} />
                            <XAxis dataKey="label" hide tick={{ fill: '#4b5563', fontSize: 9 }} tickLine={false} axisLine={false} interval={Math.floor(weeklyData.length / 6)} />
                            <YAxis stroke="#008F11" fontSize={9} tickLine={false} axisLine={false} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#000000', fillOpacity: 0.5 }} />
                            <Area type="monotone" dataKey="commits" stroke="#00ff41" strokeWidth={2} fill="url(#bgTrend)" animationDuration={1500} name="Commits" />
                            <Area type="monotone" dataKey="movingAvg" stroke="#00f3ff" strokeWidth={1.5} strokeDasharray="4 2" fill="url(#bgMA)" animationDuration={1500} name="4-wk Avg" />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 px-6 pb-4 text-[9px] font-mono text-gray-500">
                <div className="flex items-center gap-1"><div className="w-3 h-0.5 bg-neon-bright"></div><span>Weekly Commits</span></div>
                <div className="flex items-center gap-1"><div className="w-3 h-0.5 bg-cyan-400 border-dashed"></div><span>4-Week Moving Avg</span></div>
            </div>

            <div className="h-6 border-t border-neon-dim/10 bg-black-900/50 flex items-center justify-between px-4 text-[9px] text-gray-500 font-mono uppercase tracking-wider">
                <span>TREND_ANALYSIS :: ACTIVE</span>
                <span>DATA_RANGE: {range}W</span>
            </div>
        </div>
    );
};

export default ActivityTrends;
