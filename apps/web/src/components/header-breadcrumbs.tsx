import { NavItem, navItems } from '@/components/app-sidebar'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { useLocation } from '@tanstack/react-router'
import React from 'react'

const findBreadcrumbs = (
  navItems: NavItem[],
  currentPath: string
): NavItem[] => {
  for (const item of navItems) {
    if (item.url === currentPath) {
      return [item]
    }
    if (item.items) {
      const breadcrumbs = findBreadcrumbs(item.items, currentPath)
      if (breadcrumbs.length) {
        return [item, ...breadcrumbs]
      }
    }
  }
  return []
}

export const HeaderBreadcrumbs = () => {
  const location = useLocation()
  const currentPath = location.pathname

  const mainBreadcrumbs = findBreadcrumbs(navItems.navMain, currentPath)
  const singleBreadcrumb = navItems.navSingle.find(
    (item) => item.url === currentPath
  )

  // Combine results: mainBreadcrumbs or singleBreadcrumb
  const breadcrumbs =
    mainBreadcrumbs.length > 0
      ? mainBreadcrumbs
      : singleBreadcrumb
        ? [singleBreadcrumb]
        : []

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={`fragment_${index}`}>
            <BreadcrumbItem key={`item_${index}`}>
              {index < breadcrumbs.length - 1 ? (
                <>
                  <BreadcrumbLink href={crumb.url}>
                    {crumb.title}
                  </BreadcrumbLink>
                </>
              ) : (
                <BreadcrumbPage>{crumb.title}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index < breadcrumbs.length - 1 && (
              <BreadcrumbSeparator key={`separator_${index}`} />
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
