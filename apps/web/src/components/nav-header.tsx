import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import logo from '../assets/large-logo-transparent.png'
import { Link } from '@tanstack/react-router'

export function NavHeader() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size='lg'
          className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
          asChild
        >
          <Link to='/' className='flex items-center gap-2'>
            <img src={logo} className='size-8 justify-center' />
            <div className='grid flex-1 text-left leading-tight'>
              <span className='truncate text-xl font-bold'>wikipolitica</span>
              <span className='-mt-1 truncate text-xs font-normal italic'>
                nonpartisan politics
              </span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
