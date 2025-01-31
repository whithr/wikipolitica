// src/components/orders/executive-orders-context.tsx

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  FC,
} from 'react'
import { useExecutiveOrdersData } from '@/hooks/useExecutiveOrdersData'
import { Tables } from '@/lib/database.types'

// Define the structure of an executive order.
// Ensure this matches your actual data structure.
interface ExecutiveOrder extends Tables<'executive_actions'> {
  // Add any additional fields if necessary
}

interface ExecutiveOrdersContextValue {
  isLoading: boolean
  data: ExecutiveOrder[] | undefined
  selectedOrderId: number
  setSelectedOrderId: React.Dispatch<React.SetStateAction<number>>
  searchTerm: string
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>
  groupedOrders: Record<string, ExecutiveOrder[]>
}

const ExecutiveOrdersContext =
  createContext<ExecutiveOrdersContextValue | null>(null)

interface ExecutiveOrdersProviderProps {
  children: ReactNode
}

export const ExecutiveOrdersProvider: FC<ExecutiveOrdersProviderProps> = ({
  children,
}) => {
  const { data, isLoading } = useExecutiveOrdersData()

  const [selectedOrderId, setSelectedOrderId] = useState<number>(-1)
  const [searchTerm, setSearchTerm] = useState<string>('') // Search state

  // Filter data based on search term
  const filteredData: ExecutiveOrder[] = useMemo(() => {
    if (!data) return []
    return data.filter((order) =>
      order.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [data, searchTerm])

  // Group filtered data by publication date
  const groupedOrders: Record<string, ExecutiveOrder[]> = useMemo(() => {
    return filteredData.reduce<Record<string, ExecutiveOrder[]>>(
      (groups, order) => {
        const date = order.pub_date
          ? new Date(order.pub_date).toLocaleDateString()
          : 'Unknown Date'
        if (!groups[date]) {
          groups[date] = []
        }
        groups[date].push(order)
        return groups
      },
      {}
    )
  }, [filteredData])

  const value: ExecutiveOrdersContextValue = useMemo(() => {
    return {
      isLoading,
      data,
      selectedOrderId,
      setSelectedOrderId,
      searchTerm,
      setSearchTerm,
      groupedOrders,
    }
  }, [
    isLoading,
    data,
    selectedOrderId,
    setSelectedOrderId,
    searchTerm,
    setSearchTerm,
    groupedOrders,
  ])

  return (
    <ExecutiveOrdersContext.Provider value={value}>
      {children}
    </ExecutiveOrdersContext.Provider>
  )
}

/**
 * Hook to consume the ExecutiveOrdersContext in child components.
 */
export const useExecutiveOrders = () => {
  const context = useContext(ExecutiveOrdersContext)
  if (!context) {
    throw new Error(
      'useExecutiveOrders must be used within an ExecutiveOrdersProvider'
    )
  }
  return context
}
