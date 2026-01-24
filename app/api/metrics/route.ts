import { NextRequest, NextResponse } from 'next/server'
import { PerformanceMetric } from '@/types'
import { generateRequestId } from '@/lib/api-client'

// In-memory storage for metrics (in production, use a database)
const metrics: PerformanceMetric[] = []

/**
 * POST /api/metrics
 *
 * Store a performance metric
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const metric: PerformanceMetric = {
      id: generateRequestId(),
      approach: body.approach,
      metric: body.metric,
      value: body.value,
      timestamp: body.timestamp || new Date().toISOString(),
      userAgent: body.userAgent,
      url: body.url,
    }

    metrics.push(metric)

    return NextResponse.json(
      {
        data: metric,
        meta: {
          total: metrics.length,
        },
      },
      { status: 201 }
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

/**
 * GET /api/metrics
 *
 * Retrieve all metrics with optional filtering
 *
 * Query parameters:
 * - approach: string (optional) - Filter by approach
 * - metric: string (optional) - Filter by metric type
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.url ? new URL(request.url) : { searchParams: new URLSearchParams() }

  let filteredMetrics = metrics

  const approachFilter = searchParams.get('approach')
  if (approachFilter) {
    filteredMetrics = filteredMetrics.filter(m => m.approach === approachFilter)
  }

  const metricFilter = searchParams.get('metric')
  if (metricFilter) {
    filteredMetrics = filteredMetrics.filter(m => m.metric === metricFilter)
  }

  return NextResponse.json({
    data: filteredMetrics,
    meta: {
      total: filteredMetrics.length,
      totalStored: metrics.length,
    },
  })
}

/**
 * DELETE /api/metrics
 *
 * Clear all metrics (for testing)
 */
export async function DELETE() {
  const count = metrics.length
  metrics.length = 0

  return NextResponse.json({
    data: { cleared: count },
    meta: {
      message: `Cleared ${count} metrics`,
    },
  })
}
