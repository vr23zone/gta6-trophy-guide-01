// render.js — every view's HTML, built from the trophy data and the saved state. Text the player reads
// as fact is either the official PlayStation text (name, description, grade, tracked target) or this
// guide's own words; each detail pane names its sources under the guide.

import { GRADE_LABEL, KIND_LABEL } from './data.js';
import { isEarned, counterOf } from './store.js';
import { isSpoilerHidden } from './filters.js';
import { ROADMAP_STAGES, MISSABLE_INTRO, MISSABLE_SAFETY } from './roadmap.js';

function esc(text) {
  return String(text).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}

function flagsHtml(trophy) {
  const flags = [];
  if (trophy.missable) flags.push('<span class="flag missable">Missable risk</span>');
  if (trophy.hidden) flags.push('<span class="flag hidden-flag">Hidden on PSN</span>');
  flags.push(`<span class="flag kind-flag">${KIND_LABEL[trophy.kind] ?? trophy.kind}</span>`);
  return flags.join(' ');
}

export function trophyRowHtml(trophy, state, selectedId, filter) {
  const earned = isEarned(state, trophy.id);
  const hidden = isSpoilerHidden(trophy, filter, state);
  const name = hidden ? 'Story trophy — spoiler hidden' : esc(trophy.name);
  const desc = hidden ? 'Earn it in the story, or switch spoiler mode off, to reveal this one.' : esc(trophy.description);
  const target = trophy.target != null
    ? `<span class="target-progress">${counterOf(state, trophy).toLocaleString('en-US')} / ${trophy.target.toLocaleString('en-US')}</span>`
    : '';
  return `
  <button type="button" class="trophy-row${earned ? ' earned' : ''}${trophy.id === selectedId ? ' selected' : ''}" data-select="${trophy.id}">
    <input type="checkbox" data-earn="${trophy.id}" ${earned ? 'checked' : ''} aria-label="Mark ${esc(trophy.name)} earned">
    <span class="swatch ${trophy.grade}"></span>
    <span class="row-main">
      <span class="row-name ${hidden ? 'blurred' : ''}">${name}</span>
      <span class="row-desc ${hidden ? 'blurred' : ''}">${desc}</span>
    </span>
    <span class="row-meta">${target}${GRADE_LABEL[trophy.grade]}</span>
  </button>`;
}

export function detailHtml(trophy, state, filter) {
  if (!trophy) {
    return '<p class="empty-note">Pick a trophy on the left and its guide opens here: what to do, where and how, when it can be missed, and the sources each fact comes from.</p>';
  }
  const earned = isEarned(state, trophy.id);
  const hidden = isSpoilerHidden(trophy, filter, state);
  const stage = ROADMAP_STAGES.find((s) => s.trophyIds.includes(trophy.id));
  const counter = trophy.target != null ? `
    <h3>Progress — PlayStation tracks ${trophy.target.toLocaleString('en-US')}</h3>
    <div class="counter-box">
      <button type="button" data-counter="-1" data-id="${trophy.id}">−1</button>
      <input type="number" min="0" max="${trophy.target}" value="${counterOf(state, trophy)}" data-counter-input="${trophy.id}" aria-label="Progress for ${esc(trophy.name)}">
      <button type="button" data-counter="1" data-id="${trophy.id}">+1</button>
      <span>of ${trophy.target.toLocaleString('en-US')}</span>
    </div>` : '';
  const missable = trophy.missable ? `
    <h3>Missable risk</h3>
    <p class="missable-note">${esc(trophy.missableNote ?? '')}</p>` : '';
  const body = hidden ? `
    <h2 class="blurred">${esc(trophy.name)}</h2>
    <p class="official-desc blurred">${esc(trophy.description)}</p>
    <p>Spoiler mode is on and this story trophy is not earned yet, so its name, description and guide stay
    hidden. Earn it in the story and it reveals itself — or switch spoiler mode off in the header.</p>` : `
    <h2>${esc(trophy.name)}</h2>
    <div class="detail-grade"><span class="swatch ${trophy.grade}"></span><strong>${GRADE_LABEL[trophy.grade]}</strong> ${flagsHtml(trophy)}</div>
    <p class="official-desc">&ldquo;${esc(trophy.description)}&rdquo; — official PlayStation description</p>
    <label class="detail-check"><input type="checkbox" data-earn="${trophy.id}" ${earned ? 'checked' : ''}> Earned</label>
    ${counter}
    <h3>Guide</h3>
    <p>${esc(trophy.guide)}</p>
    ${missable}
    ${stage ? `<p class="stage-line">Roadmap: stage ${stage.n} — ${esc(stage.title)}</p>` : ''}
    <h3>Sources</h3>
    <p class="sources">${esc(trophy.sources)}</p>`;
  return body;
}

export function roadmapHtml(trophies, state) {
  const cards = ROADMAP_STAGES.map((stage) => {
    const done = stage.trophyIds.filter((id) => isEarned(state, id)).length;
    const names = stage.trophyIds
      .map((id) => trophies.find((t) => t.id === id))
      .filter(Boolean)
      .map((t) => `<li>${esc(t.name)} <span class="stage-progress">(${GRADE_LABEL[t.grade]}${t.target != null ? `, tracks ${t.target.toLocaleString('en-US')}` : ''})</span></li>`)
      .join('');
    const advice = stage.advice.map((line) => `<p>${esc(line)}</p>`).join('');
    return `
    <article class="stage-card">
      <p class="stage-hours">Stage ${stage.n} &middot; ${esc(stage.hours)} &middot; ${done} of ${stage.trophyIds.length} earned</p>
      <h2>${esc(stage.title)}</h2>
      ${advice}
      <ul>${names}</ul>
    </article>`;
  }).join('');
  return `
    <p class="lede"><strong>The order matters more than the speed.</strong> The story first (it is the only part
    with an order, and it unlocks the map), strangers second, skills and collectibles in the open world after,
    money once the income exists, and the 100% push last. Six stages, roughly 120–170 hours in total —
    estimates, for a game a day old.</p>
    ${cards}`;
}

export function missablesHtml(trophies, state) {
  const flagged = trophies.filter((t) => t.missable);
  const cards = flagged.map((t) => `
    <article class="missable-card">
      <h2>${esc(t.name)} <span class="flag missable">Missable risk</span></h2>
      <p class="official-desc">&ldquo;${esc(t.description)}&rdquo;</p>
      <p>${esc(t.missableNote ?? '')}</p>
      <p class="stage-progress">${isEarned(state, t.id) ? 'Earned — safe.' : 'Not earned yet.'} Guide: ${esc(t.guide)}</p>
    </article>`).join('');
  const safety = MISSABLE_SAFETY.map((line) => `<li>${esc(line)}</li>`).join('');
  return `
    <p class="lede">${esc(MISSABLE_INTRO)}</p>
    ${cards}
    <article class="missable-card">
      <h2>The three-save rule</h2>
      <ul>${safety}</ul>
    </article>`;
}

export function saveSourcesHtml() {
  return `
  <article class="save-card">
    <h2>Your progress</h2>
    <p>Progress is saved in this browser (localStorage) as you tick trophies and counters — no account, no
    network. Export it to a file to move it to another browser or keep a backup; import reads that file back.</p>
    <div class="save-actions">
      <button type="button" id="export-btn" class="primary">Export progress (.json)</button>
      <label class="save-actions-label">Import progress <input type="file" id="import-file" accept="application/json"></label>
      <button type="button" id="reset-btn">Reset everything</button>
    </div>
    <p id="save-status" class="save-status"></p>
  </article>
  <article class="save-card">
    <h2>Sources</h2>
    <p>Every fact in this guide traces to one of these. The guides themselves are our own words, written for
    this entry; a source is cited, never copied.</p>
    <ul>
      <li><strong>The official trophy list</strong> — names, descriptions and grades as PlayStation publishes
      them, read on Exophase's Grand Theft Auto VI (PSN) trophy page:
      exophase.com/game/grand-theft-auto-vi-psn/trophies/</li>
      <li><strong>Progress targets</strong> — the counts PlayStation tracks (0/250 stunts, 0/42 Shooting Range
      challenges, 0/500 choices, and the rest), read on PSNProfiles' Grand Theft Auto VI trophy list:
      psnprofiles.com/trophies/43531-grand-theft-auto-vi</li>
      <li><strong>The roadmap, missable flags and per-trophy advice</strong> — our own, reasoned from the
      official descriptions above (which missions, which chapters, which counts). Where a description does
      not pin a detail down, the guide says so instead of inventing one.</li>
    </ul>
    <p>The list this guide is built on: 55 trophies — 1 platinum, 2 gold, 6 silver, 46 bronze — 28 of them
    hidden on PlayStation until earned, and no online trophies: every trophy can be earned in the
    single-player game, which is why the Online filter finds none.</p>
  </article>`;
}
