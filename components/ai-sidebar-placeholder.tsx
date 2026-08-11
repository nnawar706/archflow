"use client"

import { Sparkles, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AiSidebarPlaceholderProps {
  isOpen: boolean
  onClose: () => void
}

export function AiSidebarPlaceholder({ isOpen, onClose }: AiSidebarPlaceholderProps) {
  return (
    <>
      {isOpen ? (
        <div
          role="presentation"
          onClick={onClose}
          className="absolute inset-0 z-30 bg-black/50 lg:hidden"
        />
      ) : null}

      <aside
        aria-hidden={!isOpen}
        className={cn(
          "absolute top-0 right-0 z-40 flex h-full w-80 flex-col rounded-l-2xl border-l border-surface-border bg-elevated/95 backdrop-blur-sm transition-transform duration-200 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-surface-border px-4 py-3">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-ai-text" />
            <div>
              <h2 className="text-sm font-medium text-copy-primary">AI Copilot</h2>
              <p className="text-xs text-copy-muted">Placeholder panel</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            aria-label="Close AI sidebar"
          >
            <X className="size-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="rounded-2xl border border-surface-border bg-subtle p-4">
            <p className="text-sm font-medium text-copy-primary">Chat surface pending</p>
            <p className="mt-1 text-xs text-copy-muted">
              The toggle is wired. Messaging and generation are intentionally out of scope
              here.
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}
