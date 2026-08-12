"use client"

import { useCallback, useRef, type DragEvent } from "react"
import { useLiveblocksFlow } from "@liveblocks/react-flow"
import {
  Background,
  BackgroundVariant,
  ConnectionMode,
  MiniMap,
  Panel,
  ReactFlow,
  type ReactFlowInstance,
} from "@xyflow/react"

import { CanvasNodeRenderer } from "@/components/canvas-node"
import { ShapePanel } from "@/components/shape-panel"
import { SHAPE_DRAG_MIME_TYPE, parseShapeDragPayload } from "@/lib/shape-drag"
import { DEFAULT_NODE_COLOR, type CanvasEdge, type CanvasNode, type NodeShape } from "@/types/canvas"

interface CanvasFlowProps {
  isAiSidebarOpen?: boolean
}

// AI sidebar is `w-80` (320px), floated as an absolute overlay over the canvas — bump the
// MiniMap's right offset by that width plus a gap so the sidebar doesn't cover it.
const AI_SIDEBAR_MINIMAP_OFFSET = "336px"

const nodeTypes = { canvasNode: CanvasNodeRenderer }

let nodeIdCounter = 0

function generateNodeId(shape: NodeShape): string {
  nodeIdCounter += 1
  return `${shape}-${Date.now()}-${nodeIdCounter}`
}

export function CanvasFlow({ isAiSidebarOpen }: CanvasFlowProps) {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onDelete } = useLiveblocksFlow<
    CanvasNode,
    CanvasEdge
  >({
    suspense: true,
    nodes: { initial: [] },
    edges: { initial: [] },
  })

  const reactFlowInstanceRef = useRef<ReactFlowInstance<CanvasNode, CanvasEdge> | null>(null)

  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    if (!event.dataTransfer.types.includes(SHAPE_DRAG_MIME_TYPE)) {
      return
    }
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      const raw = event.dataTransfer.getData(SHAPE_DRAG_MIME_TYPE)
      const reactFlowInstance = reactFlowInstanceRef.current
      if (!raw || !reactFlowInstance) {
        return
      }

      const payload = parseShapeDragPayload(raw)
      if (!payload) {
        return
      }

      event.preventDefault()

      const center = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      const newNode: CanvasNode = {
        id: generateNodeId(payload.shape),
        type: "canvasNode",
        position: {
          x: center.x - payload.width / 2,
          y: center.y - payload.height / 2,
        },
        width: payload.width,
        height: payload.height,
        data: {
          label: "",
          color: DEFAULT_NODE_COLOR,
          shape: payload.shape,
        },
      }

      onNodesChange([{ type: "add", item: newNode }])
    },
    [onNodesChange]
  )

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onDelete={onDelete}
      onInit={(instance) => {
        reactFlowInstanceRef.current = instance
      }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      connectionMode={ConnectionMode.Loose}
      panOnScroll
      zoomActivationKeyCode={["Meta", "Control"]}
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
      <Panel position="bottom-center">
        <ShapePanel />
      </Panel>
    </ReactFlow>
  )
}
