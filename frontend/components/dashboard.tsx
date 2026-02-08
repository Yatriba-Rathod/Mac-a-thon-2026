"use client"

import { useState, useCallback } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { ParkingLotView } from "@/components/parking-lot-view"
import { SpotDrawer } from "@/components/spot-drawer"
import { useGuidance, type GuidanceFilter } from "@/hooks/use-guidance"
import { useParkingStore } from "@/lib/store"

export function Dashboard() {
  const [selectedSpot, setSelectedSpot] = useState<string | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [guidanceFilter, setGuidanceFilter] =
    useState<GuidanceFilter>("best")
  const [selectedEntranceId, setSelectedEntranceId] =
    useState<string | null>(null)

  // ✅ READ-ONLY STORE ACCESS
  const { state } = useParkingStore()

  const guidanceResult = useGuidance(
    guidanceFilter,
    selectedEntranceId
  )

  const recommendedSpotId =
    guidanceResult.recommendedSpots[0]?.spot.spot_id ?? null

  const handleSpotClick = (spotId: string) => {
    setSelectedSpot(spotId)
    setDrawerOpen(true)
  }

  const handleCenterOnSpot = useCallback(() => {
    if (recommendedSpotId) {
      setSelectedSpot(recommendedSpotId)
      setDrawerOpen(true)
    }
  }, [recommendedSpotId])

  const entrancePoint = guidanceResult.entrance
    ? {
      x: guidanceResult.entrance.x,
      y: guidanceResult.entrance.y,
    }
    : null

  return (
    <div className="flex flex-1 overflow-hidden">
      <DashboardSidebar
        guidanceFilter={guidanceFilter}
        onFilterChange={setGuidanceFilter}
        selectedEntranceId={selectedEntranceId ?? null}
        onEntranceChange={setSelectedEntranceId}
        guidanceResult={guidanceResult}
        onCenterOnSpot={handleCenterOnSpot}
      />

      <main className="flex flex-1 flex-col overflow-hidden p-4">
        <div className="mb-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-foreground">
            Parking Lot Model
          </h1>
        </div>

        <div className="flex-1 overflow-hidden">
          <ParkingLotView
            onSpotClick={handleSpotClick}
            recommendedSpotId={recommendedSpotId}
            pathPoints={guidanceResult.pathPoints}
            entrancePoint={entrancePoint}
          />
        </div>
      </main>
    </div>
  )
}
