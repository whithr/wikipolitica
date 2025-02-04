import * as React from 'react'
import {
  Gavel,
  Github,
  Home,
  MessageCircleQuestion,
  RadioTower,
  Scale,
  TrafficCone,
  UserCircle,
} from 'lucide-react'

import { NavMain } from '@/components/NavMain'

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import { NavHeader } from './NavHeader'
import { NavSingle } from './NavSingle'

export type NavItem = {
  title: string
  url: string
  wip?: boolean
  defaultOpen?: boolean
  items?: NavItem[] // Optional sub-items for nested navigation
}

export type NavData = {
  navMain: NavItem[]
}

export const navItems = {
  navMain: [
    { title: 'Overview', url: '/', icon: Home },
    {
      title: 'Executive Branch',
      url: '/executive',
      icon: UserCircle,
      defaultOpen: true,
      items: [
        { title: 'President', url: '/executive/president' },
        { title: 'Executive Orders', url: '/executive/orders' },

        {
          title: 'Vice President',
          url: '/executive/vice-president',
          wip: true,
        },
        {
          title: 'Cabinet',
          url: '/executive/cabinet',
          wip: true,
        },
      ],
    },
    {
      title: 'Legislative Branch',
      url: '/legislative',
      icon: Gavel,
      wip: true,
      items: [
        { title: 'Senate', url: '/legislative/senate', wip: true },
        {
          title: 'House of Representatives',
          url: '/legislative/house',
          wip: true,
        },
        { title: 'Bills & Legislation', url: '/legislative/bills', wip: true },
        { title: 'Voting Records', url: '/legislative/voting', wip: true },
      ],
    },
    {
      title: 'Judicial Branch',
      url: '/judicial',
      icon: Scale,
      wip: true,
      items: [
        { title: 'Supreme Court', url: '/judicial/supreme', wip: true },
        { title: 'Federal Courts', url: '/judicial/federal', wip: true },
        { title: 'Legal Opinions', url: '/judicial/opinions', wip: true },
      ],
    },
  ],
  navSingle: [
    {
      title: 'FAQ',
      url: '/frequently-asked-questions',
      icon: MessageCircleQuestion,
    },
    { title: 'Roadmap', url: '/roadmap', icon: TrafficCone },
    { title: 'Status', url: '/status', icon: RadioTower },
  ],
  navBottom: [
    {
      title: 'Source Code',
      url: 'https://github.com/whithr/wikipolitica',
      icon: Github,
    },
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
        <SidebarSeparator />
        <NavSingle items={navItems.navBottom} className='mt-auto' />
      </SidebarContent>
    </Sidebar>
  )
}
