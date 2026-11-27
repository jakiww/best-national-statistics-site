// NationScope pages: every view is a function that takes the data it needs
// and returns an HTML string. Nothing here fetches anything; all figures
// come from data.js, and every figure on a page carries its source and year
// in the page footer or beside the table it sits in.

import { COUNTRIES, INDICATORS, REGIONS, WORLD, bySlug, density, gdpPerCapita, rankedBy, valueOf } from './data.js';
import { groupBars, hbars, meter } from './charts.js';

export function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

export function fmtNum(n, decimals = 0) {
  return Number(n).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export function fmtPop(millions) {
  return millions >= 1000 ? `${fmtNum(millions / 1000, 2)} billion` : `${fmtNum(millions, 1)} million`;
}

export function fmtGdp(billions) {
  return billions >= 1000 ? `$${fmtNum(billions / 1000, 2)} trillion` : `$${fmtNum(billions)} billion`;
}

export function fmtMoney(n) {
  return `$${fmtNum(n)}`;
}

function indicatorMeta(key) {
  return INDICATORS.find((i) => i.key === key);
}

function displayValue(c, key) {
  const meta = indicatorMeta(key);
  const v = valueOf(c, key);
  if (key === 'pop') return fmtPop(v);
  if (key === 'gdp') return fmtGdp(v);
  if (key === 'gdpPc') return fmtMoney(v);
  if (key === 'hdi') return v.toFixed(3);
  if (key === 'literacy' || key === 'urban') return `${fmtNum(v, meta.decimals)}%`;
  if (key === 'life' || key === 'medianAge') return `${fmtNum(v, 1)} years`;
  if (key === 'density') return `${fmtNum(v)} / km²`;
  return fmtNum(v, meta.decimals);
}

function statCard(label, big, sub, scale, value) {
  return `<div class="card">
  <div class="card-label">${esc(label)}</div>
  <div class="card-big">${big}</div>
  <div class="card-sub">${esc(sub)}</div>
  ${scale ? meter(value, scale, big) : ''}
</div>`;
}

function sourceText(meta, extraYear) {
  const year = extraYear || meta.year;
  return `Source: ${meta.source}${year ? `, ${year}` : ''}.`;
}

function sourceLine(meta, extraYear) {
  return `<p class="source">${esc(sourceText(meta, extraYear))}</p>`;
}

// ---- Home -----------------------------------------------------------------

export function home() {
  const popTop = rankedBy('pop').slice(0, 8).map((c) => ({
    label: c.name, value: c.pop, display: fmtPop(c.pop), highlight: c.slug === 'india',
  }));
  const gdpTop = rankedBy('gdp').slice(0, 8).map((c) => ({
    label: c.name, value: c.gdp, display: fmtGdp(c.gdp), highlight: c.slug === 'united-states',
  }));
  const lifeTop = rankedBy('life').slice(0, 5);
  const regionLinks = REGIONS.slice(1)
    .map((r) => `<a class="chip" href="#/countries?region=${encodeURIComponent(r)}">${esc(r)}</a>`)
    .join('');
  return `<section class="hero">
  <p class="kicker">National statistics · 32 countries · Updated November 2026</p>
  <h1>Every country, measured.<br>Every figure, sourced.</h1>
  <p class="lede">Population, economy, health, education and development for the
  world's major countries — from the UN, the World Bank, UNESCO and UNDP —
  presented so you can find an answer in seconds and check where it came from.</p>
  <div class="world-band">
    ${statCard('World population', '8.24 billion', 'UN, 2024', 0, 0)}
    ${statCard('World GDP', '$111.3 trillion', 'World Bank, 2024', 0, 0)}
    ${statCard('Life expectancy', '73.5 years', 'World Bank, 2024', 90, 73.5)}
    ${statCard('Adult literacy', '87.7%', 'UNESCO, 2024', 100, 87.7)}
  </div>
</section>
<section class="duo">
  <div class="panel">
    <h2><a href="#/rankings?metric=pop">Largest populations, 2024</a></h2>
    ${hbars(popTop)}
    <p class="source">Source: UN World Population Prospects 2024 / World Bank.</p>
  </div>
  <div class="panel">
    <h2><a href="#/rankings?metric=gdp">Largest economies, 2024</a></h2>
    ${hbars(gdpTop)}
    <p class="source">Source: World Bank, World Development Indicators, 2024.</p>
  </div>
</section>
<section class="duo">
  <div class="panel">
    <h2><a href="#/rankings?metric=life">Longest lives</a></h2>
    <ol class="ranklist">${lifeTop.map((c, i) => `<li><a href="#/country/${c.slug}">${esc(c.name)}</a><span>${fmtNum(c.life, 1)} years</span></li>`).join('')}</ol>
    <p class="source">Life expectancy at birth, World Bank, 2023. Japan leads at 84.0 years; Nigeria is lowest in this set at 54.5.</p>
  </div>
  <div class="panel">
    <h2>Browse by region</h2>
    <p>Start with a region, then open any country for its full profile — every
    indicator, its source and its year.</p>
    <p class="chips">${regionLinks}</p>
    <h2>Compare countries</h2>
    <p>Put up to three countries side by side on every indicator.
    <a href="#/compare">Open the comparison tool &rarr;</a></p>
    <h2>About the numbers</h2>
    <p>Figures are the latest published values from the UN, World Bank, UNESCO
    and UNDP, rounded for reading. <a href="#/methods">How we source and check them &rarr;</a></p>
  </div>
</section>`;
}

// ---- Countries table ---------------------------------------------------------

const TABLE_COLUMNS = [
  { key: 'name', label: 'Country' },
  { key: 'pop', label: 'Population' },
  { key: 'gdp', label: 'GDP' },
  { key: 'gdpPc', label: 'GDP per capita' },
  { key: 'life', label: 'Life expectancy' },
  { key: 'literacy', label: 'Literacy' },
  { key: 'hdi', label: 'HDI' },
];

export function countriesTable(rows, state) {
  const sortKey = state.sort || 'pop';
  const dir = state.dir === 'asc' ? 1 : -1;
  const sorted = [...rows].sort((a, b) => {
    const av = sortKey === 'name' ? a.name : valueOf(a, sortKey);
    const bv = sortKey === 'name' ? b.name : valueOf(b, sortKey);
    return (av < bv ? -1 : av > bv ? 1 : 0) * dir;
  });
  const head = TABLE_COLUMNS.map((col) => {
    const arrow = sortKey === col.key ? (dir === 1 ? ' ▲' : ' ▼') : '';
    const nextDir = sortKey === col.key && dir === -1 ? 'asc' : 'desc';
    return `<th><button class="sort-btn" data-sort="${col.key}" data-dir="${nextDir}">${esc(col.label)}${arrow}</button></th>`;
  }).join('');
  const body = sorted.map((c) => `<tr>
  <td><a href="#/country/${c.slug}"><strong>${esc(c.name)}</strong></a><br><span class="muted">${esc(c.region)} · ${esc(c.capital)}</span></td>
  <td>${fmtPop(c.pop)}</td>
  <td>${fmtGdp(c.gdp)}</td>
  <td>${fmtMoney(gdpPerCapita(c))}</td>
  <td>${fmtNum(c.life, 1)} yrs</td>
  <td>${fmtNum(c.literacy, 1)}% <span class="muted">(${c.literacyYear})</span></td>
  <td>${c.hdi.toFixed(3)}</td>
</tr>`).join('');
  const regionBtns = REGIONS.map((r) => `<button class="region-btn${state.region === r ? ' active' : ''}" data-region="${esc(r)}">${esc(r)}</button>`).join('');
  return `<h1>All countries</h1>
<p class="lede">Thirty-two major countries, one table. Search by name, filter by
region, or tap a column heading to sort. Population and GDP are 2024; life
expectancy is 2023; literacy is the latest UNESCO observation for each country.</p>
<div class="controls">
  <input id="country-search" type="search" placeholder="Search a country…" value="${esc(state.q || '')}" aria-label="Search countries">
  <div class="region-row">${regionBtns}</div>
</div>
<p class="count-line">${sorted.length} ${sorted.length === 1 ? 'country' : 'countries'} shown · <a href="#/rankings">See ranked charts &rarr;</a></p>
<div class="table-wrap"><table class="data-table">
<thead><tr>${head}</tr></thead>
<tbody>${body || `<tr><td colspan="7">No country matches that search.</td></tr>`}</tbody>
</table></div>
<p class="source">Sources: UN World Population Prospects 2024; World Bank World Development
Indicators 2024 (population, GDP, life expectancy 2023, urban share); UNESCO
Institute for Statistics (literacy); UNDP Human Development Report 2023-24 (HDI, 2022 data).</p>`;
}

// ---- Country detail ------------------------------------------------------------

export function countryDetail(c) {
  const world = WORLD;
  const popRank = rankedBy('pop').findIndex((x) => x.slug === c.slug) + 1;
  const gdpRank = rankedBy('gdp').findIndex((x) => x.slug === c.slug) + 1;
  const lifeRank = rankedBy('life').findIndex((x) => x.slug === c.slug) + 1;
  const bars = [
    { label: c.name, value: c.life, display: `${fmtNum(c.life, 1)} years` },
    { label: 'World', value: world.lifeYears, display: `${fmtNum(world.lifeYears, 1)} years` },
  ];
  const litBars = [
    { label: c.name, value: c.literacy, display: `${fmtNum(c.literacy, 1)}%` },
    { label: 'World', value: world.literacyPct, display: `${fmtNum(world.literacyPct, 1)}%` },
  ];
  const gdpPcBars = [
    { label: c.name, value: gdpPerCapita(c), display: fmtMoney(gdpPerCapita(c)) },
    { label: 'World avg.', value: Math.round((world.gdpBillions * 1e9) / (world.populationMillions * 1e6)), display: fmtMoney(Math.round((world.gdpBillions * 1e9) / (world.populationMillions * 1e6))) },
  ];
  const rows = INDICATORS.map((ind) => {
    const v = valueOf(c, ind.key);
    const year = ind.key === 'literacy' ? c.literacyYear : ind.year;
    return `<tr><td>${esc(ind.label)}</td><td><strong>${esc(displayValue(c, ind.key))}</strong></td><td>${esc(ind.unit)}</td><td>${esc(ind.source)}${year ? `, ${year}` : ''}</td></tr>`;
  }).join('');
  const popList = rankedBy('pop');
  const idx = popList.findIndex((x) => x.slug === c.slug);
  const near = [popList[idx - 1], popList[idx + 1]].filter(Boolean)
    .map((n) => `<a href="#/country/${n.slug}">${esc(n.name)}</a> (${fmtPop(n.pop)})`).join(' · ');
  return `<p class="crumb"><a href="#/countries">&larr; All countries</a> · <a href="#/compare?c=${c.slug}">Compare ${esc(c.name)}</a></p>
<header class="country-head">
  <p class="kicker">${esc(c.region)} · Capital ${esc(c.capital)}</p>
  <h1>${esc(c.name)}</h1>
  <p class="lede">The ${ordinal(popRank)} most populous country in this set and the
  ${ordinal(gdpRank)} largest economy; life expectancy ranks ${ordinal(lifeRank)} of 32.</p>
</header>
<div class="world-band">
  ${statCard('Population', fmtPop(c.pop), `Rank ${popRank} of 32 · ${fmtNum(density(c))} people/km²`, 0, 0)}
  ${statCard('GDP (nominal)', fmtGdp(c.gdp), `Rank ${gdpRank} of 32 · ${fmtMoney(gdpPerCapita(c))} per head`, 0, 0)}
  ${statCard('Life expectancy', `${fmtNum(c.life, 1)} years`, `World 73.5 · rank ${lifeRank} of 32`, 90, c.life)}
  ${statCard('Adult literacy', `${fmtNum(c.literacy, 1)}%`, `UNESCO, observed ${c.literacyYear}`, 100, c.literacy)}
</div>
<section class="duo">
  <div class="panel">
    <h2>How long people live</h2>
    ${groupBars(bars)}
    <p class="source">Life expectancy at birth, World Bank, 2023.</p>
  </div>
  <div class="panel">
    <h2>How much people earn</h2>
    ${groupBars(gdpPcBars)}
    <p class="source">GDP per capita, World Bank 2024, computed from GDP and population.</p>
  </div>
</section>
<section class="duo">
  <div class="panel">
    <h2>Reading and writing</h2>
    ${groupBars(litBars)}
    <p class="source">Adult literacy, age 15+, UNESCO Institute for Statistics, observed ${c.literacyYear}.</p>
  </div>
  <div class="panel">
    <h2>At a glance</h2>
    <dl class="facts">
      <dt>Median age</dt><dd>${fmtNum(c.medianAge, 1)} years (UN, 2024)</dd>
      <dt>Urban population</dt><dd>${c.urban}% (World Bank, 2024)</dd>
      <dt>Human Development Index</dt><dd>${c.hdi.toFixed(3)} (UNDP, 2022 data)</dd>
      <dt>Land area</dt><dd>${fmtNum(c.area)} km²</dd>
    </dl>
    <p>Nearest in population: ${near || '—'}.</p>
  </div>
</section>
<section class="panel">
  <h2>Every indicator, with its source</h2>
  <div class="table-wrap"><table class="data-table">
  <thead><tr><th>Indicator</th><th>Value</th><th>Unit</th><th>Source</th></tr></thead>
  <tbody>${rows}</tbody>
  </table></div>
</section>`;
}

function ordinal(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// ---- Rankings ------------------------------------------------------------------

export function rankings(key) {
  const meta = indicatorMeta(key) || indicatorMeta('pop');
  const ordered = rankedBy(meta.key);
  const rows = ordered.map((c) => ({
    country: c, value: valueOf(c, meta.key), display: displayValue(c, meta.key),
  }));
  const pills = INDICATORS.map((ind) => `<a class="pill${ind.key === meta.key ? ' active' : ''}" href="#/rankings?metric=${ind.key}">${esc(ind.label)}</a>`).join('');
  const tableRows = rows.map((r, i) => `<tr><td>${i + 1}</td><td><a href="#/country/${r.country.slug}"><strong>${esc(r.country.name)}</strong></a></td><td>${esc(r.display)}</td><td>${esc(r.country.region)}</td></tr>`).join('');
  return `<h1>Rankings</h1>
<p class="lede">Every country in the set, ranked on one indicator. Pick an indicator
to re-rank the whole table — the chart and the table move together.</p>
<p class="pills">${pills}</p>
<section class="panel">
  <h2>${esc(meta.label)} — ranked</h2>
  ${hbars(rows.slice(0, 12).map((r) => ({ label: r.country.name, value: r.value, display: r.display })))}
  <p class="source">Showing the top 12 of 32. ${esc(sourceText(meta, meta.key === 'literacy' ? null : meta.year))}</p>
</section>
<section class="panel">
  <h2>Full ranking: ${esc(meta.label)}</h2>
  <div class="table-wrap"><table class="data-table">
  <thead><tr><th>#</th><th>Country</th><th>${esc(meta.label)} (${esc(meta.unit)})</th><th>Region</th></tr></thead>
  <tbody>${tableRows}</tbody>
  </table></div>
  ${sourceLine(meta)}
</section>`;
}

// ---- Compare ---------------------------------------------------------------------

export function compare(picks) {
  const chosen = picks.map(bySlug).filter(Boolean).slice(0, 3);
  const options = (selected) => `<option value="">Choose a country…</option>` + COUNTRIES.map((c) => `<option value="${c.slug}"${c.slug === selected ? ' selected' : ''}>${esc(c.name)}</option>`).join('');
  const slots = [0, 1, 2].map((i) => `<label class="compare-pick">Country ${i + 1}
  <select data-pick="${i}">${options(chosen[i] ? chosen[i].slug : '')}</select></label>`).join('');
  if (chosen.length < 2) {
    return `<h1>Compare countries</h1>
<p class="lede">Pick two or three countries and see every indicator side by side.
Start with the two largest economies, or with neighbours in the population ranking.</p>
<div class="compare-controls">${slots}</div>
<p class="quick-picks">Try: <a href="#/compare?c=united-states&amp;d=china">United States vs China</a> ·
<a href="#/compare?c=india&amp;d=indonesia">India vs Indonesia</a> ·
<a href="#/compare?c=japan&amp;d=germany">Japan vs Germany</a></p>
<p class="source">All figures as published by the UN, World Bank, UNESCO and UNDP; years are shown beside each indicator below.</p>`;
  }
  const head = chosen.map((c) => `<th><a href="#/country/${c.slug}">${esc(c.name)}</a></th>`).join('');
  const body = INDICATORS.map((ind) => {
    const cells = chosen.map((c) => `<td><strong>${esc(displayValue(c, ind.key))}</strong></td>`).join('');
    const year = ind.key === 'literacy' ? 'latest obs.' : ind.year;
    return `<tr><td>${esc(ind.label)} <span class="muted">(${esc(ind.unit)}${year ? `, ${year}` : ''})</span></td>${cells}</tr>`;
  }).join('');
  const barSections = ['pop', 'gdpPc', 'life', 'literacy'].map((key) => {
    const meta = indicatorMeta(key);
    const series = chosen.map((c) => ({ label: c.name, value: valueOf(c, key), display: displayValue(c, key) }));
    return `<div class="panel"><h2>${esc(meta.label)}</h2>${groupBars(series)}<p class="source">${esc(meta.source)}${meta.year ? `, ${meta.year}` : ''}.</p></div>`;
  }).join('');
  return `<h1>Compare countries</h1>
<p class="lede">${chosen.map((c) => esc(c.name)).join(' vs ')} — every indicator, side by side.</p>
<div class="compare-controls">${slots}</div>
<section class="panel">
  <div class="table-wrap"><table class="data-table compare-table">
  <thead><tr><th>Indicator</th>${head}</tr></thead>
  <tbody>${body}</tbody>
  </table></div>
</section>
<section class="duo">${barSections}</section>`;
}

// ---- Methods --------------------------------------------------------------------

export function methods() {
  const rows = INDICATORS.map((ind) => `<tr><td>${esc(ind.label)}</td><td>${esc(ind.source)}</td><td>${ind.key === 'literacy' ? 'Latest observation per country' : ind.year}</td></tr>`).join('');
  return `<h1>Sources &amp; methods</h1>
<p class="lede">NationScope is a reading aid, not a statistical office. It republishes
figures from four public sources, rounded for display, with the source and year
shown beside every number.</p>
<section class="panel">
  <h2>Where the numbers come from</h2>
  <div class="table-wrap"><table class="data-table">
  <thead><tr><th>Indicator</th><th>Source</th><th>Year</th></tr></thead>
  <tbody>${rows}</tbody>
  </table></div>
</section>
<section class="duo">
  <div class="panel">
    <h2>What we compute</h2>
    <p>Two figures are computed, never typed: GDP per capita is GDP divided by
    population, and population density is population divided by land area. Both
    are rounded to whole numbers, so a per-capita figure may differ by a dollar
    or two from a source that publishes it directly.</p>
  </div>
  <div class="panel">
    <h2>What to watch for</h2>
    <p>Literacy is measured in different years in different countries — the
    observation year sits beside each value, so compare years as well as
    numbers. GDP is nominal, at market exchange rates, not adjusted for what
    money buys; a purchasing-power view would reorder the middle of the table.
    HDI is the UNDP figure for 2022, the latest in the 2023-24 report.</p>
  </div>
</section>
<section class="panel">
  <h2>Coverage</h2>
  <p>Thirty-two countries: the world's largest by population and economy, plus
  the largest in each region, so every region has a spread of incomes and
  sizes. The set is a reading sample, not the whole world — the world figures
  on the home page (8.24 billion people, $111.3 trillion of GDP) cover all
  countries, not just these 32.</p>
</section>`;
}

// ---- Not found ------------------------------------------------------------------

export function missing() {
  return `<h1>Not found</h1>
<p>There is no page at this address. <a href="#/">Back to the home page</a>, or
<a href="#/countries">browse all countries</a>.</p>`;
}
