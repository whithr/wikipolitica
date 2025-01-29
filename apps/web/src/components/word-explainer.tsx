import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import React from 'react'
import { politicalDictionary } from '@/lib/dictonary'

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
              <PopoverTrigger className='underline decoration-dashed underline-offset-4'>
                {part}
              </PopoverTrigger>
              <PopoverContent className='text-md max-w-64 bg-foreground px-4 py-2 text-background'>
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
