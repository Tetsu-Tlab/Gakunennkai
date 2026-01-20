'use client'

import { useState, useRef } from 'react'
import { useSettings } from "@/hooks/use-settings"
import { ArrowLeft, Upload, FileText, Check, Loader2, Calendar } from 'lucide-react'
import Link from 'next/link'

export default function ImportPage() {
    const { settings } = useSettings()
    const [file, setFile] = useState<File | null>(null)
    const [isParsing, setIsParsing] = useState(false)
    const [parsedEvents, setParsedEvents] = useState<any[]>([])
    const [isInserting, setIsInserting] = useState(false)
    const [insertResult, setInsertResult] = useState<number | null>(null)

    // Demo Mode check (simple check if settings exist but maybe empty or just checking context)
    // Ideally we should pass isDemoMode via context or props, 
    // but for now let's assume if settings are loaded strategies.
    // We'll trust the user to have API key in settings even in demo mode (as per instruction).

    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
            setParsedEvents([])
            setInsertResult(null)
        }
    }

    const handleParse = async () => {
        if (!file || !settings?.geminiApiKey) return

        setIsParsing(true)
        try {
            // Convert file to base64
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = async () => {
                const base64Data = (reader.result as string).split(',')[1]

                const response = await fetch('/api/parse-schedule', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        fileData: base64Data,
                        mimeType: file.type,
                        apiKey: settings.geminiApiKey
                    })
                })

                const data = await response.json()
                if (data.success) {
                    setParsedEvents(data.events)
                } else {
                    alert("解析に失敗しました: " + data.error)
                }
                setIsParsing(false)
            }
        } catch (e) {
            console.error(e)
            setIsParsing(false)
            alert("エラーが発生しました")
        }
    }

    const handleInsert = async () => {
        // Check if we act as demo mode? 
        // We can infer demo mode if we want, or just try to insert.
        // If unauthorized, it will fail.
        setIsInserting(true)
        try {
            // Determine if demo mode is active.
            // Since this page is client side, we don't know session easily without useSession.
            // Let's assume passed via URL param or just try?
            // For simplicity, let's treat it as real attempt, if 401 then maybe show demo message?
            // Or just pass `isDemoMode: true` if we suspect? 
            // Wait, user enters this page from Dashboard.

            const response = await fetch('/api/calendar/insert', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    calendarId: settings?.calendarId, // Use configured calendar
                    events: parsedEvents,
                    isDemoMode: false // We try real insert first? 
                    // Issue: In pure Demo Mode (no Google Login), this will 401.
                    // Solution: We should check session here.
                })
            })

            if (response.status === 401) {
                // Retry as Demo Mode
                const demoResponse = await fetch('/api/calendar/insert', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        calendarId: settings?.calendarId,
                        events: parsedEvents,
                        isDemoMode: true
                    })
                })
                const data = await demoResponse.json()
                if (data.success) {
                    setInsertResult(data.count)
                }
            } else {
                const data = await response.json()
                if (data.success) {
                    setInsertResult(data.count)
                } else {
                    alert("登録エラー: " + data.error)
                }
            }

        } catch (e) {
            console.error(e)
            alert("通信エラー")
        } finally {
            setIsInserting(false)
        }
    }

    return (
        <div className="min-h-screen bg-background text-foreground p-8">
            <div className="max-w-3xl mx-auto space-y-8">
                <div className="flex items-center gap-4">
                    <Link href="/" className="p-2 rounded-full hover:bg-secondary transition-colors">
                        <ArrowLeft className="h-6 w-6" />
                    </Link>
                    <h1 className="text-2xl font-bold">年間行事予定のインポート</h1>
                </div>

                <div className="p-6 rounded-xl border bg-card shadow-sm space-y-6">
                    <div className="text-center p-8 border-2 border-dashed rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-lg font-medium">PDFまたは画像をアップロード</p>
                        <p className="text-sm text-muted-foreground mt-2">年間予定表や月間予定表のファイルをここにドロップ</p>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="application/pdf,image/*"
                            onChange={handleFileChange}
                        />
                    </div>

                    {file && (
                        <div className="flex items-center gap-3 p-4 bg-secondary rounded-lg">
                            <FileText className="h-5 w-5 text-primary" />
                            <span className="font-medium">{file.name}</span>
                            <button
                                onClick={handleParse}
                                disabled={isParsing}
                                className="ml-auto bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
                            >
                                {isParsing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                                Geminiで解析する
                            </button>
                        </div>
                    )}
                </div>

                {parsedEvents.length > 0 && (
                    <div className="space-y-4 animate-in slide-in-from-bottom-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                解析結果 ({parsedEvents.length}件)
                            </h2>
                            <button
                                onClick={handleInsert}
                                disabled={isInserting || insertResult !== null}
                                className="bg-green-600 text-white px-6 py-2 rounded-md font-medium hover:bg-green-700 shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isInserting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                                {insertResult !== null ? '登録完了' : 'カレンダーに一括登録'}
                            </button>
                        </div>

                        {insertResult !== null && (
                            <div className="p-4 bg-green-50 text-green-700 border border-green-200 rounded-lg">
                                {insertResult}件の予定をカレンダーに登録しました！(デモモードの場合はログのみ)
                            </div>
                        )}

                        <div className="grid gap-2">
                            {parsedEvents.map((event, i) => (
                                <div key={i} className="flex items-center gap-4 p-3 bg-card border rounded-lg">
                                    <div className="w-32 font-mono text-sm">{event.date}</div>
                                    <div className="flex-1 font-medium">{event.summary}</div>
                                    <div className="text-sm text-muted-foreground">
                                        {event.startTime ? `${event.startTime} - ${event.endTime || ''}` : '終日'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
