// components/ExecutiveOrdersReader.tsx
import { cn } from '@/lib/utils'
import { useExecutiveOrdersData } from '@/hooks/useExecutiveOrdersData'
import { useExecutiveOrderDetails } from '@/hooks/useExecutiveOrderDetails'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cleanHTML } from '@/lib/html.utils'

import styles from './orders.module.css'
import { useTheme } from '../theme-provider'
import { useExecutiveOrdersStore } from '@/stores/executiveActionsStore'
import { Skeleton } from '../ui/skeleton'

export const ExecutiveOrdersReader = ({
  className,
}: {
  className?: string
}) => {
  const { data, isLoading, isError, error } = useExecutiveOrdersData()
  const selectedOrderId = useExecutiveOrdersStore(
    (state) => state.selectedOrderId
  )
  const { resolvedTheme } = useTheme()

  // Fetch the full_html for the selected order
  const {
    data: orderDetails,
    isLoading: isDetailsLoading,
    isError: isDetailsError,
    error: detailsError,
  } = useExecutiveOrderDetails(selectedOrderId)

  if (isLoading) return <p>Loading executive orders...</p>
  if (isError) return <p>Error: {error.message}</p>
  if (!data || data.length === 0) return <p>No data found.</p>

  const order = data.find((o) => o.id === selectedOrderId)

  if (!order) {
    return (
      <div className='flex w-full items-center justify-center rounded-sm border-8 border-dashed border-primary bg-primary/10 p-4 text-center text-foreground opacity-50 transition duration-500'>
        <div className='flex-1'>Select an order to read...</div>
      </div>
    )
  }

  if (isDetailsLoading) {
    return (
      <div className='flex w-full flex-col items-center gap-5 rounded-sm border-8 border-dashed border-primary bg-primary/10 p-4 pt-12 text-center text-foreground opacity-50 transition duration-500'>
        {/* Title Skeleton */}
        <Skeleton className='h-6 w-2/12 rounded-md' />

        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className='flex w-full flex-col items-center gap-2'>
            <Skeleton className='h-4 w-10/12 rounded-md' />
            <Skeleton className='h-4 w-11/12 rounded-md' />
            <Skeleton className='h-4 w-9/12 rounded-md' />
            <Skeleton className='h-4 w-8/12 rounded-md' />
          </div>
        ))}
      </div>
    )
  }

  if (isDetailsError) {
    return (
      <div className='flex w-full items-center justify-center rounded-sm border-8 border-dashed border-primary bg-primary/10 p-4 text-center text-foreground opacity-50 transition duration-500'>
        Error loading order details: {detailsError.message}
      </div>
    )
  }

  const cleanedHTML = orderDetails?.full_html
    ? cleanHTML(orderDetails.full_html)
    : ''

  return (
    <div
      className={cn(
        'mx-auto flex w-full max-w-[800px] flex-1 flex-col overflow-y-auto rounded-sm border border-border bg-background p-4 shadow-sm transition duration-500',
        className
      )}
    >
      <ScrollArea className='h-[calc(100dvh-150px)]'>
        <div
          className={cn(
            'm-2 text-foreground',
            resolvedTheme === 'dark'
              ? styles.orderCardDark
              : styles.orderCardLight
          )}
          dangerouslySetInnerHTML={{
            __html: cleanedHTML,
          }}
        />
      </ScrollArea>
    </div>
  )
}
