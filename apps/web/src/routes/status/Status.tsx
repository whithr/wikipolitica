// import { Link } from '@tanstack/react-router'
// import { KofiButton } from '@/components/KofiButton'
import logo from '@/assets/large-logo-transparent.png'

export const Status = () => {
  return (
    <div className='pb-10'>
      <div className='flex max-w-6xl flex-col items-center gap-4 p-2 text-foreground/80 dark:text-foreground md:p-4'>
        <img src={logo} className='mt-2 h-32 w-32' alt='Logo' />
        <h1 className='text-center text-3xl font-semibold'>
          Status of Data Collection Jobs
        </h1>
        <p className='max-w-[800px] text-center'>
          wikipolitica relies on a few services to collect data at regular
          intervals, and their status can be checked here.
        </p>
        <div className='flex w-full max-w-2xl flex-col items-center gap-8 rounded-sm border border-border bg-background px-2 py-4 shadow-sm md:px-4'>
          <span className='flex flex-col gap-2'>
            wikipolitica relies on a few services to collect data at regular
            intervals. This tracks the status of each of these jobs, when they
            last ran, and also when they last successfully collected data.
          </span>
        </div>
      </div>
    </div>
  )
}
