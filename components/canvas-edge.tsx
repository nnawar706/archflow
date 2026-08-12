"use client"

import { useState, type KeyboardEvent, type MouseEvent } from "react"
import { EdgeLabelRenderer, getSmoothStepPath, useReactFlow, type EdgeProps } from "@xyflow/react"

import { DEFAULT_EDGE_COLOR, type CanvasEdge } from "@/types/canvas"

const REST_OPACITY = 0.55

export function CanvasEdgeRenderer({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  selected,
  markerEnd,
  data,
}: EdgeProps<CanvasEdge>) {
  const { updateEdgeData } = useReactFlow()
  const [isHovered, setIsHovered] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [draftLabel, setDraftLabel] = useState("")

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 0,
  })

  const label = data?.label ?? ""
  const isActive = selected || isHovered || isEditing

  function startEditing(event: MouseEvent) {
    event.stopPropagation()
    setDraftLabel(label)
    setIsEditing(true)
  }

  function commitLabel() {
    updateEdgeData(id, { label: draftLabel.trim() })
    setIsEditing(false)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === "Escape") {
      event.currentTarget.blur()
    }
  }

  return (
    <>
      {/* Wide invisible path — the actual hover/click/double-click target, kept
          separate from the visible path so the line itself never looks thicker. */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={20}
        className="nodrag nopan cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onDoubleClick={startEditing}
      />
      <path
        d={edgePath}
        fill="none"
        stroke={DEFAULT_EDGE_COLOR}
        strokeWidth={1.5}
        strokeLinecap="round"
        markerEnd={markerEnd}
        style={{
          opacity: isActive ? 1 : REST_OPACITY,
          pointerEvents: "none",
          transition: "opacity 150ms ease",
        }}
      />
      <EdgeLabelRenderer>
        <div
          className="nodrag nopan absolute"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: "all",
          }}
        >
          {isEditing ? (
            <input
              autoFocus
              value={draftLabel}
              onChange={(event) => setDraftLabel(event.target.value)}
              onBlur={commitLabel}
              onKeyDown={handleKeyDown}
              style={{ width: `${Math.max(draftLabel.length, 3) + 1}ch` }}
              className="rounded-full border border-brand bg-elevated px-2.5 py-0.5 text-center text-xs text-copy-primary outline-none"
            />
          ) : label ? (
            <span
              onDoubleClick={startEditing}
              className="cursor-text rounded-full border border-surface-border bg-elevated px-2.5 py-0.5 text-xs text-copy-primary shadow-lg"
            >
              {label}
            </span>
          ) : (
            isActive && (
              <span
                onDoubleClick={startEditing}
                className="cursor-text rounded-full border border-dashed border-surface-border px-2.5 py-0.5 text-xs text-copy-faint"
              >
                Add label
              </span>
            )
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  )
}
