"use client";

import React, { useState, useEffect } from "react";
import { useSocialTrust } from "@/hooks/useSocialTrust";

export function GuarantorStaking() {
    const {
        stakedAmount,
        lockedAmount,
        availableAmount,
        stake,
        withdraw,
        isPending,
        isConfirming,
        isConfirmed,
        refetchStaker
    } = useSocialTrust();

    const [amount, setAmount] = useState("");
    const [action, setAction] = useState<"stake" | "withdraw">("stake");

    // Refetch data after transaction confirmation
    useEffect(() => {
        if (isConfirmed) {
            refetchStaker();
            setAmount("");
        }
    }, [isConfirmed, refetchStaker]);

    const handleAction = () => {
        if (!amount || parseFloat(amount) <= 0) return;

        if (action === "stake") {
            stake(amount);
        } else {
            withdraw(amount);
        }
    };

    const utilization = stakedAmount > 0 ? ((lockedAmount / stakedAmount) * 100).toFixed(1) : "0.0";
    const healthFactor = lockedAmount > 0 ? (stakedAmount / lockedAmount).toFixed(2) : "∞";

    return (
        <div className="flex flex-col h-full gap-4">
            <div className="flex justify-between items-end border-b border-white/5 pb-2">
                <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Total Staked</span>
                    <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-white font-mono">{stakedAmount.toFixed(4)} MON</span>
                        <span className="text-[10px] text-slate-500 font-mono">({lockedAmount.toFixed(4)} Locked)</span>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Utilization</span>
                    <span className="text-sm font-bold text-warning font-mono">{utilization}%</span>
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-center gap-6">
                {/* Health Bar */}
                <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-[10px] font-mono text-slate-400 uppercase">
                        <span>Collateral Health</span>
                        <span className="text-emerald-500">Good ({healthFactor})</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-sm overflow-hidden relative">
                        {/* Locked part (Red/Warning) */}
                        <div
                            className="absolute top-0 bottom-0 left-0 bg-rose-500 transition-all duration-500"
                            style={{ width: `${Math.min(parseFloat(utilization), 100)}%` }}
                        ></div>
                        {/* Healthy part (Green) - remaining */}
                        <div
                            className="absolute top-0 bottom-0 bg-emerald-500 transition-all duration-500"
                            style={{
                                left: `${Math.min(parseFloat(utilization), 100)}%`,
                                width: `${Math.max(0, 100 - parseFloat(utilization))}%`
                            }}
                        ></div>
                    </div>
                </div>

                {/* Input Area */}
                <div className="flex flex-col gap-2">
                    <div className="flex rounded bg-slate-900/50 border border-slate-700 p-1">
                        <button
                            onClick={() => setAction("stake")}
                            className={`flex-1 text-[10px] font-mono uppercase py-1 rounded transition-colors ${action === "stake" ? "bg-slate-700 text-white" : "text-slate-500 hover:text-slate-300"}`}
                        >
                            Deposit
                        </button>
                        <button
                            onClick={() => setAction("withdraw")}
                            className={`flex-1 text-[10px] font-mono uppercase py-1 rounded transition-colors ${action === "withdraw" ? "bg-slate-700 text-white" : "text-slate-500 hover:text-slate-300"}`}
                        >
                            Withdraw
                        </button>
                    </div>

                    <div className="relative">
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full bg-slate-900 border border-slate-700 text-white text-sm font-mono p-2 pr-12 focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 font-mono">MON</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                        <span>Available: {availableAmount.toFixed(4)} MON</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-2 mt-auto">
                <button
                    onClick={handleAction}
                    disabled={isPending || isConfirming || !amount}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-mono py-3 uppercase tracking-wide transition-all shadow-[0_0_20px_-5px_rgba(79,70,229,0.3)]"
                >
                    {isPending || isConfirming ? "Processing..." : (action === "stake" ? "STAKE ONLY" : "UNSTAKE")}
                </button>
            </div>
        </div>
    );
}
