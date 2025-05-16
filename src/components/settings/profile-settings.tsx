'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UserProfile } from '@/components/settings/user-profile'
import { UserPreferences } from '@/components/settings/user-preferences'
import { AccountManagement } from '@/components/settings/account-management'
import { PrivacySettings } from '@/components/settings/privacy-settings'
import { NotificationPreferences } from '@/components/settings/notification-preferences'

export function ProfileSettings() {
  return (
    <Tabs defaultValue="profile" className="space-y-4">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="preferences">Preferences</TabsTrigger>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="privacy">Privacy</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
      <TabsContent value="profile" className="space-y-4">
        <UserProfile />
      </TabsContent>
      <TabsContent value="preferences" className="space-y-4">
        <UserPreferences />
      </TabsContent>
      <TabsContent value="account" className="space-y-4">
        <AccountManagement />
      </TabsContent>
      <TabsContent value="privacy" className="space-y-4">
        <PrivacySettings />
      </TabsContent>
      <TabsContent value="notifications" className="space-y-4">
        <NotificationPreferences />
      </TabsContent>
    </Tabs>
  )
} 