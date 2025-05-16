import { Metadata } from 'next'
import { ProfileSettings } from '@/components/settings/profile-settings'

export const metadata: Metadata = {
  title: 'Profile Settings',
  description: 'Manage your profile settings and preferences',
}

export default function ProfileSettingsPage() {
  return (
    <div className="container max-w-5xl py-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
      </div>
      <ProfileSettings />
    </div>
  )
} 