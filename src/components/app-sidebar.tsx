import * as React from 'react';
import {
  Gavel,
  MessageCircleQuestion,
  Scale,
  Settings2,
  UserCircle,
} from 'lucide-react';

import { NavMain } from '@/components/nav-main';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { NavHeader } from './nav-header';
import { NavSingle } from '@/nav-single';

const data = {
  navMain: [
    {
      title: 'Executive Branch',
      url: '#',
      icon: UserCircle,
      isActive: true,
      items: [
        {
          title: 'President',
          url: '#',
        },
        {
          title: 'Vice President',
          url: '#',
        },
        {
          title: 'Cabinet',
          url: '#',
          items: [
            { title: 'Secretaries', url: '#' },
            { title: 'Agencies', url: '#' },
          ],
        },
        {
          title: 'Executive Orders',
          url: '#',
        },
      ],
    },
    {
      title: 'Legislative Branch',
      url: '#',
      icon: Gavel,
      items: [
        {
          title: 'Senate',
          url: '#',
          items: [
            { title: 'Senators', url: '#' },
            { title: 'Committees', url: '#' },
          ],
        },
        {
          title: 'House of Representatives',
          url: '#',
          items: [
            { title: 'Representatives', url: '#' },
            { title: 'Committees', url: '#' },
          ],
        },
        {
          title: 'Bills & Legislation',
          url: '#',
        },
        {
          title: 'Voting Records',
          url: '#',
        },
      ],
    },
    {
      title: 'Judicial Branch',
      url: '#',
      icon: Scale,
      items: [
        {
          title: 'Supreme Court',
          url: '#',
          items: [
            { title: 'Justices', url: '#' },
            { title: 'Major Cases', url: '#' },
          ],
        },
        {
          title: 'Federal Courts',
          url: '#',
          items: [
            { title: 'Circuit Courts', url: '#' },
            { title: 'District Courts', url: '#' },
          ],
        },
        {
          title: 'Legal Opinions',
          url: '#',
        },
      ],
    },
  ],
  navSingle: [
    {
      title: 'Settings',
      url: '#',
      icon: Settings2,
    },
    {
      title: 'FAQ',
      url: '#',
      icon: MessageCircleQuestion,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <NavHeader />
      </SidebarHeader>
      <SidebarContent className='gap-1'>
        <NavMain items={data.navMain} />
        <SidebarSeparator />
        <NavSingle items={data.navSingle} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
