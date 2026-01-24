import { NextRequest, NextResponse } from 'next/server'
import { MOCK_COMMENTS, enrichCommentsWithAuthors } from '@/lib/mock-data'
import { API_DELAYS } from '@/lib/cache-config'
import { generateRequestId, sleep } from '@/lib/api-client'
import { ApiResponse } from '@/types'

/**
 * GET /api/posts/:id/comments
 *
 * Get all comments for a specific post
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { searchParams } = request.url ? new URL(request.url) : { searchParams: new URLSearchParams() }

  const startTime = Date.now()

  // Get delay from query params or use default
  const customDelay = searchParams.get('delay')
  const delay = customDelay ? parseInt(customDelay, 10) : API_DELAYS.posts.comments

  // Simulate network delay
  await sleep(delay)

  // Filter comments for this post
  const postComments = MOCK_COMMENTS.filter(c => c.postId === id)
  const enrichedComments = enrichCommentsWithAuthors(postComments)

  const fetchTime = Date.now() - startTime
  const requestId = generateRequestId()

  const response: ApiResponse<typeof enrichedComments> = {
    data: enrichedComments,
    meta: {
      total: enrichedComments.length,
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
