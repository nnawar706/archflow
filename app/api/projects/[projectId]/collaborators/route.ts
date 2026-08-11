import { NextRequest, NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"
import { Prisma } from "@/app/generated/prisma/client"
import { parseEmail } from "@/lib/collaborator-api"
import { enrichCollaborators } from "@/lib/collaborators"
import {
  getCurrentIdentity,
  hasProjectAccess,
  requireProjectOwner,
} from "@/lib/project-access"
import { errorResponse } from "@/lib/project-api"

interface RouteParams {
  params: Promise<{ projectId: string }>
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const identity = await getCurrentIdentity()
  if (!identity) {
    return errorResponse(401, "Unauthorized")
  }

  const { projectId } = await params
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { collaborators: { orderBy: { createdAt: "asc" } } },
  })

  if (!project) {
    return errorResponse(404, "Project not found")
  }
  if (!hasProjectAccess(project, identity)) {
    return errorResponse(403, "Forbidden")
  }

  const collaborators = await enrichCollaborators(project.collaborators)

  return NextResponse.json({
    collaborators,
    isOwner: project.ownerId === identity.userId,
  })
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const identity = await getCurrentIdentity()
  if (!identity) {
    return errorResponse(401, "Unauthorized")
  }

  const { projectId } = await params
  const result = await requireProjectOwner(projectId, identity.userId)
  if ("error" in result) {
    return result.error
  }

  const body: unknown = await request.json().catch(() => null)
  const email = parseEmail(body)
  if (!email) {
    return errorResponse(400, "A valid email is required")
  }

  try {
    const collaborator = await prisma.projectCollaborator.create({
      data: { projectId, email },
    })
    const [enriched] = await enrichCollaborators([collaborator])

    return NextResponse.json({ collaborator: enriched }, { status: 201 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return errorResponse(409, "This email is already a collaborator")
    }
    throw error
  }
}
