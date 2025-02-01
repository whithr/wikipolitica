// src/components/orders/RouteComponent.tsx

import { ChangeEvent, useEffect } from 'react'
import { ExecutiveOrdersProvider } from '@/components/orders/executive-orders-context'
import { Input } from '@/components/ui/input'
import { Search, X } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { useResizeDetector } from 'react-resize-detector'
import { cn } from '@/lib/utils'
import { Drawer, DrawerClose, DrawerContent } from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ExecutiveOrdersSelector } from '@/components/orders/executive-orders-selector'
import { SourceTooltip } from '@/components/source-tooltip'
import { ExternalLink } from '@/components/external-link'
import { useExecutiveOrdersStore } from '@/stores/executiveActionsStore'
import { Outlet, useNavigate, useParams } from '@tanstack/react-router'

export const MOBILE_WIDTH = 1000

const RouteComponent = () => {
  const { id } = useParams({ strict: false })
  const navigate = useNavigate()

  const setWidth = useExecutiveOrdersStore((state) => state.setWidth)
  const searchTerm = useExecutiveOrdersStore((state) => state.searchTerm)
  const setSearchTerm = useExecutiveOrdersStore((state) => state.setSearchTerm)
  const { width, ref } = useResizeDetector()

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  useEffect(() => {
    setWidth(width || 0)
  }, [setWidth, width])

  return (
    <div className='flex flex-1 gap-12 p-2 md:gap-6 md:p-4' ref={ref}>
      {/* Sidebar with search and order list */}
      <div
        className={cn(
          'flex h-fit w-full max-w-[450px] flex-col gap-2',
          width && width < MOBILE_WIDTH && 'mx-auto min-w-full max-w-full'
        )}
      >
        {/* Search Input */}
        <div className='relative flex rounded-sm border border-border bg-background p-2 pr-6 shadow-sm focus-within:border-primary'>
          <Label htmlFor='search' className='sr-only'>
            Search
          </Label>
          <Input
            id='search'
            placeholder='Search Executive Orders...'
            className='border-none pl-8 text-foreground shadow-none outline-none outline-transparent ring-transparent focus:!outline-none focus:!ring-0'
            autoComplete='off'
            value={searchTerm}
            onChange={handleSearchChange}
          />

          <Search className='pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 select-none stroke-foreground opacity-50' />
          <div className='w-1' />
          <SourceTooltip
            className='top-4'
            content={
              <div>
                <p className='max-w-[300px]'>
                  All orders from the{' '}
                  <ExternalLink
                    href='https://www.archives.gov/'
                    label='National Archives'
                  />
                  ,<br />
                  <ExternalLink
                    href='https://www.presidency.ucsb.edu/'
                    label='The American Presidency Project'
                  />
                </p>
              </div>
            }
          />
        </div>

        {/* Filtered and Grouped Orders */}
        <div className='overflow-auto rounded-sm border border-border bg-background p-4 shadow-sm'>
          <ScrollArea className='h-[calc(100dvh-195px)]'>
            <ExecutiveOrdersSelector />
          </ScrollArea>
        </div>
      </div>

      {/* Main content area with scrollable content */}
      {width && width < MOBILE_WIDTH ? (
        <Drawer
          open={id !== undefined}
          onClose={() => navigate({ to: '/executive/orders' })}
        >
          <DrawerContent className='border-none'>
            <DrawerClose className='flex h-min self-end' asChild>
              <Button
                variant='outline'
                className='absolute right-4 top-4 h-8 w-8'
                size='icon'
              >
                <X className='h-8 w-8' />
              </Button>
            </DrawerClose>
            <Outlet />
          </DrawerContent>
        </Drawer>
      ) : (
        <div className='flex w-full flex-1 overflow-auto'>
          {id ? (
            <div className='h-fit rounded-sm border border-border shadow-sm'>
              <Outlet />
            </div>
          ) : (
            <div className='flex w-full items-center justify-center rounded-sm border-8 border-dashed border-primary bg-primary/10 p-4 text-center text-foreground opacity-50 transition duration-500'>
              <div className='flex-1'>Select an order to read...</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
export const PresidentialActions = () => (
  <ExecutiveOrdersProvider>
    <RouteComponent />
  </ExecutiveOrdersProvider>
)
