import { Link, useNavigate } from '@tanstack/react-router'
import { Separator } from '../ui/separator'
import { CurrentEventHeader } from './CurrentEventHeader'
import { LatestExecutiveOrder } from '../orders/LatestExecutiveOrder'

export const Executive = () => {
  const navigate = useNavigate()
  return (
    <div className='flex items-center justify-center'>
      <div className='flex max-w-[948px] flex-col gap-4 p-2 text-foreground'>
        <p className='text-balance text-center'>
          <strong className='text-xl'>
            wikipolitica is still under active development - and this page is
            not yet complete.
          </strong>{' '}
        </p>
        <Separator className='my-2 w-1/2 self-center md:my-4' />
        <p className='text-balance text-center'>
          For now, check out the{' '}
          <Link
            to='/executive/president'
            className='text-blue-600 dark:text-blue-300'
          >
            daily schedule
          </Link>{' '}
          of the President of the United States or the{' '}
          <Link
            to='/executive/orders'
            className='text-blue-600 dark:text-blue-300'
          >
            list of executive orders
          </Link>{' '}
          that have been signed by the current administration.
        </p>
        <div className='grid max-w-3xl grid-cols-1 items-center gap-6 self-center md:grid-cols-2'>
          <div
            className='hover:scale-[1.02] hover:cursor-pointer'
            onClick={() => navigate({ to: '/executive/president' })}
          >
            <CurrentEventHeader
              className='!h-max w-full rounded-sm !px-0 hover:shadow-xl'
              blockSourceTooltip={true}
            />
          </div>
          <div
            className='hover:scale-[1.02] hover:cursor-pointer'
            onClick={() => navigate({ to: '/executive/orders' })}
          >
            <LatestExecutiveOrder loaderRoute='/executive' />
          </div>
        </div>
      </div>
    </div>
  )
}
