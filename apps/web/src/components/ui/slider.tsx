import * as React from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'

import { cn } from '@/lib/utils'
import { Grip } from 'lucide-react'

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      'relative flex w-full touch-none select-none items-center',
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className='relative h-4 w-full grow overflow-hidden rounded-md border border-accent bg-secondary/20 dark:border-primary'>
      <SliderPrimitive.Range className='absolute h-full bg-muted-foreground/60' />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className='flex h-9 w-9 items-center justify-center rounded-sm bg-primary shadow-md transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50'
      aria-label='Thumb'
    >
      <Grip className='mx-0 h-full w-4' />
    </SliderPrimitive.Thumb>
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
