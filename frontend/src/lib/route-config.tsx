import type { BreadcrumbItemType } from '@/components/layout/PageHeader'

export const routeBreadcrumbsMap: Record<string, BreadcrumbItemType[]> = {
  '/': [{ label: '首页', href: '/' }, { label: '仪表盘' }],
  '/users': [{ label: '首页', href: '/' }, { label: '用户管理' }],
  '/roles': [{ label: '首页', href: '/' }, { label: '角色管理' }],
  '/permissions': [{ label: '首页', href: '/' }, { label: '权限管理' }],
  '/menus': [{ label: '首页', href: '/' }, { label: '菜单管理' }],
  '/settings': [{ label: '首页', href: '/' }, { label: '系统设置' }],
}

export function getRouteBreadcrumbs(pathname: string): BreadcrumbItemType[] | undefined {
  const normalized = pathname.replace(/\/$/, '') || '/'
  return routeBreadcrumbsMap[pathname] ?? routeBreadcrumbsMap[normalized]
}
