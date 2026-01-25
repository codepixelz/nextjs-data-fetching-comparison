'use client'

import { onTTFB, onFCP, onLCP, onCLS, onINP } from 'web-vitals'
import { ApproachType, MetricType, PerformanceMetric } from '@/types'

/**
 * Performance Tracking Utilities
 *
 * Uses Google's web-vitals library for all Core Web Vitals:
 * - TTFB: Time to First Byte
 * - FCP: First Contentful Paint
 * - LCP: Largest Contentful Paint (Core Web Vital)
 * - CLS: Cumulative Layout Shift (Core Web Vital)
 * - INP: Interaction to Next Paint (Core Web Vital, replaces FID)
 * - FID: First Input Delay (legacy, for backwards compatibility)
 *
 * Custom metrics:
 * - TTI: Time to Interactive (approximation)
 * - LOAD_TIME: Total page load time
 * - API_DURATION: Average API call duration
 */

export interface WebVitals {
  TTFB: number | null
  FCP: number | null
  LCP: number | null
  CLS: number | null
  INP: number | null
  FID: number | null
  TTI: number | null
}

/**
 * Measure Web Vitals using Google's web-vitals library
 * https://github.com/GoogleChrome/web-vitals
 */
export function measureWebVitals(callback: (metric: MetricType, value: number) => void) {
  // Only run in browser
  if (typeof window === 'undefined') return

  // ========================================
  // Core Web Vitals (from web-vitals library)
  // ========================================

  // Time to First Byte (TTFB)
  // Measures the time from when the user initiates loading the page
  // to when the browser receives the first byte of the response
  onTTFB((metric) => {
    callback('TTFB', metric.value)
  }, { reportAllChanges: true })

  // First Contentful Paint (FCP)
  // Measures the time from page load to when any content is rendered
  onFCP((metric) => {
    callback('FCP', metric.value)
  }, { reportAllChanges: true })

  // Largest Contentful Paint (LCP) - Core Web Vital
  // Measures loading performance - time to render the largest content element
  // Good: <2.5s, Needs Improvement: 2.5-4s, Poor: >4s
  // Note: reportAllChanges=true reports LCP as larger elements become visible
  onLCP((metric) => {
    callback('LCP', metric.value)
  }, { reportAllChanges: true })

  // Cumulative Layout Shift (CLS) - Core Web Vital
  // Measures visual stability - unexpected layout shifts
  // Good: <0.1, Needs Improvement: 0.1-0.25, Poor: >0.25
  // Note: reportAllChanges=true reports CLS as it accumulates, not just on page hide
  onCLS((metric) => {
    callback('CLS', metric.value)
  }, { reportAllChanges: true })

  // Interaction to Next Paint (INP) - Core Web Vital (replaces FID)
  // Measures responsiveness - delay between user interaction and visual feedback
  // Good: <200ms, Needs Improvement: 200-500ms, Poor: >500ms
  // Note: INP only reports after user interaction (click, tap, keypress)
  // reportAllChanges=true reports each interaction, not just the worst one
  onINP((metric) => {
    callback('INP', metric.value)
  }, { reportAllChanges: true })

  // ========================================
  // Custom Metrics
  // ========================================

  // Time to Interactive (TTI) - approximate using load event
  // Note: TTI was removed from web-vitals, using custom implementation
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
 * Record a performance metric to the API
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

/**
 * Measure soft navigation (client-side route changes)
 *
 * For SPA-style navigations, traditional web vitals like TTFB/FCP don't apply.
 * This function measures:
 * - LOAD_TIME: Time from navigation start to component render
 * - API_DURATION: Tracks API calls made during/after navigation
 */
export function measureSoftNavigation(
  callback: (metric: MetricType, value: number) => void,
  navigationStartTime?: number
): () => void {
  if (typeof window === 'undefined') return () => {}

  const startTime = navigationStartTime ?? performance.now()

  // Track API calls made after this soft navigation
  let apiDurations: number[] = []
  let apiObserver: PerformanceObserver | null = null
  let apiTimer: ReturnType<typeof setTimeout> | null = null
  let isFirstApiReport = true
  const API_WINDOW_MS = 7000

  const reportApiDuration = () => {
    if (apiDurations.length > 0) {
      const avgDuration = apiDurations.reduce((sum, d) => sum + d, 0) / apiDurations.length
      callback('API_DURATION', avgDuration)
    }
    apiDurations = []
    apiTimer = null
  }

  try {
    if (typeof PerformanceObserver !== 'undefined') {
      apiObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries() as PerformanceResourceTiming[]
        const apiEntries = entries.filter(entry =>
          entry.name.includes('/api/') && entry.startTime >= startTime
        )

        for (const entry of apiEntries) {
          apiDurations.push(entry.duration)

          if (isFirstApiReport) {
            isFirstApiReport = false
            reportApiDuration()
          } else if (!apiTimer) {
            apiTimer = setTimeout(reportApiDuration, API_WINDOW_MS)
          }
        }
      })
      apiObserver.observe({ type: 'resource', buffered: false })
    }
  } catch (e) {
    console.warn('Soft navigation API tracking failed:', e)
  }

  // Report LOAD_TIME after React finishes rendering (next frame)
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const loadTime = performance.now() - startTime
      callback('LOAD_TIME', loadTime)
    })
  })

  // Return cleanup function
  return () => {
    if (apiTimer) {
      clearTimeout(apiTimer)
    }
    if (apiObserver) {
      reportApiDuration()
      apiObserver.disconnect()
    }
  }
}
