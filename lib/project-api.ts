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
