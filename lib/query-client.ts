import { QueryClient, defaultShouldDehydrateQuery, isServer } from '@tanstack/react-query'
import { CACHE_CONFIG } from './cache-config'

/**
 * Create a new QueryClient instance
 *
 * IMPORTANT: Create a new instance for each request in server components
 * to avoid sharing cache between users
 */
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Prefetch config - used for server-side prefetching (Approaches 5 & 6)
        ...CACHE_CONFIG.tanstack.prefetch,
        // For production, you might want to adjust these
        retry: 1,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
      dehydrate: {
        // Dehydrate all queries by default (including errors)
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
      },
    },
  })
}

/**
 * Get or create QueryClient for browser
 *
 * This ensures we reuse the same instance in the browser
 */
let browserQueryClient: QueryClient | undefined = undefined

export function getQueryClient() {
  if (isServer) {
    // On server: always create a new query client
    return makeQueryClient()
  } else {
    // On browser: reuse the same instance (singleton pattern)
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClient()
    }
    return browserQueryClient
  }
}
