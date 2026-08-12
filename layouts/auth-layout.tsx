import { FEATURES } from "@/constants"
import type { ReactNode } from "react"

interface AuthLayoutProps {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-base">
      <div className="hidden w-1/2 flex-col justify-between bg-surface px-16 py-12 lg:flex">
        <span className="text-sm font-semibold tracking-wide text-copy-primary">
          ArchFlow
        </span>

        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-semibold text-copy-primary">
              Design systems at the speed of thought.
            </h1>
            <p className="max-w-md text-sm text-copy-muted">
              Describe your architecture in plain English. ArchFlow maps it
              to a shared canvas your whole team can refine in real time.
            </p>
          </div>

          <ul className="flex flex-col gap-5">
            {FEATURES.map((feature) => (
              <li key={feature.title} className="flex flex-col gap-1">
                <span className="text-sm font-medium text-copy-primary">
                  {feature.title}
                </span>
                <span className="text-sm text-copy-muted">
                  {feature.description}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <span className="text-xs text-copy-faint">
          © {new Date().getFullYear()} ArchFlow. All rights reserved.
        </span>
      </div>

      <div className="flex flex-1 items-center justify-center overflow-x-hidden px-4 py-12 sm:px-6">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  )
}
