'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/firebase/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Icons } from '@/components/icons'
import { toast } from '@/hooks/use-toast'

export function NotificationPreferences() {
  const { user, getUserSettings, updateUserSettings } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState({
    emailNotifications: true,
    inAppNotifications: true,
    weeklyDigest: true,
    newFeatures: true,
    securityAlerts: true,
    marketingEmails: false,
  })

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const userSettings = await getUserSettings()
        setSettings(userSettings.notifications)
      } catch (error) {
        console.error('Error loading notification settings:', error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load notification settings. Please try again.",
        })
      }
    }

    if (user) {
      loadSettings()
    }
  }, [user, getUserSettings])

  const handleSettingChange = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      const currentSettings = await getUserSettings()
      await updateUserSettings({
        ...currentSettings,
        notifications: settings,
      })
      toast({
        title: "Settings updated",
        description: "Your notification preferences have been updated successfully.",
      })
    } catch (error) {
      console.error('Error updating notification settings:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update notification settings. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Email Notifications</CardTitle>
            <CardDescription>
              Manage your email notification preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications via email
                </p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={() => handleSettingChange('emailNotifications')}
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Weekly Digest</Label>
                <p className="text-sm text-muted-foreground">
                  Get a weekly summary of your activity
                </p>
              </div>
              <Switch
                checked={settings.weeklyDigest}
                onCheckedChange={() => handleSettingChange('weeklyDigest')}
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>New Features</Label>
                <p className="text-sm text-muted-foreground">
                  Stay updated about new features
                </p>
              </div>
              <Switch
                checked={settings.newFeatures}
                onCheckedChange={() => handleSettingChange('newFeatures')}
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Security Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified about security-related events
                </p>
              </div>
              <Switch
                checked={settings.securityAlerts}
                onCheckedChange={() => handleSettingChange('securityAlerts')}
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Marketing Emails</Label>
                <p className="text-sm text-muted-foreground">
                  Receive promotional content and offers
                </p>
              </div>
              <Switch
                checked={settings.marketingEmails}
                onCheckedChange={() => handleSettingChange('marketingEmails')}
                disabled={isLoading}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>In-App Notifications</CardTitle>
            <CardDescription>
              Control your in-app notification preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>In-App Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications within the app
                </p>
              </div>
              <Switch
                checked={settings.inAppNotifications}
                onCheckedChange={() => handleSettingChange('inAppNotifications')}
                disabled={isLoading}
              />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" disabled={isLoading}>
          {isLoading && (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          )}
          Save Changes
        </Button>
      </div>
    </form>
  )
} 