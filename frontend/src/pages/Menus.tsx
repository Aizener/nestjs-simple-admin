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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TableSkeleton } from '@/components/ui/table-skeleton'
import { api } from '@/lib/api'

const menuSchema = z.object({
  title: z.string().min(1, '请输入菜单名称').max(50, '菜单名称不超过50字符'),
  path: z.string().min(1, '请输入路径').max(200, '路径不超过200字符'),
  icon: z.string().min(1, '请输入图标名').max(50, '图标名不超过50字符'),
  parentId: z.string().nullable(),
  order: z.coerce.number().int().min(0),
})

type MenuFormValues = z.infer<typeof menuSchema>

interface Menu {
  id: string
  title: string
  path: string
  icon: string
  parentId: string | null
  order: number
}

export function Menus() {
  const [menus, setMenus] = useState<Menu[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<MenuFormValues>({
    resolver: zodResolver(menuSchema),
    defaultValues: { title: '', path: '', icon: 'Circle', parentId: null, order: 0 },
  })

  const loadMenus = () => {
    setLoading(true)
    api
      .get<{ data: Menu[] }>('/menus')
      .then((res: { data: Menu[] }) => setMenus(res.data ?? []))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadMenus()
  }, [])

  const openCreate = () => {
    setEditingId(null)
    form.reset({ title: '', path: '', icon: 'Circle', parentId: null, order: 0 })
    setDialogOpen(true)
  }

  const openEdit = (menu: Menu) => {
    setEditingId(menu.id)
    form.reset({
      title: menu.title,
      path: menu.path,
      icon: menu.icon,
      parentId: menu.parentId,
      order: menu.order,
    })
    setDialogOpen(true)
  }

  const handleSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true)
    try {
      const payload = {
        ...values,
        parentId: values.parentId || null,
      }
      if (editingId) {
        await api.put(`/menus/${editingId}`, payload)
      } else {
        await api.post('/menus', payload)
      }
      setDialogOpen(false)
      loadMenus()
    } finally {
      setSubmitting(false)
    }
  })

  const handleDelete = async () => {
    if (!deleteId) return
    setSubmitting(true)
    try {
      await api.delete(`/menus/${deleteId}`)
      setDeleteId(null)
      loadMenus()
    } finally {
      setSubmitting(false)
    }
  }

  const parentOptions = menus.filter((m) => !m.parentId)

  return (
    <div className="space-y-8">
      <PageHeader title="菜单管理" description="配置系统菜单结构">
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
                  <TableHead>菜单名称</TableHead>
                  <TableHead>路径</TableHead>
                  <TableHead>图标</TableHead>
                  <TableHead>排序</TableHead>
                  <TableHead className="w-[120px]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {menus.map((menu) => (
                <TableRow key={menu.id}>
                  <TableCell className="font-medium">{menu.title}</TableCell>
                  <TableCell>{menu.path}</TableCell>
                  <TableCell className="text-muted-foreground">{menu.icon}</TableCell>
                  <TableCell>{menu.order}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon-sm" onClick={() => openEdit(menu)}>
                        <Pencil className="size-4" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => setDeleteId(menu.id)}>
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
            <DialogTitle>{editingId ? '编辑菜单' : '新增菜单'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>菜单名称</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入菜单名称" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="path"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>路径</FormLabel>
                    <FormControl>
                      <Input placeholder="如 /users" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>图标</FormLabel>
                    <FormControl>
                      <Input placeholder="Lucide 图标名，如 Users" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="parentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>父菜单</FormLabel>
                    <Select
                      onValueChange={(v) => field.onChange(v === 'null' ? null : v)}
                      value={field.value ?? 'null'}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="无（顶级）" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="null">无（顶级菜单）</SelectItem>
                        {parentOptions.map((m) => (
                          <SelectItem key={m.id} value={m.id}>
                            {m.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>排序</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} {...field} />
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
              删除后不可恢复，确定要删除该菜单吗？
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
