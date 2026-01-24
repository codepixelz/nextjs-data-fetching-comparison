import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ServerProducts } from './components/server-data'
import { ClientInteractive } from './components/client-data'
import { MetricsDisplay } from '@/components/metrics-display'
import { MOCK_PRODUCTS } from '@/lib/mock-data'

/**
 * Approach 2: Hybrid SSR + Client
 *
 * Combines server components for initial data with client components for interactivity
 *
 * Characteristics:
 * - Initial render on server (good for SEO)
 * - Interactive features on client
 * - Demonstrates progressive enhancement
 * - Cache boundaries between server/client
 */
export default async function HybridSSRClientPage() {
  // Server-side data - using direct import to avoid localhost fetch issues
  // In production, you would use a database query or external API
  const products = MOCK_PRODUCTS

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Approach 2: Hybrid SSR + Client</h1>
        <p className="text-muted-foreground mb-4">
          Server components for initial render + client components for interactivity
        </p>

        <div className="flex gap-2 mb-4">
          <Badge>SSR</Badge>
          <Badge variant="outline">Client Interactivity</Badge>
          <Badge variant="outline">Progressive Enhancement</Badge>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
            <CardDescription>Best of both worlds - server and client</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>Initial product list fetched on server</li>
              <li>HTML sent to browser with data already rendered</li>
              <li>Client components add interactivity (selection, details)</li>
              <li>Additional data fetched client-side on user interaction</li>
              <li>Good SEO for initial content</li>
              <li>Interactive features work after JS loads</li>
            </ul>
          </CardContent>
        </Card>

        <MetricsDisplay approach="hybrid-ssr-client" className="mb-6" />

        <Card className="mb-6 bg-muted">
          <CardHeader>
            <CardTitle>Trade-offs</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <div>
              <strong>Pros:</strong>
              <ul className="list-disc list-inside ml-4">
                <li>SEO-friendly initial render</li>
                <li>Fast Time to First Byte (TTFB)</li>
                <li>Progressive enhancement</li>
                <li>Interactive features when needed</li>
              </ul>
            </div>
            <div>
              <strong>Cons:</strong>
              <ul className="list-disc list-inside ml-4">
                <li>More complex architecture</li>
                <li>Need to manage server/client boundary</li>
                <li>Potential for hydration mismatches</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Server Component - pre-rendered */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Initial Product List (Server)</h2>
        <ServerProducts products={products} />
      </div>

      {/* Client Component - interactive */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Product Details (Client Interactive)</h2>
        <ClientInteractive productIds={products.map(p => p.id)} />
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Code Example</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
            {`// Server Component (page.tsx)
export default async function HybridPage() {
  // Fetched on server
  const products = await fetch('http://localhost:3000/api/products', {
    cache: 'no-store'
  }).then(r => r.json())

  return (
    <>
      {/* Server Component */}
      <ServerProducts products={products.data} />

      {/* Client Component */}
      <ClientInteractive productIds={products.data.map(p => p.id)} />
    </>
  )
}

// Client Component (client-data.tsx)
'use client'
function ClientInteractive({ productIds }) {
  const [selected, setSelected] = useState(null)
  const [details, setDetails] = useState(null)

  useEffect(() => {
    if (selected) {
      // Fetch on client when user interacts
      fetch(\`/api/products/\${selected}\`)
        .then(r => r.json())
        .then(data => setDetails(data.data))
    }
  }, [selected])

  return <ProductDetails product={details} />
}`}
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}
