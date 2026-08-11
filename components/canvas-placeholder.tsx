import { Compass } from "lucide-react"

export function CanvasPlaceholder() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-base px-6 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl border border-surface-border bg-elevated">
        <Compass className="size-7 text-brand" />
      </div>
      <p className="text-xs font-medium tracking-widest text-copy-faint uppercase">
        Workspace Shell
      </p>
      <h2 className="max-w-md text-xl font-medium text-copy-primary">
        Canvas and collaboration tooling land here next.
      </h2>
      <p className="max-w-md text-sm text-copy-muted">
        This room is ready for the shared architecture canvas, real-time presence, and AI
        workflows. For now, the shell is wired with project context and navigation only.
      </p>
    </div>
  )
}
