// Route.tsx

import { AppSidebar } from '@/components/app-sidebar'
import { HeaderBreadcrumbs } from '@/components/header-breadcrumbs'
import { ThemeModeToggle } from '@/components/theme-mode-toggle'
import { ScrollArea } from '@/components/ui/scroll-area'

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Separator } from '@radix-ui/react-separator'
import { Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const RootRoute = () => (
  <SidebarProvider>
    <AppSidebar />
    {/* Make SidebarInset a flex container with column direction */}
    <SidebarInset className='flex h-full flex-col'>
      <header className='full-bleed sticky top-0 z-20 flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background bg-opacity-25 backdrop-blur-sm backdrop-filter transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
        <div className='flex w-full items-center gap-2 px-4'>
          <SidebarTrigger className='-ml-1' />
          <Separator orientation='vertical' className='mr-2 h-4' />
          <HeaderBreadcrumbs />
          <div className='flex-1' />
          <ThemeModeToggle />
        </div>
      </header>

      {/* <div className='w-full min-w-fit flex-1 self-center'> */}
      <ScrollArea className='flex-1 overflow-y-auto p-0'>
        <div className='STYLEOVERRIDE flex h-[calc(100dvh-64px)] w-full min-w-fit max-w-6xl flex-1 justify-self-center'>
          <Outlet />
        </div>
      </ScrollArea>
      {/* </div> */}
    </SidebarInset>
    {import.meta.env.MODE === 'development' && (
      <TanStackRouterDevtools position='bottom-right' />
    )}
  </SidebarProvider>
)
