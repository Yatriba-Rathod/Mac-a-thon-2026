// lib/api.ts
import type { LotDefinition } from "./types"
import { auth } from "./firebase"

/**
 * Helper to get Firebase ID token for authenticated requests
 */
async function getAuthHeaders(): Promise<Record<string, string>> {
  const user = auth.currentUser
  if (!user) return {}
  const token = await user.getIdToken()
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  }
}

/**
 * Fetch current parking lot data
 */
export async function fetchCurrentLot(baseUrl: string): Promise<LotDefinition[]> {
  const headers = await getAuthHeaders()
  const res = await fetch(`${baseUrl}/lot`, { headers })
  if (!res.ok) {
    throw new Error(`Failed to fetch parking lot: ${res.statusText}`)
  }
  return res.json()
}

/**
 * Update a specific parking lot entry
 */
export async function updateLot(baseUrl: string, lotId: string, data: Partial<LotDefinition>) {
  const headers = await getAuthHeaders()
  const res = await fetch(`${baseUrl}/lot/${lotId}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    throw new Error(`Failed to update lot: ${res.statusText}`)
  }
  return res.json()
}

/**
 * Example: fetch all available lots (custom endpoint)
 */
export async function fetchAvailableLots(baseUrl: string): Promise<LotDefinition[]> {
  const headers = await getAuthHeaders()
  const res = await fetch(`${baseUrl}/lot/available`, { headers })
  if (!res.ok) {
    throw new Error(`Failed to fetch available lots: ${res.statusText}`)
  }
  return res.json()
}
