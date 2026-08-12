"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Guards navigation away from the current page while `hasUnsavedChanges` is
 * true. Tab close/refresh/typed-URL navigation goes through the browser's
 * own `beforeunload` prompt (its wording can't be customized by any site).
 * In-app navigation goes through `guardNavigation`, which defers the given
 * action behind a custom confirm/cancel dialog instead.
 */
export function useUnsavedChangesGuard(hasUnsavedChanges: boolean) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const pendingActionRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    function handleBeforeUnload(event: BeforeUnloadEvent) {
      if (!hasUnsavedChanges) {
        return
      }
      event.preventDefault()
      event.returnValue = ""
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [hasUnsavedChanges])

  function guardNavigation(action: () => void) {
    if (!hasUnsavedChanges) {
      action()
      return
    }
    pendingActionRef.current = action
    setIsDialogOpen(true)
  }

  function confirmLeave() {
    setIsDialogOpen(false)
    const action = pendingActionRef.current
    pendingActionRef.current = null
    action?.()
  }

  function cancelLeave() {
    setIsDialogOpen(false)
    pendingActionRef.current = null
  }

  return { isDialogOpen, guardNavigation, confirmLeave, cancelLeave }
}
