'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from '@/components/ui/sidebar'
import {
  Home,
  BookOpen,
  Zap,
  Server,
  Database,
  Layers,
  RefreshCw,
  FileText,
  BarChart3,
  Settings,
  ExternalLink,
  Github,
  Activity,
  Sparkles,
  PlayCircle,
} from 'lucide-react'
import { APPROACH_CONFIG } from '@/lib/cache-config'

const approachIcons: Record<string, React.ReactNode> = {
  'spa-client': <Zap className="w-4 h-4" />,
  'hybrid-ssr-client': <Layers className="w-4 h-4" />,
  'pure-ssr': <Server className="w-4 h-4" />,
  'tanstack-client': <Database className="w-4 h-4" />,
  'tanstack-prefetch-await': <RefreshCw className="w-4 h-4" />,
  'tanstack-prefetch-no-await': <RefreshCw className="w-4 h-4" />,
}

const approaches = [
  { key: 'spa-client' as const, href: '/approaches/1-spa-client-side' },
  { key: 'hybrid-ssr-client' as const, href: '/approaches/2-hybrid-ssr-client' },
  { key: 'pure-ssr' as const, href: '/approaches/3-pure-ssr' },
  { key: 'tanstack-client' as const, href: '/approaches/4-tanstack-client' },
  { key: 'tanstack-prefetch-await' as const, href: '/approaches/5-tanstack-prefetch-await' },
  { key: 'tanstack-prefetch-no-await' as const, href: '/approaches/6-tanstack-prefetch-no-await' },
]

const docsNavigation = [
  { label: 'Official Docs', href: '/docs#official-docs', icon: <ExternalLink className="w-4 h-4" /> },
  { label: 'Request Waterfalls', href: '/docs#waterfalls', icon: <Activity className="w-4 h-4" /> },
  { label: 'Comparison Table', href: '/docs#comparison', icon: <BarChart3 className="w-4 h-4" /> },
  { label: 'SEO & Crawlers', href: '/docs#seo-guide', icon: <FileText className="w-4 h-4" /> },
  { label: 'Cache Strategy', href: '/docs#cache-guide', icon: <Database className="w-4 h-4" /> },
  { label: 'Decision Tree', href: '/docs#decision-tree', icon: <Settings className="w-4 h-4" /> },
  { label: 'Performance Metrics', href: '/docs#metrics', icon: <BarChart3 className="w-4 h-4" /> },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-border/50 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Zap className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm">Data Fetching</span>
            <span className="text-xs text-muted-foreground">Next.js Comparison</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === '/'}>
                  <Link href="/">
                    <Home className="w-4 h-4" />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === '/docs' || pathname.startsWith('/docs#')}>
                  <Link href="/docs">
                    <BookOpen className="w-4 h-4" />
                    <span>Documentation</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* React 19 Features */}
        <SidebarGroup>
          <SidebarGroupLabel>React 19</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === '/use-hook-demo'}>
                  <Link href="/use-hook-demo">
                    <Sparkles className="w-4 h-4" />
                    <span>use() Hook</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Next.js Features */}
        <SidebarGroup>
          <SidebarGroupLabel>Next.js</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === '/server-actions-demo'}>
                  <Link href="/server-actions-demo">
                    <PlayCircle className="w-4 h-4" />
                    <span>Server Actions</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Approaches */}
        <SidebarGroup>
          <SidebarGroupLabel>Data Fetching Approaches</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {approaches.map((approach, index) => (
                <SidebarMenuItem key={approach.key}>
                  <SidebarMenuButton asChild isActive={pathname === approach.href}>
                    <Link href={approach.href}>
                      {approachIcons[approach.key]}
                      <span className="truncate">
                        {index + 1}. {APPROACH_CONFIG[approach.key].name}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Documentation Sections */}
        <SidebarGroup>
          <SidebarGroupLabel>Documentation Sections</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {docsNavigation.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname + (typeof window !== 'undefined' ? window.location.hash : '') === item.href}>
                    <Link href={item.href}>
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/50 p-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Next.js 16 + React 19</span>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
