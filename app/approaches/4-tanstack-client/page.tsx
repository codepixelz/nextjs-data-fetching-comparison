export const dynamic = 'force-dynamic'

import TanStackClientPageClient from './components/client-page'

/**
 * Approach 4: TanStack Query Client-Side
 *
 * Client-side data fetching with TanStack Query for intelligent caching
 *
 * Characteristics:
 * - Client-side only (like Approach 1)
 * - TanStack Query manages cache, refetch, and stale data
 * - Automatic background refetching
 * - Optimistic updates support
 * - No server-side rendering
 */
export default function TanStackClientPage() {
  return <TanStackClientPageClient />
}
