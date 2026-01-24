import { NextRequest, NextResponse } from 'next/server'
import { MOCK_POSTS, enrichPostsWithAuthors } from '@/lib/mock-data'
import { API_DELAYS } from '@/lib/cache-config'
import { generateRequestId, sleep } from '@/lib/api-client'
import { ApiResponse } from '@/types'

/**
 * GET /api/posts/:id
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
  const delay = customDelay ? parseInt(customDelay, 10) : API_DELAYS.posts.detail

  // Simulate network delay
  await sleep(delay)

  // Find post
  const enrichedPosts = enrichPostsWithAuthors(MOCK_POSTS)
  const post = enrichedPosts.find(p => p.id === id)

  if (!post) {
    return NextResponse.json(
      {
        error: 'Not Found',
        message: `Post with id ${id} not found`,
        statusCode: 404,
        requestId: generateRequestId(),
      },
      { status: 404 }
    )
  }

  const fetchTime = Date.now() - startTime
  const requestId = generateRequestId()

  const response: ApiResponse<typeof post> = {
    data: post,
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
