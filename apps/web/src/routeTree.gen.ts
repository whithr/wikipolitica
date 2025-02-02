/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as RoadmapRoadmapImport } from './routes/roadmap/Roadmap'
import { Route as HomeOverviewImport } from './routes/home/Overview'
import { Route as FaqFAQImport } from './routes/faq/FAQ'
import { Route as ExecutivePresidentialScheduleImport } from './routes/executive/presidential-schedule'
import { Route as ExecutivePresidentialActionsImport } from './routes/executive/presidential-actions'

// Create Virtual Routes

const AboutLazyImport = createFileRoute('/about')()
const IndexLazyImport = createFileRoute('/')()
const ExecutiveVicePresidentLazyImport = createFileRoute(
  '/executive/vice-president',
)()

// Create/Update Routes

const AboutLazyRoute = AboutLazyImport.update({
  id: '/about',
  path: '/about',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/about.lazy').then((d) => d.Route))

const IndexLazyRoute = IndexLazyImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/index.lazy').then((d) => d.Route))

const ExecutiveVicePresidentLazyRoute = ExecutiveVicePresidentLazyImport.update(
  {
    id: '/executive/vice-president',
    path: '/executive/vice-president',
    getParentRoute: () => rootRoute,
  } as any,
).lazy(() =>
  import('./routes/executive/vice-president.lazy').then((d) => d.Route),
)

const RoadmapRoadmapRoute = RoadmapRoadmapImport.update({
  id: '/roadmap/Roadmap',
  path: '/roadmap/Roadmap',
  getParentRoute: () => rootRoute,
} as any)

const HomeOverviewRoute = HomeOverviewImport.update({
  id: '/home/Overview',
  path: '/home/Overview',
  getParentRoute: () => rootRoute,
} as any)

const FaqFAQRoute = FaqFAQImport.update({
  id: '/faq/FAQ',
  path: '/faq/FAQ',
  getParentRoute: () => rootRoute,
} as any)

const ExecutivePresidentialScheduleRoute =
  ExecutivePresidentialScheduleImport.update({
    id: '/executive/presidential-schedule',
    path: '/executive/presidential-schedule',
    getParentRoute: () => rootRoute,
  } as any)

const ExecutivePresidentialActionsRoute =
  ExecutivePresidentialActionsImport.update({
    id: '/executive/presidential-actions',
    path: '/executive/presidential-actions',
    getParentRoute: () => rootRoute,
  } as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/about': {
      id: '/about'
      path: '/about'
      fullPath: '/about'
      preLoaderRoute: typeof AboutLazyImport
      parentRoute: typeof rootRoute
    }
    '/executive/presidential-actions': {
      id: '/executive/presidential-actions'
      path: '/executive/presidential-actions'
      fullPath: '/executive/presidential-actions'
      preLoaderRoute: typeof ExecutivePresidentialActionsImport
      parentRoute: typeof rootRoute
    }
    '/executive/presidential-schedule': {
      id: '/executive/presidential-schedule'
      path: '/executive/presidential-schedule'
      fullPath: '/executive/presidential-schedule'
      preLoaderRoute: typeof ExecutivePresidentialScheduleImport
      parentRoute: typeof rootRoute
    }
    '/faq/FAQ': {
      id: '/faq/FAQ'
      path: '/faq/FAQ'
      fullPath: '/faq/FAQ'
      preLoaderRoute: typeof FaqFAQImport
      parentRoute: typeof rootRoute
    }
    '/home/Overview': {
      id: '/home/Overview'
      path: '/home/Overview'
      fullPath: '/home/Overview'
      preLoaderRoute: typeof HomeOverviewImport
      parentRoute: typeof rootRoute
    }
    '/roadmap/Roadmap': {
      id: '/roadmap/Roadmap'
      path: '/roadmap/Roadmap'
      fullPath: '/roadmap/Roadmap'
      preLoaderRoute: typeof RoadmapRoadmapImport
      parentRoute: typeof rootRoute
    }
    '/executive/vice-president': {
      id: '/executive/vice-president'
      path: '/executive/vice-president'
      fullPath: '/executive/vice-president'
      preLoaderRoute: typeof ExecutiveVicePresidentLazyImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexLazyRoute
  '/about': typeof AboutLazyRoute
  '/executive/presidential-actions': typeof ExecutivePresidentialActionsRoute
  '/executive/presidential-schedule': typeof ExecutivePresidentialScheduleRoute
  '/faq/FAQ': typeof FaqFAQRoute
  '/home/Overview': typeof HomeOverviewRoute
  '/roadmap/Roadmap': typeof RoadmapRoadmapRoute
  '/executive/vice-president': typeof ExecutiveVicePresidentLazyRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexLazyRoute
  '/about': typeof AboutLazyRoute
  '/executive/presidential-actions': typeof ExecutivePresidentialActionsRoute
  '/executive/presidential-schedule': typeof ExecutivePresidentialScheduleRoute
  '/faq/FAQ': typeof FaqFAQRoute
  '/home/Overview': typeof HomeOverviewRoute
  '/roadmap/Roadmap': typeof RoadmapRoadmapRoute
  '/executive/vice-president': typeof ExecutiveVicePresidentLazyRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexLazyRoute
  '/about': typeof AboutLazyRoute
  '/executive/presidential-actions': typeof ExecutivePresidentialActionsRoute
  '/executive/presidential-schedule': typeof ExecutivePresidentialScheduleRoute
  '/faq/FAQ': typeof FaqFAQRoute
  '/home/Overview': typeof HomeOverviewRoute
  '/roadmap/Roadmap': typeof RoadmapRoadmapRoute
  '/executive/vice-president': typeof ExecutiveVicePresidentLazyRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/about'
    | '/executive/presidential-actions'
    | '/executive/presidential-schedule'
    | '/faq/FAQ'
    | '/home/Overview'
    | '/roadmap/Roadmap'
    | '/executive/vice-president'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/about'
    | '/executive/presidential-actions'
    | '/executive/presidential-schedule'
    | '/faq/FAQ'
    | '/home/Overview'
    | '/roadmap/Roadmap'
    | '/executive/vice-president'
  id:
    | '__root__'
    | '/'
    | '/about'
    | '/executive/presidential-actions'
    | '/executive/presidential-schedule'
    | '/faq/FAQ'
    | '/home/Overview'
    | '/roadmap/Roadmap'
    | '/executive/vice-president'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexLazyRoute: typeof IndexLazyRoute
  AboutLazyRoute: typeof AboutLazyRoute
  ExecutivePresidentialActionsRoute: typeof ExecutivePresidentialActionsRoute
  ExecutivePresidentialScheduleRoute: typeof ExecutivePresidentialScheduleRoute
  FaqFAQRoute: typeof FaqFAQRoute
  HomeOverviewRoute: typeof HomeOverviewRoute
  RoadmapRoadmapRoute: typeof RoadmapRoadmapRoute
  ExecutiveVicePresidentLazyRoute: typeof ExecutiveVicePresidentLazyRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexLazyRoute: IndexLazyRoute,
  AboutLazyRoute: AboutLazyRoute,
  ExecutivePresidentialActionsRoute: ExecutivePresidentialActionsRoute,
  ExecutivePresidentialScheduleRoute: ExecutivePresidentialScheduleRoute,
  FaqFAQRoute: FaqFAQRoute,
  HomeOverviewRoute: HomeOverviewRoute,
  RoadmapRoadmapRoute: RoadmapRoadmapRoute,
  ExecutiveVicePresidentLazyRoute: ExecutiveVicePresidentLazyRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/about",
        "/executive/presidential-actions",
        "/executive/presidential-schedule",
        "/faq/FAQ",
        "/home/Overview",
        "/roadmap/Roadmap",
        "/executive/vice-president"
      ]
    },
    "/": {
      "filePath": "index.lazy.tsx"
    },
    "/about": {
      "filePath": "about.lazy.tsx"
    },
    "/executive/presidential-actions": {
      "filePath": "executive/presidential-actions.tsx"
    },
    "/executive/presidential-schedule": {
      "filePath": "executive/presidential-schedule.tsx"
    },
    "/faq/FAQ": {
      "filePath": "faq/FAQ.tsx"
    },
    "/home/Overview": {
      "filePath": "home/Overview.tsx"
    },
    "/roadmap/Roadmap": {
      "filePath": "roadmap/Roadmap.tsx"
    },
    "/executive/vice-president": {
      "filePath": "executive/vice-president.lazy.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
