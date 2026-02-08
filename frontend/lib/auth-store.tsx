"use client"

import React, { createContext, useContext, useReducer, useEffect, useCallback } from "react"
import { authLogin, authRegister, authMe } from "./auth-api"

export interface AuthUser {
  id: string
  name: string
  email: string
}

export type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated"

export interface AuthState {
  user: AuthUser | null
  token: string | null
  status: AuthStatus
  error: string | null
}

type AuthAction =
  | { type: "SET_LOADING" }
  | { type: "SET_AUTHENTICATED"; user: AuthUser; token: string }
  | { type: "SET_UNAUTHENTICATED" }
  | { type: "SET_ERROR"; error: string }
  | { type: "CLEAR_ERROR" }

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, status: "loading", error: null }
    case "SET_AUTHENTICATED":
      return { user: action.user, token: action.token, status: "authenticated", error: null }
    case "SET_UNAUTHENTICATED":
      return { user: null, token: null, status: "unauthenticated", error: null }
    case "SET_ERROR":
      return { ...state, status: "unauthenticated", error: action.error }
    case "CLEAR_ERROR":
      return { ...state, error: null }
    default:
      return state
  }
}

const initialAuthState: AuthState = {
  user: null,
  token: null,
  status: "idle",
  error: null,
}

interface AuthContextValue {
  state: AuthState
  signIn: (email: string, password: string, baseUrl: string) => Promise<boolean>
  signUp: (name: string, email: string, password: string, baseUrl: string) => Promise<boolean>
  signOut: () => void
}

const AuthContext = createContext<AuthContextValue>({
  state: initialAuthState,
  signIn: async () => false,
  signUp: async () => false,
  signOut: () => {},
})

export function useAuth() {
  return useContext(AuthContext)
}

const TOKEN_KEY = "auth_token"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialAuthState)

  // Hydrate from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) {
      dispatch({ type: "SET_UNAUTHENTICATED" })
      return
    }

    // Try to validate with /auth/me
    let baseUrl = ""
    try {
      const saved = localStorage.getItem("parking-settings")
      if (saved) {
        baseUrl = JSON.parse(saved).restBaseUrl || ""
      }
    } catch {
      // ignore
    }

    if (baseUrl) {
      dispatch({ type: "SET_LOADING" })
      authMe(baseUrl, token)
        .then((res) => {
          dispatch({ type: "SET_AUTHENTICATED", user: res.user, token })
        })
        .catch(() => {
          localStorage.removeItem(TOKEN_KEY)
          dispatch({ type: "SET_UNAUTHENTICATED" })
        })
    } else {
      // No backend URL configured -- keep token, mark authenticated optimistically
      dispatch({
        type: "SET_AUTHENTICATED",
        user: { id: "", name: "User", email: "" },
        token,
      })
    }
  }, [])

  const signIn = useCallback(async (email: string, password: string, baseUrl: string) => {
    dispatch({ type: "SET_LOADING" })
    try {
      const res = await authLogin(baseUrl, email, password)
      localStorage.setItem(TOKEN_KEY, res.token)
      dispatch({ type: "SET_AUTHENTICATED", user: res.user, token: res.token })
      return true
    } catch (err) {
      dispatch({
        type: "SET_ERROR",
        error: err instanceof Error ? err.message : "Sign in failed",
      })
      return false
    }
  }, [])

  const signUp = useCallback(async (name: string, email: string, password: string, baseUrl: string) => {
    dispatch({ type: "SET_LOADING" })
    try {
      const res = await authRegister(baseUrl, name, email, password)
      localStorage.setItem(TOKEN_KEY, res.token)
      dispatch({ type: "SET_AUTHENTICATED", user: res.user, token: res.token })
      return true
    } catch (err) {
      dispatch({
        type: "SET_ERROR",
        error: err instanceof Error ? err.message : "Sign up failed",
      })
      return false
    }
  }, [])

  const signOut = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    dispatch({ type: "SET_UNAUTHENTICATED" })
  }, [])

  return (
    <AuthContext.Provider value={{ state, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
