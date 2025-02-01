// components/ExecutiveOrdersReader.tsx
import { cn } from '@/lib/utils'
import { useExecutiveOrdersData } from '@/hooks/useExecutiveOrdersData'
import { useExecutiveOrderDetails } from '@/hooks/useExecutiveOrderDetails'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cleanHTML } from '@/lib/html.utils'

import styles from './orders.module.css'
import { useTheme } from '../theme-provider'
import { Skeleton } from '../ui/skeleton'
import { useLoaderData } from '@tanstack/react-router'
import ReactMarkdown from 'react-markdown'
import { Components } from 'react-markdown'

export const markdownComponents: Components = {
  // Executive Order title (mapped from EXECORDR in XML → "# " in Markdown)
  h1: ({ node, ...props }) => {
    void node
    return <h1 className='my-4 text-3xl font-bold' {...props} />
  },

  // Header from <HD> → "## " in Markdown
  h2: ({ node, ...props }) => {
    void node
    return <h2 className='my-3 text-2xl font-semibold' {...props} />
  },

  // For <E> tags rendered with type "04" as subheaders (####)
  h4: ({ node, ...props }) => {
    void node
    return <h4 className='break-after-all text-lg font-semibold' {...props} />
  },

  // Paragraphs (from <FP> and <P>)
  p: ({ node, ...props }) => {
    void node
    return <p className='my-2 py-1 leading-relaxed' {...props} />
  },

  // Bold text (for inline bold from <E T="03"> or <PLACE>)
  strong: ({ node, ...props }) => {
    void node
    return <strong className='-mr-1' {...props} />
  },

  // Italic text (for <DATE> content)
  em: ({ node, ...props }) => {
    void node
    return <em className='mb-2 block italic' {...props} />
  },

  // Unordered lists
  ul: ({ node, ...props }) => {
    void node
    return <ul className='my-4 ml-6 list-disc' {...props} />
  },

  // Ordered lists
  ol: ({ node, ...props }) => {
    void node
    return <ol className='my-4 ml-6 list-decimal' {...props} />
  },

  li: ({ node, ...props }) => {
    void node
    return <li className='my-1' {...props} />
  },

  // Blockquote styling
  blockquote: ({ node, ...props }) => {
    void node
    return (
      <blockquote
        className='my-4 border-l-4 border-gray-300 pl-4 italic'
        {...props}
      />
    )
  },

  // Code blocks and inline code
  code: ({ node, inline, className, children, ...props }) => {
    void node
    return inline ? (
      <code className='rounded bg-gray-100 px-1' {...props}>
        {children}
      </code>
    ) : (
      <pre className='my-4 overflow-auto rounded bg-gray-100 p-2' {...props}>
        <code className={className}>{children}</code>
      </pre>
    )
  },

  // Additional suggestions:

  // Link styling
  a: ({ node, ...props }) => {
    void node
    return <a className='text-blue-600 hover:underline' {...props} />
  },

  // Image styling
  img: ({ node, ...props }) => {
    void node
    return <img className='mx-auto my-4' alt='' {...props} />
  },

  // Table styling
  table: ({ node, ...props }) => {
    void node
    return <table className='min-w-full divide-y divide-gray-200' {...props} />
  },
  thead: ({ node, ...props }) => {
    void node
    return <thead className='bg-gray-50' {...props} />
  },
  tbody: ({ node, ...props }) => {
    void node
    return <tbody {...props} />
  },
  tr: ({ node, ...props }) => {
    void node
    return <tr className='even:bg-gray-100' {...props} />
  },
  th: ({ node, ...props }) => {
    void node
    return (
      <th
        className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'
        {...props}
      />
    )
  },
  td: ({ node, ...props }) => {
    void node
    return (
      <td
        className='whitespace-nowrap px-6 py-4 text-sm text-gray-900'
        {...props}
      />
    )
  },
}

export const ExecutiveOrdersReader = ({
  className,
}: {
  className?: string
}) => {
  const data = useLoaderData({ from: '/executive/orders/$id' })
  console.log('hello')
  console.log(data)

  const { resolvedTheme } = useTheme()
  // const { id } = useParams({ strict: false })

  if (!data) return <p>No data found.</p>

  // if (!order) {
  //   return (
  //     <div className='flex w-full items-center justify-center rounded-sm border-8 border-dashed border-primary bg-primary/10 p-4 text-center text-foreground opacity-50 transition duration-500'>
  //       <div className='flex-1'>Select an order to read...</div>
  //     </div>
  //   )
  // }

  // if (isDetailsLoading) {
  //   return (
  //     <div className='flex w-full flex-col items-center gap-5 rounded-sm border-8 border-dashed border-primary bg-primary/10 p-4 pt-12 text-center text-foreground opacity-50 transition duration-500'>
  //       {/* Title Skeleton */}
  //       <Skeleton className='h-6 w-2/12 rounded-md' />

  //       {Array.from({ length: 3 }).map((_, index) => (
  //         <div key={index} className='flex w-full flex-col items-center gap-2'>
  //           <Skeleton className='h-4 w-10/12 rounded-md' />
  //           <Skeleton className='h-4 w-11/12 rounded-md' />
  //           <Skeleton className='h-4 w-9/12 rounded-md' />
  //           <Skeleton className='h-4 w-8/12 rounded-md' />
  //         </div>
  //       ))}
  //     </div>
  //   )
  // }

  // if (isDetailsError) {
  //   return (
  //     <div className='flex w-full items-center justify-center rounded-sm border-8 border-dashed border-primary bg-primary/10 p-4 text-center text-foreground opacity-50 transition duration-500'>
  //       Error loading order details: {detailsError.message}
  //     </div>
  //   )
  // }

  // const cleanedHTML = data.full_text_xml ? cleanHTML(data.full_text_xml) : ''

  return (
    <div
      className={cn(
        'mx-auto flex w-full max-w-[800px] flex-1 flex-col overflow-y-auto rounded-sm bg-background p-4 transition duration-500',
        className
      )}
    >
      <ScrollArea className='h-[calc(100dvh-150px)]'>
        <ReactMarkdown components={markdownComponents}>
          {data.full_text_markdown}
        </ReactMarkdown>
      </ScrollArea>
    </div>
  )
}
