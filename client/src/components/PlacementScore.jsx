import React, { useMemo } from 'react';
import { GraduationCap, CheckCircle, XCircle, AlertCircle, TrendingUp } from 'lucide-react';

const PlacementScore = ({ data }) => {
    const result = useMemo(() => {
        if (!data) return null;

        const commits = (data.commit_activity || []).reduce((s, w) => s + (w.total || 0), 0);
        const activeWeeks = (data.commit_activity || []).filter(w => w.total > 0).length;
        const langCount = Object.keys(data.languages || {}).length;
        const stars = data.summary?.stars || 0;
        const forks = data.summary?.forks || 0;
        const contributors = (data.contributors || []).length;
        const closureRate = data.health?.closure_rate || 0;
        const hasDescription = Boolean(data.summary?.description);
        const recentWeeks = (data.commit_activity || []).slice(-8).filter(w => w.total > 0).length;

        // Scoring criteria
        const criteria = [
            {
                label: 'Consistent Commit Activity',
                desc: 'At least 20 active weeks in the last year',
                pass: activeWeeks >= 20,
                weight: 20,
                score: Math.min(20, Math.round((activeWeeks / 52) * 20)),
                suggestion: 'Commit at least 3-4 times per week to show consistent activity',
            },
            {
                label: 'Recent Activity',
                desc: 'Active in last 8 weeks (≥4 active weeks)',
                pass: recentWeeks >= 4,
                weight: 15,
                score: Math.min(15, Math.round((recentWeeks / 8) * 15)),
                suggestion: 'Ensure you have recent commits to show you are actively coding',
            },
            {
                label: 'Tech Stack Diversity',
                desc: 'At least 3 languages/technologies',
                pass: langCount >= 3,
                weight: 15,
                score: Math.min(15, langCount * 4),
                suggestion: 'Work on projects using different languages (e.g., Python + JavaScript + SQL)',
            },
            {
                label: 'Project Impact',
                desc: 'Repository has stars or forks',
                pass: stars > 0 || forks > 0,
                weight: 15,
                score: Math.min(15, Math.round(Math.log10(stars + forks + 1) * 10)),
                suggestion: 'Share repos on communities, social media to gain recognition',
            },
            {
                label: 'Commit Volume',
                desc: 'More than 100 commits in the past year',
                pass: commits >= 100,
                weight: 15,
                score: Math.min(15, Math.round(Math.log10(commits + 1) * 6)),
                suggestion: 'Aim for 100+ commits per year. Break large features into small commits',
            },
            {
                label: 'Repository Documentation',
                desc: 'Repository has a description',
                pass: hasDescription,
                weight: 10,
                score: hasDescription ? 10 : 0,
                suggestion: 'Add clear descriptions to all public repositories — recruiters read them',
            },
            {
                label: 'Issue Management',
                desc: 'Issue closure rate above 50%',
                pass: closureRate >= 50,
                weight: 10,
                score: Math.min(10, Math.round(closureRate * 0.1)),
                suggestion: 'Close old issues or add labels to show active project maintenance',
            },
        ];

        const totalScore = criteria.reduce((s, c) => s + c.score, 0);
        const maxScore = criteria.reduce((s, c) => s + c.weight, 0);
        const normalized = Math.round((totalScore / maxScore) * 100);

        const getReadinessLevel = (score) => {
            if (score >= 80) return { label: 'PLACEMENT READY', color: '#00ff41', emoji: '🚀' };
            if (score >= 60) return { label: 'NEARLY READY', color: '#00f3ff', emoji: '⚡' };
            if (score >= 40) return { label: 'DEVELOPING', color: '#fcee0a', emoji: '🔧' };
            return { label: 'NEEDS IMPROVEMENT', color: '#ff3131', emoji: '⚠️' };
        };

        return { criteria, normalized, ...getReadinessLevel(normalized) };
    }, [data]);

    if (!result) return null;

    const failedCriteria = result.criteria.filter(c => !c.pass);

    return (
        <div className="glass-card !p-0 overflow-hidden border-neon-dim/20 bg-black-800/80">
            {/* Header */}
            <div className="p-4 border-b border-neon-dim/20 bg-neon-dim/5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-neon-bright" />
                    <h3 className="text-neon-bright font-bold text-xs uppercase tracking-[0.2em]">Placement Readiness Score</h3>
                </div>
                <span className="text-[10px] text-neon-dim font-mono uppercase">Student Mode</span>
            </div>

            <div className="p-6 space-y-6">
                {/* Big Score */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                    <div className="shrink-0 text-center">
                        <div className="text-5xl sm:text-6xl font-black" style={{ color: result.color, textShadow: `0 0 20px ${result.color}60` }}>
                            {result.normalized}
                        </div>
                        <div className="text-[9px] text-gray-500 uppercase tracking-wider">/ 100</div>
                    </div>
                    <div>
                        <div className="text-lg font-bold uppercase tracking-wider mb-1" style={{ color: result.color }}>
                            {result.emoji} {result.label}
                        </div>
                        <div className="w-48 h-2 bg-black-900 border border-neon-dim/10 overflow-hidden mb-3">
                            <div
                                className="h-full transition-all duration-1000"
                                style={{ width: `${result.normalized}%`, background: result.color, boxShadow: `0 0 6px ${result.color}80` }}
                            />
                        </div>
                        <p className="text-gray-500 text-[10px] font-mono">
                            {result.normalized >= 80
                                ? 'Your profile is ready for internship/job applications!'
                                : `${result.criteria.filter(c => c.pass).length}/${result.criteria.length} criteria met. See suggestions below.`
                            }
                        </p>
                    </div>
                </div>

                {/* Criteria List */}
                <div className="space-y-2">
                    <h4 className="text-[10px] text-gray-500 uppercase tracking-widest mb-3">Evaluation Criteria</h4>
                    {result.criteria.map((criterion, i) => (
                        <div key={i} className={`flex items-start gap-3 p-3 border transition-all ${criterion.pass ? 'border-neon-bright/20 bg-neon-bright/5' : 'border-red-500/20 bg-red-500/5'}`}>
                            {criterion.pass
                                ? <CheckCircle className="w-4 h-4 text-neon-bright shrink-0 mt-0.5" />
                                : <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                            }
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                    <span className={`text-[10px] font-bold uppercase tracking-wide ${criterion.pass ? 'text-white' : 'text-gray-400'}`}>
                                        {criterion.label}
                                    </span>
                                    <span className={`text-[9px] font-mono ${criterion.pass ? 'text-neon-bright' : 'text-red-400'}`}>
                                        {criterion.score}/{criterion.weight}
                                    </span>
                                </div>
                                <p className="text-[9px] text-gray-600 font-mono mt-0.5">{criterion.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Suggestions */}
                {failedCriteria.length > 0 && (
                    <div className="border border-yellow-500/20 bg-yellow-500/5 p-4 space-y-3">
                        <h4 className="flex items-center gap-2 text-[10px] text-yellow-400 uppercase tracking-widest font-bold">
                            <TrendingUp className="w-3 h-3" /> Actionable Suggestions
                        </h4>
                        {failedCriteria.map((c, i) => (
                            <div key={i} className="flex items-start gap-2">
                                <AlertCircle className="w-3 h-3 text-yellow-500/70 mt-0.5 shrink-0" />
                                <p className="text-[10px] text-gray-400 font-mono">{c.suggestion}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="h-6 border-t border-neon-dim/10 bg-black-900/50 flex items-center justify-between px-4 text-[9px] text-gray-500 font-mono uppercase tracking-wider">
                <span>PLACEMENT_ENGINE :: ACTIVE</span>
                <span>MODE: STUDENT</span>
            </div>
        </div>
    );
};

export default PlacementScore;
