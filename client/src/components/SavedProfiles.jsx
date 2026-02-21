import React, { useState, useEffect } from 'react';
import { Bookmark, Trash2, ExternalLink, Clock, TrendingUp, TrendingDown } from 'lucide-react';

const STORAGE_KEY = 'gh_analyzer_saved_profiles';

const SavedProfiles = ({ currentData, currentUrl, onLoad }) => {
    const [saved, setSaved] = useState([]);

    useEffect(() => {
        try {
            const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            setSaved(stored);
        } catch {
            setSaved([]);
        }
    }, []);

    const persist = (profiles) => {
        setSaved(profiles);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
    };

    const handleSave = () => {
        if (!currentData || !currentUrl) return;
        const name = currentData.summary?.name;
        const existing = saved.findIndex(p => p.url === currentUrl);

        const snapshot = {
            url: currentUrl,
            name: currentData.summary?.name,
            owner: currentData.summary?.owner?.login,
            avatar: currentData.summary?.owner?.avatar_url,
            stars: currentData.summary?.stars,
            forks: currentData.summary?.forks,
            commits: currentData.summary?.total_commits,
            contributors: currentData.contributors?.length,
            language: currentData.summary?.language,
            closureRate: currentData.health?.closure_rate?.toFixed(1),
            savedAt: Date.now(),
            history: existing >= 0 ? saved[existing].history : [],
        };

        // Track history
        if (existing >= 0) {
            const oldSnap = saved[existing];
            snapshot.history = [
                ...oldSnap.history.slice(-4),
                { savedAt: oldSnap.savedAt, stars: oldSnap.stars, commits: oldSnap.commits }
            ];
        }

        const updated = existing >= 0
            ? saved.map((p, i) => i === existing ? snapshot : p)
            : [snapshot, ...saved];

        persist(updated.slice(0, 10)); // max 10
    };

    const handleDelete = (url) => {
        persist(saved.filter(p => p.url !== url));
    };

    const isSaved = currentUrl && saved.some(p => p.url === currentUrl);

    const getGrowthIndicator = (profile) => {
        if (profile.history.length === 0) return null;
        const last = profile.history[profile.history.length - 1];
        const diff = profile.stars - last.stars;
        return diff;
    };

    return (
        <div className="glass-card !p-0 overflow-hidden border-neon-dim/20 bg-black-800/80">
            {/* Header */}
            <div className="p-4 border-b border-neon-dim/20 bg-neon-dim/5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-neon-bright" />
                    <h3 className="text-neon-bright font-bold text-xs uppercase tracking-[0.2em]">Saved Profiles & Tracking</h3>
                </div>
                <span className="text-[10px] text-neon-dim font-mono">{saved.length}/10 SLOTS</span>
            </div>

            {/* Save Button */}
            {currentData && (
                <div className="p-4 border-b border-neon-dim/10">
                    <button
                        onClick={handleSave}
                        className={`w-full py-2 border text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${isSaved
                            ? 'border-neon-bright/50 text-neon-bright bg-neon-bright/10 hover:bg-neon-bright hover:text-black'
                            : 'border-neon-dim/40 text-neon-dim hover:border-neon-bright hover:text-neon-bright'
                            }`}
                    >
                        <Bookmark className="w-3 h-3" />
                        {isSaved ? 'Update Saved Snapshot' : 'Save Current Profile'}
                    </button>
                </div>
            )}

            {/* Saved list */}
            <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto scrollbar-hide">
                {saved.length === 0 ? (
                    <div className="text-center py-8 border border-neon-dim/10 bg-black-900/40">
                        <Bookmark className="w-8 h-8 text-neon-dim/30 mx-auto mb-2" />
                        <p className="text-gray-600 text-[10px] font-mono uppercase tracking-widest">No saved profiles yet</p>
                        <p className="text-gray-700 text-[9px] font-mono mt-1">Analyze a repo and save it to track changes</p>
                    </div>
                ) : (
                    saved.map((profile) => {
                        const growth = getGrowthIndicator(profile);
                        return (
                            <div key={profile.url} className="border border-neon-dim/20 bg-black-900/40 p-3 group hover:border-neon-bright/40 transition-all duration-200">
                                <div className="flex items-center gap-3 mb-2">
                                    <img src={profile.avatar} alt="" className="w-8 h-8 border border-neon-dim/30" />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-white text-xs font-bold truncate">{profile.name}</h4>
                                            {profile.language && (
                                                <span className="text-[8px] px-1 border border-neon-dim/30 text-neon-dim uppercase">{profile.language}</span>
                                            )}
                                        </div>
                                        <p className="text-gray-500 text-[9px] font-mono">{profile.owner}</p>
                                    </div>
                                    <div className="flex gap-1">
                                        {onLoad && (
                                            <button
                                                onClick={() => onLoad(profile.url)}
                                                className="p-1 border border-neon-dim/20 text-neon-dim hover:text-neon-bright hover:border-neon-bright transition-all"
                                                title="Reload"
                                            >
                                                <ExternalLink className="w-3 h-3" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(profile.url)}
                                            className="p-1 border border-red-500/20 text-red-500/50 hover:text-red-400 hover:border-red-500 transition-all"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>

                                {/* Metrics Row */}
                                <div className="flex gap-3 text-[9px] font-mono text-gray-500">
                                    <span>★ {(profile.stars || 0).toLocaleString()}</span>
                                    <span>⑂ {(profile.forks || 0).toLocaleString()}</span>
                                    <span>⌨ {(profile.commits || 0).toLocaleString()}</span>
                                    <span>↑ {profile.closureRate}%</span>
                                    {growth !== null && (
                                        <span className={growth >= 0 ? 'text-neon-bright' : 'text-red-400'}>
                                            {growth >= 0 ? <TrendingUp className="w-2.5 h-2.5 inline" /> : <TrendingDown className="w-2.5 h-2.5 inline" />}
                                            {growth >= 0 ? '+' : ''}{growth} stars
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center gap-1 mt-2 text-[8px] font-mono text-gray-700">
                                    <Clock className="w-2.5 h-2.5" />
                                    <span>Saved: {new Date(profile.savedAt).toLocaleDateString()}</span>
                                    {profile.history.length > 0 && <span className="ml-2">{profile.history.length} snapshot(s)</span>}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <div className="h-6 border-t border-neon-dim/10 bg-black-900/50 flex items-center justify-between px-4 text-[9px] text-gray-500 font-mono uppercase tracking-wider">
                <span>PROFILE_TRACKER :: ACTIVE</span>
                <span>STORAGE: LOCAL</span>
            </div>
        </div>
    );
};

export default SavedProfiles;
