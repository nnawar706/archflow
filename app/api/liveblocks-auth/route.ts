import { NextRequest } from "next/server"

import { getCursorColor, liveblocks } from "@/lib/liveblocks"
import { getAccessibleProject, getCurrentIdentity } from "@/lib/project-access"
import { errorResponse } from "@/lib/project-api"

function parseRoomId(body: unknown): string | null {
  if (typeof body !== "object" || body === null || !("room" in body)) {
    return null
  }

  const { room } = body as { room: unknown }
  return typeof room === "string" && room.length > 0 ? room : null
}

export async function POST(request: NextRequest) {
  const identity = await getCurrentIdentity()
  if (!identity) {
    return errorResponse(401, "Unauthorized")
  }

  const body: unknown = await request.json().catch(() => null)
  const roomId = parseRoomId(body)
  if (!roomId) {
    return errorResponse(400, "Missing room")
  }

  const project = await getAccessibleProject(roomId, identity)
  if (!project) {
    return errorResponse(403, "Forbidden")
  }

  const room = await liveblocks.getOrCreateRoom(roomId, {
    defaultAccesses: [],
    usersAccesses: { [identity.userId]: ["room:write"] },
  })

  if (!room.usersAccesses[identity.userId]?.includes("room:write")) {
    await liveblocks.updateRoom(roomId, {
      usersAccesses: { [identity.userId]: ["room:write"] },
    })
  }

  const { status, body: sessionBody } = await liveblocks.identifyUser(
    identity.userId,
    {
      userInfo: {
        name: identity.name ?? identity.email ?? "Anonymous",
        avatar: identity.avatarUrl ?? "",
        color: getCursorColor(identity.userId),
      },
    }
  )

  return new Response(sessionBody, { status })
}
