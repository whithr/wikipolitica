import {
  ExecutiveOrdersProvider,
  useExecutiveOrders,
} from '@/components/orders/executive-orders-context'
import { createLazyFileRoute } from '@tanstack/react-router'
import { ExecutiveOrdersSelector } from '@/components/orders/executive-orders-selector'
import { ExecutiveOrdersReader } from '@/components/orders/executive-orders-reader'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { useResizeDetector } from 'react-resize-detector'
import { cn } from '@/lib/utils'
import { Drawer, DrawerContent, DrawerHeader } from '@/components/ui/drawer'

const MOBILE_WIDTH = 1000

const RouteComponent = () => {
  const { data, selectedOrderId, setSelectedOrderId, isLoading } =
    useExecutiveOrders()
  const { width, ref } = useResizeDetector()

  if (isLoading) return <p>Loading...</p>
  if (!data) return <p>No data found.</p>

  return (
    <div className='flex flex-1 gap-12 md:gap-6' ref={ref}>
      {/* Sidebar with sticky positioning */}
      <div
        className={cn(
          'flex h-fit flex-col gap-2',
          width && width < MOBILE_WIDTH && 'mx-auto'
        )}
      >
        <div className='relative rounded-sm bg-background'>
          <Label htmlFor='search' className='sr-only'>
            Search
          </Label>
          <Input
            id='search'
            placeholder='Search Executive Orders...'
            className='pl-8'
            autoComplete='off'
          />
          <Search className='pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none stroke-foreground opacity-50' />
        </div>
        <ExecutiveOrdersSelector />
      </div>

      {/* Main content area with scrollable content */}
      {width && width < MOBILE_WIDTH ? (
        <Drawer
          open={selectedOrderId > 0}
          onClose={() => setSelectedOrderId(-1)}
        >
          <DrawerContent className='border-none'>
            <DrawerHeader />
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
