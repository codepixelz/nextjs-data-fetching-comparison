import { NextRequest, NextResponse } from 'next/server'
import { MOCK_USERS } from '@/lib/mock-data'
import { API_DELAYS } from '@/lib/cache-config'
import { generateRequestId, sleep } from '@/lib/api-client'
import { ApiResponse } from '@/types'

/**
 * GET /api/users
 *
 * Fast endpoint for demonstration (50ms delay)
 *
 * Query parameters:
 * - delay: number (optional) - Artificial delay in milliseconds
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.url ? new URL(request.url) : { searchParams: new URLSearchParams() }

  const startTime = Date.now()

  // Get delay from query params or use default (fast)
  const customDelay = searchParams.get('delay')
  const delay = customDelay ? parseInt(customDelay, 10) : API_DELAYS.users.list

  // Simulate network delay (fast endpoint)
  await sleep(delay)

  const fetchTime = Date.now() - startTime
  const requestId = generateRequestId()

  const response: ApiResponse<typeof MOCK_USERS> = {
    data: MOCK_USERS,
    meta: {
      total: MOCK_USERS.length,
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
