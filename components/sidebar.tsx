"use client"

import { Plus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface ProjectSidebarProps {
  isOpen: boolean
  onClose: () => void
}

function EmptyPlaceholder({ label }: { label: string }) {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16 text-center text-sm text-copy-muted">
      {label}
    </div>
  )
}

export function ProjectSidebar({ isOpen, onClose }: ProjectSidebarProps) {
  return (
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
          <EmptyPlaceholder label="No projects yet" />
        </TabsContent>

        <TabsContent value="shared" className="flex flex-1 flex-col">
          <EmptyPlaceholder label="No shared projects yet" />
        </TabsContent>
      </Tabs>

      <div className="border-t border-surface-border p-4">
        <Button className="w-full" size="lg">
          <Plus className="size-5" />
          New Project
        </Button>
      </div>
    </aside>
  )
}
