const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Extracts and validates an `email` field from an unknown request body, if present. */
export function parseEmail(body: unknown): string | null {
  if (typeof body !== "object" || body === null || !("email" in body)) {
    return null
  }

  const { email } = body as { email: unknown }
  if (typeof email !== "string") {
    return null
  }

  const trimmed = email.trim().toLowerCase()
  return EMAIL_PATTERN.test(trimmed) ? trimmed : null
}
