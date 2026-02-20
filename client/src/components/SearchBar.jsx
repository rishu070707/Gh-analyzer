import React, { useState } from 'react';

const SearchBar = ({ onSearch, loading }) => {
    const [url, setUrl] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (url.trim()) {
            onSearch(url);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full relative group">
            <div className="absolute inset-0 bg-neon-green/20 blur-md opacity-0 group-hover:opacity-100 transition duration-500 animate-pulse"></div>
            <div className="relative flex items-center bg-black-900 border border-neon-dim/50 p-2 focus-within:border-neon-bright focus-within:shadow-[0_0_15px_rgba(0,255,65,0.3)] transition-all">
                <div className="pl-4 pr-3 text-neon-dim group-focus-within:text-neon-bright transition-colors animate-pulse">
                    <span className="font-mono text-lg">{'>'}</span>
                </div>
                <input
                    type="text"
                    className="flex-1 bg-transparent border-none text-white placeholder-neon-dim/50 focus:outline-none focus:ring-0 text-lg py-3 font-mono tracking-wide"
                    placeholder="ENTER_TARGET_URL..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    disabled={loading}
                />

                {/* Tech decorative elements */}
                <div className="hidden md:flex gap-1 mr-4">
                    <div className="w-1 h-1 bg-neon-dim animate-pulse delay-75"></div>
                    <div className="w-1 h-1 bg-neon-dim animate-pulse delay-150"></div>
                    <div className="w-1 h-1 bg-neon-dim animate-pulse delay-300"></div>
                </div>

                <button
                    type="submit"
                    disabled={loading || !url.trim()}
                    className="ml-2 px-8 py-3 bg-neon-dim/20 hover:bg-neon-bright hover:text-black border border-neon-dim text-neon-bright font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-[0_0_10px_rgba(0,143,17,0.2)] hover:shadow-[0_0_20px_rgba(57,255,20,0.6)] active:scale-95 uppercase tracking-widest text-sm"
                >
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-neon-bright border-t-transparent rounded-full animate-spin" />
                            <span>SCANNING</span>
                        </div>
                    ) : (
                        'EXECUTE'
                    )}
                </button>
            </div>
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-neon-bright -translate-x-1 -translate-y-1 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-neon-bright translate-x-1 -translate-y-1 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-neon-bright -translate-x-1 translate-y-1 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-neon-bright translate-x-1 translate-y-1 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </form>
    );
};

export default SearchBar;
