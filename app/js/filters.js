// filters.js — the checklist's filter state and the one matching rule every view shares.
// Kinds follow the bounty brief: story, missable, collectibles, activities, and online (the official
// GTA VI list has no online trophies; the filter says so instead of hiding the button).

import { isEarned } from './store.js';

export function makeFilterState() {
  return { search: '', kind: 'all', grade: 'all', state: 'all' };
}

export function trophyMatches(trophy, filter, state) {
  if (filter.grade !== 'all' && trophy.grade !== filter.grade) return false;
  if (filter.kind === 'missable' && !trophy.missable) return false;
  if (filter.kind !== 'all' && filter.kind !== 'missable' && trophy.kind !== filter.kind) return false;
  if (filter.state === 'earned' && !isEarned(state, trophy.id)) return false;
  if (filter.state === 'unearned' && isEarned(state, trophy.id)) return false;
  if (filter.search) {
    const haystack = `${trophy.name} ${trophy.description} ${trophy.guide}`.toLowerCase();
    if (!haystack.includes(filter.search.toLowerCase())) return false;
  }
  return true;
}

// Spoiler rule: with spoiler mode on, a story trophy the player has not earned yet keeps its name and
// description hidden — PlayStation hides 28 of the 55 itself, and the story set is where the spoilers live.
export function isSpoilerHidden(trophy, filter, state) {
  return state.spoilers && trophy.kind === 'story' && !isEarned(state, trophy.id);
}
