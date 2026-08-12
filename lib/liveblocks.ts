import { Liveblocks } from "@liveblocks/node"

const globalForLiveblocks = global as unknown as { liveblocks?: Liveblocks }

function getLiveblocksClient(): Liveblocks {
  if (!globalForLiveblocks.liveblocks) {
    globalForLiveblocks.liveblocks = new Liveblocks({
      secret: process.env.LIVEBLOCKS_SECRET_KEY!,
    })
  }
  return globalForLiveblocks.liveblocks
}

/**
 * Lazily instantiated so the secret key is only read/validated at request
 * time, not when Next.js collects route module data at build time.
 *
 * Methods are bound to the real client rather than proxied through the
 * `receiver` — `Liveblocks` relies on private class fields internally, which
 * throw ("Receiver must be an instance of class ...") if `this` resolves to
 * this Proxy instead of the real instance.
 */
export const liveblocks = new Proxy({} as Liveblocks, {
  get(_target, prop) {
    const client = getLiveblocksClient()
    const value = Reflect.get(client, prop)
    return typeof value === "function" ? value.bind(client) : value
  },
})

const CURSOR_COLORS = [
  "#00C8D4", // cyan
  "#6457F9", // indigo
  "#52A8FF", // blue
  "#BF7AF0", // purple
  "#F75F8F", // pink
  "#FF6166", // red
  "#FF990A", // orange
  "#62C073", // green
] as const

/** Deterministically maps a user ID to a consistent color from a fixed palette. */
export function getCursorColor(userId: string): string {
  let hash = 0
  for (let i = 0; i < userId.length; i++) {
    hash = (hash * 31 + userId.charCodeAt(i)) >>> 0
  }
  return CURSOR_COLORS[hash % CURSOR_COLORS.length]
}
