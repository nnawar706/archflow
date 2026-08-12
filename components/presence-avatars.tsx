"use client"

import { useUser } from "@clerk/nextjs"
import { UserButton } from "@clerk/nextjs"
import { shallow, useOthers } from "@liveblocks/react"

import { AVATAR_SIZE_CLASS, MAX_VISIBLE_AVATARS } from "@/constants"

interface CollaboratorInfo {
  connectionId: number
  id: string
  name: string
  avatar: string
  color: string
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) {
    return "?"
  }
  if (parts.length === 1) {
    return parts[0]!.charAt(0).toUpperCase()
  }
  return (parts[0]!.charAt(0) + parts[parts.length - 1]!.charAt(0)).toUpperCase()
}

function CollaboratorAvatar({ name, avatar, color }: Omit<CollaboratorInfo, "connectionId" | "id">) {
  return (
    <div
      title={name}
      className={`flex ${AVATAR_SIZE_CLASS} shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-elevated bg-subtle text-xs font-medium text-copy-secondary ring-1 ring-inset ring-subtle-border`}
      style={{ boxShadow: `0 0 0 1px ${color}` }}
    >
      {avatar ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={avatar} alt="" className="size-full object-cover" />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  )
}

export function PresenceAvatars() {
  const { user } = useUser()
  const others = useOthers(
    (list) =>
      list.map((other) => ({
        connectionId: other.connectionId,
        id: other.id,
        name: other.info.name,
        avatar: other.info.avatar,
        color: other.info.color,
      })),
    shallow
  )

  const collaborators = others.filter((other) => other.id !== user?.id)
  const visible = collaborators.slice(0, MAX_VISIBLE_AVATARS)
  const overflowCount = collaborators.length - visible.length

  return (
    <div className="flex items-center gap-2 rounded-full border border-surface-border bg-elevated/90 p-1 shadow-lg backdrop-blur">
      {visible.length > 0 ? (
        <>
          <div className="flex items-center -space-x-2">
            {visible.map((other) => (
              <CollaboratorAvatar
                key={other.connectionId}
                name={other.name}
                avatar={other.avatar}
                color={other.color}
              />
            ))}
            {overflowCount > 0 ? (
              <div
                className={`flex ${AVATAR_SIZE_CLASS} shrink-0 items-center justify-center rounded-full border-2 border-elevated bg-subtle text-xs font-medium text-copy-secondary`}
              >
                +{overflowCount}
              </div>
            ) : null}
          </div>
          <div className="h-5 w-px bg-surface-border" />
        </>
      ) : null}

      <UserButton
        appearance={{ elements: { userButtonAvatarBox: AVATAR_SIZE_CLASS } }}
      />
    </div>
  )
}
