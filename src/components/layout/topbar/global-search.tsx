import { useRef, useState } from "react";
import { ArrowUpRight01Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import type { AppPage } from "../types";

import { recentPages, type SearchPage, type SystemPage, systemPages } from "./search-pages";

interface GlobalSearchProps {
  placeholder?: string;
  onNavigate: (page: AppPage) => void;
}

export function GlobalSearch({ placeholder = "Buscar...", onNavigate }: GlobalSearchProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const commandRef = useRef<HTMLDivElement>(null);

  const allItems: SearchPage[] = systemPages.flatMap((page) => {
    const items: SearchPage[] = [{ ...page, isSubPage: false }];
    if (page.subPages) {
      items.push(
        ...page.subPages.map((sub) => ({
          ...sub,
          breadcrumb: page.name,
          isSubPage: true,
        }))
      );
    }
    return items;
  });

  const filteredItems = searchQuery
    ? allItems.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.breadcrumb?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];
  const showList: SearchPage[] = !searchQuery ? recentPages : filteredItems;

  const close = () => {
    setOpen(false);
    setSearchQuery("");
  };

  const navigateToPage = (item: SystemPage) => {
    if (item.page) onNavigate(item.page);
    close();
  };

  return (
    <div className="relative min-w-0 @[600px]/topbar:flex-1">
      <Popover open={open}>
        <PopoverAnchor asChild>
          <div
            ref={anchorRef}
            className={cn(
              "bg-background hidden h-14 w-full cursor-text items-center gap-2 rounded-2xl border px-[1.125em] shadow-sm transition-all @[600px]/topbar:flex",
              open
                ? "border-primary shadow-md"
                : "border-sidebar-border hover:border-sidebar-border/80"
            )}
            onClick={() => {
              setOpen(true);
              setTimeout(() => inputRef.current?.focus(), 0);
            }}
          >
            <HugeiconsIcon
              icon={Search01Icon}
              size={16}
              className="text-muted-foreground shrink-0"
            />
            {open ? (
              <Input
                ref={inputRef}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={placeholder}
                className="placeholder:text-muted-foreground h-auto flex-1 border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
                onClick={(event) => event.stopPropagation()}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    close();
                    return;
                  }
                  if (event.key === "Enter" && showList.length > 0) {
                    navigateToPage(showList[0]!);
                    return;
                  }
                  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                    event.preventDefault();
                    commandRef.current?.dispatchEvent(
                      new KeyboardEvent("keydown", { key: event.key, bubbles: true })
                    );
                  }
                }}
              />
            ) : (
              <span className="text-muted-foreground hidden min-w-0 flex-1 truncate text-sm @[400px]/topbar:block">
                {placeholder}
              </span>
            )}
          </div>
        </PopoverAnchor>
        <PopoverContent
          className="border-sidebar-border ring-sidebar-border overflow-hidden rounded-2xl p-0 shadow-md"
          align="start"
          sideOffset={8}
          style={{ width: "var(--radix-popover-trigger-width)" }}
          onOpenAutoFocus={(event) => event.preventDefault()}
          onInteractOutside={(event) => {
            if (anchorRef.current?.contains(event.target as Node)) return;
            close();
          }}
        >
          <Command
            ref={commandRef}
            shouldFilter={false}
            onKeyDown={(event) => event.key === "Escape" && close()}
          >
            <CommandList className="max-h-[300px] p-1.5">
              <CommandEmpty>
                <div className="px-4 py-8 text-center">
                  <div className="bg-muted mb-3 inline-flex size-10 items-center justify-center rounded-2xl">
                    <HugeiconsIcon
                      icon={Search01Icon}
                      size={18}
                      className="text-muted-foreground"
                    />
                  </div>
                  <p className="text-foreground mb-1 text-sm">Nenhum resultado encontrado</p>
                  <p className="text-muted-foreground text-xs">Tente buscar com outros termos</p>
                </div>
              </CommandEmpty>
              <CommandGroup>
                <p className="text-muted-foreground px-3 py-1.5 text-[10px] font-medium tracking-widest uppercase">
                  {searchQuery ? "Páginas" : "Visitados Recentemente"}
                </p>
                {showList.map((item) => {
                  const disabled = !item.page;
                  const isSubPage = item.isSubPage === true;
                  return (
                    <CommandItem
                      key={item.id}
                      value={item.id}
                      disabled={disabled}
                      onSelect={() => navigateToPage(item)}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2",
                        isSubPage && "ml-8",
                        disabled && "cursor-default opacity-60"
                      )}
                    >
                      <div
                        className={cn(
                          "bg-muted flex shrink-0 items-center justify-center rounded-md",
                          isSubPage ? "size-6" : "size-8"
                        )}
                      >
                        <HugeiconsIcon
                          icon={item.icon}
                          size={isSubPage ? 14 : 16}
                          className="text-muted-foreground"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-foreground truncate text-sm">{item.name}</p>
                        {item.breadcrumb && (
                          <p className="text-muted-foreground truncate text-xs">
                            {item.breadcrumb}
                          </p>
                        )}
                      </div>
                      {item.timestamp ? (
                        <span className="text-muted-foreground text-xs">{item.timestamp}</span>
                      ) : (
                        item.page && (
                          <HugeiconsIcon
                            icon={ArrowUpRight01Icon}
                            size={14}
                            className="text-muted-foreground"
                          />
                        )
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Button
        variant="outline"
        size="icon"
        className="border-sidebar-border bg-background flex size-14 rounded-2xl shadow-sm @[600px]/topbar:hidden"
        onClick={() => setOpen(true)}
        aria-label="Buscar"
      >
        <HugeiconsIcon icon={Search01Icon} size={18} className="text-muted-foreground" />
      </Button>
    </div>
  );
}
