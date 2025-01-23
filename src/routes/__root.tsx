import { AppSidebar } from '@/components/AppSidebar';
import { Button } from '@/components/ui/button';
import { SidebarProvider } from '@/components/ui/sidebar';
import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

export const Route = createRootRoute({
  component: () => (
    <>
      <SidebarProvider>
        {/* <div className='p-2 flex gap-2'>
          <Link to='/' className='[&.active]:font-bold'>
            Home
          </Link>{' '}
          <Link to='/about' className='[&.active]:font-bold'>
            About
          </Link>{' '}
          <Link to='/countries' className='[&.active]:font-bold'>
            Countries
          </Link>
        </div>
        <hr />
        <Button>Hello World</Button> */}
        <AppSidebar />
        <Outlet />
        <TanStackRouterDevtools />
      </SidebarProvider>
    </>
  ),
});
