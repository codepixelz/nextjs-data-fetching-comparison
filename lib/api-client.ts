/**
 * API Client with Performance Tracking
 *
 * Wrapper around fetch that adds timing information and standardized error handling
 */

export interface FetchOptions extends RequestInit {
  timeout?: number
}

export interface TimedResponse<T> extends Response {
  data?: T
  duration?: number
}

/**
 * Fetch with timing information
 */
export async function fetchWithTiming<T = unknown>(
  url: string,
  options?: FetchOptions
): Promise<{ data: T; duration: number; response: Response }> {
  const startTime = performance.now()
  const { timeout = 10000, ...fetchOptions } = options || {}

  try {
    // Create abort controller for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    const duration = performance.now() - startTime

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()

    return {
      data,
      duration,
      response,
    }
  } catch (error) {
    const duration = performance.now() - startTime

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error(`Request timeout after ${timeout}ms`)
      }
      throw error
    }

    throw new Error('Unknown error occurred')
  }
}

/**
 * Generate a unique request ID
 */
export function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Sleep utility for simulating delays
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
