import { HugeiconsIcon } from "@hugeicons/react";

import { cn } from "@/lib/utils";

import type { AppPage, MenuItem } from "../types";

interface SidebarNavItemProps {
  item: MenuItem;
  active: boolean;
  collapsed: boolean;
  onNavigate: (page: AppPage) => void;
}

export function SidebarNavItem({ item, active, collapsed, onNavigate }: SidebarNavItemProps) {
  const enabled = item.enabled !== false && item.page;

  const handleClick = () => {
    if (enabled && item.page) onNavigate(item.page);
  };

  return (
    <>
      <button
        type="button"
        className={cn(
          "group relative flex h-12 w-full items-center gap-3 rounded-[14px] px-4 text-left text-sm transition-colors",
          collapsed && "justify-center px-0",
          active
            ? "bg-sidebar-accent text-sidebar-primary"
            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-primary",
          !enabled && "hover:text-sidebar-foreground cursor-default opacity-55 hover:bg-transparent"
        )}
        onClick={handleClick}
        title={item.title}
        aria-current={active ? "page" : undefined}
      >
        {active && !collapsed && (
          <span className="bg-ring absolute top-3 left-0 h-6 w-1 rounded-r-full" />
        )}
        {item.customIconPaths ? (
          <svg className="shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none">
            {item.customIconPaths.map((path) => (
              <path
                key={path}
                d={path}
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
            ))}
          </svg>
        ) : (
          <HugeiconsIcon icon={item.icon} size={20} className="shrink-0" />
        )}
        {!collapsed && <span className="min-w-0 flex-1 truncate">{item.title}</span>}
        {!collapsed && item.badge ? (
          <span className="bg-primary text-primary-foreground grid min-w-5 place-items-center rounded-full px-1.5 text-xs">
            {item.badge}
          </span>
        ) : null}
      </button>
    </>
  );
}
