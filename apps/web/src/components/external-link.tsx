export const ExternalLink = ({
  href,
  label,
}: {
  href: string
  label: string
}) => {
  return (
    <a
      href={href}
      target='_blank'
      rel='noopener noreferrer'
      className='text-blue-600 hover:underline'
    >
      {label}
    </a>
  )
}
