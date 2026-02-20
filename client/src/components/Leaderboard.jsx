import React from 'react';
import { Crown, Medal, User } from 'lucide-react';

const Leaderboard = ({ contributors = [] }) => {
    if (!contributors || contributors.length === 0) return null;

    return (
        <div className="glass-card h-full min-h-[500px] flex flex-col !p-0 overflow-hidden border-neon-dim/20 bg-black-800/80">
            <div className="p-4 border-b border-neon-dim/30 bg-neon-dim/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-neon-bright animate-bounce" />
                    <h2 className="text-sm font-bold text-neon-bright uppercase tracking-[0.2em]">
                        Top Agents
                    </h2>
                </div>
                <div className="text-[10px] text-neon-dim animate-pulse">LIVE FEED</div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
                {contributors.slice(0, 10).map((contributor, index) => (
                    <a
                        key={contributor.login}
                        href={contributor.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-4 p-3 border hover:bg-neon-dim/10 transition-all duration-300 group
                            ${index === 0 ? 'border-neon-bright/50 bg-neon-bright/5' : 'border-white/5 bg-black-900/40 hover:border-neon-dim/30'}
                        `}
                    >
                        <div className={`flex items-center justify-center w-8 h-8 font-mono font-bold text-lg
                            ${index === 0 ? 'text-neon-bright' : index === 1 ? 'text-white' : index === 2 ? 'text-gray-400' : 'text-gray-600'}
                        `}>
                            {index + 1}
                        </div>

                        <div className="relative">
                            <img
                                src={contributor.avatar_url}
                                alt={contributor.login}
                                className={`w-10 h-10 object-cover border-2 transition-transform duration-300 group-hover:scale-110
                                    ${index === 0 ? 'border-neon-bright' : 'border-gray-700 group-hover:border-neon-dim'}
                                `}
                            />
                            {index === 0 && <div className="absolute -top-1 -right-1 w-3 h-3 bg-neon-bright rounded-full animate-ping"></div>}
                        </div>

                        <div className="flex-1 min-w-0">
                            <h3 className={`text-sm font-bold truncate group-hover:text-neon-bright transition-colors ${index === 0 ? 'text-white' : 'text-gray-300'}`}>
                                {contributor.login}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="h-1 flex-1 bg-gray-800 rounded-full overflow-hidden max-w-[100px]">
                                    <div
                                        className={`h-full ${index === 0 ? 'bg-neon-bright' : 'bg-neon-dim'}`}
                                        style={{ width: `${Math.min((contributor.contributions / contributors[0].contributions) * 100, 100)}%` }}
                                    ></div>
                                </div>
                                <span className="text-[10px] text-gray-500 font-mono whitespace-nowrap">
                                    {contributor.contributions} OPS
                                </span>
                            </div>
                        </div>

                        {index < 3 && <Medal className={`w-4 h-4 ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-300' : 'text-orange-400'}`} />}
                    </a>
                ))}
            </div>
            <div className="p-2 text-center border-t border-neon-dim/20 bg-black-900 text-[10px] text-gray-500 uppercase tracking-widest">
                System Ranking // Global
            </div>
        </div>
    );
};

export default Leaderboard;
