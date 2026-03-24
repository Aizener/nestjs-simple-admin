import { AnimatePresence, motion } from 'motion/react'
import { Outlet, useLocation } from 'react-router'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { LayoutBreadcrumb } from './LayoutBreadcrumb'
import { AppSidebar } from './AppSidebar'
import { AppHeader } from './AppHeader'

export function MainLayout() {
  const location = useLocation()

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="relative md:ml-4 md:mt-4 md:mb-4 md:mr-4 md:rounded-2xl">
        <AppHeader />
        <div className="relative flex-1 overflow-auto p-6 md:p-8 lg:p-10">
          <LayoutBreadcrumb />
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="mt-6 min-h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
