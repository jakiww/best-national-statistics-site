// NationScope data: 32 countries, each with the headline indicators a visitor
// comes to a national statistics site for. Every figure is a published value
// from the source named beside its indicator below; figures are rounded for
// display and the observation year is kept with the value that needs it
// (literacy, which countries measure in different years). Population and
// GDP are World Bank / UN 2024; life expectancy is World Bank 2023;
// literacy is UNESCO Institute for Statistics; median age is UN 2024;
// urban share is World Bank 2024; HDI is UNDP Human Development Report
// 2023-24 (2022 data); land area is the UN figure. Density and GDP per
// head are computed from population, area and GDP, never typed twice.

export const WORLD = {
  populationMillions: 8240,
  gdpBillions: 111326,
  lifeYears: 73.5,
  literacyPct: 87.7,
  countryCount: 195,
  year: 2024,
};

export const INDICATORS = [
  { key: 'pop', label: 'Population', unit: 'million people', source: 'UN World Population Prospects 2024 / World Bank', year: 2024, decimals: 1 },
  { key: 'gdp', label: 'GDP (nominal)', unit: 'US$ billion', source: 'World Bank, World Development Indicators', year: 2024, decimals: 0 },
  { key: 'gdpPc', label: 'GDP per capita', unit: 'US$', source: 'World Bank, computed from GDP and population', year: 2024, decimals: 0 },
  { key: 'life', label: 'Life expectancy at birth', unit: 'years', source: 'World Bank, World Development Indicators', year: 2023, decimals: 1 },
  { key: 'literacy', label: 'Adult literacy (age 15+)', unit: '%', source: 'UNESCO Institute for Statistics', year: null, decimals: 1 },
  { key: 'medianAge', label: 'Median age', unit: 'years', source: 'UN World Population Prospects 2024', year: 2024, decimals: 1 },
  { key: 'urban', label: 'Urban population', unit: '%', source: 'World Bank, World Development Indicators', year: 2024, decimals: 0 },
  { key: 'hdi', label: 'Human Development Index', unit: '0–1', source: 'UNDP Human Development Report 2023-24', year: 2022, decimals: 3 },
  { key: 'density', label: 'Population density', unit: 'people per km²', source: 'Computed from population and land area', year: 2024, decimals: 0 },
];

export const COUNTRIES = [
  { slug: 'united-states', name: 'United States', capital: 'Washington, D.C.', region: 'North America', pop: 340.1, area: 9833517, gdp: 29180, life: 78.4, literacy: 99.0, literacyYear: 2019, medianAge: 38.9, urban: 83, hdi: 0.927 },
  { slug: 'china', name: 'China', capital: 'Beijing', region: 'Asia', pop: 1409.0, area: 9596961, gdp: 18730, life: 78.0, literacy: 96.8, literacyYear: 2020, medianAge: 39.7, urban: 65, hdi: 0.788 },
  { slug: 'india', name: 'India', capital: 'New Delhi', region: 'Asia', pop: 1450.9, area: 3287263, gdp: 3760, life: 72.0, literacy: 78.2, literacyYear: 2024, medianAge: 29.1, urban: 36, hdi: 0.644 },
  { slug: 'indonesia', name: 'Indonesia', capital: 'Jakarta', region: 'Asia', pop: 283.5, area: 1904569, gdp: 1402, life: 71.2, literacy: 96.0, literacyYear: 2020, medianAge: 30.5, urban: 58, hdi: 0.728 },
  { slug: 'pakistan', name: 'Pakistan', capital: 'Islamabad', region: 'Asia', pop: 251.3, area: 881913, gdp: 373, life: 67.7, literacy: 58.9, literacyYear: 2021, medianAge: 20.7, urban: 37, hdi: 0.540 },
  { slug: 'nigeria', name: 'Nigeria', capital: 'Abuja', region: 'Africa', pop: 232.7, area: 923768, gdp: 188, life: 54.5, literacy: 70.4, literacyYear: 2024, medianAge: 18.2, urban: 54, hdi: 0.548 },
  { slug: 'brazil', name: 'Brazil', capital: 'Brasília', region: 'South America', pop: 216.4, area: 8514877, gdp: 2188, life: 75.8, literacy: 93.2, literacyYear: 2022, medianAge: 33.9, urban: 87, hdi: 0.760 },
  { slug: 'bangladesh', name: 'Bangladesh', capital: 'Dhaka', region: 'Asia', pop: 173.6, area: 148460, gdp: 451, life: 73.9, literacy: 79.0, literacyYear: 2022, medianAge: 27.4, urban: 40, hdi: 0.670 },
  { slug: 'russia', name: 'Russia', capital: 'Moscow', region: 'Europe', pop: 144.8, area: 17098246, gdp: 2174, life: 73.3, literacy: 99.7, literacyYear: 2021, medianAge: 40.7, urban: 75, hdi: 0.832 },
  { slug: 'mexico', name: 'Mexico', capital: 'Mexico City', region: 'North America', pop: 130.9, area: 1964375, gdp: 1856, life: 75.3, literacy: 95.0, literacyYear: 2022, medianAge: 30.3, urban: 81, hdi: 0.789 },
  { slug: 'ethiopia', name: 'Ethiopia', capital: 'Addis Ababa', region: 'Africa', pop: 129.7, area: 1104300, gdp: 205, life: 67.8, literacy: 52.0, literacyYear: 2017, medianAge: 19.8, urban: 23, hdi: 0.492 },
  { slug: 'japan', name: 'Japan', capital: 'Tokyo', region: 'Asia', pop: 124.0, area: 377975, gdp: 4190, life: 84.0, literacy: 99.0, literacyYear: 2019, medianAge: 49.1, urban: 92, hdi: 0.925 },
  { slug: 'egypt', name: 'Egypt', capital: 'Cairo', region: 'Africa', pop: 112.7, area: 1002450, gdp: 380, life: 71.6, literacy: 79.5, literacyYear: 2022, medianAge: 25.5, urban: 43, hdi: 0.754 },
  { slug: 'philippines', name: 'Philippines', capital: 'Manila', region: 'Asia', pop: 115.8, area: 300000, gdp: 461, life: 69.8, literacy: 96.0, literacyYear: 2020, medianAge: 25.8, urban: 48, hdi: 0.710 },
  { slug: 'dr-congo', name: 'DR Congo', capital: 'Kinshasa', region: 'Africa', pop: 109.3, area: 2344858, gdp: 70, life: 62.6, literacy: 77.0, literacyYear: 2021, medianAge: 16.6, urban: 47, hdi: 0.532 },
  { slug: 'vietnam', name: 'Vietnam', capital: 'Hanoi', region: 'Asia', pop: 100.9, area: 331212, gdp: 433, life: 75.1, literacy: 95.8, literacyYear: 2019, medianAge: 33.2, urban: 40, hdi: 0.766 },
  { slug: 'iran', name: 'Iran', capital: 'Tehran', region: 'Asia', pop: 91.6, area: 1648195, gdp: 436, life: 77.7, literacy: 85.5, literacyYear: 2021, medianAge: 33.4, urban: 77, hdi: 0.799 },
  { slug: 'turkiye', name: 'Türkiye', capital: 'Ankara', region: 'Asia', pop: 85.7, area: 783562, gdp: 1323, life: 77.2, literacy: 96.7, literacyYear: 2022, medianAge: 34.0, urban: 77, hdi: 0.855 },
  { slug: 'germany', name: 'Germany', capital: 'Berlin', region: 'Europe', pop: 84.1, area: 357588, gdp: 4686, life: 80.5, literacy: 99.0, literacyYear: 2019, medianAge: 46.1, urban: 78, hdi: 0.950 },
  { slug: 'thailand', name: 'Thailand', capital: 'Bangkok', region: 'Asia', pop: 71.7, area: 513120, gdp: 529, life: 76.4, literacy: 94.1, literacyYear: 2021, medianAge: 40.8, urban: 53, hdi: 0.798 },
  { slug: 'united-kingdom', name: 'United Kingdom', capital: 'London', region: 'Europe', pop: 69.3, area: 243610, gdp: 3696, life: 81.2, literacy: 99.0, literacyYear: 2019, medianAge: 40.6, urban: 84, hdi: 0.946 },
  { slug: 'france', name: 'France', capital: 'Paris', region: 'Europe', pop: 68.6, area: 551695, gdp: 3160, life: 82.9, literacy: 99.0, literacyYear: 2019, medianAge: 42.6, urban: 82, hdi: 0.920 },
  { slug: 'tanzania', name: 'Tanzania', capital: 'Dodoma', region: 'Africa', pop: 65.6, area: 945087, gdp: 79, life: 66.9, literacy: 77.9, literacyYear: 2021, medianAge: 17.3, urban: 37, hdi: 0.555 },
  { slug: 'south-africa', name: 'South Africa', capital: 'Pretoria', region: 'Africa', pop: 64.0, area: 1221037, gdp: 400, life: 66.1, literacy: 95.0, literacyYear: 2021, medianAge: 28.2, urban: 68, hdi: 0.717 },
  { slug: 'italy', name: 'Italy', capital: 'Rome', region: 'Europe', pop: 59.0, area: 302073, gdp: 2381, life: 83.7, literacy: 99.2, literacyYear: 2020, medianAge: 48.4, urban: 71, hdi: 0.915 },
  { slug: 'kenya', name: 'Kenya', capital: 'Nairobi', region: 'Africa', pop: 55.3, area: 580876, gdp: 124, life: 66.5, literacy: 82.9, literacyYear: 2022, medianAge: 20.4, urban: 29, hdi: 0.601 },
  { slug: 'south-korea', name: 'South Korea', capital: 'Seoul', region: 'Asia', pop: 51.8, area: 100210, gdp: 1875, life: 83.4, literacy: 97.9, literacyYear: 2019, medianAge: 45.5, urban: 81, hdi: 0.929 },
  { slug: 'colombia', name: 'Colombia', capital: 'Bogotá', region: 'South America', pop: 52.9, area: 1141748, gdp: 418, life: 76.8, literacy: 95.6, literacyYear: 2021, medianAge: 32.0, urban: 82, hdi: 0.788 },
  { slug: 'spain', name: 'Spain', capital: 'Madrid', region: 'Europe', pop: 48.6, area: 505992, gdp: 1726, life: 83.9, literacy: 98.4, literacyYear: 2020, medianAge: 45.9, urban: 82, hdi: 0.918 },
  { slug: 'argentina', name: 'Argentina', capital: 'Buenos Aires', region: 'South America', pop: 45.7, area: 2780400, gdp: 633, life: 77.4, literacy: 99.0, literacyYear: 2020, medianAge: 32.5, urban: 92, hdi: 0.849 },
  { slug: 'canada', name: 'Canada', capital: 'Ottawa', region: 'North America', pop: 40.1, area: 9984670, gdp: 2244, life: 81.6, literacy: 99.0, literacyYear: 2019, medianAge: 41.6, urban: 82, hdi: 0.935 },
  { slug: 'australia', name: 'Australia', capital: 'Canberra', region: 'Asia', pop: 27.2, area: 7692024, gdp: 1769, life: 83.1, literacy: 99.0, literacyYear: 2019, medianAge: 37.9, urban: 86, hdi: 0.946 },
];

// Derived figures, kept in one place so every view agrees: GDP per head
// from GDP and population, density from population and land area.
export function gdpPerCapita(c) {
  return Math.round((c.gdp * 1e9) / (c.pop * 1e6));
}

export function density(c) {
  return Math.round((c.pop * 1e6) / c.area);
}

export function valueOf(c, key) {
  if (key === 'gdpPc') return gdpPerCapita(c);
  if (key === 'density') return density(c);
  return c[key];
}

export function bySlug(slug) {
  return COUNTRIES.find((c) => c.slug === slug);
}

export function rankedBy(key, descending = true) {
  const rows = [...COUNTRIES].sort((a, b) => valueOf(a, key) - valueOf(b, key));
  return descending ? rows.reverse() : rows;
}

export const REGIONS = ['All regions', 'Africa', 'Asia', 'Europe', 'North America', 'South America'];
