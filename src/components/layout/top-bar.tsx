import { cn } from "@/lib/utils";

import { GlobalSearch } from "./topbar/global-search";
import { NotificationDropdown } from "./topbar/notification-dropdown";
import { TopBarOrganization } from "./topbar/topbar-organization";
import { TopBarProfile } from "./topbar/topbar-profile";
import type { AppPage, AppProfile, Organization } from "./types";

interface TopBarProps {
  collapsed: boolean;
  organization: Organization;
  profile: AppProfile;
  scrolled: boolean;
  onNavigate: (page: AppPage) => void;
}

export function TopBar({ collapsed, organization, profile, scrolled, onNavigate }: TopBarProps) {
  const shellOffset = collapsed ? "112px" : "248px";

  return (
    <header
      className={cn(
        "fixed top-0 right-0 left-0 z-30 border-b transition-[background-color,border-color,padding-left] duration-200",
        scrolled
          ? "border-[#e5e7eb] bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.04)] dark:bg-background"
          : "border-transparent bg-transparent"
      )}
      style={{ paddingLeft: shellOffset }}
    >
      <div className="@container/topbar hidden items-center gap-[0.75em] py-[1.5em] pr-[1.5em] pl-[0.75em] md:flex">
        <GlobalSearch onNavigate={onNavigate} />
        <div className="ml-auto flex shrink-0 items-center gap-[0.75em]">
          <TopBarOrganization organization={organization} onNavigate={onNavigate} />
          <NotificationDropdown />
          <TopBarProfile profile={profile} />
        </div>
      </div>

      <div className="flex items-center gap-[0.75em] px-[1em] py-[0.75em] md:hidden">
        <TopBarOrganization organization={organization} mobile onNavigate={onNavigate} />
        <NotificationDropdown />
        <TopBarProfile profile={profile} />
      </div>
    </header>
  );
}
