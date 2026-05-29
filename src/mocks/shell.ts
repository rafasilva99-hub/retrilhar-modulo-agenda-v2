import {
  AnalyticsUpIcon,
  Calendar03Icon,
  Home01Icon,
  Money01Icon,
  PackageIcon,
  Settings01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";

export type AppPage = "intro" | "contexto" | "agenda" | "agendaDia" | "atualizacoes";

export interface ShellNavItem {
  title: string;
  page?: AppPage;
  icon: IconSvgElement;
  enabled?: boolean;
  badge?: number;
  items?: ShellNavItem[];
}

export interface ShellProfile {
  name: string;
  email: string;
  role: string;
  superAdmin?: boolean;
  image?: string;
}

export interface ShellOrganization {
  id: string;
  name: string;
  code: string;
  img?: string;
}

export const shellProfile: ShellProfile = {
  name: "Elias Santos",
  email: "gestor@eliasturismo.com",
  role: "Gestor",
  superAdmin: false,
};

export const shellOrganization: ShellOrganization = {
  id: "org-elias",
  name: "EliasTurismo",
  code: "eliasturismo",
};

export const shellNavItems: ShellNavItem[] = [
  { title: "Início", page: "contexto", icon: Home01Icon },
  { title: "Agenda", page: "agenda", icon: Calendar03Icon, badge: 4 },
  { title: "Vendas", icon: Money01Icon, enabled: false },
  { title: "Clientes", icon: UserGroupIcon, enabled: false },
  { title: "Produtos", icon: PackageIcon, enabled: false },
  { title: "Relatórios", icon: AnalyticsUpIcon, enabled: false },
  { title: "Configurações", icon: Settings01Icon, enabled: false },
];
