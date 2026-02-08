"use client"

import React from "react"

import { useParkingStore } from "@/lib/store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ParkingCircle,
  Navigation,
  Crosshair,
  Accessibility,
  Zap,
  Sparkles,
} from "lucide-react"
import type { GuidanceFilter } from "@/hooks/use-guidance"
import type { GuidanceResult } from "@/hooks/use-guidance"

interface DashboardSidebarProps {
  guidanceFilter: GuidanceFilter
  onFilterChange: (filter: GuidanceFilter) => void
  selectedEntranceId: string | null
  onEntranceChange: (id: string) => void
  guidanceResult: GuidanceResult
  onCenterOnSpot: () => void
}

const filterOptions: { value: GuidanceFilter; label: string; icon: React.ReactNode }[] = [
  { value: "best", label: "Best overall", icon: <Sparkles className="h-3 w-3" /> },
  { value: "accessible", label: "Accessible", icon: <Accessibility className="h-3 w-3" /> },
  { value: "ev", label: "EV charging", icon: <Zap className="h-3 w-3" /> },
]

export function DashboardSidebar({
  guidanceFilter,
  onFilterChange,
  selectedEntranceId,
  onEntranceChange,
  guidanceResult,
  onCenterOnSpot,
}: DashboardSidebarProps) {
  const { state } = useParkingStore()

  const entrances = state.lot?.entrances ?? []
  const top = guidanceResult.recommendedSpots[0] ?? null

  return (
    <div className="flex h-full w-72 flex-col border-r border-border bg-card">
      {/* Lot Info */}
      <div className="border-b border-border p-4">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <ParkingCircle className="h-4 w-4 text-primary" />
          {state.lot?.name ?? "No Lot Loaded"}
        </div>
        {state.lot && (
          <p className="mt-1 text-xs text-muted-foreground">
            ID: {state.lot.lot_id}
          </p>
        )}
      </div>

      {/* Legend */}
      <div className="border-b border-border p-4">
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Legend
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-[hsl(var(--spot-empty))]" />
            <span className="text-xs text-muted-foreground">Empty</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-[hsl(var(--spot-occupied))]" />
            <span className="text-xs text-muted-foreground">Occupied</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm border border-dashed border-[hsl(var(--spot-guidance))] bg-[hsl(var(--spot-guidance))]/20" />
            <span className="text-xs text-muted-foreground">Recommended</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-4 w-4 border-b-2 border-dashed border-[hsl(var(--spot-guidance))]" />
            <span className="text-xs text-muted-foreground">Path</span>
          </div>
        </div>
      </div>



      {/* Guidance panel */}
      <div className="flex flex-1 flex-col overflow-y-auto p-4">
        <div className="mb-3 flex items-center gap-1.5">
          <Navigation className="h-3.5 w-3.5 text-[hsl(var(--spot-guidance))]" />
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Guidance
          </p>
        </div>

        {/* Filter */}
        <div className="mb-3 flex flex-wrap gap-1.5">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onFilterChange(opt.value)}
              className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors ${
                guidanceFilter === opt.value
                  ? "bg-[hsl(var(--spot-guidance))]/15 text-[hsl(var(--spot-guidance))] border border-[hsl(var(--spot-guidance))]/30"
                  : "border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {opt.icon}
              {opt.label}
            </button>
          ))}
        </div>

        {/* Entrance selector */}
        {entrances.length > 1 && (
          <div className="mb-3">
            <label
              htmlFor="entrance-select"
              className="mb-1 block text-xs text-muted-foreground"
            >
              Entrance
            </label>
            <select
              id="entrance-select"
              value={selectedEntranceId ?? ""}
              onChange={(e) => onEntranceChange(e.target.value)}
              className="w-full rounded-md border border-border bg-muted px-2 py-1.5 text-xs text-foreground"
            >
              {entrances.map((ent) => (
                <option key={ent.id} value={ent.id}>
                  {ent.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Recommendation result */}
        {top ? (
          <div className="space-y-2">
            <div className="rounded-lg border border-[hsl(var(--spot-guidance))]/30 bg-[hsl(var(--spot-guidance))]/5 p-3">
              <p className="text-xs text-muted-foreground">Recommended spot</p>
              <p className="mt-0.5 font-mono text-lg font-bold text-[hsl(var(--spot-guidance))]">
                {top.spot.spot_id}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Distance: {(top.distance * 100).toFixed(0)} units (approx)
              </p>
              {top.spot.type && top.spot.type !== "standard" && (
                <Badge
                  variant="outline"
                  className="mt-1.5 border-[hsl(var(--spot-guidance))]/30 text-[hsl(var(--spot-guidance))] text-[10px] uppercase"
                >
                  {top.spot.type === "accessible" ? "Accessible" : "EV Charging"}
                </Badge>
              )}
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={onCenterOnSpot}
              className="w-full gap-1.5 border-[hsl(var(--spot-guidance))]/30 text-[hsl(var(--spot-guidance))] hover:bg-[hsl(var(--spot-guidance))]/10 bg-transparent"
            >
              <Crosshair className="h-3.5 w-3.5" />
              Center on spot
            </Button>

            {/* Top 3 list */}
            {guidanceResult.recommendedSpots.length > 1 && (
              <div className="mt-2 space-y-1">
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Top {guidanceResult.recommendedSpots.length}
                </p>
                {guidanceResult.recommendedSpots.map((r, i) => (
                  <div
                    key={r.spot.spot_id}
                    className="flex items-center justify-between rounded-md border border-border px-2.5 py-1.5"
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[hsl(var(--spot-guidance))]/15 text-[10px] font-bold text-[hsl(var(--spot-guidance))]">
                        {i + 1}
                      </span>
                      <span className="font-mono text-xs text-foreground">
                        {r.spot.spot_id}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {(r.distance * 100).toFixed(0)}u
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center py-6">
            <p className="text-center text-xs text-muted-foreground">
              {!state.lot
                ? "No lot loaded."
                : ""}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
