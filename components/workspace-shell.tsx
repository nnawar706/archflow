"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { AiSidebar } from "@/components/ai-sidebar"
import { Canvas } from "@/components/canvas"
import { EditorNavbar } from "@/components/editor-navbar"
import { ProjectDialog } from "@/components/project-dialog"
import { ProjectSidebar } from "@/components/sidebar"
import { ShareDialog } from "@/components/share-dialog"
import { StarterTemplatesModal } from "@/components/starter-templates-modal"
import type { CanvasTemplate, PendingTemplateImport } from "@/components/starter-templates"
import { UnsavedChangesDialog } from "@/components/unsaved-changes-dialog"
import { useProjectActions } from "@/hooks/use-project-actions"
import { useShareDialog } from "@/hooks/use-share-dialog"
import { useUnsavedChangesGuard } from "@/hooks/use-unsaved-changes-guard"
import type { SaveStatus } from "@/hooks/use-canvas-autosave"
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
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false)
  const [pendingTemplate, setPendingTemplate] = useState<PendingTemplateImport | null>(null)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle")
  const [autosaveEnabled, setAutosaveEnabled] = useState(true)
  const [manualSaveRequestId, setManualSaveRequestId] = useState<number | null>(null)
  const router = useRouter()
  const hasUnsavedChanges = saveStatus === "unsaved"
  const {
    isDialogOpen: isUnsavedChangesDialogOpen,
    guardNavigation,
    confirmLeave,
    cancelLeave,
  } = useUnsavedChangesGuard(hasUnsavedChanges)
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
  const {
    isOpen: isShareDialogOpen,
    openDialog: openShareDialog,
    closeDialog: closeShareDialog,
    collaborators,
    isOwner,
    isLoadingList,
    emailInput,
    setEmailInput,
    isInviting,
    removingId,
    error: shareError,
    copied,
    invite,
    remove,
    copyLink,
  } = useShareDialog(project.id)

  function handleImportTemplate(template: CanvasTemplate) {
    setPendingTemplate({ template, requestId: Date.now() })
  }

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-base">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
        projectName={project.name}
        showWorkspaceActions
        isAiSidebarOpen={isAiSidebarOpen}
        onToggleAiSidebar={() => setIsAiSidebarOpen((open) => !open)}
        onShare={openShareDialog}
        onOpenTemplates={() => setIsTemplatesModalOpen(true)}
        saveStatus={saveStatus}
        autosaveEnabled={autosaveEnabled}
        onToggleAutosave={() => setAutosaveEnabled((enabled) => !enabled)}
        onManualSave={() => setManualSaveRequestId(Date.now())}
      />

      <div className="relative flex flex-1 overflow-hidden">
        <ProjectSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          ownedProjects={ownedProjects}
          sharedProjects={sharedProjects}
          activeProjectId={project.id}
          onCreate={() => guardNavigation(openCreateDialog)}
          onRename={openRenameDialog}
          onDelete={openDeleteDialog}
          hasUnsavedChanges={hasUnsavedChanges}
          onNavigateAway={(href) => guardNavigation(() => router.push(href))}
        />

        <main className="flex-1 overflow-hidden">
          <Canvas
            roomId={project.id}
            isAiSidebarOpen={isAiSidebarOpen}
            pendingTemplate={pendingTemplate}
            onSaveStatusChange={setSaveStatus}
            autosaveEnabled={autosaveEnabled}
            manualSaveRequestId={manualSaveRequestId}
          />
        </main>

        <AiSidebar
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

      <ShareDialog
        open={isShareDialogOpen}
        onOpenChange={(open) => !open && closeShareDialog()}
        collaborators={collaborators}
        isOwner={isOwner}
        isLoadingList={isLoadingList}
        emailInput={emailInput}
        onEmailInputChange={setEmailInput}
        isInviting={isInviting}
        removingId={removingId}
        error={shareError}
        copied={copied}
        onInvite={invite}
        onRemove={remove}
        onCopyLink={copyLink}
      />

      <StarterTemplatesModal
        open={isTemplatesModalOpen}
        onOpenChange={setIsTemplatesModalOpen}
        onImport={handleImportTemplate}
      />

      <UnsavedChangesDialog
        open={isUnsavedChangesDialogOpen}
        onCancel={cancelLeave}
        onConfirm={confirmLeave}
      />
    </div>
  )
}
