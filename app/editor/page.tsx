"use client"

import { useState } from "react"

import { EditorHome } from "@/components/editor-home"
import { EditorNavbar } from "@/components/editor-navbar"
import { ProjectDialog } from "@/components/project-dialog"
import { ProjectSidebar } from "@/components/sidebar"
import { useProjectDialogs } from "@/hooks/use-project-dialogs"

export default function EditorPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const {
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
  } = useProjectDialogs()

  return (
    <div className="relative flex min-h-screen flex-1 flex-col overflow-hidden bg-base">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
      />

      <div className="relative flex flex-1 overflow-hidden">
        <ProjectSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          ownedProjects={ownedProjects}
          sharedProjects={sharedProjects}
          onCreate={openCreateDialog}
          onRename={openRenameDialog}
          onDelete={openDeleteDialog}
        />

        <main className="flex flex-1 items-center justify-center">
          <EditorHome onNewProject={openCreateDialog} />
        </main>
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
        onSubmit={submit}
      />
    </div>
  )
}
