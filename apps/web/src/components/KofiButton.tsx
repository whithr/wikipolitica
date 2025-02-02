import { useState } from 'react'

import { useMediaQuery } from '@/hooks/use-media-query'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import { Button } from './ui/button'
import { KofiModal } from './KofiModal'
import kofiimg from '@/assets/Ko-fi Symbol.png'

export const KofiButton = ({ label }: { label?: string }) => {
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {label ? (
            <Button variant='primary' size='xs'>
              {label}
            </Button>
          ) : (
            <Button variant='outline' size='icon'>
              <img src={kofiimg} className='h-5 hover:scale-105' />
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className='h-fit w-fit'>
          <KofiModal />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen} defaultOpen={open}>
      <DrawerTrigger asChild>
        {label ? (
          <Button variant='primary' size='xs'>
            {label}
          </Button>
        ) : (
          <Button variant='outline' size='icon'>
            <img src={kofiimg} className='h-5 hover:scale-105' />
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent>
        <KofiModal />
      </DrawerContent>
    </Drawer>
  )
}
