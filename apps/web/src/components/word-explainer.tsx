import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import React from 'react'
import { politicalDictionary } from '@/lib/dictonary'
import { cn } from '@/lib/utils'

interface WordExplainerProps {
  text: string
}

export const WordExplainer: React.FC<WordExplainerProps> = ({ text }) => {
  if (!text) return null

  // Create regex to match any word in `words`
  const regex = new RegExp(
    `(${Object.keys(politicalDictionary).join('|')})`,
    'gi'
  )
  const parts = text.split(regex)

  return (
    <>
      {parts.map((part, index) => {
        const wordKey = part.toLowerCase()
        if (politicalDictionary[wordKey]) {
          return (
            <Popover key={index}>
              <PopoverTrigger
                className='decoration-xl underline decoration-primary decoration-solid underline-offset-4'
                style={{
                  textDecorationThickness: '4px',
                }}
              >
                {part}
              </PopoverTrigger>
              <PopoverContent className='text-md max-w-64 border-none bg-foreground px-4 py-2 text-background'>
                {politicalDictionary[wordKey]}
              </PopoverContent>
            </Popover>
          )
        }
        return part
      })}
    </>
  )
}

export const SingleWordExplainer = ({
  description,
  word,
  className,
}: {
  description: string
  word: string
  className?: string
}) => {
  if (!description || !word) return null

  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          'mx-0.5 underline decoration-primary decoration-solid underline-offset-4 dark:decoration-primary/50',
          className
        )}
        style={{
          textDecorationThickness: '4px',
        }}
      >
        {word}
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          'text-md w-fit max-w-64 border-none bg-foreground px-4 py-2 text-background',
          className
        )}
      >
        {description}
      </PopoverContent>
    </Popover>
  )
}
