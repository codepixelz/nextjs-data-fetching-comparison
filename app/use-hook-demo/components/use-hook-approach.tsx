'use client'

import { use, cache } from 'react'
import { Badge } from '@/components/ui/badge'

interface User {
  id: string
  name: string
  email: string
}

/**
 * Fetch user data - cached to prevent refetching
 */
const fetchUser = cache(async (id: string) => {
  const response = await fetch(`/api/users/${id}`)

  if (!response.ok) {
    throw new Error('Failed to fetch user')
  }

  const data = await response.json()
  return data.data as User
})

/**
 * React 19 'use' Hook Approach
 *
 * This demonstrates the new 'use' hook for unwrapping promises.
 * Much simpler than the traditional approach!
 */
export default function UseHookApproach() {
  // Create the promise outside the component or use cache()
  const userPromise = fetchUser('2')

  // use() unwraps the promise - component suspends while pending
  const user = use(userPromise)

  return (
    <div className="space-y-4">
      <div className="p-4 bg-muted rounded-lg border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">{user.name}</h3>
          <Badge variant="outline">
            React 19 'use'
          </Badge>
        </div>
        <p className="text-sm">{user.email}</p>
      </div>

      <div className="text-xs text-muted-foreground">
        <strong>Code characteristics:</strong>
        <ul className="list-disc list-inside mt-1 ml-2">
          <li>No useState or useEffect needed</li>
          <li>No manual loading state management</li>
          <li>Suspense handles loading automatically</li>
          <li>Error boundary catches errors</li>
          <li>Much less boilerplate</li>
          <li>Component suspends while promise is pending</li>
        </ul>
      </div>

      <div className="bg-muted p-3 rounded text-xs overflow-x-auto border">
        <pre>{`const fetchUser = cache(async (id) => {
  const res = await fetch(\`/api/users/\${id}\`)
  return res.json()
})

function Component() {
  const userPromise = fetchUser('2')
  const user = use(userPromise)

  return <div>{user.name}</div>
}

// In parent:
<Suspense fallback={<Skeleton />}>
  <Component />
</Suspense>`}</pre>
      </div>

      <div className="p-3 bg-muted rounded border text-xs">
        <strong>Key Insight:</strong>
        <p className="mt-1">
          The 'use' hook automatically suspends the component while the promise is pending.
          Suspense catches the suspension and shows the fallback. When the promise resolves,
          React re-renders with the data. Much simpler!
        </p>
      </div>
    </div>
  )
}
