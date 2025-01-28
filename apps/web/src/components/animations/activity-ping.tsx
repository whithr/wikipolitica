import { cx } from 'class-variance-authority'

export const ActivityPing = ({
  shouldHighlight,
  shouldAnimate,
  className,
}: {
  shouldHighlight: boolean
  shouldAnimate: boolean
  className?: string
}) => {
  return (
    <span
      className={cx(
        'relative mx-3 flex h-4 w-4 items-center justify-center',
        className
      )}
    >
      {shouldAnimate && (
        <span
          className={cx(
            'absolute inline-flex h-full w-full animate-ping rounded-full',
            shouldHighlight ? 'bg-primary' : 'bg-secondary-foreground/25'
          )}
        />
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
