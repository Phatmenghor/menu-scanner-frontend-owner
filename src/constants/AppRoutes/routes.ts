import { List, User2 } from "lucide-react";

export const ROUTES = {
  AUTH: {
    LOGIN: "/login",
  },
  DASHBOARD: {
    INDEX: "/user",
  },
};

export const navItems = [
  {
    title: "Users",
    href: ROUTES.DASHBOARD.INDEX,
    icon: User2,
  },
];
