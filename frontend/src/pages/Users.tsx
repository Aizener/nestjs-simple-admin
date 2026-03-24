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

const userSchema = z.object({
  username: z.string().min(1, '请输入用户名').max(50, '用户名不超过50字符'),
  nickname: z.string().min(1, '请输入昵称').max(50, '昵称不超过50字符'),
  status: z.union([z.literal(1), z.literal(0)]),
})

type UserFormValues = z.infer<typeof userSchema>

interface User {
  id: string
  username: string
  nickname: string
  status: number
  createdAt: string
}

export function Users() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: { username: '', nickname: '', status: 1 },
  })

  const loadUsers = () => {
    setLoading(true)
    api
      .get<{ data: User[] }>('/users')
      .then((res: { data: User[] }) => setUsers(res.data ?? []))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const openCreate = () => {
    setEditingId(null)
    form.reset({ username: '', nickname: '', status: 1 })
    setDialogOpen(true)
  }

  const openEdit = (user: User) => {
    setEditingId(user.id)
    form.reset({ username: user.username, nickname: user.nickname, status: user.status as 0 | 1 })
    setDialogOpen(true)
  }

  const handleSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true)
    try {
      if (editingId) {
        await api.put(`/users/${editingId}`, values)
      } else {
        await api.post('/users', values)
      }
      setDialogOpen(false)
      loadUsers()
    } finally {
      setSubmitting(false)
    }
  })

  const handleDelete = async () => {
    if (!deleteId) return
    setSubmitting(true)
    try {
      await api.delete(`/users/${deleteId}`)
      setDeleteId(null)
      loadUsers()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader title="用户管理" description="管理系统用户账号">
        <Button onClick={openCreate} size="sm">
          <Plus className="size-4" />
          新增
        </Button>
      </PageHeader>
      <Card className="shadow-sm">
        <CardContent className="relative p-0">
          {loading ? (
            <TableSkeleton rows={6} cols={5} />
          ) : (
            <Table className="[&_th]:px-6 [&_th]:py-4 [&_td]:px-6 [&_td]:py-4">
              <TableHeader>
                <TableRow>
                  <TableHead>用户名</TableHead>
                  <TableHead>昵称</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead className="w-[120px]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>{user.nickname}</TableCell>
                  <TableCell>
                    <Badge variant={user.status === 1 ? 'success' : 'muted'}>
                      {user.status === 1 ? '正常' : '禁用'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{user.createdAt}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon-sm" onClick={() => openEdit(user)}>
                        <Pencil className="size-4" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => setDeleteId(user.id)}>
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
            <DialogTitle>{editingId ? '编辑用户' : '新增用户'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>用户名</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入用户名" {...field} disabled={!!editingId} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nickname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>昵称</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入昵称" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>状态</FormLabel>
                    <Select
                      onValueChange={(v) => field.onChange(Number(v))}
                      value={String(field.value)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="选择状态" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">正常</SelectItem>
                        <SelectItem value="0">禁用</SelectItem>
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
              删除后不可恢复，确定要删除该用户吗？
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
