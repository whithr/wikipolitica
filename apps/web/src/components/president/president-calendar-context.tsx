import { createContext, useContext, ReactNode, useMemo, FC } from 'react'
import { useTrumpCalendarData } from '@/hooks/useTrumpCalendarData'
import { useFilteredCalendarData } from '@/hooks/useFilteredTrumpCalendarData'
import type { PoolReportSchedules } from '@/types/trumpCalendar.types'
import { usePresidentCalendarStore } from '@/stores/presidentCalendarStore'

// The shape of all the data we want to share
interface PresidentCalendarContextValue {
  // Loading state from fetching supabase data
  isLoading: boolean

  // Full filtered set of schedule events after applying date-range
  filteredData: PoolReportSchedules

  // from useFilteredCalendarData
  sortedDays: string[]
  sortedEventsByDay: Record<string, PoolReportSchedules>
  highlightDay: string | null
  highlightTime: number | null
  minDate: Date
  maxDate: Date
}

// Create the context with an initial null (to force usage inside a provider)
const PresidentCalendarContext =
  createContext<PresidentCalendarContextValue | null>(null)

interface PresidentCalendarProviderProps {
  children: ReactNode
}

/**
 * Provider that fetches the Supabase data, handles date-range state,
 * and computes the filtered/sorted data with useFilteredCalendarData.
 */
export const PresidentCalendarProvider: FC<PresidentCalendarProviderProps> = ({
  children,
}) => {
  // 1) Load raw schedule data from your Supabase table
  const { data: rawData, isLoading } = useTrumpCalendarData()
  const selectedRange = usePresidentCalendarStore(
    (state) => state.selectedRange
  )
  // 3) Process the data with your existing useFilteredCalendarData hook
  const {
    sortedDays,
    sortedEventsByDay,
    highlightDay,
    highlightTime,
    minDate,
    maxDate,
    filteredData,
  } = useFilteredCalendarData(rawData, selectedRange)

  // 4) Memoize the context value
  //    (though often it's fine to just return an object. Up to you.)
  const value: PresidentCalendarContextValue = useMemo(() => {
    return {
      isLoading,
      filteredData,
      sortedDays,
      sortedEventsByDay,
      highlightDay,
      highlightTime,
      minDate,
      maxDate,
    }
  }, [
    isLoading,
    filteredData,
    sortedDays,
    sortedEventsByDay,
    highlightDay,
    highlightTime,
    minDate,
    maxDate,
  ])

  return (
    <PresidentCalendarContext.Provider value={value}>
      {children}
    </PresidentCalendarContext.Provider>
  )
}

/**
 * Hook to consume the PresidentCalendarContext in child components.
 */
export const usePresidentCalendar = () => {
  const context = useContext(PresidentCalendarContext)
  if (!context) {
    throw new Error(
      'usePresidentCalendar must be used within a PresidentCalendarProvider'
    )
  }
  return context
}
