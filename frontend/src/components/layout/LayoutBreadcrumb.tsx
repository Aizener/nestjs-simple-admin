import { Link } from 'react-router'
import { useLocation } from 'react-router'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { getRouteBreadcrumbs } from '@/lib/route-config'

export function LayoutBreadcrumb() {
  const location = useLocation()
  const breadcrumbs = getRouteBreadcrumbs(location.pathname)

  if (!breadcrumbs?.length) return null

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.flatMap((item, i) => {
          const node = (
            <BreadcrumbItem key={i}>
              {i < breadcrumbs!.length - 1 && item.href ? (
                <BreadcrumbLink asChild>
                  <Link to={item.href}>{item.label}</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          )
          const sep = i < breadcrumbs!.length - 1 ? <BreadcrumbSeparator key={`s-${i}`} /> : null
          return sep ? [node, sep] : [node]
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
