import { ExecutiveOrderType } from '@/hooks/executiveOrdersQueryOptions'
import { cn, stripExecutiveOrder } from '@/lib/utils'
import { Link } from '@tanstack/react-router'
import { Button } from '../ui/button'
import { FileText } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { ExternalLink } from '../ExternalLink'

type OrderCardProps = {
  order: ExecutiveOrderType
  selectedOrderId?: string
}

export const OrderCard = ({ order, selectedOrderId }: OrderCardProps) => {
  return (
    <div className='flex items-center gap-4'>
      <Link
        to='/executive/orders/$id' // Reference the dynamic route
        params={{ id: String(order.id) }} // Pass the dynamic parameter
        className={cn(
          'flex w-full flex-col items-start gap-2 rounded-sm border p-2 shadow-sm transition-colors duration-300 hover:cursor-pointer hover:bg-primary/25',
          selectedOrderId === order.id
            ? 'border-primary bg-primary/50 hover:bg-primary/50'
            : 'border-border bg-muted/50'
        )}
        resetScroll={true}
      >
        <div className='text-balance'>
          {stripExecutiveOrder(order.presidency_project_title)}
        </div>
      </Link>
      {order.pdf_url && (
        <Tooltip>
          <TooltipTrigger>
            <Button variant='ghost' size='icon' asChild>
              <ExternalLink
                href={order.pdf_url}
                label={<FileText className='h-4 w-4 stroke-foreground/60' />}
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Open PDF</TooltipContent>
        </Tooltip>
      )}
    </div>
  )
}
