import {
  BarChart3,
  Bell,
  Calendar,
  Home,
  Inbox,
  Settings,
  Shield,
  Users,
  LucideIcon,
} from "lucide-react";

export const ROUTES = {
  AUTH: {
    LOGIN: "/login",
  },
  DASHBOARD: {
    INDEX: "/",
    USERS: "/users",
    ANALYTICS: "/analytics",
    MESSAGES: "/messages",
    CALENDAR: "/calendar",
    SETTINGS: "/settings",
    SECURITY: "/security",
    NOTIFICATIONS: "/notifications",
    USER_MANAGEMENT: "/users/manage",
    USER_ROLES: "/users/roles",
    PROFILE: "/profile",
  },
} as const;

type Subroute = {
  title: string;
  href: string;
};

type SidebarItem = {
  title: string;
  href?: string;
  icon?: LucideIcon;
  image?: string;
  section?: string;
  subroutes?: Subroute[];
};

export const sidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    href: ROUTES.DASHBOARD.INDEX,
    icon: Home,
  },
  {
    title: "Users",
    section: "users",
    icon: Users,
    subroutes: [
      {
        title: "Manage Users",
        href: ROUTES.DASHBOARD.USERS,
      },
      {
        title: "User Roles",
        href: ROUTES.DASHBOARD.USER_ROLES,
      },
    ],
  },
  {
    title: "Analytics",
    href: ROUTES.DASHBOARD.ANALYTICS,
    icon: BarChart3,
  },
  {
    title: "Messages",
    href: ROUTES.DASHBOARD.MESSAGES,
    icon: Inbox,
  },
  {
    title: "Calendar",
    href: ROUTES.DASHBOARD.CALENDAR,
    icon: Calendar,
  },
  {
    title: "Settings",
    href: ROUTES.DASHBOARD.SETTINGS,
    icon: Settings,
  },
  {
    title: "Security",
    href: ROUTES.DASHBOARD.SECURITY,
    icon: Shield,
  },
  {
    title: "Notifications",
    href: ROUTES.DASHBOARD.NOTIFICATIONS,
    icon: Bell,
  },
];
