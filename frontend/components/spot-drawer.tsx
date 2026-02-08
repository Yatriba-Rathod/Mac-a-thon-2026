"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { useParkingStore } from "@/lib/store"
import { Car, Clock, MapPin } from "lucide-react"

interface SpotDrawerProps {
  spotId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SpotDrawer({ spotId, open, onOpenChange }: SpotDrawerProps) {
  const { state } = useParkingStore()

  if (!spotId) return null

  const spotState = state.spotStates.get(spotId)
  const occupied = spotState?.occupied ?? false
  const lastUpdated = spotState?.last_updated
    ? new Date(spotState.last_updated).toLocaleTimeString()
    : "N/A"

  const spotDef = state.lot?.spots.find((s) => s.spot_id === spotId)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="border-border bg-card">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-foreground">
            <MapPin className="h-5 w-5" />
            Spot {spotId}
          </SheetTitle>
          <SheetDescription>Detailed information for this parking spot.</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                  occupied
                    ? "bg-[hsl(var(--spot-occupied))]/15 text-[hsl(var(--spot-occupied))]"
                    : "bg-[hsl(var(--spot-empty))]/15 text-[hsl(var(--spot-empty))]"
                }`}
              >
                <Car className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Status</p>
                <p className="text-xs text-muted-foreground">Current state</p>
              </div>
            </div>
            <Badge
              className={
                occupied
                  ? "border-[hsl(var(--spot-occupied))]/30 bg-[hsl(var(--spot-occupied))]/15 text-[hsl(var(--spot-occupied))]"
                  : "border-[hsl(var(--spot-empty))]/30 bg-[hsl(var(--spot-empty))]/15 text-[hsl(var(--spot-empty))]"
              }
            >
              {occupied ? "Occupied" : "Empty"}
            </Badge>
          </div>

          {/* Spot type */}
          {spotDef?.type && spotDef.type !== "standard" && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Type</p>
              <Badge variant="outline" className="uppercase">
                {spotDef.type === "accessible" ? "Accessible" : "EV Charging"}
              </Badge>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Last Updated</span>
            </div>
            <p className="font-mono text-sm text-foreground">{lastUpdated}</p>
          </div>

          {spotDef && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Polygon Coordinates</p>
              <div className="rounded-lg border border-border bg-muted/50 p-3">
                <pre className="font-mono text-xs text-muted-foreground">
                  {JSON.stringify(spotDef.polygon, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
