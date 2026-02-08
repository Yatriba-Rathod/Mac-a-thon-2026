"use client"

import React from "react"

import { useReducer, useEffect } from "react"
import {
  ParkingContext,
  parkingReducer,
  initialState,
  type ParkingSettings,
} from "@/lib/store"
import { fetchCurrentLot } from "@/lib/api"
import { useParkingWebSocket } from "@/hooks/use-parking-websocket"

function InnerProviderEffects() {
  useParkingWebSocket()
  return null
}

export function ParkingProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(parkingReducer, initialState)

  // Load settings from localStorage on mount and fetch lot from backend
  useEffect(() => {
    let settings: ParkingSettings = { restBaseUrl: "", wsUrl: "" }
    try {
      const saved = localStorage.getItem("parking-settings")
      if (saved) {
        settings = JSON.parse(saved)
        dispatch({ type: "SET_SETTINGS", settings })
      }
    } catch {
      // Use defaults
    }

    // Fetch lot from backend if configured
    if (settings.restBaseUrl) {
      fetchCurrentLot(settings.restBaseUrl)
        .then((lot) => {
          dispatch({ type: "SET_LOT", lot })
        })
        .catch(() => {
          dispatch({
            type: "SET_ERROR",
            error: "Backend not connected. Check Settings.",
          })
        })
    } else {
      dispatch({
        type: "SET_ERROR",
        error: "Backend not configured. Go to Settings to enter REST and WebSocket URLs.",
      })
    }
  }, [])

  return (
    <ParkingContext.Provider value={{ state, dispatch }}>
      <InnerProviderEffects />
      {children}
    </ParkingContext.Provider>
  )
}
