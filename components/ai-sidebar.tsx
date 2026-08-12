"use client"

import { useState, type KeyboardEvent } from "react"
import { Bot, Download, FileText, Send, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface AiSidebarProps {
  isOpen: boolean
  onClose: () => void
}

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
}

const STARTER_PROMPTS = [
  "Design an e-commerce backend",
  "Create a chat app architecture",
  "Build a CI/CD pipeline",
]

const TAB_TRIGGER_CLASSES = cn(
  "flex-1 text-copy-muted",
  "data-active:bg-accent data-active:text-ai-text",
  "dark:data-active:bg-accent dark:data-active:text-ai-text"
)

function AiArchitectTab() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")

  function handleSend() {
    const trimmed = input.trim()
    if (!trimmed) return
    setMessages((prev) => [...prev, { id: `${Date.now()}`, role: "user", content: trimmed }])
    setInput("")
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 px-2 text-center">
            <Bot className="size-8 text-ai-text" />
            <p className="text-sm text-copy-muted">
              Describe what you want to build and I&apos;ll help design the architecture.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {STARTER_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => setInput(prompt)}
                  className="rounded-full bg-subtle px-3 py-1.5 text-xs text-ai-text transition-colors hover:bg-subtle/70"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "max-w-[85%] rounded-2xl px-3 py-2 text-sm",
                  message.role === "user"
                    ? "ml-auto border-2 border-brand/50 bg-brand-dim text-copy-primary"
                    : "mr-auto border border-surface-border bg-elevated text-ai-text"
                )}
              >
                {message.content}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-end gap-2 border-t border-surface-border p-3">
        <Textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe your architecture..."
          className="min-h-18 max-h-40 flex-1 resize-none text-copy-primary"
        />
        <Button
          type="button"
          size="icon-lg"
          onClick={handleSend}
          disabled={!input.trim()}
          aria-label="Send message"
          className="bg-ai text-copy-primary hover:bg-ai/90"
        >
          <Send className="size-4" />
        </Button>
      </div>
    </div>
  )
}

function SpecsTab() {
  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
      <Button type="button" size="lg" className="w-full bg-ai text-copy-primary hover:bg-ai/90">
        Generate Spec
      </Button>

      <div className="rounded-2xl border border-surface-border bg-elevated p-4">
        <div className="flex items-start gap-3">
          <FileText className="size-5 shrink-0 text-ai-text" />
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-medium text-copy-primary">E-commerce Backend Spec</h3>
            <p className="mt-1 text-xs text-copy-muted">
              Services, data models, and API contracts for a checkout and inventory system.
            </p>
          </div>
        </div>
        <Button type="button" variant="outline" size="sm" disabled className="mt-3 w-full">
          <Download className="size-4" />
          Download
        </Button>
      </div>
    </div>
  )
}

export function AiSidebar({ isOpen, onClose }: AiSidebarProps) {
  return (
    <>
      {isOpen ? (
        <div
          role="presentation"
          onClick={onClose}
          className="absolute inset-0 z-30 bg-black/50 lg:hidden"
        />
      ) : null}

      <aside
        aria-hidden={!isOpen}
        className={cn(
          "absolute top-0 right-0 z-40 flex h-full w-80 flex-col rounded-l-2xl border-l border-surface-border bg-elevated/95 backdrop-blur-sm transition-transform duration-200 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-surface-border px-4 py-3">
          <div className="flex items-center gap-2">
            <Bot className="size-4 text-ai-text" />
            <div>
              <h2 className="text-sm font-semibold text-copy-primary">AI Workspace</h2>
              <p className="text-xs text-copy-muted">Collaborate with ArchFlow AI</p>
            </div>
          </div>
          <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close AI sidebar">
            <X className="size-4" />
          </Button>
        </div>

        <Tabs defaultValue="ai-architect" className="flex flex-1 flex-col overflow-hidden pt-3">
          <TabsList className="mx-4 w-full">
            <TabsTrigger value="ai-architect" className={TAB_TRIGGER_CLASSES}>
              AI Architect
            </TabsTrigger>
            <TabsTrigger value="specs" className={TAB_TRIGGER_CLASSES}>
              Specs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ai-architect" className="flex flex-1 flex-col overflow-hidden">
            <AiArchitectTab />
          </TabsContent>

          <TabsContent value="specs" className="flex flex-1 flex-col overflow-hidden">
            <SpecsTab />
          </TabsContent>
        </Tabs>
      </aside>
    </>
  )
}
