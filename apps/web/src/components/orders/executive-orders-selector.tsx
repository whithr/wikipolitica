// components/ExecutiveOrdersSelector.tsx

import { useMemo } from 'react'
import { useExecutiveOrders } from './executive-orders-context'
import { OrderCard } from './order-card'
import { Separator } from '../ui/separator'
import { Skeleton } from '../ui/skeleton'
import { formatDateWithSuffix } from '@/lib/time.utils'

export const ExecutiveOrdersSelector = () => {
  const { isLoading, groupedOrders, selectedOrderId, setSelectedOrderId } =
    useExecutiveOrders()

  // Convert groupedOrders to an array for rendering
  const groupedOrdersArray: [string, (typeof groupedOrders)[string]][] =
    useMemo(() => Object.entries(groupedOrders), [groupedOrders])

  return (
    <div className='flex h-fit min-w-[300px] max-w-[300px] flex-auto flex-col gap-4 p-4 text-foreground sm:min-w-[400px] sm:max-w-[400px]'>
      {isLoading ? (
        <div className='flex h-full w-[400px] flex-col gap-2'>
          {/* Skeleton placeholders while loading */}
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
      ) : groupedOrdersArray.length > 0 ? (
        groupedOrdersArray.map(([date, orders]) => (
          <div key={date} className='flex flex-col gap-2'>
            <h2 className='pb-1 text-lg font-bold'>
              {formatDateWithSuffix(date)}
            </h2>
            <Separator />

            {/* Order Cards */}
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                selectedOrderId={selectedOrderId}
                setSelectedOrderId={setSelectedOrderId}
              />
            ))}
          </div>
        ))
      ) : (
        <p>No executive orders found.</p>
      )}
    </div>
  )
}
