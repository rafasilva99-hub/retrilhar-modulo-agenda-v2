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
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-muted/30 text-foreground min-h-screen">
      <div className="prototype-shell-surface h-screen min-h-screen overflow-hidden">
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
