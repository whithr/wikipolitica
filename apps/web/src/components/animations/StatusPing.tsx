export const StatusPing = ({
  isHealthy,
  className,
}: {
  isHealthy: boolean
  className?: string
}) => {
  return (
    <span
      className={cx(
        'relative mx-3 flex h-4 w-4 items-center justify-center',
        className
      )}
    >
      <span
        className={cx(
          'absolute inline-flex h-full w-full animate-ping rounded-full',
          isHealthy ? 'bg-emerald-500' : 'bg-destructive'
        )}
      />

      <span
        className={cx(
          'relative inline-flex h-3 w-3 rounded-full',
          isHealthy ? '!bg-emerald-500' : 'bg-destructive'
        )}
      />
    </span>
  )
}

import { cx } from 'class-variance-authority'

export const ActivityPing = ({
  shouldHighlight,
  shouldAnimate,
  variant = 'default',
  className,
}: {
  shouldHighlight: boolean
  shouldAnimate: boolean
  variant?: 'default' | 'map'
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
            shouldHighlight
              ? '!bg-primary'
              : variant === 'map'
                ? 'bg-neutral-500 dark:bg-foreground'
                : 'bg-foreground/50'
          )}
        />
      )}
      <span
        className={cx(
          'relative inline-flex h-3 w-3 rounded-full',
          shouldHighlight
            ? '!bg-primary'
            : variant === 'map'
              ? 'bg-neutral-500 dark:bg-foreground'
              : 'bg-foreground/50'
        )}
      />
    </span>
  )
}
