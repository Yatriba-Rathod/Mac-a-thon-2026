"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Car, LayoutGrid, Settings, Pencil } from "lucide-react"
import { useParkingStore } from "@/lib/store"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutGrid },
  { href: "/lot-editor", label: "Lot Editor", icon: Pencil },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function AppHeader() {
  const { state } = useParkingStore()
  const pathname = usePathname()

  const connectionColor =
    state.connectionState === "connected"
      ? "bg-[hsl(var(--spot-empty))]"
      : state.connectionState === "reconnecting"
        ? "bg-[hsl(45,90%,55%)]"
        : "bg-[hsl(var(--spot-occupied))]"

  const connectionLabel =
    state.connectionState === "connected"
      ? "Connected"
      : state.connectionState === "reconnecting"
        ? "Reconnecting"
        : "Disconnected"

  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-6 py-3">
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Car className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-base font-semibold text-foreground">
            Mac-A-Park
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-full border border-border px-3 py-1">
          <span
            className={cn("h-2 w-2 rounded-full", connectionColor)}
            aria-hidden="true"
          />
          <span className="text-xs text-muted-foreground">
            {connectionLabel}
          </span>
        </div>
      </div>
    </header>
  )
}
