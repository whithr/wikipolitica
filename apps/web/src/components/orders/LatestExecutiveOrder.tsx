import { stripExecutiveOrder } from '@/lib/utils'
import { useLoaderData } from '@tanstack/react-router'
import potusSeal from '@/assets/potus-seal.webp'
import { Separator } from '../ui/separator'
import { formatDateWithSuffix } from '@/lib/time.utils'
import { useMemo } from 'react'

export const LatestExecutiveOrder = ({
  loaderRoute,
}: {
  loaderRoute: '/executive' | '/'
}) => {
  const data = useLoaderData({ from: loaderRoute })

  const latestOrder = useMemo(
    () =>
      data
        .filter((order) => order.presidency_project_date !== null)
        .sort(
          (a, b) =>
            new Date(b.presidency_project_date!).getTime() -
            new Date(a.presidency_project_date!).getTime()
        )?.[0],
    [data]
  )

  return (
    <div className='flex items-center gap-2 rounded-md border border-border bg-background p-4 transition hover:shadow-lg dark:border-primary/50'>
      <img
        src={potusSeal}
        className='hidden h-16 w-16 rounded-full shadow-sm md:block'
      />
      <div className='flex flex-col gap-2'>
        <div className='flex flex-col gap-2'>
          <div className='flex justify-between font-semibold'>
            <div className='flex items-center gap-2'>
              <img
                src={potusSeal}
                className='block h-10 w-10 rounded-full shadow-sm md:hidden'
              />

              <div className='flex flex-col gap-0 text-balance'>
                <p className=''>
                  {formatDateWithSuffix(latestOrder.presidency_project_date)}{' '}
                </p>
              </div>
            </div>
          </div>
        </div>
        <Separator />

        {stripExecutiveOrder(latestOrder.presidency_project_title)}
      </div>
    </div>
  )
}
