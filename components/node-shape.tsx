"use client"

import type { ChangeEvent, KeyboardEvent, MouseEvent } from "react"

import { cn } from "@/lib/utils"
import type { NodeShape } from "@/types/canvas"
import { CSS_SHAPE_RADIUS, SELECTED_STROKE, REST_STROKE } from "@/constants"

interface NodeShapeVisualProps {
  shape: NodeShape
  color: string
  textColor?: string
  label: string
  selected?: boolean
  className?: string
  /** Set false for non-interactive previews (e.g. the shape panel's drag ghost) to skip the label/placeholder overlay entirely. */
  showLabel?: boolean
  isEditing?: boolean
  onLabelDoubleClick?: (event: MouseEvent<HTMLDivElement>) => void
  onLabelChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void
  onLabelBlur?: () => void
  onLabelKeyDown?: (event: KeyboardEvent<HTMLTextAreaElement>) => void
}

// diamond, hexagon, and cylinder render as SVG since CSS borders can't
// describe their outlines. The viewBox is a fixed 0-100 square with
// preserveAspectRatio="none" so the shape stretches to fill whatever
// width/height the node currently has.
function ShapePath({ shape, color, stroke, strokeWidth }: { shape: "diamond" | "hexagon" | "cylinder"; color: string; stroke: string; strokeWidth: number }) {
  if (shape === "diamond") {
    return <polygon points="50,2 98,50 50,98 2,50" fill={color} stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
  }

  if (shape === "hexagon") {
    return (
      <polygon
        points="25,3 75,3 98,50 75,97 25,97 2,50"
        fill={color}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    )
  }

  return (
    <g>
      <path
        d="M4,20 C4,12 96,12 96,20 L96,80 C96,88 4,88 4,80 Z"
        fill={color}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <ellipse cx="50" cy="20" rx="46" ry="8" fill={color} stroke={stroke} strokeWidth={strokeWidth} />
    </g>
  )
}

// Shape background only — no label — so the label overlay below can stay an
// identically-positioned element whether it's showing static text or the
// editing textarea, with nothing shifting in between.
function ShapeBackground({ shape, color, stroke, strokeWidth }: { shape: NodeShape; color: string; stroke: string; strokeWidth: number }) {
  if (shape === "rectangle" || shape === "pill" || shape === "circle") {
    return (
      <div
        className={cn("size-full border", CSS_SHAPE_RADIUS[shape])}
        style={{ backgroundColor: color, borderColor: stroke, borderWidth: strokeWidth }}
      />
    )
  }

  return (
    <svg className="absolute inset-0 size-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <ShapePath shape={shape} color={color} stroke={stroke} strokeWidth={strokeWidth} />
    </svg>
  )
}

export function NodeShapeVisual({
  shape,
  color,
  textColor = "var(--text-primary)",
  label,
  selected,
  className,
  showLabel = true,
  isEditing,
  onLabelDoubleClick,
  onLabelChange,
  onLabelBlur,
  onLabelKeyDown,
}: NodeShapeVisualProps) {
  const stroke = selected ? SELECTED_STROKE : REST_STROKE
  const strokeWidth = selected ? 2 : 1

  return (
    <div className={cn("relative size-full", className)}>
      <ShapeBackground shape={shape} color={color} stroke={stroke} strokeWidth={strokeWidth} />
      {showLabel && (
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center px-3 py-2 text-center text-sm",
            !isEditing && "cursor-text"
          )}
          onDoubleClick={!isEditing ? onLabelDoubleClick : undefined}
        >
          {isEditing ? (
            <textarea
              className="nodrag nopan size-full resize-none bg-transparent text-center text-sm outline-none placeholder:text-copy-faint"
              style={{ color: textColor }}
              value={label}
              autoFocus
              onFocus={(event) => event.target.select()}
              onChange={onLabelChange}
              onBlur={onLabelBlur}
              onKeyDown={onLabelKeyDown}
              placeholder="Label"
            />
          ) : (
            label && (
              <span className="line-clamp-3 wrap-break-word" style={{ color: textColor }}>
                {label}
              </span>
            )
          )}
        </div>
      )}
    </div>
  )
}
