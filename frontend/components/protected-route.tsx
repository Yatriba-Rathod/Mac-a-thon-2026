"use client"

import React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-store"
import { Loader2 } from "lucide-react"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { state } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (state.status === "unauthenticated") {
      router.replace("/auth/sign-in")
    }
  }, [state.status, router])

  if (state.status === "idle" || state.status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (state.status === "unauthenticated") {
    return null
  }

  return <>{children}</>
}
