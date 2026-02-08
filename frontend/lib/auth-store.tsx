"use client"

import React, { createContext, useContext, useReducer, useEffect, useCallback } from "react"
import { auth } from "./firebase"
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  User,
} from "firebase/auth"

export interface AuthUser {
  uid: string
  name: string | null
  email: string | null
}

export type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated"

export interface AuthState {
  user: AuthUser | null
  status: AuthStatus
  error: string | null
}

type AuthAction =
  | { type: "SET_LOADING" }
  | { type: "SET_AUTHENTICATED"; user: AuthUser }
  | { type: "SET_UNAUTHENTICATED" }
  | { type: "SET_ERROR"; error: string }
  | { type: "CLEAR_ERROR" }

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, status: "loading", error: null }
    case "SET_AUTHENTICATED":
      return { user: action.user, status: "authenticated", error: null }
    case "SET_UNAUTHENTICATED":
      return { user: null, status: "unauthenticated", error: null }
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
  status: "idle",
  error: null,
}

interface AuthContextValue {
  state: AuthState
  signIn: (email: string, password: string) => Promise<boolean>
  signUp: (name: string, email: string, password: string) => Promise<boolean>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue>({
  state: initialAuthState,
  signIn: async () => false,
  signUp: async () => false,
  signOut: async () => { },
})

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialAuthState)

  // Track Firebase Auth state
  useEffect(() => {
    dispatch({ type: "SET_LOADING" })
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch({
          type: "SET_AUTHENTICATED",
          user: { uid: user.uid, name: user.displayName, email: user.email },
        })
      } else {
        dispatch({ type: "SET_UNAUTHENTICATED" })
      }
    })
    return () => unsubscribe()
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    dispatch({ type: "SET_LOADING" })
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      dispatch({
        type: "SET_AUTHENTICATED",
        user: { uid: user.uid, name: user.displayName, email: user.email },
      })
      return true
    } catch (err: any) {
      dispatch({ type: "SET_ERROR", error: err.message || "Sign in failed" })
      return false
    }
  }, [])

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    dispatch({ type: "SET_LOADING" })
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      if (name) {
        await updateProfile(user, { displayName: name })
      }
      dispatch({
        type: "SET_AUTHENTICATED",
        user: { uid: user.uid, name: user.displayName, email: user.email },
      })
      return true
    } catch (err: any) {
      dispatch({ type: "SET_ERROR", error: err.message || "Sign up failed" })
      return false
    }
  }, [])

  const signOutUser = useCallback(async () => {
    await firebaseSignOut(auth)
    dispatch({ type: "SET_UNAUTHENTICATED" })
  }, [])

  return (
    <AuthContext.Provider
      value={{
        state,
        signIn,
        signUp,
        signOut: signOutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
