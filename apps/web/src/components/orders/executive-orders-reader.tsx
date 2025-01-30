import { cn } from '@/lib/utils'
import { useExecutiveOrders } from './executive-orders-context'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cleanHTML } from '@/lib/html.utils'

import styles from './orders.module.css'
import { useTheme } from '../theme-provider'

export const ExecutiveOrdersReader = ({
  className,
}: {
  className?: string
}) => {
  const { data, selectedOrderId } = useExecutiveOrders()
  const { resolvedTheme } = useTheme()

  if (!data || data.length === 0) return <p>No data found.</p>

  const order = data.find((o) => o.id === selectedOrderId)
  if (!order)
    return (
      <div className='mx-auto h-full w-full max-w-[800px] flex-1 content-center border border-dashed border-border bg-muted p-4 text-center text-foreground opacity-50'>
        Select an order to read...
      </div>
    )

  const cleanedHTML = order.full_html ? cleanHTML(order.full_html) : ''

  return (
    <div
      className={cn(
        'mx-auto max-w-[800px] rounded-sm border border-border bg-background p-4 shadow-sm',
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
