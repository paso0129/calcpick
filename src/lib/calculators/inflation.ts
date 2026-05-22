export type InflationMode = 'historical' | 'projection';

export interface HistoricalInflationInput {
  amount: number;
  fromYear: number;
  toYear: number;
}

export interface ProjectionInflationInput {
  amount: number;
  years: number;
  annualRate: number; // %
}

export interface InflationResult {
  mode: InflationMode;
  adjustedValue: number;
  cumulativeInflationPct: number;
  annualizedRatePct: number;
  yearlyBreakdown: { year: number; value: number }[];
}

/**
 * US BLS CPI-U Annual Averages (1982-84=100)
 * Source: US Bureau of Labor Statistics CPI-U annual averages
 */
export const CPI_DATA: Record<number, number> = {
  1913: 9.9,
  1914: 10.0,
  1915: 10.1,
  1916: 10.9,
  1917: 12.8,
  1918: 15.1,
  1919: 17.3,
  1920: 20.0,
  1921: 17.9,
  1922: 16.8,
  1923: 17.1,
  1924: 17.1,
  1925: 17.5,
  1926: 17.7,
  1927: 17.4,
  1928: 17.1,
  1929: 17.1,
  1930: 16.7,
  1931: 15.2,
  1932: 13.7,
  1933: 13.0,
  1934: 13.4,
  1935: 13.7,
  1936: 13.9,
  1937: 14.4,
  1938: 14.1,
  1939: 13.9,
  1940: 14.0,
  1941: 14.7,
  1942: 16.3,
  1943: 17.3,
  1944: 17.6,
  1945: 18.0,
  1946: 19.5,
  1947: 22.3,
  1948: 24.1,
  1949: 23.8,
  1950: 24.1,
  1951: 26.0,
  1952: 26.5,
  1953: 26.7,
  1954: 26.9,
  1955: 26.8,
  1956: 27.2,
  1957: 28.1,
  1958: 28.9,
  1959: 29.1,
  1960: 29.6,
  1961: 29.9,
  1962: 30.2,
  1963: 30.6,
  1964: 31.0,
  1965: 31.5,
  1966: 32.4,
  1967: 33.4,
  1968: 34.8,
  1969: 36.7,
  1970: 38.8,
  1971: 40.5,
  1972: 41.8,
  1973: 44.4,
  1974: 49.3,
  1975: 53.8,
  1976: 56.9,
  1977: 60.6,
  1978: 65.2,
  1979: 72.6,
  1980: 82.4,
  1981: 90.9,
  1982: 96.5,
  1983: 99.6,
  1984: 103.9,
  1985: 107.6,
  1986: 109.6,
  1987: 113.6,
  1988: 118.3,
  1989: 124.0,
  1990: 130.7,
  1991: 136.2,
  1992: 140.3,
  1993: 144.5,
  1994: 148.2,
  1995: 152.4,
  1996: 156.9,
  1997: 160.5,
  1998: 163.0,
  1999: 166.6,
  2000: 172.2,
  2001: 177.1,
  2002: 179.9,
  2003: 184.0,
  2004: 188.9,
  2005: 195.3,
  2006: 201.6,
  2007: 207.3,
  2008: 215.3,
  2009: 214.5,
  2010: 218.1,
  2011: 224.9,
  2012: 229.6,
  2013: 233.0,
  2014: 236.7,
  2015: 237.0,
  2016: 240.0,
  2017: 245.1,
  2018: 251.1,
  2019: 255.7,
  2020: 258.8,
  2021: 270.97,
  2022: 292.66,
  2023: 304.7,
  2024: 313.7,
};

const MIN_YEAR = Math.min(...Object.keys(CPI_DATA).map(Number));
const MAX_YEAR = Math.max(...Object.keys(CPI_DATA).map(Number));

/**
 * Returns the CPI value for a given year.
 * Falls back to the nearest available year if the exact year is not in the dataset.
 */
function getCpi(year: number): number {
  if (CPI_DATA[year] !== undefined) return CPI_DATA[year];

  // Clamp to data range
  const clamped = Math.max(MIN_YEAR, Math.min(MAX_YEAR, year));
  if (CPI_DATA[clamped] !== undefined) return CPI_DATA[clamped];

  // Find closest year
  const years = Object.keys(CPI_DATA).map(Number);
  const closest = years.reduce((prev, curr) =>
    Math.abs(curr - year) < Math.abs(prev - year) ? curr : prev,
  );
  return CPI_DATA[closest];
}

/**
 * Calculate historical inflation using US BLS CPI-U data.
 * adjusted = amount × (CPI[toYear] / CPI[fromYear])
 */
export function calculateHistoricalInflation(
  input: HistoricalInflationInput,
): InflationResult {
  const { amount, fromYear, toYear } = input;

  const cpiFrom = getCpi(fromYear);
  const cpiTo = getCpi(toYear);
  const adjustedValue = amount * (cpiTo / cpiFrom);
  const cumulativeInflationPct = ((cpiTo - cpiFrom) / cpiFrom) * 100;

  const yearSpan = toYear - fromYear;
  let annualizedRatePct = 0;
  if (yearSpan !== 0) {
    annualizedRatePct =
      (Math.pow(cpiTo / cpiFrom, 1 / Math.abs(yearSpan)) - 1) * 100;
    if (yearSpan < 0) annualizedRatePct = -annualizedRatePct;
  }

  // Build yearly breakdown
  const startYear = Math.min(fromYear, toYear);
  const endYear = Math.max(fromYear, toYear);
  const direction = toYear >= fromYear ? 1 : -1;

  const yearlyBreakdown: { year: number; value: number }[] = [];
  const yearRange = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i,
  );

  const orderedYears =
    direction >= 0 ? yearRange : [...yearRange].reverse();

  for (const y of orderedYears) {
    const cpiY = getCpi(y);
    yearlyBreakdown.push({
      year: y,
      value: amount * (cpiY / cpiFrom),
    });
  }

  return {
    mode: 'historical',
    adjustedValue,
    cumulativeInflationPct,
    annualizedRatePct,
    yearlyBreakdown,
  };
}

/**
 * Project future inflation impact.
 * futureValue = amount × (1 + rate/100)^years  (nominal cost of same goods)
 * purchasingPower = amount / (1 + rate/100)^years  (real value of today's dollar)
 */
export function calculateProjectedInflation(
  input: ProjectionInflationInput,
): InflationResult {
  const { amount, years, annualRate } = input;
  const rate = annualRate / 100;

  // adjustedValue here = purchasing power (what today's money will be worth)
  const adjustedValue = amount / Math.pow(1 + rate, years);
  const futureValue = amount * Math.pow(1 + rate, years);
  const cumulativeInflationPct = ((futureValue - amount) / amount) * 100;

  const annualizedRatePct = annualRate;

  const currentYear = MAX_YEAR;
  const yearlyBreakdown: { year: number; value: number }[] = [];
  for (let i = 0; i <= years; i++) {
    yearlyBreakdown.push({
      year: currentYear + i,
      value: amount / Math.pow(1 + rate, i),
    });
  }

  return {
    mode: 'projection',
    adjustedValue,
    cumulativeInflationPct,
    annualizedRatePct,
    yearlyBreakdown,
  };
}
