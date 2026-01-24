import { NextRequest, NextResponse } from 'next/server'
import { MOCK_PRODUCTS } from '@/lib/mock-data'
import { API_DELAYS } from '@/lib/cache-config'
import { generateRequestId, sleep } from '@/lib/api-client'
import { ApiResponse } from '@/types'

/**
 * GET /api/products/:id
 *
 * Query parameters:
 * - delay: number (optional) - Artificial delay in milliseconds
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
  const delay = customDelay ? parseInt(customDelay, 10) : API_DELAYS.products.detail

  // Simulate network delay
  await sleep(delay)

  // Find product
  const product = MOCK_PRODUCTS.find(p => p.id === id)

  if (!product) {
    return NextResponse.json(
      {
        error: 'Not Found',
        message: `Product with id ${id} not found`,
        statusCode: 404,
        requestId: generateRequestId(),
      },
      { status: 404 }
    )
  }

  const fetchTime = Date.now() - startTime
  const requestId = generateRequestId()

  const response: ApiResponse<typeof product> = {
    data: product,
    meta: {
      fetchTime,
      cachedAt: new Date().toISOString(),
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

/**
 * PATCH /api/products/:id
 *
 * Update a specific product (for server actions demo)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const startTime = Date.now()

  try {
    const body = await request.json()
    const product = MOCK_PRODUCTS.find(p => p.id === id)

    if (!product) {
      return NextResponse.json(
        {
          error: 'Not Found',
          message: `Product with id ${id} not found`,
          statusCode: 404,
        },
        { status: 404 }
      )
    }

    // Simulate update
    await sleep(200)

    const fetchTime = Date.now() - startTime
    const requestId = generateRequestId()

    const updatedProduct = { ...product, ...body, updatedAt: new Date().toISOString() }

    return NextResponse.json(
      {
        data: updatedProduct,
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
