import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { GeminiService } from "@/lib/gemini"

export const maxDuration = 60; // Allow longer timeout for large file processing

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions)

    try {
        const body = await req.json()
        const { fileData, mimeType, apiKey } = body // Expect base64 file data

        if (!apiKey) {
            return NextResponse.json({ error: "Missing API Key" }, { status: 400 })
        }

        const gemini = new GeminiService(apiKey)
        const events = await gemini.parseScheduleDocument(fileData, mimeType)

        return NextResponse.json({ success: true, events })

    } catch (error: any) {
        console.error("Parse Error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
