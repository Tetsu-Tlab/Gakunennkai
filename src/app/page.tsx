'use client'

import { useSession } from "next-auth/react"
import { useSettings } from "@/hooks/use-settings"
import { LoginView } from "@/components/login-view"
import { OnboardingWizard } from "@/components/onboarding-wizard"
import { Dashboard } from "@/components/dashboard"
import { Loader2 } from "lucide-react"

export default function Home() {
  const { data: session, status } = useSession()
  const { settings, loading: settingsLoading, saveSettings } = useSettings()

  if (status === "loading" || settingsLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!session) {
    return <LoginView />
  }

  if (!settings) {
    return <OnboardingWizard onComplete={saveSettings} />
  }

  return <Dashboard settings={settings} />
}
