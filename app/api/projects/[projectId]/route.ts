import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import type { Project } from "@/app/generated/prisma/client"
import { errorResponse, parseProjectName } from "@/lib/project-api"

interface RouteParams {
  params: Promise<{ projectId: string }>
}

async function findOwnedProject(
  projectId: string,
  userId: string
): Promise<{ project: Project } | { error: NextResponse }> {
  const project = await prisma.project.findUnique({ where: { id: projectId } })

  if (!project) {
    return { error: errorResponse(404, "Project not found") }
  }

  if (project.ownerId !== userId) {
    return { error: errorResponse(403, "Forbidden") }
  }

  return { project }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { userId } = await auth()
  if (!userId) {
    return errorResponse(401, "Unauthorized")
  }

  const { projectId } = await params
  const result = await findOwnedProject(projectId, userId)
  if ("error" in result) {
    return result.error
  }

  const body: unknown = await request.json().catch(() => null)
  const name = parseProjectName(body)
  if (!name) {
    return errorResponse(400, "Project name is required")
  }

  const project = await prisma.project.update({
    where: { id: projectId },
    data: { name },
  })

  return NextResponse.json({ project })
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { userId } = await auth()
  if (!userId) {
    return errorResponse(401, "Unauthorized")
  }

  const { projectId } = await params
  const result = await findOwnedProject(projectId, userId)
  if ("error" in result) {
    return result.error
  }

  await prisma.project.delete({ where: { id: projectId } })

  return NextResponse.json({ success: true })
}
