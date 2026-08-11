"use client"

import { useState } from "react"

import { AiSidebarPlaceholder } from "@/components/ai-sidebar-placeholder"
import { CanvasPlaceholder } from "@/components/canvas-placeholder"
import { EditorNavbar } from "@/components/editor-navbar"
import { ProjectDialog } from "@/components/project-dialog"
import { ProjectSidebar } from "@/components/sidebar"
import { useProjectActions } from "@/hooks/use-project-actions"
import type { Project } from "@/types/project"

interface WorkspaceShellProps {
  project: Project
  ownedProjects: Project[]
  sharedProjects: Project[]
}

export function WorkspaceShell({
  project,
  ownedProjects,
  sharedProjects,
}: WorkspaceShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(false)
  const {
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
  } = useProjectActions()

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-base">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
        projectName={project.name}
        showWorkspaceActions
        isAiSidebarOpen={isAiSidebarOpen}
        onToggleAiSidebar={() => setIsAiSidebarOpen((open) => !open)}
      />

      <div className="relative flex flex-1 overflow-hidden">
        <ProjectSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          ownedProjects={ownedProjects}
          sharedProjects={sharedProjects}
          activeProjectId={project.id}
          onCreate={openCreateDialog}
          onRename={openRenameDialog}
          onDelete={openDeleteDialog}
        />

        <main className="flex-1 overflow-hidden">
          <CanvasPlaceholder />
        </main>

        <AiSidebarPlaceholder
          isOpen={isAiSidebarOpen}
          onClose={() => setIsAiSidebarOpen(false)}
        />
      </div>

      <ProjectDialog
        mode={activeDialog}
        open={activeDialog !== null}
        onOpenChange={(open) => !open && closeDialog()}
        name={nameInput}
        onNameChange={setNameInput}
        slugPreview={slugPreview}
        targetName={targetProject?.name ?? ""}
        isLoading={isLoading}
        error={error}
        onSubmit={submit}
      />
    </div>
  )
}
