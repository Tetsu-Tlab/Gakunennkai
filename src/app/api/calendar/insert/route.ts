import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { GoogleService } from "@/lib/google-api"

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions)

    // Check Demo Mode flag
    const body = await req.json()
    const { calendarId, events, isDemoMode } = body

    if (!isDemoMode && (!session || !session.accessToken)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const google = new GoogleService(isDemoMode ? undefined : session?.accessToken)

        // Use provided calendarId or primary
        const targetCalendarId = calendarId || 'primary'

        const count = await google.insertEvents(targetCalendarId, events)

        return NextResponse.json({ success: true, count })

    } catch (error: any) {
        console.error("Insert Error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
