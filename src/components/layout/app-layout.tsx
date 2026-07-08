import { type ReactNode, useEffect, useState } from "react";

import { AppSidebar } from "./app-sidebar";
import { TopBar } from "./top-bar";
import type { AppPage, AppProfile, MenuItem, Organization } from "./types";

interface AppLayoutProps {
  activePage: AppPage;
  children: ReactNode;
  navItems: MenuItem[];
  organization: Organization;
  profile: AppProfile;
  onNavigate: (page: AppPage) => void;
}

export function AppLayout({
  activePage,
  children,
  navItems,
  organization,
  profile,
  onNavigate,
}: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const el = document.querySelector(".prototype-shell-surface");
    if (!el) return;
    const handleScroll = () => setScrolled(el.scrollTop > 0);
    el.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  // Content offset includes the TopBar's inner pl-[0.75em] (12px) so content aligns with the search bar
  const contentOffset = collapsed ? "124px" : "260px";

  return (
    <div className="bg-muted/30 text-foreground h-screen overflow-hidden">
      <div
        className="prototype-shell-surface h-full overflow-y-auto overflow-x-hidden"
        style={{ "--shell-offset": contentOffset } as React.CSSProperties}
      >
        {children}
      </div>
      <AppSidebar
        activePage={activePage}
        collapsed={collapsed}
        navItems={navItems}
        onCollapsedChange={setCollapsed}
        onNavigate={onNavigate}
      />
      <TopBar
        collapsed={collapsed}
        organization={organization}
        profile={profile}
        scrolled={scrolled}
        onNavigate={onNavigate}
      />
    </div>
  );
}
