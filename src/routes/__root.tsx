import { AppSidebar } from '@/components/app-sidebar';
import { HeaderBreadcrumbs } from '@/components/header-breadcrumbs';

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Separator } from '@radix-ui/react-separator';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

export const Route = createRootRoute({
  component: () => (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
          <div className='flex items-center gap-2 px-4'>
            <SidebarTrigger className='-ml-1' />
            <Separator orientation='vertical' className='mr-2 h-4' />
            <HeaderBreadcrumbs />
          </div>
        </header>
        <div className='min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min m-4 mt-0 p-4'>
          <Outlet />
        </div>
      </SidebarInset>
      <TanStackRouterDevtools position='bottom-right' />
    </SidebarProvider>
  ),
});
