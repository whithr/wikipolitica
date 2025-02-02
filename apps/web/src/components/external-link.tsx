import React from 'react'

export const ExternalLink = ({
  href,
  label,
}: {
  href: string
  label: string | React.ReactNode
}) => {
  return (
    <a
      href={href}
      target='_blank'
      rel='noopener noreferrer'
      className='text-blue-600 hover:underline dark:text-blue-300'
    >
      {label}
    </a>
  )
}
