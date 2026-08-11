import { prisma } from "@/lib/prisma"
import type { Project } from "@/app/generated/prisma/client"

interface OwnedAndSharedProjects {
  ownedProjects: Project[]
  sharedProjects: Project[]
}

export async function getOwnedAndSharedProjects(
  userId: string,
  email: string | null
): Promise<OwnedAndSharedProjects> {
  const [ownedProjects, sharedProjects] = await Promise.all([
    prisma.project.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: "desc" },
    }),
    email
      ? prisma.project.findMany({
          where: {
            ownerId: { not: userId },
            collaborators: { some: { email } },
          },
          orderBy: { createdAt: "desc" },
        })
      : [],
  ])

  return { ownedProjects, sharedProjects }
}
