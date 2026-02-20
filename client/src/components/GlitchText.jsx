import React from 'react';

const GlitchText = ({ text, className = '' }) => {
    return (
        <div className={`relative inline-block group ${className}`}>
            <span className="relative z-10">{text}</span>
            <span className="absolute top-0 left-0 -z-10 w-full h-full text-neon-green opacity-0 group-hover:opacity-100 group-hover:translate-x-[2px] group-hover:translate-y-[-2px] transition-all duration-100 mix-blend-screen animate-pulse">
                {text}
            </span>
            <span className="absolute top-0 left-0 -z-10 w-full h-full text-neon-bright opacity-0 group-hover:opacity-100 group-hover:translate-x-[-2px] group-hover:translate-y-[2px] transition-all duration-100 mix-blend-screen animate-pulse delay-75">
                {text}
            </span>
        </div>
    );
};

export default GlitchText;
