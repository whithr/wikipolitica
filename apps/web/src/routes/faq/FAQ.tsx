import logo from '@/assets/large-logo-transparent.png'
import { ExternalLink } from '@/components/external-link'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Separator } from '@/components/ui/separator'

import { KofiButton } from '@/components/KofiButton'
import { Link } from '@tanstack/react-router'

const faqItems = [
  {
    question: 'What information does wikipolitica track?',
    answer: (
      <p>
        Currently, we provide the President's daily schedule as well as
        executive orders as soon as possible. This will be expanded soon to
        include specific information from all Congressional and House members,
        tailored more specifially to their day to day duties, such as voting
        records, introducing bills, and how they receive funding.
      </p>
    ),
  },
  {
    question: 'How is information gathered?',
    answer: (
      <p>
        Lots of places! Currently look out for the question mark on most
        "widgets" that will let you know where the source of information is. For
        some things, such as executive orders, multiple places are polled and
        compiled together to get the fastest and most complete amount of
        information.
      </p>
    ),
  },
  {
    question: 'Is there a mobile app?',
    answer:
      'Yes and no - the site is designed mobile-first so should always display nicely on your phone, ipad, (watch???), but there is no current mobile version yet.',
  },
]

export const FAQ = () => {
  return (
    <div className='pb-10'>
      <div className='flex max-w-6xl flex-col items-center gap-4 p-2 text-foreground/80 dark:text-foreground md:p-4'>
        <img src={logo} className='mt-2 h-32 w-32' alt='Logo' />
        <h1 className='text-center text-3xl font-semibold'>
          Frequently asked questions
        </h1>
        <div className='flex w-full max-w-2xl flex-col items-center gap-8 rounded-sm border border-border bg-background px-2 py-4 shadow-sm md:px-4'>
          <span className='flex flex-col gap-2'>
            <p className='text-center'>
              <strong>Hello!</strong> Thanks for visiting wikipolitica.
            </p>{' '}
            <p>
              First off - my name is{' '}
              <ExternalLink
                href='https://haleywhitman.com/'
                label='Haley Whitman'
              />
              . I'm a software engineer and have a history in working in
              government, and I take a special interest in understanding USA's
              political landscape. I've been inspired by a few sites that I
              think deliver good information, and I believe that it's valuable
              to have as many ways to consume and deliver information as is
              useful.{' '}
            </p>
            <p>
              I think there's a lot of ways to present non-biased information
              together in an interactive way that lends itelf to the reader to
              figure out their opinions for themselves - and I am very excited
              to get this initial work out to continue expanding on it.
              <Separator className='my-2' />
              Some other great sites include:
              <ul className='list-disc pl-4 text-foreground/80 dark:text-foreground/50'>
                <li>
                  <ExternalLink
                    href='https://www.presidency.ucsb.edu/'
                    label='The American Presidency Project'
                  />
                </li>
                <li>
                  <ExternalLink
                    href='https://www.archives.gov/'
                    label='The National Archives'
                  />
                </li>
                <li>
                  <ExternalLink
                    href='https://potustracker.us/'
                    label="Luke Wine's POTUS Tracker"
                  />
                </li>
              </ul>
            </p>
            <p className='pt-4 text-center'>
              If you like what you see, please consider{' '}
              <KofiButton label='donating' />, checking out the GitHub
              repository, or examining our{' '}
              <Link to='/' className='text-blue-600 dark:text-blue-300'>
                operating costs
              </Link>
              .{' '}
            </p>
          </span>
          <Accordion type='multiple' className='w-full'>
            {faqItems.map((item) => (
              <AccordionItem value={item.question}>
                <AccordionTrigger>
                  <span className='font-bold'>{item.question}</span>
                </AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  )
}
