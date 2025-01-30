import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { FileQuestion } from 'lucide-react'

export const SourceTooltip = ({ content }: { content: React.ReactNode }) => {
  return (
    <Popover>
      <PopoverTrigger className='absolute right-2 top-2 rounded-full'>
        <FileQuestion className='h-4 w-4 stroke-secondary/50 hover:stroke-secondary dark:stroke-primary/50 hover:dark:stroke-primary' />
      </PopoverTrigger>
      <PopoverContent className='mx-2 w-fit border-none bg-foreground px-4 py-2 text-sm text-background'>
        <div className='flex flex-col gap-1 text-sm'>
          <span className='font-semibold'>Sources:</span>
          {content}
        </div>
      </PopoverContent>
    </Popover>
  )
}
