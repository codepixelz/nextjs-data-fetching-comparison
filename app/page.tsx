import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { APPROACH_CONFIG } from '@/lib/cache-config'

export default function HomePage() {
  const approaches = [
    {
      id: '1-spa-client-side',
      ...APPROACH_CONFIG['spa-client'],
      color: 'border-border/50 hover:border-border',
      href: '/approaches/1-spa-client-side',
      status: 'ready',
    },
    {
      id: '2-hybrid-ssr-client',
      ...APPROACH_CONFIG['hybrid-ssr-client'],
      color: 'border-border/50 hover:border-border',
      href: '/approaches/2-hybrid-ssr-client',
      status: 'ready',
    },
    {
      id: '3-pure-ssr',
      ...APPROACH_CONFIG['pure-ssr'],
      color: 'border-border/50 hover:border-border',
      href: '/approaches/3-pure-ssr',
      status: 'ready',
    },
    {
      id: '4-tanstack-client',
      ...APPROACH_CONFIG['tanstack-client'],
      color: 'border-border/50 hover:border-border',
      href: '/approaches/4-tanstack-client',
      status: 'ready',
      isTanStack: true,
    },
    {
      id: '5-tanstack-prefetch-await',
      ...APPROACH_CONFIG['tanstack-prefetch-await'],
      color: 'border-border/50 hover:border-border',
      href: '/approaches/5-tanstack-prefetch-await',
      status: 'ready',
      isTanStack: true,
    },
    {
      id: '6-tanstack-prefetch-no-await',
      ...APPROACH_CONFIG['tanstack-prefetch-no-await'],
      color: 'border-border/50 hover:border-border',
      href: '/approaches/6-tanstack-prefetch-no-await',
      status: 'ready',
      isTanStack: true,
    },
  ]

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-6 py-12 max-w-7xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-5xl font-bold mb-4 tracking-tight">
            Next.js Data Fetching Comparison
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            A comprehensive comparison of data fetching approaches in Next.js 16 with React 19,
            TanStack Query, and modern caching strategies
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Badge variant="outline" className="text-sm">Next.js 16</Badge>
            <Badge variant="outline" className="text-sm">React 19</Badge>
            <Badge variant="outline" className="text-sm">TanStack Query v5</Badge>
            <Badge variant="outline" className="text-sm">TypeScript</Badge>
            <Badge variant="outline" className="text-sm">Tailwind CSS v4</Badge>
          </div>
        </div>

        {/* Overview Card */}
        <Card className="mb-8 border-2">
          <CardHeader>
            <CardTitle className="text-2xl">What is this project?</CardTitle>
            <CardDescription className="text-base">
              A hands-on exploration of modern data fetching patterns
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-relaxed">
              This application demonstrates <strong>6 different data fetching approaches</strong> with
              real-world examples, performance comparisons, and detailed explanations. Each approach
              shows trade-offs between SEO, performance, caching, and developer experience.
            </p>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="p-4 border border-border/50 rounded-lg">
                <div className="font-semibold mb-2">Learn</div>
                <div className="text-muted-foreground">
                  Understand when to use each pattern with real examples
                </div>
              </div>
              <div className="p-4 border border-border/50 rounded-lg">
                <div className="font-semibold mb-2">Compare</div>
                <div className="text-muted-foreground">
                  See performance metrics and cache behavior side-by-side
                </div>
              </div>
              <div className="p-4 border border-border/50 rounded-lg">
                <div className="font-semibold mb-2">Build</div>
                <div className="text-muted-foreground">
                  Use production-ready patterns in your own applications
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Approaches Grid */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-6">Explore the Approaches</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {approaches.map((approach) => (
              <Card
                key={approach.id}
                className={`${approach.color} hover:shadow-xl transition-all duration-200 relative overflow-hidden`}
              >
                {approach.status === 'coming-soon' && (
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-xl">{approach.name}</CardTitle>
                  <CardDescription className="text-sm">{approach.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground mb-2">
                      Cache Strategy:
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {approach.cacheStrategy}
                    </Badge>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {approach.usesNextjsCache && (
                      <Badge variant="secondary" className="text-xs">Next.js Cache</Badge>
                    )}
                    {approach.usesTanstackCache && (
                      <Badge variant="secondary" className="text-xs">TanStack Cache</Badge>
                    )}
                  </div>
                  {approach.status === 'ready' ? (
                    <Link href={approach.href}>
                      <Button className="w-full" variant="default">
                        View Example →
                      </Button>
                    </Link>
                  ) : (
                    <Button className="w-full" variant="outline" disabled>
                      Coming Soon
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Additional Features */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="border-border/50 hover:border-border transition-colors">
            <CardHeader>
              <CardTitle>React 19 'use' Hook Demo</CardTitle>
              <CardDescription>
                Explore the new <code>use</code> hook for promise unwrapping
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4 text-muted-foreground">
                See how React 19's <code>use</code> hook differs from traditional async/await
                patterns and integrates with Suspense.
              </p>
              <Link href="/use-hook-demo">
                <Button variant="default" className="w-full">
                  Explore 'use' Hook →
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-border/50 hover:border-border transition-colors">
            <CardHeader>
              <CardTitle>Server Actions & Revalidation</CardTitle>
              <CardDescription>
                Cache invalidation with revalidateTag and revalidatePath
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4 text-muted-foreground">
                Learn how Server Actions interact with Next.js cache and when to use different
                revalidation strategies.
              </p>
              <Link href="/server-actions-demo">
                <Button variant="default" className="w-full">
                  Explore Server Actions →
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Documentation */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Documentation & Guides</CardTitle>
            <CardDescription>Comprehensive guides for implementation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <Link href="/docs#cache-guide" className="p-4 border rounded-lg hover:bg-accent transition-colors block">
                <h3 className="font-semibold mb-2">Cache Strategy Guide</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Learn how to configure Next.js and TanStack Query caches without conflicts
                </p>
                <span className="text-sm text-primary">Read Guide →</span>
              </Link>
              <Link href="/docs#comparison" className="p-4 border rounded-lg hover:bg-accent transition-colors block">
                <h3 className="font-semibold mb-2">Approach Comparison</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Side-by-side comparison of all data fetching approaches
                </p>
                <span className="text-sm text-primary">View Comparison →</span>
              </Link>
              <Link href="/docs#decision-tree" className="p-4 border rounded-lg hover:bg-accent transition-colors block">
                <h3 className="font-semibold mb-2">Decision Tree</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Step-by-step guide to choosing the right approach
                </p>
                <span className="text-sm text-primary">View Decision Tree →</span>
              </Link>
              <Link href="/docs#metrics" className="p-4 border rounded-lg hover:bg-accent transition-colors block">
                <h3 className="font-semibold mb-2">Performance Metrics</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Web Vitals explained and performance expectations
                </p>
                <span className="text-sm text-primary">View Metrics →</span>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Key Insights */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-2xl">Key Insights & Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="p-4 bg-muted border-l-4 border-border rounded">
              <h4 className="font-semibold mb-2">⚠️ Combining Next.js & TanStack Query Caches</h4>
              <p className="text-muted-foreground">
                <strong>Generally avoid</strong> using both caches together for simplicity. When using
                TanStack Query with SSR, disable Next.js Data Cache with{' '}
                <code className="bg-background px-1 py-0.5 rounded border">cache: 'no-store'</code> to prevent
                conflicts and stale data issues.
              </p>
            </div>

            <div className="p-4 bg-muted border-l-4 border-border rounded">
              <h4 className="font-semibold mb-2">💡 When to Use Hybrid Architecture</h4>
              <p className="text-muted-foreground">
                Use <strong>70% SSR / 30% Client</strong> for e-commerce, news sites, or marketing
                pages where SEO matters but you need interactive features like filters or forms.
              </p>
            </div>

            <div className="p-4 bg-muted border-l-4 border-border rounded">
              <h4 className="font-semibold mb-2">🎯 Pure SSR for SEO-Critical Pages</h4>
              <p className="text-muted-foreground">
                Use <strong>Pure SSR (Approach 3)</strong> for blogs, documentation, and public
                content where SEO is critical and interactivity is minimal.
              </p>
            </div>

            <div className="p-4 bg-muted border-l-4 border-border rounded">
              <h4 className="font-semibold mb-2">🚀 TanStack Query for Complex Apps</h4>
              <p className="text-muted-foreground">
                Use <strong>TanStack Query (Approaches 4-6)</strong> for dashboards, admin panels, or
                apps with complex data management, optimistic updates, and real-time features.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            Built with Next.js 16, React 19, TanStack Query, TypeScript, and Tailwind CSS
          </p>
          <p className="mt-2">
            Explore the code on{' '}
            <a href="https://github.com/exx0dusss/nextjs-data-fetching-comparison" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
