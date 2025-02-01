// components/ExecutiveOrdersReader.tsx
import { cn, stripExecutiveOrder } from '@/lib/utils'

import { ScrollArea } from '@/components/ui/scroll-area'
import { cleanHTML } from '@/lib/html.utils'

import styles from './orders.module.css'
import { useTheme } from '../theme-provider'

import { useLoaderData } from '@tanstack/react-router'

export const ExecutiveOrdersReader = ({
  className,
}: {
  className?: string
}) => {
  const data = useLoaderData({ from: '/executive/orders/$id' })

  const { resolvedTheme } = useTheme()

  if (!data) return <p>No data found.</p>

  const cleanedHTML = data.presidency_project_html
    ? cleanHTML(data.presidency_project_html)
    : ''

  return (
    <div
      className={cn(
        'mx-auto flex w-full max-w-[800px] flex-1 flex-col overflow-y-auto rounded-sm bg-background p-4 transition duration-500',
        className
      )}
    >
      <div className='text-foreground'>
        <h1 className='px-4 pt-4 text-center text-xl font-bold'>
          {stripExecutiveOrder(data.presidency_project_title || '')}
        </h1>
        <p className='p-2 pb-4 text-center text-sm'>
          {data.presidency_project_date}
        </p>
      </div>
      <ScrollArea className='flex h-[calc(100dvh-300px)] flex-col gap-2'>
        <div
          dangerouslySetInnerHTML={{ __html: cleanedHTML }}
          className={cn(
            resolvedTheme === 'light'
              ? styles.orderCardLight
              : styles.orderCardDark
          )}
        />
      </ScrollArea>
    </div>
  )
}
