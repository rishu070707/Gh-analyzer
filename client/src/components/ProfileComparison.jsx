import React, { useState, useMemo } from 'react';
import { Users, GitCommit, Star, GitFork, Activity, Code, Zap } from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { analyzeRepo } from '../services/api';

const COLORS = ['#00ff41', '#00f3ff', '#ff00ff', '#fcee0a', '#bc13fe', '#ff3131'];

const MetricBar = ({ label, valueA, valueB, max }) => {
    const pctA = Math.min(100, Math.round((valueA / Math.max(max, 1)) * 100));
    const pctB = Math.min(100, Math.round((valueB / Math.max(max, 1)) * 100));
    return (
        <div className="space-y-1">
            <div className="flex justify-between text-[9px] font-mono text-gray-500 uppercase tracking-wider">
                <span className="text-neon-bright">{valueA.toLocaleString()}</span>
                <span className="text-gray-400">{label}</span>
                <span className="text-cyan-400">{valueB.toLocaleString()}</span>
            </div>
            <div className="flex h-2 gap-1">
                <div className="flex-1 bg-black-900 border border-neon-dim/10 overflow-hidden flex items-center justify-end">
                    <div className="h-full bg-neon-bright transition-all duration-1000" style={{ width: `${pctA}%` }} />
                </div>
                <div className="w-px bg-neon-dim/30"></div>
                <div className="flex-1 bg-black-900 border border-neon-dim/10 overflow-hidden">
                    <div className="h-full bg-cyan-400 transition-all duration-1000" style={{ width: `${pctB}%` }} />
                </div>
            </div>
        </div>
    );
};

const calculateNormalizedScore = (data) => {
    if (!data) return [];
    const commits = data.commit_activity || [];
    const totalCommits = commits.reduce((s, w) => s + (w.total || 0), 0);
    const activeWeeks = commits.filter(w => w.total > 0).length;
    const langCount = Object.keys(data.languages || {}).length;
    const closureRate = data.health?.closure_rate || 0;
    const contributors = (data.contributors || []).length;

    return [
        { metric: 'Commits', value: Math.min(100, Math.round(Math.log10(totalCommits + 1) * 25)) },
        { metric: 'Stars', value: Math.min(100, Math.round(Math.log10((data.summary?.stars || 0) + 1) * 30)) },
        { metric: 'Consistency', value: Math.min(100, Math.round((activeWeeks / 52) * 100)) },
        { metric: 'Tech Stack', value: Math.min(100, langCount * 15) },
        { metric: 'Community', value: Math.min(100, Math.round(closureRate * 0.5 + Math.log10(contributors + 1) * 20)) },
        { metric: 'Impact', value: Math.min(100, Math.round(Math.log10((data.summary?.forks || 0) + 1) * 30)) },
    ];
};

const ProfileComparison = ({ primaryData }) => {
    const [compareUrl, setCompareUrl] = useState('');
    const [compareData, setCompareData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCompare = async () => {
        if (!compareUrl.trim()) return;
        setLoading(true);
        setError('');
        try {
            const result = await analyzeRepo(compareUrl.trim());
            setCompareData(result.data);
        } catch (err) {
            setError(err.error || err.message || 'Failed to fetch comparison repo');
        } finally {
            setLoading(false);
        }
    };

    const radarData = useMemo(() => {
        if (!primaryData) return [];
        const scoresA = calculateNormalizedScore(primaryData);
        const scoresB = compareData ? calculateNormalizedScore(compareData) : null;

        return scoresA.map((d, i) => ({
            metric: d.metric,
            [primaryData.summary?.name || 'A']: d.value,
            ...(scoresB ? { [compareData.summary?.name || 'B']: scoresB[i].value } : {})
        }));
    }, [primaryData, compareData]);

    const primaryName = primaryData?.summary?.name || 'Repo A';
    const compareName = compareData?.summary?.name || 'Repo B';

    return (
        <div className="glass-card !p-0 overflow-hidden border-neon-dim/20 bg-black-800/80">
            {/* Header */}
            <div className="p-4 border-b border-neon-dim/20 bg-neon-dim/5 flex items-center gap-2">
                <Users className="w-4 h-4 text-neon-bright" />
                <h3 className="text-neon-bright font-bold text-xs uppercase tracking-[0.2em]">Profile Comparison</h3>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-neon-dim/10">
                <div className="flex flex-col sm:flex-row gap-2">
                    <input
                        type="url"
                        inputMode="url"
                        value={compareUrl}
                        onChange={e => setCompareUrl(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleCompare()}
                        placeholder="https://github.com/owner/repo..."
                        className="flex-1 bg-black-900 border border-neon-dim/30 text-white text-xs font-mono px-3 py-2.5 focus:outline-none focus:border-neon-bright placeholder-gray-700"
                        autoCapitalize="none" autoCorrect="off"
                    />
                    <button
                        onClick={handleCompare}
                        disabled={loading}
                        className="px-4 py-2 bg-neon-dim/10 border border-neon-dim/40 text-neon-bright text-xs font-bold uppercase tracking-wider hover:bg-neon-bright hover:text-black transition-all duration-200 disabled:opacity-50"
                    >
                        {loading ? 'SCANNING...' : 'COMPARE'}
                    </button>
                </div>
                {error && <p className="text-red-400 text-[10px] font-mono mt-2 uppercase">{error}</p>}
            </div>

            {/* Comparison Content */}
            <div className="p-6">
                {/* Legend */}
                <div className="flex gap-6 mb-6 text-[10px] font-mono">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-neon-bright"></div>
                        <span className="text-neon-bright uppercase">{primaryName}</span>
                    </div>
                    {compareData && (
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-cyan-400"></div>
                            <span className="text-cyan-400 uppercase">{compareName}</span>
                        </div>
                    )}
                </div>

                {/* Radar Chart */}
                {compareData && (
                    <div className="h-52 sm:h-64 mb-4 sm:mb-6 container-grid-bg">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                                <PolarGrid stroke="#008F11" strokeOpacity={0.3} />
                                <PolarAngleAxis dataKey="metric" tick={{ fill: '#6b7280', fontSize: 9, fontFamily: 'monospace' }} />
                                <Radar name={primaryName} dataKey={primaryName} stroke="#00ff41" fill="#00ff41" fillOpacity={0.15} strokeWidth={2} />
                                {compareData && <Radar name={compareName} dataKey={compareName} stroke="#00f3ff" fill="#00f3ff" fillOpacity={0.15} strokeWidth={2} />}
                                <Tooltip formatter={(v, name) => [`${v}/100`, name]} contentStyle={{ background: '#050505', border: '1px solid #008F11', fontFamily: 'monospace', fontSize: 10 }} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {/* Metric Bars */}
                <div className="space-y-3">
                    {[
                        { label: 'STARS', a: primaryData?.summary?.stars || 0, b: compareData?.summary?.stars || 0, max: Math.max(primaryData?.summary?.stars || 0, compareData?.summary?.stars || 1) },
                        { label: 'FORKS', a: primaryData?.summary?.forks || 0, b: compareData?.summary?.forks || 0, max: Math.max(primaryData?.summary?.forks || 0, compareData?.summary?.forks || 1) },
                        { label: 'CONTRIBUTORS', a: primaryData?.contributors?.length || 0, b: compareData?.contributors?.length || 0, max: Math.max(primaryData?.contributors?.length || 0, compareData?.contributors?.length || 1) },
                        {
                            label: 'COMMITS/YR', a: Math.round((primaryData?.commit_activity || []).reduce((s, w) => s + (w.total || 0), 0)),
                            b: Math.round((compareData?.commit_activity || []).reduce((s, w) => s + (w.total || 0), 0)),
                            max: Math.max(1, (primaryData?.commit_activity || []).reduce((s, w) => s + (w.total || 0), 0), (compareData?.commit_activity || []).reduce((s, w) => s + (w.total || 0), 0))
                        },
                    ].map((m, i) => (
                        <MetricBar key={i} label={m.label} valueA={m.a} valueB={compareData ? m.b : 0} max={m.max} />
                    ))}
                </div>

                {!compareData && (
                    <div className="mt-4 p-4 border border-neon-dim/20 bg-neon-dim/5 text-center">
                        <p className="text-neon-dim text-xs font-mono uppercase tracking-wider">Enter a second repo URL to compare side by side</p>
                    </div>
                )}
            </div>

            <div className="h-6 border-t border-neon-dim/10 bg-black-900/50 flex items-center justify-between px-4 text-[9px] text-gray-500 font-mono uppercase tracking-wider">
                <span>COMPARISON_ENGINE :: ACTIVE</span>
                <span>{compareData ? 'DUAL_TARGET_LOCKED' : 'AWAITING_SECOND_TARGET'}</span>
            </div>
        </div>
    );
};

export default ProfileComparison;
