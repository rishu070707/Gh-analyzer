import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ScatterChart, Scatter, ZAxis } from 'recharts';

// Cyberpunk Palette
const COLORS = [
    '#00ff41', // Neon Green (Classic)
    '#00f3ff', // Neon Cyan
    '#ff00ff', // Neon Pink
    '#fcee0a', // Neon Yellow
    '#ffffff', // Pure White (High Contrast)
    '#bc13fe', // Neon Purple
    '#ff3131', // Neon Red (Alert)
];

const ChartContainer = ({ title, stat, children, className = "", overlay = null }) => (
    <div className={`glass-card flex flex-col border-neon-dim/20 bg-black-800/80 rounded-none overflow-hidden relative ${className}`}>
        <div className="p-4 border-b border-neon-dim/20 bg-neon-dim/5 flex justify-between items-center z-10">
            <div>
                <h3 className="text-neon-bright font-bold text-xs uppercase tracking-[0.2em] flex items-center gap-2">
                    <span className="w-2 h-2 bg-neon-bright rounded-full animate-pulse"></span>
                    {title}
                </h3>
                {stat && (
                    <p className="text-[10px] text-neon-dim font-mono mt-1 pl-4 opacity-80 tracking-wide">
                        {stat}
                    </p>
                )}
            </div>
            <div className="flex gap-1">
                <div className="w-1 h-1 bg-neon-dim rounded-full"></div>
                <div className="w-1 h-1 bg-neon-dim rounded-full"></div>
                <div className="w-1 h-1 bg-neon-dim rounded-full"></div>
            </div>
        </div>
        <div className="flex-1 w-full relative p-4 container-grid-bg">
            <ResponsiveContainer width="100%" height="100%">
                {children}
            </ResponsiveContainer>
            {overlay && (
                <div className="absolute inset-0 flex items-center justify-center bg-black-900/60 backdrop-blur-sm z-20">
                    <div className="border border-neon-dim/50 p-4 bg-black-900 shadow-[0_0_15px_rgba(0,255,65,0.2)]">
                        <p className="text-neon-bright font-mono text-xs tracking-widest uppercase animate-pulse">
                            {overlay}
                        </p>
                    </div>
                </div>
            )}
        </div>
        <div className="h-6 border-t border-neon-dim/10 bg-black-900/50 flex items-center justify-between px-4 text-[9px] text-gray-500 font-mono uppercase tracking-wider z-10">
            <span className="flex items-center gap-1">
                <span className="w-1 h-1 bg-neon-dim/50 rounded-full"></span>
                LIVE_FEED
            </span>
            <span>SECURE :: ENCRYPTED</span>
        </div>
    </div>
);

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-black-900 border border-neon-bright p-2 shadow-[0_0_10px_rgba(0,255,65,0.3)] min-w-[150px] z-50">
                <p className="text-neon-bright font-mono text-xs mb-1 uppercase tracking-wider">{label ? `${label}` : ''}</p>
                {payload.map((entry, index) => (
                    <p key={index} className="text-white text-sm font-bold flex justify-between items-center gap-4">
                        <span className="capitalize text-gray-400">{entry.name}:</span>
                        <span className="text-neon-green font-mono">{entry.value}</span>
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const ChartGrid = ({ data }) => {
    const languageData = useMemo(() => {
        if (!data.languages) return [];
        return Object.entries(data.languages).map(([name, value]) => ({ name, value }));
    }, [data.languages]);

    const dominantLang = useMemo(() => {
        if (languageData.length === 0) return "N/A";
        const sorted = [...languageData].sort((a, b) => b.value - a.value);
        return sorted[0].name;
    }, [languageData]);

    const commitData = useMemo(() => {
        let activity = data.commit_activity;

        // Fallback: If commit_activity is empty but participation is available, use participation (weekly totals)
        if ((!Array.isArray(activity) || activity.length === 0) && data.participation?.all) {
            return data.participation.all.map((count, index) => ({
                week: `W${index + 1}`,
                commits: count || 0,
            }));
        }

        if (!Array.isArray(activity) || activity.length === 0) {
            return Array.from({ length: 52 }, (_, i) => ({ total: 0, week: `W${i + 1}`, commits: 0 }));
        }
        return activity.map((week, index) => ({
            week: `W${index + 1}`,
            commits: week.total || 0,
        }));
    }, [data.commit_activity, data.participation]);

    const stats = useMemo(() => {
        const total = commitData.reduce((acc, curr) => acc + curr.commits, 0);
        const max = Math.max(...commitData.map(d => d.commits));
        return { total, max };
    }, [commitData]);

    const totalCommits = useMemo(() => {
        return commitData.reduce((acc, curr) => acc + curr.commits, 0);
    }, [commitData]);

    const punchCardData = useMemo(() => {
        if (!data.punch_card || !Array.isArray(data.punch_card)) return [];
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return data.punch_card.map(([day, hour, count]) => ({
            day: days[day],
            hour,
            count,
            z: count
        })).filter(d => d.count > 0);
    }, [data.punch_card]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12 mb-12">
            {/* Language Usage Pie Chart */}
            <ChartContainer
                title="Language Codebase"
                stat={`DOMINANT: ${dominantLang} // SOURCES: ${languageData.length}`}
                className="h-96"
                overlay={languageData.length === 0 ? "NO LANGUAGE DATA" : null}
            >
                <PieChart margin={{ top: 10, bottom: 40 }}>
                    <Pie
                        data={languageData}
                        cx="50%"
                        cy="50%"
                        innerRadius="60%"
                        outerRadius="85%"
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                        nameKey="name"
                    >
                        {languageData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        verticalAlign="bottom"
                        align="center"
                        iconType="square"
                        wrapperStyle={{ paddingTop: '20px' }}
                        formatter={(value) => <span className="text-white font-mono text-[10px] uppercase hover:text-neon-bright transition-colors ml-1">{value}</span>}
                    />
                </PieChart>
            </ChartContainer>

            {/* Commit Activity Over Time */}
            <ChartContainer
                title="Commit Frequency"
                stat={`PEAK: ${stats.max} OPS/WEEK // TOTAL: ${stats.total}`}
                className="h-96"
                overlay={stats.total === 0 ? "SYSTEM IDLE / NO ACTIVITY" : null}
            >
                <AreaChart data={commitData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00ff41" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#00ff41" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} strokeOpacity={0.3} />
                    <XAxis dataKey="week" hide />
                    <YAxis
                        stroke="#008F11"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(val) => val > 0 ? val : ''}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#000000', fillOpacity: 0.5 }} />
                    <Area
                        type="monotone"
                        dataKey="commits"
                        stroke="#00ff41"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorCommits)"
                        animationDuration={2000}
                    />
                </AreaChart>
            </ChartContainer>

            {/* Punch Card (Scatter Plot) */}
            <ChartContainer
                title="Code Injection Patterns"
                stat="TEMPORAL DISTRIBUTION ANALYSIS"
                className="h-[450px] lg:col-span-2"
                overlay={punchCardData.length === 0 ? "NO TEMPORAL DATA VECTORS" : null}
            >
                <ScatterChart margin={{ top: 20, right: 40, bottom: 30, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} horizontal={false} strokeOpacity={0.2} />
                    <XAxis
                        type="number"
                        dataKey="hour"
                        name="Hour"
                        unit="h"
                        domain={[0, 23]}
                        tickCount={24}
                        stroke="#008F11"
                        fontSize={10}
                        tickFormatter={(h) => `${h}:00`}
                        label={{ value: 'DECODED_TIME_UNITS', position: 'bottom', offset: 10, fill: '#008F11', fontSize: 9, fontFamily: 'monospace' }}
                    />
                    <YAxis
                        type="category"
                        dataKey="day"
                        name="Day"
                        stroke="#008F11"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        width={50}
                    />
                    <ZAxis type="number" dataKey="count" range={[50, 400]} name="Commits" />
                    <Tooltip cursor={{ fill: '#000000', fillOpacity: 0.5 }} content={<CustomTooltip />} />
                    <Scatter name="Commits" data={punchCardData} fill="#00f3ff" shape="square">
                        {punchCardData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Scatter>
                </ScatterChart>
            </ChartContainer>

            {/* Year-long Contribution Heatmap */}
            <div className="glass-card flex flex-col min-h-96 lg:col-span-2 overflow-hidden border-neon-dim/20 bg-black-800/80 rounded-none relative">

                {/* Overlay for Heatmap */}
                {totalCommits === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black-900/60 backdrop-blur-sm z-20">
                        <div className="border border-red-500/50 p-4 bg-black-900 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                            <p className="text-red-500 font-mono text-xs tracking-widest uppercase animate-pulse flex items-center gap-2">
                                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                NO SIGNAL DETECTED
                            </p>
                        </div>
                    </div>
                )}

                <div className="p-4 border-b border-neon-dim/20 bg-neon-dim/5 flex justify-between items-center z-10">
                    <div>
                        <h3 className="text-neon-bright font-bold text-xs uppercase tracking-[0.2em] flex items-center gap-2">
                            <span className="w-2 h-2 bg-neon-bright rounded-full animate-pulse"></span>
                            Temporal Activity Map
                        </h3>
                        <p className="text-[10px] text-neon-dim font-mono mt-1 pl-4 opacity-80 tracking-wide">
                            YEARLY_DATA_DENSITY // TOTAL_NODES: 365
                        </p>
                    </div>
                    <div className="flex gap-1 text-[10px] text-neon-dim items-center font-mono uppercase">
                        <span>Idle</span>
                        <div className="w-2 h-2 bg-black-900 border border-neon-dim/30"></div>
                        <div className="w-2 h-2 bg-neon-dim/40"></div>
                        <div className="w-2 h-2 bg-neon-dim"></div>
                        <div className="w-2 h-2 bg-neon-bright"></div>
                        <span>Surge</span>
                    </div>
                </div>

                <div className="flex-1 w-full overflow-x-auto p-4 scrollbar-hide flex items-center justify-center container-grid-bg">
                    <div className="flex gap-[3px]">
                        {(() => {
                            // Render empty grid if no data, otherwise render data
                            const activity = (data.commit_activity && data.commit_activity.length > 0)
                                ? data.commit_activity
                                : Array.from({ length: 52 }, (_, i) => ({ days: [0, 0, 0, 0, 0, 0, 0], week: i }));

                            return activity.map((week, wIndex) => (
                                <div key={week.week || wIndex} className="flex flex-col gap-[3px]">
                                    {week.days && week.days.map((dayCount, dIndex) => {
                                        let colorClass = 'bg-black-900 border border-neon-dim/10';
                                        if (dayCount > 10) colorClass = 'bg-neon-bright shadow-[0_0_8px_rgba(57,255,20,0.8)] z-10';
                                        else if (dayCount > 5) colorClass = 'bg-neon-green shadow-[0_0_5px_rgba(0,255,65,0.5)]';
                                        else if (dayCount > 2) colorClass = 'bg-neon-dim';
                                        else if (dayCount > 0) colorClass = 'bg-neon-dim/30';

                                        return (
                                            <div
                                                key={`${wIndex}-${dIndex}`}
                                                className={`w-3 h-3 transition-all duration-300 hover:scale-125 relative group ${colorClass}`}
                                            >
                                                {dayCount > 0 && (
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-black-900 text-neon-bright text-[9px] px-2 py-1 border border-neon-bright whitespace-nowrap z-50 pointer-events-none font-mono">
                                                        {dayCount} OPS
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ));
                        })()}
                    </div>
                </div>
                {/* Tech Footer for Heatmap */}
                <div className="h-6 border-t border-neon-dim/10 bg-black-900/50 flex items-center justify-between px-4 text-[9px] text-gray-500 font-mono uppercase tracking-wider z-10">
                    <span className="flex items-center gap-1">
                        <span className="w-1 h-1 bg-neon-dim/50 rounded-full"></span>
                        ARCHIVE_STATUS: {totalCommits > 0 ? 'COMPLETE' : 'EMPTY'}
                    </span>
                    <span>RETENTION: 365_DAYS</span>
                </div>
            </div>
        </div>
    );
};

export default ChartGrid;
