"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight, Wallet, AlertCircle, CheckCircle2 } from "lucide-react";
import { useSocialTrust } from "@/hooks/useSocialTrust";

export function WithdrawalCard() {
    const {
        stakedAmount,
        lockedAmount,
        availableAmount, // Derived from hook (stake - locked)
        withdraw,
        isPending,
        isConfirming,
        isConfirmed,
        refetchStaker
    } = useSocialTrust();

    const [amount, setAmount] = useState("");
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    // Handle transaction success
    useEffect(() => {
        if (isConfirmed) {
            setStatus("success");
            setMessage(`Successfully withdrew funds`);
            setAmount("");
            refetchStaker();

            const timer = setTimeout(() => {
                setStatus("idle");
                setMessage("");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isConfirmed, refetchStaker]);

    const handleWithdraw = () => {
        const val = parseFloat(amount);
        if (isNaN(val) || val <= 0) {
            setStatus("error");
            setMessage("Please enter a valid amount");
            return;
        }
        if (val > availableAmount) {
            setStatus("error");
            setMessage("Insufficient available funds");
            return;
        }

        // Trigger contract interaction
        try {
            withdraw(amount);
        } catch (err) {
            setStatus("error");
            setMessage("Transaction failed to start");
            console.error(err);
        }
    };

    const isLoading = isPending || isConfirming;

    return (
        <div className="flex flex-col h-full justify-between gap-4">
            <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Available Balance</label>
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-white font-mono">{availableAmount.toFixed(4)}</span>
                    <span className="text-xs text-slate-500">MON</span>
                </div>
                <div className="text-[10px] text-slate-600 font-mono">
                    Locked: {lockedAmount.toFixed(4)} MON (Guarantor duties)
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-slate-500 font-mono">MON</span>
                    </div>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="block w-full pl-12 pr-12 py-3 bg-slate-900/50 border border-slate-700 rounded text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <button
                            onClick={() => setAmount(availableAmount.toString())}
                            className="text-[10px] text-indigo-400 hover:text-indigo-300 font-mono uppercase cursor-pointer"
                        >
                            Max
                        </button>
                    </div>
                </div>

                {status === "error" && (
                    <div className="flex items-center gap-2 text-xs text-red-400 bg-red-950/20 p-2 rounded border border-red-900/50 animate-in fade-in slide-in-from-top-1">
                        <AlertCircle size={12} />
                        <span>{message}</span>
                    </div>
                )}

                {status === "success" && (
                    <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/20 p-2 rounded border border-emerald-900/50 animate-in fade-in slide-in-from-top-1">
                        <CheckCircle2 size={12} />
                        <span>{message}</span>
                    </div>
                )}

                <button
                    onClick={handleWithdraw}
                    disabled={isLoading || availableAmount <= 0}
                    className="w-full relative group overflow-hidden bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <div className="relative z-10 flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-wider font-bold">
                        {isLoading ? (
                            <>
                                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Processing Transaction...</span>
                            </>
                        ) : (
                            <>
                                <span>Withdraw Funds</span>
                                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </div>
                    {/* Shine effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent z-0"></div>
                </button>
            </div>

            <div className="mt-auto pt-4 border-t border-white/5">
                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                    <Wallet size={12} />
                    <span>Funds will be sent to connected wallet</span>
                </div>
            </div>
        </div>
    );
}
