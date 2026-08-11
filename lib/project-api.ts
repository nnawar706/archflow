import { NextResponse } from "next/server"

export function errorResponse(status: number, message: string) {
  return NextResponse.json({ error: message }, { status })
}

/** Extracts and trims a `name` field from an unknown request body, if present and non-empty. */
export function parseProjectName(body: unknown): string | null {
  if (typeof body !== "object" || body === null || !("name" in body)) {
    return null
  }

  const { name } = body as { name: unknown }
  if (typeof name !== "string") {
    return null
  }

  const trimmed = name.trim()
  return trimmed.length > 0 ? trimmed : null
}

const PROJECT_ID_PATTERN = /^[a-z0-9](?:[a-z0-9-]{0,60}[a-z0-9])?$/

type ParsedProjectId = { ok: true; id: string | undefined } | { ok: false }

/**
 * Extracts an optional client-supplied `id` field from an unknown request body.
 * Used so a project's ID can be set to match its Liveblocks room ID at creation time.
 */
export function parseOptionalProjectId(body: unknown): ParsedProjectId {
  if (typeof body !== "object" || body === null || !("id" in body)) {
    return { ok: true, id: undefined }
  }

  const { id } = body as { id: unknown }
  if (typeof id !== "string" || !PROJECT_ID_PATTERN.test(id)) {
    return { ok: false }
  }

  return { ok: true, id }
}
