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
import { Textarea } from '@/components/ui/textarea'
import { TableSkeleton } from '@/components/ui/table-skeleton'
import { api } from '@/lib/api'

const roleSchema = z.object({
  name: z.string().min(1, '请输入角色名称').max(50, '角色名称不超过50字符'),
  code: z.string().min(1, '请输入角色编码').max(50, '角色编码不超过50字符'),
  description: z.string().optional(),
})

type RoleFormValues = z.infer<typeof roleSchema>

interface Role {
  id: string
  name: string
  code: string
  description: string
}

export function Roles() {
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: { name: '', code: '', description: '' },
  })

  const loadRoles = () => {
    setLoading(true)
    api
      .get<{ data: Role[] }>('/roles')
      .then((res: { data: Role[] }) => setRoles(res.data ?? []))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadRoles()
  }, [])

  const openCreate = () => {
    setEditingId(null)
    form.reset({ name: '', code: '', description: '' })
    setDialogOpen(true)
  }

  const openEdit = (role: Role) => {
    setEditingId(role.id)
    form.reset({
      name: role.name,
      code: role.code,
      description: role.description ?? '',
    })
    setDialogOpen(true)
  }

  const handleSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true)
    try {
      if (editingId) {
        await api.put(`/roles/${editingId}`, values)
      } else {
        await api.post('/roles', values)
      }
      setDialogOpen(false)
      loadRoles()
    } finally {
      setSubmitting(false)
    }
  })

  const handleDelete = async () => {
    if (!deleteId) return
    setSubmitting(true)
    try {
      await api.delete(`/roles/${deleteId}`)
      setDeleteId(null)
      loadRoles()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader title="角色管理" description="管理系统角色与权限绑定">
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
                  <TableHead>角色名称</TableHead>
                  <TableHead>角色编码</TableHead>
                  <TableHead>描述</TableHead>
                  <TableHead className="w-[120px]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">{role.name}</TableCell>
                  <TableCell>{role.code}</TableCell>
                  <TableCell className="text-muted-foreground">{role.description || '-'}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon-sm" onClick={() => openEdit(role)}>
                        <Pencil className="size-4" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => setDeleteId(role.id)}>
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
            <DialogTitle>{editingId ? '编辑角色' : '新增角色'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>角色名称</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入角色名称" {...field} />
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
                    <FormLabel>角色编码</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入角色编码" {...field} disabled={!!editingId} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>描述</FormLabel>
                    <FormControl>
                      <Textarea placeholder="请输入描述（可选）" {...field} rows={3} />
                    </FormControl>
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
              删除后不可恢复，确定要删除该角色吗？
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
