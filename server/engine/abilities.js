// Ability specs. Each hero ability name maps to a set of effect keys that the battle engine reads.
// Many lore abilities share a mechanic with a real Pokémon ability; the engine implements each mechanic once.
// Descriptions players see live in shared/fighters.json (built from the design sheet).
const A = {};
const def = (names, spec) => { for (const n of [].concat(names)) A[n] = spec; };

// ---- Once-per-battle / HP-threshold triggers ----
def('Regenerative Cocoon', { cocoon: { heal: 0.25 } });                          // revives at the end of the next turn
def('Phoenix Force', { phoenix: { heal: 0.5 } });                               // revives immediately
def(['14,000,605 Futures', 'Unkillable'], { surviveOnce: true });
def('Unbeatable', { sturdy: true });
def('Darkchylde', { thresholdEntry: { below: 0.5, boosts: { atk: 1 } } });
def('Great Responsibility', { thresholdEntry: { below: 0.5, boosts: { atk: 1 } } });
def('Kumiho Unleashed', { threshold: { below: 1 / 3, heal: 0.5, boosts: { atk: 1 } } });
def('Diamond Form', { diamondForm: { below: 0.5 } });
def('Puny Banner', { punyBanner: true });

// ---- Damage dealt modifiers ----
def(['Iron Fist', 'Fist of Khonshu'], { flagBoost: { flag: 'punch', mult: 1.2 } });
def('Soulsword', { flagBoost: { flag: 'slicing', mult: 1.5 } });
def('Primal Rampage', { flagBoost: { flag: 'bite', mult: 1.5 } });
def("Clobberin' Time", { flagBoost: { flag: 'contact', mult: 1.3 } });
def('Optic Blast', { flagBoost: { flag: 'beam', mult: 1.3 } });
def('Genius Engineer', { flagBoost: { flag: 'pulse', mult: 1.5 }, healPulseBoost: 0.75 });
def('K-pop Idol', { flagBoost: { flag: 'sound', mult: 1.3 }, flagTaken: { flag: 'sound', mult: 0.5 } });
def('Sorcerer Supreme', { typeBoost: { Psychic: 1.2, Ghost: 1.2 } });
def('Electromagnetic Field', { typeBoost: { Steel: 1.5 } });
def('Weather Witch', { weatherTypeBoost: { Electric: 1.2, Flying: 1.2 } });
def('Vampire Hunter', { vsType: { Dark: 1.5, Ghost: 1.5 } });
def('Monster Hunter', { vsType: { Dragon: 1.5, Ghost: 1.5, Dark: 1.5 } });
def("Moon's Vengeance", { pinch: { type: 'Ghost' } });
def("Death's Embrace", { executioner: 1.3 });
def('God Butcher', { godButcher: 1.3 });
def('Smartest Man Alive', { analytic: true });
def(['Arsenal', 'Squirrel Army'], { skillLink: true });
def('Psychic Stealth', { infiltrator: true });
def('Chaos Magic', { sereneGrace: true });
def('Lady Luck', { critBonus: 1 });
def('Red Room Training', { unaware: true });
def('Radar Sense', { scrappy: true, mindsEye: true });
def('Dark Phoenix', { statMult: { spa: 1.3 }, attackRecoil: 0.1 });
def('Demonic Energy', { demonicEnergy: { attacks: 3, turns: 2, mult: 1.3, drain: 0.25 } });
def("World's Greatest Marksman", { noMiss: true });

// ---- Draining ----
def('Darkforce Hunger', { typeDrain: { Dark: 0.25 } });
def(['Daywalker'], { drainAll: 0.125, statusImmune: ['brn'] });
def('Vampiric', { drainAll: 0.125 });
def('Draining Touch', { contactDrain: 0.25 });
def('Kumiho Essence', { drainBoost: 1.5 });
def(['Soul Gem', 'Feast'], { onKOHeal: 0.25 });

// ---- Damage taken modifiers ----
def(['Nanotech Armor', 'Rock Hide'], { filter: 0.75 });
def('Vibranium Weave', { catTaken: { Physical: 0.75 } });
def('Rubber Body', { catTaken: { Physical: 0.75 }, battleArmor: true });
def('SP//dr Armor', { battleArmor: true });
def('Symbiote', { allTaken: 0.8, typeTaken: { Fire: 2 / 0.8 }, flagTaken: { flag: 'sound', mult: 2 / 0.8 } });
def('Bloodstone', { allTaken: 0.8, statusImmune: ['psn', 'tox'] });
def('Force Field', { forceField: { ally: 0.75, self: 0.9 } });
def('Invisibility', { disguise: true, disguiseText: 'turned invisible and the attack missed!' });
def('Reality Warping', { magicGuard: true });

// ---- Immunities / absorbs ----
def('Arc Reactor', { absorb: { type: 'Electric', heal: 0.25 } });
def('Thorforce', { absorb: { type: 'Electric', boosts: { atk: 1 } } });
def('Cryo Stasis', { absorb: { type: 'Ice', heal: 0.25 }, statusImmune: ['frz'] });
def('Flame On', { absorb: { type: 'Fire', flashFire: true } });
def('Levitation Boots', { levitate: true });
def('I Am Groot', { immuneFlag: 'sound', noTaunt: true, noAttract: true });
def('The Man Without Fear', { noFlinch: true, noIntimidate: true, noTaunt: true });
def('Adamantium Shell', { clearBody: true });

// ---- Reactions to being hit / to the battle ----
def('Strongest There Is', { hitBoost: { atk: 1 } });
def('Never Surrender', { onStatDrop: { atk: 2 } });
def('Berserker Rage', { angerPoint: true });
def('Mind Control', { cursedBody: 30 });
def('Spore Slumber', { contactStatus: { status: 'slp', chance: 30 } });
def("Ragin' Cajun", { contactAttract: 30 });
def('Supernova', { aftermath: 0.25 });
def('Pickpocket', { pickpocket: true });
def('Queen of Hel', { soulHeart: true });
def('Vengeance', { allyFaintBoost: { atk: 1 } });
def('Trained Assassin', { onKO: { atk: 1 } });

// ---- Reactions when attacking ----
def("Widow's Bite", { attackStatus: { type: 'Electric', status: 'par', chance: 30 } });
def('Trick Arrows', { attackStatus: { status: ['brn', 'par', 'psn'], chance: 20 } });
def('Fireworks', { attackFoeBoost: { chance: 20, boosts: { accuracy: -1 } } });
def('Cat Burglar', { magician: true });
def('Bad Luck', { badLuck: { acc: 0.9 } });
def('Ichor Ribbons', { bindingBand: { mult: 2, turns: 7 } });

// ---- Priority / speed ----
def('Trickster', { prankster: true });
def('Angel of Heven', { galeWings: true });
def('BAMF!', { pivotPrio: 1 });
def('Imperius Rex', { weatherSpeed: 'rain' });
def('Element Guns', { protean: true });
def('Dance-Off', { dancer: true });

// ---- Switch-in effects ----
def('Too Cute', { intimidate: true });
def('God of Mischief', { illusion: true });
def('Ice Queen', { startWeather: 'snow' });
def(['Horn of Proteus', 'Goddess of the Storm'], { startWeather: 'rain' });
def('God of Thunder', { startTerrain: 'electric' });
def('Psionic Butterfly', { startTerrain: 'psychic' });
def('Heart-Shaped Herb', { startBoostOnce: { spe: 1 } });
def('Spider-Sense', { anticipationBoost: { spe: 1 } });
def('Spider-Nest', { entryHazardOnce: 'stickyweb' });
def('Moon Girl', { download: true });
def('Black Berserkers', { freeSubOnce: true });
def('Power Absorption', { trace: true, traceRules: true });
def('Fourth Wall', { fourthWall: true });
def('Master of Magnetism', { magnetPull: true });

// ---- Switching out ----
def(['Healing Bubble', 'Upload Consciousness'], { regenerator: true });
def('Eternal Bond', { tagTeam: { mode: 'move' } });
def('Light and Darkforce', { tagTeam: { mode: 'turn', heal: 16 } });

// ---- End of turn ----
def(['Flora Colossus', 'Chi Healing'], { residualHeal: 1 / 16 });
def('Healing Factor', { residualHeal: 1 / 8 });
def('Purifying Light', { healer: 30 });
def('Blind Faith', { shedSkin: 33 });

// ---- Team / ally support ----
def('Avengers Assemble', { allyPower: 1.3, switchGift: { atk: 1 } });
def('Field Leader', { allyCrit: 1, switchGift: { spe: 1 } });
def('Empath', { healBoost: 1.5 });

// ---- Hulk (Bruce Banner form) and anything not listed: no special effect ----

module.exports = A;
