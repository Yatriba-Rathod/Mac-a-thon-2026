"use client"

import React from "react"

import { ParkingProvider } from "@/components/parking-provider"
import { AppHeader } from "@/components/app-header"

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ParkingProvider>
      <div className="flex h-screen flex-col bg-background">
        <AppHeader />
        {children}
      </div>
    </ParkingProvider>
  )
}
