'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/firebase/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Icons } from '@/components/icons'
import { toast } from '@/hooks/use-toast'

export function PrivacySettings() {
  const { user, getUserSettings, updateUserSettings } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState({
    shareData: false,
    showProfile: true,
    showActivity: true,
    allowAnalytics: true,
    allowCookies: true,
  })

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const userSettings = await getUserSettings()
        setSettings(userSettings.privacy)
      } catch (error) {
        console.error('Error loading privacy settings:', error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load privacy settings. Please try again.",
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
        privacy: settings,
      })
      toast({
        title: "Settings updated",
        description: "Your privacy settings have been updated successfully.",
      })
    } catch (error) {
      console.error('Error updating privacy settings:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update privacy settings. Please try again.",
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
            <CardTitle>Data Sharing</CardTitle>
            <CardDescription>
              Control how your data is shared and used
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Share Data for Research</Label>
                <p className="text-sm text-muted-foreground">
                  Allow your anonymized data to be used for research purposes
                </p>
              </div>
              <Switch
                checked={settings.shareData}
                onCheckedChange={() => handleSettingChange('shareData')}
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Allow Analytics</Label>
                <p className="text-sm text-muted-foreground">
                  Help us improve by sharing usage data
                </p>
              </div>
              <Switch
                checked={settings.allowAnalytics}
                onCheckedChange={() => handleSettingChange('allowAnalytics')}
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Allow Cookies</Label>
                <p className="text-sm text-muted-foreground">
                  Enable cookies for a better experience
                </p>
              </div>
              <Switch
                checked={settings.allowCookies}
                onCheckedChange={() => handleSettingChange('allowCookies')}
                disabled={isLoading}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profile Visibility</CardTitle>
            <CardDescription>
              Control who can see your profile and activity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Public Profile</Label>
                <p className="text-sm text-muted-foreground">
                  Allow others to view your profile
                </p>
              </div>
              <Switch
                checked={settings.showProfile}
                onCheckedChange={() => handleSettingChange('showProfile')}
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Activity</Label>
                <p className="text-sm text-muted-foreground">
                  Display your activity on your profile
                </p>
              </div>
              <Switch
                checked={settings.showActivity}
                onCheckedChange={() => handleSettingChange('showActivity')}
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