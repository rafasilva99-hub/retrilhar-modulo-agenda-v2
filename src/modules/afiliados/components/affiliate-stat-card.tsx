import { CardStats, type CardStatsProps } from "@/components/custom/cards/stats";
import { cn } from "@/lib/utils";

type AffiliateStatCardProps = CardStatsProps & {
  readonly detail?: string;
};

function AffiliateStatCard({ detail, subtitle, className, ...props }: AffiliateStatCardProps) {
  return <CardStats {...props} subtitle={detail ?? subtitle} className={cn("h-full", className)} />;
}

const AffiliateKpiCard = AffiliateStatCard;

export { AffiliateKpiCard, AffiliateStatCard };
export type { AffiliateStatCardProps };
