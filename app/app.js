// Leonida Platinum Atlas — guide and tracker for the 55 GTA VI trophies.
// Everything runs from this file and app/data/trophies.json: no network, no
// build step. Progress (ticks and counters) lives in localStorage only.

const STORAGE_KEY = 'leonida-platinum-atlas-v1';

const KIND_LABELS = {
  platinum: 'Platinum',
  story: 'Story',
  side: 'Side strands',
  collectibles: 'Collectibles',
  activities: 'Activities',
};

const CHIP_KINDS = ['all', 'story', 'side', 'collectibles', 'activities', 'missable'];

const data = await (await fetch('data/trophies.json')).json();
const trophies = data.trophies;
const sourcesById = new Map(data.sources.map((s) => [s.id, s]));
const stagesByNumber = new Map(data.roadmap.map((s) => [s.stage, s]));
const trophyById = new Map(trophies.map((t) => [t.id, t]));

const state = loadState();
const ui = { view: 'guide', kind: 'all', grade: 'all', status: 'all', query: '', selected: 17 };

function loadState() {
  const fresh = { ticks: {}, counts: {}, spoilers: true };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fresh;
    const parsed = JSON.parse(raw);
    return {
      ticks: parsed.ticks ?? {},
      counts: parsed.counts ?? {},
      spoilers: parsed.spoilers !== false,
    };
  } catch {
    return fresh;
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function countOf(trophy) {
  return state.counts[trophy.id] ?? 0;
}

function isEarned(trophy) {
  if (state.ticks[trophy.id]) return true;
  return Boolean(trophy.target) && countOf(trophy) >= trophy.target;
}

function earnedCount() {
  return trophies.filter(isEarned).length;
}

function isSpoilered(trophy) {
  return state.spoilers && trophy.kind === 'story' && !isEarned(trophy);
}

function formatNumber(n) {
  return n.toLocaleString('en-US');
}

function formatCount(trophy, n) {
  return (trophy.unit === '$' ? '$' : '') + formatNumber(n);
}

function h(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

/* Scoreboard ------------------------------------------------------------ */

const earnedCountEl = document.getElementById('earned-count');
const meterEl = document.getElementById('meter');
const meterFillEl = document.getElementById('meter-fill');
const talliesEl = document.getElementById('grade-tallies');
const toPlatinumEl = document.getElementById('to-platinum');

function renderScoreboard() {
  const earned = earnedCount();
  earnedCountEl.textContent = String(earned);
  meterEl.setAttribute('aria-valuenow', String(earned));
  meterFillEl.style.width = `${(earned / trophies.length) * 100}%`;
  talliesEl.replaceChildren();
  for (const grade of ['platinum', 'gold', 'silver', 'bronze']) {
    const total = trophies.filter((t) => t.grade === grade).length;
    const got = trophies.filter((t) => t.grade === grade && isEarned(t)).length;
    const dot = h('span', `dot ${grade}`);
    talliesEl.append(dot, document.createTextNode(`${got}/${total} ${grade}`));
  }
  const left = trophies.length - earned;
  toPlatinumEl.textContent = earned === trophies.length
    ? 'Platinum earned — you are a Leonida Legend.'
    : `${left} ${left === 1 ? 'trophy' : 'trophies'} to the platinum · ${Math.round((earned / trophies.length) * 100)}% there`;
}

/* Filters --------------------------------------------------------------- */

const chipsEl = document.getElementById('kind-chips');
const searchEl = document.getElementById('search');
const gradeEl = document.getElementById('grade-filter');
const statusEl = document.getElementById('status-filter');
const spoilerEl = document.getElementById('spoiler-toggle');

function chipCount(kind) {
  if (kind === 'all') return trophies.length;
  if (kind === 'missable') return trophies.filter((t) => t.missable).length;
  return trophies.filter((t) => t.kind === kind).length;
}

function renderChips() {
  chipsEl.replaceChildren();
  for (const kind of CHIP_KINDS) {
    const label = kind === 'all' ? 'All' : kind === 'missable' ? 'Missable' : KIND_LABELS[kind];
    const chip = h('button', `chip${ui.kind === kind ? ' is-active' : ''}`);
    chip.type = 'button';
    chip.append(document.createTextNode(`${label} `), h('span', 'n', String(chipCount(kind))));
    chip.addEventListener('click', () => {
      ui.kind = kind;
      renderGuide();
    });
    chipsEl.append(chip);
  }
}

function matchesFilters(trophy) {
  if (ui.kind === 'missable' && !trophy.missable) return false;
  if (ui.kind !== 'all' && ui.kind !== 'missable' && trophy.kind !== ui.kind) return false;
  if (ui.grade !== 'all' && trophy.grade !== ui.grade) return false;
  if (ui.status === 'earned' && !isEarned(trophy)) return false;
  if (ui.status === 'unearned' && isEarned(trophy)) return false;
  if (ui.query) {
    const haystack = `${trophy.name} ${trophy.description} ${trophy.guide}`.toLowerCase();
    if (!haystack.includes(ui.query.toLowerCase())) return false;
  }
  return true;
}

/* Trophy list ----------------------------------------------------------- */

const listEl = document.getElementById('trophy-list');
const summaryEl = document.getElementById('list-summary');

function buildRow(trophy) {
  const row = h('div', `trophy-row${isEarned(trophy) ? ' is-earned' : ''}${ui.selected === trophy.id ? ' is-selected' : ''}`);
  row.setAttribute('role', 'button');
  row.tabIndex = 0;

  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = isEarned(trophy);
  box.setAttribute('aria-label', `Mark ${trophy.name} earned`);
  box.addEventListener('click', (event) => event.stopPropagation());
  box.addEventListener('change', () => {
    state.ticks[trophy.id] = box.checked;
    if (!box.checked) delete state.ticks[trophy.id];
    saveState();
    renderAll();
  });

  const medal = h('span', `medal ${trophy.grade}`);

  const main = h('span', 'row-main');
  const name = h('span', 'row-name');
  const desc = h('span', 'row-desc');
  if (isSpoilered(trophy)) {
    name.append(h('span', 'spoilered', trophy.name));
    desc.append(h('span', 'spoilered', trophy.description));
    main.append(name, desc, h('span', 'spoiler-note', 'Story spoiler hidden until earned'));
  } else {
    name.textContent = trophy.name;
    desc.textContent = trophy.description;
    main.append(name, desc);
  }

  const tags = h('span', 'row-tags');
  tags.append(h('span', 'tag grade', trophy.grade), h('span', 'tag', KIND_LABELS[trophy.kind]));
  if (trophy.missable) tags.append(h('span', 'tag missable', 'Missable'));
  if (trophy.target) {
    tags.append(h('span', 'tag counter', `${formatCount(trophy, countOf(trophy))} / ${formatCount(trophy, trophy.target)}`));
  }

  row.append(box, medal, main, tags);
  const open = () => {
    ui.selected = trophy.id;
    renderGuide();
  };
  row.addEventListener('click', open);
  row.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') open();
  });
  return row;
}

function renderList() {
  // Grouped by roadmap stage, official list order inside each stage, so the
  // stage headings run 1 to 5 down the page instead of repeating.
  const visible = trophies.filter(matchesFilters).sort((a, b) => a.stage - b.stage || a.id - b.id);
  summaryEl.textContent = `Showing ${visible.length} of ${trophies.length} trophies · ${earnedCount()} earned overall`;
  listEl.replaceChildren();
  if (visible.length === 0) {
    listEl.append(h('p', 'empty', 'No trophies match these filters. Loosen a filter or clear the search.'));
    return;
  }
  let lastStage = null;
  for (const trophy of visible) {
    if (trophy.stage !== lastStage) {
      lastStage = trophy.stage;
      const stage = stagesByNumber.get(trophy.stage);
      const inStage = trophies.filter((t) => t.stage === trophy.stage);
      const done = inStage.filter(isEarned).length;
      const head = h('p', 'stage-head');
      head.append(
        document.createTextNode(`Stage ${stage.stage} · ${stage.title} `),
        h('span', 'stage-progress', `— ${done}/${inStage.length} earned`),
      );
      listEl.append(head);
    }
    listEl.append(buildRow(trophy));
  }
}

/* Detail pane ----------------------------------------------------------- */

const detailEl = document.getElementById('trophy-detail');

function buildCounterBox(trophy) {
  const box = h('div', 'counter-box');
  const line = h('div', 'counter-line');
  const label = h('strong', '', `Progress: ${trophy.targetLabel ?? 'count'}`);
  const input = document.createElement('input');
  input.type = 'number';
  input.min = '0';
  input.max = String(trophy.target);
  input.step = trophy.unit === '$' ? '500' : '1';
  input.value = String(countOf(trophy));
  input.setAttribute('aria-label', `Your count for ${trophy.name}`);
  const of = h('span', '', `of ${formatCount(trophy, trophy.target)}`);
  const minus = h('button', '', '−');
  minus.type = 'button';
  const plus = h('button', '', '+');
  plus.type = 'button';
  const apply = (n) => {
    const clamped = Math.max(0, Math.min(trophy.target, Math.floor(Number(n) || 0)));
    state.counts[trophy.id] = clamped;
    saveState();
    renderAll();
  };
  minus.addEventListener('click', () => apply(countOf(trophy) - Number(input.step)));
  plus.addEventListener('click', () => apply(countOf(trophy) + Number(input.step)));
  input.addEventListener('change', () => apply(input.value));
  line.append(label, minus, input, plus, of);
  box.append(line);
  box.append(h('p', 'counter-note', isEarned(trophy)
    ? 'Target reached — this trophy counts as earned.'
    : 'Update the count as you play; reaching the target marks the trophy earned.'));
  return box;
}

function renderDetail() {
  const trophy = trophyById.get(ui.selected) ?? trophies[0];
  detailEl.replaceChildren();

  const head = h('div', 'detail-head');
  head.append(h('span', `medal ${trophy.grade}`), h('span', 'tag grade', trophy.grade), h('span', 'tag', KIND_LABELS[trophy.kind]));
  detailEl.append(head);

  if (isSpoilered(trophy)) {
    detailEl.append(h('h2', '', 'Hidden story trophy'));
    detailEl.append(h('p', 'official', 'Name and description stay hidden while the spoiler setting is on, until the trophy is earned.'));
  } else {
    detailEl.append(h('h2', '', trophy.name));
    detailEl.append(h('p', 'official', `“${trophy.description}”`));
  }

  const toggleLabel = h('label', 'earned-toggle');
  const toggle = document.createElement('input');
  toggle.type = 'checkbox';
  toggle.checked = isEarned(trophy);
  toggle.addEventListener('change', () => {
    state.ticks[trophy.id] = toggle.checked;
    if (!toggle.checked) delete state.ticks[trophy.id];
    saveState();
    renderAll();
  });
  toggleLabel.append(toggle, document.createTextNode(' I have earned this trophy'));
  detailEl.append(toggleLabel);

  if (trophy.target) detailEl.append(buildCounterBox(trophy));

  if (trophy.missable) {
    const warn = h('div', 'missable-box');
    const strong = h('strong', '', 'Potentially missable. ');
    warn.append(strong, document.createTextNode(trophy.missableNote ?? ''));
    detailEl.append(warn);
  }

  detailEl.append(h('h3', '', 'Guide'));
  detailEl.append(h('p', 'guide-text', trophy.guide));

  const stage = stagesByNumber.get(trophy.stage);
  detailEl.append(h('p', 'meta-line', `Roadmap: Stage ${stage.stage} — ${stage.title} (${stage.hours}).`));

  detailEl.append(h('h3', '', 'Sources'));
  for (const sourceId of trophy.sources ?? []) {
    const source = sourcesById.get(sourceId);
    if (!source) continue;
    const line = h('p', 'source-line');
    if (source.url) {
      const link = h('a', '', source.name);
      link.href = source.url;
      link.target = '_blank';
      link.rel = 'noreferrer';
      line.append(link);
    } else {
      line.append(document.createTextNode(source.name));
    }
    detailEl.append(line);
  }
}

function renderGuide() {
  renderChips();
  renderList();
  renderDetail();
}

/* Roadmap --------------------------------------------------------------- */

const roadmapEl = document.getElementById('roadmap-stages');

function renderRoadmap() {
  roadmapEl.replaceChildren();
  for (const stage of data.roadmap) {
    const inStage = trophies.filter((t) => t.stage === stage.stage);
    const done = inStage.filter(isEarned).length;
    const card = h('div', 'stage-card');
    card.append(h('h3', '', `Stage ${stage.stage} — ${stage.title}`));
    card.append(h('p', 'hours', `${stage.hours} · ${done}/${inStage.length} earned`));
    const meter = h('div', 'meter stage-meter');
    const fill = h('div', '');
    fill.style.height = '100%';
    fill.style.width = `${inStage.length ? (done / inStage.length) * 100 : 0}%`;
    fill.style.background = 'linear-gradient(90deg, var(--accent), var(--accent-soft))';
    meter.append(fill);
    card.append(meter);
    card.append(h('p', '', stage.text));
    const chips = h('div', 'stage-trophies');
    for (const trophy of inStage) {
      const mini = h('button', `mini${isEarned(trophy) ? ' done' : ''}`, isSpoilered(trophy) ? 'Hidden story trophy' : trophy.name);
      mini.type = 'button';
      mini.addEventListener('click', () => {
        ui.selected = trophy.id;
        switchView('guide');
        renderAll();
      });
      chips.append(mini);
    }
    card.append(chips);
    roadmapEl.append(card);
  }
}

/* Missables ------------------------------------------------------------- */

const missablesEl = document.getElementById('missable-cards');

function renderMissables() {
  missablesEl.replaceChildren();
  for (const trophy of trophies.filter((t) => t.missable)) {
    const card = h('div', 'missable-card');
    card.append(h('h3', '', `${trophy.name} — ${trophy.grade}`));
    card.append(h('p', 'official', `“${trophy.description}”`));
    card.append(h('p', '', trophy.missableNote ?? ''));
    card.append(h('p', '', trophy.guide));
    missablesEl.append(card);
  }
  const safe = h('div', 'panel');
  safe.append(h('h3', '', 'Everything else is safe'));
  safe.append(h('p', '', 'No other trophy is reported missable. Push Square lists no known missables at all, and PowerPyx flags only the one above — as a “potentially”. Story, strand and activity trophies all stay available or land automatically, so the endgame mop-up in Stage 5 can be done at your own pace.'));
  missablesEl.append(safe);
}

/* Sources --------------------------------------------------------------- */

function renderSources() {
  document.getElementById('about-text').textContent = data.about;
  const list = document.getElementById('source-list');
  list.replaceChildren();
  for (const source of data.sources) {
    const item = h('div', 'source-item');
    const head = h('p', '');
    if (source.url) {
      const link = h('a', '', source.name);
      link.href = source.url;
      link.target = '_blank';
      link.rel = 'noreferrer';
      head.append(link);
    } else {
      head.append(h('strong', '', source.name));
    }
    item.append(head, h('p', '', source.note));
    list.append(item);
  }
}

/* Views, export, import --------------------------------------------------- */

const tabs = [...document.querySelectorAll('.tab')];
const views = {
  guide: document.getElementById('view-guide'),
  roadmap: document.getElementById('view-roadmap'),
  missables: document.getElementById('view-missables'),
  sources: document.getElementById('view-sources'),
};

function switchView(name) {
  ui.view = name;
  for (const tab of tabs) tab.classList.toggle('is-active', tab.dataset.view === name);
  for (const [key, section] of Object.entries(views)) section.hidden = key !== name;
}
for (const tab of tabs) tab.addEventListener('click', () => switchView(tab.dataset.view));

document.getElementById('export-btn').addEventListener('click', () => {
  const payload = JSON.stringify({ app: 'leonida-platinum-atlas', version: 1, ticks: state.ticks, counts: state.counts }, null, 2);
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([payload], { type: 'application/json' }));
  link.download = 'leonida-platinum-atlas-progress.json';
  link.click();
  URL.revokeObjectURL(link.href);
});

document.getElementById('import-file').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    const parsed = JSON.parse(await file.text());
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      state.ticks = parsed.ticks ?? {};
      state.counts = parsed.counts ?? {};
    } else if (Array.isArray(parsed)) {
      // Older or foreign format: a list of earned trophy names.
      state.ticks = {};
      for (const trophy of trophies) if (parsed.includes(trophy.name)) state.ticks[trophy.id] = true;
    }
    saveState();
    renderAll();
  } catch {
    summaryEl.textContent = 'That file could not be read as a progress export.';
  }
  event.target.value = '';
});

document.getElementById('reset-btn').addEventListener('click', () => {
  if (!window.confirm('Clear every tick and counter in this tracker?')) return;
  state.ticks = {};
  state.counts = {};
  saveState();
  renderAll();
});

searchEl.addEventListener('input', () => {
  ui.query = searchEl.value;
  renderGuide();
});
gradeEl.addEventListener('change', () => {
  ui.grade = gradeEl.value;
  renderGuide();
});
statusEl.addEventListener('change', () => {
  ui.status = statusEl.value;
  renderGuide();
});
spoilerEl.checked = state.spoilers;
spoilerEl.addEventListener('change', () => {
  state.spoilers = spoilerEl.checked;
  saveState();
  renderAll();
});

document.addEventListener('keydown', (event) => {
  if (event.key === '/' && !/input|textarea|select/i.test(document.activeElement?.tagName ?? '')) {
    event.preventDefault();
    switchView('guide');
    searchEl.focus();
  }
});

function renderAll() {
  renderScoreboard();
  renderGuide();
  renderRoadmap();
  renderMissables();
  renderSources();
}

renderAll();
