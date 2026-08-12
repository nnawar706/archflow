"use client"

import type { DragEvent } from "react"
import { Circle, Cylinder, Diamond, Hexagon, Pill, Square } from "lucide-react"

import { Button } from "@/components/ui/button"
import { SHAPE_DRAG_MIME_TYPE, serializeShapeDragPayload } from "@/lib/shape-drag"
import { NODE_SHAPES, type NodeShape } from "@/types/canvas"

const SHAPE_ICONS: Record<NodeShape, typeof Square> = {
  rectangle: Square,
  diamond: Diamond,
  circle: Circle,
  pill: Pill,
  cylinder: Cylinder,
  hexagon: Hexagon,
}

export function ShapePanel() {
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
  }

  return (
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
  )
}
