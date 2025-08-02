import {
  Bell,
  Home,
  Inbox,
  Settings,
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
    INDEX: "/admin",
    USERS: "/admin/platform-users",
    MESSAGES: "/admin/messages",
    CALENDAR: "/admin/calendar",
    SETTINGS: "/admin/settings",
    SECURITY: "/admin/security",
    NOTIFICATIONS: "/admin/notifications",
    USER_MANAGEMENT: "/admin/users/manage",
    USER_ROLES: "/admin/users/roles",
    PROFILE: "/admin/profile",
    BUSINESS: "/admin/business",
    NEW_OWNER: "/admin/new-owner",
    MANAGE_BUSINESS: "/admin/manage-business",
    SUBSCRIPTION_PLAN: "/admin/subscription-plan",
    BUSINESS_USER: "/admin/business-users",
    BUSINESS_OWNER: "/admin/business-owner",
    MY_BUSINESS: "/admin/my-business",
    SUBSCRIPTION: "/admin/subscription",
    MY_SUBSCRIPTION: "/admin/my-subscription",
    EXCHANGE_RATE: "/admin/exchange-rate",
    PAYMENT: "/admin/payment",
    USERS_BUSINESS: "/admin/users",
    SUB_DOMAIN: "/admin/sub-domain",
    CUSTOMER_USER: "/admin/customer-user",
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
        title: "Users",
        href: ROUTES.DASHBOARD.USERS,
      },
      {
        title: "Subscriptions",
        href: ROUTES.DASHBOARD.SUBSCRIPTION,
      },
    ],
  },
  {
    title: "Customer User",
    section: "Customer Users",
    icon: Users,
    subroutes: [
      {
        title: "customers",
        href: ROUTES.DASHBOARD.CUSTOMER_USER,
      },
    ],
  },
  {
    title: "Business User",
    section: "Business User",
    icon: Users,
    subroutes: [
      {
        title: "New Owners",
        href: ROUTES.DASHBOARD.NEW_OWNER,
      },
      {
        title: "Owners",
        href: ROUTES.DASHBOARD.BUSINESS_OWNER,
      },
      {
        title: "Users",
        href: ROUTES.DASHBOARD.BUSINESS_USER,
      },
      {
        title: "Subdomain",
        href: ROUTES.DASHBOARD.SUB_DOMAIN,
      },
      {
        title: "Business",
        href: ROUTES.DASHBOARD.MANAGE_BUSINESS,
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
