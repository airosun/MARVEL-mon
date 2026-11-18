// Ultimates (Mega-style transformations) will live in FINAL_SMASHES once they are designed.
// The engine and site still support them (a held "stone" lets one hero transform once per battle),
// but for now there are none, so nothing in the team builder or battle shows them.
//
// FORMS are battle-only forms a hero switches into through its ability (not an item):
//   Hulk's Puny Banner turns him into Bruce Banner below 1/3 HP, and back into Hulk above 1/2 HP.
//   Cloak & Dagger's abilities tag between Cloak (the base form) and Dagger.
(function () {
  const FINAL_SMASHES = {};
  const FORMS = {
    'bruce-banner': {
      base: 'hulk', id: 'bruce-banner', name: 'Bruce Banner', types: ['Normal', 'Poison'],
      stats: { hp: 55, atk: 50, def: 60, spa: 110, spd: 75, spe: 70 }, inGameHP: 200,
      ability: { name: 'Puny Banner', desc: 'When healed above 1/2 HP, transforms back into Hulk (Fighting/Poison) at the end of the turn.' },
      learnset: ['Sludge Bomb', 'Rage', 'Calm Mind', 'Acid Spray', 'Hyper Beam', 'Sludge Wave', 'Clear Smog', 'Venoshock', 'Toxic', 'Swift', 'Tri Attack', 'Endure'],
    },
    'dagger-form': {
      base: 'cloak-and-dagger', id: 'dagger-form', name: 'Dagger', types: ['Fairy'],
      stats: { hp: 80, atk: 55, def: 65, spa: 120, spd: 95, spe: 110 }, inGameHP: 275,
      ability: { name: 'Eternal Bond', desc: 'Dagger tags in for Cloak before Fairy and Psychic moves; Cloak tags back in before Dark and Ghost moves.' },
    },
  };
  for (const [stone, f] of Object.entries(FINAL_SMASHES)) { f.stone = stone; f.image = f.id + '.png'; f.bases = [].concat(f.base); f.base = f.bases[0]; }
  for (const f of Object.values(FORMS)) f.image = null;
  const byBase = {};
  for (const f of Object.values(FINAL_SMASHES)) for (const b of f.bases) (byBase[b] = byBase[b] || []).push(f);
  const api = { FINAL_SMASHES, FINAL_SMASH_BY_BASE: byBase, FORMS, isStone: item => !!FINAL_SMASHES[item], worksFor: (fs, id) => !!fs && fs.bases.includes(id) };
  if (typeof module !== 'undefined') module.exports = api;
  if (typeof window !== 'undefined') window.MEGAS = api;
})();
