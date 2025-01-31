// components/ExecutiveOrdersSelector.tsx
import { useMemo } from 'react'
import { useExecutiveOrders } from './executive-orders-context'
import { OrderCard } from './order-card'
import { formatDateWithSuffix } from '@/lib/time.utils' // Adjust the import path as needed
import { Tables } from '@/lib/database.types'
import { Separator } from '../ui/separator'
import { Skeleton } from '../ui/skeleton'

// Define the type for grouped orders
interface GroupedOrders {
  date: string | null // Formatted date string
  orders: Tables<'executive_actions'>[]
}

export const ExecutiveOrdersSelector = () => {
  const { isLoading, data, selectedOrderId, setSelectedOrderId } =
    useExecutiveOrders()

  // Memoize the grouped data for performance optimization
  const groupedData: GroupedOrders[] = useMemo(() => {
    if (!data) return []

    // Create a map to group orders by their date (YYYY-MM-DD)
    const groups: { [key: string]: Tables<'executive_actions'>[] } = {}

    data.forEach((order) => {
      if (order.pub_date) {
        // Extract the date part (YYYY-MM-DD)
        const datePart = new Date(order.pub_date).toISOString().split('T')[0]
        if (!groups[datePart]) {
          groups[datePart] = []
        }
        groups[datePart].push(order)
      } else {
        // Handle orders with null pub_date by grouping them under 'Unknown Date'
        if (!groups['unknown']) {
          groups['unknown'] = []
        }
        groups['unknown'].push(order)
      }
    })

    // Convert the groups map to an array and sort by date descending
    const sortedGroups: GroupedOrders[] = Object.keys(groups)
      .map((dateKey) => {
        const formattedDate =
          dateKey === 'unknown'
            ? 'Unknown Date'
            : formatDateWithSuffix(new Date(dateKey).toISOString())

        return {
          date: formattedDate,
          orders: groups[dateKey],
        }
      })
      .sort((a, b) => {
        if (a.date === 'Unknown Date' || !a.date) return 1
        if (b.date === 'Unknown Date' || !b.date) return -1
        // Parse the dates back to Date objects for comparison
        const dateA = new Date(a.date)
        const dateB = new Date(b.date)
        return dateB.getTime() - dateA.getTime() // Descending order
      })

    return sortedGroups
  }, [data])

  return (
    <div className='flex h-fit max-w-[400px] flex-auto flex-col gap-4 rounded-sm border border-border bg-background p-4 text-foreground shadow-sm'>
      {isLoading ? (
        <div className='flex h-full w-[400px] flex-col gap-2'>
          <Skeleton className='h-6 w-2/12 rounded-sm' />
          <Skeleton className='h-6 w-4/12 rounded-sm' />
          <Separator />
          <Skeleton className='h-6 w-4/12 rounded-sm' />
          <Skeleton className='h-6 w-7/12 rounded-sm' />
          <Separator />
          <Skeleton className='h-6 w-5/12 rounded-sm' />
          <Skeleton className='h-6 w-9/12 rounded-sm' />
          <Skeleton className='h-6 w-2/12 rounded-sm' />
          <Skeleton className='h-6 w-4/12 rounded-sm' />
          <Separator />
          <Skeleton className='h-6 w-4/12 rounded-sm' />
          <Skeleton className='h-6 w-7/12 rounded-sm' />
          <Separator />
          <Skeleton className='h-6 w-5/12 rounded-sm' />
          <Skeleton className='h-6 w-9/12 rounded-sm' />
        </div>
      ) : (
        groupedData.map((group) => (
          <div key={group.date} className='flex flex-col gap-2'>
            {/* Date Header */}
            <h2 className='pb-1 text-lg font-bold'>{group.date}</h2>
            <Separator />

            {/* Order Cards */}
            {group.orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                selectedOrderId={selectedOrderId}
                setSelectedOrderId={setSelectedOrderId}
              />
            ))}
          </div>
        ))
      )}
    </div>
  )
}
