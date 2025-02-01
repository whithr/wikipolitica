import { ExecutiveOrderType } from '@/hooks/executive-orders'
import { cn, stripExecutiveOrder } from '@/lib/utils'
import { Link } from '@tanstack/react-router'

type OrderCardProps = {
  order: ExecutiveOrderType
  selectedOrderId?: string
}

export const OrderCard = ({ order, selectedOrderId }: OrderCardProps) => {
  return (
    <Link
      to='/executive/orders/$id' // Reference the dynamic route
      params={{ id: String(order.id) }} // Pass the dynamic parameter
      className={cn(
        'flex w-full flex-col items-start gap-2 rounded-sm border p-2 shadow-sm transition-colors duration-300 hover:cursor-pointer hover:bg-primary/25',
        selectedOrderId === order.id
          ? 'border-primary bg-primary/50 hover:bg-primary/50'
          : 'border-border bg-muted/50'
      )}
    >
      <div className='break-words'>
        {stripExecutiveOrder(order.presidency_project_title)}
      </div>
    </Link>
  )
}
