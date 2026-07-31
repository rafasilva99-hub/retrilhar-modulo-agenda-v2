import { useEffect, useState } from "react";
import { ArrowDown01Icon, ArrowUp01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { cn } from "@/lib/utils";

import type { AppPage, MenuItem } from "../types";

interface SidebarNavItemProps {
  item: MenuItem;
  active: boolean;
  activePage: AppPage;
  collapsed: boolean;
  onNavigate: (page: AppPage) => void;
}

export function SidebarNavItem({
  item,
  active,
  activePage,
  collapsed,
  onNavigate,
}: SidebarNavItemProps) {
  const enabled = item.enabled !== false && item.page;
  const temSubmenu = Boolean(item.items?.length);
  const filhoAtivo = item.items?.some((filho) => filho.page === activePage) ?? false;
  const [submenuAberto, setSubmenuAberto] = useState(active || filhoAtivo);

  // Navegar para um filho por links fora da sidebar mantém o submenu aberto.
  useEffect(() => {
    if (filhoAtivo || active) setSubmenuAberto(true);
  }, [filhoAtivo, active]);

  const handleClick = () => {
    if (temSubmenu) setSubmenuAberto((valor) => (active ? !valor : true));
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
        aria-expanded={temSubmenu && !collapsed ? submenuAberto : undefined}
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
        {!collapsed && temSubmenu ? (
          <HugeiconsIcon
            icon={submenuAberto ? ArrowUp01Icon : ArrowDown01Icon}
            size={16}
            className="shrink-0 opacity-70"
            aria-hidden="true"
          />
        ) : null}
      </button>
      {!collapsed && temSubmenu && submenuAberto ? (
        <div className="border-sidebar-border mb-1 ml-[26px] flex flex-col gap-0.5 border-l pl-2">
          {item.items?.map((filho) => {
            const filhoEstaAtivo = filho.page === activePage;
            return (
              <button
                key={filho.title}
                type="button"
                className={cn(
                  "h-9 truncate rounded-lg px-3 text-left text-sm transition-colors",
                  filhoEstaAtivo
                    ? "bg-sidebar-accent text-sidebar-primary font-medium"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-primary"
                )}
                aria-current={filhoEstaAtivo ? "page" : undefined}
                onClick={() => {
                  if (filho.page) onNavigate(filho.page);
                }}
              >
                {filho.title}
              </button>
            );
          })}
        </div>
      ) : null}
    </>
  );
}
