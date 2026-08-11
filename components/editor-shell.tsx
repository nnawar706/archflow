"use client"

import { useState } from "react"
import type { ReactNode } from "react"

import { EditorNavbar } from "@/components/editor-navbar"
import { ProjectSidebar } from "@/components/sidebar"

interface EditorShellProps {
  children?: ReactNode
}

export function EditorShell({ children }: EditorShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

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
        />

        <main className="flex flex-1 items-center justify-center">
          {children}
        </main>
      </div>
    </div>
  )
}
