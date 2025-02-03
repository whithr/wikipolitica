import { ChevronRight, Construction, type LucideIcon } from 'lucide-react'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { Link } from '@tanstack/react-router'
import { cx } from 'class-variance-authority'
import { Badge } from '@/components/ui/badge'

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    defaultOpen?: boolean
    wip?: boolean
    items?: {
      title: string
      url: string
      wip?: boolean
    }[]
  }[]
}) {
  const { state, isMobile, setOpenMobile } = useSidebar()

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) =>
          item.items ? (
            <SidebarMenuItem key={item.title}>
              {state !== 'expanded' && !isMobile ? (
                // If collapsed, make the button a direct Link
                <SidebarMenuButton
                  asChild
                  tooltip={
                    item.wip ? `${item.title} (Work in Progress)` : item.title
                  }
                  className={cx(
                    'text-nowrap',
                    item.wip &&
                    state === 'collapsed' &&
                    'hover:cursor-not-allowed hover:!bg-transparent'
                  )}
                >
                  <Link
                    to={item.url}
                    className='text-nowrap'
                    disabled={item.wip}
                    onClick={() => setOpenMobile(false)}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              ) : (
                // If expanded, allow collapsing behavior
                <Collapsible
                  asChild
                  defaultOpen={item.isActive || item.defaultOpen}
                  className='group/collapsible'
                >
                  <div>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={
                          item.wip
                            ? `${item.title} (Work in Progress)`
                            : item.title
                        }
                        className={cx(
                          'text-nowrap',
                          item.wip &&
                          state === 'expanded' &&
                          'hover:cursor-not-allowed hover:!bg-transparent'
                        )}
                      >
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        {item.wip ? (
                          <Badge
                            variant='default'
                            size='sm'
                            className='ml-auto bg-primary/50 hover:bg-primary/50'
                          >
                            WIP
                          </Badge>
                        ) : (
                          <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                        )}
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              className={
                                subItem.wip ? 'hover:!bg-transparent' : ''
                              }
                            >
                              <div
                                className={cx(
                                  'flex',
                                  subItem.wip && 'hover:cursor-not-allowed'
                                )}
                              >
                                {subItem.wip && (
                                  <Construction className='stroke-primary dark:stroke-primary' />
                                )}
                                <Link
                                  to={subItem.url}
                                  className={cx(
                                    'text-nowrap',
                                    subItem.wip && 'opacity-50'
                                  )}
                                  disabled={subItem.wip}
                                  onClick={() => setOpenMobile(false)}
                                >
                                  <span>{subItem.title}</span>
                                </Link>
                              </div>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              )}
            </SidebarMenuItem>
          ) : (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.wip ? `${item.title} work` : item.title}
              >
                <Link
                  to={item.url}
                  className='text-nowrap'
                  onClick={() => setOpenMobile(false)}
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        )}
      </SidebarMenu>
    </SidebarGroup>
  )
}
