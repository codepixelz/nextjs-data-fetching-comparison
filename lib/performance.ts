'use client'

import { onTTFB, onFCP, onLCP } from 'web-vitals'
import { ApproachType, MetricType, PerformanceMetric } from '@/types'

/**
 * Performance Tracking Utilities
 *
 * Uses Google's web-vitals library for Core Web Vitals (TTFB, FCP, LCP)
 * and custom implementation for TTI, LOAD_TIME, and API_DURATION
 */

export interface WebVitals {
  TTFB: number | null // Time to First Byte
  FCP: number | null // First Contentful Paint
  LCP: number | null // Largest Contentful Paint
  TTI: number | null // Time to Interactive
}

/**
 * Measure Web Vitals using Google's web-vitals library
 */
export function measureWebVitals(callback: (metric: MetricType, value: number) => void) {
  // Only run in browser
  if (typeof window === 'undefined') return

  // Use web-vitals library for Core Web Vitals
  // These are battle-tested implementations from Google

  // Time to First Byte (TTFB)
  onTTFB((metric) => {
    callback('TTFB', metric.value)
  })

  // First Contentful Paint (FCP)
  onFCP((metric) => {
    callback('FCP', metric.value)
  })

  // Largest Contentful Paint (LCP)
  onLCP((metric) => {
    callback('LCP', metric.value)
  })

  // Time to Interactive (TTI) - approximate using load event
  // Note: TTI is deprecated from web-vitals, using custom implementation
  try {
    if (document.readyState === 'complete') {
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      if (navigationEntry && navigationEntry.loadEventEnd > 0) {
        callback('TTI', navigationEntry.loadEventEnd)
      } else {
        callback('TTI', performance.now())
      }
    } else {
      window.addEventListener('load', () => {
        setTimeout(() => {
          callback('TTI', performance.now())
        }, 0)
      })
    }
  } catch (e) {
    console.warn('TTI measurement failed:', e)
  }

  // LOAD_TIME - measure total page load
  try {
    if (document.readyState === 'complete') {
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      if (navigationEntry && navigationEntry.loadEventEnd > 0) {
        callback('LOAD_TIME', navigationEntry.loadEventEnd - navigationEntry.startTime)
      }
    } else {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
          if (navigationEntry && navigationEntry.loadEventEnd > 0) {
            callback('LOAD_TIME', navigationEntry.loadEventEnd - navigationEntry.startTime)
          } else {
            callback('LOAD_TIME', performance.now())
          }
        }, 0)
      })
    }
  } catch (e) {
    console.warn('LOAD_TIME measurement failed:', e)
  }

  // API_DURATION - track fetch requests to /api/* endpoints
  // Reports immediately on first batch, then batches every 7 seconds
  try {
    if (typeof PerformanceObserver !== 'undefined') {
      const API_WINDOW_MS = 7000
      let apiDurations: number[] = []
      let windowTimer: ReturnType<typeof setTimeout> | null = null
      let isFirstReport = true

      const reportApiDuration = () => {
        if (apiDurations.length > 0) {
          const avgDuration = apiDurations.reduce((sum, d) => sum + d, 0) / apiDurations.length
          callback('API_DURATION', avgDuration)
        }
        apiDurations = []
        windowTimer = null
      }

      const addApiDuration = (duration: number) => {
        apiDurations.push(duration)

        // Report immediately on first batch
        if (isFirstReport) {
          isFirstReport = false
          reportApiDuration()
          return
        }

        // Start window timer for subsequent batches
        if (!windowTimer) {
          windowTimer = setTimeout(reportApiDuration, API_WINDOW_MS)
        }
      }

      // Check existing resource entries first
      const existingResources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
      const apiCalls = existingResources.filter(entry => entry.name.includes('/api/'))
      for (const entry of apiCalls) {
        addApiDuration(entry.duration)
      }

      // Observe future resource loads
      const resourceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries() as PerformanceResourceTiming[]
        const apiEntries = entries.filter(entry => entry.name.includes('/api/'))

        for (const entry of apiEntries) {
          addApiDuration(entry.duration)
        }
      })
      resourceObserver.observe({ type: 'resource', buffered: false })

      // Clean up on page unload
      window.addEventListener('pagehide', () => {
        if (windowTimer) {
          clearTimeout(windowTimer)
        }
        reportApiDuration()
        resourceObserver.disconnect()
      })
    }
  } catch (e) {
    console.warn('API_DURATION measurement failed:', e)
  }
}

/**
 * Record a performance metric
 */
export async function recordMetric(
  approach: ApproachType,
  metric: MetricType,
  value: number
): Promise<void> {
  const performanceMetric: Omit<PerformanceMetric, 'id'> = {
    approach,
    metric,
    value,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
  }

  try {
    await fetch('/api/metrics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(performanceMetric),
    })
  } catch (error) {
    console.error('Failed to record metric:', error)
  }
}

/**
 * Measure page load time
 */
export function measurePageLoad(approach: ApproachType): () => void {
  const startTime = performance.now()

  return () => {
    const loadTime = performance.now() - startTime
    recordMetric(approach, 'LOAD_TIME', loadTime)
  }
}

/**
 * Create a performance mark
 */
export function mark(name: string): void {
  if (typeof window !== 'undefined' && 'performance' in window) {
    performance.mark(name)
  }
}

/**
 * Measure time between two marks
 */
export function measure(name: string, startMark: string, endMark: string): number | null {
  if (typeof window === 'undefined' || !('performance' in window)) return null

  try {
    performance.measure(name, startMark, endMark)
    const measures = performance.getEntriesByName(name, 'measure')
    if (measures.length > 0) {
      return measures[0].duration
    }
  } catch (error) {
    console.error('Failed to measure:', error)
  }

  return null
}

/**
 * Clear all performance marks and measures
 */
export function clearPerformanceData(): void {
  if (typeof window !== 'undefined' && 'performance' in window) {
    performance.clearMarks()
    performance.clearMeasures()
  }
}

/**
 * Get navigation timing information
 */
export function getNavigationTiming(): Record<string, number> | null {
  if (typeof window === 'undefined') return null

  const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming

  if (!navigationEntry) return null

  return {
    dnsLookup: navigationEntry.domainLookupEnd - navigationEntry.domainLookupStart,
    tcpConnection: navigationEntry.connectEnd - navigationEntry.connectStart,
    requestTime: navigationEntry.responseStart - navigationEntry.requestStart,
    responseTime: navigationEntry.responseEnd - navigationEntry.responseStart,
    domProcessing: navigationEntry.domContentLoadedEventEnd - navigationEntry.domContentLoadedEventStart,
    totalTime: navigationEntry.loadEventEnd - navigationEntry.fetchStart,
  }
}
