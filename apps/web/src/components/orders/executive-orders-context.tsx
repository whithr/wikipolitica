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

interface ExecutiveOrdersContextValue {
  isLoading: boolean
  data: Tables<'executive_actions'>[] | undefined
  selectedOrderId: number
  setSelectedOrderId: React.Dispatch<React.SetStateAction<number>>
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

  const value: ExecutiveOrdersContextValue = useMemo(() => {
    return {
      isLoading,
      data,
      selectedOrderId,
      setSelectedOrderId,
    }
  }, [isLoading, data, selectedOrderId, setSelectedOrderId])

  return (
    <ExecutiveOrdersContext.Provider value={value}>
      {children}
    </ExecutiveOrdersContext.Provider>
  )
}

/**
 * Hook to consume the PresidentCalendarContext in child components.
 */
export const useExecutiveOrders = () => {
  const context = useContext(ExecutiveOrdersContext)
  if (!context) {
    throw new Error(
      'useExecutiveOrders must be used within a useExecutiveOrders'
    )
  }
  return context
}
