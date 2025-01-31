// components/ExecutiveOrdersSelector.tsx

import { useMemo } from 'react'
import { useExecutiveOrders } from './executive-orders-context'
import { OrderCard } from './order-card'
import { Separator } from '../ui/separator'
import { Skeleton } from '../ui/skeleton'
import { formatDateWithSuffix } from '@/lib/time.utils'
import { useExecutiveOrdersStore } from '@/stores/executiveActionsStore'

export const ExecutiveOrdersSelector = () => {
  const { isLoading, groupedOrders } = useExecutiveOrders()
  const selectedOrderId = useExecutiveOrdersStore(
    (state) => state.selectedOrderId
  )
  const setSelectedOrderId = useExecutiveOrdersStore(
    (state) => state.setSelectedOrderId
  )

  // Convert groupedOrders to an array for rendering
  const groupedOrdersArray: [string, (typeof groupedOrders)[string]][] =
    useMemo(() => Object.entries(groupedOrders), [groupedOrders])

  return (
    <div className='flex h-fit w-full flex-col gap-4 p-4 text-foreground'>
      {isLoading ? (
        <div className='flex h-full w-[300px] flex-col gap-2 sm:w-[400px]'>
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
        <p>No executive orders or actions found.</p>
      )}
    </div>
  )
}
