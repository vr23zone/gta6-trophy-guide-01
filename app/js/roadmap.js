// The roadmap to the platinum: six stages in the order this guide plays them.
// Built from the official trophy descriptions — story chapters in order, the stranger
// strands parked before the finale as a precaution, then the free-roam sweep, the
// collections and counters, and the 100% audit last. Hours are the guide's own estimates.

export const ROADMAP_STAGES = [
  {
    n: 1,
    title: 'Chapters 1–2 — first steps in Leonida',
    hours: 'about 6–8 hours',
    intro:
      'Play the story from Gone Fishing through Chapter 2. Two habits start here and carry the whole run: answer every dialogue choice instead of letting it lapse (Actions Speak Louder counts 500 of them, and it is counted from this stage), and keep a manual save at each chapter break.',
  },
  {
    n: 2,
    title: 'Chapters 3–4 — the named missions',
    hours: 'about 12–15 hours',
    intro:
      'Finish Chapters 3 and 4 and their named missions — Breakfast Run, The Cartel Heist, Child’s Play, Headliners, VCIA Takedown, Operation Savage Glory. The missable-risk beats live in this stretch: keep a rotating manual save before big one-time events, share partnership moments when the story offers them, and never reload a failure away — a retry is what Bad Luck, I Guess is made of.',
  },
  {
    n: 3,
    title: 'Stranger strands before the finale',
    hours: 'about 8–10 hours',
    intro:
      'Stop before the final mission and clear the stranger strands: the finales for Andy, Kenton, Billy, Randy and Tyrone, which also complete five of the eight strands Strangers & Freaks needs. The roadmap parks them here as insurance — the official descriptions never promise the strands survive the finale — and only then plays “You Gotta Know When to Get Off”.',
  },
  {
    n: 4,
    title: 'Free-roam Leonida — activities and mayhem',
    hours: 'about 15–20 hours',
    intro:
      'With the story done, the map is a toolbox. Sample every activity type once, win races and drone races, beat Cal at fishing, rob shops, banks and armored trucks, work the gang operations and the one-off set-pieces — the cocktail on Ocean Beach, the showroom exit, the unscheduled departure at VCIA. None of it is locked behind the story any longer.',
  },
  {
    n: 5,
    title: 'The great sweep — collections, map and money',
    hours: 'about 25–35 hours',
    intro:
      'The long, satisfying grind, done region by region so the counters close together: 250 stunts, 42 Shooting Range golds, 3 card sets, 100 WAiNK locations, 100 vehicles discovered, 52 areas explored, 18 meditation spots, $250,000 laundered, $100,000 spent, 8 garages bought and 10 vehicles registered. Sweep one district at a time and the last items on every counter are in the same few streets.',
  },
  {
    n: 6,
    title: '100% — and the platinum',
    hours: 'about 10–15 hours',
    intro:
      'Audit the in-game completion statistics against this tracker, category by category, and mop up whatever is short until A Long Road lands at 100%. The platinum, Vice Got a Price!, unlocks by itself with your 54th trophy — for most players this audit is where it arrives.',
  },
];

export function stageProgress(trophies, store, stage) {
  const inStage = trophies.filter((t) => t.stage === stage.n);
  const done = inStage.filter((t) => store.isEarned(t)).length;
  return { total: inStage.length, done };
}
