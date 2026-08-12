"use client"

import { UserButton } from "@clerk/nextjs"
import {
  AlertTriangle,
  Check,
  Cloud,
  CloudOff,
  LayoutTemplate,
  Loader2,
  PanelLeftClose,
  PanelLeftOpen,
  Save,
  Share2,
  Sparkles,
  Zap,
  ZapOff,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import type { SaveStatus } from "@/hooks/use-canvas-autosave"

interface EditorNavbarProps {
  isSidebarOpen: boolean
  onToggleSidebar: () => void
  projectName?: string
  showWorkspaceActions?: boolean
  isAiSidebarOpen?: boolean
  onToggleAiSidebar?: () => void
  onShare?: () => void
  onOpenTemplates?: () => void
  saveStatus?: SaveStatus
  autosaveEnabled?: boolean
  onToggleAutosave?: () => void
  onManualSave?: () => void
}

const SAVE_STATUS_CONFIG: Record<
  SaveStatus,
  { icon: typeof Cloud; label: string; className: string }
> = {
  idle: { icon: Cloud, label: "Saved", className: "text-copy-muted" },
  saving: { icon: Loader2, label: "Saving…", className: "text-copy-muted" },
  saved: { icon: Check, label: "Saved", className: "text-success" },
  unsaved: { icon: CloudOff, label: "Unsaved changes", className: "text-warning" },
  error: { icon: AlertTriangle, label: "Error saving", className: "text-error" },
}

export function EditorNavbar({
  isSidebarOpen,
  onToggleSidebar,
  projectName,
  showWorkspaceActions = false,
  isAiSidebarOpen = false,
  onToggleAiSidebar,
  onShare,
  onOpenTemplates,
  saveStatus = "idle",
  autosaveEnabled = true,
  onToggleAutosave,
  onManualSave,
}: EditorNavbarProps) {
  const { icon: SaveStatusIcon, label: saveStatusLabel, className: saveStatusClassName } =
    SAVE_STATUS_CONFIG[saveStatus]
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
            <Button
              variant="ghost"
              size="sm"
              disabled
              className={`gap-1.5 ${saveStatusClassName}`}
              aria-label={saveStatusLabel}
            >
              <SaveStatusIcon
                className={`size-4 ${saveStatus === "saving" ? "animate-spin" : ""}`}
              />
              {saveStatusLabel}
            </Button>
            {!autosaveEnabled ? (
              <Button
                variant="outline"
                size="sm"
                onClick={onManualSave}
                disabled={saveStatus === "saving"}
                aria-label="Save canvas now"
              >
                <Save className="size-4" />
                Save
              </Button>
            ) : null}
            <Button
              variant={autosaveEnabled ? "secondary" : "outline"}
              size="sm"
              onClick={onToggleAutosave}
              aria-pressed={autosaveEnabled}
              aria-label={autosaveEnabled ? "Turn autosave off" : "Turn autosave on"}
            >
              {autosaveEnabled ? (
                <Zap className="size-4" />
              ) : (
                <ZapOff className="size-4" />
              )}
              Autosave
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenTemplates}
              aria-label="Browse starter templates"
            >
              <LayoutTemplate className="size-4" />
              Templates
            </Button>
            <Button variant="outline" size="sm" onClick={onShare} aria-label="Share project">
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
