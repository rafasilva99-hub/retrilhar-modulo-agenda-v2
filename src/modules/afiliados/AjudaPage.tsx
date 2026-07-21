import { useState } from "react";
import {
  ArrowLeft01Icon,
  Cancel01Icon,
  Link04Icon,
  MoneyReceiveSquareIcon,
  Search01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { affiliateFaqItems } from "@/mocks/afiliados";

import { AffiliateEmptyState } from "./components";

// ---------------------------------------------------------------------------
// Category card data
// ---------------------------------------------------------------------------

interface CategoryCard {
  icon: IconSvgElement;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
}

const categories: CategoryCard[] = [
  {
    icon: MoneyReceiveSquareIcon,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    title: "Comissões e Pagamentos",
    description: "Prazos, formas de recebimento e splits",
  },
  {
    icon: Link04Icon,
    iconBg: "bg-blue-50",
    iconColor: "text-primary",
    title: "Links e Indicações",
    description: "Como compartilhar e rastrear vendas",
  },
  {
    icon: UserGroupIcon,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    title: "Afiliações",
    description: "Organizações com as quais você tem afiliação",
  },
];

function formatFaqAnswer(answer: string): string {
  return answer
    .replace("se vincular a múltiplas organizações", "manter afiliações com múltiplas organizações")
    .replace("Cada vínculo", "Cada afiliação")
    .replace(
      "seu vínculo com a organização estiver ativo",
      "sua afiliação com a organização estiver ativa"
    )
    .replace("seu vínculo", "sua afiliação")
    .replace("Caso o vínculo seja encerrado", "Caso a afiliação seja encerrada")
    .replace(/vínculos/giu, "afiliações")
    .replace(/vínculo/giu, "afiliação");
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AjudaPage() {
  const [search, setSearch] = useState("");

  const handleClose = () => {
    window.location.hash = "#afiliados";
  };

  const query = search.trim().toLowerCase();

  const filteredFaq = query
    ? affiliateFaqItems.filter(
        (item) =>
          item.question.toLowerCase().includes(query) || item.answer.toLowerCase().includes(query)
      )
    : affiliateFaqItems;

  return (
    <div className="bg-background fixed inset-0 z-50 flex min-h-dvh flex-col">
      {/* ── Header ── */}
      <header className="bg-background shrink-0 border-b">
        <div className="flex h-[3.5em] items-center px-[0.75em]">
          {/* Mobile back button */}
          <div className="md:hidden">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Voltar para Afiliados"
              onClick={handleClose}
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
            </Button>
          </div>

          {/* Desktop: logo + breadcrumb */}
          <div className="hidden items-center gap-[0.75em] md:flex">
            <a
              className="focus-visible:ring-primary inline-flex items-center rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              href="#afiliados"
            >
              <img
                alt="Retrilhar"
                className="h-8 w-auto object-contain transition-all duration-300"
                src="/src/assets/retrilhar-logo.png"
              />
            </a>
            <div className="bg-border h-[1.25em] w-px" />
            <span className="text-muted-foreground text-sm">Ajuda e Suporte</span>
          </div>

          {/* Mobile breadcrumb */}
          <div className="ml-[0.75em] flex items-center gap-[0.375em] md:hidden">
            <span className="text-foreground text-sm font-medium">Ajuda e Suporte</span>
          </div>

          {/* Close button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="ml-auto shrink-0 gap-[0.375em]"
            onClick={handleClose}
          >
            <HugeiconsIcon icon={Cancel01Icon} size={14} />
            Fechar
          </Button>
        </div>
      </header>

      {/* ── Content ── */}
      <div className="bg-muted/30 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl space-y-[1.5em] px-6 py-10">
          {/* ── 1. Hero / Search ── */}
          <section aria-labelledby="help-title" className="space-y-3 text-center">
            <h1 id="help-title" className="text-foreground text-2xl font-semibold tracking-tight">
              Como podemos ajudar?
            </h1>
            <p className="text-muted-foreground text-sm">Encontre respostas para suas dúvidas</p>
            <div className="relative mx-auto max-w-md">
              <label htmlFor="faq-search" className="sr-only">
                Buscar nas dúvidas frequentes
              </label>
              <HugeiconsIcon
                icon={Search01Icon}
                size={16}
                className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
              />
              <Input
                id="faq-search"
                type="search"
                placeholder="Buscar nas dúvidas frequentes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </section>

          {/* ── 2. Categories ── */}
          <section aria-labelledby="faq-categories-title">
            <h2
              id="faq-categories-title"
              className="text-muted-foreground mb-[0.75em] text-xs font-medium tracking-widest uppercase"
            >
              Categorias
            </h2>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {categories.map((cat) => (
                <Card key={cat.title} className="rounded-2xl shadow-none">
                  <CardContent className="flex items-start gap-3 p-4">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${cat.iconBg}`}
                    >
                      <HugeiconsIcon icon={cat.icon} size={18} className={cat.iconColor} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-foreground text-sm font-medium">{cat.title}</p>
                      <p className="text-muted-foreground mt-0.5 text-xs">{cat.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* ── 3. FAQ ── */}
          <section aria-labelledby="faq-title">
            <h2
              id="faq-title"
              className="text-muted-foreground mb-[0.75em] text-xs font-medium tracking-widest uppercase"
            >
              Dúvidas frequentes
            </h2>

            {query && filteredFaq.length === 0 ? (
              <div aria-live="polite">
                <AffiliateEmptyState
                  icon={Search01Icon}
                  title="Nenhum resultado encontrado"
                  description="Tente buscar por outro termo ou consulte uma categoria."
                />
              </div>
            ) : (
              <Accordion type="single" collapsible className="shadow-none">
                {filteredFaq.map((item) => (
                  <AccordionItem key={item.id} value={item.id}>
                    <AccordionTrigger>{item.question}</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground leading-relaxed">
                        {formatFaqAnswer(item.answer)}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </section>

          {/* ── 4. CTA ── */}
          <Card className="bg-muted/50 rounded-2xl shadow-none">
            <CardContent className="flex flex-col items-center gap-2 py-8 text-center">
              <h2 className="text-foreground text-base font-medium">
                Não encontrou o que procurava?
              </h2>
              <p className="text-muted-foreground text-sm">
                Nossa equipe de suporte está disponível para ajudar
              </p>
              <Button type="button" className="mt-2">
                Falar com o suporte
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
