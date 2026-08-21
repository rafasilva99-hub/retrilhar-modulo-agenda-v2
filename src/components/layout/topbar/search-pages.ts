import {
  Calendar04Icon,
  Cancel01Icon,
  Chart02Icon,
  File02Icon,
  Home01Icon,
  Package01Icon,
  ShoppingBag01Icon,
  Ticket01Icon,
  UserGroupIcon,
  UserIdVerificationIcon,
  UserStar01Icon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";

import type { AppPage } from "../types";

export interface SystemPage {
  id: string;
  name: string;
  icon: IconSvgElement;
  page?: AppPage;
  breadcrumb?: string;
  subPages?: SystemPage[];
  timestamp?: string;
}

export type SearchPage = SystemPage & { isSubPage?: boolean };

export const systemPages: SystemPage[] = [
  {
    id: "inicio",
    name: "Início",
    icon: Home01Icon,
    page: "home",
    breadcrumb: "Dashboard principal",
  },
  {
    id: "vendas",
    name: "Vendas",
    icon: ShoppingBag01Icon,
    page: "vendasPedidos",
    breadcrumb: "Pedidos e cupons",
    subPages: [
      {
        id: "vendas-pedidos",
        name: "Pedidos",
        icon: File02Icon,
        page: "vendasPedidos",
        breadcrumb: "Vendas",
      },
      {
        id: "vendas-desistencias",
        name: "Desistências",
        icon: Cancel01Icon,
        page: "vendasDesistencias",
        breadcrumb: "Vendas",
      },
      {
        id: "vendas-cupons",
        name: "Cupons",
        icon: Ticket01Icon,
        page: "vendasCupons",
        breadcrumb: "Vendas",
      },
    ],
  },
  { id: "clientes", name: "Clientes", icon: UserGroupIcon, breadcrumb: "Gerenciar clientes" },
  {
    id: "agenda",
    name: "Agenda",
    icon: Calendar04Icon,
    page: "agenda",
    breadcrumb: "Reservas e horários",
  },
  {
    id: "produtos",
    name: "Catálogo de produtos",
    icon: Package01Icon,
    page: "produtos",
    breadcrumb: "Catálogo de produtos",
  },
  {
    id: "produtos-recursos",
    name: "Recursos",
    icon: Package01Icon,
    page: "produtosRecursos",
    breadcrumb: "Insumos da organização",
  },
  {
    id: "vendedores",
    name: "Vendedores",
    icon: UserIdVerificationIcon,
    breadcrumb: "Gerenciar vendedores",
  },
  {
    id: "afiliados",
    name: "Afiliados",
    icon: UserStar01Icon,
    page: "gestorAfiliados",
    breadcrumb: "Gestão de afiliados",
  },
  {
    id: "central-filiacao",
    name: "Central de filiação",
    icon: UserStar01Icon,
    page: "gestorAfiliadosCentral",
    breadcrumb: "Candidaturas e propostas de afiliados",
  },
  {
    id: "lista-afiliados",
    name: "Lista de afiliados",
    icon: UserStar01Icon,
    page: "gestorAfiliadosLista",
    breadcrumb: "Afiliados da organização",
  },
  {
    id: "indicadores",
    name: "Indicadores",
    icon: Chart02Icon,
    breadcrumb: "Relatórios e métricas",
  },
];

export const recentPages: SystemPage[] = [
  { ...systemPages[3]!, timestamp: "Agora" },
  { ...systemPages[1]!, timestamp: "Há 5 min" },
  { ...systemPages[2]!, timestamp: "Há 1 hora" },
  { ...systemPages[4]!, timestamp: "Ontem" },
];
