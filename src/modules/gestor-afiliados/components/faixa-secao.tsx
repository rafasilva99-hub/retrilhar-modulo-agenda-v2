// Faixa de título de seção usada nos drawers do módulo (AFI-01.a e AFI-01.b).
export function FaixaSecao({ children }: { readonly children: React.ReactNode }) {
  return (
    <div className="bg-muted/60 text-muted-foreground flex items-center justify-between px-6 py-2 text-[11px] font-medium tracking-wider uppercase">
      {children}
    </div>
  );
}
