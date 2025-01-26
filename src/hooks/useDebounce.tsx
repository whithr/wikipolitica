import { useState, useEffect } from 'react'

/**
 * Delays updating a value until after the specified delay has passed
 * without it changing again.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    // Start a timer
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // If `value` changes before the delay time is up,
    // clear the timer and start again
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
