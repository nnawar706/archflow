"use client"

import { useMemo, useState } from "react"

import { slugify } from "@/lib/utils"
import type { Project } from "@/types/project"

const CURRENT_USER_ID = "user_mock_owner"

const INITIAL_PROJECTS: Project[] = [
  {
    id: "1",
    name: "Checkout Service",
    slug: "checkout-service",
    ownerId: CURRENT_USER_ID,
  },
  {
    id: "2",
    name: "Notification Pipeline",
    slug: "notification-pipeline",
    ownerId: CURRENT_USER_ID,
  },
  {
    id: "3",
    name: "Partner API Gateway",
    slug: "partner-api-gateway",
    ownerId: "user_mock_collaborator",
  },
]

type DialogType = "create" | "rename" | "delete" | null

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function useProjectDialogs() {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS)
  const [activeDialog, setActiveDialog] = useState<DialogType>(null)
  const [targetProject, setTargetProject] = useState<Project | null>(null)
  const [nameInput, setNameInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const ownedProjects = useMemo(
    () => projects.filter((project) => project.ownerId === CURRENT_USER_ID),
    [projects]
  )
  const sharedProjects = useMemo(
    () => projects.filter((project) => project.ownerId !== CURRENT_USER_ID),
    [projects]
  )
  const slugPreview = useMemo(() => slugify(nameInput), [nameInput])

  function closeDialog() {
    setActiveDialog(null)
    setTargetProject(null)
    setNameInput("")
  }

  function openCreateDialog() {
    setNameInput("")
    setActiveDialog("create")
  }

  function openRenameDialog(project: Project) {
    setTargetProject(project)
    setNameInput(project.name)
    setActiveDialog("rename")
  }

  function openDeleteDialog(project: Project) {
    setTargetProject(project)
    setActiveDialog("delete")
  }

  async function submitCreate() {
    const name = nameInput.trim() || "Untitled Project"
    setIsLoading(true)
    await wait(300)
    setProjects((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name,
        slug: slugify(name),
        ownerId: CURRENT_USER_ID,
      },
    ])
    setIsLoading(false)
    closeDialog()
  }

  async function submitRename() {
    if (!targetProject) return
    const name = nameInput.trim() || targetProject.name
    setIsLoading(true)
    await wait(300)
    setProjects((prev) =>
      prev.map((project) =>
        project.id === targetProject.id
          ? { ...project, name, slug: slugify(name) }
          : project
      )
    )
    setIsLoading(false)
    closeDialog()
  }

  async function submitDelete() {
    if (!targetProject) return
    setIsLoading(true)
    await wait(300)
    setProjects((prev) =>
      prev.filter((project) => project.id !== targetProject.id)
    )
    setIsLoading(false)
    closeDialog()
  }

  function submit() {
    if (activeDialog === "create") return submitCreate()
    if (activeDialog === "rename") return submitRename()
    if (activeDialog === "delete") return submitDelete()
  }

  return {
    ownedProjects,
    sharedProjects,
    activeDialog,
    targetProject,
    nameInput,
    setNameInput,
    slugPreview,
    isLoading,
    openCreateDialog,
    openRenameDialog,
    openDeleteDialog,
    closeDialog,
    submit,
  }
}
