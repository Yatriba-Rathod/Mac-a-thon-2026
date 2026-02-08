export interface AuthResponse {
  token: string
  user: { id: string; name: string; email: string }
}

export interface MeResponse {
  user: { id: string; name: string; email: string }
}

async function authFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init)
  if (!res.ok) {
    let message = `Request failed (${res.status})`
    try {
      const body = await res.json()
      if (body.message || body.error) message = body.message || body.error
    } catch {
      // use default message
    }
    throw new Error(message)
  }
  return res.json()
}

export function authLogin(
  baseUrl: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  return authFetch<AuthResponse>(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
}

export function authRegister(
  baseUrl: string,
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  return authFetch<AuthResponse>(`${baseUrl}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  })
}

export function authMe(baseUrl: string, token: string): Promise<MeResponse> {
  return authFetch<MeResponse>(`${baseUrl}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

/** Helper to get auth headers for other API calls */
export function getAuthHeaders(): Record<string, string> {
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null
  return token ? { Authorization: `Bearer ${token}` } : {}
}
