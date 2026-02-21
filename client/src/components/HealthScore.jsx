import React, { useMemo } from 'react';
import { Shield, Activity, GitCommit, Users, Star, TrendingUp } from 'lucide-react';

const HealthScore = ({ data }) => {
    const metrics = useMemo(() => {
        if (!data) return null;

        // 1. Activity Consistency (based on commit_activity variance)
        const commits = data.commit_activity || [];
        const totalCommitsArr = commits.map(w => w.total || 0);
        const avgCommits = totalCommitsArr.length > 0
            ? totalCommitsArr.reduce((a, b) => a + b, 0) / totalCommitsArr.length
            : 0;
        const activeWeeks = totalCommitsArr.filter(c => c > 0).length;
        const consistencyScore = Math.min(100, Math.round((activeWeeks / Math.max(totalCommitsArr.length, 1)) * 100));

        // 2. Recent Activity (last 8 weeks average vs first 8 weeks)
        const recent8 = totalCommitsArr.slice(-8).reduce((a, b) => a + b, 0) / 8;
        const first8 = totalCommitsArr.slice(0, 8).reduce((a, b) => a + b, 0) / 8;
        const recentActivityScore = Math.min(100, Math.round((recent8 / Math.max(first8, 0.1)) * 50));

        // 3. Repo Diversity (language count)
        const langCount = Object.keys(data.languages || {}).length;
        const diversityScore = Math.min(100, langCount * 15);

        // 4. Impact Score (stars + forks weighed)
        const { stars = 0, forks = 0 } = data.summary || {};
        const impactScore = Math.min(100, Math.round(Math.log10(stars + forks + 1) * 25));

        // 5. Community Score (contributors + closure rate)
        const closureRate = data.health?.closure_rate || 0;
        const contributorCount = (data.contributors || []).length;
        const communityScore = Math.min(100, Math.round((closureRate * 0.5) + (Math.log10(contributorCount + 1) * 20)));

        // Overall Health Score (weighted average)
        const overall = Math.round(
            consistencyScore * 0.25 +
            recentActivityScore * 0.2 +
            diversityScore * 0.15 +
            impactScore * 0.2 +
            communityScore * 0.2
        );

        return {
            overall,
            metrics: [
                { label: 'Activity Consistency', score: consistencyScore, icon: <Activity className="w-3 h-3" />, color: '#00ff41' },
                { label: 'Recent Momentum', score: recentActivityScore, icon: <TrendingUp className="w-3 h-3" />, color: '#00f3ff' },
                { label: 'Tech Diversity', score: diversityScore, icon: <GitCommit className="w-3 h-3" />, color: '#bc13fe' },
                { label: 'Impact Score', score: impactScore, icon: <Star className="w-3 h-3" />, color: '#fcee0a' },
                { label: 'Community Health', score: communityScore, icon: <Users className="w-3 h-3" />, color: '#ff00ff' },
            ]
        };
    }, [data]);

    if (!metrics) return null;

    const getGrade = (score) => {
        if (score >= 85) return { grade: 'S', color: '#00ff41', label: 'EXCEPTIONAL' };
        if (score >= 70) return { grade: 'A', color: '#39ff14', label: 'EXCELLENT' };
        if (score >= 55) return { grade: 'B', color: '#00f3ff', label: 'GOOD' };
        if (score >= 40) return { grade: 'C', color: '#fcee0a', label: 'AVERAGE' };
        return { grade: 'D', color: '#ff3131', label: 'NEEDS WORK' };
    };

    const { grade, color, label } = getGrade(metrics.overall);

    return (
        <div className="glass-card !p-0 overflow-hidden border-neon-dim/20 bg-black-800/80">
            {/* Header */}
            <div className="p-4 border-b border-neon-dim/20 bg-neon-dim/5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-neon-bright" />
                    <h3 className="text-neon-bright font-bold text-xs uppercase tracking-[0.2em]">Developer Health Score</h3>
                </div>
                <span className="text-[10px] text-neon-dim font-mono animate-pulse">LIVE_ANALYSIS</span>
            </div>

            <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-5 sm:gap-8">
                {/* Big Score Circle */}
                <div className="flex flex-col items-center gap-2 shrink-0">
                    <div className="relative w-36 h-36">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                            {/* Background ring */}
                            <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(0,255,65,0.1)" strokeWidth="8" />
                            {/* Score ring */}
                            <circle
                                cx="50" cy="50" r="40" fill="none"
                                stroke={color}
                                strokeWidth="8"
                                strokeLinecap="square"
                                strokeDasharray={`${(metrics.overall / 100) * 251.3} 251.3`}
                                style={{ filter: `drop-shadow(0 0 6px ${color})`, transition: 'stroke-dasharray 1.5s ease-out' }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-black text-white" style={{ textShadow: `0 0 15px ${color}` }}>
                                {grade}
                            </span>
                            <span className="text-[9px] text-gray-500 uppercase tracking-wider">{metrics.overall}/100</span>
                        </div>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest" style={{ color }}>{label}</span>
                </div>

                {/* Individual Metrics */}
                <div className="flex-1 space-y-3 w-full">
                    {metrics.metrics.map((m, i) => (
                        <div key={i} className="space-y-1">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2" style={{ color: m.color }}>
                                    {m.icon}
                                    <span className="text-[10px] uppercase tracking-wider text-gray-400">{m.label}</span>
                                </div>
                                <span className="text-[10px] font-mono font-bold" style={{ color: m.color }}>{m.score}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-black-900 border border-neon-dim/10 overflow-hidden">
                                <div
                                    className="h-full transition-all duration-1000 ease-out"
                                    style={{
                                        width: `${m.score}%`,
                                        background: m.color,
                                        boxShadow: `0 0 8px ${m.color}80`
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="h-6 border-t border-neon-dim/10 bg-black-900/50 flex items-center justify-between px-4 text-[9px] text-gray-500 font-mono uppercase tracking-wider">
                <span>HEALTH_INDEX :: v1.0</span>
                <span>SCORE_ENGINE: ACTIVE</span>
            </div>
        </div>
    );
};

export default HealthScore;
