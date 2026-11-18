// Ultimates (Mega-style transformations) will live in FINAL_SMASHES once they are designed.
// The engine and site still support them (a held "stone" lets one hero transform once per battle),
// but for now there are none, so nothing in the team builder or battle shows them.
//
// FORMS are battle-only forms a hero switches into through its ability (not an item):
//   Hulk's Puny Banner turns him into Bruce Banner below 1/3 HP, and back into Hulk above 1/2 HP.
//   Cloak & Dagger's abilities tag between Dagger (the base form, who starts the battle) and Cloak.
(function () {
  const FINAL_SMASHES = {
    // item: { base hero id, Ultimate Form }. HP never changes when transforming; every form is +100 BST.
    'Gamma Bomb':       { base: 'hulk', id: 'monster-hulk', name: 'Monster Hulk', types: ['Fighting', 'Poison'], stats: { hp: 115, atk: 165, def: 125, spa: 55, spd: 105, spe: 105 }, ability: { name: 'World Breaker', desc: "Contact moves deal 1.3x damage, it can't flinch, and foes can't lower its stats." } },
    'Limbo Bloodstone': { base: 'magik', id: 'darkchylde', name: 'Darkchylde', types: ['Dark', 'Ghost'], stats: { hp: 75, atk: 155, def: 85, spa: 110, spd: 85, spe: 135 }, ability: { name: 'Queen of Limbo', desc: "Lowers the foes' Attack when it transforms or switches in (Intimidate), and slicing moves deal 1.5x damage." } },
    "Dormammu's Cloak": { base: 'the-hood', id: 'the-hood-gun-demon-form', name: 'The Hood (Gun Demon Form)', types: ['Dark', 'Fire'], stats: { hp: 100, atk: 130, def: 105, spa: 135, spd: 100, spe: 100 }, ability: { name: "Dormammu's Vessel", desc: 'Same-type attack bonus is 2x instead of 1.5x (Adaptability).' } },
    'Fox Bead':         { base: 'white-fox', id: 'kumiho', name: 'Kumiho', types: ['Fairy', 'Dark'], stats: { hp: 80, atk: 130, def: 85, spa: 120, spd: 100, spe: 115 }, ability: { name: 'Nine-Tailed Fox', desc: 'Heals 1/3 of the damage its attacks deal, and contact with it may infatuate the attacker (30%).' } },
  };
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
  for (const [stone, f] of Object.entries(FINAL_SMASHES)) { f.stone = stone; f.image = f.image || null; f.bases = [].concat(f.base); f.base = f.bases[0]; }
  for (const f of Object.values(FORMS)) f.image = null;
  const byBase = {};
  for (const f of Object.values(FINAL_SMASHES)) for (const b of f.bases) (byBase[b] = byBase[b] || []).push(f);
  const api = { FINAL_SMASHES, FINAL_SMASH_BY_BASE: byBase, FORMS, isStone: item => !!FINAL_SMASHES[item], worksFor: (fs, id) => !!fs && fs.bases.includes(id) };
  if (typeof module !== 'undefined') module.exports = api;
  if (typeof window !== 'undefined') window.MEGAS = api;
})();
