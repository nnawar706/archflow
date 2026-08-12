import type { Edge, Node } from "@xyflow/react"

export type NodeShape = "rectangle" | "diamond" | "circle" | "pill" | "cylinder" | "hexagon"

export interface CanvasNodeData extends Record<string, unknown> {
  label: string
  color: string
  textColor: string
  shape: NodeShape
}

export type CanvasNode = Node<CanvasNodeData, "canvasNode">

export interface CanvasEdgeData extends Record<string, unknown> {
  label?: string
}

export type CanvasEdge = Edge<CanvasEdgeData, "canvasEdge">

// Matches ui-context.md's Edge Style section. Not a globals.css UI token for
// the same reason NODE_COLORS isn't — this is canvas content, not UI chrome.
export const DEFAULT_EDGE_COLOR = "#f8fafc"

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

export interface NodeColorOption {
  label: string
  background: string
  text: string
}

// The 8 predefined background/text pairs from ui-context.md's Node Color
// Palette table. None of these reuse globals.css tokens — they're node-fill
// colors tuned for readability against arbitrary node content, not UI chrome,
// so they stay local to canvas data per ui-context.md's own instruction.
export const NODE_COLORS: NodeColorOption[] = [
  { label: "Neutral", background: "#1F1F1F", text: "#EDEDED" },
  { label: "Blue", background: "#10233D", text: "#52A8FF" },
  { label: "Purple", background: "#2E1938", text: "#BF7AF0" },
  { label: "Orange", background: "#331B00", text: "#FF990A" },
  { label: "Red", background: "#3C1618", text: "#FF6166" },
  { label: "Pink", background: "#3A1726", text: "#F75F8F" },
  { label: "Green", background: "#0F2E18", text: "#62C073" },
  { label: "Teal", background: "#062822", text: "#0AC7B4" },
]

// Matches the "Neutral dark (default)" pair from ui-context.md's node color palette.
export const DEFAULT_NODE_COLOR = "#1F1F1F"
export const DEFAULT_NODE_TEXT_COLOR = "#EDEDED"

// Floor for node resizing — small enough to shrink any shape meaningfully,
// large enough that the label and shape outline stay legible.
export const MIN_NODE_WIDTH = 60
export const MIN_NODE_HEIGHT = 40
