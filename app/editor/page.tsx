import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

import { EditorShell } from "@/components/editor-shell"
import { getOwnedAndSharedProjects } from "@/lib/projects"

export default async function EditorPage() {
  const { userId } = await auth()
  if (!userId) {
    redirect("/sign-in")
  }

  const user = await currentUser()
  const email = user?.primaryEmailAddress?.emailAddress ?? null

  const { ownedProjects, sharedProjects } = await getOwnedAndSharedProjects(
    userId,
    email
  )

  return <EditorShell ownedProjects={ownedProjects} sharedProjects={sharedProjects} />
}
