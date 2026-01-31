"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import { Copy, Wallet, Loader2, LogOut, ChevronDown, User, AlertTriangle } from 'lucide-react';

export function WalletButton() {
    const { address, isConnected, chainId } = useAccount();
    const { connectors, connect, isPending } = useConnect();
    const { disconnect } = useDisconnect();
    const { switchChain } = useSwitchChain(); // Import hook for switching

    const [mounted, setMounted] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    const MONAD_TESTNET_ID = 10143;

    useEffect(() => setMounted(true), []);

    // Close dropdown/modal when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setIsModalOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!mounted) {
        return (
            <div className="flex items-center gap-2 pl-4 border-l border-border h-full">
                <span className="hidden md:inline text-slate-500 text-[10px]">WALLET</span>
                <div className="h-4 w-20 bg-slate-800/50 animate-pulse rounded"></div>
            </div>
        );
    }

    const handleConnectClick = () => {
        if (connectors.length > 1) {
            setIsModalOpen(true);
        } else {
            const preferredConnector = connectors[0];
            if (preferredConnector) {
                connect({ connector: preferredConnector });
            }
        }
    };

    const handleConnectorSelect = (connector: any) => {
        connect({ connector });
        setIsModalOpen(false);
    };

    const handleDisconnect = () => {
        disconnect();
        setIsDropdownOpen(false);
    };

    const handleSwitchNetwork = () => {
        switchChain({ chainId: MONAD_TESTNET_ID });
    };

    // WRONG NETWORK STATE
    if (isConnected && chainId !== MONAD_TESTNET_ID) {
        return (
            <div className="flex items-center gap-2 pl-4 border-l border-border animate-pulse">
                <button
                    onClick={handleSwitchNetwork}
                    className="flex items-center gap-2 px-3 py-1 bg-amber-900/20 hover:bg-amber-900/40 text-amber-500 text-[10px] font-mono uppercase tracking-wider rounded border border-amber-500/50 transition-all font-bold"
                >
                    <AlertTriangle className="w-3 h-3" />
                    <span>Wrong Network (Switch)</span>
                </button>
            </div>
        );
    }

    if (isConnected && address) {
        return (
            <div className="relative" ref={dropdownRef}>
                <div
                    className="flex items-center gap-2 pl-4 border-l border-border group cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                    <span className="hidden md:inline text-slate-500 text-[10px]">WALLET</span>
                    <span className="text-emerald-400 font-mono text-xs">{address.slice(0, 6)}...{address.slice(-4)}</span>
                    <ChevronDown className={`w-3 h-3 text-slate-600 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </div>

                {isDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-[#0B0E14] border border-slate-800 rounded shadow-xl z-50 overflow-hidden">
                        <div className="p-3 border-b border-slate-800 bg-slate-900/30">
                            <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Connected As</div>
                            <div className="text-xs font-mono text-emerald-400 truncate">{address}</div>
                        </div>

                        <div className="p-1">
                            <button className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800/50 hover:text-white transition-colors text-left rounded-sm">
                                <User className="w-3 h-3" />
                                <span>Profile Settings</span>
                            </button>
                            <button
                                onClick={handleDisconnect}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-amber-500 hover:bg-amber-500/10 transition-colors text-left rounded-sm"
                            >
                                <LogOut className="w-3 h-3" />
                                <span>Disconnect</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="relative flex items-center gap-2 pl-4 border-l border-border">
            <button
                onClick={handleConnectClick}
                disabled={isPending}
                className="flex items-center gap-2 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-mono uppercase tracking-wider rounded border border-slate-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wallet className="w-3 h-3" />}
                {isPending ? 'Connecting...' : 'Connect Wallet'}
            </button>

            {/* Wallet Selection Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div ref={modalRef} className="w-[320px] bg-[#0B0E14] border border-slate-800 rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                            <h3 className="text-sm font-bold text-slate-100 font-mono uppercase tracking-wide">Select Wallet</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white">✕</button>
                        </div>
                        <div className="p-2 space-y-1">
                            {connectors.map((connector) => (
                                <button
                                    key={connector.id}
                                    onClick={() => handleConnectorSelect(connector)}
                                    className="w-full flex items-center justify-between px-4 py-3 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-left rounded-md group"
                                >
                                    <span className="font-mono">{connector.name}</span>
                                    {connector.name.toLowerCase().includes('metamask') && <div className="w-2 h-2 rounded-full bg-orange-500 group-hover:scale-125 transition-transform" />}
                                    {connector.name.toLowerCase().includes('coinbase') && <div className="w-2 h-2 rounded-full bg-blue-500 group-hover:scale-125 transition-transform" />}
                                    {connector.name.toLowerCase().includes('injected') && <div className="w-2 h-2 rounded-full bg-slate-500 group-hover:scale-125 transition-transform" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
