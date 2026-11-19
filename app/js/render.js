// Rendering: header score, the tracker list and detail pane, the roadmap,
// the missables page and the save summary. All DOM is built with textContent
// for trophy data, so names and guides are shown exactly as stored.

import { GRADE_ORDER, GRADE_TOTALS, KIND_LABELS, SOURCE_LINKS, earnedByGrade, formatTarget } from './data.js';
import { isMasked } from './filters.js';
import { ROADMAP_STAGES, stageProgress } from './roadmap.js';

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function swatch(grade) {
  return el('span', `swatch ${grade}`);
}

function shortSources(trophy) {
  const names = ['Exophase'];
  if (trophy.sources.some((s) => s.includes('PSNProfiles'))) names.push('PSNProfiles');
  return `Sources: ${names.join(' · ')}`;
}

export function renderHeader(trophies, store) {
  const earned = trophies.filter((t) => store.isEarned(t)).length;
  document.getElementById('earned-count').textContent = String(earned);
  document.getElementById('progress-fill').style.width = `${(earned / trophies.length) * 100}%`;
  const left = trophies.length - earned;
  document.getElementById('to-platinum').textContent =
    left === 0 ? 'Platinum earned — Vice Got a Price!' : `${left} to the platinum`;
  const tally = earnedByGrade(trophies, (t) => store.isEarned(t));
  const box = document.getElementById('grade-tally');
  box.replaceChildren();
  for (const grade of GRADE_ORDER) {
    const item = el('span', 'tally');
    item.append(swatch(grade), el('span', '', `${grade}: ${tally[grade]}/${GRADE_TOTALS[grade]}`));
    box.append(item);
  }
}

export function renderRow(trophy, store, selectedName, onSelect, onToggle) {
  const row = el('li', 'trophy-row');
  if (store.isEarned(trophy)) row.classList.add('earned');
  if (selectedName === trophy.name) row.classList.add('selected');
  const masked = isMasked(trophy, store);
  if (masked) row.classList.add('masked');

  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = store.isEarned(trophy);
  box.setAttribute('aria-label', `Mark ${trophy.name} as earned`);
  box.addEventListener('click', (e) => e.stopPropagation());
  box.addEventListener('change', () => onToggle(trophy, box.checked));
  row.append(box, swatch(trophy.grade));

  const main = el('div', 'row-main');
  const nameLine = el('div', 'row-name', masked ? 'Story trophy — hidden by the spoiler setting' : trophy.name);
  nameLine.append(el('span', 'grade-word', trophy.grade));
  main.append(nameLine);
  main.append(el('div', 'row-desc', masked ? 'Name and description hidden until earned.' : trophy.description));

  const meta = el('div', 'row-meta');
  meta.append(el('span', '', `${KIND_LABELS[trophy.kind] ?? trophy.kind} · Roadmap stage ${trophy.stage}`));
  if (trophy.count) {
    const have = store.countOf(trophy);
    meta.append(el('span', 'flag count-flag', `${formatTarget(have)} / ${formatTarget(trophy.count)} ${trophy.unit}`));
  }
  if (trophy.missable) meta.append(el('span', 'flag missable', 'MISSABLE-RISK'));
  if (trophy.hidden) meta.append(el('span', 'flag hidden-flag', 'Hidden on PSN'));
  main.append(meta);
  main.append(el('div', 'row-sources', shortSources(trophy)));
  row.append(main);

  row.addEventListener('click', () => onSelect(trophy));
  return row;
}

export function renderDetail(trophy, store, onToggle, onCount) {
  const pane = document.getElementById('detail');
  pane.replaceChildren();
  if (!trophy) {
    pane.append(el('p', 'placeholder', 'Pick a trophy from the list to read its guide — what to do, where the facts come from, and when it can be missed.'));
    return;
  }
  const masked = isMasked(trophy, store);
  pane.append(el('div', 'detail-grade', `${trophy.grade} · ${KIND_LABELS[trophy.kind] ?? trophy.kind} · roadmap stage ${trophy.stage}`));
  pane.append(el('h3', '', masked ? 'Story trophy — hidden by the spoiler setting' : trophy.name));
  pane.append(el('p', 'official', masked ? 'Its name and description stay hidden until you earn it. Turn the spoiler setting off to read them now.' : `“${trophy.description}”`));

  if (trophy.count) {
    pane.append(el('h4', '', 'Progress counter'));
    const box = el('div', 'counter-box');
    const minus = el('button', '', '−');
    minus.addEventListener('click', () => onCount(trophy, store.countOf(trophy) - 1));
    const value = el('span', 'counter-value', formatTarget(store.countOf(trophy)));
    const target = el('span', 'counter-target', `/ ${formatTarget(trophy.count)} ${trophy.unit}`);
    const plus = el('button', '', '+');
    plus.addEventListener('click', () => onCount(trophy, store.countOf(trophy) + 1));
    box.append(minus, value, target, plus);
    pane.append(box);
  }

  pane.append(el('h4', '', 'Guide — our own words'));
  pane.append(el('p', '', masked ? 'The guide is hidden with the name: it would give the moment away. Earn the trophy, or turn the spoiler setting off, to read it.' : trophy.guide));

  if (trophy.missable && trophy.missableNote) {
    pane.append(el('h4', '', 'Missable-risk'));
    pane.append(el('p', 'missable-box', trophy.missableNote));
  }

  pane.append(el('h4', '', 'Sources'));
  const list = el('ul', 'sources-list');
  for (const s of trophy.sources) list.append(el('li', '', s));
  pane.append(list);
  const links = el('p', '');
  const exo = el('a', '', 'Exophase — the official list');
  exo.href = SOURCE_LINKS.exophase;
  const psn = el('a', '', 'PSNProfiles — the official list & targets');
  psn.href = SOURCE_LINKS.psnprofiles;
  links.append(exo, document.createTextNode(' · '), psn);
  pane.append(links);

  const label = el('label', 'earn-toggle');
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = store.isEarned(trophy);
  box.addEventListener('change', () => onToggle(trophy, box.checked));
  label.append(box, document.createTextNode(' Earned'));
  pane.append(label);
}

export function renderRoadmap(trophies, store, onPick) {
  const wrap = document.getElementById('roadmap-stages');
  wrap.replaceChildren();
  for (const stage of ROADMAP_STAGES) {
    const card = el('div', 'stage-card');
    const head = el('div', 'stage-head');
    head.append(el('span', 'stage-num', String(stage.n)), el('span', 'stage-title', stage.title), el('span', 'stage-hours', stage.hours));
    card.append(head);
    card.append(el('p', 'stage-intro', stage.intro));
    const { total, done } = stageProgress(trophies, store, stage);
    const prog = el('div', 'stage-progress');
    const bar = el('div', 'progressbar');
    const fill = el('div', '');
    fill.id = '';
    fill.style.height = '100%';
    fill.style.background = 'var(--teal)';
    fill.style.width = total ? `${(done / total) * 100}%` : '0%';
    bar.append(fill);
    prog.append(el('span', '', `${done} of ${total} earned`), bar);
    card.append(prog);
    const chips = el('div', 'stage-chips');
    for (const t of trophies.filter((x) => x.stage === stage.n)) {
      const chip = el('button', 'stage-chip', t.name);
      chip.type = 'button';
      if (store.isEarned(t)) chip.classList.add('done');
      chip.addEventListener('click', () => onPick(t));
      chips.append(chip);
    }
    card.append(chips);
    wrap.append(card);
  }
}

export function renderMissables(trophies, onPick) {
  const wrap = document.getElementById('missable-cards');
  wrap.replaceChildren();
  for (const t of trophies.filter((x) => x.missable)) {
    const card = el('div', 'missable-card');
    card.append(el('h3', '', t.name));
    card.append(el('p', 'official', `Official description: “${t.description}” (${t.grade})`));
    if (t.missableNote) card.append(el('p', '', t.missableNote));
    card.append(el('p', '', t.guide));
    const btn = el('button', 'stage-chip', 'Open in the tracker');
    btn.type = 'button';
    btn.addEventListener('click', () => onPick(t));
    card.append(btn);
    wrap.append(card);
  }
}

export function renderSaveSummary(trophies, store) {
  const wrap = document.getElementById('save-summary');
  wrap.replaceChildren();
  const earned = trophies.filter((t) => store.isEarned(t)).length;
  const storyTotal = trophies.filter((t) => t.kind === 'story').length;
  const storyEarned = trophies.filter((t) => t.kind === 'story' && store.isEarned(t)).length;
  const stats = [
    [`${earned} / ${trophies.length}`, 'trophies earned'],
    [`${trophies.length - earned}`, 'to the platinum'],
    [`${storyEarned} / ${storyTotal}`, 'story trophies'],
    [`${trophies.filter((t) => t.count).length}`, 'tracked counters'],
    [store.state.spoilers ? 'On' : 'Off', 'story spoiler setting'],
  ];
  for (const [num, label] of stats) {
    const card = el('div', 'save-stat');
    card.append(el('div', 'stat-num', num), el('div', 'stat-label', label));
    wrap.append(card);
  }
}
