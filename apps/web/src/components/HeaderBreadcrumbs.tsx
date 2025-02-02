import { NavItem, navItems } from '@/components/AppSidebar'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { Link, useLocation } from '@tanstack/react-router'
import React from 'react'

/**
 * Recursively searches for matching breadcrumbs in navItems.
 */
const findBreadcrumbs = (navItems: NavItem[], path: string): NavItem[] => {
  for (const item of navItems) {
    if (item.url === path) {
      return [item]
    }
    if (item.items) {
      const breadcrumbs = findBreadcrumbs(item.items, path)
      if (breadcrumbs.length) {
        return [item, ...breadcrumbs]
      }
    }
  }
  return []
}

/**
 * Removes any path segments that look like a UUID.
 * Example: /projects/41b07629-26c8-4b3a-8c27-d99fb2883d78/edit
 * becomes /projects/edit
 */
function removeUuidSegments(fullPath: string) {
  const uuidRegex =
    /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/

  // Split on '/', remove empty segments, then filter out UUIDs
  const segments = fullPath.split('/').filter(Boolean)
  const cleanSegments = segments.filter((segment) => !uuidRegex.test(segment))

  // Rebuild a path, ensuring we keep the leading slash
  return '/' + cleanSegments.join('/')
}

export const HeaderBreadcrumbs = () => {
  const location = useLocation()
  const currentPath = location.pathname

  // Generate a path that excludes any UUID segments
  const sanitizedPath = removeUuidSegments(currentPath)

  // Get a possible match from the "navMain" items
  const mainBreadcrumbs = findBreadcrumbs(navItems.navMain, sanitizedPath)

  // Or see if there's a single nav item that directly matches
  const singleBreadcrumb = navItems.navSingle.find(
    (item) => item.url === sanitizedPath
  )

  // Combine results
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
                <BreadcrumbLink asChild>
                  <Link to={crumb.url}>{crumb.title}</Link>
                </BreadcrumbLink>
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
