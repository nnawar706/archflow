"use client"

import type { FormEvent } from "react"

import { BaseDialog } from "@/components/base-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export type ProjectDialogMode = "create" | "rename" | "delete"

interface ProjectDialogProps {
  mode: ProjectDialogMode | null
  open: boolean
  onOpenChange: (open: boolean) => void
  name: string
  onNameChange: (value: string) => void
  slugPreview: string
  targetName: string
  isLoading: boolean
  error?: string | null
  onSubmit: () => void
}

const COPY: Record<
  ProjectDialogMode,
  { title: string; submitLabel: string; loadingLabel: string }
> = {
  create: {
    title: "Create project",
    submitLabel: "Create project",
    loadingLabel: "Creating...",
  },
  rename: {
    title: "Rename project",
    submitLabel: "Save",
    loadingLabel: "Saving...",
  },
  delete: {
    title: "Delete project",
    submitLabel: "Delete",
    loadingLabel: "Deleting...",
  },
}

export function ProjectDialog({
  mode,
  open,
  onOpenChange,
  name,
  onNameChange,
  slugPreview,
  targetName,
  isLoading,
  error,
  onSubmit,
}: ProjectDialogProps) {
  if (!mode) return null

  const copy = COPY[mode]
  const description =
    mode === "create"
      ? "Start a new architecture workspace."
      : mode === "rename"
        ? `Choose a new name for "${targetName}".`
        : `This will permanently delete "${targetName}". This action cannot be undone.`

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    onSubmit()
  }

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      title={copy.title}
      description={description}
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          {mode === "delete" ? (
            <Button
              type="button"
              variant="destructive"
              disabled={isLoading}
              onClick={onSubmit}
            >
              {isLoading ? copy.loadingLabel : copy.submitLabel}
            </Button>
          ) : (
            <Button type="submit" form="project-dialog-form" disabled={isLoading}>
              {isLoading ? copy.loadingLabel : copy.submitLabel}
            </Button>
          )}
        </>
      }
    >
      {mode !== "delete" ? (
        <form
          id="project-dialog-form"
          onSubmit={handleSubmit}
          className="flex flex-col gap-1.5"
        >
          <label
            htmlFor="project-dialog-name"
            className={mode === "create" ? "text-sm text-copy-secondary" : "sr-only"}
          >
            Project name
          </label>
          <Input
            id="project-dialog-name"
            className="text-copy-primary"
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            placeholder="Untitled Project"
            autoFocus
          />
          {mode === "create" ? (
            <p className="text-xs text-copy-muted">/{slugPreview || "untitled-project"}</p>
          ) : null}
        </form>
      ) : null}
      {error ? <p className="text-xs text-error">{error}</p> : null}
    </BaseDialog>
  )
}
