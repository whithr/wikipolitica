import { Tables } from '@/lib/database.types'
import { cn } from '@/lib/utils'

type OrderCardProps = {
  order: Tables<'executive_actions'>
  selectedOrderId: number
  setSelectedOrderId: React.Dispatch<React.SetStateAction<number>>
}

export const OrderCard = ({
  order,
  selectedOrderId,
  setSelectedOrderId,
}: OrderCardProps) => {
  return (
    <div
      onClick={() =>
        selectedOrderId === order.id
          ? setSelectedOrderId(-1)
          : setSelectedOrderId(order.id)
      }
      className={cn(
        'flex w-full flex-col items-start gap-2 rounded-sm border p-2 shadow-sm transition-colors duration-300 hover:cursor-pointer hover:bg-primary/25',
        selectedOrderId === order.id
          ? 'border-primary bg-primary/50 hover:bg-primary/50'
          : 'border-border bg-muted/50'
      )}
    >
      <div className='break-words'>{order.title}</div>
      {/* <div className='text-xs'>{formatDateWithSuffix(order.pub_date)}</div> */}
    </div>
  )
}
