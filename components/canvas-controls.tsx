"use client"

import { useCanRedo, useCanUndo, useRedo, useUndo } from "@liveblocks/react"
import { useReactFlow } from "@xyflow/react"
import { Maximize, Minus, Plus, Redo2, Undo2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"

const ZOOM_ANIMATION = { duration: 200 }

export function CanvasControls() {
  const reactFlowInstance = useReactFlow()
  const undo = useUndo()
  const redo = useRedo()
  const canUndo = useCanUndo()
  const canRedo = useCanRedo()

  useKeyboardShortcuts(reactFlowInstance, undo, redo)

  return (
    <div className="flex items-center gap-1 rounded-full border border-surface-border bg-elevated p-1.5 shadow-lg">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => reactFlowInstance.zoomOut(ZOOM_ANIMATION)}
        aria-label="Zoom out"
        title="Zoom out"
        className="rounded-full text-copy-muted"
      >
        <Minus className="size-5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => reactFlowInstance.fitView(ZOOM_ANIMATION)}
        aria-label="Fit view"
        title="Fit view"
        className="rounded-full text-copy-muted"
      >
        <Maximize className="size-5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => reactFlowInstance.zoomIn(ZOOM_ANIMATION)}
        aria-label="Zoom in"
        title="Zoom in"
        className="rounded-full text-copy-muted"
      >
        <Plus className="size-5" />
      </Button>

      <div className="mx-0.5 h-5 w-px bg-surface-border" />

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={undo}
        disabled={!canUndo}
        aria-label="Undo"
        title="Undo"
        className="rounded-full text-copy-muted"
      >
        <Undo2 className="size-5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={redo}
        disabled={!canRedo}
        aria-label="Redo"
        title="Redo"
        className="rounded-full text-copy-muted"
      >
        <Redo2 className="size-5" />
      </Button>
    </div>
  )
}
