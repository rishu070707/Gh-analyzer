import React from 'react';
import { Zap, Globe, Terminal, Rocket, Coffee, Layers, Shield } from 'lucide-react';

const RepoPersona = ({ data }) => {
    if (!data) return null;

    const getPersona = () => {
        const { stars, forks, total_commits } = data.summary;

        // Simple logic tree to determine persona
        if (stars > 20000) return {
            name: 'THE TITAN',
            icon: <Globe />,
            description: "CRITICAL INFRASTRUCTURE. WORLD-SCALE IMPACT DETECTED.",
            colorString: 'text-yellow-400',
            borderColor: 'border-yellow-400'
        };

        if (stars > 5000 && total_commits > 1000) return {
            name: 'RELIABLE ENGINE',
            icon: <Rocket />,
            description: "HIGH VELOCITY DEVELOPMENT. STABLE CORE SYSTEMS.",
            colorString: 'text-blue-400',
            borderColor: 'border-blue-400'
        };

        if (stars / (forks || 1) > 5 && stars > 1000) return {
            name: 'CULT CLASSIC',
            icon: <Coffee />,
            description: "HIGH LOYALTY SIGNAL. UNIQUE SIGNATURE DETECTED.",
            colorString: 'text-pink-500',
            borderColor: 'border-pink-500'
        };

        if (total_commits > 500 && stars < 500) return {
            name: 'GHOST WORKER',
            icon: <Terminal />,
            description: "STEALTH MODE ACTIVE. HIGH UTILITY, LOW VISIBILITY.",
            colorString: 'text-emerald-400',
            borderColor: 'border-emerald-400'
        };

        return {
            name: 'THE EXPLORER',
            icon: <Layers />,
            description: "ANALYZING POTENTIAL. TRAJECTORY UNKNOWN.",
            colorString: 'text-purple-400',
            borderColor: 'border-purple-400'
        };
    };

    const persona = getPersona();

    return (
        <div className={`relative h-full border-2 ${persona.borderColor} bg-black-800 flex flex-col p-6 shadow-[0_0_20px_rgba(0,0,0,0.5)] overflow-hidden group`}>
            <div className="absolute top-0 right-0 p-2 opacity-20">
                {React.cloneElement(persona.icon, { className: `w-32 h-32 ${persona.colorString}` })}
            </div>

            <div className="border-b border-white/10 pb-4 mb-4 z-10">
                <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Target Signature</div>
                <h2 className={`text-3xl md:text-4xl font-black italic tracking-tighter ${persona.colorString} drop-shadow-md`}>
                    {persona.name}
                </h2>
            </div>

            <div className="flex-1 z-10">
                <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">Analysis Log</div>
                <p className="font-mono text-white text-sm leading-relaxed border-l-2 border-white/20 pl-3">
                    {'>'} {persona.description}
                </p>
                <div className="mt-8 flex gap-2">
                    <span className={`px-2 py-1 text-[10px] font-bold border ${persona.borderColor} ${persona.colorString} uppercase`}>
                        Verify
                    </span>
                    <span className="px-2 py-1 text-[10px] font-bold border border-gray-600 text-gray-400 uppercase">
                        Archive
                    </span>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        </div>
    );
};

export default RepoPersona;
