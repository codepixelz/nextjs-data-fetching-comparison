'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ApproachType, MetricType } from '@/types'
import { measureWebVitals, recordMetric } from '@/lib/performance'

interface MetricValue {
  current: number | null
  avg: number | null
  min: number | null
  max: number | null
  count: number
}

interface MetricsState {
  TTFB: MetricValue
  FCP: MetricValue
  LCP: MetricValue
  TTI: MetricValue
  LOAD_TIME: MetricValue
  API_DURATION: MetricValue
}

const initialMetricValue: MetricValue = {
  current: null,
  avg: null,
  min: null,
  max: null,
  count: 0,
}

const initialMetrics: MetricsState = {
  TTFB: { ...initialMetricValue },
  FCP: { ...initialMetricValue },
  LCP: { ...initialMetricValue },
  TTI: { ...initialMetricValue },
  LOAD_TIME: { ...initialMetricValue },
  API_DURATION: { ...initialMetricValue },
}

const metricLabels: Record<MetricType, { name: string; description: string; unit: string }> = {
  TTFB: { name: 'Time to First Byte', description: 'Server response time', unit: 'ms' },
  FCP: { name: 'First Contentful Paint', description: 'First content visible', unit: 'ms' },
  LCP: { name: 'Largest Contentful Paint', description: 'Main content visible', unit: 'ms' },
  TTI: { name: 'Time to Interactive', description: 'Page fully interactive', unit: 'ms' },
  LOAD_TIME: { name: 'Total Load Time', description: 'Full page load', unit: 'ms' },
  API_DURATION: { name: 'API Duration', description: 'Data fetch time', unit: 'ms' },
}

function getMetricColor(metric: MetricType, value: number): string {
  const thresholds: Record<MetricType, { good: number; moderate: number }> = {
    TTFB: { good: 200, moderate: 500 },
    FCP: { good: 1800, moderate: 3000 },
    LCP: { good: 2500, moderate: 4000 },
    TTI: { good: 3800, moderate: 7300 },
    LOAD_TIME: { good: 2000, moderate: 4000 },
    API_DURATION: { good: 300, moderate: 800 },
  }

  const t = thresholds[metric]
  if (value <= t.good) return 'text-green-500'
  if (value <= t.moderate) return 'text-yellow-500'
  return 'text-red-500'
}

interface MetricsDisplayProps {
  approach: ApproachType
  showAllMetrics?: boolean
  className?: string
}

export function MetricsDisplay({ approach, showAllMetrics = true, className = '' }: MetricsDisplayProps) {
  const [metrics, setMetrics] = useState<MetricsState>(initialMetrics)
  const [isCollecting, setIsCollecting] = useState(true)
  const [historicalData, setHistoricalData] = useState<MetricsState | null>(null)

  const updateMetric = useCallback((metric: MetricType, value: number) => {
    setMetrics(prev => {
      const current = prev[metric]
      const newCount = current.count + 1
      const newAvg = current.avg !== null
        ? (current.avg * current.count + value) / newCount
        : value
      const newMin = current.min !== null ? Math.min(current.min, value) : value
      const newMax = current.max !== null ? Math.max(current.max, value) : value

      return {
        ...prev,
        [metric]: {
          current: value,
          avg: newAvg,
          min: newMin,
          max: newMax,
          count: newCount,
        },
      }
    })

    recordMetric(approach, metric, value)
  }, [approach])

  useEffect(() => {
    measureWebVitals((metric, value) => {
      updateMetric(metric, value)
    })

    const timer = setTimeout(() => {
      setIsCollecting(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [updateMetric])

  useEffect(() => {
    fetch(`/api/metrics?approach=${approach}`)
      .then(res => res.json())
      .then(data => {
        if (data.data && data.data.length > 0) {
          const aggregated: MetricsState = { ...initialMetrics }
          const metricTypes: MetricType[] = ['TTFB', 'FCP', 'LCP', 'TTI', 'LOAD_TIME', 'API_DURATION']

          metricTypes.forEach(type => {
            const values = data.data
              .filter((m: { metric: MetricType }) => m.metric === type)
              .map((m: { value: number }) => m.value)

            if (values.length > 0) {
              aggregated[type] = {
                current: values[values.length - 1],
                avg: values.reduce((a: number, b: number) => a + b, 0) / values.length,
                min: Math.min(...values),
                max: Math.max(...values),
                count: values.length,
              }
            }
          })

          setHistoricalData(aggregated)
        }
      })
      .catch(console.error)
  }, [approach])

  const displayMetrics: MetricType[] = showAllMetrics
    ? ['TTFB', 'FCP', 'LCP', 'TTI', 'LOAD_TIME', 'API_DURATION']
    : ['FCP', 'LCP', 'LOAD_TIME']

  const resetMetrics = async () => {
    setMetrics(initialMetrics)
    setHistoricalData(null)
    await fetch('/api/metrics', { method: 'DELETE' })
    window.location.reload()
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Performance Metrics
              {isCollecting && (
                <Badge variant="outline" className="animate-pulse">
                  Collecting...
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Real-time Web Vitals and loading performance
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={resetMetrics}>
            Reset
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {displayMetrics.map(metric => {
            const data = metrics[metric]
            const historical = historicalData?.[metric]
            const info = metricLabels[metric]

            return (
              <div key={metric} className="p-3 border rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">{info.name}</div>
                {data.current !== null ? (
                  <div className={`text-2xl font-bold ${getMetricColor(metric, data.current)}`}>
                    {Math.round(data.current)}
                    <span className="text-sm font-normal text-muted-foreground ml-1">{info.unit}</span>
                  </div>
                ) : (
                  <Skeleton className="h-8 w-20" />
                )}
                {(data.count > 1 || historical) && (
                  <div className="text-xs text-muted-foreground mt-2 space-y-1">
                    {data.avg !== null && (
                      <div>Avg: {Math.round(data.avg)}{info.unit}</div>
                    )}
                    {historical && historical.count > 0 && (
                      <div className="text-muted-foreground/70">
                        Historical: {Math.round(historical.avg || 0)}{info.unit} ({historical.count} samples)
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500" /> Good
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-yellow-500" /> Needs Improvement
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500" /> Poor
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function MetricsCompact({ approach }: { approach: ApproachType }) {
  const [metrics, setMetrics] = useState<Pick<MetricsState, 'FCP' | 'LCP'>>({
    FCP: { ...initialMetricValue },
    LCP: { ...initialMetricValue },
  })

  useEffect(() => {
    measureWebVitals((metric, value) => {
      if (metric === 'FCP' || metric === 'LCP') {
        setMetrics(prev => ({
          ...prev,
          [metric]: { ...prev[metric], current: value },
        }))
        recordMetric(approach, metric, value)
      }
    })
  }, [approach])

  return (
    <div className="flex gap-4 text-sm">
      <div>
        <span className="text-muted-foreground">FCP: </span>
        {metrics.FCP.current !== null ? (
          <span className={getMetricColor('FCP', metrics.FCP.current)}>
            {Math.round(metrics.FCP.current)}ms
          </span>
        ) : (
          <span className="text-muted-foreground">--</span>
        )}
      </div>
      <div>
        <span className="text-muted-foreground">LCP: </span>
        {metrics.LCP.current !== null ? (
          <span className={getMetricColor('LCP', metrics.LCP.current)}>
            {Math.round(metrics.LCP.current)}ms
          </span>
        ) : (
          <span className="text-muted-foreground">--</span>
        )}
      </div>
    </div>
  )
}
