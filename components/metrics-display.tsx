'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ApproachType, MetricType } from '@/types'
import { measureWebVitals, recordMetric } from '@/lib/performance'
import { useMetricsStore, metricDescriptions, getMetricColor } from '@/lib/stores/metrics-store'
import { APPROACH_CONFIG } from '@/lib/cache-config'
import { Info } from 'lucide-react'

interface MetricsDisplayProps {
  approach: ApproachType
  showAllMetrics?: boolean
  showComparison?: boolean
  className?: string
}

export function MetricsDisplay({
  approach,
  showAllMetrics = true,
  showComparison = true,
  className = ''
}: MetricsDisplayProps) {
  const { metrics, updateMetric, resetApproach, getComparisonData } = useMetricsStore()
  const [isCollecting, setIsCollecting] = useState(true)
  const [mounted, setMounted] = useState(false)

  const handleMetricUpdate = useCallback((metric: MetricType, value: number) => {
    updateMetric(approach, metric, value)
    recordMetric(approach, metric, value)
  }, [approach, updateMetric])

  useEffect(() => {
    setMounted(true)
    measureWebVitals((metric, value) => {
      handleMetricUpdate(metric, value)
    })

    const timer = setTimeout(() => {
      setIsCollecting(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [handleMetricUpdate])

  const displayMetrics: MetricType[] = showAllMetrics
    ? ['TTFB', 'FCP', 'LCP', 'TTI', 'LOAD_TIME', 'API_DURATION']
    : ['FCP', 'LCP', 'LOAD_TIME']

  const handleReset = () => {
    resetApproach(approach)
    window.location.reload()
  }

  const currentMetrics = metrics[approach]

  // Don't render with store data until mounted (avoid hydration mismatch)
  if (!mounted) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
          <CardDescription>Loading metrics...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {displayMetrics.map(metric => (
              <div key={metric} className="p-3 border rounded-lg">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
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
              Real-time Web Vitals • Data persists across page reloads
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {displayMetrics.map(metric => {
            const data = currentMetrics[metric]
            const info = metricDescriptions[metric]
            const comparison = showComparison ? getComparisonData(metric) : []
            const otherApproaches = comparison.filter(c => c.approach !== approach && c.value !== null && c.count > 0)

            return (
              <div key={metric} className="p-3 border rounded-lg">
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-xs text-muted-foreground">{info.name}</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="text-muted-foreground/50 hover:text-muted-foreground">
                        <Info className="w-3 h-3" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs p-3">
                      <div className="space-y-2">
                        <p className="font-medium">{info.name}</p>
                        <p className="text-xs">{info.description}</p>
                        <div className="flex gap-3 text-xs pt-1 border-t border-border/50">
                          <span className="text-green-500">Good: {info.good}</span>
                          <span className="text-yellow-500">Moderate: {info.moderate}</span>
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>

                {data.current !== null ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className={`text-2xl font-bold cursor-help ${getMetricColor(metric, data.current)}`}>
                        {Math.round(data.current)}
                        <span className="text-sm font-normal text-muted-foreground ml-1">{info.unit}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="p-3">
                      <div className="space-y-1 text-xs">
                        <div>Current: <span className="font-medium">{Math.round(data.current)}ms</span></div>
                        {data.avg !== null && <div>Average: <span className="font-medium">{Math.round(data.avg)}ms</span></div>}
                        {data.min !== null && <div>Min: <span className="font-medium">{Math.round(data.min)}ms</span></div>}
                        {data.max !== null && <div>Max: <span className="font-medium">{Math.round(data.max)}ms</span></div>}
                        <div>Samples: <span className="font-medium">{data.count}</span></div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Skeleton className="h-8 w-20" />
                )}

                {data.count > 0 && (
                  <div className="text-xs text-muted-foreground mt-2 space-y-1">
                    {data.avg !== null && data.count > 1 && (
                      <div>Avg: {Math.round(data.avg)}{info.unit} ({data.count})</div>
                    )}
                  </div>
                )}

                {/* Comparison with other approaches */}
                {showComparison && otherApproaches.length > 0 && data.avg !== null && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="mt-2 pt-2 border-t border-border/50 text-xs text-muted-foreground/70 cursor-help">
                        vs others: {otherApproaches.length} approaches
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="p-3 max-w-sm">
                      <div className="space-y-2">
                        <p className="font-medium text-xs">Comparison ({metric})</p>
                        <div className="space-y-1">
                          {/* Current approach first */}
                          <div className="flex justify-between text-xs">
                            <span className="font-medium">{APPROACH_CONFIG[approach]?.name || approach}</span>
                            <span className={getMetricColor(metric, data.avg || 0)}>
                              {Math.round(data.avg || 0)}ms
                            </span>
                          </div>
                          {/* Other approaches */}
                          {otherApproaches
                            .sort((a, b) => (a.value || 0) - (b.value || 0))
                            .map(item => (
                              <div key={item.approach} className="flex justify-between text-xs text-muted-foreground">
                                <span>{APPROACH_CONFIG[item.approach]?.name || item.approach}</span>
                                <span className={getMetricColor(metric, item.value || 0)}>
                                  {Math.round(item.value || 0)}ms
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
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
  const { metrics, updateMetric } = useMetricsStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    measureWebVitals((metric, value) => {
      if (metric === 'FCP' || metric === 'LCP') {
        updateMetric(approach, metric, value)
        recordMetric(approach, metric, value)
      }
    })
  }, [approach, updateMetric])

  if (!mounted) {
    return (
      <div className="flex gap-4 text-sm">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
      </div>
    )
  }

  const currentMetrics = metrics[approach]

  return (
    <div className="flex gap-4 text-sm">
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-help">
            <span className="text-muted-foreground">FCP: </span>
            {currentMetrics.FCP.current !== null ? (
              <span className={getMetricColor('FCP', currentMetrics.FCP.current)}>
                {Math.round(currentMetrics.FCP.current)}ms
              </span>
            ) : (
              <span className="text-muted-foreground">--</span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">{metricDescriptions.FCP.description}</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-help">
            <span className="text-muted-foreground">LCP: </span>
            {currentMetrics.LCP.current !== null ? (
              <span className={getMetricColor('LCP', currentMetrics.LCP.current)}>
                {Math.round(currentMetrics.LCP.current)}ms
              </span>
            ) : (
              <span className="text-muted-foreground">--</span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">{metricDescriptions.LCP.description}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  )
}
