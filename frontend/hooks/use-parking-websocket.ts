"use client"

import { useEffect, useRef, useCallback } from "react"
import { useParkingStore } from "@/lib/store"
import type { WSMessage } from "@/lib/types"

const INITIAL_BACKOFF = 1000
const MAX_BACKOFF = 30000

export function useParkingWebSocket() {
  const { state, dispatch } = useParkingStore()
  const wsRef = useRef<WebSocket | null>(null)
  const backoffRef = useRef(INITIAL_BACKOFF)
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const connect = useCallback(() => {
    if (!state.settings.wsUrl) return

    dispatch({ type: "SET_CONNECTION_STATE", state: "reconnecting" })

    try {
      const ws = new WebSocket(state.settings.wsUrl)
      wsRef.current = ws

      ws.onopen = () => {
        dispatch({ type: "SET_CONNECTION_STATE", state: "connected" })
        backoffRef.current = INITIAL_BACKOFF
        ws.send(JSON.stringify({ type: "get_snapshot" }))
      }

      ws.onmessage = (event) => {
        try {
          const msg: WSMessage = JSON.parse(event.data)
          if (msg.type === "spot_update") {
            dispatch({
              type: "UPDATE_SPOT",
              spot_id: msg.spot_id,
              occupied: msg.occupied,
              ts: msg.ts,
            })
          } else if (msg.type === "snapshot") {
            dispatch({
              type: "SET_SNAPSHOT",
              spots: msg.spots,
              ts: msg.ts,
            })
          }
        } catch {
          // Ignore malformed messages
        }
      }

      ws.onclose = () => {
        dispatch({ type: "SET_CONNECTION_STATE", state: "disconnected" })
        scheduleReconnect()
      }

      ws.onerror = () => {
        ws.close()
      }
    } catch {
      dispatch({ type: "SET_CONNECTION_STATE", state: "disconnected" })
      scheduleReconnect()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.settings.wsUrl, dispatch])

  const scheduleReconnect = useCallback(() => {
    if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current)
    reconnectTimerRef.current = setTimeout(() => {
      backoffRef.current = Math.min(backoffRef.current * 2, MAX_BACKOFF)
      connect()
    }, backoffRef.current)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connect])

  const disconnect = useCallback(() => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current)
      reconnectTimerRef.current = null
    }
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    dispatch({ type: "SET_CONNECTION_STATE", state: "disconnected" })
  }, [dispatch])

  useEffect(() => {
    if (state.settings.wsUrl) {
      connect()
    }
    return () => {
      disconnect()
    }
  }, [state.settings.wsUrl, connect, disconnect])

  return { connect, disconnect }
}
