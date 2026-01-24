import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { APPROACH_CONFIG } from '@/lib/cache-config'

export const metadata = {
  title: 'Documentation - Next.js Data Fetching Comparison',
  description: 'Comprehensive guides for data fetching approaches, cache strategies, and performance optimization in Next.js',
}

const approaches = [
  {
    key: 'spa-client' as const,
    href: '/approaches/1-spa-client-side',
    seo: 'None',
    ssr: false,
    streaming: false,
    cacheType: 'Browser only',
    bestFor: 'Admin panels, internal tools',
    complexity: 'Low',
  },
  {
    key: 'hybrid-ssr-client' as const,
    href: '/approaches/2-hybrid-ssr-client',
    seo: 'Partial',
    ssr: true,
    streaming: false,
    cacheType: 'None (demo)',
    bestFor: 'E-commerce, marketing sites',
    complexity: 'Medium',
  },
  {
    key: 'pure-ssr' as const,
    href: '/approaches/3-pure-ssr',
    seo: 'Excellent',
    ssr: true,
    streaming: true,
    cacheType: 'Next.js Data Cache',
    bestFor: 'Blogs, documentation, news',
    complexity: 'Medium',
  },
  {
    key: 'tanstack-client' as const,
    href: '/approaches/4-tanstack-client',
    seo: 'None',
    ssr: false,
    streaming: false,
    cacheType: 'TanStack Query',
    bestFor: 'Dashboards, real-time apps',
    complexity: 'Medium',
  },
  {
    key: 'tanstack-prefetch-await' as const,
    href: '/approaches/5-tanstack-prefetch-await',
    seo: 'Excellent',
    ssr: true,
    streaming: false,
    cacheType: 'TanStack Query',
    bestFor: 'Data-heavy apps with SEO needs',
    complexity: 'High',
  },
  {
    key: 'tanstack-prefetch-no-await' as const,
    href: '/approaches/6-tanstack-prefetch-no-await',
    seo: 'Excellent',
    ssr: true,
    streaming: true,
    cacheType: 'TanStack Query',
    bestFor: 'Best of both worlds',
    complexity: 'High',
  },
]

export default function DocsPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-6 py-12 max-w-7xl">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-4">Documentation & Guides</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Everything you need to understand data fetching patterns in Next.js 16 with React 19
          </p>
        </div>

        {/* Quick Navigation */}
        <div className="flex gap-2 flex-wrap mb-12">
          <Button variant="outline" asChild>
            <a href="#comparison">Comparison Table</a>
          </Button>
          <Button variant="outline" asChild>
            <a href="#seo-guide">SEO & Crawlers</a>
          </Button>
          <Button variant="outline" asChild>
            <a href="#cache-guide">Cache Strategy Guide</a>
          </Button>
          <Button variant="outline" asChild>
            <a href="#decision-tree">Decision Tree</a>
          </Button>
          <Button variant="outline" asChild>
            <a href="#metrics">Performance Metrics</a>
          </Button>
        </div>

        {/* Approach Comparison Table */}
        <section id="comparison" className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Approach Comparison</h2>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-4 font-semibold">Approach</th>
                      <th className="text-left p-4 font-semibold">SEO</th>
                      <th className="text-left p-4 font-semibold">SSR</th>
                      <th className="text-left p-4 font-semibold">Streaming</th>
                      <th className="text-left p-4 font-semibold">Cache</th>
                      <th className="text-left p-4 font-semibold">Best For</th>
                      <th className="text-left p-4 font-semibold">Complexity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {approaches.map((approach) => (
                      <tr key={approach.key} className="border-b hover:bg-muted/30 transition-colors">
                        <td className="p-4">
                          <Link href={approach.href} className="font-medium hover:underline text-primary">
                            {APPROACH_CONFIG[approach.key].name}
                          </Link>
                        </td>
                        <td className="p-4">
                          <Badge variant={approach.seo === 'Excellent' ? 'default' : approach.seo === 'None' ? 'secondary' : 'outline'}>
                            {approach.seo}
                          </Badge>
                        </td>
                        <td className="p-4">{approach.ssr ? '✓' : '✗'}</td>
                        <td className="p-4">{approach.streaming ? '✓' : '✗'}</td>
                        <td className="p-4 text-muted-foreground">{approach.cacheType}</td>
                        <td className="p-4 text-muted-foreground">{approach.bestFor}</td>
                        <td className="p-4">
                          <Badge variant={approach.complexity === 'Low' ? 'secondary' : approach.complexity === 'High' ? 'outline' : 'default'}>
                            {approach.complexity}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* SEO & Crawler Capabilities */}
        <section id="seo-guide" className="mb-16">
          <h2 className="text-3xl font-bold mb-6">SEO & Crawler Capabilities</h2>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>How Modern Crawlers Work</CardTitle>
                <CardDescription>Understanding Googlebot and other search engine crawlers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Modern search engine crawlers have evolved significantly. Googlebot uses a headless Chromium browser
                  that executes JavaScript, waits for content to render, and indexes the final DOM state.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Googlebot (Google)</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Evergreen Chromium (latest version)</li>
                      <li>• Full JavaScript execution</li>
                      <li>• Waits for network idle</li>
                      <li>• Renders streaming HTML</li>
                      <li>• Handles Suspense boundaries</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Bingbot (Microsoft)</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Chromium-based rendering</li>
                      <li>• JavaScript execution support</li>
                      <li>• Similar capabilities to Googlebot</li>
                      <li>• May have slight delays</li>
                    </ul>
                  </div>
                </div>
                <div className="p-3 bg-muted rounded-lg text-sm">
                  <strong>Key insight:</strong> For SSR approaches (3, 5, 6), SEO outcome is essentially identical
                  because crawlers wait for and render the complete content regardless of streaming.
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>The Two-Phase Indexing Process</CardTitle>
                <CardDescription>How Google discovers and renders your pages</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">1</div>
                    <div>
                      <h4 className="font-semibold">Crawl & Initial Parse</h4>
                      <p className="text-sm text-muted-foreground">
                        Googlebot fetches your HTML and parses the initial response. For SSR pages, this includes
                        server-rendered content. For CSR pages, this is just the shell.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">2</div>
                    <div>
                      <h4 className="font-semibold">Render Queue</h4>
                      <p className="text-sm text-muted-foreground">
                        Pages requiring JavaScript are added to a render queue. Google renders when resources allow,
                        which can take seconds to days depending on crawl budget.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">3</div>
                    <div>
                      <h4 className="font-semibold">Full Render & Index</h4>
                      <p className="text-sm text-muted-foreground">
                        Googlebot executes JavaScript, waits for content (including streamed chunks), and indexes
                        the final rendered DOM.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle>Edge Cases & Potential Issues</CardTitle>
                <CardDescription>When SEO might be affected</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold text-destructive">Render Timeout (10 seconds)</h4>
                    <p className="text-sm text-muted-foreground">
                      Googlebot has a ~10 second timeout for JavaScript execution. If your data fetching
                      takes longer, content may not be indexed. This affects all approaches equally.
                    </p>
                    <p className="text-sm mt-2"><strong>Mitigation:</strong> Keep API responses under 5 seconds, use timeouts, show fallback content.</p>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold text-destructive">Blocked Resources</h4>
                    <p className="text-sm text-muted-foreground">
                      If robots.txt blocks JavaScript files, CSS, or API endpoints, Googlebot cannot render
                      your page correctly.
                    </p>
                    <p className="text-sm mt-2"><strong>Mitigation:</strong> Use Google Search Console&apos;s URL Inspection tool to verify rendering.</p>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold text-destructive">Crawl Budget Exhaustion</h4>
                    <p className="text-sm text-muted-foreground">
                      Large sites may have pages that aren&apos;t rendered due to crawl budget limits. SSR pages
                      with content in initial HTML have an advantage here.
                    </p>
                    <p className="text-sm mt-2"><strong>Mitigation:</strong> Prioritize important pages, use SSR for critical content.</p>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold text-destructive">Social Media Crawlers</h4>
                    <p className="text-sm text-muted-foreground">
                      Unlike Googlebot, social media crawlers (Facebook, Twitter, LinkedIn) do NOT execute JavaScript.
                      They only see the initial HTML response.
                    </p>
                    <p className="text-sm mt-2"><strong>Mitigation:</strong> Always use SSR for pages shared on social media, or use meta tags in the initial HTML.</p>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold text-destructive">Other Search Engines</h4>
                    <p className="text-sm text-muted-foreground">
                      Some search engines (DuckDuckGo uses Bing, Yandex, Baidu) may have different JavaScript
                      rendering capabilities or delays.
                    </p>
                    <p className="text-sm mt-2"><strong>Mitigation:</strong> If targeting these markets, prefer SSR approaches.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SEO Comparison Summary</CardTitle>
                <CardDescription>What really matters for search engine optimization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left p-3 font-semibold">Approach</th>
                        <th className="text-left p-3 font-semibold">Google</th>
                        <th className="text-left p-3 font-semibold">Social Crawlers</th>
                        <th className="text-left p-3 font-semibold">Initial HTML</th>
                        <th className="text-left p-3 font-semibold">Render Queue</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-3">Pure SPA (1, 4)</td>
                        <td className="p-3 text-yellow-500">Delayed</td>
                        <td className="p-3 text-red-500">No content</td>
                        <td className="p-3 text-muted-foreground">Shell only</td>
                        <td className="p-3 text-muted-foreground">Required</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3">Hybrid (2)</td>
                        <td className="p-3 text-green-500">Good</td>
                        <td className="p-3 text-yellow-500">Partial</td>
                        <td className="p-3 text-muted-foreground">SSR content</td>
                        <td className="p-3 text-muted-foreground">For client parts</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3">Pure SSR (3)</td>
                        <td className="p-3 text-green-500">Excellent</td>
                        <td className="p-3 text-green-500">Full content</td>
                        <td className="p-3 text-muted-foreground">Complete</td>
                        <td className="p-3 text-muted-foreground">Not needed</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3">TanStack Await (5)</td>
                        <td className="p-3 text-green-500">Excellent</td>
                        <td className="p-3 text-green-500">Full content</td>
                        <td className="p-3 text-muted-foreground">Complete</td>
                        <td className="p-3 text-muted-foreground">Not needed</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3">TanStack Stream (6)</td>
                        <td className="p-3 text-green-500">Excellent</td>
                        <td className="p-3 text-green-500">Full content*</td>
                        <td className="p-3 text-muted-foreground">Streamed</td>
                        <td className="p-3 text-muted-foreground">Not needed</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  * Social crawlers receive the complete streamed response, but may not wait for all chunks.
                  Test with Facebook Sharing Debugger and Twitter Card Validator.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-muted">
              <CardHeader>
                <CardTitle>Best Practices</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Use SSR (approaches 2, 3, 5, 6) for public, SEO-critical pages</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Always include meta tags (title, description, og:*) in the initial HTML head</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Keep data fetching under 5 seconds to avoid timeout issues</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Test with Google Search Console URL Inspection and Rich Results Test</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Test social sharing with Facebook Debugger and Twitter Card Validator</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Use structured data (JSON-LD) for rich snippets - works with all approaches</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-yellow-500">!</span>
                    <span>Client-only approaches (1, 4) are fine for authenticated/private content</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Cache Strategy Guide */}
        <section id="cache-guide" className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Cache Strategy Guide</h2>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Next.js Data Cache</CardTitle>
                <CardDescription>Server-side caching for fetch requests</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Next.js automatically caches fetch requests on the server. This is ideal for static or semi-static content
                  that doesn&apos;t change frequently.
                </p>
                <div className="bg-muted p-4 rounded-md">
                  <pre className="text-sm overflow-x-auto">{`// Cached for 60 seconds
const response = await fetch(url, {
  next: { revalidate: 60 }
})

// Tagged for granular invalidation
const response = await fetch(url, {
  next: { tags: ['products'] }
})

// Invalidate via Server Action
import { revalidateTag } from 'next/cache'
revalidateTag('products')`}</pre>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline">Time-based revalidation</Badge>
                  <Badge variant="outline">Tag-based invalidation</Badge>
                  <Badge variant="outline">Zero client JS</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>TanStack Query Cache</CardTitle>
                <CardDescription>Client-side caching with powerful features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  TanStack Query provides sophisticated client-side caching with features like background refetching,
                  optimistic updates, and cache persistence.
                </p>
                <div className="bg-muted p-4 rounded-md">
                  <pre className="text-sm overflow-x-auto">{`const { data } = useQuery({
  queryKey: ['products'],
  queryFn: fetchProducts,
  staleTime: 5 * 1000,      // Fresh for 5 seconds
  gcTime: 10 * 60 * 1000,   // Cache for 10 minutes
})

// Invalidate queries
queryClient.invalidateQueries({ queryKey: ['products'] })

// Optimistic updates
queryClient.setQueryData(['products'], newData)`}</pre>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline">Background refetch</Badge>
                  <Badge variant="outline">Optimistic updates</Badge>
                  <Badge variant="outline">Cache persistence</Badge>
                  <Badge variant="outline">Devtools</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-destructive/50 bg-destructive/5">
              <CardHeader>
                <CardTitle>Avoiding Cache Conflicts</CardTitle>
                <CardDescription>Critical guidance for combining caches</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">
                  <strong>Generally avoid using both Next.js Data Cache and TanStack Query cache together.</strong> When using
                  TanStack Query with SSR prefetching, disable Next.js Data Cache to prevent conflicts and stale data.
                </p>
                <div className="bg-muted p-4 rounded-md">
                  <pre className="text-sm overflow-x-auto">{`// When using TanStack Query, disable Next.js cache
const response = await fetch(url, {
  cache: 'no-store'  // Bypass Next.js Data Cache
})

// Let TanStack Query manage caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,  // TanStack manages freshness
    },
  },
})`}</pre>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Decision Tree */}
        <section id="decision-tree" className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Decision Tree</h2>

          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-3">1. Do you need SEO?</h3>
                  <div className="grid md:grid-cols-2 gap-4 ml-4">
                    <div className="p-3 bg-muted rounded">
                      <strong>No</strong> → Consider <Link href="/approaches/1-spa-client-side" className="text-primary hover:underline">Approach 1 (SPA)</Link> or{' '}
                      <Link href="/approaches/4-tanstack-client" className="text-primary hover:underline">Approach 4 (TanStack Client)</Link>
                    </div>
                    <div className="p-3 bg-muted rounded">
                      <strong>Yes</strong> → Continue to question 2
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-3">2. Do you need complex client-side data management?</h3>
                  <div className="grid md:grid-cols-2 gap-4 ml-4">
                    <div className="p-3 bg-muted rounded">
                      <strong>No</strong> → Use <Link href="/approaches/3-pure-ssr" className="text-primary hover:underline">Approach 3 (Pure SSR)</Link>
                    </div>
                    <div className="p-3 bg-muted rounded">
                      <strong>Yes</strong> → Continue to question 3
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-3">3. Is fast initial page load critical?</h3>
                  <div className="grid md:grid-cols-2 gap-4 ml-4">
                    <div className="p-3 bg-muted rounded">
                      <strong>Yes (blocking is OK)</strong> → Use <Link href="/approaches/5-tanstack-prefetch-await" className="text-primary hover:underline">Approach 5 (Prefetch Await)</Link>
                    </div>
                    <div className="p-3 bg-muted rounded">
                      <strong>Yes (need streaming)</strong> → Use <Link href="/approaches/6-tanstack-prefetch-no-await" className="text-primary hover:underline">Approach 6 (Prefetch Streaming)</Link>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-3">4. Do you have mixed content (static + dynamic)?</h3>
                  <div className="grid md:grid-cols-2 gap-4 ml-4">
                    <div className="p-3 bg-muted rounded">
                      <strong>Yes</strong> → Use <Link href="/approaches/2-hybrid-ssr-client" className="text-primary hover:underline">Approach 2 (Hybrid)</Link>
                    </div>
                    <div className="p-3 bg-muted rounded">
                      <strong>No</strong> → Pick based on SSR needs above
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Performance Metrics */}
        <section id="metrics" className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Performance Metrics</h2>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Metrics Explained</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <strong>TTFB (Time to First Byte)</strong>
                  <p className="text-muted-foreground">Time from request to first byte received. Lower is better.</p>
                </div>
                <div>
                  <strong>FCP (First Contentful Paint)</strong>
                  <p className="text-muted-foreground">Time until first content is painted. Affects perceived speed.</p>
                </div>
                <div>
                  <strong>LCP (Largest Contentful Paint)</strong>
                  <p className="text-muted-foreground">Time until largest content element is visible. Core Web Vital.</p>
                </div>
                <div>
                  <strong>TTI (Time to Interactive)</strong>
                  <p className="text-muted-foreground">Time until page is fully interactive.</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Expected Performance by Approach</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center p-2 bg-muted rounded">
                    <span>Pure SSR (Streaming)</span>
                    <Badge>Fastest FCP</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted rounded">
                    <span>TanStack Prefetch (Await)</span>
                    <Badge>Best LCP</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted rounded">
                    <span>TanStack Prefetch (Streaming)</span>
                    <Badge>Balanced</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted rounded">
                    <span>Hybrid SSR + Client</span>
                    <Badge variant="secondary">Good TTFB</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted rounded">
                    <span>Pure SPA / TanStack Client</span>
                    <Badge variant="secondary">Slowest FCP</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Try It Yourself</CardTitle>
              <CardDescription>
                Visit each approach page to see real metrics being collected
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-3">
                {approaches.map((approach) => (
                  <Link key={approach.key} href={approach.href}>
                    <Button variant="outline" className="w-full justify-start">
                      {APPROACH_CONFIG[approach.key].name}
                    </Button>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* API Reference */}
        <section id="api" className="mb-16">
          <h2 className="text-3xl font-bold mb-6">API Reference</h2>

          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="font-mono text-lg">GET /api/products</CardTitle>
                <CardDescription>Fetch all products with optional delay simulation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-3 rounded text-sm font-mono">
                  {`{ data: Product[], meta: { total, delay, timestamp, cached } }`}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-mono text-lg">GET /api/users</CardTitle>
                <CardDescription>Fetch all users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-3 rounded text-sm font-mono">
                  {`{ data: User[], meta: { total, delay, timestamp } }`}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-mono text-lg">GET /api/metrics</CardTitle>
                <CardDescription>Fetch collected performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-3 rounded text-sm font-mono">
                  {`{ data: PerformanceMetric[], meta: { total, totalStored } }`}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground pt-8 border-t">
          <p>
            <Link href="/" className="text-primary hover:underline">
              ← Back to Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
