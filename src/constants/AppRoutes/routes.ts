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
  Database,
  DollarSign,
} from "lucide-react";

export const ROUTES = {
  AUTH: {
    LOGIN: "/login",
  },
  DASHBOARD: {
    INDEX: "/",
    USERS: "/platform-users",
    ANALYTICS: "/analytics",
    MESSAGES: "/messages",
    CALENDAR: "/calendar",
    SETTINGS: "/settings",
    SECURITY: "/security",
    NOTIFICATIONS: "/notifications",
    USER_MANAGEMENT: "/users/manage",
    USER_ROLES: "/users/roles",
    PROFILE: "/profile",
    BUSINESS: "/business",
    MANAGE_BUSINESS: "/manage-business",
    SUBSCRIPTION_PLAN: "/subscription-plan",
    BUSINESS_USER: "/business-user",
    MY_BUSINESS: "/my-business",
    SUBSCRIPTION: "/subscription",
    MY_SUBSCRIPTION: "/my-subscription",
    EXCHANGE_RATE: "/exchange-rate",
    PAYMENT: "/payment",
    USERS_BUSINESS: "/users",
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
    title: "Master Data",
    section: "Master Data",
    icon: Database,
    subroutes: [
      {
        title: "Business",
        href: ROUTES.DASHBOARD.BUSINESS,
      },
      {
        title: "Subscription Plan",
        href: ROUTES.DASHBOARD.SUBSCRIPTION_PLAN,
      },
    ],
  },
  {
    title: "Platform User",
    section: "Platform Users",
    icon: Users,
    subroutes: [
      {
        title: "Manage Users",
        href: ROUTES.DASHBOARD.USERS,
      },
      {
        title: "Subscriptions",
        href: ROUTES.DASHBOARD.SUBSCRIPTION,
      },
    ],
  },
  {
    title: "Business User",
    section: "Business User",
    icon: Users,
    subroutes: [
      {
        title: "Manage Owners",
        href: ROUTES.DASHBOARD.BUSINESS_USER,
      },
      {
        title: "Manage Users",
        href: ROUTES.DASHBOARD.BUSINESS_USER,
      },
      {
        title: "Manage Business",
        href: ROUTES.DASHBOARD.USERS_BUSINESS,
      },
      {
        title: "Subscription",
        href: ROUTES.DASHBOARD.MY_SUBSCRIPTION,
      },
      {
        title: "Setting",
        href: ROUTES.DASHBOARD.MY_BUSINESS,
      },
    ],
  },
  {
    title: "Payment",
    section: "Payment",
    icon: DollarSign,
    subroutes: [
      {
        title: "Exchange Rates ",
        href: ROUTES.DASHBOARD.EXCHANGE_RATE,
      },
      {
        title: "Payment",
        href: ROUTES.DASHBOARD.PAYMENT,
      },
    ],
  },
  {
    title: "Messages",
    href: ROUTES.DASHBOARD.MESSAGES,
    icon: Inbox,
  },
  {
    title: "Settings",
    href: ROUTES.DASHBOARD.SETTINGS,
    icon: Settings,
  },
  {
    title: "Notifications",
    href: ROUTES.DASHBOARD.NOTIFICATIONS,
    icon: Bell,
  },
];
