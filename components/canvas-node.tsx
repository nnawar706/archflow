"use client"

import { useState, type ChangeEvent, type KeyboardEvent, type MouseEvent } from "react"
import { Handle, NodeResizer, Position, useReactFlow, type NodeProps } from "@xyflow/react"

import { NodeColorToolbar } from "@/components/node-color-toolbar"
import { NodeShapeVisual } from "@/components/node-shape"
import { MIN_NODE_HEIGHT, MIN_NODE_WIDTH, type CanvasNode } from "@/types/canvas"

// Small white dot with a dark border, hidden at rest and faded in on node
// hover via the `.arch-flow-handle` rule in globals.css (opacity can't live
// here since it needs to react to a CSS :hover state).
const HANDLE_STYLE = {
  width: 8,
  height: 8,
  borderRadius: 9999,
  backgroundColor: "var(--text-primary)",
  border: "1.5px solid var(--bg-base)",
}

const HANDLE_POSITIONS = [Position.Top, Position.Right, Position.Bottom, Position.Left]

export function CanvasNodeRenderer({ id, data, selected }: NodeProps<CanvasNode>) {
  const { updateNodeData } = useReactFlow()
  const [isEditing, setIsEditing] = useState(false)

  function handleLabelDoubleClick(event: MouseEvent<HTMLDivElement>) {
    event.stopPropagation()
    setIsEditing(true)
  }

  function handleLabelChange(event: ChangeEvent<HTMLTextAreaElement>) {
    updateNodeData(id, { label: event.target.value })
  }

  function handleLabelKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Escape") {
      event.currentTarget.blur()
    }
  }

  function handleColorSelect(background: string, text: string) {
    updateNodeData(id, { color: background, textColor: text })
  }

  return (
    <>
      {HANDLE_POSITIONS.map((position) => (
        <Handle
          key={position}
          id={position}
          type="source"
          position={position}
          className="arch-flow-handle"
          style={HANDLE_STYLE}
        />
      ))}
      <NodeColorToolbar isVisible={selected} activeColor={data.color} onSelect={handleColorSelect} />
      <NodeResizer
        isVisible={selected}
        minWidth={MIN_NODE_WIDTH}
        minHeight={MIN_NODE_HEIGHT}
        handleStyle={{
          width: 8,
          height: 8,
          borderRadius: 9999,
          backgroundColor: "var(--bg-elevated)",
          border: "1.5px solid var(--accent-primary)",
        }}
      />
      <NodeShapeVisual
        shape={data.shape}
        color={data.color}
        textColor={data.textColor}
        label={data.label}
        selected={selected}
        isEditing={isEditing}
        onLabelDoubleClick={handleLabelDoubleClick}
        onLabelChange={handleLabelChange}
        onLabelBlur={() => setIsEditing(false)}
        onLabelKeyDown={handleLabelKeyDown}
      />
    </>
  )
}
