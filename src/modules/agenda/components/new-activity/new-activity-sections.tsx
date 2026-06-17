/**
 * Shared presentational helpers for the nova-atividade form.
 *
 * The main component (AgendaNovaAtividade) now uses shadcn Card/Input/Select
 * directly, so most wizard-era section wrappers were removed. This file keeps
 * only the lightweight helpers that are reused or tested independently.
 */

import type { ReactNode } from "react";

import { Label } from "@/components/ui/label";

/** Label + children wrapper used inside cards. */
function FieldGroup({
  children,
  label,
  hint,
}: {
  children: ReactNode;
  label: string;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {children}
      {hint && <p className="text-muted-foreground text-xs">{hint}</p>}
    </div>
  );
}

export { FieldGroup };
