import React, { useState, useEffect, useRef } from 'react';

const TerminalLog = ({ data }) => {
    const [logs, setLogs] = useState([]);
    const scrollRef = useRef(null);

    const logMessages = [
        "INITIALIZING NEURAL INTERFACE...",
        "DECRYPTING REPOSITORY METADATA...",
        "SCANNING COMMIT VECTORS...",
        "ANALYZING LANGUAGE DENSITY...",
        "IDENTIFYING KEY CONTRIBUTORS...",
        "CALCULATING HEALTH METRICS...",
        "EXTRACTION COMPLETE.",
        "RENDERING VISUALIZATIONS...",
        `CONNECTED TO: ${data?.summary?.name || 'UNKNOWN_STATION'}`,
        `AUTH_LEVEL: SYSTEM_ADMIN`,
        "MONITORING LIVE_DATA_FEED..."
    ];

    useEffect(() => {
        let currentLog = 0;
        const interval = setInterval(() => {
            if (currentLog < logMessages.length) {
                setLogs(prev => [...prev, {
                    time: new Date().toLocaleTimeString(),
                    text: logMessages[currentLog]
                }].slice(-8)); // Keep last 8
                currentLog++;
            } else {
                // Random random heartbeat
                setLogs(prev => [...prev, {
                    time: new Date().toLocaleTimeString(),
                    text: `HEARTBEAT_PULSE: OK // LATENCY: ${Math.floor(Math.random() * 50)}ms`
                }].slice(-8));
            }
        }, 1500);

        return () => clearInterval(interval);
    }, [data]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <div className="glass-card bg-black-900/90 border-neon-dim/30 p-4 font-mono text-[10px] h-48 flex flex-col relative overflow-hidden group">
            <div className="flex items-center justify-between border-b border-neon-dim/20 pb-2 mb-2">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    <span className="text-neon-bright font-bold uppercase tracking-widest">System_Console.log</span>
                </div>
                <div className="text-neon-dim opacity-50">NODE_VERSION: 18.x.x</div>
            </div>
            <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-1 scrollbar-hide py-1">
                {logs.map((log, idx) => (
                    <div key={idx} className="flex gap-4 animate-fade-in">
                        <span className="text-gray-600">[{log.time}]</span>
                        <span className={idx === logs.length - 1 ? "text-neon-bright" : "text-gray-400"}>
                            {idx === logs.length - 1 && ">> "}{log.text}
                        </span>
                    </div>
                ))}
            </div>
            {/* Corner decorations */}
            <div className="absolute bottom-0 right-0 p-1 opacity-20">
                <div className="w-10 h-10 border-r border-b border-neon-dim"></div>
            </div>
            <div className="absolute top-0 left-0 p-1 opacity-20">
                <div className="w-4 h-4 border-l border-t border-neon-bright"></div>
            </div>
        </div>
    );
};

export default TerminalLog;
