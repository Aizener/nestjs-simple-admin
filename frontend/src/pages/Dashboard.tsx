import { useEffect, useState } from 'react'
import { Users, Shield, Key, Menu } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/lib/api'

interface Stats {
  userCount: number
  roleCount: number
  permissionCount: number
  menuCount: number
}

const statCards = [
  { key: 'userCount', label: '用户数', icon: Users, color: 'text-blue-600' },
  { key: 'roleCount', label: '角色数', icon: Shield, color: 'text-emerald-600' },
  { key: 'permissionCount', label: '权限数', icon: Key, color: 'text-amber-600' },
  { key: 'menuCount', label: '菜单数', icon: Menu, color: 'text-violet-600' },
] as const

export function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api
      .get<Stats>('/dashboard/stats')
      .then(setStats)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-8">
      <PageHeader title="仪表盘" description="系统概览与数据统计" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          statCards.map(({ key }) => (
            <Card key={key} className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-3 pt-5">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="size-4 rounded" />
              </CardHeader>
              <CardContent className="pb-5">
                <Skeleton className="h-9 w-12" />
              </CardContent>
            </Card>
          ))
        ) : (
          statCards.map(({ key, label, icon: Icon, color }) => (
          <Card key={key} className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3 pt-5">
              <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
              <Icon className={`size-4 ${color}`} />
            </CardHeader>
            <CardContent className="pb-5">
              <div className="text-3xl font-bold tracking-tight">{stats?.[key] ?? '—'}</div>
            </CardContent>
          </Card>
        ))
        )}
      </div>
    </div>
  )
}
