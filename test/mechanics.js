// Targeted checks of mechanics, the match flow and roster signing. Usage: node test/mechanics.js
const assert = require('assert');
const { Battle } = require('../server/engine/battle.js');
const { Match } = require('../server/match.js');
const { sign, verify, genFighter } = require('../server/engine/roster.js');
const { validateEliteTeam, validateStandardBuild } = require('../server/engine/validate.js');

const ivs31 = { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 };
const ABILITIES = require('../server/engine/abilities.js').ABILITIES || require('../server/engine/abilities.js');
const mk = (species, ability, moves, extra = {}) => Object.assign({ species, ability, moves, nature: 'Hardy', ivs: ivs31 }, extra);
function seeded(s) { return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }
const battle = (t1, t2, format = 'singles') => new Battle({ format, players: [{ name: 'A', team: t1 }, { name: 'B', team: t2 }], rng: seeded(7) });
const text = b => b.log.map(l => l.text).join('\n');
const mv = (index, target) => ({ actions: [{ pos: 0, type: 'move', index, target }] });
let passed = 0;
async function test(name, fn) { try { await fn(); passed++; console.log('ok  ', name); } catch (e) { console.log('FAIL', name, '\n', e.stack); process.exitCode = 1; } }

(async () => {
  await test('weather and field changes carry the field state for the battlefield effects', () => {
    const b = battle([mk('storm', 'Weather Witch', ['Rain Dance', 'Protect'])], [mk('adam-warlock', 'Soul Gem', ['Trick Room', 'Protect'])]);
    b.choose(0, mv(0)); b.choose(1, mv(0));
    const rain = b.log.find(l => l.a && l.a.k === 'field' && l.a.f.weather === 'rain');
    assert(rain && /rain/.test(rain.text) && rain.a.f.weatherTurns === 5, 'rain start tagged');
    assert(b.log.some(l => l.a && l.a.k === 'field' && l.a.f.trickroom === 5), 'trick room tagged');
    for (let i = 0; i < 4; i++) { b.choose(0, mv(1)); b.choose(1, mv(1)); }
    const stop = b.log.find(l => l.text === 'The rain stopped.');
    assert(stop && stop.a && stop.a.k === 'field' && stop.a.f.weather === '', 'rain end tagged');
  });

  await test('substitute: both players see it up; breaking it is tagged', () => {
    const b = battle([mk('loki', 'Trickster', ['Substitute', 'Protect'])], [mk('captain-america', 'Never Surrender', ['Bulk Up', 'Close Combat'])]);
    b.choose(0, mv(0)); b.choose(1, mv(0));
    for (const persp of [0, 1]) assert(b.publicState(persp).sides[0].active[0].volatiles.includes('substitute'), 'visible to player ' + persp);
    for (let i = 0; i < 5 && !b.log.some(l => l.a && l.a.k === 'suboff'); i++) { b.choose(0, mv(1)); b.choose(1, mv(1)); }
    assert(b.log.some(l => l.a && l.a.k === 'suboff' && /substitute faded/.test(l.text)));
  });

  await test('roster signatures detect tampering', () => {
    const f = sign(genFighter('captain-america'));
    assert(verify(f));
    assert(!verify(Object.assign({}, f, { ivs: ivs31 })));
    assert(!verify(Object.assign({}, f, { nature: f.nature === 'Adamant' ? 'Modest' : 'Adamant' })));
  });

  await test('Strike Squad: 6 verified heroes, species and item clauses, signature items', () => {
    const F = require('../shared/fighters.json');
    const ids = ['captain-america', 'spider-man', 'thor', 'storm', 'groot', 'iron-man'];
    const team = ids.map(id => Object.assign(sign(genFighter(id)), { moves: [F.find(x => x.id === id).learnset[0]], item: '' }));
    assert(validateEliteTeam(team, verify).ok);
    team[0].item = 'Leftovers'; team[1].item = 'Leftovers';
    assert(validateEliteTeam(team, verify).errors.some(e => /Item clause/.test(e)));
    team[1].item = 'Mjolnir';
    assert(validateEliteTeam(team, verify).errors.some(e => /can't hold Mjolnir/.test(e)), 'Mjolnir is Thor only');
    team[1].item = ''; team[2].item = 'Mjolnir';
    assert(validateEliteTeam(team, verify).ok, 'Thor can hold Mjolnir');
    team[1].ivs = ivs31;
    assert(!validateEliteTeam(team, verify).ok);
  });

  await test('Standard build rejects unlearnable moves', () => {
    const base = [genFighter('captain-america')];
    assert(!validateStandardBuild(base, [{ moves: ['Fly'] }]).ok);
    assert(validateStandardBuild(base, [{ moves: ['Smart Strike'], item: 'Leftovers' }]).ok);
  });

  await test('God of Mischief (Illusion) disguises Loki as the last brought hero until hit', () => {
    const b = battle([mk('loki', 'God of Mischief', ['Nasty Plot']), mk('thor', 'God of Thunder', ['Thunder Punch'])], [mk('captain-america', 'Never Surrender', ['Smart Strike'])]);
    assert.match(text(b), /A sent out Thor!/);
    b.choose(0, mv(0)); b.choose(1, mv(0));
    assert.match(text(b), /illusion wore off/);
  });

  await test('U-turn asks for a switch mid-turn', () => {
    const b = battle([mk('spider-man', 'Spider-Sense', ['U-turn']), mk('captain-america', 'Never Surrender', ['Smart Strike'])], [mk('groot', 'Flora Colossus', ['Wood Hammer'])]);
    b.choose(0, mv(0)); b.choose(1, mv(0));
    const r = b.getRequest(0);
    assert.equal(r.kind, 'switch'); assert.deepEqual(r.slots, [0]);
    assert.equal(b.choose(0, { switches: [{ pos: 0, index: 1 }] }), null);
    assert.equal(b.sides[0].active[0].species.id, 'captain-america');
  });

  await test('Doubles: spread move hits both foes; Too Cute (Intimidate) hits both', () => {
    const b = battle(
      [mk('jeff-the-land-shark', 'Too Cute', ['Crunch']), mk('groot', 'Flora Colossus', ['Rock Slide'])],
      [mk('captain-america', 'Avengers Assemble', ['Smart Strike']), mk('spider-man', 'Great Responsibility', ['Lunge'])], 'doubles');
    assert.equal(b.sides[1].active[0].boosts.atk, -1); assert.equal(b.sides[1].active[1].boosts.atk, -1);
    b.choose(0, { actions: [{ pos: 0, type: 'move', index: 0, target: { side: 1, pos: 0 } }, { pos: 1, type: 'move', index: 0 }] });
    b.choose(1, { actions: [{ pos: 0, type: 'move', index: 0, target: { side: 0, pos: 0 } }, { pos: 1, type: 'move', index: 0, target: { side: 0, pos: 0 } }] });
    const t = text(b);
    assert.match(t, /B's Captain America lost/); assert.match(t, /B's Spider-Man lost/);
  });

  await test('Doubles: the hero that faints is replaced from the bench', () => {
    const b = battle(
      [mk('mantis', 'Empath', ['Psybeam'], { ivs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 } }), mk('captain-america', 'Never Surrender', ['Smart Strike']), mk('spider-man', 'Spider-Sense', ['Lunge'])],
      [mk('phoenix', 'Dark Phoenix', ['Fire Blast']), mk('the-thing', 'Rock Hide', ['Close Combat'])], 'doubles');
    for (let i = 0; i < 3 && b.getRequest(0).kind !== 'switch'; i++) {
      b.choose(0, { actions: [{ pos: 0, type: 'move', index: 0, target: { side: 1, pos: 0 } }, { pos: 1, type: 'move', index: 0, target: { side: 1, pos: 0 } }] });
      b.choose(1, { actions: [{ pos: 0, type: 'move', index: 0, target: { side: 0, pos: 0 } }, { pos: 1, type: 'move', index: 0, target: { side: 0, pos: 0 } }] });
    }
    const r = b.getRequest(0);
    assert.equal(r.kind, 'switch');
    assert.equal(b.choose(0, { switches: r.slots.map(pos => ({ pos, index: 2 })).slice(0, 1) }), null);
  });

  await test('Standard match flow: draft -> build -> lineup -> battle', async () => {
    let last;
    const m = new Match({ id: 't', mode: 'standard', format: 'doubles', players: [{ id: 'a', name: 'A', cpu: true }, { id: 'b', name: 'B', cpu: true }], onUpdate: x => { last = x.phase; } });
    m.cpuDelay = 0;
    for (const p of m.players) p.pending = false;
    m.cpuAct();
    await new Promise(r => { const t = setInterval(() => { if (m.ended) { clearInterval(t); r(); } }, 5); });
    assert.equal(m.battle.sides[0].team.length, 4);
    assert.equal(last, 'ended');
  });

  await test('Ultimate Forms: seven forms, +100 BST, HP unchanged, once per team', () => {
    const { FINAL_SMASHES } = require('../shared/megas.js');
    const F = Object.fromEntries(require('../shared/fighters.json').map(f => [f.id, f]));
    const sum = st => Object.values(st).reduce((a, c) => a + c, 0);
    assert.deepEqual(Object.values(FINAL_SMASHES).map(x => x.id).sort(), ['all-black-gorr', 'darkchylde', 'endsong-inferno', 'feast-of-the-abyss', 'kumiho', 'monster-hulk', 'the-hood-gun-demon-form']);
    for (const fs of Object.values(FINAL_SMASHES)) {
      const base = F[fs.base];
      assert.equal(sum(fs.stats), sum(base.stats) + 100, fs.name + ' is +100 BST');
      assert.equal(fs.stats.hp, base.stats.hp, fs.name + ' keeps HP');
      assert(ABILITIES[fs.ability.name], fs.ability.name + ' has a spec');
    }
    const b = battle([mk('magik', 'Soulsword', ['Psycho Cut', 'Protect'], { item: 'Limbo Bloodstone' })], [mk('thor', 'God of Thunder', ['Protect', 'Bulk Up'])]);
    const req = b.getRequest(0);
    assert.equal(req.actives[0].finalSmash.name, 'Darkchylde');
    const m = b.sides[0].team[0], hp = m.maxhp;
    b.choose(0, { actions: [{ pos: 0, type: 'move', index: 0, mega: true }] }); b.choose(1, mv(1));
    assert.equal(m.species.id, 'darkchylde'); assert.deepEqual(m.types, ['Dark', 'Ghost']); assert.equal(m.maxhp, hp);
    assert.equal(m.ability, 'Queen of Limbo');
    assert.equal(b.sides[1].team[0].boosts.atk, 1 - 1, 'Intimidate on transforming (Thor +1 from Bulk Up, -1)');
    assert.equal(b.getRequest(0).actives[0].finalSmash, null, 'once per battle');
  });

  await test('Monster Hulk: Hulk can transform, Bruce Banner cannot; no more Puny Banner', () => {
    const b = battle([mk('hulk', 'Puny Banner', ['Hammer Arm', 'Protect'], { item: 'Gamma Bomb' })], [mk('thor', 'God of Thunder', ['Protect', 'Bulk Up'])]);
    const h = b.sides[0].team[0];
    h.hp = Math.floor(h.maxhp / 4);
    b.choose(0, mv(1)); b.choose(1, mv(1));
    assert.equal(h.species.id, 'bruce-banner');
    assert.equal(b.getRequest(0).actives[0].finalSmash, null, 'Bruce cannot go Monster');
    h.hp = h.maxhp; b.choose(0, mv(1)); b.choose(1, mv(1));
    assert.equal(h.species.id, 'hulk');
    b.choose(0, { actions: [{ pos: 0, type: 'move', index: 1, mega: true }] }); b.choose(1, mv(1));
    assert.equal(h.species.id, 'monster-hulk'); assert.equal(h.ability, 'World Breaker');
    h.hp = 5; b.choose(0, mv(1)); b.choose(1, mv(1));
    assert.equal(h.species.id, 'monster-hulk', 'Monster Hulk never turns back into Bruce');
  });

  await test('a flinch is logged with an animation event', () => {
    const b = battle([mk('black-widow', 'Red Room Training', ['Fake Out'])], [mk('captain-america', 'Never Surrender', ['Smart Strike'])]);
    b.sides[0].team[0].stats.spe = 999;
    b.choose(0, mv(0)); b.choose(1, mv(0));
    const ev = b.log.find(l => l.a && l.a.k === 'flinch');
    assert(ev, 'flinch event'); assert.match(ev.text, /flinched/);
  });

  await test("genders: infatuation (Ragin' Cajun) needs opposite genders; genderless is immune", () => {
    const MOVES = require('../shared/moves.js');
    const tryInfatuate = attacker => {
      let hits = 0;
      for (let k = 0; k < 40; k++) {
        const b = battle([mk(attacker, require('../shared/fighters.json').find(f => f.id === attacker).abilities[0].name, ['Smart Strike'])], [mk('gambit', "Ragin' Cajun", ['Protect'])]);
        const a = b.sides[0].team[0], t = b.sides[1].team[0];
        b.rng = () => 0.01;
        b.contactReactions(a, t, MOVES['Smart Strike']);
        if (a.v.attract) hits++;
      }
      return hits;
    };
    assert.equal(tryInfatuate('storm'), 40, 'female attacker vs male Gambit');
    assert.equal(tryInfatuate('captain-america'), 0, 'male vs male');
    assert.equal(tryInfatuate('ultron'), 0, 'genderless');
  });

  // ---------------- MARVEL-mon mechanics ----------------
  await test('Puny Banner: Hulk becomes Bruce Banner below 1/3 HP and turns back above 1/2', () => {
    const b = battle([mk('hulk', 'Puny Banner', ['Protect', 'Bulk Up'])], [mk('captain-america', 'Never Surrender', ['Bulk Up'])]);
    const h = b.sides[0].team[0];
    h.hp = Math.floor(h.maxhp * 0.3);
    b.choose(0, mv(1)); b.choose(1, mv(0));
    assert.equal(h.species.id, 'bruce-banner'); assert.deepEqual(h.types, ['Normal', 'Poison']);
    assert(Math.abs(h.hpFrac() - 0.3) < 0.03, 'keeps its HP percentage');
    assert.match(text(b), /puny Bruce Banner/);
    assert(b.log.some(l => l.a && l.a.k === 'mega' && l.a.id === 'bruce-banner'), 'client sees the form change');
    h.hp = Math.floor(h.maxhp * 0.8);
    b.choose(0, mv(1)); b.choose(1, mv(0));
    assert.equal(h.species.id, 'hulk'); assert.deepEqual(h.types, ['Fighting', 'Poison']);
    assert.match(text(b), /HULK SMASH/);
  });

  await test('Eternal Bond: Dagger tags in for Fairy/Psychic moves, Cloak for Dark/Ghost; Ally Switch tags in singles', () => {
    const b = battle([mk('cloak-and-dagger', 'Eternal Bond', ['Moonblast', 'Dark Pulse', 'Ally Switch', 'Protect'])], [mk('groot', 'Flora Colossus', ['Protect', 'Bulk Up'])]);
    const c = b.sides[0].team[0];
    assert.equal(c.species.id, 'cloak-and-dagger'); assert.deepEqual(c.types, ['Fairy'], 'starts as Dagger');
    b.choose(0, mv(0)); b.choose(1, mv(1));
    assert.equal(c.species.id, 'cloak-and-dagger', 'Fairy move keeps Dagger in');
    b.choose(0, mv(1)); b.choose(1, mv(1));
    assert.equal(c.species.id, 'cloak-form'); assert.deepEqual(c.types, ['Dark']);
    assert(b.log.some(l => l.a && l.a.k === 'mega' && l.a.id === 'cloak-form'), 'client sees the tag');
    assert.match(text(b), /Cloak stepped in/);
    b.choose(0, mv(0)); b.choose(1, mv(1));
    assert.equal(c.species.id, 'cloak-and-dagger');
    b.choose(0, mv(2)); b.choose(1, mv(1));
    assert.equal(c.species.id, 'cloak-form', 'Ally Switch tags with no ally');
    assert(!/But it failed/.test(text(b)));
  });

  await test('Light and Darkforce: they trade places every turn and the incoming partner heals 1/16', () => {
    const b = battle([mk('cloak-and-dagger', 'Light and Darkforce', ['Protect', 'Calm Mind'])], [mk('groot', 'Flora Colossus', ['Protect', 'Bulk Up'])]);
    const c = b.sides[0].team[0];
    c.hp = Math.floor(c.maxhp / 2); const hp0 = c.hp;
    b.choose(0, mv(1)); b.choose(1, mv(1));
    assert.equal(c.species.id, 'cloak-form'); assert.equal(c.hp, hp0 + Math.floor(c.maxhp / 16));
    b.choose(0, mv(1)); b.choose(1, mv(1));
    assert.equal(c.species.id, 'cloak-and-dagger');
    assert.equal(c.boosts.spa, 2, 'boosts carry over');
  });

  await test("Power Absorption: Rogue copies an allowed ability, fails on one that isn't", () => {
    const RULES = require('../shared/abilityrules.js');
    assert(RULES.rogueCanCopy('Healing Factor')); assert(!RULES.rogueCanCopy('Puny Banner'));
    const ok = battle([mk('rogue', 'Power Absorption', ['Protect'])], [mk('wolverine', 'Healing Factor', ['Protect'])]);
    assert.equal(ok.sides[0].team[0].ability, 'Healing Factor');
    const no = battle([mk('rogue', 'Power Absorption', ['Protect'])], [mk('hulk', 'Puny Banner', ['Protect'])]);
    assert.equal(no.sides[0].team[0].ability, 'Power Absorption');
    assert.match(text(no), /can't be copied/);
  });

  await test('Fourth Wall: Deadpool gets a random ability from the allowed list each time he comes in', () => {
    const RULES = require('../shared/abilityrules.js');
    const seen = new Set();
    for (let i = 0; i < 30; i++) {
      const b = new Battle({ format: 'singles', players: [{ name: 'A', team: [mk('deadpool', 'Fourth Wall', ['Protect'])] }, { name: 'B', team: [mk('loki', 'Trickster', ['Protect'])] }] });
      const a = b.sides[0].team[0].ability; seen.add(a);
      assert(RULES.deadpoolCanRoll(a) && a !== 'Fourth Wall', a);
    }
    assert(seen.size > 5, 'varies');
  });

  await test('Phoenix Force revives once at 50%; Regenerative Cocoon revives at the end of the next turn', () => {
    const b = battle([mk('phoenix', 'Phoenix Force', ['Protect'])], [mk('captain-america', 'Never Surrender', ['Bulk Up'])]);
    const p = b.sides[0].team[0];
    b.damage(p, p.maxhp, 'test', { direct: true });
    assert(!p.fainted && Math.abs(p.hpFrac() - 0.5) < 0.02);
    b.damage(p, p.maxhp, 'test', { direct: true });
    assert(p.fainted, 'only once');
    const c = battle([mk('adam-warlock', 'Regenerative Cocoon', ['Calm Mind']), mk('loki', 'Trickster', ['Nasty Plot'])], [mk('captain-america', 'Never Surrender', ['Smart Strike'])]);
    const adam = c.sides[0].team[0]; adam.hp = 1;
    c.choose(0, mv(0)); c.choose(1, mv(0));
    assert(adam.fainted);
    c.choose(0, { switches: [{ pos: 0, index: 1 }] });
    c.sides[0].team[1].hp = c.sides[0].team[1].maxhp; c.sides[1].team[0].moves[0].pp = 99;
    c.choose(0, mv(0)); c.choose(1, { actions: [{ pos: 0, type: 'move', index: 0 }] });
    assert(!adam.fainted && adam.hp > 0, 'Adam came back');
    assert.match(text(c), /emerged from its cocoon/);
  });

  await test('terrains: God of Thunder sets Electric Terrain (no sleep, Electric boost); Psychic Terrain blocks priority', () => {
    const b = battle([mk('thor', 'God of Thunder', ['Thunder Punch'])], [mk('luna-snow', 'K-pop Idol', ['Sing'])]);
    assert.equal(b.field.terrain, 'electric');
    b.choose(0, mv(0)); b.choose(1, mv(0));
    assert.notEqual(b.sides[0].team[0].status, 'slp');
    const p = battle([mk('psylocke', 'Psionic Butterfly', ['Swords Dance'])], [mk('captain-america', 'Never Surrender', ['Mach Punch'])]);
    assert.equal(p.field.terrain, 'psychic');
    const hp = p.sides[0].team[0].hp;
    p.choose(0, mv(0)); p.choose(1, mv(0));
    assert.match(text(p), /protected by the Psychic Terrain/);
    assert.equal(p.sides[0].team[0].hp, hp);
  });

  await test('Magic Room suppresses held items while it lasts', () => {
    const b = battle([mk('scarlet-witch', 'Chaos Magic', ['Magic Room', 'Protect'], { item: 'Leftovers' })], [mk('captain-america', 'Never Surrender', ['Bulk Up'], { item: 'Choice Band' })]);
    b.choose(0, mv(0)); b.choose(1, mv(0));
    assert.equal(b.field.magicroom, 4);
    assert.equal(b.sides[1].team[0].item, ''); assert.equal(b.sides[1].team[0]._item, 'Choice Band');
    for (let i = 0; i < 5; i++) { b.choose(0, mv(1)); b.choose(1, mv(0)); }
    assert.equal(b.sides[1].team[0].item, 'Choice Band', 'items come back');
  });

  await test("Demonic Energy: The Hood enters Half-Demon State after 3 attacks", () => {
    const b = battle([mk('the-hood', 'Demonic Energy', ['Dark Pulse'])], [mk('groot', 'Flora Colossus', ['Protect', 'Synthesis'], { ivs: ivs31 })]);
    for (let i = 0; i < 3; i++) { b.choose(0, mv(0)); b.choose(1, mv(1)); }
    assert.match(text(b), /Half-Demon State/);
  });

  await test('Squirrel Army / Arsenal: Population Bomb always hits 10 times', () => {
    const b = battle([mk('squirrel-girl', 'Squirrel Army', ['Population Bomb'])], [mk('groot', 'Flora Colossus', ['Synthesis'])]);
    b.rng = () => 0.5;
    b.choose(0, mv(0)); b.choose(1, mv(0));
    assert.match(text(b), /Hit 10 times!/);
  });

  await test('God Butcher hits heroes with a higher base stat total harder; Bad Luck stops crits', () => {
    const MOVES = require('../shared/moves.js');
    const b = battle([mk('gorr', 'God Butcher', ['Shadow Claw']), mk('gorr', 'Black Berserkers', ['Shadow Claw'])], [mk('doctor-strange', 'Sorcerer Supreme', ['Protect'])]);
    const [g1, g2] = b.sides[0].team; const t = b.sides[1].team[0];
    const d1 = b.calcDamage(g1, t, MOVES['Shadow Claw'], 70, 1, true).dmg, d2 = b.calcDamage(g2, t, MOVES['Shadow Claw'], 70, 1, true).dmg;
    assert(d1 / d2 > 1.25 && d1 / d2 < 1.35, 'ratio ' + d1 / d2);
    const c = battle([mk('magik', 'Soulsword', ['Night Slash'])], [mk('black-cat', 'Bad Luck', ['Protect'])]);
    c.rng = () => 0.001;
    assert.equal(c.calcDamage(c.sides[0].team[0], c.sides[1].team[0], MOVES['Night Slash'], 70, 1, false).crit, false);
  });

  await test('Diamond Form doubles Defense and halves Sp. Atk below half HP', () => {
    const b = battle([mk('emma-frost', 'Diamond Form', ['Protect'])], [mk('captain-america', 'Never Surrender', ['Bulk Up'])]);
    const e = b.sides[0].team[0]; const def = b.getStat(e, 'def'), spa = b.getStat(e, 'spa');
    b.damage(e, e.maxhp * 0.6, 'test');
    assert.equal(b.getStat(e, 'def'), def * 2); assert.equal(b.getStat(e, 'spa'), Math.floor(spa * 0.5));
  });

  await test('Heal Pulse heals the user in singles and the ally in doubles; Life Dew heals both', () => {
    const s = battle([mk('luna-snow', 'K-pop Idol', ['Heal Pulse'])], [mk('captain-america', 'Never Surrender', ['Bulk Up'])]);
    const l = s.sides[0].team[0]; l.hp = 10; s.choose(0, mv(0)); s.choose(1, mv(0));
    assert(l.hp > 10);
    const d = battle([mk('luna-snow', 'K-pop Idol', ['Life Dew']), mk('thor', 'God of Thunder', ['Bulk Up'])], [mk('captain-america', 'Never Surrender', ['Bulk Up']), mk('loki', 'Trickster', ['Protect'])], 'doubles');
    const [luna, thor] = d.sides[0].team; luna.hp = 10; thor.hp = 10;
    d.choose(0, { actions: [{ pos: 0, type: 'move', index: 0 }, { pos: 1, type: 'move', index: 0 }] });
    d.choose(1, { actions: [{ pos: 0, type: 'move', index: 0 }, { pos: 1, type: 'move', index: 0 }] });
    assert(luna.hp > 10 && thor.hp > 10);
  });

  await test('Hyper Beam needs a recharge turn', () => {
    const b = battle([mk('iron-man', 'Arc Reactor', ['Hyper Beam', 'Protect'])], [mk('groot', 'Flora Colossus', ['Synthesis'])]);
    b.sides[0].team[0].stats.spe = 999; b.rng = () => 0.3;
    b.choose(0, mv(0)); b.choose(1, mv(0));
    const r = b.getRequest(0); assert.equal(r.actives[0].locked, 'Recharge');
    b.choose(0, mv(0)); b.choose(1, mv(0));
    assert.match(text(b), /must recharge/);
  });

  await test('every hero ability has an engine spec', () => {
    const A = require('../server/engine/abilities.js');
    const F = require('../shared/fighters.json');
    for (const f of F) for (const a of [...f.abilities, f.hidden]) assert(A[a.name], `${f.name}: ${a.name}`);
  });

  console.log(`${passed} passed`);
})();
