export interface Point {
  x: number
  y: number
}

export type SpotType = "standard" | "accessible" | "ev"

export interface SpotDefinition {
  spot_id: string
  polygon: Point[]
  type?: SpotType
  center?: Point
}

export interface Entrance {
  id: string
  name: string
  x: number
  y: number
}

export interface LotDefinition {
  lot_id: string
  name: string
  spots: SpotDefinition[]
  image_width?: number
  image_height?: number
  created_at?: string
  updated_at?: string
}

export interface SpotState {
  spot_id: string
  occupied: boolean
  last_updated?: string
  ts?: string | number
}

export interface SpotUpdateMessage {
  type: "spot_update"
  spot_id: string
  occupied: boolean
  ts: string
}

export interface SnapshotMessage {
  type: "snapshot"
  spots: { spot_id: string; occupied: boolean }[]
  ts: string
}

export type WSMessage = SpotUpdateMessage | SnapshotMessage

export type ConnectionState = "connected" | "disconnected" | "reconnecting"

export interface ParkingSettings {
  restBaseUrl: string
  wsUrl: string
}
