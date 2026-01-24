import { NextRequest, NextResponse } from 'next/server'
import { MOCK_USERS } from '@/lib/mock-data'
import { API_DELAYS } from '@/lib/cache-config'
import { generateRequestId, sleep } from '@/lib/api-client'
import { ApiResponse } from '@/types'

/**
 * GET /api/users/:id
 *
 * Medium-speed endpoint (200ms delay)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { searchParams } = request.url ? new URL(request.url) : { searchParams: new URLSearchParams() }

  const startTime = Date.now()

  // Get delay from query params or use default (medium)
  const customDelay = searchParams.get('delay')
  const delay = customDelay ? parseInt(customDelay, 10) : API_DELAYS.users.detail

  // Simulate network delay
  await sleep(delay)

  // Find user
  const user = MOCK_USERS.find(u => u.id === id)

  if (!user) {
    return NextResponse.json(
      {
        error: 'Not Found',
        message: `User with id ${id} not found`,
        statusCode: 404,
        requestId: generateRequestId(),
      },
      { status: 404 }
    )
  }

  const fetchTime = Date.now() - startTime
  const requestId = generateRequestId()

  const response: ApiResponse<typeof user> = {
    data: user,
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
