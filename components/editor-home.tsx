import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"

interface EditorHomeProps {
  onNewProject: () => void
}

export function EditorHome({ onNewProject }: EditorHomeProps) {
  return (
    <div className="flex max-w-md flex-col items-center gap-4 px-6 text-center">
      <h1 className="text-xl font-medium text-copy-primary">
        Create a project or open an existing one
      </h1>
      <p className="text-sm text-copy-muted">
        Start a new architecture workspace, or choose a project from the sidebar.
      </p>
      <Button size="lg" onClick={onNewProject}>
        <Plus className="size-5" />
        New Project
      </Button>
    </div>
  )
}
