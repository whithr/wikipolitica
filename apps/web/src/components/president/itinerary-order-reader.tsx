import { useMediaQuery } from '@/hooks/use-media-query'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Drawer, DrawerClose, DrawerContent } from '@/components/ui/drawer'

import { ExecutiveOrdersReader } from '../orders/executive-orders-reader'
import { useNavigate, useParams } from '@tanstack/react-router'
import { X } from 'lucide-react'

export const ItineraryOrderReader = () => {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const { id } = useParams({ strict: false })
  const navigate = useNavigate()

  if (isDesktop) {
    return (
      <Dialog
        open={id !== undefined}
        onOpenChange={() => navigate({ to: '/executive/president' })}
      >
        <DialogTitle>Executive Order</DialogTitle>
        <DialogContent className='w-'>
          <ExecutiveOrdersReader loaderDataPath={'/executive/president/$id'} />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer
      open={id !== undefined}
      onClose={() => navigate({ to: '/executive/president' })}
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
        <ExecutiveOrdersReader loaderDataPath={'/executive/president/$id'} />
      </DrawerContent>
    </Drawer>
  )
}
