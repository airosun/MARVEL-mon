# MARVEL-mon

A Pokémon VGC-style battle site where every Marvel Rivals hero is a "mon" with types, base stats based on their in-game kit, a move pool of real Pokémon moves (from their Rivals kit and the comics), and an ability and hidden ability from comic lore. The site uses the same layout as SSBU-mon, with a Marvel Rivals color scheme.

## How it plays
## How it plays

**Formats (VGC rules, level 50):**
- **Singles:** bring 6, pick 3.
- **Doubles:** bring 6, pick 4. Two heroes are out per side, you choose targets, and spread moves (Earthquake, Rock Slide, Hyper Voice…) hit several heroes for 75% damage.
- **Clauses:** one of each hero per team, and one of each item per team (item clause). Any hero can hold any item except three signature items: Mjolnir (Thor), Captain America's Shield and the Eye of Agamotto (Doctor Strange).

**Genders:** each hero is male, female or genderless (Ultron). Gender matters for infatuation and Captivate: only opposite genders are affected, and genderless heroes never are. Genders are shown with ♂/♀ and exported as `(M)`/`(F)`. The data lives in `shared/genders.js`.

**Ultimates (Megas):** not in this version yet. The engine still supports transformation items, and Ultimates will be added later in `shared/megas.js`.

**Standard Battle**
1. Each player gets 20 random heroes with random natures, random IVs (0–31) and either their standard or hidden ability. Pick 6.
2. Choose moves (up to 4 from each hero's move pool) and an item for each of your 6.
3. Both teams of 6 are revealed.
4. Each player secretly picks their lineup in order (3 for singles, 4 for doubles). The first one (singles) or two (doubles) lead.
5. Battle.

**Elite Battle**
1. Bring a pre-built team of 6 from your roster (built in the **Elite Teams** tab).
2. Both teams of 6 are revealed.
3. Pick your lineup in secret, then battle.

**Hero Pass:** 3 rolls per day (the day resets at midnight US Eastern). Each roll shows 20 random heroes, randomized the same way as Standard, and you keep up to 5 for your roster.

**Accounts:** sign in with a username and password (the **Sign in** button, top right) to save your roster, Elite teams and daily Hero Pass rolls to your account, so they follow you to any device. You can still play as a guest: a guest's roster and teams are saved in that browser. When you sign in or create an account, that browser's roster, teams and today's Hero Pass rolls move into the account. Rolls already used that day still count, so switching accounts doesn't give extra rolls. Edits from another tab or device are picked up automatically. Each roster hero carries a server signature, so its nature, IVs and ability can't be edited before an Elite battle. Accounts have no email, so a forgotten password can't be reset from the site.

**Hand-drawn sprites:** drawings on a white background go in `public/sprites-raw/` (named like `spider-man_front.png` / `spider-man_back.png`; see the README there). `npm run sprites` (`tools/process_sprites.py`) removes the white background, keeps each hero's size relative to its canvas, and lines everyone up on the same ground line in `public/sprites/`. Drawings are used only on the battlefield: front for the opponent's side, back for yours. The Herodex, Battler Cards and menus keep the official art, and so does any hero that hasn't been drawn yet.

**Battle screen:** a Pokémon-style field (opponents' heroes in the top right, yours seen from behind in the bottom left, each side on a platform, HP cards in the opposite corners) with animated turn playback (attacks, hits, faints, switches, stat changes) with a speed setting (normal, fast or off). Hover a move to see what it does. Tap a hero's image to target it, and every hero a move will hit flashes before you confirm. A **Type chart** button highlights the opposing heroes' types.

**Battle clock (player vs player):** each decision has a 45-second turn limit. When it runs out, a move is picked for you. That time comes out of a 7-minute **Your Time** bank, and running the bank out loses the battle. The whole battle has a 20-minute game clock. When it ends, the side with more heroes left wins (then more HP left). Before the battle, drafting, building and picking your lineup each have a time limit (90s / 4 min / 90s), with automatic picks when time runs out. Battles against the CPU are not timed.

**Scouting:** in team preview and in battle, hover (or tap) an opposing hero to see its base stats, its level 50 Speed range, and its possible abilities. In battle you also see the moves it has used and any ability or item it has revealed.

**After a battle:** **Rematch** (vs the CPU it starts right away; vs a player both have to accept, with the same Elite teams), a **replay link**, and quick-chat buttons (GG, Good luck!, …).

**Replays:** every finished battle is saved, and `/replay/<id>` plays it back with the animations. The newest 5,000 battles keep their replays.

**Stats tab:** your win/loss record by mode and opponent, your most-used heroes, your recent battles with replays, site-wide **hero usage** (how often each hero is brought and its win rate, by format, over the last 7/30/90 days), and recent player battles.

**Battler Cards:** signed-in players get a card in one of 12 colors, with a hero avatar (any hero, or Bruce Banner), a title, a short bio, a showcase Elite team, their record and their favorite heroes. Edit yours from the account menu (click your name at the top) or the Stats tab. Titles, bios and showcase team names can't contain curse words or slurs. Disguised spellings are caught too (see `server/moderation.js`). Tap a signed-in player's name in the Online list to see theirs. Their avatar also shows next to their name.

**Sound:** battle sound effects for hits, super effective and critical hits, misses, switching, stat changes, healing, fainting, flinches, Protect, transformations, and a win or lose cue. They're synthesized in the browser, with no audio files. The 🔊 button at the top sets the volume or mutes, saved per browser. There's no background music yet (`public/audio.js`).

**Calc tab:** a damage calculator that uses the battle engine. Set the attacker and defender (hero, ability, nature, IVs, item, boosts, status, HP) and the field (weather, screens, crit, doubles spread), and it shows the damage range and how many hits it takes to KO. You can load a hero straight from your roster.

**Import / export:** in Elite Teams, **Export** gives a Showdown-style text version of a team. **Import** takes one and matches each hero to the closest one in your roster (nature, ability, IVs). It skips moves the hero can't learn and items it can't hold, and tells you what it changed.

The **What is MARVEL-mon?** tab (`public/about.js`) is an in-site guide to everything below.

You can battle the CPU, find a random opponent (queues are separate for each mode and format), challenge an online player, or watch live matches. The home page shows the **most used heroes** today and all time. Each battle has its own chat.

## Marvel mechanics

- **Hulk / Puny Banner:** below 1/3 HP at the end of a turn, Hulk turns back into **Bruce Banner** (Normal/Poison, frail but fast). Healed back above 1/2 HP, Bruce turns into Hulk again. HP percentage is kept, and Bruce uses Hulk's chosen moves.
- **Rogue / Power Absorption:** copies the foe's ability on entry, but only abilities checked as copyable in the design sheet (`shared/abilityrules.js`). Anything else makes it fail.
- **Deadpool / Fourth Wall:** rolls a random ability on entry from the abilities checked as rollable.
- **Phoenix Force, Cocoon, Diamond Form, Demonic Energy, God Butcher, Bad Luck** and the other lore abilities are described in the in-site guide and implemented in `server/engine/abilities.js`.
- **Terrains** (Electric, Psychic, Misty) and **Magic Room** are in, with their usual effects on grounded heroes.

## Design data

The sheet the heroes were designed in (types, stats, movesets, abilities, Rogue/Deadpool rules, balance notes, items) is exported to `tools/source/` (`heroes.json`, `movepools.json`, `abilities.json`, `items.json`).
`tools/build_heroes.py` turns that into `shared/fighters.json` (the internal file name is kept from the original engine), adding Protect to every pool and checking every move exists. `tools/gen_moves.js` generated the base move entries in `shared/moves.js`.

To change a hero: edit `tools/source/*.json` (or re-export from the sheet), add any new move to `shared/moves.js` (and to the spread lists if it hits several heroes in doubles), then run `npm run build:heroes` and `npm test`.

## Run it locally

```bash
npm install
npm start          # http://localhost:3000
npm test           # mechanics tests, 200 simulated matches, and a 100-battle random fuzz of every move, ability and item
```

## Deploy on Render

Use `render.yaml` (Blueprint), or create a Web Service by hand:

- Build command: `npm install`
- Start command: `npm start`
- Environment variables:
  - **`MARVEL_SECRET`**: a long random value. It signs roster heroes. If it changes, every saved roster hero stops being valid. `render.yaml` generates one for you.
  - **`DATABASE_URL`**: a Postgres connection string (Neon's free plan works). Accounts, saved teams and Hero Pass rolls are stored there. Without it the server keeps them in memory, and Render's free tier loses them on every restart. The server creates its tables on startup.

## Hero art

Drop art into `public/images/<hero id>.png` (for example `spider-man.png`, `bruce-banner.png`) and run `npm run build:heroes`. Until then each hero shows a type-colored badge with its initials. Hand-drawn battle sprites go in `public/sprites-raw/` and are processed with `npm run sprites`.

## Project layout

| Path | What it is |
| --- | --- |
| `tools/source/` | Design data exported from the hero sheet |
| `tools/build_heroes.py` | Builds `shared/fighters.json` from `tools/source/` |
| `shared/fighters.json` | Generated hero data: types, stats, abilities, signature moves, move pools |
| `shared/moves.js` | Move database (type, power, accuracy, PP, effects, doubles targeting) |
| `shared/dex.js` | Type chart, natures, items, stat formula |
| `shared/abilityrules.js` | Which abilities Rogue can copy and Deadpool can roll |
| `shared/megas.js` | Alternate forms (Bruce Banner) and, later, Ultimates |
| `server/engine/battle.js` | Battle engine (singles and doubles) |
| `server/engine/abilities.js` | Maps each lore ability to the mechanic it uses |
| `server/engine/ai.js` | CPU: drafting, sets, lineups, battling |
| `server/index.js` | Express + Socket.IO server |
| `public/` | Browser client |

## Notes and simplifications

- There are no EVs: heroes are defined by nature, IVs, ability, moves and item.
- Weight isn't modelled: Low Kick is a flat 60 BP, Heavy Slam a flat 100.
- In singles, Heal Pulse, Floral Healing and Purify heal the user instead.
- Revival Blessing revives the hero that fainted most recently.
- Ultimates (Megas) are not in yet.
