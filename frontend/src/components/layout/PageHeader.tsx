import { cn } from '@/lib/utils'

export interface BreadcrumbItemType {
  label: string
  href?: string
}

interface PageHeaderProps {
  title: string
  description?: string
  className?: string
  children?: React.ReactNode
}

export function PageHeader({ title, description, className, children }: PageHeaderProps) {
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {description && <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{description}</p>}
        </div>
        {children}
      </div>
    </div>
  )
}
