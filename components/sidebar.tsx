"use client"

import { Pencil, Plus, Trash2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import type { Project } from "@/types/project"

interface ProjectSidebarProps {
  isOpen: boolean
  onClose: () => void
  ownedProjects: Project[]
  sharedProjects: Project[]
  activeProjectId?: string
  onCreate: () => void
  onRename: (project: Project) => void
  onDelete: (project: Project) => void
}

function EmptyPlaceholder({ label }: { label: string }) {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16 text-center text-sm text-copy-muted">
      {label}
    </div>
  )
}

function ProjectRow({
  project,
  canManage,
  isActive,
  onRename,
  onDelete,
}: {
  project: Project
  canManage: boolean
  isActive: boolean
  onRename: (project: Project) => void
  onDelete: (project: Project) => void
}) {
  return (
    <div
      className={cn(
        "group flex items-center justify-between gap-2 rounded-xl px-2.5 py-2",
        isActive ? "bg-accent-dim" : "hover:bg-subtle"
      )}
    >
      <span
        className={cn(
          "flex min-w-0 items-center gap-2 truncate text-sm",
          isActive ? "text-brand" : "text-copy-primary"
        )}
      >
        {isActive ? (
          <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-brand" />
        ) : null}
        <span className="truncate">{project.name}</span>
      </span>

      {canManage ? (
        <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label={`Rename ${project.name}`}
            onClick={() => onRename(project)}
          >
            <Pencil className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label={`Delete ${project.name}`}
            onClick={() => onDelete(project)}
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      ) : null}
    </div>
  )
}

function ProjectList({
  projects,
  emptyLabel,
  canManage,
  activeProjectId,
  onRename,
  onDelete,
}: {
  projects: Project[]
  emptyLabel: string
  canManage: boolean
  activeProjectId?: string
  onRename: (project: Project) => void
  onDelete: (project: Project) => void
}) {
  if (projects.length === 0) {
    return <EmptyPlaceholder label={emptyLabel} />
  }

  return (
    <div className="flex flex-1 flex-col gap-0.5 overflow-y-auto py-1">
      {projects.map((project) => (
        <ProjectRow
          key={project.id}
          project={project}
          canManage={canManage}
          isActive={project.id === activeProjectId}
          onRename={onRename}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

export function ProjectSidebar({
  isOpen,
  onClose,
  ownedProjects,
  sharedProjects,
  activeProjectId,
  onCreate,
  onRename,
  onDelete,
}: ProjectSidebarProps) {
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
          "absolute top-0 left-0 z-40 flex h-full w-80 flex-col rounded-r-2xl border-r border-surface-border bg-elevated/95 backdrop-blur-sm transition-transform duration-200 ease-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-surface-border px-4 py-3">
          <h2 className="text-sm font-medium text-copy-primary">Projects</h2>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X className="size-4" />
          </Button>
        </div>

        <Tabs
          defaultValue="my-projects"
          className="flex flex-1 flex-col overflow-hidden px-4 pt-3"
        >
          <TabsList className="w-full">
            <TabsTrigger value="my-projects" className="flex-1">
              My Projects
            </TabsTrigger>
            <TabsTrigger value="shared" className="flex-1">
              Shared
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-projects" className="flex flex-1 flex-col">
            <ProjectList
              projects={ownedProjects}
              emptyLabel="No projects yet"
              canManage
              activeProjectId={activeProjectId}
              onRename={onRename}
              onDelete={onDelete}
            />
          </TabsContent>

          <TabsContent value="shared" className="flex flex-1 flex-col">
            <ProjectList
              projects={sharedProjects}
              emptyLabel="No shared projects yet"
              canManage={false}
              activeProjectId={activeProjectId}
              onRename={onRename}
              onDelete={onDelete}
            />
          </TabsContent>
        </Tabs>

        <div className="border-t border-surface-border p-4">
          <Button className="w-full" size="lg" onClick={onCreate}>
            <Plus className="size-5" />
            New Project
          </Button>
        </div>
      </aside>
    </>
  )
}
