import type { ResumoAfiliados } from "@/types/api/afiliados";

// Valores espelham o frame AFI-01 do Figma para facilitar comparação visual.
// São placeholders de design, não dado real.

function minutosAtras(minutos: number): string {
  return new Date(Date.now() - minutos * 60_000).toISOString();
}

export const resumoAfiliadosCheio: ResumoAfiliados = {
  totalVendas: 675_274.67,
  valorComissoes: 152_592.9,
  afiliadosAtivos: 2158,
  atualizadoEm: minutosAtras(10),
};

export const resumoAfiliadosVazio: ResumoAfiliados = {
  totalVendas: 0,
  valorComissoes: 0,
  afiliadosAtivos: 0,
  atualizadoEm: minutosAtras(1),
};

export const resumoAfiliadosExtremos: ResumoAfiliados = {
  totalVendas: 98_765_432.1,
  valorComissoes: 12_345_678.9,
  afiliadosAtivos: 184_302,
  atualizadoEm: minutosAtras(0),
};
