import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { ChevronDown, Key, LayoutDashboard, type LucideIcon, Menu, Settings, Shield, Users } from 'lucide-react';
import { Link, useLocation } from 'react-router';

interface NavItem {
  title: string;
  path: string;
  icon: LucideIcon;
}

interface NavGroup {
  title: string;
  icon: LucideIcon;
  defaultOpen?: boolean;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: 'RBAC',
    icon: Shield,
    defaultOpen: true,
    items: [
      { title: '用户管理', path: '/users', icon: Users },
      { title: '角色管理', path: '/roles', icon: Shield },
      { title: '权限管理', path: '/permissions', icon: Key },
      { title: '菜单管理', path: '/menus', icon: Menu },
    ],
  },
];

const topNavItems: NavItem[] = [{ title: '仪表盘', path: '/', icon: LayoutDashboard }];

const bottomNavItems: NavItem[] = [{ title: '系统设置', path: '/settings', icon: Settings }];

function NavMenu() {
  const location = useLocation();

  return (
    <SidebarMenu className="gap-3 [&>li]:py-0.5">
      {/* 顶部独立菜单 */}
      {topNavItems.map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;
        return (
          <SidebarMenuItem key={item.path}>
            <SidebarMenuButton
              asChild
              isActive={isActive}
              tooltip={item.title}
              size="lg"
              className="h-10 hover:bg-[#dbeafe]! hover:text-[#1e40af]! dark:hover:bg-[#1e3a8a]/60! dark:hover:text-[#93c5fd]!"
            >
              <Link to={item.path}>
                <Icon />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}

      {/* RBAC 嵌套菜单 */}
      {navGroups.map((group) => {
        const GroupIcon = group.icon;
        const hasActiveChild = group.items.some((item) => location.pathname === item.path);
        return (
          <Collapsible key={group.title} asChild defaultOpen={group.defaultOpen}>
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  tooltip={group.title}
                  isActive={hasActiveChild}
                  size="lg"
                  className="h-10 hover:!bg-[#dbeafe] hover:!text-[#1e40af] dark:hover:!bg-[#1e3a8a]/60 dark:hover:!text-[#93c5fd] [&[data-state=open]>svg:last-child]:rotate-180"
                >
                  <GroupIcon />
                  <span>{group.title}</span>
                  <ChevronDown className="ml-auto size-4 transition-transform" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {group.items.map((item) => {
                    const isActive = location.pathname === item.path;
                    const ItemIcon = item.icon;
                    return (
                      <SidebarMenuSubItem key={item.path}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={isActive}
                          className="h-8 hover:!bg-[#dbeafe] hover:!text-[#1e40af] dark:hover:!bg-[#1e3a8a]/60 dark:hover:!text-[#93c5fd]"
                        >
                          <Link to={item.path}>
                            <ItemIcon />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    );
                  })}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        );
      })}

      {/* 底部独立菜单 */}
      {bottomNavItems.map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;
        return (
          <SidebarMenuItem key={item.path}>
            <SidebarMenuButton
              asChild
              isActive={isActive}
              tooltip={item.title}
              size="lg"
              className="h-10 hover:!bg-[#dbeafe] hover:!text-[#1e40af] dark:hover:!bg-[#1e3a8a]/60 dark:hover:!text-[#93c5fd]"
            >
              <Link to={item.path}>
                <Icon />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader className="border-sidebar-border/60 border-b px-3 py-4 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:py-3">
        <Link to="/" className="flex items-center gap-2 px-2 py-2 group-data-[collapsible=icon]:justify-center">
          <div className="bg-sidebar-border/50 text-sidebar-foreground flex size-9 shrink-0 items-center justify-center rounded-md group-data-[collapsible=icon]:size-8">
            <LayoutDashboard className="size-4 group-data-[collapsible=icon]:size-4" />
          </div>
          <span className="text-sidebar-foreground text-sm font-medium group-data-[collapsible=icon]:hidden">
            Simple Admin
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="gap-1 px-3 py-5 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:py-4">
          <SidebarGroupLabel className="text-sidebar-foreground/60 mb-2 h-8 px-2 text-xs group-data-[collapsible=icon]:hidden">
            主导航
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <NavMenu />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-sidebar-border/60 border-t px-3 py-5 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:py-4">
        <p className="text-muted-foreground/80 px-2 text-xs group-data-[collapsible=icon]:hidden">
          NestJS Simple Admin
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
