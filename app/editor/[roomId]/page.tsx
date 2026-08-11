import { redirect } from "next/navigation"

import { AccessDenied } from "@/components/access-denied"
import { WorkspaceShell } from "@/components/workspace-shell"
import { getOwnedAndSharedProjects } from "@/lib/projects"
import { getAccessibleProject, getCurrentIdentity } from "@/lib/project-access"

interface EditorRoomPageProps {
  params: Promise<{ roomId: string }>
}

export default async function EditorRoomPage({ params }: EditorRoomPageProps) {
  const identity = await getCurrentIdentity()
  if (!identity) {
    redirect("/sign-in")
  }

  const { roomId } = await params
  const project = await getAccessibleProject(roomId, identity)
  if (!project) {
    return <AccessDenied />
  }

  const { ownedProjects, sharedProjects } = await getOwnedAndSharedProjects(
    identity.userId,
    identity.email
  )

  return (
    <WorkspaceShell
      project={project}
      ownedProjects={ownedProjects}
      sharedProjects={sharedProjects}
    />
  )
}
