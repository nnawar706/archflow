"use client"

import { BaseDialog } from "@/components/base-dialog"
import { Button } from "@/components/ui/button"

interface UnsavedChangesDialogProps {
  open: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function UnsavedChangesDialog({ open, onCancel, onConfirm }: UnsavedChangesDialogProps) {
  return (
    <BaseDialog
      open={open}
      onOpenChange={(nextOpen) => !nextOpen && onCancel()}
      title="Unsaved changes"
      description="You have unsaved changes. You'll lose your progress if you proceed."
      footer={
        <>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={onConfirm}>
            Discard & Leave
          </Button>
        </>
      }
    />
  )
}
