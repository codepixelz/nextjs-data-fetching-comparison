export type ApproachType =
  | 'spa-client'
  | 'hybrid-ssr-client'
  | 'pure-ssr'
  | 'tanstack-client'
  | 'tanstack-prefetch-await'
  | 'tanstack-prefetch-no-await'

export type MetricType = 'TTFB' | 'FCP' | 'LCP' | 'TTI' | 'LOAD_TIME' | 'API_DURATION'

export interface PerformanceMetric {
  id: string
  approach: ApproachType
  metric: MetricType
  value: number
  timestamp: string
  userAgent?: string
  url?: string
}

export interface AggregatedMetrics {
  approach: ApproachType
  metrics: {
    TTFB: { avg: number; min: number; max: number; count: number }
    FCP: { avg: number; min: number; max: number; count: number }
    LCP: { avg: number; min: number; max: number; count: number }
    TTI: { avg: number; min: number; max: number; count: number }
    LOAD_TIME: { avg: number; min: number; max: number; count: number }
  }
}

export interface CacheMetrics {
  approach: ApproachType
  hits: number
  misses: number
  hitRate: number
}
