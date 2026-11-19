// Progress store: earned ticks, per-trophy counters and the spoiler setting,
// persisted to localStorage and exportable/importable as one JSON file.

const STORAGE_KEY = 'leonida-ledger-progress-v1';

function emptyState() {
  return { earned: {}, counts: {}, spoilers: true };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw);
    return {
      earned: parsed.earned && typeof parsed.earned === 'object' ? parsed.earned : {},
      counts: parsed.counts && typeof parsed.counts === 'object' ? parsed.counts : {},
      spoilers: parsed.spoilers !== false,
    };
  } catch {
    return emptyState();
  }
}

export function createStore() {
  let state = loadState();
  const listeners = new Set();

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function emit() {
    persist();
    for (const fn of listeners) fn(state);
  }

  return {
    get state() {
      return state;
    },
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    isEarned(trophy) {
      return state.earned[trophy.name] === true;
    },
    countOf(trophy) {
      return state.counts[trophy.name] ?? 0;
    },
    setEarned(trophy, on) {
      if (on) state.earned[trophy.name] = true;
      else delete state.earned[trophy.name];
      emit();
    },
    setCount(trophy, value) {
      const clamped = Math.max(0, Math.min(value, trophy.count ?? value));
      if (clamped > 0) state.counts[trophy.name] = clamped;
      else delete state.counts[trophy.name];
      // Reaching a tracked target earns the trophy on its own.
      if (trophy.count && clamped >= trophy.count) state.earned[trophy.name] = true;
      emit();
    },
    setSpoilers(on) {
      state.spoilers = on === true;
      emit();
    },
    replace(next) {
      state = {
        earned: next.earned && typeof next.earned === 'object' ? next.earned : {},
        counts: next.counts && typeof next.counts === 'object' ? next.counts : {},
        spoilers: next.spoilers !== false,
      };
      emit();
    },
    reset() {
      state = emptyState();
      emit();
    },
  };
}

export function exportProgress(state) {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'leonida-ledger-progress.json';
  a.click();
  URL.revokeObjectURL(url);
}

export async function importProgress(file) {
  const text = await file.text();
  const parsed = JSON.parse(text);
  if (!parsed || typeof parsed !== 'object') throw new Error('not a progress file');
  return parsed;
}
