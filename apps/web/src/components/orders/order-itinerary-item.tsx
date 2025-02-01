import { ExecutiveOrderType } from '@/hooks/executive-orders'
import { cn, stripExecutiveOrder } from '@/lib/utils'
import { Link } from '@tanstack/react-router'
import { BookOpenText } from 'lucide-react'

export const OrderItineraryItem = ({
  order,
}: {
  order: ExecutiveOrderType
}) => {
  return (
    <div className='flex items-center gap-3 py-3'>
      <BookOpenText
        className={cn('mx-2.5 h-6 w-6 stroke-foreground/60 stroke-2')}
      />
      <Link
        to={'/executive/president/' + order.id}
        className='font-medium underline decoration-primary/70 decoration-dashed decoration-2 underline-offset-8'
      >
        {stripExecutiveOrder(order.presidency_project_title)}
      </Link>
    </div>
  )
}
