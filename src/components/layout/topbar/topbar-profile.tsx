import { useState } from "react";
import {
  AccountSetting01Icon,
  CommandIcon,
  Logout01Icon,
  Moon01Icon,
  Sun01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";

import type { AppProfile } from "../types";
import { getInitials } from "../utils";

interface TopBarProfileProps {
  profile: AppProfile;
}

export function TopBarProfile({ profile }: TopBarProfileProps) {
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains("dark"));

  const toggleTheme = () => {
    setIsDark((value) => {
      const next = !value;
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          aria-label="Perfil"
          className="border-sidebar-border bg-background hover:bg-muted relative flex size-14 shrink-0 items-center justify-center rounded-2xl p-0 shadow-sm"
        >
          <Avatar className="size-9">
            <AvatarImage src={profile.image || ""} alt={profile.name || ""} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold uppercase">
              {getInitials(profile.name || "")}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="border-sidebar-border ring-sidebar-border w-[16em] overflow-hidden rounded-2xl p-0 shadow-md"
      >
        <div className="px-[0.875em] pt-[0.875em] pb-[0.625em]">
          <p className="text-foreground truncate text-sm font-medium">{profile.name}</p>
          <p className="text-muted-foreground truncate text-xs">{profile.email}</p>
        </div>

        <DropdownMenuSeparator className="bg-sidebar-border my-0" />

        <div className="p-[0.25em]">
          <p className="text-muted-foreground px-[0.75em] pt-[0.5em] pb-[0.25em] text-[10px] font-normal tracking-widest uppercase">
            Preferências
          </p>
          <DropdownMenuItem
            onClick={() => { window.location.hash = "#configuracoes"; }}
            className="gap-[0.625em] rounded-lg px-[0.75em] py-[0.5em] text-sm font-normal"
          >
            <HugeiconsIcon
              icon={AccountSetting01Icon}
              size={15}
              className="text-muted-foreground"
            />
            Configurações
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={toggleTheme}
            className="gap-[0.625em] rounded-lg px-[0.75em] py-[0.5em] text-sm font-normal"
          >
            <HugeiconsIcon
              icon={isDark ? Sun01Icon : Moon01Icon}
              size={15}
              className="text-muted-foreground"
            />
            <span className="flex-1">Modo Escuro</span>
            <Switch checked={isDark} className="pointer-events-none shrink-0" />
          </DropdownMenuItem>
        </div>

        {profile.superAdmin && (
          <>
            <DropdownMenuSeparator className="bg-sidebar-border my-0" />
            <div className="p-[0.25em]">
              <DropdownMenuItem className="gap-[0.625em] rounded-lg px-[0.75em] py-[0.5em] text-sm font-normal">
                <HugeiconsIcon icon={CommandIcon} size={15} className="text-muted-foreground" />
                <span className="flex-1">Painel administrativo</span>
                <Badge
                  variant="outline"
                  className="text-muted-foreground h-auto px-[0.375em] py-0 text-[9px] font-normal"
                >
                  Admin
                </Badge>
              </DropdownMenuItem>
            </div>
          </>
        )}

        <DropdownMenuSeparator className="bg-sidebar-border my-0" />

        <div className="p-[0.25em]">
          <DropdownMenuItem className="text-destructive focus:text-destructive gap-[0.625em] rounded-lg px-[0.75em] py-[0.5em] text-sm font-normal">
            <HugeiconsIcon icon={Logout01Icon} size={15} />
            Sair
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
