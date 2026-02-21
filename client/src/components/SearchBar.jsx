import React, { useState } from 'react';

const SearchBar = ({ onSearch, loading }) => {
    const [url, setUrl] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (url.trim()) onSearch(url);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full relative group">
            <div className="absolute inset-0 bg-neon-green/20 blur-md opacity-0 group-hover:opacity-100 transition duration-500 animate-pulse" />

            {/* On xs: stack vertically. On sm+: row layout */}
            <div className="relative flex flex-col sm:flex-row items-stretch bg-black-900 border border-neon-dim/50 focus-within:border-neon-bright focus-within:shadow-[0_0_15px_rgba(0,255,65,0.3)] transition-all">
                {/* Prompt prefix — hide on xs for cleanliness */}
                <div className="hidden sm:flex pl-4 pr-3 text-neon-dim group-focus-within:text-neon-bright transition-colors animate-pulse items-center">
                    <span className="font-mono text-lg">{'>'}</span>
                </div>

                <input
                    type="url"
                    inputMode="url"
                    className="flex-1 bg-transparent border-none text-white placeholder-neon-dim/50 focus:outline-none focus:ring-0 text-sm sm:text-base py-3 px-4 sm:px-2 font-mono tracking-wide"
                    placeholder="https://github.com/owner/repo"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    disabled={loading}
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck="false"
                />

                <button
                    type="submit"
                    disabled={loading || !url.trim()}
                    className="px-6 py-3 bg-neon-dim/20 hover:bg-neon-bright hover:text-black border-t sm:border-t-0 sm:border-l border-neon-dim/40 text-neon-bright font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_10px_rgba(0,143,17,0.2)] hover:shadow-[0_0_20px_rgba(57,255,20,0.6)] active:scale-95 uppercase tracking-widest text-xs sm:text-sm min-h-[48px]"
                >
                    {loading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-neon-bright border-t-transparent rounded-full animate-spin" />
                            <span>SCANNING</span>
                        </>
                    ) : (
                        'EXECUTE'
                    )}
                </button>
            </div>

            {/* Corner accents (desktop only for polish) */}
            <div className="hidden sm:block absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-neon-bright -translate-x-1 -translate-y-1 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="hidden sm:block absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-neon-bright translate-x-1 -translate-y-1 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="hidden sm:block absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-neon-bright -translate-x-1 translate-y-1 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="hidden sm:block absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-neon-bright translate-x-1 translate-y-1 opacity-0 group-hover:opacity-100 transition-opacity" />
        </form>
    );
};

export default SearchBar;
