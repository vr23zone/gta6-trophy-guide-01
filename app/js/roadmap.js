// roadmap.js — the platinum roadmap and the missable analysis, both built from the official trophy
// descriptions (the mission and chapter names, the stranger strands, the counts PlayStation tracks).
// Hours are honest estimates for a first playthrough of a game this size, labelled as estimates in the app.

export const ROADMAP_STAGES = [
  {
    n: 1,
    title: 'Play the story, keep three saves',
    hours: 'about 40–55 hours',
    trophyIds: [2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 7],
    advice: [
      'Follow the campaign from the opening mission Gone Fishing through Chapter 4 and the final mission. Twelve trophies pay out along the way, one per chapter and one per named mission, and the final mission pays gold.',
      'Rotate three manual saves: one at the start of each chapter. The three choice-flavoured trophies flagged on the Missables tab are the only ones a single playthrough can put at risk, and a chapter-start save is the cheap insurance.',
      'Play the partner moments as they come: the two trophies that ask you to lose the heat and rob shops back-to-back "with your partner" are written for the game\'s two-protagonist setup, and the story teaches both mechanics before free roam does.',
      'Do not chase collectibles yet. Everything in the open world is still there after the credits; the story is the only part with an order to it.',
    ],
  },
  {
    n: 2,
    title: 'Strangers & Freaks: finish every strand',
    hours: 'about 10–15 hours',
    trophyIds: [22, 23, 24, 26, 27, 29, 25],
    advice: [
      'Work the stranger strands to their final missions: Andy, Kenton, Billy, Randy and Tyrone each pay a bronze at the end of their strand, and Bret\'s strand pays for hunting a unique animal.',
      'Strangers & Freaks (silver) counts eight finished strands across Leonida, so the named five are not enough on their own — pick up every stranger marker the map offers as you travel.',
      'Strands unlock as the story opens new areas, which is why this stage sits after the campaign rather than beside it.',
    ],
  },
  {
    n: 3,
    title: 'Skills, scores and one-off moments',
    hours: 'about 25–35 hours',
    trophyIds: [16, 17, 18, 19, 20, 21, 32, 15, 36, 39, 40, 41, 43, 51, 33, 34, 37, 38, 44, 45, 46, 50],
    advice: [
      'Start with Master of None: try each of the 9 activity types once. It tours everything this stage asks for — ranges, races, fishing, arcade, hunting — and tells you which ones you enjoy grinding.',
      'The Shootist is the stage\'s long pole: gold medals in all 42 Shooting Range challenges. Do a few ranges whenever you pass one instead of saving all 42 for the end.',
      'Cunning Stunts (250 stunts) and One Last Thing (50 challenges) fill in on their own while you travel between activities; check their counters before any dedicated grind.',
      'The crime set — 5 bank vaults, an armored truck, one illegal operation from each of the 9 gangs, a jewelry store robbed unseen — is repeatable in free roam. Plan a route, rob, escape, repeat.',
      'Save the one-off moments (a cocktail on Ocean Beach, the showroom escape, bowling at Kolt & Associates\', the melee drive-by) for a single relaxed evening; each takes minutes once you know it exists.',
    ],
  },
  {
    n: 4,
    title: 'Collectibles and the full map',
    hours: 'about 20–30 hours',
    trophyIds: [30, 31, 28, 42, 35, 55],
    advice: [
      'You WAiNKer! asks for 100 WAiNK locations and Positive Mental Attitude for all 18 meditation spots: both are "visit the marked place" hunts, best done region by region with The Goodtime State (all 52 areas of Leonida) as the frame.',
      'Don\'t Touch My Deck needs 3 complete Collectible Card sets — the only collectible with a set structure, so track which set each card belongs to instead of collecting at random.',
      'Whip It Good (discover 100 vehicles) and On the Spot (register 10 vehicles to the Scooter Bros app) pair naturally: drive everything new you see for a block, then register the keepers.',
    ],
  },
  {
    n: 5,
    title: 'Money: earn it, move it, spend it',
    hours: 'about 8–12 hours',
    trophyIds: [52, 53, 54],
    advice: [
      'Dime on the Dollar tracks $250,000 of Marked Bills laundered through your contacts — a counter, not a balance, so every laundered dollar counts even if you spend it the same day.',
      'Treat Yo Self ($100,000 spent across all shops) and Little Boxes (all 8 garage properties) turn the laundered money into progress; buy the garages last, once the story\'s income is behind you.',
    ],
  },
  {
    n: 6,
    title: 'The 100% push and the platinum',
    hours: 'about 15–25 hours of cleanup',
    trophyIds: [14, 47, 48, 49, 1],
    advice: [
      'A Long Road (gold) is 100% completion on PlayStation\'s own counter, 0/100. Whatever is left — a strand, a stunt set, a challenge page — is the cleanup list; the tracker\'s unearned filter is that list.',
      'Before the final cleanup, settle the three flagged trophies (Personal Best, Actions Speak Louder, Bad Luck, I Guess) while your chapter saves still exist.',
      'Vice Got a Price! — the platinum — pays the moment the other 54 are earned. Total for the whole road: roughly 120–170 hours, the story and the 100% push being the two big blocks.',
    ],
  },
];

export const MISSABLE_INTRO =
  'Built from the official descriptions alone: the published list shows no trophy that names a one-time ' +
  'mission or a branching ending, so nothing here is a confirmed hard missable. Three trophies are flagged ' +
  'at risk because their descriptions describe choices or a second attempt — the two things a single ' +
  'playthrough can run out of. Everything else on the list is repeatable in free roam or counted cumulatively.';

export const MISSABLE_SAFETY = [
  'Keep a manual save at the start of every chapter; never overwrite the oldest one until the credits have rolled.',
  'When the story offers an explicit choice, save first, choose, and let the Actions Speak Louder counter (0/500) tell you the choice registered.',
  'If a set-piece goes wrong the first time, remember Bad Luck, I Guess wants a second attempt to succeed — a failed first try is progress, not a dead end, as long as the event can be retried.',
];
