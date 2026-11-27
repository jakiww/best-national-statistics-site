// NationScope charts: small SVG builders, no library. Every chart is a plain
// string of SVG the page drops in, so the site stays fast and offline.
// Colours come from the site palette: ink for text, teal for the main series,
// amber for a highlighted row, slate for the rest.

export const INK = '#1d3557';
export const TEAL = '#2a9d8f';
export const AMBER = '#e9a13b';
export const SLATE = '#8d99ae';
export const GRID = '#e5e0d8';

function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);
}

// A ranked horizontal bar chart. rows: [{label, value, display, highlight}].
// Bars scale to the largest value; each row shows its rank, label, bar and
// formatted value. `width` is the SVG viewBox width; the chart is responsive.
export function hbars(rows, { width = 640, barHeight = 26, gap = 8, labelWidth = 150, valueWidth = 92 } = {}) {
  const max = Math.max(...rows.map((r) => r.value), 1);
  const plotW = width - labelWidth - valueWidth;
  const height = rows.length * (barHeight + gap) + 6;
  const body = rows
    .map((r, i) => {
      const y = 6 + i * (barHeight + gap);
      const w = Math.max(2, (r.value / max) * plotW);
      const fill = r.highlight ? AMBER : TEAL;
      return `<g>
  <text x="0" y="${y + 17}" class="chart-rank">${i + 1}</text>
  <text x="30" y="${y + 17}" class="chart-label">${esc(r.label)}</text>
  <rect x="${labelWidth}" y="${y}" width="${w}" height="${barHeight}" rx="3" fill="${fill}"></rect>
  <text x="${labelWidth + w + 8}" y="${y + 17}" class="chart-value">${esc(r.display)}</text>
</g>`;
    })
    .join('');
  return `<svg class="chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="Bar chart">${body}</svg>`;
}

// A grouped bar chart for comparing a few countries on one indicator.
// series: [{label, value, display}], one bar per country, with a scale line.
export function groupBars(series, { width = 640, barHeight = 30, gap = 10, labelWidth = 140, valueWidth = 96 } = {}) {
  const max = Math.max(...series.map((s) => s.value), 1);
  const plotW = width - labelWidth - valueWidth;
  const height = series.length * (barHeight + gap) + 6;
  const palette = [TEAL, AMBER, '#457b9d'];
  const body = series
    .map((s, i) => {
      const y = 6 + i * (barHeight + gap);
      const w = Math.max(2, (s.value / max) * plotW);
      return `<g>
  <text x="0" y="${y + 19}" class="chart-label">${esc(s.label)}</text>
  <rect x="${labelWidth}" y="${y}" width="${w}" height="${barHeight}" rx="3" fill="${palette[i % palette.length]}"></rect>
  <text x="${labelWidth + w + 8}" y="${y + 19}" class="chart-value">${esc(s.display)}</text>
</g>`;
    })
    .join('');
  return `<svg class="chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="Comparison chart">${body}</svg>`;
}

// A thin meter: a value shown as a filled share of a scale, for stat cards
// such as life expectancy (scale 0–90 years) or literacy (0–100%).
export function meter(value, scale, display) {
  const pct = Math.max(0, Math.min(100, (value / scale) * 100));
  return `<div class="meter" role="img" aria-label="${esc(display)}">
  <div class="meter-fill" style="width:${pct.toFixed(1)}%"></div>
</div>`;
}
