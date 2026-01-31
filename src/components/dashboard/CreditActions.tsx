"use client";

import React, { useState, useEffect } from "react";
import { useSocialTrust, useMyCreditLimit } from "@/hooks/useSocialTrust";
import { ArrowUpRight, ArrowDownLeft, Shield, AlertCircle, CheckCircle2 } from "lucide-react";
import { useAccount } from "wagmi";

type Tab = "borrow" | "repay" | "vouch";

export function CreditActions() {
    const { address: myAddress } = useAccount();
    const {
        borrow,
        repay,
        updateTrust,
        activeLoan,
        isPending,
        isConfirming,
        isConfirmed,
        error,
        refetchStaker,
        refetchLoan
    } = useSocialTrust();

    const [activeTab, setActiveTab] = useState<Tab>("borrow");

    // Form States
    const [amount, setAmount] = useState("");
    const [address, setAddress] = useState(""); // Used for Vouch Only now

    // Total Credit Limit (Auto-pooled)
    const {
        limit: myCreditLimit,
        isLoading: isLimitLoading,
        refetch: refetchLimit
    } = useMyCreditLimit();

    // UI Feedback
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    // Auto-fill Repay Amount
    useEffect(() => {
        if (activeTab === "repay" && activeLoan?.totalDebt) {
            setAmount(activeLoan.totalDebt.toString());
        } else if (activeTab === "borrow") {
            setAmount("");
        }
    }, [activeTab, activeLoan]);

    useEffect(() => {
        if (isConfirmed) {
            setStatus("success");
            setMessage("Transaction confirmed successfully!");
            setAmount("");
            if (activeTab === "vouch") setAddress("");

            // Refetch data
            refetchStaker();
            refetchLoan();
            refetchLimit();

            const timer = setTimeout(() => {
                setStatus("idle");
                setMessage("");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isConfirmed, activeTab, refetchStaker, refetchLoan, refetchLimit]);

    // Handle Errors
    useEffect(() => {
        if (error) {
            setStatus("error");
            const msg = (error as any).shortMessage || error.message || "Transaction failed";
            setMessage(msg);
        }
    }, [error]);

    const handleSubmit = () => {
        if (!amount || parseFloat(amount) <= 0) {
            setStatus("error");
            setMessage("Enter a valid amount");
            return;
        }

        try {
            if (activeTab === "borrow") {
                // Borrow is now auto-pooled, no voucher address needed
                borrow(amount);
            } else if (activeTab === "repay") {
                // Repay full amount (or entered amount if contract allows partial, but we enforce full for UX)
                repay(amount);
            } else if (activeTab === "vouch") {
                if (!address.startsWith("0x")) {
                    setStatus("error");
                    setMessage("Invalid Borrower Address");
                    return;
                }
                updateTrust(address, amount);
            }
        } catch (e) {
            console.error(e);
            setStatus("error");
            setMessage("Transaction failed to start");
        }
    };

    const isLoading = isPending || isConfirming;

    return (
        <div className="flex flex-col h-full gap-4">
            {/* Tabs */}
            <div className="flex p-1 bg-slate-900/50 rounded-lg border border-slate-800">
                <button
                    onClick={() => { setActiveTab("borrow"); setStatus("idle"); setMessage(""); }}
                    className={`flex-1 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded transition-all ${activeTab === "borrow" ? "bg-indigo-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"}`}
                >
                    Borrow
                </button>
                <button
                    onClick={() => { setActiveTab("repay"); setStatus("idle"); setMessage(""); }}
                    className={`flex-1 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded transition-all ${activeTab === "repay" ? "bg-indigo-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"}`}
                >
                    Repay
                </button>
                <button
                    onClick={() => { setActiveTab("vouch"); setStatus("idle"); setMessage(""); }}
                    className={`flex-1 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded transition-all ${activeTab === "vouch" ? "bg-indigo-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"}`}
                >
                    Vouch
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col justify-between gap-4">
                <div className="flex flex-col gap-3">
                    <div className="text-xs text-slate-400 font-mono min-h-[40px]">
                        {activeTab === "borrow" && "Borrow funds from your trusted network pool automatically."}
                        {activeTab === "repay" && "Repay your active loan + interest to unlock trust."}
                        {activeTab === "vouch" && "Be a guarantor for a peer. You stake, they borrow."}
                    </div>

                    {/* Active Loan Info (Repay Tab Only) */}
                    {activeTab === "repay" && activeLoan && (
                        <div className="bg-slate-900/50 p-3 rounded border border-slate-800 text-xs font-mono space-y-1">
                            <div className="flex justify-between text-slate-400">
                                <span>Principal:</span>
                                <span>{activeLoan.principal.toFixed(4)} MON</span>
                            </div>
                            <div className="flex justify-between text-slate-400">
                                <span>Interest:</span>
                                <span>{activeLoan.interest.toFixed(4)} MON</span>
                            </div>
                            <div className="border-t border-slate-800 my-1 pt-1 flex justify-between text-emerald-400 font-bold">
                                <span>Total Debt:</span>
                                <span>{activeLoan.totalDebt.toFixed(4)} MON</span>
                            </div>
                            <div className="flex justify-between text-slate-500 pt-1 text-[10px]">
                                <span>Due Date:</span>
                                <span>{new Date(activeLoan.dueDate).toLocaleDateString()}</span>
                            </div>
                        </div>
                    )}

                    {!activeLoan && activeTab === "repay" && (
                        <div className="bg-slate-900/50 p-3 rounded border border-slate-800 text-xs text-slate-500 font-mono text-center">
                            No active loans found.
                        </div>
                    )}

                    {/* Inputs */}
                    <div className="space-y-3">
                        {/* Address Input (Only for Vouch) */}
                        {activeTab === "vouch" && (
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">
                                    Borrower Address (Target)
                                </label>
                                <input
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="0x..."
                                    className="w-full bg-slate-900 border border-slate-700 text-white text-xs font-mono p-2.5 focus:outline-none focus:border-indigo-500 rounded"
                                />
                            </div>
                        )}

                        <div className="flex flex-col gap-1">
                            {/* Label */}
                            <label className="text-[10px] text-slate-500 uppercase tracking-widest font-mono flex justify-between">
                                <span>{activeTab === "vouch" ? "Trust Limit Amount" : "Amount"}</span>
                            </label>

                            {/* My Credit Limit Display (Borrow Only) */}
                            {activeTab === "borrow" && (
                                <div className="flex justify-between items-center text-[10px] font-mono px-1 mb-1">
                                    <span className="text-slate-500">Available Pool Credit:</span>
                                    {isLimitLoading ? (
                                        <span className="text-slate-500 animate-pulse">Checking...</span>
                                    ) : (
                                        <span className={`${myCreditLimit > 0 ? "text-emerald-400" : "text-amber-500"}`}>
                                            {myCreditLimit.toLocaleString()} MON
                                        </span>
                                    )}
                                </div>
                            )}

                            <div className="relative">
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.00"
                                    disabled={activeTab === "repay" && !activeLoan} // Disable if no loan to repay
                                    className="w-full bg-slate-900 border border-slate-700 text-white text-sm font-mono p-2.5 pr-12 focus:outline-none focus:border-indigo-500 rounded disabled:opacity-50"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 font-mono">MON</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Messages */}
                {status === "error" && (
                    <div className="flex items-center gap-2 text-xs text-red-400 bg-red-950/20 p-2 rounded border border-red-900/50">
                        <AlertCircle size={12} />
                        <span className="line-clamp-2">{message}</span>
                    </div>
                )}
                {status === "success" && (
                    <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/20 p-2 rounded border border-emerald-900/50">
                        <CheckCircle2 size={12} />
                        <span>{message}</span>
                    </div>
                )}

                {/* Action Button */}
                <button
                    onClick={handleSubmit}
                    disabled={isLoading || (activeTab === "repay" && !activeLoan)}
                    className="w-full bg-slate-100 hover:bg-white text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-bold font-mono py-3 uppercase tracking-wide transition-all flex items-center justify-center gap-2"
                >
                    {isLoading && <div className="w-3 h-3 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></div>}
                    {!isLoading && activeTab === "borrow" && <ArrowDownLeft size={14} />}
                    {!isLoading && activeTab === "repay" && <ArrowUpRight size={14} />}
                    {!isLoading && activeTab === "vouch" && <Shield size={14} />}
                    <span>
                        {isLoading ? "Processing..." : (
                            activeTab === "borrow" && activeLoan?.totalDebt ? "Top-up Loan" : activeTab
                        )}
                    </span>
                </button>
            </div>
        </div>
    );
}
