import { cx } from 'class-variance-authority'

export const ActivityPing = ({
  shouldHighlight,
}: {
  shouldHighlight: boolean
}) => {
  return (
    <span className='relative mx-3 flex h-4 w-4 items-center justify-center'>
      {shouldHighlight && (
        <span className='duration-[2000] absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/50 opacity-75' />
      )}
      <span
        className={cx(
          'relative inline-flex h-3 w-3 rounded-full',
          shouldHighlight ? 'bg-primary' : 'bg-secondary-foreground/25'
        )}
      />
    </span>
  )
}
