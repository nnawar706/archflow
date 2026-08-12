import type { Edge, Node } from "@xyflow/react"

export type NodeShape = "rectangle" | "diamond" | "circle" | "pill" | "cylinder" | "hexagon"

export interface CanvasNodeData extends Record<string, unknown> {
  label: string
  color: string
  shape: NodeShape
}

export type CanvasNode = Node<CanvasNodeData, "canvasNode">
export type CanvasEdge = Edge<Record<string, unknown>, "canvasEdge">

export interface ShapeDefinition {
  shape: NodeShape
  label: string
  defaultWidth: number
  defaultHeight: number
}

// Sensible default sizes: rectangles wider than tall, circles square, diamonds
// slightly larger so labels have room.
export const NODE_SHAPES: ShapeDefinition[] = [
  { shape: "rectangle", label: "Rectangle", defaultWidth: 160, defaultHeight: 80 },
  { shape: "diamond", label: "Diamond", defaultWidth: 180, defaultHeight: 140 },
  { shape: "circle", label: "Circle", defaultWidth: 100, defaultHeight: 100 },
  { shape: "pill", label: "Pill", defaultWidth: 160, defaultHeight: 56 },
  { shape: "cylinder", label: "Cylinder", defaultWidth: 120, defaultHeight: 110 },
  { shape: "hexagon", label: "Hexagon", defaultWidth: 170, defaultHeight: 100 },
]

// Matches the "Neutral dark (default)" pair from ui-context.md's node color palette.
export const DEFAULT_NODE_COLOR = "#1F1F1F"
