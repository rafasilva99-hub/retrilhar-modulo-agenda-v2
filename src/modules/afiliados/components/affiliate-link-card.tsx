import { Link04Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

import {
  DataList,
  DataListItem,
  DataListLabel,
  DataListValue,
} from "@/components/custom/data-list";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { CopyButton } from "./copy-button";
import { SectionHeading } from "./section-heading";

type AffiliateLink = {
  readonly id?: string;
  readonly label: string;
  readonly value: string;
  readonly description?: string;
};

type AffiliateLinkRowProps = AffiliateLink & {
  readonly icon?: IconSvgElement;
  readonly className?: string;
  readonly onCopied?: () => void;
};

function AffiliateLinkRow({
  label,
  value,
  description,
  icon = Link04Icon,
  className,
  onCopied,
}: AffiliateLinkRowProps) {
  return (
    <div
      className={cn(
        "border-border flex min-w-0 items-center gap-3 border-t py-3 first:border-t-0",
        className
      )}
    >
      <HugeiconsIcon
        icon={icon}
        size={16}
        className="text-muted-foreground shrink-0"
        aria-hidden="true"
      />
      <DataList orientation="vertical" size="sm" className="min-w-0 flex-1 gap-1">
        <DataListItem className="min-w-0 gap-1">
          <DataListLabel className="text-xs">{label}</DataListLabel>
          <DataListValue className="min-w-0 truncate text-sm">
            <code className="block truncate font-mono text-xs">{value}</code>
            {description ? (
              <span className="text-muted-foreground mt-1 block truncate text-xs">
                {description}
              </span>
            ) : null}
          </DataListValue>
        </DataListItem>
      </DataList>
      <CopyButton
        value={value}
        copyLabel="Copiar"
        copiedLabel="Copiado"
        onCopied={onCopied}
        size="sm"
      />
    </div>
  );
}

type AffiliateLinkCardProps = {
  readonly title: string;
  readonly description?: string;
  readonly links: readonly AffiliateLink[];
  readonly className?: string;
  readonly onCopied?: (link: AffiliateLink) => void;
};

function AffiliateLinkCard({
  title,
  description,
  links,
  className,
  onCopied,
}: AffiliateLinkCardProps) {
  return (
    <Card className={cn("rounded-2xl shadow-none", className)}>
      <CardContent className="p-5">
        <SectionHeading icon={Link04Icon} title={title} description={description} />
        <div className="mt-3">
          {links.map((link) => (
            <AffiliateLinkRow
              key={link.id ?? link.value}
              {...link}
              onCopied={() => onCopied?.(link)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export { AffiliateLinkCard, AffiliateLinkRow };
export type { AffiliateLink, AffiliateLinkCardProps, AffiliateLinkRowProps };
