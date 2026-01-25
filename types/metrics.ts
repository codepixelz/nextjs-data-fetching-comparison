export type ApproachType =
  | 'spa-client'
  | 'hybrid-ssr-client'
  | 'pure-ssr'
  | 'tanstack-client'
  | 'tanstack-prefetch-await'
  | 'tanstack-prefetch-no-await'

// Core Web Vitals + additional metrics
export type MetricType =
  | 'TTFB'         // Time to First Byte
  | 'FCP'          // First Contentful Paint
  | 'LCP'          // Largest Contentful Paint (Core Web Vital)
  | 'CLS'          // Cumulative Layout Shift (Core Web Vital)
  | 'INP'          // Interaction to Next Paint (Core Web Vital, replaces FID)
  | 'FID'          // First Input Delay (legacy, replaced by INP)
  | 'TTI'          // Time to Interactive (custom)
  | 'LOAD_TIME'    // Total page load time (custom)
  | 'API_DURATION' // API call duration (custom)

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
    CLS: { avg: number; min: number; max: number; count: number }
    INP: { avg: number; min: number; max: number; count: number }
    FID: { avg: number; min: number; max: number; count: number }
    TTI: { avg: number; min: number; max: number; count: number }
    LOAD_TIME: { avg: number; min: number; max: number; count: number }
    API_DURATION: { avg: number; min: number; max: number; count: number }
  }
}

export interface CacheMetrics {
  approach: ApproachType
  hits: number
  misses: number
  hitRate: number
}
