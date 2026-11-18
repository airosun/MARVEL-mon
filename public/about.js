/* "What is MARVEL-mon?" tab: a guide to the site, each tab, and how battles work.
   Counts (heroes, moves, items, Ultimates) come from the live game data. */
(() => {
  const U = window.SSBU;
  const { $, $$, esc, S, sprite, typeChip } = U;

  const goto = (tab, text) => `<a href="#" class="goto" data-goto-tab="${tab}">${text} →</a>`;
  const SECTIONS = [
    ['overview', 'What is MARVEL-mon?'],
    ['start', 'Getting started'],
    ['modes', 'Battle modes'],
    ['battle', 'How battles work'],
    ['finalsmash', 'Ultimate Forms'],
    ['heroes', 'Heroes: stats, abilities, natures, IVs'],
    ['marvel', 'Marvel mechanics'],
    ['tabs', 'The tabs'],
    ['accounts', 'Accounts & Battler Cards'],
    ['pvp', 'Playing other people'],
    ['road', 'Road to 50 Wins'],
    ['rooms', 'Private rooms'],
    ['tips', 'Tips'],
  ];

  function render() {
    const d = S.dex;
    const nFighters = d.fighters.length;
    const nMoves = new Set(d.fighters.flatMap(f => f.learnset)).size;
    const fs = Object.values(d.finalSmashes || {});
    const nFsFighters = new Set(fs.flatMap(x => x.bases)).size;
    const nItems = Object.keys(d.items).filter(i => !(d.finalSmashes || {})[i]).length;
    const showcase = ['spider-man', 'iron-man', 'thor', 'storm', 'hulk', 'scarlet-witch', 'wolverine', 'jeff-the-land-shark'].filter(id => S.byId[id]);
    const fsExamples = fs.filter(x => ['giga-bowser', 'mega-charizard-x', 'super-sonic', 'devil-kazuya', 'pneuma', 'grima'].includes(x.id));
    const types = Object.keys(d.chart || {}).length ? Object.keys(d.chart) : ['Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice', 'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy'];

    $('#view').innerHTML = `<div class="about">
      <nav class="about-nav card"><div class="muted small" style="text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px">On this page</div>${SECTIONS.map(([id, t]) => `<a href="#" data-jump="${id}">${esc(t)}</a>`).join('')}</nav>
      <div class="about-body">

      <section class="card about-hero" id="ab-overview">
        <div class="about-sprites">${showcase.map(id => sprite(S.byId[id], 'sm')).join('')}</div>
        <h1>What is MARVEL-mon?</h1>
        <p class="lead">MARVEL-mon is a Pokémon-style battle game starring the heroes of <b>Marvel Rivals</b>. Every hero is a "mon" with one or two types, base stats based on its in-game health and kit, a move pool of real Pokémon moves based on its Marvel Rivals abilities (and the comics), and a standard and hidden ability drawn from its comic lore.</p>
        <p>Battles follow the <b>Pokémon VGC</b> format used in official tournaments and in Pokémon Champions: everyone is level 50, you bring a team of 6 and secretly pick 3 (Singles) or 4 (Doubles) to battle with. The site works like Pokémon Showdown. You can battle the CPU or other people live, build teams, check damage with a calculator, and watch replays.</p>
        <div class="about-facts"><div><b>${nFighters}</b><span>heroes</span></div><div><b>${nMoves}</b><span>moves</span></div><div><b>18</b><span>types</span></div><div><b>${fs.length}</b><span>Ultimate forms</span></div><div><b>${nItems}</b><span>items</span></div></div>
      </section>

      <section class="card" id="ab-start"><h2>Getting started</h2>
        <ol class="about-steps">
          <li><b>Battle the CPU right away.</b> On ${goto('home', 'Home')}, leave <i>Standard Battle</i> and <i>Singles</i> selected and press <b>Battle the CPU</b>. You'll draft a random team. No setup needed.</li>
          <li><b>Make an account</b> (the <b>Sign in</b> button at the top) so your heroes, teams and daily rolls follow you to any device. Playing as a guest works too. Your stuff is just saved in that browser.</li>
          <li><b>Roll the ${goto('pass', 'Battle Pass')}</b> every day to collect heroes for your roster.</li>
          <li><b>Build an ${goto('elite', 'Elite team')}</b> from your roster and take it into Elite battles.</li>
          <li><b>Find an opponent</b> on Home, or challenge someone in the Online list.</li>
        </ol>
      </section>

      <section class="card" id="ab-modes"><h2>Battle modes</h2>
        <div class="about-two">
          <div><h3>Standard Battle</h3><p>Everyone starts on equal footing with a random draft:</p>
            <ol><li>You get <b>20 random heroes</b>, each with a random nature, random IVs and either its standard or hidden ability. <b>Pick 6.</b></li>
              <li>Choose up to <b>4 moves</b> and an <b>item</b> for each of your 6.</li>
              <li>Both teams of 6 are <b>revealed</b> to each other (team preview).</li>
              <li>Secretly choose your <b>lineup and order</b>: 3 in Singles, 4 in Doubles. Your first one (or two) lead.</li>
              <li>Battle!</li></ol></div>
          <div><h3>Elite Battle</h3><p>Bring a team you built ahead of time:</p>
            <ol><li>Choose one of your saved <b>Elite teams</b> (6 heroes from your roster with moves, items and genders set).</li>
              <li>Both teams are revealed, you pick your lineup in secret, and you battle.</li></ol>
            <p>Your roster heroes come from the Battle Pass, so building a great Elite team takes some collecting.</p></div>
        </div>
        <div class="about-two">
          <div><h3>Singles</h3><p>Bring 6, pick 3. One hero out per side.</p></div>
          <div><h3>Doubles</h3><p>Bring 6, pick 4. Two heroes out per side. You choose who each move targets, and <b>spread moves</b> (Earthquake, Rock Slide, Hyper Voice…) hit several heroes at <b>75% damage</b>.</p></div>
        </div>
        <p class="muted small"><b>Team rules:</b> one of each hero per team (species clause) and one of each item per team (item clause).</p>
      </section>

      <section class="card" id="ab-battle"><h2>How battles work</h2>
        <p>If you've played Pokémon, you already know how this works. Each turn, both players secretly choose an action for each of their heroes, and then the turn plays out:</p>
        <ul class="about-list">
          <li><b>Moves</b> have a type, category (Physical, Special or Status), power, accuracy and sometimes priority. <b>Hover</b> a move to see exactly what it does.</li>
          <li><b>Targeting:</b> in Doubles, tap a hero's picture to target it. Every hero a move will hit <b>flashes</b> before you confirm, including both foes for spread moves.</li>
          <li><b>Switching</b> takes your turn. Some moves (like U-turn and Volt Switch) attack and then switch out.</li>
          <li><b>Type matchups</b> work like Pokémon's 18 types. Super effective hits do 2× (or 4×), resisted hits do ½×, and immunities do nothing. Press <b>Types</b> at the top of any screen to see the full chart and check how a type combo takes damage. In battle, the opponents' types are highlighted (the battle's <b>Type chart</b> button opens the same chart).</li>
          <li><b>Same-type bonus (STAB):</b> a move matching its user's type does 1.5× damage.</li>
          <li><b>Status, weather, terrain and field effects</b> (burn, paralysis, sleep, Sun, Rain, Trick Room, Tailwind, screens…) all work as they do in Pokémon. Hover a field tag to see how many turns are left.</li>
          <li><b>Abilities</b> are custom and lore-based. Hover your own hero to see its stats, ability and item.</li>
          <li><b>Items:</b> the competitive Pokémon items (Leftovers, Life Orb, Choice items, Focus Sash, Assault Vest, Weakness Policy, type boosters…), Marvel items like the <b>Vibranium Shield</b>, <b>Super-Soldier Serum</b> and <b>Darkhold</b>, and three signature items only one hero can hold: <b>Mjolnir</b> (Thor), <b>Captain America's Shield</b> and the <b>Eye of Agamotto</b> (Doctor Strange).</li>
          <li><b>Animations:</b> every move has its own animation, and you'll see popups for <i>Missed!</i>, <i>Crit!</i>, <i>Blocked!</i> and <i>Flinched!</i>. Use the <b>Anim</b> setting (normal, fast or off) or <b>Skip</b> to speed things up.</li>
          <li><b>Scouting:</b> hover an opposing hero to see its base stats, its level 50 Speed range, its possible abilities and its Ultimate Form, plus any moves, ability or item it has already shown this battle.</li>
          <li><b>Winning:</b> knock out all of the opponent's heroes. You can also <b>Forfeit</b> at any time.</li>
          <li>Every move has a battle animation. To see them all in one place, open the <a href="/animations">Move Animation Gallery</a>.</li>
        </ul>
      </section>

      <section class="card" id="ab-finalsmash"><h2>Ultimate Forms</h2>
        <p>Ultimate Forms are MARVEL-mon's version of <b>Mega Evolution</b>. A hero holding its Ultimate Form item can transform once per battle, before it moves; only one hero per team can transform each battle. It keeps its HP but gets new stats (+100 total), types and an ability, and the item can't be knocked off, stolen or swapped.</p>
        ${fs.length ? `<p>${nFsFighters} heroes have an Ultimate Form right now:</p><table class="about-table"><tr><th>Form</th><th>Hero</th><th>Item</th><th>Types</th><th>Ability</th></tr>${fs.map(x => `<tr><td><b>${esc(x.name)}</b></td><td>${x.bases.map(b => esc((S.byId[b] || {}).name || b)).join(' / ')}</td><td>${esc(x.stone)}</td><td style="white-space:nowrap">${x.types.map(typeChip).join(' ')}</td><td><b>${esc(x.ability.name)}</b> <span class="muted">${esc(x.ability.desc)}</span></td></tr>`).join('')}</table>` : '<p><b>Coming soon.</b></p>'}
        <p class="muted small">Hulk has to be Hulk, not Bruce Banner, to become Monster Hulk, and Monster Hulk never turns back into Bruce.</p>
      </section>

      <section class="card" id="ab-heroes"><h2>Heroes: stats, abilities, natures, IVs</h2>
        <ul class="about-list">
          <li><b>Base stats</b> (HP, Attack, Defense, Sp. Atk, Sp. Def, Speed) are based on each hero's Marvel Rivals stats: HP from in-game health (shields included), speed from how mobile they are, and Attack or Sp. Atk from whether their kit is weapons and fists or energy and magic. Vanguards are the bulkiest, Strategists trade stats for support moves.</li>
          <li><b>Moves</b> marked ★ come straight from the hero's kit or comics (the note says which ability). Every hero can also learn Protect.</li>
          <li><b>Abilities:</b> every hero has a standard ability and a hidden ability based on its comic lore, and each hero you get has one of them at random.</li>
          <li><b>Natures</b> raise one stat by 10% and lower another by 10% (some are neutral). <b>IVs</b> (0–31 per stat) are random and fixed for each hero you get. There are no EVs.</li>
          <li><b>Genders</b> follow the comics (Ultron is genderless). Gender matters for infatuation (Gambit's Ragin' Cajun, Attract, Captivate).</li>
        </ul>
      </section>

      <section class="card" id="ab-marvel"><h2>Marvel mechanics</h2>
        <ul class="about-list">
          <li><b>Cloak &amp; Dagger:</b> one hero, two partners, starting as Dagger. With <b>Eternal Bond</b>, Cloak (Dark, bulky) steps in before a Dark or Ghost move and Dagger (Fairy, fast special attacker) before a Fairy or Psychic move. With <b>Light and Darkforce</b> they trade places at the end of every turn, and the partner coming in heals 1/16 HP. In singles, Ally Switch tags them too. HP, status, stat changes and item carry over.</li>
          <li><b>Hulk's Puny Banner:</b> below 1/3 HP, Hulk turns into <b>Bruce Banner</b> (Normal/Poison, much weaker stats) at the end of the turn. Heal him above half HP and he turns back into the Hulk. He keeps his moves, item and HP percentage.</li>
          <li><b>Rogue's Power Absorption</b> copies the foe's ability when she comes in, but only abilities on the designer's approved list. Anything else makes it fail.</li>
          <li><b>Deadpool's Fourth Wall</b> gives him a random ability (from an approved list) every time he enters battle.</li>
          <li><b>Comebacks:</b> Phoenix revives once at half HP the moment she's knocked out; Adam Warlock revives at the end of the turn after; Doctor Strange and Deadpool can survive one knockout hit with 1 HP; Squirrel Girl survives any hit from full HP.</li>
          <li><b>Terrains:</b> Thor sets Electric Terrain (Electric moves 1.3×, no sleep) and Psylocke sets Psychic Terrain (Psychic moves 1.3×, no priority moves against grounded heroes). Misty Terrain blocks status.</li>
          <li><b>Hero tricks:</b> The Hood enters a Half-Demon State after every 3 attacks; Emma Frost hardens into Diamond Form below half HP; Gorr hits heroes with a higher base stat total 1.3× harder; Black Cat's Bad Luck stops critical hits; Squirrel Girl's squirrel army always hits 10 times with Population Bomb.</li>
          <li>Hover any ability in the Herodex or in battle to see exactly what it does.</li>
        </ul>
      </section>

      <section class="card" id="ab-tabs"><h2>The tabs</h2>
        <div class="about-tabs">
          <div><h3>${goto('home', 'Home')}</h3><p>Pick a mode (Standard or Elite) and format (Singles or Doubles), then <b>Find opponent</b> or <b>Battle the CPU</b>. The <b>Online</b> list shows who's here: challenge them, or tap a signed-in player's name to see their Battler Card. You can also watch live matches, or create or join a <b>private room</b>. The <b>Most used heroes</b> panel shows what players are bringing today and of all time.</p></div>
          <div><h3>${goto('pass', 'Battle Pass')}</h3><p><b>3 rolls per day</b> (resets at midnight US Eastern). Each roll shows 20 random heroes with random natures, IVs, abilities and genders, and you <b>keep up to 5</b> for your roster. Your roster is listed below, sorted by hero. You can release heroes you don't want.</p></div>
          <div><h3>${goto('elite', 'Elite Teams')}</h3><p>Build teams of 6 from your roster. For each hero, pick up to 4 moves, an item and (if it can be either) its gender. Hover moves to see what they do. Teams must follow the species and item clauses. <b>Export</b> gives a team as Showdown-style text, and <b>Import</b> pastes one in, matching each hero to the closest one in your roster.</p></div>
          <div><h3>${goto('road', 'Road to 50')}</h3><p>A gauntlet of 50 boss fights against the CPU. Start with an Elite team, heroes you own or a random team, recruit heroes from the bosses you beat, and see how far you get. Your run saves after every floor.</p></div>
          <div><h3>${goto('dex', 'Herodex')}</h3><p>All ${nFighters} heroes with their types, base stats, abilities, move pools, gender and battle forms. Search by name, role, type or move. Filter by a type or a type combination (Ultimate forms included, or pick "None" for single-type heroes), and sort by Herodex number, BST or any single stat. Tap a hero for the full entry.</p></div>
          <div><h3>${goto('calc', 'Calc')}</h3><p>A <b>damage calculator</b> that runs the real battle engine, so its numbers match battles. Set the attacker and defender (nature, IVs, ability, item, Ultimate Form, stat boosts, status, HP) and the field (weather, screens, critical hit, Doubles spread). It shows the damage range and how many hits it takes to KO. You can load heroes straight from your roster.</p></div>
          <div><h3>${goto('stats', 'Stats')}</h3><p>Your <b>Battler Card</b>, your <b>win/loss record</b> (by mode, against players and the CPU), your most-used heroes and recent battles. It also has site-wide <b>hero usage</b> (how often each hero is brought and its win rate, by format, for today, 7/30/90 days or all time) and recent player battles. Every battle has a <b>▶ Watch</b> replay.</p></div>
        </div>
        <p class="muted small">The <b>🔊</b> button at the top sets the sound effects volume or mutes them, and your <b>name</b> opens your account menu.</p>
      </section>

      <section class="card" id="ab-accounts"><h2>Accounts & Battler Cards</h2>
        <ul class="about-list">
          <li><b>Accounts</b> use a username and password. Your roster, Elite teams and daily Battle Pass rolls are saved to your account and sync across devices. If you played as a guest first, signing in moves that browser's heroes and teams into your account.</li>
          <li>There's no email on accounts, so <b>keep your password somewhere safe</b>. You can change it from the account menu.</li>
          <li><b>Battler Card:</b> your public profile. Pick a card color, an avatar (any hero), a title, a short "about you" and a showcase team. It shows your record and favorite heroes. Edit it from the account menu (tap your name at the top) or the Stats tab. Curse words and slurs aren't allowed.</li>
          <li>Roster heroes are <b>signed by the server</b>, so nobody can edit their nature, IVs or ability.</li>
        </ul>
      </section>

      <section class="card" id="ab-pvp"><h2>Playing other people</h2>
        <ul class="about-list">
          <li><b>Find opponent</b> puts you in a queue for the mode and format you picked. You'll be matched with the next person who searches for the same thing. You can also challenge someone directly from the Online list.</li>
          <li><b>Battle clock</b> (player matches only): each turn has a <b>45-second</b> limit, taken from your <b>7-minute</b> time bank. If the turn timer runs out a move is picked for you, and if your bank runs out you lose. The whole battle has a <b>20-minute</b> game clock. When it ends, whoever has more heroes left wins (then more HP left). Drafting, building and picking your lineup also have time limits (90 seconds, 4 minutes, 90 seconds). Battles against the CPU aren't timed.</li>
          <li><b>Chat:</b> each battle has its own chat, with quick buttons (Good luck!, GG, Well played!, Nice!, Oops).</li>
          <li><b>After a battle:</b> <b>Rematch</b> (both players have to accept, and Elite teams are reused), copy a <b>replay link</b> to share, or go back to the lobby.</li>
          <li><b>Spectating:</b> live matches appear on Home, and anyone can watch.</li>
        </ul>
      </section>

      <section class="card" id="ab-road"><h2>Road to 50 Wins</h2>
        <ul class="about-list">
          <li>A single-player gauntlet of <b>50 boss fights</b> (Singles: bring 6, pick 3). The bosses are the <b>same for everyone, every run</b>, and get stronger as you climb: higher-BST teams, better natures, IVs, moves and items, and smarter battling. Floors 10, 20, 30, 40 and 50 hold the toughest boss of their ten. Every hero shows up on at least one boss team.</li>
          <li><b>Starting a run:</b> bring one of your Elite teams, pick 6 heroes from your roster, or get 6 random heroes with random natures, IVs, abilities and moves.</li>
          <li><b>Between floors</b> your team is fully healed, and you can change any hero's moves and items.</li>
          <li><b>Recruiting:</b> after each win you can take one hero from the boss's team, exactly as the boss built it, to replace one of yours for the rest of the run (it doesn't join your Battle Pass roster).</li>
          <li><b>One loss ends the run.</b> Your best floor and full clears are kept, and shown on your Battler Card.</li>
          <li>Runs save after every floor, so you can stop and come back later (signed in: on any device; guest: on this browser). You can even leave in the middle of a fight and pick it back up.</li>
        </ul>
      </section>

      <section class="card" id="ab-rooms"><h2>Private rooms</h2>
        <ul class="about-list">
          <li><b>Create a room</b> on Home to play with a group of friends. You get a 5-letter <b>room code</b> and an <b>invite link</b>; friends join by typing the code on Home or opening the link. Up to 16 people can be in a room.</li>
          <li><b>The line:</b> everyone who wants to battle is in line. The first two people in line battle, and <b>everyone else in the room watches</b> the battle live. Tap <b>Sit out</b> to only watch, and <b>Get in line</b> to play again.</li>
          <li><b>Taking turns:</b> the host picks a rotation. <b>Winner stays on</b>: the winner keeps battling and the loser goes to the back of the line. <b>Everyone rotates</b>: both players go to the back. The next battle starts automatically 10 seconds after each one ends.</li>
          <li><b>Host controls:</b> the host (👑) picks the mode, format and rotation (between battles), starts or pauses battles, reorders the line, makes someone else host, or removes people. If the host leaves, someone else becomes host.</li>
          <li><b>Elite rooms:</b> each person picks one of their Elite teams for the room before getting matched. Standard rooms use the usual draft.</li>
          <li>The room has its own <b>chat</b> and keeps everyone's wins and losses and the results of each battle. Room battles aren't listed on Home, and they still count toward your Stats.</li>
        </ul>
      </section>

      <section class="card" id="ab-tips"><h2>Tips</h2>
        <ul class="about-list">
          <li>Use <b>team preview</b> to plan: hover the opponent's heroes to check their Speed range and possible abilities before you pick your lineup.</li>
          <li>Run tricky matchups through the ${goto('calc', 'Calc')} before a big battle.</li>
          <li>In Doubles, <b>Protect</b>, <b>Fake Out</b> and spread moves are as strong as they are in real VGC.</li>
          <li>Strategists (Mantis, Luna Snow, Invisible Woman…) shine in Doubles with Life Dew, Heal Pulse, Helping Hand and Follow Me.</li>
          <li>Check <b>Stats → Hero usage</b> to see what's popular, then build a team that counters it.</li>
          <li>Roll your Battle Pass every day. Rolls don't carry over.</li>
        </ul>
        <div class="row" style="margin-top:10px"><button class="primary" data-goto-tab="home">Start battling</button><button data-goto-tab="pass">Roll the Battle Pass</button></div>
      </section>
      </div></div>`;

    $$('[data-goto-tab]').forEach(a => a.onclick = e => { e.preventDefault(); S.tab = a.dataset.gotoTab; U.render(); window.scrollTo(0, 0); });
    $$('[data-jump]').forEach(a => a.onclick = e => { e.preventDefault(); const el = document.getElementById('ab-' + a.dataset.jump); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
  }
  U.renderAbout = render;
})();
