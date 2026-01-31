"use client";

import React from "react";

const LOGS = [
    { time: "11:42:05", type: "INFO", msg: "Block #18294921 finalized", color: "text-slate-400" },
    { time: "11:42:01", type: "SUCCESS", msg: "Loan #8821 liquidated (0.4s)", color: "text-emerald-500" },
    { time: "11:41:55", type: "WARN", msg: "High gas fees detected: 45 gwei", color: "text-amber-500" },
    { time: "11:41:42", type: "INFO", msg: "New trust line established: 0x3a..99", color: "text-slate-400" },
    { time: "11:41:30", type: "INFO", msg: "Oracle update: ETH/USD $2,250.50", color: "text-blue-400" },
    { time: "11:41:15", type: "INFO", msg: "Syncing node state...", color: "text-slate-500" },
    { time: "11:40:55", type: "ERROR", msg: "Connection timeout retry (1/3)", color: "text-red-500" },
    { time: "11:40:48", type: "INFO", msg: "System initialization complete", color: "text-success" },
];

export function ActivityFeed() {
    return (
        <div className="h-full w-full bg-slate-950 font-mono text-[10px] md:text-xs overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {LOGS.map((log, i) => (
                    <div key={i} className="flex gap-2 opacity-90 hover:opacity-100 transition-opacity">
                        <span className="text-slate-600 shrink-0">[{log.time}]</span>
                        <span className={`font-bold shrink-0 w-12 ${log.type === 'ERROR' ? 'text-red-500' : (log.type === 'WARN' ? 'text-warning' : (log.type === 'SUCCESS' ? 'text-success' : 'text-blue-500'))}`}>
                            {log.type}
                        </span>
                        <span className={`${log.color} truncate`}>{log.msg}</span>
                    </div>
                ))}
                <div className="flex gap-2 animate-pulse mt-2">
                    <span className="text-slate-600 shrink-0">[11:42:06]</span>
                    <span className="text-slate-500">_</span>
                </div>
            </div>
        </div>
    );
}
