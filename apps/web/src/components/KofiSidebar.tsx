import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { KofiButton } from './KofiButton'

export const KofiSidebar = () => {
  return (
    <SidebarGroup className='mt-auto'>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <KofiButton />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}
