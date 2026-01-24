'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { APPROACH_CONFIG } from '@/lib/cache-config'

const approachPaths: Record<string, keyof typeof APPROACH_CONFIG> = {
  '/approaches/1-spa-client-side': 'spa-client',
  '/approaches/2-hybrid-ssr-client': 'hybrid-ssr-client',
  '/approaches/3-pure-ssr': 'pure-ssr',
  '/approaches/4-tanstack-client': 'tanstack-client',
  '/approaches/5-tanstack-prefetch-await': 'tanstack-prefetch-await',
  '/approaches/6-tanstack-prefetch-no-await': 'tanstack-prefetch-no-await',
}

export function AppHeader() {
  const pathname = usePathname()

  const getBreadcrumbs = () => {
    if (pathname === '/') {
      return [{ label: 'Home', href: '/' }]
    }
    if (pathname === '/docs') {
      return [
        { label: 'Home', href: '/' },
        { label: 'Documentation', href: '/docs' },
      ]
    }
    if (pathname.startsWith('/approaches/')) {
      const approachKey = approachPaths[pathname]
      const approachName = approachKey ? APPROACH_CONFIG[approachKey].name : 'Unknown'
      return [
        { label: 'Home', href: '/' },
        { label: 'Approaches', href: '/' },
        { label: approachName, href: pathname },
      ]
    }
    return [{ label: 'Home', href: '/' }]
  }

  const breadcrumbs = getBreadcrumbs()

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />

      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((crumb, index) => (
            <BreadcrumbItem key={crumb.href}>
              {index === breadcrumbs.length - 1 ? (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              ) : (
                <>
                  <BreadcrumbLink asChild>
                    <Link href={crumb.href}>{crumb.label}</Link>
                  </BreadcrumbLink>
                  <BreadcrumbSeparator />
                </>
              )}
            </BreadcrumbItem>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="ml-auto flex items-center gap-2">
        <div className="hidden md:flex items-center gap-1">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/docs#official-docs">Docs</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/docs#comparison">Compare</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/docs#seo-guide">SEO</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/docs#cache-guide">Cache</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
