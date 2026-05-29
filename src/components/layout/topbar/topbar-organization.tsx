import { ArrowDown01Icon, Settings01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import type { Organization } from "../types";
import { getInitials } from "../utils";

interface TopBarOrganizationProps {
  organization: Organization;
  mobile?: boolean;
}

const otherOrganizations: Organization[] = [
  { id: "org-serra", name: "Serra Viva Experiências", code: "serra-viva" },
  { id: "org-rio", name: "Rio Trilhas", code: "rio-trilhas" },
];

export function TopBarOrganization({ organization, mobile }: TopBarOrganizationProps) {
  const trigger = (
    <Button
      variant="ghost"
      className={cn(
        "border-sidebar-border bg-background hover:bg-muted relative flex h-14 items-center gap-3 rounded-2xl border px-4 shadow-sm transition-all",
        mobile ? "flex-1" : "max-w-[20em] shrink-0"
      )}
    >
      <Avatar className="size-8 shrink-0">
        <AvatarImage src={organization.img || undefined} />
        <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
          {getInitials(organization.name)}
        </AvatarFallback>
      </Avatar>
      <div className="hidden min-w-0 flex-1 flex-col items-start text-left @[600px]/topbar:flex">
        <p className="text-foreground w-full truncate text-sm font-normal">{organization.name}</p>
        <p className="text-muted-foreground text-xs font-normal">Trocar empresa</p>
      </div>
      <HugeiconsIcon
        icon={ArrowDown01Icon}
        size={16}
        className="text-muted-foreground ml-auto shrink-0"
      />
    </Button>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="border-sidebar-border ring-sidebar-border w-[17.5em] overflow-hidden rounded-2xl p-0 shadow-lg"
        sideOffset={8}
      >
        <div className="p-[0.375em]">
          <div className="bg-primary/10 dark:bg-primary/20 flex items-center gap-[0.625em] rounded-xl px-[0.625em] py-[0.5em]">
            <Avatar className="size-8 shrink-0">
              <AvatarImage src={organization.img || undefined} />
              <AvatarFallback className="bg-primary/15 text-primary text-xs font-semibold">
                {getInitials(organization.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-primary truncate text-sm font-medium">{organization.name}</p>
              <p className="text-primary/60 truncate text-xs">{organization.code}</p>
            </div>
            <Button variant="outline" size="icon" className="size-8 shrink-0 rounded-lg">
              <HugeiconsIcon icon={Settings01Icon} size={14} />
            </Button>
          </div>
        </div>

        <DropdownMenuSeparator className="bg-sidebar-border my-0" />

        <div className="p-[0.375em]">
          <p className="text-muted-foreground px-[0.75em] pt-[0.375em] pb-[0.25em] text-[10px] font-normal tracking-widest uppercase">
            Espaços de trabalho
          </p>
          <div className="relative">
            <div className="max-h-[17.5em] overflow-y-auto">
              {otherOrganizations.map((item) => (
                <DropdownMenuItem
                  key={item.id}
                  className="flex h-12 cursor-pointer items-center gap-3 rounded-xl px-3"
                >
                  <Avatar className="size-8 shrink-0">
                    <AvatarFallback className="bg-muted text-muted-foreground text-xs font-semibold">
                      {getInitials(item.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="min-w-0 flex-1 truncate text-sm">{item.name}</span>
                </DropdownMenuItem>
              ))}
            </div>
            <div className="from-background pointer-events-none absolute right-0 bottom-0 left-0 h-8 rounded-b-xl bg-gradient-to-t to-transparent" />
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
