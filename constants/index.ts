export const FEATURES = [
  {
    title: "AI Architecture Generation",
    description:
      "Describe your system, AI maps it to nodes and edges on a live canvas.",
  },
  {
    title: "Real-time Collaboration",
    description:
      "Live cursors, presence indicators, and shared node editing across your team.",
  },
  {
    title: "Instant Spec Generation",
    description:
      "Export a complete Markdown technical spec directly from the canvas graph.",
  },
]


// fitView is called a tick after the remove+add changes are dispatched: the
// new nodes only reach React Flow's own internal store (and thus have
// measured positions to fit to) on the render that follows the Liveblocks
// storage mutation, not synchronously within this one.
export const FIT_VIEW_DELAY_MS = 50

// AI sidebar is `w-80` (320px), floated as an absolute overlay over the canvas — bump the
// MiniMap's right offset by that width plus a gap so the sidebar doesn't cover it.
export const AI_SIDEBAR_MINIMAP_OFFSET = "336px"

// Small white dot with a dark border, hidden at rest and faded in on node
// hover via the `.arch-flow-handle` rule in globals.css (opacity can't live
// here since it needs to react to a CSS :hover state).
export const HANDLE_STYLE = {
  width: 8,
  height: 8,
  borderRadius: 9999,
  backgroundColor: "var(--text-primary)",
  border: "1.5px solid var(--bg-base)",
}

export const CSS_SHAPE_RADIUS: Record<"rectangle" | "pill" | "circle", string> = {
  rectangle: "rounded-xl",
  pill: "rounded-full",
  circle: "rounded-full",
}

export const REST_OPACITY = 0.55
export const ZOOM_ANIMATION = { duration: 200 }
export const PREVIEW_STROKE = "var(--border-default)"
export const PREVIEW_STROKE_WIDTH = 2
export const EDGE_STROKE = "var(--border-subtle)"
export const EDGE_STROKE_WIDTH = 3
export const BOUNDS_PADDING = 24
export const REST_STROKE = "var(--border-default)"
export const SELECTED_STROKE = "var(--accent-primary)"