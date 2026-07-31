// Formatação pt-BR compartilhada pelas telas do módulo de afiliados.

const moeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const numero = new Intl.NumberFormat("pt-BR");

export function formatarMoeda(valor: number): string {
  return moeda.format(valor);
}

export function formatarNumero(valor: number): string {
  return numero.format(valor);
}

export function formatarData(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR");
}

export function formatarHora(iso: string): string {
  return new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

export function formatarDataHora(iso: string): string {
  return `${formatarData(iso)} às ${formatarHora(iso)}`;
}

const dataExtensa = new Intl.DateTimeFormat("pt-BR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

// "27 de Março de 2026", com o mês capitalizado como nos frames do Figma.
export function formatarDataExtensa(iso: string): string {
  return dataExtensa
    .format(new Date(iso))
    .replace(/ de ([a-zà-ú])/, (_, letra: string) => ` de ${letra.toUpperCase()}`);
}

// Rótulo do separador de dia da Central de filiação:
// "Hoje", "Ontem, 27/07/2026" ou "25/07/2026".
export function rotuloDoDia(iso: string): string {
  const data = new Date(iso);
  const hoje = new Date();
  const ontem = new Date();
  ontem.setDate(hoje.getDate() - 1);

  const mesmoDia = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (mesmoDia(data, hoje)) return "Hoje";
  if (mesmoDia(data, ontem)) return `Ontem, ${formatarData(iso)}`;
  return formatarData(iso);
}

export function formatarTempoRelativo(iso: string): string {
  const minutos = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60_000));
  if (minutos < 60) return `há ${minutos} min.`;
  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `há ${horas} h`;
  const dias = Math.floor(horas / 24);
  if (dias === 1) return "ontem";
  return `há ${dias} dias`;
}
