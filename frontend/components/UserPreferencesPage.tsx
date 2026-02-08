"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { useParkingStore } from "@/lib/store"

export default function UserPreferencesPage() {
    const [q1, setQ1] = useState("")
    const [q2, setQ2] = useState("")
    const [q3, setQ3] = useState("")
    const [q4, setQ4] = useState("")
    const [q5, setQ5] = useState<string[]>([])

    const { state } = useParkingStore()

    const handleSubmit = () => {
        console.log({ q1, q2, q3, q4, q5 })
        alert("Thank you for completing the survey!")
    }

    const toggleQ5 = (option: string) => {
        setQ5(prev => prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option])
    }

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <DashboardSidebar
                guidanceFilter="best"
                onFilterChange={() => { }}
                selectedEntranceId={state.lot?.entrances?.[0]?.id ?? null}
                onEntranceChange={() => { }}
                guidanceResult={{ recommendedSpots: [], pathPoints: [], entrance: null }}
                onCenterOnSpot={() => { }}
            />

            {/* Main content */}
            <main className="flex-1 overflow-auto p-8">
                <h1 className="text-xl font-semibold text-foreground mb-4">
                    User Parking Preferences
                </h1>
                <p className="text-sm text-muted-foreground mb-6">
                    Help us improve the parking experience by answering a few questions.
                </p>

                {/* Question 1 */}
                <div className="mb-6">
                    <p className="font-medium text-sm mb-2">
                        1) How long does it usually take you to find a parking spot at this location?
                    </p>
                    {["Less than 1 minute", "1–3 minutes", "3–5 minutes", "5–10 minutes", "More than 10 minutes"].map(option => (
                        <label key={option} className="flex items-center gap-2 mb-1 text-sm">
                            <input type="radio" name="q1" value={option} checked={q1 === option} onChange={e => setQ1(e.target.value)} className="h-4 w-4 accent-primary" />
                            {option}
                        </label>
                    ))}
                </div>

                {/* Add questions 2–5 similarly */}
                {/* ... */}

                <Button onClick={handleSubmit} className="gap-1.5">
                    Submit Preferences
                </Button>
            </main>
        </div>
    )
}
