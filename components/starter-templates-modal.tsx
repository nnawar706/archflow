"use client"

import { Download } from "lucide-react"

import { CANVAS_TEMPLATES, type CanvasTemplate } from "@/components/starter-templates"
import { TemplatePreview } from "@/components/template-preview"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

interface StarterTemplatesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImport: (template: CanvasTemplate) => void
}

// Built directly on the shadcn Dialog primitives rather than BaseDialog:
// BaseDialog's DialogContent is capped at sm:max-w-sm, too narrow for a
// scrollable template gallery grid.
export function StarterTemplatesModal({ open, onOpenChange, onImport }: StarterTemplatesModalProps) {
  function handleImport(template: CanvasTemplate) {
    onImport(template)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl rounded-3xl border border-surface-border bg-elevated text-copy-primary sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-copy-primary">
            Start from a template
          </DialogTitle>
          <DialogDescription className="text-copy-muted">
            Replace the current canvas with a pre-built diagram.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="grid grid-cols-1 items-start gap-4 py-1 pr-4 sm:grid-cols-2">
            {CANVAS_TEMPLATES.map((template) => (
              <div
                key={template.id}
                className="flex flex-col rounded-2xl border border-surface-border bg-surface"
              >
                {/* overflow-hidden lives on the preview only, not the whole card — a card
                    stretched to a grid row's auto-computed height (sized off an optimistic
                    single-line text estimate) can end up shorter than its actual 2-line
                    description needs, and clipping the whole card silently hides the
                    Import button below the fold instead of just letting the card grow. */}
                <div className="h-32 shrink-0 overflow-hidden rounded-t-2xl border-b border-surface-border bg-base p-3">
                  <TemplatePreview template={template} />
                </div>
                <div className="flex flex-col gap-1 rounded-b-2xl p-3">
                  <h3 className="text-sm font-medium text-copy-primary">{template.name}</h3>
                  <p className="text-xs text-copy-muted">{template.description}</p>
                  <Button
                    type="button"
                    size="sm"
                    className="mt-2 w-full"
                    onClick={() => handleImport(template)}
                  >
                    <Download className="size-4" />
                    Import
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
