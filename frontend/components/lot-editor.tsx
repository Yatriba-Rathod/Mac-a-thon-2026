"use client"

import React from "react"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { useParkingStore } from "@/lib/store"
import { DEMO_LOT } from "@/lib/mock-data"
import type { Point, SpotDefinition, LotDefinition } from "@/lib/types"
import {
  Plus,
  Trash2,
  Download,
  Upload,
  MousePointer2,
  RotateCcw,
  Grid3X3,
} from "lucide-react"

type DrawMode = "idle" | "polygon" | "rectangle"

export function LotEditor() {
  const { state, dispatch } = useParkingStore()
  const svgRef = useRef<SVGSVGElement>(null)

  const [drawMode, setDrawMode] = useState<DrawMode>("idle")
  const [currentPoints, setCurrentPoints] = useState<Point[]>([])
  const [newSpotId, setNewSpotId] = useState("")
  const [rectStart, setRectStart] = useState<Point | null>(null)
  const [rectEnd, setRectEnd] = useState<Point | null>(null)
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null)

  const spots: SpotDefinition[] = state.lot?.spots ?? []

  const getSvgPoint = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!svgRef.current) return null
      const rect = svgRef.current.getBoundingClientRect()
      return {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      }
    },
    []
  )

  const handleSvgClick = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      const point = getSvgPoint(e)
      if (!point) return

      if (drawMode === "polygon") {
        setCurrentPoints((prev) => [...prev, point])
      } else if (drawMode === "rectangle") {
        if (!rectStart) {
          setRectStart(point)
        } else {
          // Complete rectangle
          const p1 = rectStart
          const p2 = point
          const polygon: Point[] = [
            { x: Math.min(p1.x, p2.x), y: Math.min(p1.y, p2.y) },
            { x: Math.max(p1.x, p2.x), y: Math.min(p1.y, p2.y) },
            { x: Math.max(p1.x, p2.x), y: Math.max(p1.y, p2.y) },
            { x: Math.min(p1.x, p2.x), y: Math.max(p1.y, p2.y) },
          ]
          addSpot(polygon)
          setRectStart(null)
          setRectEnd(null)
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [drawMode, rectStart, getSvgPoint]
  )

  const handleSvgMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (drawMode === "rectangle" && rectStart) {
        const point = getSvgPoint(e)
        if (point) setRectEnd(point)
      }
    },
    [drawMode, rectStart, getSvgPoint]
  )

  const addSpot = (polygon: Point[]) => {
    if (!state.lot) return
    const id = newSpotId.trim() || `S${spots.length + 1}`
    const updatedSpots: SpotDefinition[] = [
      ...spots,
      { spot_id: id, polygon },
    ]
    dispatch({
      type: "SET_LOT",
      lot: { ...state.lot, spots: updatedSpots },
    })
    setNewSpotId("")
    setCurrentPoints([])
    setDrawMode("idle")
  }

  const finishPolygon = () => {
    if (currentPoints.length >= 3) {
      addSpot(currentPoints)
    }
  }

  const deleteSpot = (spotId: string) => {
    if (!state.lot) return
    dispatch({
      type: "SET_LOT",
      lot: {
        ...state.lot,
        spots: spots.filter((s) => s.spot_id !== spotId),
      },
    })
  }

  const loadDemoLot = () => {
    dispatch({ type: "SET_LOT", lot: DEMO_LOT })
  }

  const clearAll = () => {
    if (!state.lot) return
    dispatch({
      type: "SET_LOT",
      lot: { ...state.lot, spots: [] },
    })
  }

  const exportJson = () => {
    const data = spots.map((s) => ({
      spot_id: s.spot_id,
      polygon: s.polygon,
    }))
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "lot-definition.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  const importJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string) as SpotDefinition[]
        const lot: LotDefinition = state.lot
          ? { ...state.lot, spots: data }
          : { lot_id: "imported", name: "Imported Lot", spots: data }
        dispatch({ type: "SET_LOT", lot })
      } catch {
        alert("Invalid JSON file")
      }
    }
    reader.readAsText(file)
  }

  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setBackgroundImage(ev.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Left panel - tools & spot list */}
      <div className="flex w-80 flex-col border-r border-border bg-card">
        <div className="border-b border-border p-4">
          <h2 className="text-sm font-semibold text-foreground">
            Lot Editor
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Define parking spot ROIs by drawing on the canvas.
          </p>
        </div>

        {/* Drawing tools */}
        <div className="border-b border-border p-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Draw Mode
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={drawMode === "polygon" ? "default" : "outline"}
              onClick={() => {
                setDrawMode("polygon")
                setCurrentPoints([])
                setRectStart(null)
                setRectEnd(null)
              }}
              className="gap-1.5"
            >
              <MousePointer2 className="h-3.5 w-3.5" />
              Polygon
            </Button>
            <Button
              size="sm"
              variant={drawMode === "rectangle" ? "default" : "outline"}
              onClick={() => {
                setDrawMode("rectangle")
                setCurrentPoints([])
                setRectStart(null)
                setRectEnd(null)
              }}
              className="gap-1.5"
            >
              <Grid3X3 className="h-3.5 w-3.5" />
              Rectangle
            </Button>
          </div>

          {drawMode === "polygon" && currentPoints.length > 0 && (
            <div className="mt-2 flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {currentPoints.length} points
              </Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={finishPolygon}
                disabled={currentPoints.length < 3}
              >
                Finish
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCurrentPoints([])}
              >
                Cancel
              </Button>
            </div>
          )}

          {drawMode === "rectangle" && rectStart && (
            <div className="mt-2">
              <Badge variant="outline" className="text-xs">
                Click second corner
              </Badge>
            </div>
          )}
        </div>

        {/* Spot ID input */}
        <div className="border-b border-border p-4">
          <label
            htmlFor="spot-id-input"
            className="mb-1.5 block text-xs font-medium text-muted-foreground"
          >
            Next Spot ID
          </label>
          <Input
            id="spot-id-input"
            value={newSpotId}
            onChange={(e) => setNewSpotId(e.target.value)}
            placeholder={`S${spots.length + 1}`}
            className="bg-muted text-foreground"
          />
        </div>

        {/* Quick actions */}
        <div className="flex flex-wrap gap-2 border-b border-border p-4">
          <Button size="sm" variant="outline" onClick={loadDemoLot} className="gap-1.5 bg-transparent">
            <Plus className="h-3.5 w-3.5" />
            Load Demo
          </Button>
          <Button size="sm" variant="outline" onClick={clearAll} className="gap-1.5 bg-transparent">
            <RotateCcw className="h-3.5 w-3.5" />
            Clear All
          </Button>
          <Button size="sm" variant="outline" onClick={exportJson} className="gap-1.5 bg-transparent">
            <Download className="h-3.5 w-3.5" />
            Export
          </Button>
          <Button size="sm" variant="outline" asChild className="gap-1.5 bg-transparent">
            <label className="cursor-pointer">
              <Upload className="h-3.5 w-3.5" />
              Import
              <input
                type="file"
                accept=".json"
                onChange={importJson}
                className="sr-only"
              />
            </label>
          </Button>
          <Button size="sm" variant="outline" asChild className="gap-1.5 bg-transparent">
            <label className="cursor-pointer">
              BG Image
              <input
                type="file"
                accept="image/*"
                onChange={handleBackgroundUpload}
                className="sr-only"
              />
            </label>
          </Button>
        </div>

        {/* Spot list */}
        <div className="flex flex-1 flex-col overflow-hidden p-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Spots ({spots.length})
          </p>
          <ScrollArea className="flex-1">
            <div className="space-y-1.5 pr-2">
              {spots.length === 0 && (
                <p className="py-6 text-center text-xs text-muted-foreground">
                  No spots defined. Draw on the canvas to add spots.
                </p>
              )}
              {spots.map((spot) => (
                <div
                  key={spot.spot_id}
                  className="flex items-center justify-between rounded-md border border-border px-3 py-2"
                >
                  <div>
                    <span className="font-mono text-sm text-foreground">
                      {spot.spot_id}
                    </span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      {spot.polygon.length} pts
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteSpot(spot.spot_id)}
                    className="h-7 w-7 p-0 text-muted-foreground hover:text-[hsl(var(--spot-occupied))]"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span className="sr-only">Delete spot {spot.spot_id}</span>
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Canvas area */}
      <main className="flex flex-1 flex-col overflow-hidden p-4">
        <div className="mb-3">
          <h1 className="text-lg font-semibold text-foreground">Canvas</h1>
          <p className="text-xs text-muted-foreground">
            {drawMode === "idle"
              ? "Select a drawing mode to start adding spots."
              : drawMode === "polygon"
                ? "Click to place polygon vertices. Click Finish when done."
                : "Click to set first corner, then click for second corner."}
          </p>
        </div>
        <div className="relative flex-1 overflow-hidden rounded-lg border border-border bg-[hsl(220,20%,5%)]">
          <svg
            ref={svgRef}
            viewBox="0 0 1000 600"
            className={`h-full w-full ${drawMode !== "idle" ? "cursor-crosshair" : ""}`}
            preserveAspectRatio="xMidYMid meet"
            onClick={handleSvgClick}
            onMouseMove={handleSvgMouseMove}
          >
            {/* Background image */}
            {backgroundImage && (
              <image
                href={backgroundImage}
                x="0"
                y="0"
                width="1000"
                height="600"
                preserveAspectRatio="xMidYMid slice"
                opacity="0.4"
              />
            )}

            {/* Grid */}
            <defs>
              <pattern
                id="editor-grid"
                width="50"
                height="50"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 50 0 L 0 0 0 50"
                  fill="none"
                  stroke="hsl(220 14% 12%)"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="1000" height="600" fill="url(#editor-grid)" />

            {/* Existing spots */}
            {spots.map((spot) => {
              const points = spot.polygon
                .map((p) => `${p.x * 1000},${p.y * 600}`)
                .join(" ")
              const cx =
                spot.polygon.reduce((s, p) => s + p.x * 1000, 0) /
                spot.polygon.length
              const cy =
                spot.polygon.reduce((s, p) => s + p.y * 600, 0) /
                spot.polygon.length
              return (
                <g key={spot.spot_id}>
                  <polygon
                    points={points}
                    fill="hsl(200 70% 50% / 0.15)"
                    stroke="hsl(200 70% 50%)"
                    strokeWidth="2"
                  />
                  <text
                    x={cx}
                    y={cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="hsl(200 70% 75%)"
                    fontSize="14"
                    fontWeight="600"
                    fontFamily="monospace"
                  >
                    {spot.spot_id}
                  </text>
                </g>
              )
            })}

            {/* Current polygon drawing */}
            {drawMode === "polygon" && currentPoints.length > 0 && (
              <>
                <polyline
                  points={currentPoints
                    .map((p) => `${p.x * 1000},${p.y * 600}`)
                    .join(" ")}
                  fill="none"
                  stroke="hsl(45 90% 55%)"
                  strokeWidth="2"
                  strokeDasharray="6 3"
                />
                {currentPoints.map((p, i) => (
                  <circle
                    key={`pt-${i}`}
                    cx={p.x * 1000}
                    cy={p.y * 600}
                    r="5"
                    fill="hsl(45 90% 55%)"
                  />
                ))}
              </>
            )}

            {/* Current rectangle preview */}
            {drawMode === "rectangle" && rectStart && rectEnd && (
              <rect
                x={Math.min(rectStart.x, rectEnd.x) * 1000}
                y={Math.min(rectStart.y, rectEnd.y) * 600}
                width={Math.abs(rectEnd.x - rectStart.x) * 1000}
                height={Math.abs(rectEnd.y - rectStart.y) * 600}
                fill="hsl(45 90% 55% / 0.15)"
                stroke="hsl(45 90% 55%)"
                strokeWidth="2"
                strokeDasharray="6 3"
              />
            )}
          </svg>
        </div>
      </main>
    </div>
  )
}
