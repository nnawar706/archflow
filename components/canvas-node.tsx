"use client"

import type { NodeProps } from "@xyflow/react"

import type { CanvasNode } from "@/types/canvas"

// Basic renderer: every shape draws as a bordered rectangle with a centered
// label. Shape-specific visuals (diamond, hexagon, cylinder, ...) come later.
export function CanvasNodeRenderer({ data }: NodeProps<CanvasNode>) {
  return (
    <div
      className="flex size-full items-center justify-center rounded-xl border border-surface-border px-3 py-2 text-center text-sm text-copy-primary"
      style={{ backgroundColor: data.color }}
    >
      {data.label}
    </div>
  )
}
