import { AppPage } from "@/components/layout/app-page";

import { OpportunityChart, PaymentDonut, ReceivablesChart } from "./home-charts";
import {
  DashboardCard,
  HomeHero,
  KpiCard,
  ListFooter,
  PeriodPill,
  RecentSaleRow,
  SectionHeader,
  SegmentedControl,
  TopProductRow,
} from "./home-components";
import { homeHeaderIcons, homeKpis, recentSales, topProducts } from "./home-data";

interface HomePageProps {
  readonly onNovaReserva?: () => void;
}

export function HomePage({ onNovaReserva }: HomePageProps) {
  return (
    <AppPage>
      <div className="mx-auto flex w-full max-w-[1168px] flex-col gap-6">
        <HomeHero onNovaReserva={onNovaReserva} />

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {homeKpis.map((item) => (
            <KpiCard key={item.title} item={item} />
          ))}
        </section>

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(320px,439px)_minmax(0,1fr)]">
          <DashboardCard>
            <SectionHeader
              icon={homeHeaderIcons.wallet}
              title="Vendas por Pagamento"
              description="Distribuição por método"
              accessory={<PeriodPill label="Este mês" />}
            />
            <SegmentedControl />
            <PaymentDonut />
          </DashboardCard>

          <DashboardCard>
            <SectionHeader
              icon={homeHeaderIcons.invoice}
              title="Previsão de Recebíveis"
              description="Distribuição por método"
              accessory={<PeriodPill label="Últimos 6 meses" />}
            />
            <ReceivablesChart />
          </DashboardCard>
        </section>

        <DashboardCard>
          <SectionHeader
            icon={homeHeaderIcons.invoice}
            title="Possibilidade x Vendido"
            description="Comparativo de potencial e vendas"
            accessory={<PeriodPill label="Últimas 4 semanas" />}
          />
          <OpportunityChart />
        </DashboardCard>

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <DashboardCard>
            <SectionHeader
              icon={homeHeaderIcons.shoppingBag}
              title="Vendas Recentes"
              description="Últimas transações"
              accessory={
                <span className="inline-flex h-[23px] items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2 font-['Helvetica_Neue:Regular',sans-serif] text-xs text-emerald-700">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  Ao vivo
                </span>
              }
            />
            <div className="flex flex-col gap-2">
              {recentSales.map((sale) => (
                <RecentSaleRow key={`${sale.customer}-${sale.time}`} sale={sale} />
              ))}
            </div>
            <ListFooter>Ver todas as vendas</ListFooter>
          </DashboardCard>

          <DashboardCard>
            <SectionHeader
              icon={homeHeaderIcons.champion}
              title="Top Produtos"
              description="Mais vendidos este mês"
              accessory={<PeriodPill label="Mês atual" />}
            />
            <div className="flex flex-col gap-4">
              {topProducts.map((product, index) => (
                <TopProductRow key={product.name} product={product} index={index} />
              ))}
            </div>
            <ListFooter>Ver desempenho dos produtos</ListFooter>
          </DashboardCard>
        </section>
      </div>
    </AppPage>
  );
}
