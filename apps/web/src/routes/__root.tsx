// Route.tsx

import { AppSidebar } from '@/components/app-sidebar'
import { HeaderBreadcrumbs } from '@/components/header-breadcrumbs'
import { KofiButton } from '@/components/KofiButton'
import { PresidentCalendarProvider } from '@/components/president/president-calendar-context'
import { ThemeModeToggle } from '@/components/theme-mode-toggle'
import { ScrollArea } from '@/components/ui/scroll-area'

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Separator } from '@radix-ui/react-separator'
import { Outlet, useRouterState } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { useRef, useEffect } from 'react'

function getRouteCategory(pathname: string) {
  // For your “executive/president” schedule route
  if (pathname.startsWith('/executive/president')) {
    return 'president'
  }
  // For your “executive/orders” route
  if (pathname.startsWith('/executive/orders')) {
    return 'orders'
  }
  // For everything else (home, FAQ, etc.)
  return 'other'
}

export const RootRoute = () => {
  const { location } = useRouterState()

  const pathname = location.pathname
  const currentCategory = getRouteCategory(pathname)
  const prevCategoryRef = useRef(currentCategory)

  const scrollRef = useRef<HTMLDivElement | null>(null)

  // We need to reset the scroll position because we are using
  useEffect(() => {
    if (prevCategoryRef.current !== currentCategory) {
      scrollRef.current?.scrollTo?.({ top: 0, behavior: 'auto' })
    }
    prevCategoryRef.current = currentCategory
  }, [currentCategory])

  return (
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
            <KofiButton />
            <ThemeModeToggle />
          </div>
        </header>

        {/* <div className='w-full min-w-fit flex-1 self-center'> */}
        <ScrollArea className='flex-1 overflow-y-auto p-0' ref={scrollRef}>
          <div className='STYLEOVERRIDE flex h-[calc(100dvh-64px)] w-full min-w-fit max-w-6xl flex-1 justify-self-center'>
            <PresidentCalendarProvider>
              <Outlet />
            </PresidentCalendarProvider>
          </div>
        </ScrollArea>
        {/* </div> */}
      </SidebarInset>
      {import.meta.env.MODE === 'development' && (
        <TanStackRouterDevtools position='bottom-right' />
      )}
    </SidebarProvider>
  )
}
