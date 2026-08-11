"use client"

import { useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"

import { slugify } from "@/lib/utils"
import type { Project } from "@/types/project"

type DialogType = "create" | "rename" | "delete" | null

interface TargetProject {
  id: string
  name: string
}

function generateSuffix(): string {
  return Math.random().toString(36).slice(2, 8)
}

async function requestJson(url: string, method: string, body?: unknown) {
  const response = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const data = await response.json().catch(() => null)
    throw new Error(data?.error ?? "Something went wrong")
  }

  return response.json()
}

export function useProjectActions() {
  const router = useRouter()
  const params = useParams<{ roomId?: string }>()
  const activeProjectId = params?.roomId

  const [activeDialog, setActiveDialog] = useState<DialogType>(null)
  const [targetProject, setTargetProject] = useState<TargetProject | null>(null)
  const [nameInput, setNameInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const slugPreview = useMemo(() => slugify(nameInput), [nameInput])

  function closeDialog() {
    setActiveDialog(null)
    setTargetProject(null)
    setNameInput("")
    setError(null)
  }

  function openCreateDialog() {
    setNameInput("")
    setError(null)
    setActiveDialog("create")
  }

  function openRenameDialog(project: Project) {
    setTargetProject({ id: project.id, name: project.name })
    setNameInput(project.name)
    setError(null)
    setActiveDialog("rename")
  }

  function openDeleteDialog(project: Project) {
    setTargetProject({ id: project.id, name: project.name })
    setError(null)
    setActiveDialog("delete")
  }

  async function submitCreate() {
    const name = nameInput.trim() || "Untitled Project"
    const roomId = `${slugify(name) || "untitled-project"}-${generateSuffix()}`

    setIsLoading(true)
    setError(null)
    try {
      await requestJson("/api/projects", "POST", { id: roomId, name })
      closeDialog()
      router.push(`/editor/${roomId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create project")
    } finally {
      setIsLoading(false)
    }
  }

  async function submitRename() {
    if (!targetProject) return
    const name = nameInput.trim() || targetProject.name

    setIsLoading(true)
    setError(null)
    try {
      await requestJson(`/api/projects/${targetProject.id}`, "PATCH", { name })
      closeDialog()
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to rename project")
    } finally {
      setIsLoading(false)
    }
  }

  async function submitDelete() {
    if (!targetProject) return

    setIsLoading(true)
    setError(null)
    try {
      await requestJson(`/api/projects/${targetProject.id}`, "DELETE")
      const wasActiveWorkspace = targetProject.id === activeProjectId
      closeDialog()
      if (wasActiveWorkspace) {
        router.push("/editor")
      } else {
        router.refresh()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete project")
    } finally {
      setIsLoading(false)
    }
  }

  function submit() {
    if (activeDialog === "create") return submitCreate()
    if (activeDialog === "rename") return submitRename()
    if (activeDialog === "delete") return submitDelete()
  }

  return {
    activeDialog,
    targetProject,
    nameInput,
    setNameInput,
    slugPreview,
    isLoading,
    error,
    openCreateDialog,
    openRenameDialog,
    openDeleteDialog,
    closeDialog,
    submit,
  }
}
