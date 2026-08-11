"use client"

import { useState } from "react"

export interface Collaborator {
  id: string
  email: string
  name: string | null
  avatarUrl: string | null
}

async function requestJson(url: string, method: string, body?: unknown) {
  const response = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const data = await response.json().catch(() => null)
    throw new Error(data?.error ?? "Something went wrong")
  }

  return response.json()
}

export function useShareDialog(projectId: string) {
  const [isOpen, setIsOpen] = useState(false)
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [isOwner, setIsOwner] = useState(false)
  const [isLoadingList, setIsLoadingList] = useState(false)
  const [emailInput, setEmailInput] = useState("")
  const [isInviting, setIsInviting] = useState(false)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  async function openDialog() {
    setIsOpen(true)
    setIsLoadingList(true)
    setError(null)
    try {
      const data = await requestJson(`/api/projects/${projectId}/collaborators`, "GET")
      setCollaborators(data.collaborators)
      setIsOwner(data.isOwner)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load collaborators")
    } finally {
      setIsLoadingList(false)
    }
  }

  function closeDialog() {
    setIsOpen(false)
    setEmailInput("")
    setError(null)
    setCopied(false)
  }

  async function invite() {
    const email = emailInput.trim()
    if (!email) return

    setIsInviting(true)
    setError(null)
    try {
      const data = await requestJson(`/api/projects/${projectId}/collaborators`, "POST", {
        email,
      })
      setCollaborators((current) => [...current, data.collaborator])
      setEmailInput("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to invite collaborator")
    } finally {
      setIsInviting(false)
    }
  }

  async function remove(collaboratorId: string) {
    setRemovingId(collaboratorId)
    setError(null)
    try {
      await requestJson(`/api/projects/${projectId}/collaborators/${collaboratorId}`, "DELETE")
      setCollaborators((current) =>
        current.filter((collaborator) => collaborator.id !== collaboratorId)
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove collaborator")
    } finally {
      setRemovingId(null)
    }
  }

  function copyLink() {
    const url = `${window.location.origin}/editor/${projectId}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return {
    isOpen,
    openDialog,
    closeDialog,
    collaborators,
    isOwner,
    isLoadingList,
    emailInput,
    setEmailInput,
    isInviting,
    removingId,
    error,
    copied,
    invite,
    remove,
    copyLink,
  }
}
