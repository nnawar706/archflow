import { get, put } from "@vercel/blob"

import type { CanvasEdge, CanvasNode } from "@/types/canvas"

export interface CanvasSnapshot {
  nodes: CanvasNode[]
  edges: CanvasEdge[]
}

/** Uploads the canvas snapshot to Vercel Blob at a stable per-project path, overwriting any previous save. */
export async function saveCanvasSnapshot(
  projectId: string,
  snapshot: CanvasSnapshot
): Promise<string> {
  const blob = await put(`canvas/${projectId}.json`, JSON.stringify(snapshot), {
    access: "private",
    contentType: "application/json",
    allowOverwrite: true,
  })

  return blob.url
}

/** Fetches a previously saved canvas snapshot from its Vercel Blob URL. The store is private, so this reads through the SDK (authenticated via `BLOB_READ_WRITE_TOKEN`) rather than a plain `fetch`. */
export async function loadCanvasSnapshot(blobUrl: string): Promise<CanvasSnapshot | null> {
  const result = await get(blobUrl, { access: "private" }).catch(() => null)
  if (!result || result.statusCode !== 200) {
    return null
  }

  const text = await new Response(result.stream).text()
  return JSON.parse(text) as CanvasSnapshot
}
