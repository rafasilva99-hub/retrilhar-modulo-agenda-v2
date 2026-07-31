import { SidebarLeft01Icon, SidebarRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { SidebarNavItem } from "./sidebar/sidebar-nav-item";
import { Logo } from "./logo";
import type { AppPage, MenuItem } from "./types";

interface AppSidebarProps {
  activePage: AppPage;
  collapsed: boolean;
  navItems: MenuItem[];
  onCollapsedChange: (value: boolean | ((value: boolean) => boolean)) => void;
  onNavigate: (page: AppPage) => void;
}

export function AppSidebar({
  activePage,
  collapsed,
  navItems,
  onCollapsedChange,
  onNavigate,
}: AppSidebarProps) {
  return (
    <aside
      className={cn(
        "border-sidebar-border bg-background fixed top-6 left-6 z-40 flex h-[calc(100svh-48px)] flex-col overflow-hidden rounded-2xl border shadow-sm transition-[width] duration-200",
        collapsed ? "w-16" : "w-[200px]"
      )}
    >
      <div className="border-sidebar-border flex h-[73px] items-center justify-center border-b px-4">
        <Logo variant={collapsed ? "icon" : "full"} />
      </div>

      <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-2 py-4">
        {navItems.map((item) => (
          <SidebarNavItem
            key={item.title}
            item={item}
            active={
              item.page === activePage ||
              (activePage === "agendaDia" && item.page === "agenda") ||
              // Estado ativo-pai: destaca o item quando uma página filha
              // (do submenu ou do mesmo prefixo de rota) está ativa.
              Boolean(item.items?.some((filho) => filho.page === activePage)) ||
              Boolean(item.page && activePage !== item.page && activePage.startsWith(item.page))
            }
            activePage={activePage}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      <div className="border-sidebar-border border-t p-3">
        <Button
          type="button"
          variant="ghost"
          className={cn(
            "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-primary h-10 w-full justify-start rounded-[14px] px-3",
            collapsed && "justify-center px-0"
          )}
          title={collapsed ? "Expandir menu" : "Encolher menu"}
          onClick={() => onCollapsedChange((value) => !value)}
        >
          {collapsed ? (
            <HugeiconsIcon icon={SidebarRight01Icon} size={20} />
          ) : (
            <HugeiconsIcon icon={SidebarLeft01Icon} size={20} />
          )}
          {!collapsed && <span className="text-sm font-normal">Encolher menu</span>}
        </Button>
      </div>
    </aside>
  );
}
