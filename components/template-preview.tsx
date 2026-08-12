import type { CanvasTemplate } from "@/components/starter-templates"
import { BOUNDS_PADDING, PREVIEW_STROKE, PREVIEW_STROKE_WIDTH, EDGE_STROKE, EDGE_STROKE_WIDTH } from "@/constants"
import type { CanvasEdge, CanvasNode } from "@/types/canvas"

function getBounds(nodes: CanvasNode[]) {
  const minX = Math.min(...nodes.map((node) => node.position.x)) - BOUNDS_PADDING
  const minY = Math.min(...nodes.map((node) => node.position.y)) - BOUNDS_PADDING
  const maxX = Math.max(...nodes.map((node) => node.position.x + (node.width ?? 0))) + BOUNDS_PADDING
  const maxY = Math.max(...nodes.map((node) => node.position.y + (node.height ?? 0))) + BOUNDS_PADDING
  return { minX, minY, width: maxX - minX, height: maxY - minY }
}

// Same geometry as node-shape.tsx's ShapePath, but drawn directly at each
// node's own position/size instead of a normalized 0-100 viewBox — the whole
// preview lives in one shared coordinate space (the template's node
// positions), not one box per node.
function NodeGlyph({ node }: { node: CanvasNode }) {
  const { x, y } = node.position
  const width = node.width ?? 0
  const height = node.height ?? 0
  const { shape, color } = node.data

  if (shape === "rectangle") {
    return <rect x={x} y={y} width={width} height={height} rx={14} fill={color} stroke={PREVIEW_STROKE} strokeWidth={PREVIEW_STROKE_WIDTH} />
  }

  if (shape === "pill" || shape === "circle") {
    return (
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={Math.min(width, height) / 2}
        fill={color}
        stroke={PREVIEW_STROKE}
        strokeWidth={PREVIEW_STROKE_WIDTH}
      />
    )
  }

  if (shape === "diamond") {
    const cx = x + width / 2
    const cy = y + height / 2
    const points = `${cx},${y} ${x + width},${cy} ${cx},${y + height} ${x},${cy}`
    return <polygon points={points} fill={color} stroke={PREVIEW_STROKE} strokeWidth={PREVIEW_STROKE_WIDTH} strokeLinejoin="round" />
  }

  if (shape === "hexagon") {
    const cy = y + height / 2
    const inset = width * 0.22
    const points = `${x + inset},${y} ${x + width - inset},${y} ${x + width},${cy} ${x + width - inset},${y + height} ${x + inset},${y + height} ${x},${cy}`
    return <polygon points={points} fill={color} stroke={PREVIEW_STROKE} strokeWidth={PREVIEW_STROKE_WIDTH} strokeLinejoin="round" />
  }

  // cylinder: rounded body plus a top ellipse rim, mirroring node-shape.tsx.
  const capHeight = height * 0.18
  const bodyPath = `M${x},${y + capHeight} C${x},${y - capHeight * 0.2} ${x + width},${y - capHeight * 0.2} ${x + width},${y + capHeight} L${x + width},${y + height - capHeight} C${x + width},${y + height + capHeight * 0.2} ${x},${y + height + capHeight * 0.2} ${x},${y + height - capHeight} Z`
  return (
    <g>
      <path d={bodyPath} fill={color} stroke={PREVIEW_STROKE} strokeWidth={PREVIEW_STROKE_WIDTH} strokeLinejoin="round" />
      <ellipse cx={x + width / 2} cy={y + capHeight} rx={width / 2} ry={capHeight} fill={color} stroke={PREVIEW_STROKE} strokeWidth={PREVIEW_STROKE_WIDTH} />
    </g>
  )
}

function EdgeLine({ edge, nodesById }: { edge: CanvasEdge; nodesById: Map<string, CanvasNode> }) {
  const source = nodesById.get(edge.source)
  const target = nodesById.get(edge.target)
  if (!source || !target) {
    return null
  }

  const x1 = source.position.x + (source.width ?? 0) / 2
  const y1 = source.position.y + (source.height ?? 0) / 2
  const x2 = target.position.x + (target.width ?? 0) / 2
  const y2 = target.position.y + (target.height ?? 0) / 2

  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={EDGE_STROKE} strokeWidth={EDGE_STROKE_WIDTH} />
}

interface TemplatePreviewProps {
  template: CanvasTemplate
}

// A fixed-viewport SVG thumbnail of a template's diagram. No React Flow
// instance — the SVG's own viewBox (computed from node bounds) plus
// preserveAspectRatio does the "fit to viewport" scaling for free.
export function TemplatePreview({ template }: TemplatePreviewProps) {
  const bounds = getBounds(template.nodes)
  const nodesById = new Map(template.nodes.map((node) => [node.id, node]))

  return (
    <svg
      viewBox={`${bounds.minX} ${bounds.minY} ${bounds.width} ${bounds.height}`}
      preserveAspectRatio="xMidYMid meet"
      className="h-full w-full"
      role="img"
      aria-label={`${template.name} diagram preview`}
    >
      {template.edges.map((edge) => (
        <EdgeLine key={edge.id} edge={edge} nodesById={nodesById} />
      ))}
      {template.nodes.map((node) => (
        <NodeGlyph key={node.id} node={node} />
      ))}
    </svg>
  )
}
