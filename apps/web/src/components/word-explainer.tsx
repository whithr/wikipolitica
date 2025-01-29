import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip'
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
            <Tooltip key={index}>
              <TooltipTrigger className='underline decoration-dashed underline-offset-4'>
                {part}
              </TooltipTrigger>
              <TooltipContent className='text-md max-w-64 px-4 py-2'>
                {politicalDictionary[wordKey]}
              </TooltipContent>
            </Tooltip>
          )
        }
        return part
      })}
    </>
  )
}
