import { NextRequest, NextResponse } from 'next/server'
import { MOCK_POSTS, enrichPostsWithAuthors } from '@/lib/mock-data'
import { API_DELAYS } from '@/lib/cache-config'
import { generateRequestId, sleep } from '@/lib/api-client'
import { PaginatedResponse } from '@/types'

/**
 * GET /api/posts
 *
 * Paginated endpoint
 *
 * Query parameters:
 * - page: number (default: 1)
 * - limit: number (default: 10)
 * - delay: number (optional) - Artificial delay in milliseconds
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.url ? new URL(request.url) : { searchParams: new URLSearchParams() }

  const startTime = Date.now()

  // Get delay from query params or use default
  const customDelay = searchParams.get('delay')
  const delay = customDelay ? parseInt(customDelay, 10) : API_DELAYS.posts.list

  // Simulate network delay
  await sleep(delay)

  // Pagination
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '10', 10)
  const offset = (page - 1) * limit

  const enrichedPosts = enrichPostsWithAuthors(MOCK_POSTS)
  const paginatedPosts = enrichedPosts.slice(offset, offset + limit)

  const total = MOCK_POSTS.length
  const totalPages = Math.ceil(total / limit)
  const hasMore = page < totalPages

  const fetchTime = Date.now() - startTime
  const requestId = generateRequestId()

  const response: PaginatedResponse<typeof paginatedPosts[0]> = {
    data: paginatedPosts,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasMore,
    },
    meta: {
      fetchTime,
      requestId,
    },
  }

  return NextResponse.json(response, {
    headers: {
      'Content-Type': 'application/json',
      'Server-Timing': `api;dur=${fetchTime}`,
      'X-Fetch-Duration': fetchTime.toString(),
      'X-Request-ID': requestId,
      'Cache-Control': 'no-store',
    },
  })
}
