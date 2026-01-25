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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { APPROACH_CONFIG } from '@/lib/cache-config'
import { Menu } from 'lucide-react'

const approachPaths: Record<string, keyof typeof APPROACH_CONFIG> = {
  '/approaches/1-spa-client-side': 'spa-client',
  '/approaches/2-hybrid-ssr-client': 'hybrid-ssr-client',
  '/approaches/3-pure-ssr': 'pure-ssr',
  '/approaches/4-tanstack-client': 'tanstack-client',
  '/approaches/5-tanstack-prefetch-await': 'tanstack-prefetch-await',
  '/approaches/6-tanstack-prefetch-no-await': 'tanstack-prefetch-no-await',
}

const navLinks = [
  { label: 'Docs', href: '/docs#official-docs' },
  { label: 'Waterfalls', href: '/docs#waterfalls' },
  { label: 'Compare', href: '/docs#comparison' },
  { label: 'SEO', href: '/docs#seo-guide' },
  { label: 'Cache', href: '/docs#cache-guide' },
]

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
    <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center gap-2 border-b px-4 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />

      {/* Breadcrumb - truncated on mobile */}
      <Breadcrumb className="flex-1 min-w-0">
        <BreadcrumbList className="flex-nowrap">
          {breadcrumbs.length > 2 ? (
            // Mobile: show only Home > Current
            <>
              <BreadcrumbItem className="hidden sm:inline-flex">
                <BreadcrumbLink asChild>
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden sm:inline-flex" />
              <BreadcrumbItem>
                <BreadcrumbPage className="truncate max-w-[120px] sm:max-w-none">
                  {breadcrumbs[breadcrumbs.length - 1].label}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </>
          ) : (
            breadcrumbs.map((crumb, index) => (
              <span key={`${crumb.href}-${index}`} className="contents">
                <BreadcrumbItem>
                  {index === breadcrumbs.length - 1 ? (
                    <BreadcrumbPage className="truncate max-w-[120px] sm:max-w-none">{crumb.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={crumb.href}>{crumb.label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
              </span>
            ))
          )}
        </BreadcrumbList>
      </Breadcrumb>

      {/* Desktop navigation links */}
      <div className="hidden md:flex items-center gap-1">
        {navLinks.map((link) => (
          <Button key={link.href} variant="ghost" size="sm" asChild>
            <Link href={link.href}>{link.label}</Link>
          </Button>
        ))}
      </div>

      {/* Mobile menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Menu className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {navLinks.map((link) => (
            <DropdownMenuItem key={link.href} asChild>
              <Link href={link.href}>{link.label}</Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
