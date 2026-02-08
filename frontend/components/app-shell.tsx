"use client"

import React from "react"

import { ParkingProvider } from "@/components/parking-provider"
import { AppHeader } from "@/components/app-header"
import { ProtectedRoute } from "@/components/protected-route"

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <ParkingProvider>
        <div className="flex h-screen flex-col bg-background">
          <AppHeader />
          {children}
        </div>
      </ParkingProvider>
    </ProtectedRoute>
  )
}
