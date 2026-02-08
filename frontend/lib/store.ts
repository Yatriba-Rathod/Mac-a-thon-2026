"use client"

import React from "react"

import { createContext, useContext } from "react"
import type {
  LotDefinition,
  SpotState,
  ConnectionState,
  ParkingSettings,
} from "./types"

export interface ParkingStoreState {
  lot: LotDefinition | null
  spotStates: Map<string, SpotState>
  connectionState: ConnectionState
  settings: ParkingSettings
  error: string | null
}

export type ParkingAction =
  | { type: "SET_LOT"; lot: LotDefinition }
  | { type: "UPDATE_SPOT"; spot_id: string; occupied: boolean; ts: string }
  | {
      type: "SET_SNAPSHOT"
      spots: { spot_id: string; occupied: boolean }[]
      ts: string
    }
  | { type: "SET_CONNECTION_STATE"; state: ConnectionState }
  | { type: "SET_SETTINGS"; settings: ParkingSettings }
  | { type: "SET_ERROR"; error: string | null }

export function parkingReducer(
  state: ParkingStoreState,
  action: ParkingAction
): ParkingStoreState {
  switch (action.type) {
    case "SET_LOT":
      return { ...state, lot: action.lot, error: null }

    case "UPDATE_SPOT": {
      const newStates = new Map(state.spotStates)
      newStates.set(action.spot_id, {
        spot_id: action.spot_id,
        occupied: action.occupied,
        last_updated: action.ts,
        ts: action.ts,
      })
      return { ...state, spotStates: newStates }
    }

    case "SET_SNAPSHOT": {
      const newStates = new Map(state.spotStates)
      for (const s of action.spots) {
        newStates.set(s.spot_id, {
          spot_id: s.spot_id,
          occupied: s.occupied,
          last_updated: action.ts,
          ts: action.ts,
        })
      }
      return { ...state, spotStates: newStates }
    }

    case "SET_CONNECTION_STATE":
      return { ...state, connectionState: action.state }

    case "SET_SETTINGS":
      return { ...state, settings: action.settings }

    case "SET_ERROR":
      return { ...state, error: action.error }

    default:
      return state
  }
}

export const defaultSettings: ParkingSettings = {
  restBaseUrl: "",
  wsUrl: "",
}

export const initialState: ParkingStoreState = {
  lot: null,
  spotStates: new Map(),
  connectionState: "disconnected",
  settings: defaultSettings,
  error: null,
}

export const ParkingContext = createContext<{
  state: ParkingStoreState
  dispatch: React.Dispatch<ParkingAction>
}>({
  state: initialState,
  dispatch: () => {},
})

export function useParkingStore() {
  return useContext(ParkingContext)
}
