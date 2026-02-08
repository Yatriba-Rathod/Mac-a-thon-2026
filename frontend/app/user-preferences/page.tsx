"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AppShell } from "@/components/app-shell"

export default function UserPreferencesPage() {
    const [q1, setQ1] = useState<string>("")
    const [q2, setQ2] = useState<string>("")
    const [q3, setQ3] = useState<string>("")
    const [q4, setQ4] = useState<string>("")
    const [q5, setQ5] = useState<string[]>([])

    const firebase_id = "user_123" // replace with dynamic Firebase ID if available

    const surveyData = { firebase_id, q1, q2, q3, q4, q5 }

    // ==================== API FUNCTIONS ====================

    const handleSubmit = async () => {
        try {
            const res = await fetch("/api/questions/answer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(surveyData),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.detail || "Error submitting survey")
            alert("Survey submitted successfully!")
        } catch (err: any) {
            alert(err.message)
        }
    }

    const handleEdit = async () => {
        try {
            const res = await fetch(`/api/questions/${firebase_id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ q1, q2, q3, q4, q5 }), // send only fields to update
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.detail || "Error editing survey")
            alert("Survey updated successfully!")
        } catch (err: any) {
            alert(err.message)
        }
    }

    const handleDelete = async () => {
        const confirmed = confirm("Are you sure you want to delete your survey answers?")
        if (!confirmed) return

        try {
            const res = await fetch(`/api/questions/${firebase_id}`, {
                method: "DELETE",
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.detail || "Error deleting survey")
            alert("Survey deleted successfully!")
            // Reset form after deletion
            setQ1("")
            setQ2("")
            setQ3("")
            setQ4("")
            setQ5([])
        } catch (err: any) {
            alert(err.message)
        }
    }

    const toggleQ5 = (option: string) => {
        setQ5((prev) =>
            prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
        )
    }

    // ==================== JSX ====================

    return (
        <AppShell>
            <div className="mx-auto max-w-2xl p-8">
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
                    {[
                        "Less than 1 minute",
                        "1–3 minutes",
                        "3–5 minutes",
                        "5–10 minutes",
                        "More than 10 minutes",
                    ].map((option) => (
                        <label key={option} className="flex items-center gap-2 mb-1 text-sm">
                            <input
                                type="radio"
                                name="q1"
                                value={option}
                                checked={q1 === option}
                                onChange={(e) => setQ1(e.target.value)}
                                className="h-4 w-4 accent-primary"
                            />
                            {option}
                        </label>
                    ))}
                </div>

                {/* Question 2 */}
                <div className="mb-6">
                    <p className="font-medium text-sm mb-2">
                        2) What time of day do you usually arrive at this parking lot?
                    </p>
                    {[
                        "Morning (6am–10am)",
                        "Midday (10am–2pm)",
                        "Afternoon (2pm–6pm)",
                        "Evening (6pm–10pm)",
                        "Late night",
                    ].map((option) => (
                        <label key={option} className="flex items-center gap-2 mb-1 text-sm">
                            <input
                                type="radio"
                                name="q2"
                                value={option}
                                checked={q2 === option}
                                onChange={(e) => setQ2(e.target.value)}
                                className="h-4 w-4 accent-primary"
                            />
                            {option}
                        </label>
                    ))}
                </div>

                {/* Question 3 */}
                <div className="mb-6">
                    <p className="font-medium text-sm mb-2">
                        3) What type of parking spot do you prefer most?
                    </p>
                    <select
                        value={q3}
                        onChange={(e) => setQ3(e.target.value)}
                        className="w-full border border-border rounded px-3 py-2 bg-card text-foreground"
                    >
                        <option value="">Select an option</option>
                        <option value="Closest to entrance">Closest to entrance</option>
                        <option value="Easiest to park">Easiest to park</option>
                        <option value="Least walking distance">Least walking distance</option>
                        <option value="Near exit">Near exit</option>
                        <option value="No strong preference">No strong preference</option>
                    </select>
                </div>

                {/* Question 4 */}
                <div className="mb-6">
                    <p className="font-medium text-sm mb-2">
                        4) How many parking spots do you usually pass before finding an empty one?
                    </p>
                    {["1–2", "3–5", "6–10", "More than 10"].map((option) => (
                        <label key={option} className="flex items-center gap-2 mb-1 text-sm">
                            <input
                                type="radio"
                                name="q4"
                                value={option}
                                checked={q4 === option}
                                onChange={(e) => setQ4(e.target.value)}
                                className="h-4 w-4 accent-primary"
                            />
                            {option}
                        </label>
                    ))}
                </div>

                {/* Question 5 */}
                <div className="mb-6">
                    <p className="font-medium text-sm mb-2">
                        5) Do you require or strongly prefer any of the following?
                    </p>
                    {["EV charging spot", "Accessible parking", "Wide/family spot", "No preference"].map(
                        (option) => (
                            <label key={option} className="flex items-center gap-2 mb-1 text-sm">
                                <input
                                    type="checkbox"
                                    value={option}
                                    checked={q5.includes(option)}
                                    onChange={() => toggleQ5(option)}
                                    className="h-4 w-4 accent-primary"
                                />
                                {option}
                            </label>
                        )
                    )}
                </div>

                {/* Buttons */}
                <div className="flex gap-4 mt-4">
                    <Button onClick={handleSubmit} className="gap-1.5">
                        Submit Preferences
                    </Button>
                    <Button onClick={handleEdit} variant="secondary" className="gap-1.5">
                        Edit Preferences
                    </Button>
                    <Button onClick={handleDelete} variant="destructive" className="gap-1.5">
                        Delete Preferences
                    </Button>
                </div>
            </div>
        </AppShell>
    )
}
