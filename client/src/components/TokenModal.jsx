import React, { useState } from 'react';
import { Key, ShieldAlert, X } from 'lucide-react';

const TokenModal = ({ onSubmit, onCancel, error }) => {
    const [token, setToken] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(token);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-black-900 border border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.3)] max-w-md w-full p-6 relative overflow-hidden">
                {/* Scanlines */}
                <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)50%,rgba(0,0,0,0.25)50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%]"></div>

                <h2 className="text-red-500 font-bold text-xl mb-4 flex items-center gap-2 uppercase tracking-widest">
                    <ShieldAlert className="w-6 h-6 animate-pulse" />
                    System Breach Detected
                </h2>

                <p className="text-gray-400 mb-6 font-mono text-sm leading-relaxed border-l-2 border-red-500/30 pl-4">
                    API Rate Limit Exceeded. The text-based interface requires higher clearance level.
                    <br /><br />
                    <span className="text-white">Please provide a GitHub Personal Access Token to bypass security protocols.</span>
                </p>

                <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                    <div className="relative">
                        <Key className="absolute left-3 top-3 w-5 h-5 text-red-500" />
                        <input
                            type="password"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            placeholder="ghp_xxxxxxxxxxxx"
                            className="w-full bg-black-800 border border-red-500/50 text-white pl-10 pr-4 py-2 focus:outline-none focus:border-red-500 focus:shadow-[0_0_15px_rgba(239,68,68,0.4)] font-mono placeholder-red-900"
                            autoFocus
                        />
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 px-4 py-2 border border-gray-600 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors uppercase text-sm font-bold tracking-wider"
                        >
                            Abort
                        </button>
                        <button
                            type="submit"
                            disabled={!token}
                            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 text-black font-bold border border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.4)] uppercase text-sm tracking-wider disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            Authorize
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TokenModal;
