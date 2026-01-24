import { Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import TraditionalApproach from './components/traditional-approach'
import UseHookApproach from './components/use-hook-approach'
import ConditionalUseHook from './components/conditional-use-hook'

// Mark as dynamic to prevent static generation during build
export const dynamic = 'force-dynamic'

/**
 * React 19 'use' Hook Demonstration
 *
 * The 'use' hook is a new React 19 feature that unwraps promises and context.
 * This page demonstrates its usage and compares it with traditional approaches.
 */

export default function UseHookDemoPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">React 19 'use' Hook Demo</h1>
        <p className="text-muted-foreground mb-4">
          Understanding the new 'use' hook for promise unwrapping and how it differs from
          traditional patterns
        </p>

        <div className="flex gap-2 mb-4">
          <Badge variant="outline">React 19</Badge>
          <Badge variant="outline">Suspense</Badge>
          <Badge variant="secondary">New API</Badge>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>What is the 'use' Hook?</CardTitle>
            <CardDescription>A new primitive for reading resources in React 19</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              The <code className="bg-muted px-1 py-0.5 rounded">use</code> hook is a new
              React primitive that can:
            </div>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Unwrap promises (read promise values)</li>
              <li>Read context values</li>
              <li>Be called conditionally (unlike other hooks!)</li>
              <li>Integrate seamlessly with Suspense</li>
              <li>Enable more flexible component patterns</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6 bg-muted">
          <CardHeader>
            <CardTitle>Key Differences from Other Hooks</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-3 bg-card rounded border">
                <strong>Traditional Hooks (useState, useEffect):</strong>
                <ul className="list-disc list-inside ml-2 mt-1 text-xs">
                  <li>Cannot be called conditionally</li>
                  <li>Must be at top level</li>
                  <li>Asynchronous data needs useEffect</li>
                  <li>Manual loading state management</li>
                </ul>
              </div>
              <div className="p-3 bg-card rounded border">
                <strong>'use' Hook:</strong>
                <ul className="list-disc list-inside ml-2 mt-1 text-xs">
                  <li>CAN be called conditionally</li>
                  <li>Can be in loops or conditions</li>
                  <li>Automatically suspends component</li>
                  <li>Suspense handles loading state</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Example 1: Traditional Approach */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Example 1: Traditional Approach (Before React 19)</h2>
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Using useEffect + useState</CardTitle>
            <CardDescription>The old way of handling promises</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense
              fallback={
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              }
            >
              <TraditionalApproach />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      {/* Example 2: use Hook Approach */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Example 2: React 19 'use' Hook</h2>
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Using the 'use' Hook</CardTitle>
            <CardDescription>The new way with cleaner code</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense
              fallback={
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              }
            >
              <UseHookApproach />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      {/* Example 3: Conditional use Hook */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Example 3: Conditional 'use' (Not Possible with Other Hooks)</h2>
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Conditional Promise Reading</CardTitle>
            <CardDescription>Calling use conditionally - unique capability!</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense
              fallback={
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              }
            >
              <ConditionalUseHook />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      {/* Code Comparison */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Code Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2 text-sm">Traditional (useEffect + useState)</h3>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
{`function Component() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchData()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />
  if (error) return <Error />
  return <div>{data.name}</div>
}`}
              </pre>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-sm">React 19 (use hook)</h3>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
{`function Component({ dataPromise }) {
  const data = use(dataPromise)

  return <div>{data.name}</div>
}

// In parent:
<Suspense fallback={<Spinner />}>
  <ErrorBoundary fallback={<Error />}>
    <Component dataPromise={fetchData()} />
  </ErrorBoundary>
</Suspense>`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Benefits */}
      <Card className="mb-6 bg-muted">
        <CardHeader>
          <CardTitle>Key Benefits of 'use' Hook</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Simpler code:</strong> No need for useState, useEffect, or manual loading states
            </li>
            <li>
              <strong>Better composition:</strong> Promises can be passed as props, created
              conditionally
            </li>
            <li>
              <strong>Automatic Suspense:</strong> Component suspends while promise is pending
            </li>
            <li>
              <strong>Error boundaries:</strong> Errors bubble to nearest error boundary
            </li>
            <li>
              <strong>Conditional calls:</strong> Can be used in if statements, loops, etc.
            </li>
            <li>
              <strong>Better for SSR:</strong> Works seamlessly with server components
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* When to Use */}
      <Card className="mb-6 bg-muted">
        <CardHeader>
          <CardTitle>When to Use 'use' Hook</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <div className="space-y-3">
            <div className="p-3 bg-card rounded">
              <strong>Good for:</strong>
              <ul className="list-disc list-inside ml-2 mt-1 text-xs">
                <li>Reading promises passed as props from server components</li>
                <li>Unwrapping data in client components with Suspense</li>
                <li>Conditional data fetching based on runtime conditions</li>
                <li>Simplifying async component logic</li>
              </ul>
            </div>
            <div className="p-3 bg-card rounded">
              <strong>Not ideal for:</strong>
              <ul className="list-disc list-inside ml-2 mt-1 text-xs">
                <li>Creating promises inside event handlers (use regular async/await)</li>
                <li>Complex data fetching with caching (use TanStack Query or SWR)</li>
                <li>When you need fine-grained loading states for UX</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Notes */}
      <Card className="bg-muted">
        <CardHeader>
          <CardTitle>Important Notes</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Promise creation:</strong> Create promises in server components or outside
              render, not in the component that calls use()
            </li>
            <li>
              <strong>Suspense boundary:</strong> Always wrap components using use() with Suspense
            </li>
            <li>
              <strong>Error handling:</strong> Use Error Boundaries to catch promise rejections
            </li>
            <li>
              <strong>Not a replacement:</strong> use() complements, not replaces, data fetching
              libraries
            </li>
            <li>
              <strong>Server Components:</strong> Server components can use async/await directly,
              no need for use()
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
