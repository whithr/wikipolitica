import { Tables } from '@/lib/database.types'
import { cn } from '@/lib/utils'
import { Link } from '@tanstack/react-router'

type OrderCardProps = {
  order: Tables<'executive_actions'>
  selectedOrderId: number
}

export const OrderCard = ({ order, selectedOrderId }: OrderCardProps) => {
  return (
    <Link
      to='/executive/actions/$id' // Reference the dynamic route
      params={{ id: String(order.id) }} // Pass the dynamic parameter
      className={cn(
        'flex w-full flex-col items-start gap-2 rounded-sm border p-2 shadow-sm transition-colors duration-300 hover:cursor-pointer hover:bg-primary/25',
        selectedOrderId === order.id
          ? 'border-primary bg-primary/50 hover:bg-primary/50'
          : 'border-border bg-muted/50'
      )}
    >
      <div className='break-words'>{order.title}</div>
    </Link>
  )
}
