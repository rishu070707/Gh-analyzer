import React from 'react';

const StatCard = ({ title, value, icon, subtitle }) => {
    return (
        <div className="glass-card flex justify-between items-start group border-neon-dim/20 hover:border-neon-bright/60 bg-black-800/80">
            <div className="z-10">
                <p className="text-neon-dim text-[10px] font-bold tracking-[0.2em] mb-2 uppercase flex items-center gap-1">
                    <span className="w-1 h-1 bg-neon-dim rounded-full animate-pulse"></span>
                    {title}
                </p>
                <div className="text-3xl md:text-4xl font-black text-white tracking-tighter mb-1 group-hover:scale-105 transition-transform origin-left drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">
                    {value}
                </div>
                {subtitle && <p className="text-gray-500 text-[10px] mt-1 font-mono uppercase tracking-wide border-t border-white/5 pt-1 inline-block">{subtitle}</p>}
            </div>
            <div className="p-3 bg-neon-dim/5 rounded-none text-neon-bright group-hover:bg-neon-bright group-hover:text-black transition-all duration-300 border border-neon-dim/20 shadow-[0_0_10px_rgba(0,143,17,0.1)] group-hover:shadow-[0_0_15px_rgba(57,255,20,0.6)]">
                {React.cloneElement(icon, { className: "w-6 h-6" })}
            </div>
            {/* Scanline Effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-dim/5 to-transparent opacity-0 group-hover:opacity-100 scanline pointer-events-none transition-opacity duration-500"></div>
        </div>
    );
};

export default StatCard;
