import { createContext, useContext, ReactNode, useMemo, FC } from 'react'
import { useExecutiveOrdersData } from '@/hooks/useExecutiveOrdersData'
import { Tables } from '@/lib/database.types'
import { useExecutiveOrdersStore } from '@/stores/executiveActionsStore'

interface ExecutiveOrdersContextValue {
  isLoading: boolean
  data: Tables<'executive_actions'>[] | undefined
  groupedOrders: Record<string, Tables<'executive_actions'>[]>
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

  const searchTerm = useExecutiveOrdersStore((state) => state.searchTerm)

  // Filter data based on search term
  const filteredData: Tables<'executive_actions'>[] = useMemo(() => {
    if (!data) return []
    return data.filter((order) =>
      order.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [data, searchTerm])

  // Group filtered data by publication date
  const groupedOrders: Record<string, Tables<'executive_actions'>[]> =
    useMemo(() => {
      return filteredData.reduce<Record<string, Tables<'executive_actions'>[]>>(
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
      groupedOrders,
    }
  }, [isLoading, data, groupedOrders])

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
