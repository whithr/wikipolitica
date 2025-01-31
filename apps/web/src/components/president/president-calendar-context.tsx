import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  FC,
  useEffect,
} from 'react'
import { useTrumpCalendarData } from '@/hooks/useTrumpCalendarData'
import { useFilteredCalendarData } from '@/hooks/useFilteredTrumpCalendarData'
import type { PoolReportSchedules } from '@/types/trumpCalendar.types'
import type { DateRange } from 'react-day-picker'
import { parseTimeToMinutes } from '@/lib/time.utils'

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

  selectedDayId: number
  setSelectedDayId: React.Dispatch<React.SetStateAction<number>>

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
    to: new Date(new Date().setDate(new Date().getDate() + 1)), // Today + 1
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
  const [selectedDayId, setSelectedDayId] = useState<number>(-1)

  useEffect(() => {
    if (filteredData.length > 0) {
      const potentialSelection = filteredData?.findIndex(
        (d) =>
          parseTimeToMinutes(d.time) === highlightTime &&
          d.date === highlightDay
      )
      if (potentialSelection !== -1) {
        setSelectedDayId(filteredData[potentialSelection]?.id)
      } else {
        setSelectedDayId(filteredData[0]?.id)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredData])

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
      selectedDayId,
      setSelectedDayId,
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
    selectedDayId,
    setSelectedDayId,
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
