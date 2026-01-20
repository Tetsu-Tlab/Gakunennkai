'use client'

import { useState } from 'react'
import { AppSettings } from '@/hooks/use-settings'
import { Check, ChevronRight, Settings2 } from 'lucide-react'

interface OnboardingWizardProps {
    onComplete: (settings: AppSettings) => void
}

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState<Partial<AppSettings>>({})

    const handleNext = () => setStep(s => s + 1)
    const handleBack = () => setStep(s => s - 1)

    const handleChange = (key: keyof AppSettings, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }))
    }

    const handleSubmit = () => {
        if (formData.geminiApiKey && formData.classroomId && formData.driveFolderId && formData.spreadsheetId) {
            onComplete(formData as AppSettings)
        }
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 animate-in slide-in-from-bottom-4 duration-500">
            <div className="w-full max-w-lg space-y-8 rounded-xl border bg-card p-8 shadow-sm">
                <div className="space-y-2 text-center">
                    <h2 className="text-2xl font-light tracking-tight">初期設定 ({step}/3)</h2>
                    <p className="text-sm text-muted-foreground">
                        {step === 1 && "AIの力を解き放つための鍵を入力してください。"}
                        {step === 2 && "連携するクラスルームとカレンダーを指定します。"}
                        {step === 3 && "資料の保存先と記録台帳のIDを設定します。"}
                    </p>
                </div>

                <div className="space-y-6">
                    {step === 1 && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Gemini API Key
                                </label>
                                <input
                                    type="password"
                                    placeholder="AIzaSy..."
                                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={formData.geminiApiKey || ''}
                                    onChange={(e) => handleChange('geminiApiKey', e.target.value)}
                                />
                                <p className="text-[0.8rem] text-muted-foreground">
                                    Google AI Studioから取得したAPIキーを入力してください。ブラウザにのみ保存されます。
                                </p>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">Classroom ID</label>
                                <input
                                    type="text"
                                    placeholder="1234567890"
                                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    value={formData.classroomId || ''}
                                    onChange={(e) => handleChange('classroomId', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">Common Calendar ID (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="c_...group.calendar.google.com"
                                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    value={formData.calendarId || ''}
                                    onChange={(e) => handleChange('calendarId', e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">Google Drive Folder ID</label>
                                <input
                                    type="text"
                                    placeholder="1A2B3C..."
                                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    value={formData.driveFolderId || ''}
                                    onChange={(e) => handleChange('driveFolderId', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">Spreadsheet ID (Proposal Log)</label>
                                <input
                                    type="text"
                                    placeholder="1X2Y3Z..."
                                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    value={formData.spreadsheetId || ''}
                                    onChange={(e) => handleChange('spreadsheetId', e.target.value)}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-between">
                    <button
                        onClick={handleBack}
                        disabled={step === 1}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                    >
                        戻る
                    </button>

                    {step < 3 ? (
                        <button
                            onClick={handleNext}
                            className="inline-flex items-center justify-center rounded-md bg-primary text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-10 px-4 py-2"
                        >
                            次へ <ChevronRight className="ml-2 h-4 w-4" />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            className="inline-flex items-center justify-center rounded-md bg-green-600 text-sm font-medium text-white ring-offset-background transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-10 px-4 py-2"
                        >
                            設定完了 <Check className="ml-2 h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
