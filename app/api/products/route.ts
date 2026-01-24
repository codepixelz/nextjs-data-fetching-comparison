import { NextRequest, NextResponse } from 'next/server'
import { MOCK_PRODUCTS } from '@/lib/mock-data'
import { API_DELAYS, CACHE_TAGS } from '@/lib/cache-config'
import { generateRequestId, sleep } from '@/lib/api-client'
import { ApiResponse } from '@/types'

/**
 * GET /api/products
 *
 * Query parameters:
 * - delay: number (optional) - Artificial delay in milliseconds
 * - limit: number (optional) - Number of products to return
 * - offset: number (optional) - Offset for pagination
 * - error: boolean (optional) - Simulate error response
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.url ? new URL(request.url) : { searchParams: new URLSearchParams() }

  // Check for simulated error
  if (searchParams.get('error') === 'true') {
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'Simulated error for testing',
        statusCode: 500,
        requestId: generateRequestId(),
      },
      { status: 500 }
    )
  }

  const startTime = Date.now()

  // Get delay from query params or use default
  const customDelay = searchParams.get('delay')
  const delay = customDelay ? parseInt(customDelay, 10) : API_DELAYS.products.list

  // Simulate network delay
  await sleep(delay)

  // Pagination
  const limit = parseInt(searchParams.get('limit') || '10', 10)
  const offset = parseInt(searchParams.get('offset') || '0', 10)

  const paginatedProducts = MOCK_PRODUCTS.slice(offset, offset + limit)

  const fetchTime = Date.now() - startTime
  const requestId = generateRequestId()

  const response: ApiResponse<typeof paginatedProducts> = {
    data: paginatedProducts,
    meta: {
      total: MOCK_PRODUCTS.length,
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
      // Cache-Control for Next.js Data Cache
      'Cache-Control': 'no-store', // Disable cache by default for demo
    },
  })
}

/**
 * PATCH /api/products
 *
 * Bulk update products (for server actions demo)
 */
export async function PATCH(request: NextRequest) {
  const startTime = Date.now()

  try {
    const body = await request.json()
    // In a real app, update the database here
    // For demo purposes, we just simulate a successful update

    await sleep(200) // Simulate processing time

    const fetchTime = Date.now() - startTime
    const requestId = generateRequestId()

    return NextResponse.json(
      {
        data: { success: true, updated: body },
        meta: { fetchTime, requestId },
      },
      {
        headers: {
          'X-Request-ID': requestId,
        },
      }
    )
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Bad Request',
        message: 'Invalid request body',
        statusCode: 400,
      },
      { status: 400 }
    )
  }
}
