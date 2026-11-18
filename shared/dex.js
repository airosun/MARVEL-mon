// Type chart, natures and items shared by server and client.
const TYPES = ['Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice', 'Fighting', 'Poison', 'Ground',
  'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy'];

// CHART[attacking][defending] = multiplier (omitted = 1)
const CHART = {
  Normal: { Rock: 0.5, Ghost: 0, Steel: 0.5 },
  Fire: { Fire: 0.5, Water: 0.5, Grass: 2, Ice: 2, Bug: 2, Rock: 0.5, Dragon: 0.5, Steel: 2 },
  Water: { Fire: 2, Water: 0.5, Grass: 0.5, Ground: 2, Rock: 2, Dragon: 0.5 },
  Electric: { Water: 2, Electric: 0.5, Grass: 0.5, Ground: 0, Flying: 2, Dragon: 0.5 },
  Grass: { Fire: 0.5, Water: 2, Grass: 0.5, Poison: 0.5, Ground: 2, Flying: 0.5, Bug: 0.5, Rock: 2, Dragon: 0.5, Steel: 0.5 },
  Ice: { Fire: 0.5, Water: 0.5, Grass: 2, Ice: 0.5, Ground: 2, Flying: 2, Dragon: 2, Steel: 0.5 },
  Fighting: { Normal: 2, Ice: 2, Poison: 0.5, Flying: 0.5, Psychic: 0.5, Bug: 0.5, Rock: 2, Ghost: 0, Dark: 2, Steel: 2, Fairy: 0.5 },
  Poison: { Grass: 2, Poison: 0.5, Ground: 0.5, Rock: 0.5, Ghost: 0.5, Steel: 0, Fairy: 2 },
  Ground: { Fire: 2, Electric: 2, Grass: 0.5, Poison: 2, Flying: 0, Bug: 0.5, Rock: 2, Steel: 2 },
  Flying: { Electric: 0.5, Grass: 2, Fighting: 2, Bug: 2, Rock: 0.5, Steel: 0.5 },
  Psychic: { Fighting: 2, Poison: 2, Psychic: 0.5, Dark: 0, Steel: 0.5 },
  Bug: { Fire: 0.5, Grass: 2, Fighting: 0.5, Poison: 0.5, Flying: 0.5, Psychic: 2, Ghost: 0.5, Dark: 2, Steel: 0.5, Fairy: 0.5 },
  Rock: { Fire: 2, Ice: 2, Fighting: 0.5, Ground: 0.5, Flying: 2, Bug: 2, Steel: 0.5 },
  Ghost: { Normal: 0, Psychic: 2, Ghost: 2, Dark: 0.5 },
  Dragon: { Dragon: 2, Steel: 0.5, Fairy: 0 },
  Dark: { Fighting: 0.5, Psychic: 2, Ghost: 2, Dark: 0.5, Fairy: 0.5 },
  Steel: { Fire: 0.5, Water: 0.5, Electric: 0.5, Ice: 2, Rock: 2, Steel: 0.5, Fairy: 2 },
  Fairy: { Fire: 0.5, Fighting: 2, Poison: 0.5, Dragon: 2, Dark: 2, Steel: 0.5 },
};
function effectiveness(atk, defTypes) {
  let m = 1;
  for (const t of defTypes) { const v = CHART[atk][t]; if (v !== undefined) m *= v; }
  return m;
}

const NATURES = {
  Hardy: {}, Docile: {}, Serious: {}, Bashful: {}, Quirky: {},
  Lonely: { plus: 'atk', minus: 'def' }, Brave: { plus: 'atk', minus: 'spe' }, Adamant: { plus: 'atk', minus: 'spa' }, Naughty: { plus: 'atk', minus: 'spd' },
  Bold: { plus: 'def', minus: 'atk' }, Relaxed: { plus: 'def', minus: 'spe' }, Impish: { plus: 'def', minus: 'spa' }, Lax: { plus: 'def', minus: 'spd' },
  Timid: { plus: 'spe', minus: 'atk' }, Hasty: { plus: 'spe', minus: 'def' }, Jolly: { plus: 'spe', minus: 'spa' }, Naive: { plus: 'spe', minus: 'spd' },
  Modest: { plus: 'spa', minus: 'atk' }, Mild: { plus: 'spa', minus: 'def' }, Quiet: { plus: 'spa', minus: 'spe' }, Rash: { plus: 'spa', minus: 'spd' },
  Calm: { plus: 'spd', minus: 'atk' }, Gentle: { plus: 'spd', minus: 'def' }, Sassy: { plus: 'spd', minus: 'spe' }, Careful: { plus: 'spd', minus: 'spa' },
};

const ITEMS = {
  "Leftovers": "At the end of every turn, holder restores 1/16 of its max HP.",
  "Life Orb": "Holder's attacks do 1.3x damage, and it loses 1/10 its max HP after the attack.",
  "Choice Band": "Holder's Attack is 1.5x, but it can only select the first move it executes.",
  "Choice Specs": "Holder's Sp. Atk is 1.5x, but it can only select the first move it executes.",
  "Choice Scarf": "Holder's Speed is 1.5x, but it can only select the first move it executes.",
  "Focus Sash": "If holder's HP is full, will survive an attack that would KO it with 1 HP. Single use.",
  "Assault Vest": "Holder's Sp. Def is 1.5x, but it can only select damaging moves.",
  "Rocky Helmet": "If holder is hit by a contact move, the attacker loses 1/6 of its max HP.",
  "Sitrus Berry": "Restores 1/4 max HP when at 1/2 max HP or less. Single use.",
  "Lum Berry": "Holder cures itself if it has a non-volatile status or is confused. Single use.",
  "Expert Belt": "Holder's attacks that are super effective against the target do 1.2x damage.",
  "Heavy-Duty Boots": "When switching in, the holder is unaffected by hazards on its side of the field.",
  "Light Clay": "Holder's use of Aurora Veil, Light Screen, or Reflect lasts 8 turns instead of 5.",
  "Weakness Policy": "If holder is hit super effectively, raises Attack, Sp. Atk by 2 stages. Single use.",
  "White Herb": "Restores all lowered stat stages to 0 when one is less than 0. Single use.",
  "Mental Herb": "Cures holder of Attract, Disable, Encore, Heal Block, Taunt, Torment. Single use.",
  "Black Sludge": "Each turn, if holder is a Poison type, restores 1/16 max HP; loses 1/8 if not.",
  "Flame Orb": "At the end of every turn, this item attempts to burn the holder.",
  "Toxic Orb": "At the end of every turn, this item attempts to badly poison the holder.",
  "Air Balloon": "Holder is immune to Ground-type attacks. Pops when holder is hit.",
  "Shell Bell": "After an attack, holder gains 1/8 of the damage in HP dealt to other hero.",
  "Scope Lens": "Holder's critical hit ratio is raised by 1 stage.",
  "Quick Claw": "Each turn, holder has a 20% chance to move first in its priority bracket.",
  "King's Rock": "Holder's attacks without a chance to flinch gain a 10% chance to flinch.",
  "Big Root": "Holder gains 1.3x HP from draining/Aqua Ring/Ingrain/Leech Seed/Strength Sap.",
  "Covert Cloak": "Holder is not affected by the secondary effect of another hero's attack.",
  "Clear Amulet": "Prevents other hero from lowering the holder's stat stages.",
  "Mirror Herb": "When an opposing hero raises a stat stage, the holder copies it. Single use.",
  "Loaded Dice": "Holder's moves that hit 2-5 times hit 4-5 times; Population Bomb hits 4-10 times.",
  "Throat Spray": "Raises holder's Special Attack by 1 stage after it uses a sound move. Single use.",
  "Eject Button": "If holder survives a hit, it immediately switches out to a chosen ally. Single use.",
  "Eject Pack": "If the holder's stat stages are lowered, it switches to a chosen ally. Single use.",
  "Red Card": "If holder survives a hit, attacker is forced to switch to a random ally. Single use.",
  "Safety Goggles": "Holder is immune to powder moves and damage from Sandstorm or Hail.",
  "Wide Lens": "The accuracy of attacks by the holder is 1.1x.",
  "Zoom Lens": "The accuracy of attacks by the holder is 1.2x if it moves after its target.",
  "Muscle Band": "Holder's physical attacks have 1.1x power.",
  "Wise Glasses": "Holder's special attacks have 1.1x power.",
  "Damp Rock": "Holder's use of Rain Dance lasts 8 turns instead of 5.",
  "Heat Rock": "Holder's use of Sunny Day lasts 8 turns instead of 5.",
  "Icy Rock": "Holder's use of Snowscape lasts 8 turns instead of 5.",
  "Terrain Extender": "Holder's use of Electric/Grassy/Misty/Psychic Terrain lasts 8 turns instead of 5.",
  "Room Service": "If Trick Room is active, the holder's Speed is lowered by 1 stage. Single use.",
  "Blunder Policy": "If the holder misses due to accuracy, its Speed is raised by 2 stages. Single use.",
  "Ability Shield": "Holder's Ability cannot be changed, suppressed, or ignored by any effect.",
  "Punching Glove": "Holder's punch-based attacks have 1.1x power and do not make contact.",
  "Focus Band": "Holder has a 10% chance to survive an attack that would KO it with 1 HP.",
  "Protective Pads": "Holder's moves are protected from adverse contact effects, except Pickpocket.",
  "Utility Umbrella": "The holder ignores rain- and sun-based effects.",
  "Electric Seed": "If the terrain is Electric Terrain, raises holder's Defense by 1 stage. Single use.",
  "Psychic Seed": "If the terrain is Psychic Terrain, raises holder's Sp. Def by 1 stage. Single use.",
  "Grassy Seed": "If the terrain is Grassy Terrain, raises holder's Defense by 1 stage. Single use.",
  "Misty Seed": "If the terrain is Misty Terrain, raises holder's Sp. Def by 1 stage. Single use.",
  "Salac Berry": "Raises holder's Speed by 1 stage when at 1/4 max HP or less. Single use.",
  "Liechi Berry": "Raises holder's Attack by 1 stage when at 1/4 max HP or less. Single use.",
  "Petaya Berry": "Raises holder's Sp. Atk by 1 stage when at 1/4 max HP or less. Single use.",
  "Custap Berry": "Holder moves first in its priority bracket when at 1/4 max HP or less. Single use.",
  "Aguav Berry": "Restores 1/3 max HP at 1/4 max HP or less; confuses if -SpD Nature. Single use.",
  "Figy Berry": "Restores 1/3 max HP at 1/4 max HP or less; confuses if -Atk Nature. Single use.",
  "Silk Scarf": "Holder's Normal-type attacks have 1.2x power.",
  "Charcoal": "Holder's Fire-type attacks have 1.2x power.",
  "Mystic Water": "Holder's Water-type attacks have 1.2x power.",
  "Magnet": "Holder's Electric-type attacks have 1.2x power.",
  "Miracle Seed": "Holder's Grass-type attacks have 1.2x power.",
  "Never-Melt Ice": "Holder's Ice-type attacks have 1.2x power.",
  "Black Belt": "Holder's Fighting-type attacks have 1.2x power.",
  "Poison Barb": "Holder's Poison-type attacks have 1.2x power.",
  "Soft Sand": "Holder's Ground-type attacks have 1.2x power.",
  "Sharp Beak": "Holder's Flying-type attacks have 1.2x power.",
  "Twisted Spoon": "Holder's Psychic-type attacks have 1.2x power.",
  "Silver Powder": "Holder's Bug-type attacks have 1.2x power.",
  "Hard Stone": "Holder's Rock-type attacks have 1.2x power.",
  "Spell Tag": "Holder's Ghost-type attacks have 1.2x power.",
  "Dragon Fang": "Holder's Dragon-type attacks have 1.2x power.",
  "Black Glasses": "Holder's Dark-type attacks have 1.2x power.",
  "Metal Coat": "Holder's Steel-type attacks have 1.2x power.",
  "Fairy Feather": "Holder's Fairy-type attacks have 1.2x power.",
  "Vibranium Shield": "Holder takes 20% less damage from contact moves.",
  "Super-Soldier Serum": "When at 1/2 max HP or less, restores 1/3 max HP. Single use.",
  "Arc Reactor Core": "Restores 1/16 max HP at the end of each turn. Holder's Electric moves deal 1.1x damage.",
  "Adamantium Plating": "Holder can't be hit by critical hits and takes no recoil damage.",
  "Web-Shooters": "On entry, lowers the foe's Speed by 1 stage (adjacent foes in doubles). Single use.",
  "Symbiote Fragment": "Holder's contact moves restore 1/8 of damage dealt, but it takes 1.5x damage from Fire moves.",
  "Darkhold": "Holder's Dark and Psychic moves deal 1.2x damage, but it loses 1/10 max HP after each attack.",
  "Mjolnir": "Holder's Electric and Fighting moves deal 1.2x damage. (Thor only.)",
  "Captain America's Shield": "When the holder uses Protect or Wide Guard and blocks a contact move, the attacker's Attack drops by 1 stage. (Captain America only.)",
  "Eye of Agamotto": "Trick Room set by the holder lasts 8 turns, and its Future Sight deals 1.3x damage. (Doctor Strange only.)",
};
// signature items: only these heroes can hold them
const ITEM_ONLY = { 'Mjolnir': ['thor'], "Captain America's Shield": ['captain-america'], 'Eye of Agamotto': ['doctor-strange'] };
const canHold = (item, id) => !ITEM_ONLY[item] || ITEM_ONLY[item].includes(id);
// kept for older code paths; no hero uses Eviolite
const EVIOLITE_USERS = [];

const STAT_NAMES = { hp: 'HP', atk: 'Atk', def: 'Def', spa: 'SpA', spd: 'SpD', spe: 'Spe' };

function calcStat(stat, base, iv, ev, level, nature) {
  if (stat === 'hp') return Math.floor((2 * base + iv + Math.floor(ev / 4)) * level / 100) + level + 10;
  let v = Math.floor((2 * base + iv + Math.floor(ev / 4)) * level / 100) + 5;
  const n = NATURES[nature] || {};
  if (n.plus === stat) v = Math.floor(v * 1.1);
  if (n.minus === stat) v = Math.floor(v * 0.9);
  return v;
}

// Abilities renamed after release (old name -> new name). None yet.
const RENAMED_ABILITIES = {};

const exported = { RENAMED_ABILITIES, TYPES, CHART, effectiveness, NATURES, ITEMS, ITEM_ONLY, canHold, EVIOLITE_USERS, STAT_NAMES, calcStat };
if (typeof module !== 'undefined') module.exports = exported;
if (typeof window !== 'undefined') window.DEX = exported;
