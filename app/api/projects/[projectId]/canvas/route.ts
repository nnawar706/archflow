import { NextRequest, NextResponse } from "next/server"

import { loadCanvasSnapshot, saveCanvasSnapshot } from "@/lib/canvas-storage"
import { parseCanvasSnapshot } from "@/lib/canvas-api"
import { errorResponse } from "@/lib/project-api"
import { getAccessibleProject, getCurrentIdentity } from "@/lib/project-access"
import { prisma } from "@/lib/prisma"

interface RouteParams {
  params: Promise<{ projectId: string }>
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const identity = await getCurrentIdentity()
  if (!identity) {
    return errorResponse(401, "Unauthorized")
  }

  const { projectId } = await params
  const project = await getAccessibleProject(projectId, identity)
  if (!project) {
    return errorResponse(404, "Project not found")
  }

  const body: unknown = await request.json().catch(() => null)
  const snapshot = parseCanvasSnapshot(body)
  if (!snapshot) {
    return errorResponse(400, "Invalid canvas payload")
  }

  const canvasJsonPath = await saveCanvasSnapshot(projectId, snapshot)
  await prisma.project.update({ where: { id: projectId }, data: { canvasJsonPath } })

  return NextResponse.json({ canvasJsonPath })
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const identity = await getCurrentIdentity()
  if (!identity) {
    return errorResponse(401, "Unauthorized")
  }

  const { projectId } = await params
  const project = await getAccessibleProject(projectId, identity)
  if (!project) {
    return errorResponse(404, "Project not found")
  }

  if (!project.canvasJsonPath) {
    return NextResponse.json({ nodes: [], edges: [] })
  }

  const snapshot = await loadCanvasSnapshot(project.canvasJsonPath)
  return NextResponse.json(snapshot ?? { nodes: [], edges: [] })
}
