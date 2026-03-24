import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { api } from '@/lib/api'

interface SettingsData {
  siteName: string
  logo: string
}

export function Settings() {
  const [settings, setSettings] = useState<SettingsData | null>(null)

  useEffect(() => {
    api.get<SettingsData>('/settings').then(setSettings)
  }, [])

  return (
    <div className="space-y-8">
      <PageHeader title="系统设置" description="全局配置与基础参数" />
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>基础配置</CardTitle>
          <CardDescription>站点名称、Logo 等基础参数</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-2">
            <Label htmlFor="siteName">站点名称</Label>
            <Input
              id="siteName"
              value={settings?.siteName ?? ''}
              readOnly
              className="max-w-md"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="logo">Logo 地址</Label>
            <Input id="logo" value={settings?.logo ?? ''} readOnly className="max-w-md" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
