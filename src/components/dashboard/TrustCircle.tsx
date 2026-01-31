"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useTrustGraph } from "@/hooks/useTrustGraph";

// Dynamically import ForceGraph to avoid SSR issues
const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
    ssr: false,
});

// --- CONFIG ---
const GRAPH_CONFIG = {
    colors: {
        primary: "#10b981",   // Emerald (You)
        trusted: "#3b82f6",   // Blue (Trusted)
        warning: "#f59e0b",   // Amber (Warning)
        link: "rgba(148, 163, 184, 0.2)", // Slate-400 with opacity
        bg: "rgba(0,0,0,0)",  // Transparent (let Card bg show)
        text: "#e2e8f0"       // Slate-200
    },
    nodeSize: {
        me: 14,
        peer: 6,
    }
};

export function TrustCircle() {
    const { nodes: graphNodes, links: graphLinks, refreshGraph } = useTrustGraph();
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const graphRef = useRef<any>(null);

    // Measure container size
    useEffect(() => {
        if (!containerRef.current) return;

        const resizeObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
                setDimensions({
                    width: entry.contentRect.width,
                    height: entry.contentRect.height
                });
            }
        });

        resizeObserver.observe(containerRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    // Transform data for ForceGraph
    const data = {
        nodes: graphNodes.map(n => ({
            ...n,
            group: n.id === 'me' ? 0 : 1,
            val: n.id === 'me' ? 20 : 10,
        })),
        links: graphLinks.map(l => ({
            source: l.source,
            target: l.target
        }))
    };

    return (
        <div ref={containerRef} className="w-full h-full min-h-[300px] relative overflow-hidden rounded-lg">
            {dimensions.width > 0 && (
                <ForceGraph2D
                    ref={graphRef}
                    width={dimensions.width}
                    height={dimensions.height}
                    graphData={data}
                    backgroundColor={GRAPH_CONFIG.colors.bg}

                    // Node Styling
                    nodeLabel="label"
                    nodeColor={(node: any) => node.id === 'me' ? GRAPH_CONFIG.colors.primary : GRAPH_CONFIG.colors.trusted}
                    nodeRelSize={6}

                    // Link Styling
                    linkColor={() => GRAPH_CONFIG.colors.link}
                    linkWidth={1.5}
                    linkDirectionalArrowLength={3.5}
                    linkDirectionalArrowRelPos={1}

                    // Custom Node Drawing
                    nodeCanvasObject={(node: any, ctx, globalScale) => {
                        const isMe = node.id === 'me';
                        const size = isMe ? 8 : 5;
                        const label = node.label;

                        // Draw Circle
                        ctx.beginPath();
                        ctx.arc(node.x, node.y, size, 0, 2 * Math.PI, false);
                        ctx.fillStyle = isMe ? GRAPH_CONFIG.colors.primary : GRAPH_CONFIG.colors.trusted;
                        ctx.fill();

                        // Draw Glow for 'Me'
                        if (isMe) {
                            ctx.beginPath();
                            ctx.arc(node.x, node.y, size + 2, 0, 2 * Math.PI, false);
                            ctx.strokeStyle = GRAPH_CONFIG.colors.primary;
                            ctx.lineWidth = 0.5;
                            ctx.stroke();
                        }

                        // Draw Label
                        const fontSize = 12 / globalScale;
                        ctx.font = `${fontSize}px monospace`;
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillStyle = GRAPH_CONFIG.colors.text;

                        // Show label below node
                        ctx.fillText(label, node.x, node.y + size + fontSize + 2);
                    }}

                    // Engine
                    cooldownTicks={100}
                    onEngineStop={() => graphRef.current?.zoomToFit(400, 50)}
                />
            )}
        </div>
    );
}