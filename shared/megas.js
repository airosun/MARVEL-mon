// Ultimates (Mega-style transformations) will live in FINAL_SMASHES once they are designed.
// The engine and site still support them (a held "stone" lets one hero transform once per battle),
// but for now there are none, so nothing in the team builder or battle shows them.
//
// FORMS are battle-only forms a hero switches into through its ability (not an item):
//   Hulk's Puny Banner turns him into Bruce Banner below 1/3 HP, and back into Hulk above 1/2 HP.
//   Cloak & Dagger's abilities tag between Dagger (the base form, who starts the battle) and Cloak.
(function () {
  const FINAL_SMASHES = {};
  const FORMS = {
    'bruce-banner': {
      base: 'hulk', id: 'bruce-banner', name: 'Bruce Banner', types: ['Normal', 'Poison'],
      stats: { hp: 55, atk: 50, def: 60, spa: 110, spd: 75, spe: 70 }, inGameHP: 200,
      ability: { name: 'Puny Banner', desc: 'When healed above 1/2 HP, transforms back into Hulk (Fighting/Poison) at the end of the turn.' },
      learnset: ['Sludge Bomb', 'Rage', 'Calm Mind', 'Acid Spray', 'Hyper Beam', 'Sludge Wave', 'Clear Smog', 'Venoshock', 'Toxic', 'Swift', 'Tri Attack', 'Endure'],
    },
    'cloak-form': {
      base: 'cloak-and-dagger', id: 'cloak-form', name: 'Cloak', types: ['Dark'],
      stats: { hp: 80, atk: 70, def: 95, spa: 95, spd: 115, spe: 70 }, inGameHP: 275,
      ability: { name: 'Eternal Bond', desc: 'Cloak tags in for Dagger before Dark and Ghost moves; Dagger tags back in before Fairy and Psychic moves.' },
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
