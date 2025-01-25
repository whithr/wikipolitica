// Route.tsx

import { AppSidebar } from '@/components/app-sidebar'
import { HeaderBreadcrumbs } from '@/components/header-breadcrumbs'
import { ThemeModeToggle } from '@/components/theme-mode-toggle'

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Separator } from '@radix-ui/react-separator'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
  component: () => (
    <SidebarProvider>
      <AppSidebar />
      {/* Make SidebarInset a flex container with column direction */}
      <SidebarInset className='flex h-full flex-col'>
        <header className='sticky top-0 z-[5000] flex h-16 shrink-0 items-center gap-2 bg-background bg-opacity-25 shadow-sm backdrop-blur-sm backdrop-filter transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
          <div className='flex w-full items-center gap-2 px-4'>
            <SidebarTrigger className='-ml-1' />
            <Separator orientation='vertical' className='mr-2 h-4' />
            <HeaderBreadcrumbs />
            <div className='flex-1' />
            <ThemeModeToggle />
          </div>
        </header>
        {/* Make the content area scrollable */}
        <div className='m-0 min-h-[100vh] w-full min-w-fit max-w-6xl flex-1 self-center overflow-y-auto rounded-xl bg-muted/50 p-2 md:m-4 md:min-h-min md:p-4'>
          <Outlet />
        </div>
      </SidebarInset>
      <TanStackRouterDevtools position='bottom-right' />
    </SidebarProvider>
  ),
})
