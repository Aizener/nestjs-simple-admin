/**
 * Mock API - 模拟 RESTful 接口，后续可替换为真实后端
 */

// 模拟延迟
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

// 模拟数据（可变副本，用于增删改）
let mockUsers = [
  { id: '1', username: 'admin', nickname: '管理员', status: 1, createdAt: '2024-01-01' },
  { id: '2', username: 'user1', nickname: '用户一', status: 1, createdAt: '2024-01-02' },
  { id: '3', username: 'user2', nickname: '用户二', status: 0, createdAt: '2024-01-03' },
]

let mockRoles = [
  { id: '1', name: '超级管理员', code: 'super_admin', description: '拥有所有权限' },
  { id: '2', name: '普通用户', code: 'user', description: '基础权限' },
]

let mockPermissions = [
  { id: '1', name: '用户管理', code: 'user:manage', type: 'menu' },
  { id: '2', name: '角色管理', code: 'role:manage', type: 'menu' },
  { id: '3', name: '权限管理', code: 'permission:manage', type: 'menu' },
]

interface MockMenu {
  id: string
  title: string
  path: string
  icon: string
  parentId: string | null
  order: number
}
let mockMenus: MockMenu[] = [
  { id: '1', title: '仪表盘', path: '/', icon: 'LayoutDashboard', parentId: null, order: 0 },
  { id: '2', title: '用户管理', path: '/users', icon: 'Users', parentId: null, order: 1 },
  { id: '3', title: '角色管理', path: '/roles', icon: 'Shield', parentId: null, order: 2 },
  { id: '4', title: '权限管理', path: '/permissions', icon: 'Key', parentId: null, order: 3 },
  { id: '5', title: '菜单管理', path: '/menus', icon: 'Menu', parentId: null, order: 4 },
  { id: '6', title: '系统设置', path: '/settings', icon: 'Settings', parentId: null, order: 5 },
]

const genId = () => Date.now().toString(36) + Math.random().toString(36).slice(2)

const mockDashboard = {
  userCount: 128,
  roleCount: 6,
  permissionCount: 24,
  menuCount: 12,
}

// 拦截 fetch 并返回 mock 数据（开发环境）
export function setupMockApi() {
  const originalFetch = window.fetch

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input.toString()
    const method = (init?.method ?? 'GET') as string

    // 仅拦截 /api 开头的请求
    if (!url.includes('/api')) {
      return originalFetch(input, init)
    }

    await delay(200)

    const path = url.replace(/^.*\/api/, '').split('?')[0]

    // 用户相关
    if (path === '/users' && method === 'GET') {
      return jsonResponse({ data: mockUsers, total: mockUsers.length })
    }
    if (path.match(/^\/users\/[\w-]+$/) && method === 'GET') {
      const id = path.split('/')[2]
      const user = mockUsers.find((u) => u.id === id)
      return user ? jsonResponse(user) : jsonResponse({}, 404)
    }
    if (path === '/users' && method === 'POST') {
      const body = parseBody(init)
      const newUser = {
        id: genId(),
        username: String(body.username ?? ''),
        nickname: String(body.nickname ?? ''),
        status: Number(body.status ?? 1),
        createdAt: new Date().toISOString().slice(0, 10),
      }
      mockUsers.push(newUser)
      return jsonResponse(newUser)
    }
    if (path.match(/^\/users\/[\w-]+$/) && method === 'PUT') {
      const id = path.split('/')[2]
      const body = parseBody(init)
      const idx = mockUsers.findIndex((u) => u.id === id)
      if (idx === -1) return jsonResponse({}, 404)
      mockUsers[idx] = { ...mockUsers[idx], ...body }
      return jsonResponse(mockUsers[idx])
    }
    if (path.match(/^\/users\/[\w-]+$/) && method === 'DELETE') {
      const id = path.split('/')[2]
      const idx = mockUsers.findIndex((u) => u.id === id)
      if (idx === -1) return jsonResponse({}, 404)
      mockUsers.splice(idx, 1)
      return jsonResponse({ success: true })
    }

    // 角色相关
    if (path === '/roles' && method === 'GET') {
      return jsonResponse({ data: mockRoles, total: mockRoles.length })
    }
    if (path.match(/^\/roles\/[\w-]+$/) && method === 'GET') {
      const id = path.split('/')[2]
      const role = mockRoles.find((r) => r.id === id)
      return role ? jsonResponse(role) : jsonResponse({}, 404)
    }
    if (path === '/roles' && method === 'POST') {
      const body = parseBody(init)
      const newRole = {
        id: genId(),
        name: String(body.name ?? ''),
        code: String(body.code ?? ''),
        description: String(body.description ?? ''),
      }
      mockRoles.push(newRole)
      return jsonResponse(newRole)
    }
    if (path.match(/^\/roles\/[\w-]+$/) && method === 'PUT') {
      const id = path.split('/')[2]
      const body = parseBody(init)
      const idx = mockRoles.findIndex((r) => r.id === id)
      if (idx === -1) return jsonResponse({}, 404)
      mockRoles[idx] = { ...mockRoles[idx], ...body }
      return jsonResponse(mockRoles[idx])
    }
    if (path.match(/^\/roles\/[\w-]+$/) && method === 'DELETE') {
      const id = path.split('/')[2]
      const idx = mockRoles.findIndex((r) => r.id === id)
      if (idx === -1) return jsonResponse({}, 404)
      mockRoles.splice(idx, 1)
      return jsonResponse({ success: true })
    }

    // 权限相关
    if (path === '/permissions' && method === 'GET') {
      return jsonResponse({ data: mockPermissions, total: mockPermissions.length })
    }
    if (path.match(/^\/permissions\/[\w-]+$/) && method === 'GET') {
      const id = path.split('/')[2]
      const perm = mockPermissions.find((p) => p.id === id)
      return perm ? jsonResponse(perm) : jsonResponse({}, 404)
    }
    if (path === '/permissions' && method === 'POST') {
      const body = parseBody(init)
      const newPerm = {
        id: genId(),
        name: String(body.name ?? ''),
        code: String(body.code ?? ''),
        type: String(body.type ?? 'menu'),
      }
      mockPermissions.push(newPerm)
      return jsonResponse(newPerm)
    }
    if (path.match(/^\/permissions\/[\w-]+$/) && method === 'PUT') {
      const id = path.split('/')[2]
      const body = parseBody(init)
      const idx = mockPermissions.findIndex((p) => p.id === id)
      if (idx === -1) return jsonResponse({}, 404)
      mockPermissions[idx] = { ...mockPermissions[idx], ...body }
      return jsonResponse(mockPermissions[idx])
    }
    if (path.match(/^\/permissions\/[\w-]+$/) && method === 'DELETE') {
      const id = path.split('/')[2]
      const idx = mockPermissions.findIndex((p) => p.id === id)
      if (idx === -1) return jsonResponse({}, 404)
      mockPermissions.splice(idx, 1)
      return jsonResponse({ success: true })
    }

    // 菜单相关
    if (path === '/menus' && method === 'GET') {
      return jsonResponse({ data: mockMenus, total: mockMenus.length })
    }
    if (path.match(/^\/menus\/[\w-]+$/) && method === 'GET') {
      const id = path.split('/')[2]
      const menu = mockMenus.find((m) => m.id === id)
      return menu ? jsonResponse(menu) : jsonResponse({}, 404)
    }
    if (path === '/menus' && method === 'POST') {
      const body = parseBody(init)
      const newMenu = {
        id: genId(),
        title: String(body.title ?? ''),
        path: String(body.path ?? ''),
        icon: String(body.icon ?? 'Circle'),
        parentId: body.parentId != null && body.parentId !== 'null' ? String(body.parentId) : null,
        order: Number(body.order ?? 0),
      }
      mockMenus.push(newMenu)
      return jsonResponse(newMenu)
    }
    if (path.match(/^\/menus\/[\w-]+$/) && method === 'PUT') {
      const id = path.split('/')[2]
      const body = parseBody(init)
      const idx = mockMenus.findIndex((m) => m.id === id)
      if (idx === -1) return jsonResponse({}, 404)
      mockMenus[idx] = { ...mockMenus[idx], ...body }
      return jsonResponse(mockMenus[idx])
    }
    if (path.match(/^\/menus\/[\w-]+$/) && method === 'DELETE') {
      const id = path.split('/')[2]
      const idx = mockMenus.findIndex((m) => m.id === id)
      if (idx === -1) return jsonResponse({}, 404)
      mockMenus.splice(idx, 1)
      return jsonResponse({ success: true })
    }

    // 仪表盘
    if (path === '/dashboard/stats' && method === 'GET') {
      return jsonResponse(mockDashboard)
    }

    // 设置
    if (path === '/settings' && method === 'GET') {
      return jsonResponse({ siteName: 'NestJS Simple Admin', logo: '' })
    }

    return originalFetch(input, init)
  }
}

function parseBody(init?: RequestInit): Record<string, unknown> {
  if (!init?.body || typeof init.body !== 'string') return {}
  try {
    return JSON.parse(init.body) as Record<string, unknown>
  } catch {
    return {}
  }
}

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}
