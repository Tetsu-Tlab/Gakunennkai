'use client'

import { signIn } from "next-auth/react"

interface LoginViewProps {
    onDemoStart: () => void
}

export function LoginView({ onDemoStart }: LoginViewProps) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center animate-in fade-in duration-700">
            <div className="max-w-md space-y-8">
                <div className="space-y-2">
                    <h1 className="text-4xl font-light tracking-tight text-primary">学年会資料マネージャー</h1>
                    <p className="text-lg text-muted-foreground">
                        Google Workspaceと連携し、日々の業務をZenの心で自動化します。
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    <button
                        onClick={() => signIn("google")}
                        className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    >
                        Googleでログイン
                    </button>

                    <button
                        onClick={onDemoStart}
                        className="inline-flex h-12 items-center justify-center rounded-md border border-input bg-transparent px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                        デモモードで試す (設定不要)
                    </button>
                    <p className="text-xs text-muted-foreground">
                        デモモードでは、Google連携をスキップし、ダミーデータを使用してAI生成機能のみを体験できます。
                    </p>
                </div>
            </div>
        </div>
    )
}
