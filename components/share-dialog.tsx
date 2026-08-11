"use client"

import type { FormEvent } from "react"
import { Check, Copy, Loader2, X } from "lucide-react"

import { BaseDialog } from "@/components/base-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Collaborator } from "@/hooks/use-share-dialog"

interface ShareDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  collaborators: Collaborator[]
  isOwner: boolean
  isLoadingList: boolean
  emailInput: string
  onEmailInputChange: (value: string) => void
  isInviting: boolean
  removingId: string | null
  error?: string | null
  copied: boolean
  onInvite: () => void
  onRemove: (collaboratorId: string) => void
  onCopyLink: () => void
}

export function ShareDialog({
  open,
  onOpenChange,
  collaborators,
  isOwner,
  isLoadingList,
  emailInput,
  onEmailInputChange,
  isInviting,
  removingId,
  error,
  copied,
  onInvite,
  onRemove,
  onCopyLink,
}: ShareDialogProps) {
  function handleInviteSubmit(event: FormEvent) {
    event.preventDefault()
    onInvite()
  }

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Share project"
      description="Invite collaborators to work on this project with you."
    >
      <div className="flex flex-col gap-4">
        <Button type="button" variant="outline" size="sm" onClick={onCopyLink}>
          {copied ? <Check className="size-4 text-success" /> : <Copy className="size-4" />}
          {copied ? "Copied!" : "Copy project link"}
        </Button>

        {isOwner ? (
          <form onSubmit={handleInviteSubmit} className="flex items-center gap-2">
            <Input
              type="email"
              value={emailInput}
              onChange={(event) => onEmailInputChange(event.target.value)}
              placeholder="Invite by email"
              className="text-copy-primary"
              disabled={isInviting}
            />
            <Button type="submit" size="sm" disabled={isInviting || !emailInput.trim()}>
              {isInviting ? <Loader2 className="size-4 animate-spin" /> : "Invite"}
            </Button>
          </form>
        ) : null}

        {error ? <p className="text-xs text-error">{error}</p> : null}

        <div className="flex flex-col gap-1">
          <p className="text-xs font-medium text-copy-muted">
            Collaborators{collaborators.length > 0 ? ` (${collaborators.length})` : ""}
          </p>

          {isLoadingList ? (
            <p className="py-4 text-center text-sm text-copy-muted">Loading...</p>
          ) : collaborators.length === 0 ? (
            <p className="py-4 text-center text-sm text-copy-muted">No collaborators yet</p>
          ) : (
            <ul className="flex max-h-64 flex-col gap-1 overflow-y-auto">
              {collaborators.map((collaborator) => (
                <li
                  key={collaborator.id}
                  className="flex items-center justify-between gap-2 rounded-xl px-2 py-1.5 hover:bg-subtle"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    {collaborator.avatarUrl ? (
                      <img
                        src={collaborator.avatarUrl}
                        alt=""
                        className="size-7 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-subtle text-xs font-medium text-copy-muted">
                        {collaborator.email.charAt(0).toUpperCase()}
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm text-copy-primary">
                        {collaborator.name ?? collaborator.email}
                      </p>
                      {collaborator.name ? (
                        <p className="truncate text-xs text-copy-muted">{collaborator.email}</p>
                      ) : null}
                    </div>
                  </div>

                  {isOwner ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      aria-label={`Remove ${collaborator.email}`}
                      disabled={removingId === collaborator.id}
                      onClick={() => onRemove(collaborator.id)}
                    >
                      <X className="size-3.5" />
                    </Button>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </BaseDialog>
  )
}
