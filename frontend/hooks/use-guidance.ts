"use client"

import { useMemo } from "react"
import { useParkingStore } from "@/lib/store"
import type { Point, SpotDefinition, SpotType, Entrance } from "@/lib/types"

export type GuidanceFilter = "best" | "accessible" | "ev"

/** Compute the centroid of a polygon */
export function getSpotCenter(polygon: Point[]): Point {
  const n = polygon.length
  if (n === 0) return { x: 0, y: 0 }
  const sum = polygon.reduce(
    (acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }),
    { x: 0, y: 0 }
  )
  return { x: sum.x / n, y: sum.y / n }
}

/** Euclidean distance in normalized coordinates */
function euclidean(a: Point, b: Point): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
}

export interface GuidanceResult {
  recommendedSpots: {
    spot: SpotDefinition
    center: Point
    distance: number
  }[]
  pathPoints: Point[]
  entrance: Entrance | null
}

export function useGuidance(
  filter: GuidanceFilter,
  entranceId: string | null
): GuidanceResult {
  const { state } = useParkingStore()

  return useMemo(() => {
    const empty: GuidanceResult = {
      recommendedSpots: [],
      pathPoints: [],
      entrance: null,
    }

    if (!state.lot) return empty

    const entrances = state.lot.entrances ?? []
    const entrance = entranceId
      ? entrances.find((e) => e.id === entranceId) ?? entrances[0] ?? null
      : entrances[0] ?? null

    if (!entrance) return empty

    const entrancePoint: Point = { x: entrance.x, y: entrance.y }

    // Filter to empty spots only
    const emptySpots = state.lot.spots.filter((spot) => {
      const ss = state.spotStates.get(spot.spot_id)
      return !ss?.occupied
    })

    // Filter by type
    const filtered = emptySpots.filter((spot) => {
      if (filter === "accessible") return spot.type === "accessible"
      if (filter === "ev") return spot.type === "ev"
      return true // "best" -> any type
    })

    // Rank by distance from entrance
    const ranked = filtered
      .map((spot) => {
        const center = spot.center ?? getSpotCenter(spot.polygon)
        return { spot, center, distance: euclidean(entrancePoint, center) }
      })
      .sort((a, b) => a.distance - b.distance)

    const top3 = ranked.slice(0, 3)

    // Walking path to #1 recommended spot
    let pathPoints: Point[] = []
    if (top3.length > 0) {
      const dest = top3[0].center
      // "L-shaped" walking path: go horizontally first then vertically
      const midPoint: Point = { x: dest.x, y: entrancePoint.y }
      pathPoints = [entrancePoint, midPoint, dest]
    }

    return {
      recommendedSpots: top3,
      pathPoints,
      entrance,
    }
  }, [state.lot, state.spotStates, filter, entranceId])
}
