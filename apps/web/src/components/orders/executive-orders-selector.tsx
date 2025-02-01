// components/ExecutiveOrdersSelector.tsx

import { useMemo } from 'react'
import { useLoaderData, useParams } from '@tanstack/react-router'
import { OrderCard } from './order-card'
import { Separator } from '../ui/separator'
import { formatDateWithSuffix } from '@/lib/time.utils'
import { useExecutiveOrdersStore } from '@/stores/executiveActionsStore'
import { ExecutiveOrderType } from '@/hooks/executive-orders'

export const ExecutiveOrdersSelector = () => {
  // Retrieve loader data using your router
  const data = useLoaderData({ from: '/executive/orders' })
  const { id } = useParams({ strict: false })

  // Get the search term from your store (or elsewhere)
  const searchTerm = useExecutiveOrdersStore((state) => state.searchTerm)

  // Filter the orders based on the search term (using the order title)
  const filteredData: ExecutiveOrderType[] = useMemo(() => {
    if (!data) return []
    return data.filter(
      (order) =>
        order.title &&
        order.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [data, searchTerm])

  // Group the filtered orders by signing date.
  const groupedOrders = useMemo((): Record<string, ExecutiveOrderType[]> => {
    return filteredData.reduce(
      (groups, order) => {
        // Use an ISO date string (YYYY-MM-DD) for grouping.
        const dateKey = order.signing_date
          ? new Date(order.signing_date).toISOString().split('T')[0]
          : 'Unknown Date'

        if (!groups[dateKey]) {
          groups[dateKey] = []
        }
        groups[dateKey].push(order)
        return groups
      },
      {} as Record<string, ExecutiveOrderType[]>
    ) // Explicitly type the initial value.
  }, [filteredData])

  console.log(data)
  // Convert the grouped orders object into an array of entries and sort them by date (most recent first).
  const groupedOrdersArray = useMemo((): [string, ExecutiveOrderType[]][] => {
    return Object.entries(groupedOrders).sort(([dateA], [dateB]) => {
      // Push "Unknown Date" to the bottom.
      if (dateA === 'Unknown Date') return 1
      if (dateB === 'Unknown Date') return -1

      // Sort descending: most recent dates first.
      return new Date(dateB).getTime() - new Date(dateA).getTime()
    })
  }, [groupedOrders])

  return (
    <div className='flex h-fit w-full flex-col gap-4 p-4 text-foreground'>
      {groupedOrdersArray.length > 0 ? (
        groupedOrdersArray.map(([date, orders]) => (
          <div key={date} className='flex flex-col gap-2'>
            <h2 className='pb-1 text-lg font-bold'>
              {formatDateWithSuffix(date)}
            </h2>
            <Separator />
            {/* Render each order as an OrderCard */}
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} selectedOrderId={id} />
            ))}
          </div>
        ))
      ) : (
        <p>No executive orders or actions found.</p>
      )}
    </div>
  )
}
