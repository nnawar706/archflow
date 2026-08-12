"use client"

import { useEffect, useRef, useState } from "react"

import { AUTOSAVE_DEBOUNCE_MS } from "@/constants"
import type { CanvasEdge, CanvasNode } from "@/types/canvas"

export type SaveStatus = "idle" | "saving" | "saved" | "unsaved" | "error"

interface UseCanvasAutosaveOptions {
  projectId: string
  nodes: CanvasNode[]
  edges: CanvasEdge[]
  /** When false, canvas changes no longer schedule a debounced save — they mark the canvas "unsaved" instead. */
  enabled: boolean
  /** Bump this (e.g. `Date.now()`) to trigger an immediate save, bypassing the debounce — used by the manual Save button. */
  manualSaveRequestId?: number | null
  onStatusChange?: (status: SaveStatus) => void
}

/**
 * Debounce-saves the canvas to `PUT /api/projects/[projectId]/canvas` whenever
 * `nodes`/`edges` change and `enabled` is true. Skips the very first render
 * (the room's initial state, not an edit) so opening the editor doesn't
 * immediately re-save it. While `enabled` is false, edits are tracked as
 * "unsaved" instead of being saved — a distinct `manualSaveRequestId` (or
 * re-enabling autosave) is what actually saves them.
 */
export function useCanvasAutosave({
  projectId,
  nodes,
  edges,
  enabled,
  manualSaveRequestId,
  onStatusChange,
}: UseCanvasAutosaveOptions): { status: SaveStatus } {
  const [status, setStatus] = useState<SaveStatus>("idle")

  const onStatusChangeRef = useRef(onStatusChange)
  useEffect(() => {
    onStatusChangeRef.current = onStatusChange
  }, [onStatusChange])

  const latestRef = useRef({ nodes, edges })
  useEffect(() => {
    latestRef.current = { nodes, edges }
  }, [nodes, edges])

  const enabledRef = useRef(enabled)
  const isFirstRenderRef = useRef(true)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const appliedManualSaveRequestIdRef = useRef<number | null>(null)
  // True whenever an edit has happened since the last successful save —
  // survives toggling autosave off/on so re-enabling it (or a manual save)
  // knows whether there's actually anything pending to persist.
  const hasUnsavedEditsRef = useRef(false)

  function updateStatus(next: SaveStatus) {
    setStatus(next)
    onStatusChangeRef.current?.(next)
  }

  function scheduleSave() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      void saveCanvas()
    }, AUTOSAVE_DEBOUNCE_MS)
  }

  async function saveCanvas() {
    updateStatus("saving")
    try {
      const response = await fetch(`/api/projects/${projectId}/canvas`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(latestRef.current),
      })

      if (!response.ok) {
        throw new Error("Failed to save canvas")
      }

      hasUnsavedEditsRef.current = false
      updateStatus("saved")
    } catch {
      updateStatus("error")
    }
  }

  // Reacts to canvas edits only (not to `enabled` toggling by itself) — reads
  // `enabled` via a ref so flipping the switch alone doesn't re-run this.
  useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false
      return
    }

    if (!enabledRef.current) {
      hasUnsavedEditsRef.current = true
      updateStatus("unsaved")
      return
    }

    scheduleSave()

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only react to node/edge changes; `enabled` is read via a ref
  }, [nodes, edges])

  // Reacts to the autosave switch itself: turning it off cancels any save
  // that was about to run for an already-made edit (that edit becomes
  // "unsaved" instead of silently completing); turning it back on resumes
  // saving whatever's currently pending.
  useEffect(() => {
    enabledRef.current = enabled

    if (!enabled) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
        hasUnsavedEditsRef.current = true
        updateStatus("unsaved")
      }
      return
    }

    if (hasUnsavedEditsRef.current) {
      scheduleSave()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only react to `enabled` changing
  }, [enabled])

  // Manual save — fires immediately, independent of the debounce/enabled state above.
  useEffect(() => {
    if (
      manualSaveRequestId == null ||
      manualSaveRequestId === appliedManualSaveRequestIdRef.current
    ) {
      return
    }
    appliedManualSaveRequestIdRef.current = manualSaveRequestId

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    void saveCanvas()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only react to a new manual save request
  }, [manualSaveRequestId])

  return { status }
}
