import { auth, currentUser } from "@clerk/nextjs/server"

import { prisma } from "@/lib/prisma"
import type { Project, ProjectCollaborator } from "@/app/generated/prisma/client"

export interface ClerkIdentity {
  userId: string
  email: string | null
}

export async function getCurrentIdentity(): Promise<ClerkIdentity | null> {
  const { userId } = await auth()
  if (!userId) {
    return null
  }

  const user = await currentUser()
  const email = user?.primaryEmailAddress?.emailAddress ?? null

  return { userId, email }
}

export function hasProjectAccess(
  project: Pick<Project, "ownerId"> & {
    collaborators: Pick<ProjectCollaborator, "email">[]
  },
  identity: ClerkIdentity
): boolean {
  if (project.ownerId === identity.userId) {
    return true
  }

  return identity.email
    ? project.collaborators.some((collaborator) => collaborator.email === identity.email)
    : false
}

/** Fetches a project and returns it only if `identity` owns it or collaborates on it. */
export async function getAccessibleProject(
  projectId: string,
  identity: ClerkIdentity
): Promise<Project | null> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { collaborators: true },
  })

  if (!project || !hasProjectAccess(project, identity)) {
    return null
  }

  return project
}
