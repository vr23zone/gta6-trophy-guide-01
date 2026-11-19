// Filtering and the spoiler rule, kept pure so every view filters the same way.

export function isMasked(trophy, store) {
  // The spoiler setting hides a story trophy's name and description until it is earned.
  return store.state.spoilers && trophy.kind === 'story' && !store.isEarned(trophy);
}

export function matchesKind(trophy, kindFilter) {
  if (kindFilter === 'all') return true;
  if (kindFilter === 'missable') return trophy.missable === true;
  return trophy.kind === kindFilter;
}

export function applyFilters(trophies, store, ui) {
  const query = ui.query.trim().toLowerCase();
  return trophies.filter((t) => {
    if (!matchesKind(t, ui.kind)) return false;
    if (ui.grade !== 'all' && t.grade !== ui.grade) return false;
    if (ui.status === 'earned' && !store.isEarned(t)) return false;
    if (ui.status === 'open' && store.isEarned(t)) return false;
    if (query) {
      // A masked story trophy cannot be found by its hidden name; search its kind and stage instead.
      const haystack = isMasked(t, store)
        ? `story trophy stage ${t.stage} ${t.grade}`
        : `${t.name} ${t.description} ${t.guide}`.toLowerCase();
      if (!haystack.toLowerCase().includes(query)) return false;
    }
    return true;
  });
}
