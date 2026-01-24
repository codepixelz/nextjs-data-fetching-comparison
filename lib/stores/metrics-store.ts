'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ApproachType, MetricType } from '@/types'

export interface MetricValue {
  current: number | null
  avg: number | null
  min: number | null
  max: number | null
  count: number
  lastUpdated: string | null
}

export interface ApproachMetrics {
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
  lastUpdated: null,
}

const initialApproachMetrics: ApproachMetrics = {
  TTFB: { ...initialMetricValue },
  FCP: { ...initialMetricValue },
  LCP: { ...initialMetricValue },
  TTI: { ...initialMetricValue },
  LOAD_TIME: { ...initialMetricValue },
  API_DURATION: { ...initialMetricValue },
}

interface MetricsState {
  metrics: Record<ApproachType, ApproachMetrics>
  updateMetric: (approach: ApproachType, metric: MetricType, value: number) => void
  resetApproach: (approach: ApproachType) => void
  resetAll: () => void
  getComparisonData: (metric: MetricType) => Array<{ approach: ApproachType; value: number | null; count: number }>
}

const approaches: ApproachType[] = [
  'spa-client',
  'hybrid-ssr-client',
  'pure-ssr',
  'tanstack-client',
  'tanstack-prefetch-await',
  'tanstack-prefetch-no-await',
]

const createInitialMetrics = (): Record<ApproachType, ApproachMetrics> => {
  const metrics = {} as Record<ApproachType, ApproachMetrics>
  approaches.forEach(approach => {
    metrics[approach] = JSON.parse(JSON.stringify(initialApproachMetrics))
  })
  return metrics
}

export const useMetricsStore = create<MetricsState>()(
  persist(
    (set, get) => ({
      metrics: createInitialMetrics(),

      updateMetric: (approach: ApproachType, metric: MetricType, value: number) => {
        set((state) => {
          const currentMetrics = state.metrics[approach][metric]
          const newCount = currentMetrics.count + 1
          const newAvg = currentMetrics.avg !== null
            ? (currentMetrics.avg * currentMetrics.count + value) / newCount
            : value
          const newMin = currentMetrics.min !== null ? Math.min(currentMetrics.min, value) : value
          const newMax = currentMetrics.max !== null ? Math.max(currentMetrics.max, value) : value

          return {
            metrics: {
              ...state.metrics,
              [approach]: {
                ...state.metrics[approach],
                [metric]: {
                  current: value,
                  avg: newAvg,
                  min: newMin,
                  max: newMax,
                  count: newCount,
                  lastUpdated: new Date().toISOString(),
                },
              },
            },
          }
        })
      },

      resetApproach: (approach: ApproachType) => {
        set((state) => ({
          metrics: {
            ...state.metrics,
            [approach]: JSON.parse(JSON.stringify(initialApproachMetrics)),
          },
        }))
      },

      resetAll: () => {
        set({ metrics: createInitialMetrics() })
      },

      getComparisonData: (metric: MetricType) => {
        const state = get()
        return approaches.map(approach => ({
          approach,
          value: state.metrics[approach][metric].avg,
          count: state.metrics[approach][metric].count,
        }))
      },
    }),
    {
      name: 'metrics-storage',
      partialize: (state) => ({ metrics: state.metrics }),
    }
  )
)

// Metric descriptions for tooltips
export const metricDescriptions: Record<MetricType, { name: string; description: string; unit: string; good: string; moderate: string }> = {
  TTFB: {
    name: 'Time to First Byte',
    description: 'Measures the time from when the browser requests a page to when it receives the first byte of information from the server. Lower values indicate faster server response.',
    unit: 'ms',
    good: '< 200ms',
    moderate: '200-500ms',
  },
  FCP: {
    name: 'First Contentful Paint',
    description: 'Measures when the browser renders the first piece of content from the DOM, giving users the first feedback that the page is loading.',
    unit: 'ms',
    good: '< 1.8s',
    moderate: '1.8-3s',
  },
  LCP: {
    name: 'Largest Contentful Paint',
    description: 'Measures when the largest content element (image, video, or text block) becomes visible. This is a Core Web Vital and key indicator of perceived load speed.',
    unit: 'ms',
    good: '< 2.5s',
    moderate: '2.5-4s',
  },
  TTI: {
    name: 'Time to Interactive',
    description: 'Measures how long it takes for the page to become fully interactive, meaning it responds quickly to user input.',
    unit: 'ms',
    good: '< 3.8s',
    moderate: '3.8-7.3s',
  },
  LOAD_TIME: {
    name: 'Total Load Time',
    description: 'Measures the total time from navigation start until the page is fully loaded, including all resources.',
    unit: 'ms',
    good: '< 2s',
    moderate: '2-4s',
  },
  API_DURATION: {
    name: 'API Duration',
    description: 'Measures the time taken for API requests to complete. Only recorded for approaches that make client-side API calls.',
    unit: 'ms',
    good: '< 300ms',
    moderate: '300-800ms',
  },
}

// Threshold values for color coding
export const metricThresholds: Record<MetricType, { good: number; moderate: number }> = {
  TTFB: { good: 200, moderate: 500 },
  FCP: { good: 1800, moderate: 3000 },
  LCP: { good: 2500, moderate: 4000 },
  TTI: { good: 3800, moderate: 7300 },
  LOAD_TIME: { good: 2000, moderate: 4000 },
  API_DURATION: { good: 300, moderate: 800 },
}

export function getMetricColor(metric: MetricType, value: number): string {
  const t = metricThresholds[metric]
  if (value <= t.good) return 'text-green-500'
  if (value <= t.moderate) return 'text-yellow-500'
  return 'text-red-500'
}
