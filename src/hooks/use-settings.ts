'use client'

import { useState, useEffect } from 'react'

export interface AppSettings {
    geminiApiKey: string
    classroomId: string
    driveFolderId: string
    spreadsheetId: string
    calendarId?: string
}

const SETTINGS_KEY = 'school-meeting-manager-settings'

export function useSettings() {
    const [settings, setSettings] = useState<AppSettings | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const stored = localStorage.getItem(SETTINGS_KEY)
        if (stored) {
            try {
                setSettings(JSON.parse(stored))
            } catch (e) {
                console.error("Failed to parse settings", e)
            }
        }
        setLoading(false)
    }, [])

    const saveSettings = (newSettings: AppSettings) => {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings))
        setSettings(newSettings)
    }

    const clearSettings = () => {
        localStorage.removeItem(SETTINGS_KEY)
        setSettings(null)
    }

    return { settings, loading, saveSettings, clearSettings }
}
