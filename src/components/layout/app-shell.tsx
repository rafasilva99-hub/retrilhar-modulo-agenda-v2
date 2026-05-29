import type { ReactNode } from "react";

import { AppLayout } from "./app-layout";
import type { AppPage, AppProfile, MenuItem, Organization } from "./types";

interface AppShellProps {
  children: ReactNode;
  activePage: AppPage;
  navItems: MenuItem[];
  organization: Organization;
  profile: AppProfile;
  onNavigate: (page: AppPage) => void;
}

export function AppShell(props: AppShellProps) {
  return <AppLayout {...props} />;
}
