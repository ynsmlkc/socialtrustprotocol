"use client";

import { Card } from "@/components/ui/Card";
import { TrustCircle } from "@/components/dashboard/TrustCircle";
import { GuarantorStaking } from "@/components/dashboard/GuarantorStaking";
import { WithdrawalCard } from "@/components/dashboard/WithdrawalCard";
import { WalletButton } from "@/components/ui/WalletButton";
import { CreditActions } from "@/components/dashboard/CreditActions";

export function DashboardView() {
    return (
        <main className="min-h-screen bg-background p-4 md:p-6 text-foreground font-sans flex flex-col">
            {/* Header */}
            <header className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center py-2 border-b border-border">
                <div className="flex items-baseline gap-4">
                    <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-100">
                        SOCIAL TRUST <span className="font-light text-slate-400">PROTOCOL</span>
                    </h1>
                    <div className="flex items-center gap-2 px-2 py-0.5 bg-green-900/20 border border-green-900/50 rounded-full">
                        <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></div>
                        <span className="text-[10px] font-mono font-bold text-success uppercase tracking-wider">System Operational</span>
                    </div>
                </div>

                <div className="flex items-center gap-6 mt-4 md:mt-0 text-xs font-mono text-slate-400">
                    <div className="flex items-center gap-2">
                        <span className="text-slate-600">NETWORK</span>
                        <span className="text-slate-300">MONAD TESTNET</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-slate-600">GAS</span>
                        <span className="text-warning">14 GWEI</span>
                    </div>
                    <WalletButton />
                </div>
            </header>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-12 gap-4 flex-1 min-h-[800px]">

                {/* Row 1 Removed (Fake Data) */}


                {/* Row 2: Main Vis & Actions */}
                {/* Trust Circle - Dominant Visual */}
                <Card title="Network Topology" className="md:col-span-8 md:row-span-6 relative bg-slate-900/20">
                    <TrustCircle />
                </Card>

                {/* Action Panel / Guarantor Staking */}
                <Card title="Guarantor Staking" className="md:col-span-4 md:row-span-6">
                    <GuarantorStaking />
                </Card>


                {/* Row 3: Data Feeds */}
                {/* Credit Actions (Borrow/Repay/Vouch) */}
                <Card title="Credit & Trust Manager" className="md:col-span-6 md:row-span-4">
                    <CreditActions />
                </Card>

                {/* Withdrawal Section */}
                <Card title="Withdrawal" className="md:col-span-6 md:row-span-4">
                    <WithdrawalCard />
                </Card>
            </div>
        </main >
    );
}
