// Gender for each hero. type: M (male), F (female), N (genderless), B (both), X (either: rolled in
// Quick Match using the male percentage, chosen in Competitive).
(function () {
  const GENDERS = {
 "adam-warlock": {
  "type": "M"
 },
 "black-panther": {
  "type": "M"
 },
 "black-widow": {
  "type": "F"
 },
 "captain-america": {
  "type": "M"
 },
 "cloak-and-dagger": {
  "type": "B"
 },
 "cloak-form": {
  "type": "B"
 },
 "doctor-strange": {
  "type": "M"
 },
 "groot": {
  "type": "M"
 },
 "hawkeye": {
  "type": "M"
 },
 "hela": {
  "type": "F"
 },
 "hulk": {
  "type": "M"
 },
 "iron-fist": {
  "type": "M"
 },
 "iron-man": {
  "type": "M"
 },
 "jeff-the-land-shark": {
  "type": "M"
 },
 "loki": {
  "type": "X",
  "male": 50,
  "default": "M",
  "images": {
   "F": "loki-female.webp"
  },
  "names": {
   "F": "Lady Loki"
  }
 },
 "luna-snow": {
  "type": "F"
 },
 "magik": {
  "type": "F"
 },
 "magneto": {
  "type": "M"
 },
 "mantis": {
  "type": "F"
 },
 "moon-knight": {
  "type": "M"
 },
 "namor": {
  "type": "M"
 },
 "peni-parker": {
  "type": "F"
 },
 "psylocke": {
  "type": "F"
 },
 "the-punisher": {
  "type": "M"
 },
 "rocket-raccoon": {
  "type": "M"
 },
 "scarlet-witch": {
  "type": "F"
 },
 "spider-man": {
  "type": "M"
 },
 "squirrel-girl": {
  "type": "F"
 },
 "star-lord": {
  "type": "M"
 },
 "storm": {
  "type": "F"
 },
 "thor": {
  "type": "M"
 },
 "venom": {
  "type": "M"
 },
 "winter-soldier": {
  "type": "M"
 },
 "wolverine": {
  "type": "M"
 },
 "mister-fantastic": {
  "type": "M"
 },
 "invisible-woman": {
  "type": "F"
 },
 "human-torch": {
  "type": "M"
 },
 "the-thing": {
  "type": "M"
 },
 "emma-frost": {
  "type": "F"
 },
 "ultron": {
  "type": "N"
 },
 "phoenix": {
  "type": "F"
 },
 "blade": {
  "type": "M"
 },
 "angela": {
  "type": "F"
 },
 "daredevil": {
  "type": "M"
 },
 "gambit": {
  "type": "M"
 },
 "rogue": {
  "type": "F"
 },
 "deadpool": {
  "type": "M"
 },
 "elsa-bloodstone": {
  "type": "F"
 },
 "white-fox": {
  "type": "F"
 },
 "black-cat": {
  "type": "F"
 },
 "devil-dinosaur": {
  "type": "M"
 },
 "cyclops": {
  "type": "M"
 },
 "jubilee": {
  "type": "F"
 },
 "the-hood": {
  "type": "M"
 },
 "gorr": {
  "type": "M"
 },
 "nightcrawler": {
  "type": "M"
 },
 "bruce-banner": {
  "type": "M"
 }
  };
  const FORM_IMAGES = {};
  const SYMBOL = { M: '♂', F: '♀' };
  function info(id) { return GENDERS[id] || { type: 'N' }; }
  // the gender a fighter has when nothing is chosen (old saved fighters, fixed genders)
  function defaultGender(id) { const g = info(id); return g.type === 'X' ? g.default : g.type; }
  function choices(id) { return info(id).type === 'X' ? ['M', 'F'] : [defaultGender(id)]; }
  function roll(id, rng = Math.random) { const g = info(id); return g.type === 'X' ? (rng() * 100 < g.male ? 'M' : 'F') : g.type; }
  function normalize(id, gender) { return choices(id).includes(gender) ? gender : defaultGender(id); }
  // M and F can be infatuated by the opposite gender; genderless and "both" never are
  function opposite(a, b) { return (a === 'M' && b === 'F') || (a === 'F' && b === 'M'); }
  function image(id, gender, fallback) { const g = GENDERS[id]; const alt = (g && g.images && g.images[gender]) || (FORM_IMAGES[id] && FORM_IMAGES[id][gender]); return alt || fallback; }
  function label(id) { const g = info(id); return g.type === 'X' ? g.male + '% male / ' + (100 - g.male) + '% female' : { M: 'Male', F: 'Female', N: 'Genderless', B: 'Both (one of each)' }[g.type]; }
  const api = { GENDERS, FORM_IMAGES, SYMBOL, info, defaultGender, choices, roll, normalize, opposite, image, label };
  if (typeof module !== 'undefined') module.exports = api;
  if (typeof window !== 'undefined') window.GENDER = api;
})();
