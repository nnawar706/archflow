"use client"

import type { CSSProperties } from "react"
import { NodeToolbar, Position } from "@xyflow/react"

import { cn } from "@/lib/utils"
import { NODE_COLORS } from "@/types/canvas"

interface NodeColorToolbarProps {
  isVisible: boolean
  activeColor: string
  onSelect: (background: string, text: string) => void
}

export function NodeColorToolbar({ isVisible, activeColor, onSelect }: NodeColorToolbarProps) {
  return (
    <NodeToolbar
      isVisible={isVisible}
      position={Position.Top}
      offset={12}
      className="nodrag nopan flex items-center gap-1.5 rounded-full border border-surface-border bg-elevated px-1.5 shadow-lg"
    >
      {NODE_COLORS.map(({ label, background, text }) => {
        const isActive = background === activeColor
        return (
          <button
            key={label}
            type="button"
            title={label}
            aria-label={`Set node color to ${label}`}
            aria-pressed={isActive}
            onClick={() => onSelect(background, text)}
            style={{ backgroundColor: background, "--swatch-glow": text } as CSSProperties}
            className={cn(
              "size-5 shrink-0 rounded-full border transition-shadow duration-150 mt-1 mb-1",
              "hover:shadow-[0_0_4px_1px_var(--swatch-glow)]",
              isActive ? "border-copy-primary shadow-[0_0_0_2px_var(--swatch-glow)]" : "border-surface-border"
            )}
          />
        )
      })}
    </NodeToolbar>
  )
}
