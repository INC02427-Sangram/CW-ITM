import { lazy } from "react";
import BadgeIcon from "@mui/icons-material/Badge";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import PeopleIcon from "@mui/icons-material/People";
import SecurityIcon from "@mui/icons-material/Security";
import GroupsIcon from "@mui/icons-material/Groups";
import AppsIcon from "@mui/icons-material/Apps";

/**
 * Admin Console nested routes and sub-side navigation.
 * Parent path: /admin-console/*
 */

const IDMHome = lazy(() => import("../pages/Admin Console/IDM/IDMHome"));
const IWAHome = lazy(
  () => import("../pages/Admin Console/IWA-UserManagement/IWAHome"),
);

/**
 * IWA accordion tabs under the Admin Console sub-side nav.
 */
export const iwaSubNavItems = [
  {
    id: "iwa-users",
    path: "/admin-console/iwa/users",
    label: "Users",
    moduleName: "Users",
    icon: PeopleIcon,
    index: 0,
  },
  {
    id: "iwa-roles",
    path: "/admin-console/iwa/roles",
    label: "Roles",
    moduleName: "Roles",
    icon: SecurityIcon,
    index: 1,
  },
  {
    id: "iwa-groups",
    path: "/admin-console/iwa/groups",
    label: "Groups",
    moduleName: "Groups",
    icon: GroupsIcon,
    index: 2,
  },
  {
    id: "iwa-application-master",
    path: "/admin-console/iwa/application-master",
    label: "Application Master",
    moduleName: "Application Master",
    icon: AppsIcon,
    index: 3,
  },
];

/**
 * Sub-side nav items shown when Admin Console is selected.
 * Items with `children` render as accordion dropdowns.
 */
export const adminConsoleSubNavItems = [
  {
    id: "idm",
    path: "/admin-console/idm",
    label: "IDM",
    moduleName: "IDM",
    icon: BadgeIcon,
    index: 0,
  },
  {
    id: "iwa",
    path: "/admin-console/iwa",
    label: "IWA",
    moduleName: "IWA",
    icon: ManageAccountsIcon,
    index: 1,
    children: iwaSubNavItems,
  },
];

/**
 * Nested routes under /admin-console
 */
export const adminConsoleRoutes = [
  {
    id: "idm",
    path: "idm/*",
    component: IDMHome,
  },
  {
    id: "iwa",
    path: "iwa/*",
    component: IWAHome,
  },
];

/**
 * Nested routes under /admin-console/iwa
 */
export const iwaRoutes = [
  {
    id: "users",
    path: "users/*",
    component: lazy(
      () => import("../pages/Admin Console/IWA-UserManagement/Users/UserSummary"),
    ),
  },
  {
    id: "roles",
    path: "roles/*",
    component: lazy(
      () => import("../pages/Admin Console/IWA-UserManagement/Roles/RolesSummary"),
    ),
  },
  {
    id: "groups",
    path: "groups/*",
    component: lazy(
      () =>
        import("../pages/Admin Console/IWA-UserManagement/Groups/GroupSummary"),
    ),
  },
  {
    id: "application-master",
    path: "application-master/*",
    component: lazy(
      () =>
        import(
          "../pages/Admin Console/IWA-UserManagement/ApplicationMaster/ApplicationSummary"
        ),
    ),
  },
];

/**
 * Nested routes under /admin-console/iwa/users
 */
export const iwaUsersRoutes = [
  {
    id: "create-user",
    path: "createUser",
    component: lazy(
      () => import("../pages/Admin Console/IWA-UserManagement/Users/CreateUser"),
    ),
  },
  {
    id: "quick-create-user",
    path: "quickCreateUser",
    component: lazy(
      () =>
        import("../pages/Admin Console/IWA-UserManagement/Users/QuickCreateUser"),
    ),
  },
  {
    id: "view-user",
    path: "viewUser/:userId",
    component: lazy(
      () => import("../pages/Admin Console/IWA-UserManagement/Users/ViewUser"),
    ),
  },
  {
    id: "edit-user",
    path: "editUser/:userId",
    component: lazy(
      () => import("../pages/Admin Console/IWA-UserManagement/Users/EditUser"),
    ),
  },
];

/**
 * Nested routes under /admin-console/iwa/application-master
 */
export const iwaApplicationMasterRoutes = [
  {
    id: "create-application",
    path: "createApplication",
    component: lazy(
      () =>
        import(
          "../pages/Admin Console/IWA-UserManagement/ApplicationMaster/CreateApplications"
        ),
    ),
  },
  {
    id: "view-application",
    path: "viewApplication/:appId",
    component: lazy(
      () =>
        import(
          "../pages/Admin Console/IWA-UserManagement/ApplicationMaster/ViewApplication"
        ),
    ),
  },
  {
    id: "edit-application",
    path: "editApplication/:appId",
    component: lazy(
      () =>
        import(
          "../pages/Admin Console/IWA-UserManagement/ApplicationMaster/EditApplication"
        ),
    ),
  },
];

/**
 * Nested routes under /admin-console/iwa/groups
 */
export const iwaGroupsRoutes = [
  {
    id: "create-group",
    path: "createGroup",
    component: lazy(
      () =>
        import("../pages/Admin Console/IWA-UserManagement/Groups/CreateGroup"),
    ),
  },
  {
    id: "view-group",
    path: "viewGroup/:groupId",
    component: lazy(
      () => import("../pages/Admin Console/IWA-UserManagement/Groups/ViewGroup"),
    ),
  },
  {
    id: "edit-group",
    path: "editGroup/:groupId",
    component: lazy(
      () => import("../pages/Admin Console/IWA-UserManagement/Groups/Editgroup"),
    ),
  },
];

export const getAdminConsoleSubNavItems = () =>
  [...adminConsoleSubNavItems].sort((a, b) => a.index - b.index);
