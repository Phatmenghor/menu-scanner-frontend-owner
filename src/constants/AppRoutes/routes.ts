import {
  BarChart3,
  Bell,
  Calendar,
  Home,
  Inbox,
  Settings,
  Shield,
  Users,
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
  },
};

// Enhanced navigation structure with modern grouping
export const navigationGroups = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        href: ROUTES.DASHBOARD.INDEX,
        icon: Home,
        description: "Main overview",
      },
      {
        title: "Analytics",
        href: "#",
        icon: BarChart3,
        description: "Performance insights",
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        title: "Users",
        href: "#",
        icon: Users,
        description: "User management",
      },
      {
        title: "Messages",
        href: "#",
        icon: Inbox,
        description: "Communication hub",
      },
      {
        title: "Calendar",
        href: "#",
        icon: Calendar,
        description: "Schedule & events",
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        title: "Settings",
        href: "#",
        icon: Settings,
        description: "App preferences",
      },
      {
        title: "Security",
        href: "#",
        icon: Shield,
        description: "Security settings",
      },
      {
        title: "Notifications",
        href: "#",
        icon: Bell,
        description: "Alert management",
      },
    ],
  },
];
