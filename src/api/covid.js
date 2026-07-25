// Thin client for the disease.sh COVID-19 API (https://disease.sh/docs).
// Uses the native fetch API — no third-party HTTP client required.

const BASE_URL = 'https://disease.sh/v3/covid-19';

/**
 * Perform a JSON GET request with basic error handling.
 * @param {string} path - Path appended to the API base URL.
 * @returns {Promise<any>} Parsed JSON payload.
 */
async function getJSON(path) {
  const response = await fetch(`${BASE_URL}${path}`);
  if (!response.ok) {
    throw new Error(`Request failed (${response.status}) for ${path}`);
  }
  return response.json();
}

/**
 * Normalize a raw summary payload into the shape used by the UI.
 * The global (`/all`) and country (`/countries/{c}`) endpoints share the
 * same field names, so a single mapper covers both.
 */
function normalizeSummary(raw) {
  return {
    confirmed: raw.cases,
    todayConfirmed: raw.todayCases,
    active: raw.active,
    critical: raw.critical,
    recovered: raw.recovered,
    todayRecovered: raw.todayRecovered,
    deaths: raw.deaths,
    todayDeaths: raw.todayDeaths,
    tests: raw.tests,
    population: raw.population,
    casesPerMillion: raw.casesPerOneMillion,
    deathsPerMillion: raw.deathsPerOneMillion,
    lastUpdate: raw.updated,
    flag: raw.countryInfo?.flag ?? null,
    continent: raw.continent ?? null,
  };
}

/**
 * Fetch summary statistics for the whole world or a single country.
 * @param {string} [country] - Country name/ISO code, or empty for global.
 */
export async function fetchSummary(country) {
  const path = country
    ? `/countries/${encodeURIComponent(country)}?strict=true`
    : '/all';
  const raw = await getJSON(path);
  return normalizeSummary(raw);
}

/**
 * Fetch the historical timeline (confirmed & deaths per day).
 * @param {string} [country] - Country name/ISO code, or empty for global.
 * @returns {Promise<Array<{date: string, confirmed: number, deaths: number, recovered: number}>>}
 */
export async function fetchTimeline(country) {
  const path = country
    ? `/historical/${encodeURIComponent(country)}?lastdays=all`
    : '/historical/all?lastdays=all';
  const raw = await getJSON(path);

  // Country responses nest the series under `timeline`; global does not.
  const timeline = raw.timeline ?? raw;
  const { cases = {}, deaths = {}, recovered = {} } = timeline;

  return Object.keys(cases)
    .sort((a, b) => new Date(a) - new Date(b))
    .map((date) => ({
      date,
      confirmed: cases[date],
      deaths: deaths[date],
      recovered: recovered[date] ?? 0,
    }));
}

/**
 * Fetch the list of countries with basic metadata for the picker.
 * @returns {Promise<Array<{name: string, code: string, flag: string}>>}
 */
export async function fetchCountries() {
  const raw = await getJSON('/countries?sort=cases');
  return raw
    .map((entry) => ({
      name: entry.country,
      code: entry.countryInfo?.iso2 ?? '',
      flag: entry.countryInfo?.flag ?? '',
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
