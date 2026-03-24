import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router'
import { MainLayout } from '@/components/layout/MainLayout'
import { Spinner } from '@/components/ui/spinner'

const Dashboard = lazy(() => import('@/pages/Dashboard').then((m) => ({ default: m.Dashboard })))
const Users = lazy(() => import('@/pages/Users').then((m) => ({ default: m.Users })))
const Roles = lazy(() => import('@/pages/Roles').then((m) => ({ default: m.Roles })))
const Permissions = lazy(() =>
  import('@/pages/Permissions').then((m) => ({ default: m.Permissions }))
)
const Menus = lazy(() => import('@/pages/Menus').then((m) => ({ default: m.Menus })))
const Settings = lazy(() => import('@/pages/Settings').then((m) => ({ default: m.Settings })))

function PageFallback() {
  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <Spinner className="size-8 text-muted-foreground" />
    </div>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageFallback />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: 'users',
        element: (
          <Suspense fallback={<PageFallback />}>
            <Users />
          </Suspense>
        ),
      },
      {
        path: 'roles',
        element: (
          <Suspense fallback={<PageFallback />}>
            <Roles />
          </Suspense>
        ),
      },
      {
        path: 'permissions',
        element: (
          <Suspense fallback={<PageFallback />}>
            <Permissions />
          </Suspense>
        ),
      },
      {
        path: 'menus',
        element: (
          <Suspense fallback={<PageFallback />}>
            <Menus />
          </Suspense>
        ),
      },
      {
        path: 'settings',
        element: (
          <Suspense fallback={<PageFallback />}>
            <Settings />
          </Suspense>
        ),
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])
