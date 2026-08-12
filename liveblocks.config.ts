declare global {
  interface Liveblocks {
    // Each user's Presence, for useMyPresence, useOthers, etc.
    Presence: {
      cursor: { x: number; y: number } | null
      thinking: boolean
    }

    UserMeta: {
      id: string
      info: {
        name: string
        avatar: string
        color: string
      }
    }
  }
}

export {}
