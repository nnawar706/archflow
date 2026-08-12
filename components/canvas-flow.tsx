"use client"

import { useLiveblocksFlow } from "@liveblocks/react-flow"
import { Background, BackgroundVariant, ConnectionMode, MiniMap, ReactFlow } from "@xyflow/react"

import type { CanvasEdge, CanvasNode } from "@/types/canvas"

interface CanvasFlowProps {
  isAiSidebarOpen?: boolean
}

// AI sidebar is `w-80` (320px), floated as an absolute overlay over the canvas — bump the
// MiniMap's right offset by that width plus a gap so the sidebar doesn't cover it.
const AI_SIDEBAR_MINIMAP_OFFSET = "336px"

export function CanvasFlow({ isAiSidebarOpen }: CanvasFlowProps) {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onDelete } = useLiveblocksFlow<
    CanvasNode,
    CanvasEdge
  >({
    suspense: true,
    nodes: { initial: [] },
    edges: { initial: [] },
  })

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onDelete={onDelete}
      connectionMode={ConnectionMode.Loose}
      fitView
    >
      <Background variant={BackgroundVariant.Dots} />
      <MiniMap
        className="border border-surface-border transition-[right] duration-200 ease-out"
        style={{ right: isAiSidebarOpen ? AI_SIDEBAR_MINIMAP_OFFSET : undefined }}
        bgColor="var(--bg-elevated)"
        maskColor="color-mix(in srgb, var(--bg-base) 70%, transparent)"
        maskStrokeColor="var(--border-subtle)"
        nodeColor="var(--text-faint)"
        nodeStrokeColor="var(--border-subtle)"
      />
    </ReactFlow>
  )
}
