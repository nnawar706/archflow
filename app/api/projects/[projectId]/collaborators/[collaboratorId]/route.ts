import { NextRequest, NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"
import { getCurrentIdentity, requireProjectOwner } from "@/lib/project-access"
import { errorResponse } from "@/lib/project-api"

interface RouteParams {
  params: Promise<{ projectId: string; collaboratorId: string }>
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const identity = await getCurrentIdentity()
  if (!identity) {
    return errorResponse(401, "Unauthorized")
  }

  const { projectId, collaboratorId } = await params
  const result = await requireProjectOwner(projectId, identity.userId)
  if ("error" in result) {
    return result.error
  }

  const collaborator = await prisma.projectCollaborator.findUnique({
    where: { id: collaboratorId },
  })
  if (!collaborator || collaborator.projectId !== projectId) {
    return errorResponse(404, "Collaborator not found")
  }

  await prisma.projectCollaborator.delete({ where: { id: collaboratorId } })

  return NextResponse.json({ success: true })
}
