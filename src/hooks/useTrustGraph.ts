import { useState, useEffect, useCallback, useRef } from 'react';
import { useAccount, useReadContracts, usePublicClient, useWatchContractEvent } from 'wagmi';
import { SOCIAL_TRUST_CONTRACT } from '@/contracts/socialTrust';
import { parseAbiItem } from 'viem';

export interface Node {
    id: string;
    x: number;
    y: number;
    label: string;
    status: 'active' | 'trusted' | 'warning';
}

export interface Link {
    source: string;
    target: string;
    value: number;
}

export function useTrustGraph() {
    const { address } = useAccount();
    const publicClient = usePublicClient();
    const [nodes, setNodes] = useState<Node[]>([]);
    const [links, setLinks] = useState<Link[]>([]);

    // Use a Ref to track if we are currently fetching to prevent overlap
    const isFetchingRef = useRef(false);

    // --- 1. INCOMING TRUST (State Read) ---
    // Read first 10 trustees from contract state
    // We increase staleTime to avoid constant polling that causes 429 errors
    const potentialIndices = Array.from({ length: 10 }, (_, i) => BigInt(i));
    const contracts = address ? potentialIndices.map(index => ({
        ...SOCIAL_TRUST_CONTRACT,
        functionName: 'trustees',
        args: [address, index]
    })) : [];

    // @ts-ignore
    const { data: trusteesData, refetch: refetchIncoming } = useReadContracts({
        contracts: contracts,
        query: {
            enabled: !!address,
            staleTime: 60_000, // Data stays fresh for 1 min (reduces RPC calls)
            refetchInterval: 0 // Disable auto polling
        }
    });

    // --- 2. OUTGOING TRUST (Event Logs) ---
    const [outgoingData, setOutgoingData] = useState<string[]>([]);

    const fetchOutgoing = useCallback(async () => {
        if (!address || !publicClient) return;
        if (isFetchingRef.current) return;

        isFetchingRef.current = true;
        try {
            const trustUpdatedEvent = parseAbiItem('event TrustUpdated(address indexed voucher, address indexed borrower, uint256 limit)');
            const currentBlock = await publicClient.getBlockNumber();

            // Fetch last 90 blocks (strict RPC limit)
            const fromBlock = currentBlock > BigInt(90) ? currentBlock - BigInt(90) : BigInt(0);

            const logs = await publicClient.getLogs({
                address: SOCIAL_TRUST_CONTRACT.address,
                event: trustUpdatedEvent,
                args: { voucher: address },
                fromBlock: fromBlock,
                toBlock: currentBlock
            });

            const borrowers = logs.map(l => l.args.borrower as string).filter(Boolean);

            setOutgoingData(prev => {
                const combined = new Set([...prev, ...borrowers]);
                return Array.from(combined);
            });
        } catch (e) {
            console.error("Outgoing trust fetch failed", e);
        } finally {
            isFetchingRef.current = false;
        }
    }, [address, publicClient]);

    // Initial Fetch & LocalStorage Load
    useEffect(() => {
        if (!address) {
            // If disconnected, try to load ANY stored data just for visual continuity (optional)
            // or just clear. Ideally, we just return.
            return;
        }

        const storageKeyNodes = `trust_nodes_${address}`;
        const storageKeyLinks = `trust_links_${address}`;

        try {
            const savedNodes = localStorage.getItem(storageKeyNodes);
            const savedLinks = localStorage.getItem(storageKeyLinks);
            if (savedNodes && savedLinks) {
                setNodes(JSON.parse(savedNodes));
                setLinks(JSON.parse(savedLinks));
            }
        } catch (e) { }

        // Trigger fetch
        fetchOutgoing();
    }, [address, fetchOutgoing]);


    // --- 3. REAL-TIME LISTENER (Debounced) ---
    useWatchContractEvent({
        ...SOCIAL_TRUST_CONTRACT,
        eventName: 'TrustUpdated',
        poll: true,
        pollingInterval: 10_000, // Poll event logs every 10s instead of 1s to save RPC
        onLogs(logs) {
            const relevant = logs.some(log => {
                const { voucher, borrower } = log.args;
                return (voucher === address) || (borrower === address);
            });

            if (relevant) {
                // Delay refetch slightly and debounce
                setTimeout(() => {
                    refetchIncoming();
                    fetchOutgoing();
                }, 1000);
            }
        },
    });

    // --- COMBINE DATA ---
    useEffect(() => {
        if (!address) return;

        const uniquePeers = new Set<string>();
        const newLinks: Link[] = [];

        // Add Incoming (They -> Me)
        if (trusteesData) {
            trusteesData.forEach((result) => {
                if (result.status === 'success' && result.result) {
                    const voucher = result.result as string;
                    if (voucher && voucher !== "0x0000000000000000000000000000000000000000") {
                        uniquePeers.add(voucher);
                        newLinks.push({ source: voucher, target: 'me', value: 100 });
                    }
                }
            });
        }

        // Add Outgoing (Me -> They)
        outgoingData.forEach((borrower) => {
            if (borrower) {
                uniquePeers.add(borrower);
                if (!newLinks.some(l => l.source === 'me' && l.target === borrower)) {
                    newLinks.push({ source: 'me', target: borrower, value: 100 });
                }
            }
        });

        // If no data found yet, rely on previous state (don't overwrite with empty if we have data)
        // OR always overwrite if we are confident. 
        // Let's always overwrite to reflect truth, but ensure "me" exists.

        const newNodes: Node[] = [
            { id: 'me', x: 50, y: 50, label: 'YOU', status: 'active' }
        ];

        // Position nodes
        const peersArray = Array.from(uniquePeers);
        const totalPeers = peersArray.length;
        const radius = 35;

        peersArray.forEach((peerAddr, index) => {
            const angle = (index / totalPeers) * 2 * Math.PI;
            const x = 50 + radius * Math.cos(angle);
            const y = 50 + radius * Math.sin(angle);
            const shortLabel = `${peerAddr.substring(0, 4)}..${peerAddr.substring(peerAddr.length - 2)}`;

            newNodes.push({ id: peerAddr, x, y, label: shortLabel, status: 'trusted' });
        });

        // Only update state if meaningful change
        // Making simple check on length or stringify to avoid loop
        const dataChanged = JSON.stringify(newNodes) !== JSON.stringify(nodes) || JSON.stringify(newLinks) !== JSON.stringify(links);

        if (dataChanged) {
            setNodes(newNodes);
            setLinks(newLinks);

            // Persist with address-specific key
            try {
                if (newNodes.length > 0) {
                    localStorage.setItem(`trust_nodes_${address}`, JSON.stringify(newNodes));
                    localStorage.setItem(`trust_links_${address}`, JSON.stringify(newLinks));
                }
            } catch (e) { }
        }

    }, [address, trusteesData, outgoingData, nodes, links]);

    const refresh = () => {
        refetchIncoming();
        fetchOutgoing();
    };

    return {
        nodes,
        links,
        isLoading: false,
        refreshGraph: refresh
    };
}
