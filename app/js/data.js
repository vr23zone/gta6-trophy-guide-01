// data.js — loads the trophy data file (a file of this app, fetched relative to the page, so it works
// offline and from any static host) and the small bits of shared vocabulary the views use.

export const GRADE_ORDER = ['platinum', 'gold', 'silver', 'bronze'];

export const GRADE_LABEL = {
  platinum: 'Platinum',
  gold: 'Gold',
  silver: 'Silver',
  bronze: 'Bronze',
};

export const KIND_LABEL = {
  story: 'Story',
  collectibles: 'Collectibles',
  activities: 'Activities',
  online: 'Online',
  platinum: 'Platinum',
};

export async function loadTrophies() {
  const response = await fetch('data/trophies.json');
  if (!response.ok) throw new Error(`trophies.json: HTTP ${response.status}`);
  const data = await response.json();
  return Array.isArray(data) ? data : data.trophies;
}

export function gradeCounts(trophies) {
  const counts = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
  for (const trophy of trophies) counts[trophy.grade] = (counts[trophy.grade] ?? 0) + 1;
  return counts;
}
