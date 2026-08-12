"use client"

import { useEffect } from "react"
import type { ReactFlowInstance } from "@xyflow/react"

const ZOOM_ANIMATION = { duration: 200 }

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false
  }
  return target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable
}

export function useKeyboardShortcuts(
  reactFlowInstance: ReactFlowInstance,
  undo: () => void,
  redo: () => void
) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (isEditableTarget(event.target)) {
        return
      }

      const isModifier = event.metaKey || event.ctrlKey

      if (isModifier && event.key.toLowerCase() === "z") {
        event.preventDefault()
        if (event.shiftKey) {
          redo()
        } else {
          undo()
        }
        return
      }

      if (isModifier && event.key.toLowerCase() === "y") {
        event.preventDefault()
        redo()
        return
      }

      if (event.key === "+" || event.key === "=") {
        event.preventDefault()
        reactFlowInstance.zoomIn(ZOOM_ANIMATION)
        return
      }

      if (event.key === "-") {
        event.preventDefault()
        reactFlowInstance.zoomOut(ZOOM_ANIMATION)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [reactFlowInstance, undo, redo])
}
