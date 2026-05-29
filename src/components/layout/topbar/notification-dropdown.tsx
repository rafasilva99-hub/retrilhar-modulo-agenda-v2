import { Notification01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import type { NotificationItem } from "../types";

const notifications: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Atividade sem equipe",
    description: "Voo Livre Pedra Bonita ainda precisa de guia responsável.",
    timestamp: "Há 8 min",
    unread: true,
  },
  {
    id: "notif-2",
    title: "Pagamento confirmado",
    description: "Reserva #1048 foi confirmada com sucesso.",
    timestamp: "Há 32 min",
    unread: true,
  },
  {
    id: "notif-3",
    title: "Check-in realizado",
    description: "3 participantes concluíram check-in.",
    timestamp: "Ontem",
    unread: false,
  },
];

export function NotificationDropdown() {
  const unreadCount = notifications.filter((notification) => notification.unread).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          aria-label="Notificações"
          className="border-sidebar-border bg-background hover:bg-muted relative flex size-14 shrink-0 items-center justify-center rounded-2xl p-2.5 shadow-sm"
        >
          {unreadCount > 0 && (
            <span className="border-background bg-destructive absolute top-[0.6em] right-[0.6em] size-[0.6em] rounded-full border-[1.5px]" />
          )}
          <HugeiconsIcon icon={Notification01Icon} className="text-muted-foreground" size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="border-sidebar-border ring-sidebar-border w-[22em] overflow-hidden rounded-2xl p-0 shadow-md"
      >
        <div className="flex items-center justify-between px-[1em] py-[0.875em]">
          <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
            Notificações
          </p>
          {unreadCount > 0 && (
            <span className="bg-primary/10 text-primary rounded-full px-[0.625em] py-[0.25em] text-[10px] font-medium">
              {unreadCount} não lidas
            </span>
          )}
        </div>
        <div className="relative">
          <div className="max-h-[20em] overflow-y-auto px-[0.375em] pb-[0.375em]">
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="flex cursor-pointer items-start gap-3 rounded-xl px-3 py-3"
              >
                <div
                  className={cn(
                    "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl",
                    notification.unread
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <HugeiconsIcon icon={Notification01Icon} size={15} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-foreground truncate text-sm">{notification.title}</p>
                    {notification.unread && (
                      <span className="bg-primary size-1.5 shrink-0 rounded-full" />
                    )}
                  </div>
                  <p className="text-muted-foreground mt-0.5 line-clamp-2 text-xs">
                    {notification.description}
                  </p>
                  <p className="text-muted-foreground mt-1 text-[10px]">{notification.timestamp}</p>
                </div>
              </DropdownMenuItem>
            ))}
          </div>
          <div className="from-background pointer-events-none absolute right-0 bottom-0 left-0 h-8 bg-gradient-to-t to-transparent" />
        </div>
        <DropdownMenuSeparator className="bg-sidebar-border my-0" />
        <div className="bg-muted/30 rounded-b-2xl px-[1em] py-[0.5em]">
          <p className="text-muted-foreground text-center text-[10px]">Marcar todas como lidas</p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
