import React from 'react';
import { Flame } from 'lucide-react';

const HypeMeter = ({ data }) => {
    // ... calculation logic remains same ...
    const calculateHype = () => {
        if (!data || !data.summary) return 0;
        const { stars, forks } = data.summary;
        const busFactor = data.health ? data.health.calculated_bus_factor : 0;
        let starScore = Math.log10(stars + 1) * 20;
        let forkScore = Math.log10(forks + 1) * 10;
        let total = starScore + forkScore;
        if (busFactor > 5) total += 10;
        return Math.min(Math.round(total), 100);
    };

    const score = calculateHype();

    return (
        <div className="h-full relative overflow-hidden bg-black-800 border-2 border-neon-dim/30 hover:border-neon-bright/80 transition-all duration-500 group">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.05)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

            <div className="relative z-10 p-6 flex flex-col items-center justify-center h-full">
                <div className="flex items-center gap-2 mb-4 w-full justify-between border-b border-neon-dim/30 pb-2">
                    <span className="text-neon-dim text-[10px] font-bold uppercase tracking-[0.2em] animate-pulse">System Load</span>
                    <Flame className="w-4 h-4 text-neon-bright" />
                </div>

                <div className="text-6xl font-black text-white tracking-tighter mb-2 drop-shadow-[0_0_10px_rgba(0,255,65,0.8)]">
                    {score}<span className="text-lg text-neon-dim align-top">%</span>
                </div>

                {/* Cyberpunk Progress Bar */}
                <div className="w-full bg-black-900 h-4 border border-neon-dim/30 relative overflow-hidden">
                    {/* Ticks */}
                    <div className="absolute inset-0 flex justify-between px-1 pointer-events-none z-20">
                        {[...Array(10)].map((_, i) => <div key={i} className="w-[1px] h-full bg-black-800"></div>)}
                    </div>
                    <div
                        className="h-full bg-neon-green/80 shadow-[0_0_15px_rgba(0,255,65,0.6)] transition-all duration-1000 ease-out relative"
                        style={{ width: `${score}%` }}
                    >
                        <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-white animate-pulse"></div>
                    </div>
                </div>

                <p className="text-[10px] text-neon-dim/70 mt-3 font-mono text-center uppercase tracking-wide">
                    {score > 80 ? '>> OVERCLOCKING DETECTED' : score > 50 ? '>> OPTIMAL PERFORMANCE' : '>> LOW POWER MODE'}
                </p>
            </div>
        </div>
    );
};

export default HypeMeter;
