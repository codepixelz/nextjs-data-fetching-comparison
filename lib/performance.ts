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
  const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
  if (navigationEntry) {
    const ttfb = navigationEntry.responseStart - navigationEntry.requestStart
    callback('TTFB', ttfb)
  }

  // First Contentful Paint (FCP)
  const paintObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.name === 'first-contentful-paint') {
        callback('FCP', entry.startTime)
        paintObserver.disconnect()
      }
    }
  })
  paintObserver.observe({ entryTypes: ['paint'] })

  // Largest Contentful Paint (LCP)
  const lcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries()
    const lastEntry = entries[entries.length - 1] as PerformanceEntry & { renderTime?: number; loadTime?: number }
    const lcp = lastEntry.renderTime || lastEntry.loadTime || lastEntry.startTime
    callback('LCP', lcp)
  })
  lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

  // Time to Interactive (TTI) - approximate using load event
  window.addEventListener('load', () => {
    const tti = performance.now()
    callback('TTI', tti)
  })
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
