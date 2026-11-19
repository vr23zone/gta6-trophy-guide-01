// Leonida Ledger — boot, hash routing and toolbar wiring.
// Views: #/tracker (default), #/roadmap, #/missables, #/save.

import { KIND_FILTERS, KIND_LABELS, loadTrophies } from './data.js';
import { createStore, exportProgress, importProgress } from './store.js';
import { applyFilters } from './filters.js';
import { renderDetail, renderHeader, renderMissables, renderRoadmap, renderRow, renderSaveSummary } from './render.js';

const trophies = await loadTrophies();
const store = createStore();

const ui = { kind: 'all', grade: 'all', status: 'all', query: '' };
let selectedName = null;
let route = 'tracker';

const listEl = document.getElementById('trophy-list');
const searchEl = document.getElementById('search');
const gradeEl = document.getElementById('grade-filter');
const statusEl = document.getElementById('status-filter');
const spoilerEls = [document.getElementById('spoiler-toggle'), document.getElementById('spoiler-toggle-2')];

function selectedTrophy() {
  return trophies.find((t) => t.name === selectedName) ?? null;
}

function renderTracker() {
  const visible = applyFilters(trophies, store, ui);
  document.getElementById('result-count').textContent =
    `Showing ${visible.length} of ${trophies.length} trophies`;
  listEl.replaceChildren();
  for (const t of visible) {
    listEl.append(renderRow(t, store, selectedName, selectTrophy, (trophy, on) => store.setEarned(trophy, on)));
  }
  renderDetail(selectedTrophy(), store,
    (trophy, on) => store.setEarned(trophy, on),
    (trophy, value) => store.setCount(trophy, value));
}

function renderAll() {
  renderHeader(trophies, store);
  renderTracker();
  renderRoadmap(trophies, store, jumpToTrophy);
  renderMissables(trophies, jumpToTrophy);
  renderSaveSummary(trophies, store);
  for (const el of spoilerEls) el.checked = store.state.spoilers;
}

function selectTrophy(trophy) {
  selectedName = trophy.name;
  renderTracker();
}

function jumpToTrophy(trophy) {
  selectedName = trophy.name;
  ui.kind = 'all';
  ui.grade = 'all';
  ui.status = 'all';
  ui.query = '';
  searchEl.value = '';
  gradeEl.value = 'all';
  statusEl.value = 'all';
  markActiveChip();
  location.hash = '#/tracker';
  renderAll();
  document.getElementById('detail').scrollIntoView({ block: 'nearest' });
}

// Kind filter chips, with live counts.
const chipsWrap = document.getElementById('kind-chips');
function markActiveChip() {
  for (const chip of chipsWrap.children) chip.classList.toggle('active', chip.dataset.kind === ui.kind);
}
for (const kind of KIND_FILTERS) {
  const chip = document.createElement('button');
  chip.type = 'button';
  chip.className = 'chip';
  chip.dataset.kind = kind;
  const n = kind === 'all' ? trophies.length
    : kind === 'missable' ? trophies.filter((t) => t.missable).length
    : trophies.filter((t) => t.kind === kind).length;
  chip.textContent = kind === 'all' ? `All ` : `${KIND_LABELS[kind]} `;
  const count = document.createElement('span');
  count.className = 'chip-n';
  count.textContent = `(${n})`;
  chip.append(count);
  chip.addEventListener('click', () => {
    ui.kind = kind;
    markActiveChip();
    renderTracker();
  });
  chipsWrap.append(chip);
}
markActiveChip();

searchEl.addEventListener('input', () => { ui.query = searchEl.value; renderTracker(); });
gradeEl.addEventListener('change', () => { ui.grade = gradeEl.value; renderTracker(); });
statusEl.addEventListener('change', () => { ui.status = statusEl.value; renderTracker(); });
for (const el of spoilerEls) {
  el.addEventListener('change', () => store.setSpoilers(el.checked));
}

// Save view actions.
const saveMessage = document.getElementById('save-message');
document.getElementById('export-btn').addEventListener('click', () => {
  exportProgress(store.state);
  saveMessage.textContent = 'Progress exported — keep the file somewhere safe.';
});
document.getElementById('import-file').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    store.replace(await importProgress(file));
    saveMessage.textContent = 'Progress imported.';
  } catch {
    saveMessage.textContent = 'That file could not be read as progress — nothing was changed.';
  }
  e.target.value = '';
});
document.getElementById('reset-btn').addEventListener('click', () => {
  store.reset();
  saveMessage.textContent = 'Progress reset: every trophy is unearned again.';
});

// Hash routing between the four views.
const views = { tracker: 'view-tracker', roadmap: 'view-roadmap', missables: 'view-missables', save: 'view-save' };
function applyRoute() {
  const name = location.hash.replace('#/', '') || 'tracker';
  route = views[name] ? name : 'tracker';
  for (const [key, id] of Object.entries(views)) {
    document.getElementById(id).hidden = key !== route;
  }
  for (const a of document.querySelectorAll('.tabs a')) {
    a.classList.toggle('active', a.dataset.route === route);
  }
}
window.addEventListener('hashchange', applyRoute);

store.subscribe(renderAll);
applyRoute();
renderAll();

// Open the guide on a trophy with a counter and a citation, so the detail pane shows its best on first load.
selectedName = 'The Shootist';
renderTracker();
