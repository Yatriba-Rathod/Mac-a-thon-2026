"use client"

import React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Car, Loader2, AlertCircle } from "lucide-react"

interface AuthFormProps {
  mode: "sign-in" | "sign-up"
}

function getBaseUrlFromSettings(): string {
  try {
    const saved = localStorage.getItem("parking-settings")
    if (saved) {
      const parsed = JSON.parse(saved)
      return parsed.restBaseUrl || ""
    }
  } catch {
    // ignore
  }
  return ""
}

export function AuthForm({ mode }: AuthFormProps) {
  const { state, signIn, signUp } = useAuth()
  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (state.status === "authenticated") {
      router.replace("/")
    }
  }, [state.status, router])

  const validate = (): boolean => {
    const errors: Record<string, string> = {}

    if (!email.trim()) {
      errors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Invalid email format"
    }

    if (!password) {
      errors.password = "Password is required"
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters"
    }

    if (mode === "sign-up") {
      if (!name.trim()) {
        errors.name = "Name is required"
      }
      if (!confirmPassword) {
        errors.confirmPassword = "Please confirm your password"
      } else if (password !== confirmPassword) {
        errors.confirmPassword = "Passwords do not match"
      }
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const url = getBaseUrlFromSettings()
    if (!url) {
      setValidationErrors({ form: "Configure the Backend URL in Settings first." })
      return
    }

    let success = false
    if (mode === "sign-in") {
      success = await signIn(email, password, url)
    } else {
      success = await signUp(name, email, password, url)
    }

    if (success) {
      router.replace("/")
    }
  }

  const isLoading = state.status === "loading"
  const isSignUp = mode === "sign-up"

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Car className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="text-lg font-semibold text-foreground">Mac-A-Park</h1>
          <p className="text-sm text-muted-foreground">
            {isSignUp ? "Create your account" : "Sign in to your account"}
          </p>
        </div>

        {/* Error banner */}
        {(state.error || validationErrors.form) && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5">
            <AlertCircle className="h-4 w-4 shrink-0 text-destructive" />
            <p className="text-xs text-destructive">
              {state.error || validationErrors.form}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-xs font-medium text-muted-foreground"
              >
                Name
              </label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="bg-muted text-sm text-foreground"
                disabled={isLoading}
                autoComplete="name"
              />
              {validationErrors.name && (
                <p className="mt-1 text-xs text-destructive">{validationErrors.name}</p>
              )}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-xs font-medium text-muted-foreground"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="bg-muted text-sm text-foreground"
              disabled={isLoading}
              autoComplete="email"
            />
            {validationErrors.email && (
              <p className="mt-1 text-xs text-destructive">{validationErrors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-xs font-medium text-muted-foreground"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 8 characters"
              className="bg-muted text-sm text-foreground"
              disabled={isLoading}
              autoComplete={isSignUp ? "new-password" : "current-password"}
            />
            {validationErrors.password && (
              <p className="mt-1 text-xs text-destructive">{validationErrors.password}</p>
            )}
          </div>

          {isSignUp && (
            <div>
              <label
                htmlFor="confirm-password"
                className="mb-1.5 block text-xs font-medium text-muted-foreground"
              >
                Confirm Password
              </label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className="bg-muted text-sm text-foreground"
                disabled={isLoading}
              />
              {validationErrors.confirmPassword && (
                <p className="mt-1 text-xs text-destructive">
                  {validationErrors.confirmPassword}
                </p>
              )}
            </div>
          )}

          <Button type="submit" className="w-full gap-1.5" disabled={isLoading}>
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isLoading
              ? isSignUp
                ? "Creating account..."
                : "Signing in..."
              : isSignUp
                ? "Create Account"
                : "Sign In"}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          {isSignUp ? (
            <>
              {"Already have an account? "}
              <Link
                href="/auth/sign-in"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
            </>
          ) : (
            <>
              {"Don't have an account? "}
              <Link
                href="/auth/sign-up"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Sign up
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  )
}
