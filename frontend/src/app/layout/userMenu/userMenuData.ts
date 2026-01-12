// Imports
import type { UserMenuItemProps } from "./UserMenuProps";
import {
  IconUser,
  IconLogout,
  IconChartBar,
  IconSettings,
  IconPhoto,
  IconCalendarEvent,
} from "@tabler/icons-react";

// Menu configuration
export const userMenuItems: UserMenuItemProps[] = [
  {
    key: "profile",
    title: "Profile",
    description: "View and edit your personal profile",
    to: "/auth/profile",
    icon: IconUser,
  },
  {
    key: "statistics",
    title: "Statistics",
    description: "View your activity statistics and performance trends",
    to: "/user/statistics",
    icon: IconChartBar,
  },
  {
    key: "memories",
    title: "Memories",
    description: "Browse your recorded trips, photos, and experiences",
    to: "/user/memories",
    icon: IconPhoto,
  },
  {
    key: "calendar",
    title: "Calendar",
    description: "Manage upcoming plans and past activities",
    to: "/user/calendar",
    icon: IconCalendarEvent,
  },
  {
    key: "settings",
    title: "Settings",
    description: "Adjust preferences, privacy, and account options",
    to: "/user/settings",
    icon: IconSettings,
  },
  {
    key: "logout",
    title: "Log out",
    description: "Sign out and clear your session",
    icon: IconLogout,
    color: "red",
    to: "",
    action: "logout",
  },
];
