import { ReactNode } from 'react'

/**
 * Layout for Approach 1: Pure SPA (Client-Side)
 *
 * Force dynamic rendering - no static optimization
 */
export const dynamic = 'force-dynamic'

export default function SPALayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
