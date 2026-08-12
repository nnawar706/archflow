"use client"

import { ClientSideSuspense, LiveblocksProvider, RoomProvider } from "@liveblocks/react/suspense"
import { AlertTriangle, Loader2 } from "lucide-react"
import { ErrorBoundary } from "react-error-boundary"

import { CanvasFlow } from "@/components/canvas-flow"
import type { PendingTemplateImport } from "@/components/starter-templates"

import "@xyflow/react/dist/style.css"

interface CanvasProps {
  roomId: string
  isAiSidebarOpen?: boolean
  pendingTemplate?: PendingTemplateImport | null
}

export function Canvas({ roomId, isAiSidebarOpen, pendingTemplate }: CanvasProps) {
  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
      <RoomProvider id={roomId} initialPresence={{ cursor: null, isThinking: false }}>
        <ErrorBoundary fallback={<CanvasErrorFallback />}>
          <ClientSideSuspense fallback={<CanvasLoadingFallback />}>
            <CanvasFlow isAiSidebarOpen={isAiSidebarOpen} pendingTemplate={pendingTemplate} />
          </ClientSideSuspense>
        </ErrorBoundary>
      </RoomProvider>
    </LiveblocksProvider>
  )
}

function CanvasLoadingFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center gap-2 bg-base text-sm text-copy-muted">
      <Loader2 className="size-4 animate-spin" />
      Connecting to canvas…
    </div>
  )
}

function CanvasErrorFallback() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-base px-6 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl border border-surface-border bg-elevated">
        <AlertTriangle className="size-7 text-error" />
      </div>
      <h2 className="max-w-md text-xl font-medium text-copy-primary">
        Couldn&apos;t connect to the canvas
      </h2>
      <p className="max-w-md text-sm text-copy-muted">
        There was a problem joining this collaborative session. Refresh the page to try again.
      </p>
    </div>
  )
}
