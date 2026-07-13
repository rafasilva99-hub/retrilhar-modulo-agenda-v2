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
    description: "Vínculos com organizações",
  },
];

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
          item.question.toLowerCase().includes(query) ||
          item.answer.toLowerCase().includes(query),
      )
    : affiliateFaqItems;

  return (
    <div className="bg-background fixed inset-0 z-50 flex min-h-dvh flex-col">
      {/* ── Header ── */}
      <header className="shrink-0 border-b bg-background">
        <div className="flex h-[3.5em] items-center px-[0.75em]">
          {/* Mobile back button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon-sm" onClick={handleClose}>
              <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
            </Button>
          </div>

          {/* Desktop: logo + breadcrumb */}
          <div className="hidden items-center gap-[0.75em] md:flex">
            <a
              className="inline-flex items-center rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              href="#afiliados"
            >
              <img
                alt="Retrilhar"
                className="h-8 w-auto object-contain transition-all duration-300"
                src="/src/assets/retrilhar-logo.png"
              />
            </a>
            <div className="h-[1.25em] w-px bg-border" />
            <span className="text-sm text-muted-foreground">Ajuda e Suporte</span>
          </div>

          {/* Mobile breadcrumb */}
          <div className="ml-[0.75em] flex items-center gap-[0.375em] md:hidden">
            <span className="text-sm font-medium text-foreground">Ajuda e Suporte</span>
          </div>

          {/* Close button */}
          <Button
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
      <div className="flex-1 overflow-y-auto bg-muted/30">
        <div className="mx-auto max-w-3xl px-6 py-10 space-y-[1.5em]">
          {/* ── 1. Hero / Search ── */}
          <div className="text-center space-y-3">
            <h1 className="text-foreground text-2xl font-semibold tracking-tight">
              Como podemos ajudar?
            </h1>
            <p className="text-sm text-muted-foreground">
              Encontre respostas para suas dúvidas
            </p>
            <div className="relative mx-auto max-w-md">
              <HugeiconsIcon
                icon={Search01Icon}
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              />
              <Input
                placeholder="Buscar nas dúvidas frequentes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* ── 2. Categories ── */}
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-[0.75em]">
              Categorias
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {categories.map((cat) => (
                <Card key={cat.title} className="rounded-2xl shadow-none">
                  <CardContent className="flex items-start gap-3 p-4">
                    <div
                      className={`shrink-0 flex items-center justify-center w-9 h-9 rounded-full ${cat.iconBg}`}
                    >
                      <HugeiconsIcon icon={cat.icon} size={18} className={cat.iconColor} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">{cat.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{cat.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* ── 3. FAQ ── */}
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-[0.75em]">
              Dúvidas frequentes
            </p>

            {query && filteredFaq.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">
                Nenhum resultado encontrado
              </p>
            ) : (
              <Accordion type="single" collapsible className="shadow-none">
                {filteredFaq.map((item) => (
                  <AccordionItem key={item.id} value={item.id}>
                    <AccordionTrigger>{item.question}</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground leading-relaxed">{item.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>

          {/* ── 4. CTA ── */}
          <Card className="rounded-2xl shadow-none bg-muted/50">
            <CardContent className="flex flex-col items-center gap-2 py-8 text-center">
              <p className="text-base font-medium text-foreground">
                Não encontrou o que procurava?
              </p>
              <p className="text-sm text-muted-foreground">
                Nossa equipe de suporte está disponível para ajudar
              </p>
              <Button className="mt-2">Falar com o suporte</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
