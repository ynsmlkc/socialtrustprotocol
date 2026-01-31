"use client";

import { WalletButton } from "@/components/ui/WalletButton";
import { Shield, ArrowRight } from "lucide-react";

export function LandingView() {
    return (
        <main className="min-h-screen bg-background text-foreground font-sans flex flex-col items-center justify-center relative overflow-hidden">

            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/20 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-900/10 blur-[120px] rounded-full"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center max-w-4xl text-center px-4">

                {/* Badge */}
                <div className="mb-8 animate-in fade-in zoom-in duration-1000">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900/50 border border-slate-800 rounded-full">
                        <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></div>
                        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Protocol Live</span>
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6 animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-100">
                    SOCIAL TRUST <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">PROTOCOL</span>
                </h1>

                {/* Description */}
                <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl leading-relaxed animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-200">
                    A decentralized specialized credit line system backed by a network of guarantors.
                    Leverage your social capital to access trust-based liquidity.
                </p>

                {/* Actions */}
                <div className="flex flex-col gap-6 items-center w-full animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-300">
                    <div className="scale-125">
                        <WalletButton />
                    </div>

                    <span className="text-xs text-slate-600 font-mono uppercase tracking-widest mt-4">Connect wallet to access dashboard</span>
                </div>

                {/* Features Preview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 w-full">
                    <div className="flex flex-col items-center gap-3 p-6 border border-white/5 bg-white/5 rounded-lg backdrop-blur-sm hover:bg-white/10 transition-colors group">
                        <Shield size={24} className="text-indigo-400 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-bold text-slate-200 font-mono uppercase">Guarantor Network</span>
                        <span className="text-xs text-slate-500">Vouch for peers and earn yield</span>
                    </div>
                    <div className="flex flex-col items-center gap-3 p-6 border border-white/5 bg-white/5 rounded-lg backdrop-blur-sm hover:bg-white/10 transition-colors group">
                        <div className="text-emerald-400 font-serif italic text-xl group-hover:scale-110 transition-transform">$</div>
                        <span className="text-sm font-bold text-slate-200 font-mono uppercase">Trust Lines</span>
                        <span className="text-xs text-slate-500">Access liquidity without over-collateralization</span>
                    </div>
                    <div className="flex flex-col items-center gap-3 p-6 border border-white/5 bg-white/5 rounded-lg backdrop-blur-sm hover:bg-white/10 transition-colors group">
                        <ArrowRight size={24} className="text-purple-400 group-hover:translate-x-1 transition-transform" />
                        <span className="text-sm font-bold text-slate-200 font-mono uppercase">Instant Access</span>
                        <span className="text-xs text-slate-500">Algorithmically determined limits</span>
                    </div>
                </div>

            </div>

            {/* Footer */}
            <div className="absolute bottom-6 text-[10px] text-slate-600 font-mono uppercase tracking-widest">
                v0.1.0 • Built on Optimism
            </div>

        </main>
    );
}
