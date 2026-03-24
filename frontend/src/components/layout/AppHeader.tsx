import { Moon, Sun, LogOut, ChevronDown } from 'lucide-react'
import {
  SidebarTrigger,
  SidebarRail,
} from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAuthStore } from '@/stores/useAuthStore'
import { useTheme } from '@/hooks/useTheme'

export function AppHeader() {
  const { user, logout } = useAuthStore()
  const { setTheme, resolvedTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b px-6">
      <SidebarTrigger className="-ml-1" />
      <SidebarRail />
      <div className="flex flex-1 items-center justify-end gap-2">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={toggleTheme}
          aria-label="切换主题"
          className="relative"
        >
          <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              <Avatar size="sm">
                <AvatarFallback className="text-xs">
                  {user?.nickname?.slice(0, 1) ?? 'A'}
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-sm md:inline">{user?.nickname ?? '用户'}</span>
              <ChevronDown className="size-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{user?.nickname}</span>
                <span className="text-xs font-normal text-muted-foreground">{user?.username}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={toggleTheme}>
              {resolvedTheme === 'dark' ? (
                <>
                  <Sun className="mr-2 size-4" />
                  浅色模式
                </>
              ) : (
                <>
                  <Moon className="mr-2 size-4" />
                  深色模式
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={logout}>
              <LogOut className="mr-2 size-4" />
              退出登录
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
