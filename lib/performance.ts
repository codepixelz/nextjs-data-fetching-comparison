'use client'

import { ApproachType, MetricType, PerformanceMetric } from '@/types'

/**
 * Performance Tracking Utilities
 *
 * Client-side performance measurement using Performance Observer API
 */

export interface WebVitals {
  TTFB: number | null // Time to First Byte
  FCP: number | null // First Contentful Paint
  LCP: number | null // Largest Contentful Paint
  TTI: number | null // Time to Interactive
}

/**
 * Measure Web Vitals using Performance Observer API
 */
export function measureWebVitals(callback: (metric: MetricType, value: number) => void) {
  // Only run in browser
  if (typeof window === 'undefined') return

  // Time to First Byte (TTFB)
  try {
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    if (navigationEntry) {
      const ttfb = navigationEntry.responseStart - navigationEntry.requestStart
      if (ttfb > 0) {
        callback('TTFB', ttfb)
      }
    }
  } catch (e) {
    console.warn('TTFB measurement failed:', e)
  }

  // First Contentful Paint (FCP) - check existing entries first
  try {
    const existingPaintEntries = performance.getEntriesByType('paint')
    const fcpEntry = existingPaintEntries.find(entry => entry.name === 'first-contentful-paint')
    if (fcpEntry) {
      callback('FCP', fcpEntry.startTime)
    } else if (typeof PerformanceObserver !== 'undefined') {
      // Observe for future paint events
      const paintObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            callback('FCP', entry.startTime)
            paintObserver.disconnect()
          }
        }
      })
      paintObserver.observe({ entryTypes: ['paint'] })
    }
  } catch (e) {
    console.warn('FCP measurement failed:', e)
  }

  // Largest Contentful Paint (LCP)
  try {
    if (typeof PerformanceObserver !== 'undefined') {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        if (entries.length > 0) {
          const lastEntry = entries[entries.length - 1] as PerformanceEntry & { renderTime?: number; loadTime?: number }
          const lcp = lastEntry.renderTime || lastEntry.loadTime || lastEntry.startTime
          callback('LCP', lcp)
        }
      })
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

      // LCP is finalized when page becomes hidden or after load
      const finalizeLCP = () => {
        lcpObserver.disconnect()
      }
      document.addEventListener('visibilitychange', finalizeLCP, { once: true })
      window.addEventListener('pagehide', finalizeLCP, { once: true })
    }
  } catch (e) {
    console.warn('LCP measurement failed:', e)
  }

  // Time to Interactive (TTI) - approximate using load event
  try {
    if (document.readyState === 'complete') {
      // Page already loaded
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      if (navigationEntry && navigationEntry.loadEventEnd > 0) {
        callback('TTI', navigationEntry.loadEventEnd)
      } else {
        callback('TTI', performance.now())
      }
    } else {
      window.addEventListener('load', () => {
        // Give a small delay to ensure JS execution is complete
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
