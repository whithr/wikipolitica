// src/components/orders/RouteComponent.tsx

import { ChangeEvent } from 'react'
import {
  ExecutiveOrdersProvider,
  useExecutiveOrders,
} from '@/components/orders/executive-orders-context'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { useResizeDetector } from 'react-resize-detector'
import { cn } from '@/lib/utils'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ExecutiveOrdersReader } from '@/components/orders/executive-orders-reader'
import { ExecutiveOrdersSelector } from '@/components/orders/executive-orders-selector'

const MOBILE_WIDTH = 1000

const RouteComponent: React.FC = () => {
  const {
    selectedOrderId,
    setSelectedOrderId,

    searchTerm,
    setSearchTerm,
  } = useExecutiveOrders()
  const { width, ref } = useResizeDetector()

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  return (
    <div className='flex flex-1 gap-12 md:gap-6' ref={ref}>
      {/* Sidebar with search and order list */}
      <div
        className={cn(
          'flex h-fit max-w-[450px] flex-col gap-2',
          width && width < MOBILE_WIDTH && 'mx-auto max-w-full'
        )}
      >
        {/* Search Input */}
        <div className='relative rounded-sm border border-border bg-background p-2 shadow-sm'>
          <Label htmlFor='search' className='sr-only'>
            Search
          </Label>
          <Input
            id='search'
            placeholder='Search Executive Orders and Actions...'
            className='pl-8 text-foreground'
            autoComplete='off'
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <Search className='pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 select-none stroke-foreground opacity-50' />
        </div>

        {/* Filtered and Grouped Orders */}
        <div className='overflow-auto rounded-sm border border-border bg-background p-4 shadow-sm'>
          <ScrollArea className='h-[calc(100dvh-180px)]'>
            <ExecutiveOrdersSelector />
          </ScrollArea>
        </div>
      </div>

      {/* Main content area with scrollable content */}
      {width && width < MOBILE_WIDTH ? (
        <Drawer
          open={selectedOrderId > 0}
          onClose={() => setSelectedOrderId(-1)}
        >
          <DrawerContent className='border-none'>
            <DrawerHeader className='flex self-end'>
              <DrawerClose className='flex self-end' asChild>
                <Button variant='outline' className='self-end'>
                  Close
                </Button>
              </DrawerClose>
            </DrawerHeader>
            <ExecutiveOrdersReader className='border-none shadow-none' />
          </DrawerContent>
        </Drawer>
      ) : (
        <div className='flex-1 overflow-auto'>
          <ExecutiveOrdersReader />
        </div>
      )}
    </div>
  )
}

export const Route = createLazyFileRoute('/executive/orders')({
  component: () => (
    <ExecutiveOrdersProvider>
      <RouteComponent />
    </ExecutiveOrdersProvider>
  ),
})
