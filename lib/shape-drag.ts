import { NODE_SHAPES, type NodeShape } from "@/types/canvas"

export const SHAPE_DRAG_MIME_TYPE = "application/x-arch-flow-shape"

export interface ShapeDragPayload {
  shape: NodeShape
  width: number
  height: number
}

const VALID_SHAPES = new Set<string>(NODE_SHAPES.map((definition) => definition.shape))

export function serializeShapeDragPayload(payload: ShapeDragPayload): string {
  return JSON.stringify(payload)
}

export function parseShapeDragPayload(raw: string): ShapeDragPayload | null {
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return null
  }

  if (typeof parsed !== "object" || parsed === null) {
    return null
  }

  const { shape, width, height } = parsed as Record<string, unknown>

  if (
    typeof shape !== "string" ||
    !VALID_SHAPES.has(shape) ||
    typeof width !== "number" ||
    typeof height !== "number"
  ) {
    return null
  }

  return { shape: shape as NodeShape, width, height }
}
