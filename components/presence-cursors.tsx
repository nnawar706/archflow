"use client"

import { Cursor } from "@liveblocks/react-ui"
import { Cursors, type CursorsCursorProps } from "@liveblocks/react-flow"
import { useOther } from "@liveblocks/react"

function PresenceCursor({ connectionId }: CursorsCursorProps) {
  const info = useOther(connectionId, (other) => other.info)
  return <Cursor color={info.color} label={info.name} />
}

export function PresenceCursors() {
  return <Cursors components={{ Cursor: PresenceCursor }} />
}
