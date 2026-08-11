import { clerkClient } from "@clerk/nextjs/server"

import type { ProjectCollaborator } from "@/app/generated/prisma/client"

export interface EnrichedCollaborator {
  id: string
  email: string
  name: string | null
  avatarUrl: string | null
}

/** Enriches collaborator rows with Clerk display name/avatar, falling back to email-only when no Clerk user matches. */
export async function enrichCollaborators(
  collaborators: ProjectCollaborator[]
): Promise<EnrichedCollaborator[]> {
  if (collaborators.length === 0) {
    return []
  }

  const client = await clerkClient()
  const { data: users } = await client.users.getUserList({
    emailAddress: collaborators.map((collaborator) => collaborator.email),
    limit: collaborators.length,
  })

  const userByEmail = new Map<string, (typeof users)[number]>()
  for (const user of users) {
    for (const emailAddress of user.emailAddresses) {
      userByEmail.set(emailAddress.emailAddress.toLowerCase(), user)
    }
  }

  return collaborators.map((collaborator) => {
    const user = userByEmail.get(collaborator.email.toLowerCase())
    const name = user ? [user.firstName, user.lastName].filter(Boolean).join(" ") : ""

    return {
      id: collaborator.id,
      email: collaborator.email,
      name: name || null,
      avatarUrl: user?.imageUrl ?? null,
    }
  })
}
