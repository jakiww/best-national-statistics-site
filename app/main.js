// NationScope router: hash routes, one page per address, every control wired
// to do what it says. State lives in the URL (search text, region, sort,
// compare picks), so a page can be linked to and reloaded. Rendering is
// synchronous, and window.__shotReady flips true once the page is on screen,
// so a screenshot tool knows when to capture.
//
//   #/                          home
//   #/countries                 the table, with ?q=, ?region=, ?sort=, ?dir=
//   #/country/<slug>            one country's profile
//   #/rankings?metric=<key>     ranked charts and tables
//   #/compare?c=<slug>&d=<slug> side-by-side comparison (up to 3)
//   #/methods                   sources and methods

import { COUNTRIES, REGIONS } from './data.js';
import { compare, countriesTable, countryDetail, home, methods, missing, rankings } from './views.js';

const app = document.getElementById('app');

function readParams() {
  const hash = location.hash || '#/';
  const [pathPart, queryPart] = hash.slice(2).split('?');
  return { path: pathPart || '', params: new URLSearchParams(queryPart || '') };
}

function route() {
  window.__shotReady = false;
  const { path, params } = readParams();
  const parts = path.split('/').filter(Boolean);
  let html;
  let title = 'NationScope — National statistics, clearly presented';

  if (parts.length === 0) {
    html = home();
    title = 'NationScope — National statistics, clearly presented';
  } else if (parts[0] === 'countries') {
    const q = (params.get('q') || '').trim();
    const region = params.get('region') || 'All regions';
    const rows = COUNTRIES.filter((c) => {
      const inRegion = region === 'All regions' || c.region === region;
      const inSearch = !q || c.name.toLowerCase().includes(q.toLowerCase());
      return inRegion && inSearch;
    });
    html = countriesTable(rows, {
      q,
      region: REGIONS.includes(region) ? region : 'All regions',
      sort: params.get('sort') || 'pop',
      dir: params.get('dir') || 'desc',
    });
    title = 'All countries | NationScope';
  } else if (parts[0] === 'country' && parts[1]) {
    const found = COUNTRIES.find((c) => c.slug === parts[1]);
    html = found ? countryDetail(found) : missing();
    title = found ? `${found.name} — statistics | NationScope` : 'Not found | NationScope';
  } else if (parts[0] === 'rankings') {
    html = rankings(params.get('metric') || 'pop');
    title = 'Rankings | NationScope';
  } else if (parts[0] === 'compare') {
    const picks = [params.get('c'), params.get('d'), params.get('e')].filter(Boolean);
    html = compare(picks);
    title = 'Compare countries | NationScope';
  } else if (parts[0] === 'methods') {
    html = methods();
    title = 'Sources & methods | NationScope';
  } else {
    html = missing();
    title = 'Not found | NationScope';
  }

  document.title = title;
  app.innerHTML = html;
  markNav(parts[0] || '');
  wireControls();
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

function markNav(section) {
  document.querySelectorAll('.topnav a').forEach((a) => {
    a.classList.toggle('active', a.dataset.section === section);
  });
}

function setParams(pairs) {
  const { path, params } = readParams();
  for (const [key, value] of pairs) {
    if (value) params.set(key, value);
    else params.delete(key);
  }
  const query = params.toString();
  location.hash = `#/${path}${query ? `?${query}` : ''}`;
}

function setParam(key, value) {
  setParams([[key, value]]);
}

// Controls are re-wired after every render, because the page is rebuilt.
function wireControls() {
  const search = document.getElementById('country-search');
  if (search) {
    search.addEventListener('input', () => {
      const { params } = readParams();
      if (search.value) params.set('q', search.value);
      else params.delete('q');
      const query = params.toString();
      history.replaceState(null, '', `#/countries${query ? `?${query}` : ''}`);
      route();
      const again = document.getElementById('country-search');
      if (again) {
        again.focus();
        again.setSelectionRange(again.value.length, again.value.length);
      }
    });
  }
  document.querySelectorAll('.region-btn').forEach((btn) => {
    btn.addEventListener('click', () => setParam('region', btn.dataset.region === 'All regions' ? '' : btn.dataset.region));
  });
  document.querySelectorAll('.sort-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      setParams([['sort', btn.dataset.sort], ['dir', btn.dataset.dir]]);
    });
  });
  document.querySelectorAll('select[data-pick]').forEach((sel) => {
    sel.addEventListener('change', () => {
      const keys = ['c', 'd', 'e'];
      const { params } = readParams();
      document.querySelectorAll('select[data-pick]').forEach((s) => {
        const key = keys[Number(s.dataset.pick)];
        if (s.value) params.set(key, s.value);
        else params.delete(key);
      });
      const query = params.toString();
      location.hash = `#/compare${query ? `?${query}` : ''}`;
    });
  });
}

window.addEventListener('hashchange', route);
route();
