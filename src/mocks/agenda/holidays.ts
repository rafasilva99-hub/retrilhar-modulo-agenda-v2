/**
 * Holiday mock data for the Agenda module.
 *
 * Dates are dynamic so the prototype remains relevant regardless of current year.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Brazilian holidays — dynamic per year (includes moveable dates)
// ─────────────────────────────────────────────────────────────────────────────

function easterSunday(year: number): Date {
  // Meeus/Jones/Butcher algorithm
  const a = year % 19,
    b = Math.floor(year / 100),
    c = year % 100;
  const d = Math.floor(b / 4),
    e = b % 4,
    f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3),
    h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4),
    k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1;
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month, day);
}

function fmtDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function addDaysToDate(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

export function getBrazilianHolidays(year: number): Record<string, string> {
  const easter = easterSunday(year);
  return {
    [`${year}-01-01`]: "Confraternização Universal",
    [fmtDate(addDaysToDate(easter, -49))]: "Carnaval",
    [fmtDate(addDaysToDate(easter, -48))]: "Carnaval",
    [fmtDate(addDaysToDate(easter, -47))]: "Quarta-feira de Cinzas",
    [fmtDate(addDaysToDate(easter, -2))]: "Sexta-feira Santa",
    [fmtDate(easter)]: "Páscoa",
    [`${year}-04-21`]: "Tiradentes",
    [`${year}-05-01`]: "Dia do Trabalho",
    [fmtDate(addDaysToDate(easter, 60))]: "Corpus Christi",
    [`${year}-09-07`]: "Independência do Brasil",
    [`${year}-10-12`]: "Nossa Sra. Aparecida",
    [`${year}-11-02`]: "Finados",
    [`${year}-11-15`]: "Proclamação da República",
    [`${year}-12-25`]: "Natal",
  };
}

// Pre-compute holidays for current year and adjacent
const _y = new Date().getFullYear();
export const allHolidays: Record<string, string> = {
  ...getBrazilianHolidays(_y - 1),
  ...getBrazilianHolidays(_y),
  ...getBrazilianHolidays(_y + 1),
};
