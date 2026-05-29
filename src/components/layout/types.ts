export type {
  AppPage,
  ShellProfile as AppProfile,
  ShellNavItem as MenuItem,
  ShellOrganization as Organization,
} from "@/mocks/shell";

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  unread?: boolean;
}
