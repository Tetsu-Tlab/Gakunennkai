'use client'

import { signIn } from "next-auth/react"

export function LoginView() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center animate-in fade-in duration-700">
            <div className="max-w-md space-y-8">
                <div className="space-y-2">
                    <h1 className="text-4xl font-light tracking-tight text-primary">学年会資料マネージャー</h1>
                    <p className="text-lg text-muted-foreground">
                        Google Workspaceと連携し、日々の業務をZenの心で自動化します。
                    </p>
                </div>

                <button
                    onClick={() => signIn("google")}
                    className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                    Googleでログイン
                </button>
            </div>
        </div>
    )
}
