import type { LotDefinition } from "./types"

export async function fetchCurrentLot(
  baseUrl: string
): Promise<LotDefinition> {
  const res = await fetch(`${baseUrl}/api/lots/current`)
  if (!res.ok) throw new Error(`Failed to fetch lot: ${res.statusText}`)
  return res.json()
}

export async function getSignedUploadUrl(
  baseUrl: string,
  filename: string,
  contentType: string
): Promise<{ url: string; objectName: string }> {
  const res = await fetch(`${baseUrl}/api/videos/signed-upload-url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename, contentType }),
  })
  if (!res.ok) throw new Error(`Failed to get signed URL: ${res.statusText}`)
  return res.json()
}

export async function uploadFileToSignedUrl(
  signedUrl: string,
  file: File
): Promise<void> {
  const res = await fetch(signedUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  })
  if (!res.ok) throw new Error(`Upload failed: ${res.statusText}`)
}
