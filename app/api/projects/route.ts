import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { errorResponse, parseProjectName } from "@/lib/project-api"

export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return errorResponse(401, "Unauthorized")
  }

  const projects = await prisma.project.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({ projects })
}

export async function POST(request: NextRequest) {
  const { userId } = await auth()
  if (!userId) {
    return errorResponse(401, "Unauthorized")
  }

  const body: unknown = await request.json().catch(() => null)
  const name = parseProjectName(body) ?? "Untitled Project"

  const project = await prisma.project.create({
    data: { ownerId: userId, name },
  })

  return NextResponse.json({ project }, { status: 201 })
}
