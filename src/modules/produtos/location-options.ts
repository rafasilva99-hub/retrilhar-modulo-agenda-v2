export type CountryOption = {
  readonly code: string;
  readonly name: string;
};

export type BrazilStateOption = {
  readonly code: string;
  readonly name: string;
};

export type BrazilCityOption = {
  readonly id: string;
  readonly name: string;
  readonly stateCode: string;
};

export class LocationOptionsError extends Error {
  readonly status: number;

  constructor(status: number) {
    super(`Location options request failed with status ${status}`);
    this.name = "LocationOptionsError";
    this.status = status;
  }
}

export const DEFAULT_COUNTRY_CODE = "BR";

const COUNTRY_CODES = [
  "AD",
  "AE",
  "AF",
  "AG",
  "AI",
  "AL",
  "AM",
  "AO",
  "AQ",
  "AR",
  "AS",
  "AT",
  "AU",
  "AW",
  "AX",
  "AZ",
  "BA",
  "BB",
  "BD",
  "BE",
  "BF",
  "BG",
  "BH",
  "BI",
  "BJ",
  "BL",
  "BM",
  "BN",
  "BO",
  "BQ",
  "BR",
  "BS",
  "BT",
  "BV",
  "BW",
  "BY",
  "BZ",
  "CA",
  "CC",
  "CD",
  "CF",
  "CG",
  "CH",
  "CI",
  "CK",
  "CL",
  "CM",
  "CN",
  "CO",
  "CR",
  "CU",
  "CV",
  "CW",
  "CX",
  "CY",
  "CZ",
  "DE",
  "DJ",
  "DK",
  "DM",
  "DO",
  "DZ",
  "EC",
  "EE",
  "EG",
  "EH",
  "ER",
  "ES",
  "ET",
  "FI",
  "FJ",
  "FK",
  "FM",
  "FO",
  "FR",
  "GA",
  "GB",
  "GD",
  "GE",
  "GF",
  "GG",
  "GH",
  "GI",
  "GL",
  "GM",
  "GN",
  "GP",
  "GQ",
  "GR",
  "GS",
  "GT",
  "GU",
  "GW",
  "GY",
  "HK",
  "HM",
  "HN",
  "HR",
  "HT",
  "HU",
  "ID",
  "IE",
  "IL",
  "IM",
  "IN",
  "IO",
  "IQ",
  "IR",
  "IS",
  "IT",
  "JE",
  "JM",
  "JO",
  "JP",
  "KE",
  "KG",
  "KH",
  "KI",
  "KM",
  "KN",
  "KP",
  "KR",
  "KW",
  "KY",
  "KZ",
  "LA",
  "LB",
  "LC",
  "LI",
  "LK",
  "LR",
  "LS",
  "LT",
  "LU",
  "LV",
  "LY",
  "MA",
  "MC",
  "MD",
  "ME",
  "MF",
  "MG",
  "MH",
  "MK",
  "ML",
  "MM",
  "MN",
  "MO",
  "MP",
  "MQ",
  "MR",
  "MS",
  "MT",
  "MU",
  "MV",
  "MW",
  "MX",
  "MY",
  "MZ",
  "NA",
  "NC",
  "NE",
  "NF",
  "NG",
  "NI",
  "NL",
  "NO",
  "NP",
  "NR",
  "NU",
  "NZ",
  "OM",
  "PA",
  "PE",
  "PF",
  "PG",
  "PH",
  "PK",
  "PL",
  "PM",
  "PN",
  "PR",
  "PS",
  "PT",
  "PW",
  "PY",
  "QA",
  "RE",
  "RO",
  "RS",
  "RU",
  "RW",
  "SA",
  "SB",
  "SC",
  "SD",
  "SE",
  "SG",
  "SH",
  "SI",
  "SJ",
  "SK",
  "SL",
  "SM",
  "SN",
  "SO",
  "SR",
  "SS",
  "ST",
  "SV",
  "SX",
  "SY",
  "SZ",
  "TC",
  "TD",
  "TF",
  "TG",
  "TH",
  "TJ",
  "TK",
  "TL",
  "TM",
  "TN",
  "TO",
  "TR",
  "TT",
  "TV",
  "TW",
  "TZ",
  "UA",
  "UG",
  "UM",
  "US",
  "UY",
  "UZ",
  "VA",
  "VC",
  "VE",
  "VG",
  "VI",
  "VN",
  "VU",
  "WF",
  "WS",
  "YE",
  "YT",
  "ZA",
  "ZM",
  "ZW",
] as const;

const countryDisplayNames = new Intl.DisplayNames(["pt-BR"], { type: "region" });
const portugueseCollator = new Intl.Collator("pt-BR", { sensitivity: "base" });

export const countryOptions: readonly CountryOption[] = COUNTRY_CODES.map((code) => ({
  code,
  name: countryDisplayNames.of(code) ?? code,
})).sort((first, second) => portugueseCollator.compare(first.name, second.name));

export const fallbackBrazilStates: readonly BrazilStateOption[] = [
  { code: "AC", name: "Acre" },
  { code: "AL", name: "Alagoas" },
  { code: "AP", name: "Amapá" },
  { code: "AM", name: "Amazonas" },
  { code: "BA", name: "Bahia" },
  { code: "CE", name: "Ceará" },
  { code: "DF", name: "Distrito Federal" },
  { code: "ES", name: "Espírito Santo" },
  { code: "GO", name: "Goiás" },
  { code: "MA", name: "Maranhão" },
  { code: "MT", name: "Mato Grosso" },
  { code: "MS", name: "Mato Grosso do Sul" },
  { code: "MG", name: "Minas Gerais" },
  { code: "PA", name: "Pará" },
  { code: "PB", name: "Paraíba" },
  { code: "PR", name: "Paraná" },
  { code: "PE", name: "Pernambuco" },
  { code: "PI", name: "Piauí" },
  { code: "RJ", name: "Rio de Janeiro" },
  { code: "RN", name: "Rio Grande do Norte" },
  { code: "RS", name: "Rio Grande do Sul" },
  { code: "RO", name: "Rondônia" },
  { code: "RR", name: "Roraima" },
  { code: "SC", name: "Santa Catarina" },
  { code: "SP", name: "São Paulo" },
  { code: "SE", name: "Sergipe" },
  { code: "TO", name: "Tocantins" },
];

export const fallbackBrazilCities: readonly BrazilCityOption[] = [
  { id: "5219803", name: "São Domingos", stateCode: "GO" },
  { id: "3550308", name: "São Paulo", stateCode: "SP" },
  { id: "3304557", name: "Rio de Janeiro", stateCode: "RJ" },
  { id: "5300108", name: "Brasília", stateCode: "DF" },
];

function hasProperty<Key extends string>(value: unknown, key: Key): value is Record<Key, unknown> {
  return typeof value === "object" && value !== null && key in value;
}

function readString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value : undefined;
}

function readNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function readCityStateCode(value: unknown): string | undefined {
  if (!hasProperty(value, "microrregiao")) return undefined;
  const microregion = value.microrregiao;
  if (!hasProperty(microregion, "mesorregiao")) return undefined;
  const mesoregion = microregion.mesorregiao;
  if (!hasProperty(mesoregion, "UF")) return undefined;
  const state = mesoregion.UF;
  if (!hasProperty(state, "sigla")) return undefined;

  return readString(state.sigla);
}

export function isAbortError(value: unknown): boolean {
  return hasProperty(value, "name") && value.name === "AbortError";
}

async function fetchJson(url: string, signal: AbortSignal): Promise<unknown> {
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new LocationOptionsError(response.status);
  }

  const body: unknown = await response.json();
  return body;
}

export function parseBrazilStates(value: unknown): readonly BrazilStateOption[] {
  if (!Array.isArray(value)) return fallbackBrazilStates;

  const states = value.flatMap((item): BrazilStateOption[] => {
    if (!hasProperty(item, "sigla") || !hasProperty(item, "nome")) return [];

    const code = readString(item.sigla);
    const name = readString(item.nome);
    return code && name ? [{ code, name }] : [];
  });

  return states.length > 0 ? states : fallbackBrazilStates;
}

export function parseBrazilCities(value: unknown): readonly BrazilCityOption[] {
  if (!Array.isArray(value)) return fallbackBrazilCities;

  const cities = value.flatMap((item): BrazilCityOption[] => {
    if (!hasProperty(item, "id") || !hasProperty(item, "nome")) return [];

    const id = readNumber(item.id);
    const name = readString(item.nome);
    const stateCode = readCityStateCode(item);
    return id && name && stateCode ? [{ id: String(id), name, stateCode }] : [];
  });

  return cities.length > 0 ? cities : fallbackBrazilCities;
}

export async function fetchBrazilStates(
  signal: AbortSignal
): Promise<readonly BrazilStateOption[]> {
  const body = await fetchJson(
    "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome",
    signal
  );

  return parseBrazilStates(body);
}

export async function fetchBrazilCities(signal: AbortSignal): Promise<readonly BrazilCityOption[]> {
  const body = await fetchJson(
    "https://servicodados.ibge.gov.br/api/v1/localidades/municipios?orderBy=nome",
    signal
  );

  return parseBrazilCities(body);
}

export function getBrazilCitiesForState(
  cities: readonly BrazilCityOption[],
  stateCode: string | undefined
): readonly BrazilCityOption[] {
  return stateCode ? cities.filter((city) => city.stateCode === stateCode) : cities;
}
