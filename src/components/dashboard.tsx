'use client'

import { AppSettings } from "@/hooks/use-settings"
import { CalendarDays, FileText, Sparkles, History, Loader2, CheckCircle, ExternalLink } from "lucide-react"
import { useState } from "react"

interface DashboardProps {
    settings: AppSettings
    isDemoMode?: boolean
}

export function Dashboard({ settings, isDemoMode = false }: DashboardProps) {
    const [isGenerating, setIsGenerating] = useState(false)
    const [statusMessage, setStatusMessage] = useState("")
    const [result, setResult] = useState<{ docUrl: string, shortSummary: string } | null>(null)
    const [error, setError] = useState<string | null>(null)

    const handleGenerate = async () => {
        setIsGenerating(true)
        setError(null)
        setResult(null)
        setStatusMessage("カレンダーと行事予定を読み込んでいます...")

        try {
            // Step 1: Simulated progress for UX (since API doesn't stream progress yet)
            setTimeout(() => setStatusMessage("AIが内容を分析し、提案を作成中..."), 2000)
            setTimeout(() => setStatusMessage("Googleドキュメントを生成中..."), 4000)

            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ settings, isDemoMode })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Generation failed")
            }

            setResult({ docUrl: data.docUrl, shortSummary: data.shortSummary })
        } catch (err: any) {
            console.error(err)
            setError(err.message || "予期せぬエラーが発生しました")
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            {/* Header */}
            <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm p-4">
                <div className="mx-auto flex max-w-5xl items-center justify-between">
                    <h1 className="text-xl font-semibold tracking-tight text-primary">学年会資料マネージャー</h1>
                    <nav className="flex gap-4">
                        <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                            <History className="h-4 w-4" />
                            過去の資料
                        </button>
                        <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                            <span className="text-xs font-bold">T</span>
                        </div>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center p-8 gap-12 relative overflow-hidden">

                {/* Result Overlay / Success */}
                {result && (
                    <div className="w-full max-w-2xl animate-in zoom-in-95 duration-500 p-6 rounded-2xl bg-green-50 border border-green-100 dark:bg-green-950/20 dark:border-green-900">
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                <CheckCircle className="h-6 w-6" />
                            </div>
                            <h3 className="text-2xl font-semibold text-green-900 dark:text-green-100">資料が完成しました</h3>
                            <p className="text-green-700 dark:text-green-300">台帳への記録も完了しています。</p>

                            <a
                                href={result.docUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-4 inline-flex h-12 items-center justify-center rounded-lg bg-green-600 px-8 text-white font-medium shadow-lg transition-all hover:bg-green-700 hover:shadow-xl"
                            >
                                ドキュメントを開く <ExternalLink className="ml-2 h-4 w-4" />
                            </a>

                            <button onClick={() => setResult(null)} className="text-sm text-muted-foreground hover:underline">
                                閉じる
                            </button>
                        </div>
                    </div>
                )}

                {/* Hero Action */}
                {!result && (
                    <div className="text-center space-y-8 animate-in zoom-in-95 duration-500 relative z-0">
                        <h2 className="text-3xl font-light text-muted-foreground">次は、どのような準備が必要ですか？</h2>

                        {isGenerating ? (
                            <div className="relative inline-flex h-32 w-80 items-center justify-center rounded-2xl bg-secondary text-foreground shadow-inner">
                                <div className="flex flex-col items-center gap-3">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                    <span className="text-sm font-medium animate-pulse">{statusMessage}</span>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={handleGenerate}
                                className="group relative inline-flex h-32 w-80 items-center justify-center rounded-2xl bg-primary text-2xl font-semibold text-primary-foreground shadow-xl transition-all hover:scale-105 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring disabled:opacity-50"
                            >
                                <span className="flex flex-col items-center gap-2">
                                    <Sparkles className="h-8 w-8 text-yellow-300 animate-pulse" />
                                    資料を生成する
                                </span>
                                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 opacity-20 blur transition-all group-hover:opacity-40" />
                            </button>
                        )}

                        {error && (
                            <p className="text-destructive text-sm font-medium bg-destructive/10 p-2 rounded-md">
                                エラー: {error}
                            </p>
                        )}
                    </div>
                )}

                {/* AI Insight / Preview (Mock) - Hide when finished/generating to reduce clutter or keep? Keep for context. */}
                <div className={`w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 transition-opacity duration-500 ${isGenerating ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                    <div className="rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center gap-3 mb-4">
                            <CalendarDays className="h-5 w-5 text-blue-500" />
                            <h3 className="font-semibold text-lg">次回の行事予定 (2週間)</h3>
                        </div>
                        <div className="space-y-3 text-sm text-muted-foreground">
                            <p>・2/3 (月) 学年集会 (体育館)</p>
                            <p>・2/5 (水) 進路希望調査締切</p>
                            <p>・2/10 (月) 漢字テスト一斉実施</p>
                        </div>
                    </div>

                    <div className="rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center gap-3 mb-4">
                            <FileText className="h-5 w-5 text-green-500" />
                            <h3 className="font-semibold text-lg">提案ドラフト</h3>
                        </div>
                        <div className="space-y-3 text-sm text-muted-foreground">
                            <p className="italic">"来週の進路調査に向けた回収ボックスの設置と、未提出者への声掛けリストの作成を提案します..."</p>
                            <div className="pt-2">
                                <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                    AI提案
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    )
}
