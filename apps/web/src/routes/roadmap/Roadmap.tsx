import logo from '@/assets/large-logo-transparent.webp'
import { ExternalLink } from '@/components/external-link'
import { KofiButton } from '@/components/KofiButton'

const roadmapItems = [
  {
    title: 'Completed Features',
    items: [
      {
        title: 'Presidential Schedule',
        description:
          'A daily schedule of the President of the United States, including orders signed and locations.',
      },
      {
        title: 'Presidential Orders',
        description: 'A list of presidential executive orders',
      },
    ],
  },
  {
    title: 'Planned Features',
    items: [
      {
        title: 'General app improvements',
        description:
          'Add ability to share documents, send push notifications, add a Progress Web App (PWA) ability to download the site',
      },
      {
        title: 'Add other presidential documents',
        description:
          'Add ability to read proclamations, memos, immedaite firsthand communications (Tweets, Truths)',
      },
      {
        title: 'Add Cabinet picks, members, and committies',
        description:
          "Add ability to see appointments, formal suggestions from the Cabinet, what each department's current focus is",
      },
      {
        title: 'Add profiles for each member of Congress',
        description:
          'Add ability to see general voting records, bios, contact info, a daily log of congressional actions',
      },
      {
        title: 'Add profiles for each member of the House',
        description:
          'Add ability to see general voting records, bios, contact info, and a daily log of their representative actions',
      },
    ],
  },
]

export const Roadmap = () => {
  return (
    <div className='pb-10'>
      <div className='flex max-w-6xl flex-col items-center gap-4 p-2 text-foreground/80 dark:text-foreground md:p-4'>
        <img src={logo} className='mt-2 h-32 w-32' alt='Logo' />
        <h1 className='text-center text-3xl font-semibold'>
          Roadmap of feature development
        </h1>
        <div className='flex w-full max-w-2xl flex-col items-center gap-8 rounded-sm border border-border bg-background px-2 py-4 shadow-sm md:px-4'>
          <span className='flex flex-col gap-2'>
            <p>
              This is a rough list of the immediate plans to continue developing
              out the feature and data capabilities of wikipolitica.
            </p>
            <ul className='space-y-6'>
              {roadmapItems.map((item) => (
                <li
                  key={item.title}
                  className='space-y-4 border-l-2 border-primary pl-4'
                >
                  <h2 className='text-lg font-bold'>{item.title}</h2>
                  <ul className='space-y-3'>
                    {item.items.map((subItem) => (
                      <li
                        key={subItem.title}
                        className='space-y-1 border-l-2 border-muted-foreground pl-3'
                      >
                        <p className='text-sm font-medium'>{subItem.title}</p>
                        <p className='text-balance text-sm text-muted-foreground'>
                          {subItem.description}
                        </p>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </span>
        </div>
        <p className='max-w-lg pt-4 text-center'>
          If you like'd to help the development of these features please
          consider <KofiButton label='donating' /> or checking out the{' '}
          <ExternalLink
            href='https://github.com/whithr/wikipolitica'
            label='GitHub repository'
          />
          .
        </p>
      </div>
    </div>
  )
}
