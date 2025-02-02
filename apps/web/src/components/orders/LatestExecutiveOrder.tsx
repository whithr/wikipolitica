import { stripExecutiveOrder } from '@/lib/utils'
import { useLoaderData } from '@tanstack/react-router'
import potusSeal from '@/assets/potus-seal.png'
import { Separator } from '../ui/separator'
import { formatDateWithSuffix } from '@/lib/time.utils'

export const LatestExecutiveOrder = () => {
  const data = useLoaderData({ from: '/' })

  const latestOrder = data[0]

  return (
    <div className='flex items-center gap-2 rounded-md border border-border bg-background p-4 hover:shadow-lg dark:border-primary/50'>
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
