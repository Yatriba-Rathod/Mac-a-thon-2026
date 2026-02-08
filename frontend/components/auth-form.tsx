"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Car, Loader2, AlertCircle } from "lucide-react"

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth"
import { auth } from "../lib/firebase";

interface AuthFormProps {
  mode: "sign-in" | "sign-up"
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState("")

  const isSignUp = mode === "sign-up"

  // Redirect if already logged in
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) router.replace("/")
    })
    return () => unsub()
  }, [router])

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

    if (isSignUp) {
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
    setFormError("")
    if (!validate()) return

    setLoading(true)
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password)
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }

      router.replace("/")
    } catch (err: any) {
      setFormError(err.message || "Authentication failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Car className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="text-lg font-semibold">Mac-A-Park</h1>
          <p className="text-sm text-muted-foreground">
            {isSignUp ? "Create your account" : "Sign in to your account"}
          </p>
        </div>

        {(formError || validationErrors.form) && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <p className="text-xs text-destructive">
              {formError || validationErrors.form}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="mb-1.5 block text-xs font-medium">Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                disabled={loading}
              />
              {validationErrors.name && (
                <p className="mt-1 text-xs text-destructive">
                  {validationErrors.name}
                </p>
              )}
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-medium">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={loading}
            />
            {validationErrors.email && (
              <p className="mt-1 text-xs text-destructive">
                {validationErrors.email}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 8 characters"
              disabled={loading}
            />
            {validationErrors.password && (
              <p className="mt-1 text-xs text-destructive">
                {validationErrors.password}
              </p>
            )}
          </div>

          {isSignUp && (
            <div>
              <label className="mb-1.5 block text-xs font-medium">
                Confirm Password
              </label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
              {validationErrors.confirmPassword && (
                <p className="mt-1 text-xs text-destructive">
                  {validationErrors.confirmPassword}
                </p>
              )}
            </div>
          )}

          <Button type="submit" className="w-full gap-1.5" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading
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
              Already have an account?{" "}
              <Link href="/auth/sign-in" className="text-primary hover:underline">
                Sign in
              </Link>
            </>
          ) : (
            <>
              Don&apos;t have an account?{" "}
              <Link href="/auth/sign-up" className="text-primary hover:underline">
                Sign up
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  )
}
