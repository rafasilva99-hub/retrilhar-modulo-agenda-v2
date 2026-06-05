import type { IconSvgElement } from "@hugeicons/react";

export type AppPage =
  | "intro"
  | "contexto"
  | "agenda"
  | "agendaDia"
  | "atualizacoes"
  | "novaAtividade";

export interface ShellNavItem {
  title: string;
  page?: AppPage;
  icon: IconSvgElement;
  enabled?: boolean;
  badge?: number;
  items?: ShellNavItem[];
}

export type MenuItem = ShellNavItem;

export interface ShellProfile {
  name: string;
  email: string;
  role: string;
  superAdmin?: boolean;
  image?: string;
}

export type AppProfile = ShellProfile;

export interface ShellOrganization {
  id: string;
  name: string;
  code: string;
  img?: string;
}

export type Organization = ShellOrganization;

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  unread?: boolean;
}
