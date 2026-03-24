import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Pencil, Trash2, AlertTriangle } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TableSkeleton } from '@/components/ui/table-skeleton'
import { api } from '@/lib/api'

const permissionSchema = z.object({
  name: z.string().min(1, '请输入权限名称').max(50, '权限名称不超过50字符'),
  code: z.string().min(1, '请输入权限编码').max(100, '权限编码不超过100字符'),
  type: z.string().min(1, '请选择类型'),
})

type PermissionFormValues = z.infer<typeof permissionSchema>

interface Permission {
  id: string
  name: string
  code: string
  type: string
}

const PERM_TYPES = [
  { value: 'menu', label: '菜单', variant: 'success' as const },
  { value: 'button', label: '按钮', variant: 'warning' as const },
  { value: 'api', label: '接口', variant: 'muted' as const },
]

const getPermBadgeVariant = (type: string) =>
  PERM_TYPES.find((t) => t.value === type)?.variant ?? 'outline'

export function Permissions() {
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<PermissionFormValues>({
    resolver: zodResolver(permissionSchema),
    defaultValues: { name: '', code: '', type: 'menu' },
  })

  const loadPermissions = () => {
    setLoading(true)
    api
      .get<{ data: Permission[] }>('/permissions')
      .then((res: { data: Permission[] }) => setPermissions(res.data ?? []))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadPermissions()
  }, [])

  const openCreate = () => {
    setEditingId(null)
    form.reset({ name: '', code: '', type: 'menu' })
    setDialogOpen(true)
  }

  const openEdit = (perm: Permission) => {
    setEditingId(perm.id)
    form.reset({ name: perm.name, code: perm.code, type: perm.type })
    setDialogOpen(true)
  }

  const handleSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true)
    try {
      if (editingId) {
        await api.put(`/permissions/${editingId}`, values)
      } else {
        await api.post('/permissions', values)
      }
      setDialogOpen(false)
      loadPermissions()
    } finally {
      setSubmitting(false)
    }
  })

  const handleDelete = async () => {
    if (!deleteId) return
    setSubmitting(true)
    try {
      await api.delete(`/permissions/${deleteId}`)
      setDeleteId(null)
      loadPermissions()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader title="权限管理" description="维护权限点与角色分配">
        <Button onClick={openCreate} size="sm">
          <Plus className="size-4" />
          新增
        </Button>
      </PageHeader>
      <Card className="shadow-sm">
        <CardContent className="relative p-0">
          {loading ? (
            <TableSkeleton rows={6} cols={4} />
          ) : (
            <Table className="[&_th]:px-6 [&_th]:py-4 [&_td]:px-6 [&_td]:py-4">
              <TableHeader>
                <TableRow>
                  <TableHead>权限名称</TableHead>
                  <TableHead>权限编码</TableHead>
                  <TableHead>类型</TableHead>
                  <TableHead className="w-[120px]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {permissions.map((perm) => (
                <TableRow key={perm.id}>
                  <TableCell className="font-medium">{perm.name}</TableCell>
                  <TableCell>{perm.code}</TableCell>
                  <TableCell>
                    <Badge variant={getPermBadgeVariant(perm.type)}>
                      {PERM_TYPES.find((t) => t.value === perm.type)?.label ?? perm.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon-sm" onClick={() => openEdit(perm)}>
                        <Pencil className="size-4" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => setDeleteId(perm.id)}>
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? '编辑权限' : '新增权限'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>权限名称</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入权限名称" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>权限编码</FormLabel>
                    <FormControl>
                      <Input placeholder="如 user:manage" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>类型</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="选择类型" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PERM_TYPES.map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter showCloseButton>
                <Button type="submit" disabled={submitting}>
                  {submitting ? '提交中...' : '确定'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia variant="destructive">
              <AlertTriangle />
            </AlertDialogMedia>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              删除后不可恢复，确定要删除该权限吗？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>取消</AlertDialogCancel>
            <Button variant="destructive" onClick={handleDelete} disabled={submitting}>
              {submitting ? '删除中...' : '删除'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
