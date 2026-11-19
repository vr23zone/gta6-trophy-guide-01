// main.js — boot and wiring: load the data, restore the saved state, and keep the header, the checklist,
// the detail pane and the three other views in step with every click. Views are tabs; only the checklist
// re-renders on state changes, the roadmap and missables re-render when opened.

import { loadTrophies, gradeCounts, GRADE_LABEL, GRADE_ORDER } from './data.js';
import { loadState, saveState, setEarned, setCounter, counterOf, isEarned, exportState, importState } from './store.js';
import { makeFilterState, trophyMatches } from './filters.js';
import { trophyRowHtml, detailHtml, roadmapHtml, missablesHtml, saveSourcesHtml } from './render.js';

const state = loadState();
const filter = makeFilterState();
let trophies = [];
let selectedId = 1;

const $ = (selector) => document.querySelector(selector);

function renderHeader() {
  const earned = trophies.filter((t) => isEarned(state, t.id)).length;
  $('#earned-count').textContent = String(earned);
  $('#progress-fill').style.width = `${(earned / trophies.length) * 100}%`;
  const left = trophies.length - earned;
  $('#progress-note').textContent = left === 0
    ? 'Every trophy earned — Leonida Legend.'
    : `${left} ${left === 1 ? 'trophy stands' : 'trophies stand'} between you and the platinum.`;
  const counts = gradeCounts(trophies);
  $('#grade-counts').textContent = GRADE_ORDER
    .map((grade) => `${GRADE_LABEL[grade]} ${trophies.filter((t) => t.grade === grade && isEarned(state, t.id)).length}/${counts[grade]}`)
    .join(' · ');
}

function renderChecklist() {
  const visible = trophies.filter((t) => trophyMatches(t, filter, state));
  $('#trophy-list').innerHTML = visible.length
    ? visible.map((t) => trophyRowHtml(t, state, selectedId, filter)).join('')
    : '<p class="empty-note">No trophies match. The official list has no online trophies — every one of the 55 is earned in single player.</p>';
  $('#filter-count').textContent = `Showing ${visible.length} of ${trophies.length}`;
  const selected = trophies.find((t) => t.id === selectedId) ?? visible[0];
  $('#detail').innerHTML = detailHtml(selected, state, filter);
}

function renderAll() {
  renderHeader();
  renderChecklist();
}

function showView(name) {
  document.querySelectorAll('.tab').forEach((tab) => tab.classList.toggle('active', tab.dataset.view === name));
  document.querySelectorAll('.view').forEach((view) => { view.hidden = view.id !== `view-${name}`; });
  if (name === 'roadmap') $('#roadmap').innerHTML = roadmapHtml(trophies, state);
  if (name === 'missables') $('#missables').innerHTML = missablesHtml(trophies, state);
}

function wireEvents() {
  document.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', () => showView(tab.dataset.view));
  });

  $('#spoiler-mode').checked = state.spoilers;
  $('#spoiler-mode').addEventListener('change', (event) => {
    state.spoilers = event.target.checked;
    saveState(state);
    renderChecklist();
  });

  $('#filter-search').addEventListener('input', (event) => {
    filter.search = event.target.value;
    renderChecklist();
  });
  document.querySelectorAll('.kind').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.kind').forEach((b) => b.classList.toggle('active', b === button));
      filter.kind = button.dataset.kind;
      renderChecklist();
    });
  });
  $('#filter-grade').addEventListener('change', (event) => { filter.grade = event.target.value; renderChecklist(); });
  $('#filter-state').addEventListener('change', (event) => { filter.state = event.target.value; renderChecklist(); });

  document.querySelector('main').addEventListener('click', (event) => {
    const earnBox = event.target.closest('[data-earn]');
    if (earnBox && event.target.type === 'checkbox') {
      setEarned(state, Number(earnBox.dataset.earn), earnBox.checked);
      renderAll();
      return;
    }
    const counterButton = event.target.closest('[data-counter]');
    if (counterButton) {
      const trophy = trophies.find((t) => t.id === Number(counterButton.dataset.id));
      setCounter(state, trophy, counterOf(state, trophy) + Number(counterButton.dataset.counter));
      renderAll();
      return;
    }
    const row = event.target.closest('[data-select]');
    if (row && event.target.type !== 'checkbox') {
      selectedId = Number(row.dataset.select);
      renderChecklist();
    }
  });

  document.querySelector('main').addEventListener('change', (event) => {
    const counterInput = event.target.closest('[data-counter-input]');
    if (counterInput) {
      const trophy = trophies.find((t) => t.id === Number(counterInput.dataset.counterInput));
      setCounter(state, trophy, Number(counterInput.value) || 0);
      renderAll();
    }
    if (event.target.id === 'import-file') {
      const file = event.target.files[0];
      if (!file) return;
      file.text().then((text) => {
        try {
          Object.assign(state, importState(text));
          saveState(state);
          $('#save-status').textContent = 'Progress imported.';
          renderAll();
        } catch {
          $('#save-status').textContent = 'That file is not a progress export.';
        }
      });
    }
  });

  $('#save-sources').innerHTML = saveSourcesHtml();
  $('#export-btn').addEventListener('click', () => {
    const blob = new Blob([exportState(state)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'gta-vi-trophy-progress.json';
    link.click();
    URL.revokeObjectURL(link.href);
    $('#save-status').textContent = 'Progress exported — keep the file with your saves.';
  });
  $('#reset-btn').addEventListener('click', () => {
    state.earned = {};
    state.counters = {};
    saveState(state);
    $('#save-status').textContent = 'Progress reset.';
    renderAll();
  });
}

async function boot() {
  trophies = await loadTrophies();
  wireEvents();
  renderAll();
}

boot();
