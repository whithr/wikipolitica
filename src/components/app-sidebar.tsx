import * as React from 'react'
import {
  Gavel,
  MessageCircleQuestion,
  Scale,
  Settings2,
  UserCircle,
} from 'lucide-react'

import { NavMain } from '@/components/nav-main'

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import { NavHeader } from './nav-header'
import { NavSingle } from '@/nav-single'

export type NavItem = {
  title: string
  url: string
  items?: NavItem[] // Optional sub-items for nested navigation
}

export type NavData = {
  navMain: NavItem[]
}

export const navItems = {
  navMain: [
    {
      title: 'Executive Branch',
      url: '/executive',
      icon: UserCircle,
      items: [
        { title: 'President', url: '/executive/president' },
        { title: 'Vice President', url: '/executive/vice-president' },
        {
          title: 'Cabinet',
          url: '/executive/cabinet',
          items: [
            { title: 'Secretaries', url: '/executive/cabinet/secretaries' },
            { title: 'Agencies', url: '/executive/cabinet/agencies' },
          ],
        },
        { title: 'Executive Orders', url: '/executive/orders' },
      ],
    },
    {
      title: 'Legislative Branch',
      url: '/legislative',
      icon: Gavel,
      items: [
        { title: 'Senate', url: '/legislative/senate' },
        { title: 'House of Representatives', url: '/legislative/house' },
        { title: 'Bills & Legislation', url: '/legislative/bills' },
        { title: 'Voting Records', url: '/legislative/voting' },
      ],
    },
    {
      title: 'Judicial Branch',
      url: '/judicial',
      icon: Scale,
      items: [
        { title: 'Supreme Court', url: '/judicial/supreme' },
        { title: 'Federal Courts', url: '/judicial/federal' },
        { title: 'Legal Opinions', url: '/judicial/opinions' },
      ],
    },
  ],
  navSingle: [
    { title: 'Settings', url: '/settings', icon: Settings2 },
    { title: 'FAQ', url: '/faq', icon: MessageCircleQuestion },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible='icon' {...props} className='bg-background'>
      <SidebarHeader>
        <NavHeader />
      </SidebarHeader>
      <SidebarContent className='gap-1'>
        <NavMain items={navItems.navMain} />
        <SidebarSeparator />
        <NavSingle items={navItems.navSingle} />
      </SidebarContent>
      {/* <SidebarRail /> */}
    </Sidebar>
  )
}
