// Data loading and shared constants for the Leonida Ledger.
// The trophy data lives in app/data/trophies.json (the official list plus this guide's own fields);
// everything else in the app is derived from it here.

export const GRADE_ORDER = ['platinum', 'gold', 'silver', 'bronze'];

export const GRADE_TOTALS = { platinum: 1, gold: 2, silver: 6, bronze: 46 };

export const KIND_LABELS = {
  story: 'Story',
  missable: 'Missable',
  collectibles: 'Collectibles',
  activities: 'Activities',
  online: 'Online',
  platinum: 'Platinum',
};

// The kind filter chips, in the order the toolbar shows them. "missable" and "online" are
// cross-cutting: missable filters on the missable flag, online on the kind field.
export const KIND_FILTERS = ['all', 'story', 'missable', 'collectibles', 'activities', 'online'];

export const SOURCE_LINKS = {
  exophase: 'https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/',
  psnprofiles: 'https://psnprofiles.com/trophies/43531-grand-theft-auto-vi',
};

export async function loadTrophies() {
  const response = await fetch('data/trophies.json');
  if (!response.ok) throw new Error(`trophies.json failed to load (${response.status})`);
  const doc = await response.json();
  const trophies = Array.isArray(doc) ? doc : doc.trophies;
  return trophies.slice().sort((a, b) => a.id - b.id);
}

export function formatTarget(n) {
  return n >= 10000 ? `$${n.toLocaleString('en-US')}` : n.toLocaleString('en-US');
}

export function earnedByGrade(trophies, isEarned) {
  const tally = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
  for (const t of trophies) if (isEarned(t)) tally[t.grade] += 1;
  return tally;
}

export function trophiesInStage(trophies, stage) {
  return trophies.filter((t) => t.stage === stage);
}
