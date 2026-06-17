import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ReactNode } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";

interface BreadcrumbEntry {
  title: string;
  onClick?: () => void;
}

interface AppPageProps {
  children: ReactNode;
  title?: string;
  description?: string;
  actions?: ReactNode;
  breadcrumb?: BreadcrumbEntry[];
  onBack?: () => void;
}

function BreadcrumbItems({ items, hasTitle }: { items: BreadcrumbEntry[]; hasTitle: boolean }) {
  return (
    <>
      {items.map((item, index) => {
        const showSeparator = index < items.length - 1 || hasTitle;
        return (
          <BreadcrumbItem key={`${item.title}-${index}`}>
            {item.onClick ? (
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={item.onClick}
              >
                {item.title}
              </button>
            ) : (
              <BreadcrumbPage>{item.title}</BreadcrumbPage>
            )}
            {showSeparator && <BreadcrumbSeparator />}
          </BreadcrumbItem>
        );
      })}
    </>
  );
}

export function AppPage({
  children,
  title,
  description,
  actions,
  breadcrumb,
  onBack,
}: AppPageProps) {
  return (
    <div
      className="animate-in fade-in flex min-h-screen flex-col gap-6 pt-[112px] pr-6 pb-6 duration-500"
      style={{ paddingLeft: "var(--shell-offset, 248px)" }}
    >
      {(title || actions || breadcrumb || onBack) && (
        <div className="flex flex-col gap-[0.75em]">
          {onBack && (
            <Button variant="outline" size="sm" className="w-fit" onClick={onBack}>
              <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
              Voltar
            </Button>
          )}

          {breadcrumb && breadcrumb.length > 0 && (
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItems items={breadcrumb} hasTitle={!!title} />
                {title && (
                  <BreadcrumbItem>
                    <BreadcrumbPage>{title}</BreadcrumbPage>
                  </BreadcrumbItem>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          )}

          {(title || actions) && (
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-[0.15em]">
                {title && (
                  <h1 className="text-foreground text-xl font-normal tracking-tight">{title}</h1>
                )}
                {description && <p className="text-muted-foreground text-sm">{description}</p>}
              </div>
              {actions && <div className="flex shrink-0 items-center gap-3">{actions}</div>}
            </div>
          )}
        </div>
      )}
      <main className="w-full flex-1">{children}</main>
    </div>
  );
}
