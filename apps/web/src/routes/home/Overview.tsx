import logo from '@/assets/large-logo-transparent.png'
import { ExternalLink } from '@/components/external-link'
import { LatestExecutiveOrder } from '@/components/orders/LatestExecutiveOrder'
import { CurrentEventHeader } from '@/components/president/CurrentEventHeader'
import { Separator } from '@/components/ui/separator'
import { SingleWordExplainer } from '@/components/word-explainer'
import { Link, useNavigate } from '@tanstack/react-router'

export const Overview = () => {
  const navigate = useNavigate()

  return (
    <div className='flex max-w-6xl flex-col items-center gap-2 p-2 md:p-4'>
      <img src={logo} className='mt-2 h-32 w-32' alt='Logo' />
      <h1 className='text-3xl font-semibold text-foreground/80 dark:text-foreground'>
        wikipolitica
      </h1>
      <p className='text-balance text-center font-medium italic leading-8 text-foreground/50 dark:text-foreground/80'>
        the free{' '}
        <SingleWordExplainer
          description='Free from party affiliation, bias, or designation'
          word='non-partisan'
          className='max-w-96 italic'
        />{' '}
        and{' '}
        <SingleWordExplainer
          description='All code used on this website is open for inspection and modification'
          word='open-source'
          className='max-w-96 italic'
        />{' '}
        political knowledge base for the United States
      </p>

      <Separator className='my-2 w-1/2 md:my-4' />

      <div className='flex max-w-[948px] flex-col gap-4 p-2 text-foreground'>
        <p>
          Wikipolitica is built to serve the public by providing accurate,
          real-time, and unfiltered political data. It aggregates information
          from{' '}
          <SingleWordExplainer
            description='A first-hand account of an event or topic that was created at the time it happened'
            word='primary sources'
            className='max-w-96'
          />{' '}
          such as the{' '}
          <ExternalLink
            href='https://www.archives.gov/'
            label='National Archives'
          />
          , the{' '}
          <ExternalLink
            href='https://www.whitehouse.gov/'
            label='White House'
          />
          , as well as other non-partisan, unbiased outlets.
        </p>

        <p>
          Our mission is simple: empower people with direct access to political
          data so they can track government actions and conduct independent
          research on elected and non-elected officials.
        </p>

        <p className='rounded-lg bg-primary/30 px-2 py-4 text-center dark:bg-primary/20'>
          <strong>wikipolitica is still under development.</strong> <br />
          See our{' '}
          <Link to='/roadmap' className='text-blue-600 dark:text-blue-300'>
            roadmap
          </Link>{' '}
          or the{' '}
          <Link
            to='/frequently-asked-questions'
            className='text-blue-600 dark:text-blue-300'
          >
            frequently asked questions
          </Link>{' '}
          page for details on what's coming next.
        </p>
      </div>

      <Separator className='my-2 w-1/2 md:my-4' />
      <div className='flex max-w-[948px] flex-col gap-4 p-2 text-foreground'>
        <p className='text-balance text-center'>
          <strong>For now,</strong> check out the{' '}
          <Link
            to='/executive/president'
            className='text-blue-600 dark:text-blue-300'
          >
            daily schedule
          </Link>{' '}
          of the President of the United States or the{' '}
          <Link to='/' className='text-blue-600 dark:text-blue-300'>
            list of executive orders
          </Link>{' '}
          that have been signed by the current administration.
        </p>
        <div className='grid max-w-3xl grid-cols-1 items-center gap-6 self-center md:grid-cols-2'>
          <div
            className='hover:scale-[1.02] hover:cursor-pointer'
            onClick={() => navigate({ to: '/executive/president' })}
          >
            <CurrentEventHeader
              className='!h-max w-full rounded-sm !px-0 hover:shadow-xl'
              blockSourceTooltip={true}
            />
          </div>
          <div
            className='hover:scale-[1.02] hover:cursor-pointer'
            onClick={() => navigate({ to: '/executive/orders' })}
          >
            <LatestExecutiveOrder />
          </div>
        </div>
      </div>
      <Separator className='my-2 w-1/2 md:my-4' />

      <div className='flex max-w-[948px] flex-col gap-4 p-2 pb-8 text-foreground'>
        <p className='text-balance text-center'>
          If you'd like to support the project consider donating or reviewing
          our{' '}
          <Link to='/' className='text-blue-600 dark:text-blue-300'>
            budget
          </Link>{' '}
          to understand operating costs.
        </p>
      </div>
    </div>
  )
}
