// store.js — the tracker's saved state: which trophies are earned, the progress counters for the trophies
// PlayStation tracks a number for, and the spoiler setting. Everything lives in localStorage under one key;
// nothing is sent anywhere. Export writes the same shape to a JSON file, import reads it back.

const STORAGE_KEY = 'leonida-platinum-guide/v1';

export function emptyState() {
  return { earned: {}, counters: {}, spoilers: true };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw);
    return {
      earned: parsed.earned ?? {},
      counters: parsed.counters ?? {},
      spoilers: parsed.spoilers !== false,
    };
  } catch {
    return emptyState();
  }
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function isEarned(state, id) {
  return state.earned[id] === true;
}

export function setEarned(state, id, earned) {
  if (earned) state.earned[id] = true;
  else delete state.earned[id];
  saveState(state);
}

export function counterOf(state, trophy) {
  const value = state.counters[trophy.id];
  return typeof value === 'number' ? value : 0;
}

export function setCounter(state, trophy, value) {
  const clamped = Math.max(0, Math.min(value, trophy.target ?? value));
  state.counters[trophy.id] = clamped;
  // Reaching the tracked target is the trophy: keep the checklist in step with the counter.
  if (trophy.target != null) setEarned(state, trophy.id, clamped >= trophy.target);
  saveState(state);
}

export function exportState(state) {
  return JSON.stringify({ app: 'leonida-platinum-guide', version: 1, ...state }, null, 2);
}

export function importState(text) {
  const parsed = JSON.parse(text);
  if (typeof parsed !== 'object' || parsed === null) throw new Error('not a progress file');
  return {
    earned: parsed.earned ?? {},
    counters: parsed.counters ?? {},
    spoilers: parsed.spoilers !== false,
  };
}
