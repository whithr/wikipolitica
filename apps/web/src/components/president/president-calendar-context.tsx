import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  FC,
} from 'react'
import { useTrumpCalendarData } from '@/hooks/useTrumpCalendarData'
import { useFilteredCalendarData } from '@/hooks/useFilteredTrumpCalendarData'
import type { PoolReportSchedules } from '@/types/trumpCalendar.types'
import type { DateRange } from 'react-day-picker'

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

  // The date range selected by the user
  selectedRange: DateRange
  setSelectedRange: (range: DateRange) => void
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

  // 2) Date-range state (with an initially undefined range or your choice)
  const [selectedRange, setSelectedRange] = useState<DateRange>({
    from: new Date(new Date().setDate(new Date().getDate() - 7)), // 7 days before today
    to: new Date(), // Today
  })

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
      selectedRange,
      setSelectedRange,
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
    selectedRange,
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
