"use client";

import React from "react";

import { useReducer, useEffect } from "react";
import {
  ParkingContext,
  parkingReducer,
  initialState,
  type ParkingSettings,
} from "@/lib/store";
import { fetchLotById, fetchOccupancyByLotId } from "@/lib/api";
import { useParkingWebSocket } from "@/hooks/use-parking-websocket";

function InnerProviderEffects() {
  useParkingWebSocket();
  return null;
}

export function ParkingProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(parkingReducer, initialState);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
  // Load settings from localStorage on mount and fetch lot from backend
  useEffect(() => {
    let settings: ParkingSettings = {
      restBaseUrl: `${API_BASE_URL} `,
      wsUrl: "",
    };
    try {
      const saved = localStorage.getItem("parking-settings");
      if (saved) {
        settings = JSON.parse(saved);
        dispatch({ type: "SET_SETTINGS", settings });
      }
    } catch {
      // Use defaults
    }

    // Fetch lot from backend with lot_id="lot1"
    const lotId = "lot1";
    if (settings.restBaseUrl) {
      fetchLotById(settings.restBaseUrl, lotId)
        .then((lot) => {
          dispatch({ type: "SET_LOT", lot });
        })
        .catch((error) => {
          console.error("Failed to fetch lot:", error);
          dispatch({
            type: "SET_ERROR",
            error: "Failed to load parking lot. Check backend connection.",
          });
        });
    } else {
      dispatch({
        type: "SET_ERROR",
        error:
          "Backend not configured. Go to Settings to enter REST and WebSocket URLs.",
      });
    }
  }, []);

  // Fetch and poll occupancy data
  useEffect(() => {
    const lotId = "lot1";
    const baseUrl = `${API_BASE_URL}`;

    const fetchOccupancy = async () => {
      try {
        const occupancies = await fetchOccupancyByLotId(baseUrl, lotId);
        // Convert array to snapshot format
        const spots = occupancies.map((occ) => ({
          spot_id: occ.spot_id,
          occupied: occ.occupied,
        }));
        dispatch({
          type: "SET_SNAPSHOT",
          spots,
          ts: new Date().toISOString(),
        });
      } catch (error) {
        console.error("Failed to fetch occupancy:", error);
      }
    };

    // Fetch immediately
    fetchOccupancy();

    // Poll every 3 seconds
    const intervalId = setInterval(fetchOccupancy, 3000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <ParkingContext.Provider value={{ state, dispatch }}>
      <InnerProviderEffects />
      {children}
    </ParkingContext.Provider>
  );
}
