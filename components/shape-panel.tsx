"use client"

import { useRef, type DragEvent } from "react"
import { Circle, Cylinder, Diamond, Hexagon, Pill, Square } from "lucide-react"

import { Button } from "@/components/ui/button"
import { NodeShapeVisual } from "@/components/node-shape"
import { SHAPE_DRAG_MIME_TYPE, serializeShapeDragPayload } from "@/lib/shape-drag"
import { DEFAULT_NODE_COLOR, NODE_SHAPES, type NodeShape } from "@/types/canvas"

const SHAPE_ICONS: Record<NodeShape, typeof Square> = {
  rectangle: Square,
  diamond: Diamond,
  circle: Circle,
  pill: Pill,
  cylinder: Cylinder,
  hexagon: Hexagon,
}

export function ShapePanel() {
  const previewRefs = useRef<Partial<Record<NodeShape, HTMLDivElement | null>>>({})

  function handleDragStart(
    event: DragEvent<HTMLButtonElement>,
    shape: NodeShape,
    width: number,
    height: number
  ) {
    event.dataTransfer.setData(
      SHAPE_DRAG_MIME_TYPE,
      serializeShapeDragPayload({ shape, width, height })
    )
    event.dataTransfer.effectAllowed = "move"

    const preview = previewRefs.current[shape]
    if (preview) {
      event.dataTransfer.setDragImage(preview, width / 2, height / 2)
    }
  }

  return (
    <>
      <div className="flex items-center gap-1 rounded-full border border-surface-border bg-elevated p-1.5 shadow-lg">
        {NODE_SHAPES.map(({ shape, label, defaultWidth, defaultHeight }) => {
          const Icon = SHAPE_ICONS[shape]
          return (
            <Button
              key={shape}
              type="button"
              variant="ghost"
              size="icon"
              draggable
              onDragStart={(event) => handleDragStart(event, shape, defaultWidth, defaultHeight)}
              aria-label={`Drag to add a ${label} node`}
              title={label}
              className="cursor-grab rounded-full text-copy-muted active:cursor-grabbing"
            >
              <Icon className="size-5" />
            </Button>
          )
        })}
      </div>

      {/* Off-screen shape renders used as native drag images by handleDragStart above.
          Positioned off-canvas (not display:none/opacity:0) since browsers need the
          element actually laid out to rasterize it as the drag ghost. */}
      <div aria-hidden className="pointer-events-none fixed left-[-9999px] top-[-9999px]">
        {NODE_SHAPES.map(({ shape, defaultWidth, defaultHeight }) => (
          <div
            key={shape}
            ref={(node) => {
              previewRefs.current[shape] = node
            }}
            style={{ width: defaultWidth, height: defaultHeight }}
          >
            <NodeShapeVisual shape={shape} color={DEFAULT_NODE_COLOR} label="" showLabel={false} />
          </div>
        ))}
      </div>
    </>
  )
}
