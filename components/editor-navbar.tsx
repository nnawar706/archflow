"use client"

import { UserButton } from "@clerk/nextjs"
import { PanelLeftClose, PanelLeftOpen, Share2, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"

interface EditorNavbarProps {
  isSidebarOpen: boolean
  onToggleSidebar: () => void
  projectName?: string
  showWorkspaceActions?: boolean
  isAiSidebarOpen?: boolean
  onToggleAiSidebar?: () => void
}

export function EditorNavbar({
  isSidebarOpen,
  onToggleSidebar,
  projectName,
  showWorkspaceActions = false,
  isAiSidebarOpen = false,
  onToggleAiSidebar,
}: EditorNavbarProps) {
  return (
    <header className="flex h-14 w-full shrink-0 items-center gap-3 border-b border-surface-border bg-surface px-3">
      <div className="flex min-w-0 max-w-[60%] items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isSidebarOpen ? (
            <PanelLeftClose className="size-5" />
          ) : (
            <PanelLeftOpen className="size-5" />
          )}
        </Button>

        {projectName ? (
          <span className="truncate text-sm font-medium text-copy-primary">
            {projectName}
          </span>
        ) : null}
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        {showWorkspaceActions ? (
          <>
            <Button variant="outline" size="sm" aria-label="Share project">
              <Share2 className="size-4" />
              Share
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={onToggleAiSidebar}
              aria-pressed={isAiSidebarOpen}
              aria-label={isAiSidebarOpen ? "Close AI sidebar" : "Open AI sidebar"}
            >
              <Sparkles className="size-4 text-ai-text" />
              AI
            </Button>
          </>
        ) : null}

        <UserButton />
      </div>
    </header>
  )
}
