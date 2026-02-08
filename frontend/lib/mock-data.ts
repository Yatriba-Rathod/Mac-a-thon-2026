import type { LotDefinition, SpotState } from "./types"

/**
 * DEMO_LOT is only used by the Lot Editor for quick layout scaffolding.
 * The Dashboard never loads this automatically.
 */
export const DEMO_LOT: LotDefinition = {
  lot_id: "demo-lot-1",
  name: "Main Parking Lot",
  spots: [
    // Row A (top row)
    { spot_id: "A1", type: "accessible", polygon: [{ x: 0.02, y: 0.05 }, { x: 0.13, y: 0.05 }, { x: 0.13, y: 0.28 }, { x: 0.02, y: 0.28 }] },
    { spot_id: "A2", type: "standard", polygon: [{ x: 0.15, y: 0.05 }, { x: 0.26, y: 0.05 }, { x: 0.26, y: 0.28 }, { x: 0.15, y: 0.28 }] },
    { spot_id: "A3", type: "standard", polygon: [{ x: 0.28, y: 0.05 }, { x: 0.39, y: 0.05 }, { x: 0.39, y: 0.28 }, { x: 0.28, y: 0.28 }] },
    { spot_id: "A4", type: "ev", polygon: [{ x: 0.41, y: 0.05 }, { x: 0.52, y: 0.05 }, { x: 0.52, y: 0.28 }, { x: 0.41, y: 0.28 }] },
    { spot_id: "A5", type: "standard", polygon: [{ x: 0.54, y: 0.05 }, { x: 0.65, y: 0.05 }, { x: 0.65, y: 0.28 }, { x: 0.54, y: 0.28 }] },
    { spot_id: "A6", type: "standard", polygon: [{ x: 0.67, y: 0.05 }, { x: 0.78, y: 0.05 }, { x: 0.78, y: 0.28 }, { x: 0.67, y: 0.28 }] },
    { spot_id: "A7", type: "ev", polygon: [{ x: 0.80, y: 0.05 }, { x: 0.91, y: 0.05 }, { x: 0.91, y: 0.28 }, { x: 0.80, y: 0.28 }] },
    // Row B (middle row)
    { spot_id: "B1", type: "accessible", polygon: [{ x: 0.02, y: 0.38 }, { x: 0.13, y: 0.38 }, { x: 0.13, y: 0.58 }, { x: 0.02, y: 0.58 }] },
    { spot_id: "B2", type: "standard", polygon: [{ x: 0.15, y: 0.38 }, { x: 0.26, y: 0.38 }, { x: 0.26, y: 0.58 }, { x: 0.15, y: 0.58 }] },
    { spot_id: "B3", type: "standard", polygon: [{ x: 0.28, y: 0.38 }, { x: 0.39, y: 0.38 }, { x: 0.39, y: 0.58 }, { x: 0.28, y: 0.58 }] },
    { spot_id: "B4", type: "standard", polygon: [{ x: 0.41, y: 0.38 }, { x: 0.52, y: 0.38 }, { x: 0.52, y: 0.58 }, { x: 0.41, y: 0.58 }] },
    { spot_id: "B5", type: "ev", polygon: [{ x: 0.54, y: 0.38 }, { x: 0.65, y: 0.38 }, { x: 0.65, y: 0.58 }, { x: 0.54, y: 0.58 }] },
    { spot_id: "B6", type: "standard", polygon: [{ x: 0.67, y: 0.38 }, { x: 0.78, y: 0.38 }, { x: 0.78, y: 0.58 }, { x: 0.67, y: 0.58 }] },
    { spot_id: "B7", type: "standard", polygon: [{ x: 0.80, y: 0.38 }, { x: 0.91, y: 0.38 }, { x: 0.91, y: 0.58 }, { x: 0.80, y: 0.58 }] },
    // Row C (bottom row)
    { spot_id: "C1", type: "standard", polygon: [{ x: 0.02, y: 0.68 }, { x: 0.13, y: 0.68 }, { x: 0.13, y: 0.92 }, { x: 0.02, y: 0.92 }] },
    { spot_id: "C2", type: "accessible", polygon: [{ x: 0.15, y: 0.68 }, { x: 0.26, y: 0.68 }, { x: 0.26, y: 0.92 }, { x: 0.15, y: 0.92 }] },
    { spot_id: "C3", type: "standard", polygon: [{ x: 0.28, y: 0.68 }, { x: 0.39, y: 0.68 }, { x: 0.39, y: 0.92 }, { x: 0.28, y: 0.92 }] },
    { spot_id: "C4", type: "standard", polygon: [{ x: 0.41, y: 0.68 }, { x: 0.52, y: 0.68 }, { x: 0.52, y: 0.92 }, { x: 0.41, y: 0.92 }] },
    { spot_id: "C5", type: "standard", polygon: [{ x: 0.54, y: 0.68 }, { x: 0.65, y: 0.68 }, { x: 0.65, y: 0.92 }, { x: 0.54, y: 0.92 }] },
    { spot_id: "C6", type: "ev", polygon: [{ x: 0.67, y: 0.68 }, { x: 0.78, y: 0.68 }, { x: 0.78, y: 0.92 }, { x: 0.67, y: 0.92 }] },
    { spot_id: "C7", type: "standard", polygon: [{ x: 0.80, y: 0.68 }, { x: 0.91, y: 0.68 }, { x: 0.91, y: 0.92 }, { x: 0.80, y: 0.92 }] },
  ],
}

/**
 * DEMO_SPOT_STATES provides dummy occupancy data for testing
 */
export const DEMO_SPOT_STATES: Map<string, SpotState> = new Map([
  ["A1", { spot_id: "A1", occupied: true, last_updated: "2026-02-08T10:00:00Z" }],
  ["A2", { spot_id: "A2", occupied: false, last_updated: "2026-02-08T10:00:00Z" }],
  ["A3", { spot_id: "A3", occupied: true, last_updated: "2026-02-08T10:00:00Z" }],
  ["A4", { spot_id: "A4", occupied: false, last_updated: "2026-02-08T10:00:00Z" }],
  ["A5", { spot_id: "A5", occupied: true, last_updated: "2026-02-08T10:00:00Z" }],
  ["A6", { spot_id: "A6", occupied: false, last_updated: "2026-02-08T10:00:00Z" }],
  ["A7", { spot_id: "A7", occupied: true, last_updated: "2026-02-08T10:00:00Z" }],
  ["B1", { spot_id: "B1", occupied: false, last_updated: "2026-02-08T10:00:00Z" }],
  ["B2", { spot_id: "B2", occupied: true, last_updated: "2026-02-08T10:00:00Z" }],
  ["B3", { spot_id: "B3", occupied: false, last_updated: "2026-02-08T10:00:00Z" }],
  ["B4", { spot_id: "B4", occupied: false, last_updated: "2026-02-08T10:00:00Z" }],
  ["B5", { spot_id: "B5", occupied: true, last_updated: "2026-02-08T10:00:00Z" }],
  ["B6", { spot_id: "B6", occupied: false, last_updated: "2026-02-08T10:00:00Z" }],
  ["B7", { spot_id: "B7", occupied: true, last_updated: "2026-02-08T10:00:00Z" }],
  ["C1", { spot_id: "C1", occupied: true, last_updated: "2026-02-08T10:00:00Z" }],
  ["C2", { spot_id: "C2", occupied: false, last_updated: "2026-02-08T10:00:00Z" }],
  ["C3", { spot_id: "C3", occupied: false, last_updated: "2026-02-08T10:00:00Z" }],
  ["C4", { spot_id: "C4", occupied: true, last_updated: "2026-02-08T10:00:00Z" }],
  ["C5", { spot_id: "C5", occupied: false, last_updated: "2026-02-08T10:00:00Z" }],
  ["C6", { spot_id: "C6", occupied: true, last_updated: "2026-02-08T10:00:00Z" }],
  ["C7", { spot_id: "C7", occupied: false, last_updated: "2026-02-08T10:00:00Z" }],
])
