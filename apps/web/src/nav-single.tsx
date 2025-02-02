import { type LucideIcon } from 'lucide-react'

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Link } from '@tanstack/react-router'
import { ExternalLink } from './components/external-link'

export function NavSingle({
  items,
  className,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    isExternal?: boolean
  }[]
  className?: string
}) {
  return (
    <SidebarGroup className={className}>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild tooltip={item.title}>
              {item.isExternal ? (
                <ExternalLink
                  href={item.url}
                  // className='text-nowrap'
                  label={
                    <>
                      {' '}
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </>
                  }
                />
              ) : (
                <Link to={item.url} className='text-nowrap'>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
