import { Lock } from "lucide-react"
import Link from "next/link"

export function AccessDenied() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-base px-6 text-center">
      <div className="flex size-12 items-center justify-center rounded-2xl border border-surface-border bg-elevated">
        <Lock className="size-6 text-copy-muted" />
      </div>
      <h1 className="text-lg font-medium text-copy-primary">Access denied</h1>
      <p className="max-w-sm text-sm text-copy-muted">
        You don&apos;t have access to this project, or it doesn&apos;t exist.
      </p>
      <Link href="/editor" className="text-sm font-medium text-brand hover:underline">
        Back to projects
      </Link>
    </div>
  )
}
