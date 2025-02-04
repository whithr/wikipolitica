import { useState } from 'react'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Button } from './ui/button'
import { KofiModal } from './KofiModal'
import kofiimg from '@/assets/Ko-fi Symbol.png'
import { ExternalLink } from './ExternalLink'

export const KofiButton = ({ label }: { label?: string | React.ReactNode }) => {
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
              <img
                src={kofiimg}
                className='h-5 min-h-5 min-w-5 hover:scale-105'
                alt='Ko-fi'
              />
            </Button>
          )}
        </DialogTrigger>
        {/* Desktop dialog uses a fixed (or auto) height */}
        <DialogContent style={{ maxWidth: '600px', overflowY: 'auto' }}>
          <KofiModal isMobile={false} />
        </DialogContent>
      </Dialog>
    )
  }

  return label ? (
    <ExternalLink
      href='https://ko-fi.com/haleywhitman'
      label={
        <Button variant='primary' size='xs'>
          {label}
        </Button>
      }
    />
  ) : (
    <ExternalLink
      href='https://ko-fi.com/haleywhitman'
      label={
        <Button variant='outline' size='icon'>
          <img
            src={kofiimg}
            className='h-5 min-h-5 min-w-5 hover:scale-105'
            alt='Ko-fi'
          />
        </Button>
      }
    />
  )

  // Mobile (drawer) version:
  // Very picky because of the iframe.
  // return (
  //   <Drawer open={open} onOpenChange={setOpen}>
  //     <DrawerTrigger asChild>
  //       {label ? (
  //         <Button variant='primary' size='xs'>
  //           {label}
  //         </Button>
  //       ) : (
  //         <Button variant='outline' size='icon'>
  //           <img
  //             src={kofiimg}
  //             className='h-5 min-h-5 min-w-5 hover:scale-105'
  //             alt='Ko-fi'
  //           />
  //         </Button>
  //       )}
  //     </DrawerTrigger>

  //     {/*
  //       Instead of forcing a full height with "height", we use "maxHeight"
  //       so the container grows as needed up to the available viewport height.
  //       Adjust the 50px offset as needed (e.g. if you have headers/margins)
  //     */}
  //     <DrawerContent
  //       style={{
  //         maxHeight: '700px',
  //         overflowY: 'auto',
  //         border: 'none',
  //       }}
  //     >
  //       <DrawerClose className='flex h-min self-end' asChild>
  //         <Button
  //           variant='outline'
  //           className='absolute right-4 top-4 h-8 w-8'
  //           size='icon'
  //         >
  //           <X className='h-8 w-8' />
  //         </Button>
  //       </DrawerClose>
  //       <KofiModal isMobile={true} />
  //     </DrawerContent>
  //   </Drawer>
  // )
}

//https://ko-fi.com/haleywhitman
