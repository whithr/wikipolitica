import { ExecutiveOrderType } from '@/hooks/executiveOrdersQueryOptions'
import { cn, stripExecutiveOrder } from '@/lib/utils'
import { Link } from '@tanstack/react-router'

export const OrderItineraryItem = ({
  order,
}: {
  order: ExecutiveOrderType
}) => {
  return (
    <div className='flex items-center py-2'>
      <span className='mx-3 flex items-center justify-center'>
        <span className={cn('relative inline-flex h-4 w-4 bg-primary/70')} />
      </span>
      <Link
        to={'/executive/president/' + order.id}
        className='text-balance pl-2 font-medium'
      >
        {stripExecutiveOrder(order.presidency_project_title)} &rarr;
      </Link>
    </div>
  )
}
