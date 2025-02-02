import logo from '@/assets/large-logo-transparent.webp'
import { StatusPing } from '@/components/animations/StatusPing'
import { useLoaderData } from '@tanstack/react-router'
import { formatDistanceToNow } from 'date-fns'

export const Status = () => {
  const data = useLoaderData({ from: '/status' })
  console.log(data)
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
        <div className='flex flex-wrap justify-center gap-2'>
          {data.map((job) => (
            <div
              key={job.id}
              className='flex w-full max-w-sm items-center gap-2 rounded-sm border border-border bg-background px-2 py-4 shadow-sm md:px-4'
            >
              <StatusPing isHealthy={job.last_error === null} />
              <div className='flex-col'>
                <span className='flex flex-col gap-2'>{job.job_name}</span>
                <span className='text-xs text-foreground/50'>
                  {job.last_run_at
                    ? formatDistanceToNow(job.last_run_at, {
                        addSuffix: true,
                      })
                    : 'Never run'}
                </span>
                <br />
                <span className='text-xs text-foreground/50'>
                  Lifetime runs: {job.run_count}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
