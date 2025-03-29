import type { ReactNode } from "react"

export default function EnviosLayout({ children }: { children: ReactNode }) {
  return <div className="p-6">{children}</div>
}

