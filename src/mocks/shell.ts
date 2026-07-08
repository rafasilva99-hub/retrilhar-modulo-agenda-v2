import {
  AnalyticsUpIcon,
  Calendar03Icon,
  HelpSquareIcon,
  Home01Icon,
  Link04Icon,
  Money01Icon,
  PackageIcon,
  Settings01Icon,
  UserGroupIcon,
  UserStar01Icon,
} from "@hugeicons/core-free-icons";

import type { ShellNavItem, ShellOrganization, ShellProfile } from "@/components/layout/types";

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

export const affiliateProfile: ShellProfile = {
  name: "Katiely Pinheiro",
  email: "katiely@retrilhar.com.br",
  role: "Afiliado",
  superAdmin: false,
};

export const affiliateOrganization: ShellOrganization = {
  id: "org-afiliado-temp",
  name: "Painel de Afiliado",
  code: "painel-afiliado",
};

export const shellNavItems: ShellNavItem[] = [
  { title: "Início", page: "contexto", icon: Home01Icon },
  { title: "Agenda", page: "agenda", icon: Calendar03Icon, badge: 4 },
  { title: "Vendas", icon: Money01Icon, enabled: false },
  { title: "Clientes", icon: UserGroupIcon, enabled: false },
  { title: "Produtos", page: "produtos", icon: PackageIcon },
  { title: "Afiliados", icon: UserStar01Icon, enabled: false },
  { title: "Relatórios", icon: AnalyticsUpIcon, enabled: false },
  { title: "Configurações", icon: Settings01Icon, enabled: false },
];

export const affiliateNavItems: ShellNavItem[] = [
  { title: "Início", page: "afiliados", icon: Home01Icon },
  { title: "Indicações", icon: UserGroupIcon, enabled: false },
  { title: "Ganhos", icon: Money01Icon, enabled: false },
  { title: "Produtos e Links", icon: Link04Icon, enabled: false },
  { title: "Dúvidas", icon: HelpSquareIcon, enabled: false },
  { title: "Configurações", icon: Settings01Icon, enabled: false, separatorBefore: true },
];
