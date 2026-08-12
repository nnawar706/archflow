"use client"

import { useCallback, useEffect, useRef, type DragEvent } from "react"
import { useLiveblocksFlow } from "@liveblocks/react-flow"
import {
  Background,
  BackgroundVariant,
  ConnectionMode,
  MarkerType,
  MiniMap,
  Panel,
  ReactFlow,
  type DefaultEdgeOptions,
  type ReactFlowInstance,
} from "@xyflow/react"

import { CanvasControls } from "@/components/canvas-controls"
import { CanvasEdgeRenderer } from "@/components/canvas-edge"
import { CanvasNodeRenderer } from "@/components/canvas-node"
import { ShapePanel } from "@/components/shape-panel"
import type { PendingTemplateImport } from "@/components/starter-templates"
import { SHAPE_DRAG_MIME_TYPE, parseShapeDragPayload } from "@/lib/shape-drag"
import {
  DEFAULT_EDGE_COLOR,
  DEFAULT_NODE_COLOR,
  DEFAULT_NODE_TEXT_COLOR,
  type CanvasEdge,
  type CanvasNode,
  type NodeShape,
} from "@/types/canvas"
import { FIT_VIEW_DELAY_MS, AI_SIDEBAR_MINIMAP_OFFSET } from "@/constants"

interface CanvasFlowProps {
  isAiSidebarOpen?: boolean
  pendingTemplate?: PendingTemplateImport | null
}

const nodeTypes = { canvasNode: CanvasNodeRenderer }
const edgeTypes = { canvasEdge: CanvasEdgeRenderer }

// New connections use the custom canvas edge type and get an arrowhead by default.
const defaultEdgeOptions: DefaultEdgeOptions = {
  type: "canvasEdge",
  markerEnd: { type: MarkerType.ArrowClosed, color: DEFAULT_EDGE_COLOR, width: 18, height: 18 },
}

let nodeIdCounter = 0

function generateNodeId(shape: NodeShape): string {
  nodeIdCounter += 1
  return `${shape}-${Date.now()}-${nodeIdCounter}`
}

export function CanvasFlow({ isAiSidebarOpen, pendingTemplate }: CanvasFlowProps) {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onDelete } = useLiveblocksFlow<
    CanvasNode,
    CanvasEdge
  >({
    suspense: true,
    nodes: { initial: [] },
    edges: { initial: [] },
  })

  const reactFlowInstanceRef = useRef<ReactFlowInstance<CanvasNode, CanvasEdge> | null>(null)
  const appliedTemplateRequestIdRef = useRef<number | null>(null)

  // Latest-value refs so the template-import effect below doesn't need `nodes`/`edges`
  // in its dependency array — depending on them directly would re-run (and cancel the
  // pending fitView timeout via cleanup) the moment the import's own dispatch updates
  // them, right before the timeout could fire. Refs must be written in an effect, not
  // during render (react-hooks/refs).
  const nodesRef = useRef(nodes)
  const edgesRef = useRef(edges)
  useEffect(() => {
    nodesRef.current = nodes
    edgesRef.current = edges
  }, [nodes, edges])

  useEffect(() => {
    if (!pendingTemplate || pendingTemplate.requestId === appliedTemplateRequestIdRef.current) {
      return
    }
    appliedTemplateRequestIdRef.current = pendingTemplate.requestId

    onNodesChange([
      ...nodesRef.current.map((node) => ({ type: "remove" as const, id: node.id })),
      ...pendingTemplate.template.nodes.map((item) => ({ type: "add" as const, item })),
    ])
    onEdgesChange([
      ...edgesRef.current.map((edge) => ({ type: "remove" as const, id: edge.id })),
      ...pendingTemplate.template.edges.map((item) => ({ type: "add" as const, item })),
    ])

    const timeoutId = setTimeout(() => {
      reactFlowInstanceRef.current?.fitView({ duration: 200 })
    }, FIT_VIEW_DELAY_MS)
    return () => clearTimeout(timeoutId)
  }, [pendingTemplate, onNodesChange, onEdgesChange])

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
          textColor: DEFAULT_NODE_TEXT_COLOR,
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
      edgeTypes={edgeTypes}
      defaultEdgeOptions={defaultEdgeOptions}
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
      <Panel position="bottom-left">
        <CanvasControls />
      </Panel>
      <Panel position="bottom-center">
        <ShapePanel />
      </Panel>
    </ReactFlow>
  )
}
