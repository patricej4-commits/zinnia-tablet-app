// Sound Safari: phonics from the class (Abeka Special Sounds Charts 6-8, vowels,
// one- and two-vowel rules with marking, C/K rule, ck/k/ke, double consonants).
import { pick, shuffle, sample, esc, rnd } from '../util.js';
import { picOf } from './pictures.js';
import { REAL, hasBad } from './realwords.js';

// A made-up option is only fair if it is NOT a real word (and never a rude one)
const notWord = w => !REAL.has(w) && !hasBad(w);
// Pictures: skip ones that show the wrong thing (king = prince, jam = honey, block = brick, jet = small plane)
const NO_PIC = new Set(['king', 'jam', 'block', 'jet']);
const img = w => (NO_PIC.has(w) ? '' : w === 'stars' ? '⭐' : picOf(w));
const spaced = s => s.split('').join(' ');

// ---- Special sounds charts: sound -> words. First word is the chart key word.
export const CHARTS = {
  6: {
    ck: ['duck', 'back', 'kick', 'deck', 'sack', 'rock', 'quick', 'sock', 'truck', 'clock'],
    ay: ['pray', 'day', 'play', 'say', 'hay', 'tray'],
    st: ['stop', 'star', 'step', 'stick', 'nest'],
    pl: ['plane', 'plant', 'plug', 'plus', 'play'],
    fr: ['frog', 'frost', 'fry', 'fresh'],
    tr: ['train', 'tree', 'truck', 'trip'],
    sh: ['ship', 'she', 'shell', 'fish', 'shark', 'sheep', 'hush'],
    th: ['thick', 'this', 'math', 'bath', 'thin', 'that'],
    bl: ['block', 'blend', 'blade', 'blue'],
    cl: ['clock', 'clown', 'clip', 'cloud', 'clap'],
    fl: ['flake', 'flag', 'flame', 'flip'],
    gl: ['glue', 'glove', 'glaze', 'glad', 'glass'],
  },
  7: {
    br: ['bride', 'brake', 'bread', 'broom', 'brush'],
    dr: ['drum', 'dream', 'dress', 'drink'],
    pr: ['pray', 'prize', 'press'],
    gr: ['grin', 'grasp', 'grapes', 'grass'],
    sm: ['smoke', 'smile', 'smell', 'small'],
    sc: ['scat', 'scale', 'scarf', 'scoop'],
    sk: ['skate', 'skunk', 'sky', 'skip'],
    sp: ['spade', 'spoon', 'space', 'spin'],
    cr: ['crab', 'cry', 'crown', 'crib'],
    tw: ['twins', 'tweet', 'twelve', 'twig'],
    spl: ['splash', 'split'],
    spr: ['sprain', 'spray', 'spring'],
    scr: ['scream', 'scrub', 'screw'],
    squ: ['squeak', 'squirrel', 'squeeze'],
    sn: ['snack', 'snail', 'snake', 'snow'],
    sl: ['sleep', 'slide', 'sled', 'slip'],
    str: ['stream', 'string', 'straw'],
    sw: ['swim', 'sweater', 'swing', 'swan'],
  },
  8: {
    thr: ['three', 'throne', 'throat', 'thread'],
    ar: ['stars', 'shark', 'farm', 'scarf', 'car'],
    ch: ['church', 'chips', 'chin', 'lunch', 'cheese', 'chair'],
    or: ['morning', 'fork', 'corn', 'horse', 'stork'],
    ou: ['out', 'house', 'cloud', 'mouth', 'mouse'],
    ow: ['owl', 'clown', 'crown', 'brown', 'cow'],
    er: ['verse', 'tiger', 'spider', 'finger'],
    ur: ['nurse', 'turtle', 'burger', 'surf'],
    ir: ['bird', 'girl', 'shirt', 'first'],
    oi: ['coin', 'boil', 'oil', 'soil'],
    oy: ['boy', 'toy', 'joy'],
    oo: ['book', 'look', 'cook', 'foot', 'hook', 'tooth', 'moon', 'spoon', 'school', 'food'],
    wor: ['worms', 'word', 'work', 'world'],
    igh: ['night', 'light', 'high', 'right', 'fight'],
    all: ['ball', 'tall', 'call', 'wall', 'small'],
    alk: ['walk', 'talk', 'chalk'],
  },
};
// More words for each sound (so she learns the sound, not just a few words)
const MORE_CHART = {
  6: { ck: ['pack', 'neck', 'pick', 'lock', 'black'], ay: ['may', 'way', 'stay', 'clay'], st: ['stamp', 'stem', 'stuck', 'vest', 'fast'], pl: ['plum', 'plate', 'plan'], fr: ['frame', 'free', 'from', 'frown'], tr: ['trap', 'trim', 'track', 'trunk'], sh: ['shop', 'shut', 'dish', 'wish', 'shed'], th: ['with', 'moth', 'them'], bl: ['black', 'blob', 'blink', 'blow'], cl: ['clam', 'class', 'cliff', 'club'], fl: ['flat', 'fly', 'flute', 'flop'], gl: ['glow', 'globe'] },
  7: { br: ['brick', 'bring', 'brown'], dr: ['drip', 'drop', 'drive'], pr: ['print', 'proud'], gr: ['grab', 'grow', 'green'], sm: ['smash'], sc: ['scab', 'scan'], sk: ['skin', 'skid', 'skill'], sp: ['spot', 'spell', 'spun'], cr: ['crop', 'crack', 'cross'], tw: ['twin', 'twist', 'twirl'], spl: ['splat'], spr: ['sprout', 'sprint'], scr: ['scrap', 'scrape'], squ: ['squid', 'square'], sn: ['snap', 'sniff'], sl: ['slap', 'slim', 'slow'], str: ['strap', 'strip', 'street'], sw: ['swam', 'sweet', 'swift'] },
  8: { thr: ['throw', 'thrill'], ar: ['arm', 'barn', 'park', 'jar', 'card'], ch: ['chop', 'chick', 'much', 'such', 'chest'], or: ['for', 'torn', 'short', 'sport'], ou: ['loud', 'round', 'count', 'found'], ow: ['town', 'gown', 'down', 'how'], er: ['her', 'fern', 'after', 'sister'], ur: ['fur', 'hurt', 'purse', 'church'], ir: ['dirt', 'skirt', 'third', 'stir'], oi: ['join', 'point', 'foil', 'spoil'], oy: ['enjoy', 'annoy', 'cowboy'], oo: ['zoo', 'pool', 'cool', 'hood', 'wood'], wor: ['worm', 'worth', 'worse'], igh: ['sight', 'might', 'bright', 'tight'], all: ['fall', 'hall', 'stall'], alk: ['stalk'] },
};
for (const [c, d] of Object.entries(MORE_CHART)) for (const [snd, ws] of Object.entries(d)) for (const w of ws) if (!CHARTS[c][snd].includes(w)) CHARTS[c][snd].push(w);
// Sounds that are spelled alike — not used as distractors for each other (too unfair)
const SAME = [['er', 'ur', 'ir'], ['ou', 'ow'], ['oi', 'oy'], ['ck', 'k'], ['sc', 'sk'], ['all', 'alk'], ['th', 'thr'], ['pr', 'pl']];
const clash = (a, b) => SAME.some(g => g.includes(a) && g.includes(b)) || a.includes(b) || b.includes(a);
// Blends: two or three consonants that slide together (each letter still says its sound).
// Everything else on the charts (sh, ch, th, ck, ay, ar, or, ou, ow, er, ur, ir, oi, oy, oo, igh, all, alk, wor) is a special sound.
export const BLENDS = new Set(['tr', 'pl', 'gl', 'st', 'fr', 'bl', 'cl', 'fl', 'br', 'dr', 'pr', 'gr', 'sm', 'sc', 'sk', 'sp', 'cr', 'tw', 'sn', 'sl', 'sw', 'spl', 'spr', 'scr', 'str', 'squ', 'thr']);
const blendParts = s => (s === 'thr' ? ['t h', 'r'] : s === 'squ' ? ['s', 'q u'] : s.split(''));
const blendNote = (word, s) => {
  const at = word.indexOf(s), p = blendParts(s);
  const where = at === 0 ? 'starts with' : at + s.length === word.length ? 'ends with' : 'has';
  return `${word} ${where} the blend ${spaced(s)}: ${p.slice(0, -1).join(', ')} and ${p[p.length - 1]} slide together.`;
};
// Same sound, other spelling: a word with one of these is not a fair "wrong" answer
const ALIKE = [
  [['er', 'ur', 'ir', 'wor'], /er|ur|ir|wor/], [['ay'], /ay|ai|a[^aeiou]e\b/], [['ck'], /ck|k|c(?![eiyh])/], [['sc', 'sk'], /s[ckq]/],
  [['ou', 'ow'], /ou|ow/], [['oi', 'oy'], /oi|oy/], [['oo'], /oo/], [['igh'], /igh|i[^aeiou]e\b|[^aeiou]y$/], [['all', 'alk'], /al/], [['th', 'thr'], /th/],
];
const soundsLike = (w, sound) => ALIKE.some(([g, re]) => g.includes(sound) && re.test(w));

const VOWELS = ['a', 'e', 'i', 'o', 'u'];

// Picture + word line
const wordCard = (w, shown) => `<div style="display:flex;align-items:center;gap:14px;justify-content:center">${img(w) ? `<span style="font-size:96px">${img(w)}</span>` : ''}<div class="word-big">${shown}</div></div>`;

// ---- Vowel marking helper (smile = short, dash = long, slash = silent; never mark u after q)
function autoMarks(word) {
  const idx = [];
  word.split('').forEach((c, i) => { if (VOWELS.includes(c) && !(c === 'u' && word[i - 1] === 'q')) idx.push(i); });
  if (idx.length === 1) return { [idx[0]]: 'short' };
  if (idx.length === 2) return { [idx[0]]: 'long', [idx[1]]: 'silent' };
  return null;
}
const ONE_VOWEL = ['fan', 'hop', 'mud', 'jam', 'lid', 'rug', 'web', 'fox', 'dig', 'tag', 'pond', 'list', 'hunt', 'jump', 'lamp', 'best', 'milk', 'sand', 'cat', 'bat', 'pen', 'sip', 'job', 'cub', 'pot', 'shut', 'bit', 'can', 'mad', 'tub', 'quit', 'slid', 'slim', 'quick', 'duck', 'back', 'deck', 'sack', 'rock', 'kick', 'plant', 'math', 'hush', 'blend', 'grasp', 'smell', 'frost', 'quack', 'quiz', 'quilt', 'quest', 'glad', 'fish', 'frog', 'crab', 'drum', 'ship', 'hen', 'six', 'bus'];
const TWO_VOWEL = ['road', 'soap', 'toad', 'seat', 'meat', 'lake', 'name', 'tape', 'hide', 'five', 'line', 'time', 'mule', 'cute', 'pail', 'nail', 'feet', 'jeep', 'bite', 'cane', 'made', 'tube', 'quite', 'slide', 'slime', 'meet', 'team', 'heal', 'tree', 'keep', 'beach', 'reach', 'goat', 'ape', 'bake', 'cape', 'date', 'face', 'gate', 'cake', 'rain', 'road', 'mane', 'tweet', 'glaze', 'brake', 'scale', 'dream', 'queen', 'quote', 'quake', 'kite', 'bike', 'boat', 'snake', 'tail', 'seed', 'leaf'];

const ONE_RULE = 'One vowel? It says its short sound. Give it a smile.';
// Explain with THIS word: which vowels it has and what they do
const vowelsIn = w => w.split('').filter((c, i) => VOWELS.includes(c) && !(c === 'u' && w[i - 1] === 'q'));
const wordRule = w => {
  const v = vowelsIn(w);
  return (v.length === 1
    ? `${w} has 1 vowel: ${v[0]}. One vowel says its short sound, so ${v[0]} is short. Give it a smile.`
    : `${w} has 2 vowels: ${v[0]} and ${v[1]}. The first one, ${v[0]}, says its name (long). The ${v[1]} is quiet. Dash on the ${v[0]}, slash on the ${v[1]}.`)
    + (w.includes('qu') ? ' The u after q does not count.' : '');
};
const VOWEL_LIST = 'The vowels are a, e, i, o, u (and sometimes y).';
const TWO_RULE = 'Two vowels? The first one says its name. The second one is quiet. Dash on the first. Slash on the second.';

export const phonicsSkills = [
  {
    id: 'p-vowels', name: 'Vowels & consonants', emoji: '🅰️',
    gen(l) {
      const mode = pick(l === 1 ? [0, 1, 3] : [0, 1, 2, 3]);
      if (mode === 3) {
        // Which word has the short a / e / i / o / u sound?
        const SHORT = { a: ['cat', 'hat', 'bat', 'map', 'van', 'ant', 'bag', 'jam'], e: ['bed', 'hen', 'pen', 'net', 'jet', 'egg', 'web', 'ten'], i: ['pig', 'six', 'fish', 'ship', 'lid', 'pin', 'kid', 'milk'], o: ['dog', 'fox', 'pot', 'box', 'mop', 'log', 'sock', 'clock'], u: ['sun', 'bus', 'cup', 'bug', 'nut', 'duck', 'drum', 'mug'] };
        const KEYW = { a: 'apple', e: 'egg', i: 'insect', o: 'octopus', u: 'umbrella' };
        const v = pick(VOWELS);
        const pool = w => SHORT[w].filter(x => img(x));
        const a = pick(pool(v));
        const wrong = sample(VOWELS.filter(x => x !== v), 2).map(x => pick(pool(x)));
        return {
          say: `Tap the word with the short ${v} sound, like the ${v} in ${KEYW[v]}.`, text: `Tap the word with the short ${v} sound, like ${KEYW[v]} 👂`,
          options: shuffle([a, ...wrong]).map(w => ({ html: `<span class="pic">${img(w)}</span><span class="lbl">${w}</span>`, value: w, say: w })), answer: a,
          explain: `${a} has the short ${v} sound: ${a}.`,
        };
      }
      if (mode === 0) {
        const v = pick(VOWELS);
        const cons = sample('bcdfghjklmnprstvwz'.split(''), 3);
        return {
          say: 'Tap the letter that is a vowel.',
          options: shuffle([v, ...cons]).map(c => ({ html: c, value: c, say: c })), answer: v,
          explain: VOWEL_LIST,
        };
      }
      if (mode === 1) {
        const isV = Math.random() < 0.4;
        const c = isV ? pick(VOWELS) : pick('bcdfghjklmnpqrstvwxz'.split('')); // no y: it can be both
        const up = Math.random() < 0.5;
        return {
          say: `Look at this letter: ${c}. Is it a vowel or a consonant? Tap one.`, text: 'Is this letter a vowel or a consonant?', visual: `<div class="word-big">${up ? c.toUpperCase() + ' ' : ''}${c}</div>`,
          options: [{ html: 'Vowel', value: 'v', say: 'vowel' }, { html: 'Consonant', value: 'c', say: 'consonant' }], cols: 'two',
          answer: isV ? 'v' : 'c',
          explain: isV ? `${c} is a vowel. ${VOWEL_LIST}` : `${c} is a consonant. ${VOWEL_LIST}`,
        };
      }
      // missing short vowel (from class worksheet: p_n, _nt, m_g, _gg ...)
      // Only offer vowels that do NOT make another real word (bug: not bag, big, beg, bog)
      const words = ['ant', 'egg', 'bug', 'pen', 'pig', 'pot', 'cup', 'bed', 'hen', 'fox', 'sun', 'bus', 'net', 'jet', 'van', 'map', 'hat', 'six', 'ten', 'cat', 'dog', 'bat', 'nut', 'web'].filter(w => img(w));
      let w, i, ok = [];
      for (const x of shuffle(words)) {
        const xi = x.split('').findIndex(c => VOWELS.includes(c));
        const xo = VOWELS.filter(v => v !== x[xi] && notWord(x.slice(0, xi) + v + x.slice(xi + 1)));
        if (xo.length > ok.length) { w = x; i = xi; ok = xo; }
        if (ok.length >= 2) break;
      }
      return {
        say: `Listen: ${w}. Tap the vowel that goes in the blank.`, text: 'Tap the missing vowel 👂', visual: wordCard(w, w.slice(0, i) + '_' + w.slice(i + 1)),
        options: VOWELS.filter(v => v === w[i] || ok.includes(v)).map(v => ({ html: v, value: v, say: v })), answer: w[i],
        explain: `${w} has the short ${w[i]} sound: ${w}.`,
      };
    },
  },
  {
    id: 'p-sounds', name: 'Special sounds', emoji: '🔊',
    gen(l) {
      const charts = l === 1 ? [6] : l === 2 ? [6, 7] : [6, 7, 8];
      let q = null;
      for (let t = 0; t < 60 && !q; t++) {
        const chartNo = pick(charts.concat(l === 3 ? [8, 8] : []));
        const chart = CHARTS[chartNo];
        const sound = pick(Object.keys(chart));
        const word = pick(chart[sound]);
        const at = word.indexOf(sound);
        if (at < 0) continue;
        const fill = s => word.slice(0, at) + s + word.slice(at + sound.length);
        // Never offer a sound that is already in the word, sounds the same, or makes another real word
        const others = Object.keys(chart).filter(s => !clash(s, sound) && !word.includes(s) && notWord(fill(s)));
        if (others.length < (t < 40 ? 2 : 1)) continue;
        const shown = esc(word.slice(0, at)) + '<span style="color:#ff5fa2">_</span>' + esc(word.slice(at + sound.length));
        const blend = BLENDS.has(sound);
        q = {
          say: `Listen: ${word}. Tap the letters that go in the blank.`, text: 'Tap the missing letters 👂',
          visual: wordCard(word, shown),
          options: shuffle([sound, ...sample(others, 2)]).map(s => ({ html: s, value: s, say: spaced(s) })), answer: sound,
          explain: blend ? blendNote(word, sound) : `${word} has the special sound ${spaced(sound)}.`,
          after: `${spaced(sound)}... ${word}!`,
        };
      }
      return q;
    },
  },
  {
    id: 'p-keyword', name: 'Chart key words', emoji: '📋',
    gen(l) {
      const charts = l === 1 ? [6] : l === 2 ? [6, 7] : [6, 7, 8];
      const chartNo = pick(charts);
      const chart = CHARTS[chartNo];
      const sound = pick(Object.keys(chart).filter(s => s.length > 1));
      // Half the time the chart's key word, half the time any other word on the chart with that sound
      const anyWord = Math.random() < 0.5;
      const key = anyWord ? pick(chart[sound]) : chart[sound][0];
      // Wrong words must not have this sound in any spelling (ir: not worms; ay: not plane)
      const wrong = sample([...new Set(Object.keys(chart).filter(s => s !== sound && !clash(s, sound))
        .map(s => (anyWord ? pick(chart[s]) : chart[s][0])).filter(w => !w.includes(sound) && !soundsLike(w, sound) && w !== key))], 2);
      const blend = BLENDS.has(sound);
      return {
        say: blend ? `Look at the blend ${spaced(sound)}. Tap the word that has the ${spaced(sound)} blend.` : `Look at the special sound ${spaced(sound)}. Tap the word that has ${spaced(sound)} in it.`,
        text: blend ? `Tap the word with the blend ${sound}` : `Tap the word with the special sound ${sound}`,
        visual: `<div class="word-big" style="border-radius:50%;padding:20px 34px;border:6px solid #ff5fa2">${sound}</div>`,
        readFirst: l > 1,
        options: shuffle([key, ...wrong]).map(w => ({ html: `${img(w) ? `<span class="pic">${img(w)}</span>` : ''}<span class="lbl">${w}</span>`, value: w })),
        answer: key,
        explain: blend ? `On Chart ${chartNo}: ${blendNote(key, sound)}` : `On Chart ${chartNo}: the special sound ${spaced(sound)} as in ${key}.`,
      };
    },
  },
  {
    id: 'p-onetwo', name: 'Short or long?', emoji: '↔️',
    gen() {
      const two = Math.random() < 0.5;
      const w = pick(two ? TWO_VOWEL : ONE_VOWEL);
      return {
        say: 'Read the word. Does it have a short vowel or a long vowel? Tap one.', text: 'Is the vowel short or long?', readFirst: true,
        visual: wordCard(w, w),
        options: [{ html: '<span class="pic">˘</span><span class="lbl">Short (one vowel)</span>', value: 's' },
          { html: '<span class="pic">¯</span><span class="lbl">Long (two vowels)</span>', value: 'l' }],
        cols: 'two', answer: two ? 'l' : 's',
        explain: wordRule(w),
      };
    },
  },
  {
    id: 'p-mark', name: 'Mark the vowels', emoji: '✏️', type: 'mark',
    gen(l) {
      const list = l === 1 ? ONE_VOWEL : l === 2 ? TWO_VOWEL : [...ONE_VOWEL, ...TWO_VOWEL];
      const w = pick(list);
      const marks = autoMarks(w);
      const two = Object.keys(marks).length === 2;
      return {
        type: 'mark', word: w, marks,
        say: `Mark the vowels in ${w}. Tap a red letter to change its mark. Then tap Check.`, text: `Mark the vowels in ${w}. Tap a red letter, then tap Check.`,
        hint: two ? 'Dash on the first. Slash on the second.' : 'One vowel gets a smile.',
        explain: wordRule(w) + (w.includes('qu') ? ' Do not mark it.' : ''),
      };
    },
  },
  {
    id: 'p-ck', name: 'C or K? ck or ke?', emoji: '🪁',
    gen(l) {
      const mode = l === 1 ? 0 : pick([0, 1, 1]);
      if (mode === 0) {
        const cWords = ['cat', 'cup', 'cub', 'cut', 'cot', 'cap', 'can', 'car', 'cake', 'cow', 'cob', 'corn', 'cab', 'camp', 'cone', 'cute', 'came', 'coat', 'cold', 'cook', 'cave', 'coin', 'cuff', 'cane', 'cart', 'cord'];
        const kWords = ['kite', 'kid', 'kit', 'key', 'keep', 'kick', 'keg', 'kitten', 'kettle', 'king', 'kiss', 'kind', 'kept', 'kennel'];
        const isK = Math.random() < 0.5;
        const w = pick(isK ? kWords : cWords);
        return {
          say: `Listen: ${w}. Does ${w} start with c or k? Tap one.`, text: 'Does it start with c or k? Tap one 👂', visual: wordCard(w, '_' + w.slice(1)),
          options: [{ html: 'c', value: 'c', say: 'c' }, { html: 'k', value: 'k', say: 'k' }], cols: 'two', answer: isK ? 'k' : 'c',
          explain: 'K goes with i and e. C goes with a, o and u.',
        };
      }
      const ends = {
        ck: ['duck', 'back', 'clock', 'truck', 'stick', 'sock', 'snack', 'chick', 'deck', 'sick', 'tick', 'brick', 'block', 'lock', 'quack'],
        k: ['bank', 'drink', 'milk', 'book', 'fork', 'desk', 'shark', 'park', 'walk', 'cheek', 'look', 'hook', 'pink', 'skunk'],
        ke: ['cake', 'bike', 'snake', 'make', 'rake', 'bake', 'lake', 'like', 'smoke', 'woke'],
      };
      const kind = pick(['ck', 'ck', 'k', 'ke']);
      const w = pick(ends[kind]);
      // One box for the ending, so the number of blanks does not give the answer away
      const shown = w.slice(0, w.length - kind.length) + '_';
      return {
        say: `Listen: ${w}. Tap the letters that end the word: c k, k, or k e?`, text: 'Tap the right ending: ck, k or ke? 👂', visual: wordCard(w, shown),
        options: ['ck', 'k', 'ke'].map(x => ({ html: x, value: x, say: spaced(x) })), answer: kind,
        explain: kind === 'ck' ? 'Short vowel? End with c k.' : kind === 'ke' ? 'Long vowel? End with k e.' : 'After a consonant or two vowels, just use k.',
      };
    },
  },
  {
    id: 'p-floss', name: 'Double endings', emoji: '👯',
    gen() {
      // (No ball, call, tall, wall: "all" is its own special sound.)
      const words = {
        ff: ['off', 'cuff', 'puff', 'cliff', 'stuff', 'sniff', 'stiff', 'fluff'],
        ll: ['well', 'shell', 'drill', 'hill', 'bell', 'doll', 'tell', 'fill', 'will', 'fell', 'sell', 'spill', 'pill', 'smell', 'spell', 'yell', 'mill', 'gull', 'grill', 'chill', 'still'],
        ss: ['kiss', 'dress', 'glass', 'mess', 'miss', 'grass', 'boss', 'bless', 'cross', 'less', 'moss', 'toss', 'pass', 'class', 'chess', 'press', 'fuss', 'hiss', 'loss'],
        zz: ['buzz', 'fizz', 'jazz', 'fuzz'] };
      const kind = pick(['ff', 'll', 'll', 'ss', 'ss', 'zz']);
      const w = pick(words[kind]);
      return {
        say: `Listen: ${w}. Tap the two letters that finish the word.`, text: 'Tap the letters that finish the word: ff, ll, ss or zz? 👂', visual: wordCard(w, w.slice(0, -2) + '_ _'),
        options: ['ff', 'll', 'ss', 'zz'].map(x => ({ html: x, value: x, say: spaced(x) })), answer: kind,
        explain: `Many short-vowel words that end in f, l, s or z double the last letter: bell, cuff, kiss, buzz. ${w} ends with ${spaced(kind)}.`,
      };
    },
  },
  {
    id: 'p-spell', name: 'Spell it!', emoji: '🔤', type: 'build',
    gen(l) {
      const L1 = ['fan', 'hop', 'mud', 'jam', 'lid', 'rug', 'dig', 'tag', 'fix', 'gum', 'leg', 'dip', 'cat', 'dog', 'pig', 'hen', 'sun', 'bus', 'cup', 'bed', 'fox', 'hat', 'net', 'egg', 'bat', 'van', 'web', 'six', 'ten', 'map', 'mug', 'pot', 'bug', 'jet'];
      const L2 = ['duck', 'fish', 'ship', 'frog', 'crab', 'drum', 'bell', 'doll', 'sock', 'cake', 'kite', 'bike', 'goat', 'tree', 'boat', 'moon', 'book', 'star', 'king', 'ring', 'chick', 'shell', 'clock', 'plant', 'flag', 'coat', 'bean', 'game', 'ride', 'back', 'lick', 'snack', 'play', 'pray', 'day', 'cuff', 'well', 'cry', 'she', 'brush', 'cow', 'snow', 'food', 'foot', 'boy', 'oil', 'cub', 'net', 'sit', 'hot'];
      const L3 = ['snake', 'train', 'sheep', 'clock', 'house', 'mouse', 'shark', 'cloud', 'night', 'snail', 'horse', 'chair', 'three', 'light', 'spoon', 'stars', 'church', 'bird', 'girl', 'coin', 'toy', 'ball', 'walk', 'corn', 'queen', 'smile', 'swing'];
      const w = pick(l === 1 ? L1 : l === 2 ? L2 : L3);
      // Level 2-3: tiles are whole special sounds (sh, ck, igh...) like the Abeka charts
      const parts = l === 1 ? w.split('') : chunk(w);
      const pool = l === 1 ? 'abcdefghilmnoprstu'.split('') : ['sh', 'ch', 'th', 'ck', 'ar', 'or', 'ee', 'oo', 'ai', 'igh', 'ow', 'ou', 'a', 'e', 'i', 'o', 'u', 's', 't', 'n', 'p', 'l'];
      const extra = sample(pool.filter(c => !parts.includes(c)), l === 1 ? 1 : 2);
      const dictation = l === 3 && Math.random() < 0.5;
      return {
        type: 'build', word: w, parts, extra,
        say: `Spell ${w}. ${w}. Tap the letters in order.` + (l > 1 ? ' Listen for the special sounds!' : ''),
        text: dictation ? 'Spelling test! Tap the letters to spell the word you hear 👂' : 'Tap the letters to spell the word you hear 👂',
        visual: dictation || !img(w) ? '<div style="font-size:90px">👂</div>' : `<div style="font-size:110px">${img(w)}</div>`,
        explain: `${w} is spelled ${parts.map(p => spaced(p)).join(', ')}. ${w}!`,
      };
    },
  },
  {
    id: 'p-missing', name: 'Missing letters', emoji: '🧩',
    gen(l) {
      const words = (l === 1
        ? ['cat', 'dog', 'pig', 'hen', 'sun', 'bus', 'cup', 'bed', 'fox', 'hat', 'net', 'bat', 'van', 'web', 'map', 'pot', 'bug', 'jet', 'six', 'ten']
        : ['duck', 'fish', 'frog', 'crab', 'drum', 'bell', 'cake', 'kite', 'bike', 'goat', 'tree', 'boat', 'moon', 'book', 'star', 'snake', 'train', 'sheep', 'clock', 'house', 'shark', 'chair', 'plant', 'horse', 'light', 'spoon', 'queen']).filter(x => img(x));
      const missCount = l === 3 ? 2 : 1;
      const isVowel = c => VOWELS.includes(c);
      const LET = 'aeioubcdklmnprsth'.split('');
      let best = null;
      for (let t = 0; t < 30; t++) {
        const w = pick(words);
        const i = rnd(0, w.length - missCount);
        const gap = w.slice(i, i + missCount);
        // A wrong choice must not make another real word (b_g: not big, beg, bag)
        const okOpt = s => s !== gap && !(/^[ck]$/.test(gap) && /^[ck]$/.test(s)) && notWord(w.slice(0, i) + s + w.slice(i + missCount)); // c and k sound the same
        let others;
        if (missCount === 1) others = sample((isVowel(gap) ? VOWELS : 'bcdfghklmnprstw'.split('')).filter(okOpt), 3);
        else {
          const set = new Set();
          for (let k = 0; k < 80 && set.size < 3; k++) { const o = pick(LET) + pick(LET); if (okOpt(o)) set.add(o); }
          others = [...set];
        }
        if (!best || others.length > best.others.length) best = { w, i, gap, others };
        if (others.length >= 2) break;
      }
      const { w, i, gap, others } = best;
      const shown = w.slice(0, i) + '_'.repeat(missCount).split('').join(' ') + w.slice(i + missCount);
      return {
        say: `Listen: ${w}. Tap the letter${missCount > 1 ? 's' : ''} that go${missCount > 1 ? '' : 'es'} in the blank.`, text: `Tap the missing letter${missCount > 1 ? 's' : ''} 👂`,
        visual: wordCard(w, shown),
        options: shuffle([gap, ...others]).map(c => ({ html: c, value: c, say: spaced(c) })), answer: gap,
        explain: `Say it slowly: ${w}. It is spelled ${spaced(w)}.`,
      };
    },
  },
  {
    id: 'p-blend', name: 'Vowel blends', emoji: '🔗',
    gen(l) {
      // Abeka: sound the consonant + vowel blend first, then add the ending
      const words = ['bat', 'bed', 'big', 'box', 'bus', 'cat', 'cup', 'dog', 'fan', 'fish', 'hat', 'hen', 'jet', 'map', 'mop', 'net', 'pig', 'pot', 'pen', 'sun', 'six', 'ten', 'van', 'web', 'bug', 'mug', 'log', 'leg', 'kid', 'lid', 'red', 'rat'];
      const w = pick(words);
      const blend = w.slice(0, 2);
      if (l > 1 && Math.random() < 0.5) {
        // hear a blend, find it written
        const c = blend[0];
        const opts = [blend, ...sample(VOWELS.filter(v => v !== blend[1]), 3).map(v => c + v)];
        return {
          listenOnly: true, maxReplays: 3, say: `Tap the blend you hear: ${blend}. ${blend}.`,
          options: shuffle(opts).map(b => ({ html: b, value: b })), answer: blend,
          explain: `${blend[0]} and ${blend[1]} blend together: ${blend}.`,
        };
      }
      const opts = [blend, ...sample(VOWELS.filter(v => v !== blend[1]), 2).map(v => blend[0] + v)];
      return {
        say: `Listen: ${w}. Tap the blend that starts ${w}.`, text: 'Tap the blend that starts the word 👂',
        visual: wordCard(w, '_ _' + w.slice(2)),
        options: shuffle(opts).map(b => ({ html: b, value: b, say: b })), answer: blend,
        explain: `Blend it first: ${blend}. Then add the end: ${blend}, ${w.slice(2)}... ${w}!`,
        after: `${blend}... ${w}!`,
      };
    },
  },
  {
    id: 'p-rightspell', name: 'Spot the right spelling', emoji: '🔍',
    gen(l) {
      const words = l === 1 ? ['cat', 'dog', 'sun', 'pig', 'bed', 'cup', 'hen', 'fox', 'bus', 'hat', 'bat', 'bug', 'net', 'pen', 'web', 'six', 'ten', 'map', 'pot', 'jet', 'mug', 'van', 'bag', 'log', 'rat', 'sit', 'run', 'hot', 'man', 'cub', 'lid', 'red', 'mop', 'nut', 'fan']
        : ['duck', 'cake', 'kite', 'bike', 'goat', 'tree', 'boat', 'fish', 'ship', 'frog', 'bell', 'snake', 'night', 'light', 'sheep', 'train', 'house', 'shark', 'clock', 'chair', 'queen', 'three', 'smile', 'stars',
          'coat', 'bean', 'game', 'ride', 'back', 'lick', 'snack', 'brick', 'play', 'pray', 'gray', 'shell', 'brush', 'fresh', 'cloud', 'shout', 'crown', 'snow', 'shirt', 'girl', 'first', 'coin', 'boil', 'book', 'moon', 'food', 'tooth', 'spoon', 'chick', 'teeth'];
      const w = pick(words);
      const need = l === 1 ? 2 : 3;
      // Wrong spellings must be made-up words: never a real word (mop: not mope) and never a rude one
      const fake = list => [...new Set(list)].filter(x => x !== w && x.length > 1 && notWord(x));
      const first = fake(misspell(w));
      let wrongs = sample(first, need);
      if (wrongs.length < need) wrongs = wrongs.concat(sample(fake(moreMisspell(w)).filter(x => !wrongs.includes(x)), need - wrongs.length));
      return {
        say: `Listen: ${w}. Tap the word that is spelled the right way.`, text: 'Tap the right spelling of the word you hear 👂', readFirst: true,
        visual: img(w) ? `<div style="font-size:100px">${img(w)}</div>` : '<div style="font-size:80px">👂</div>',
        options: shuffle([w, ...wrongs]).map(x => ({ html: x, value: x })), answer: w,
        explain: `${w} is spelled ${spaced(w)}.`,
      };
    },
  },
];

// Split a word into Abeka special-sound chunks (longest first): "night" -> n, igh, t
const CHUNKS = ['thr', 'squ', 'str', 'spr', 'spl', 'scr', 'igh', 'all', 'alk', 'wor', 'sh', 'ch', 'th', 'ck', 'qu', 'ar', 'or', 'ir', 'ur', 'er', 'oo', 'ou', 'ow', 'oi', 'oy', 'ay', 'ee', 'ea', 'oa', 'ai', 'ng'];
export function chunk(w) {
  const out = [];
  for (let i = 0; i < w.length;) {
    const c = CHUNKS.find(k => w.startsWith(k, i));
    if (c) { out.push(c); i += c.length; } else { out.push(w[i]); i++; }
  }
  return out;
}
// Common mistakes a young speller makes
// A lone vowel: not part of a vowel team (ai, ay, ow, igh...) and not a silent e at the end
const loneVowels = w => [...w].map((c, i) => i).filter(i => VOWELS.includes(w[i]) && !/[aeiouyw]/.test(w[i + 1] || '') && !VOWELS.includes(w[i - 1])
  && !(w[i] === 'i' && w[i + 1] === 'g') && !(w[i] === 'u' && w[i - 1] === 'q') && !(w[i] === 'e' && i === w.length - 1 && i > 1));
function misspell(w) {
  const out = [];
  const vi = loneVowels(w)[0];
  if (vi !== undefined) for (const v of VOWELS) if (v !== w[vi]) out.push(w.slice(0, vi) + v + w.slice(vi + 1));
  if (w.endsWith('e')) out.push(w.slice(0, -1));
  if (w.endsWith('ck')) out.push(w.slice(0, -2) + 'k', w.slice(0, -2) + 'c');
  const team = { ight: ['ite', 'it', 'yt', 'yte', 'igt', 'iet'], ee: ['e', 'ea', 'i'], ea: ['ee', 'e'], oa: ['o', 'ow'], ai: ['a', 'ay'], ay: ['a', 'ai', 'ey', 'ae'], oo: ['u', 'o', 'ou'],
    ou: ['ow', 'u', 'o'], ow: ['o', 'ou'], oi: ['oy', 'o'], oy: ['oi', 'o'], 
    sh: ['s', 'ch'], ch: ['sh', 'c'], th: ['f', 't'], qu: ['kw'] };
  for (const [k, alts] of Object.entries(team)) if (w.includes(k)) for (const x of alts) out.push(w.replace(k, x));
  // r-controlled vowels after a consonant (shirt: shurt, shert; not chair)
  const rc = { ir: ['ur', 'er'], ur: ['er', 'ir'], er: ['ur', 'ir'], ar: ['or'] };
  for (const [k, alts] of Object.entries(rc)) { const m = new RegExp(`([^aeiou])${k}`).exec(w); if (m) for (const x of alts) out.push(w.slice(0, m.index + 1) + x + w.slice(m.index + 3)); }
  // magic-e mix-up: bean -> bene, goat -> gote, train -> trane
  const vt = /ee|ea|ai|oa/.exec(w);
  if (vt && !w.endsWith('e') && vt.index + 2 < w.length) out.push(w.slice(0, vt.index + 1) + w.slice(vt.index + 2) + 'e');
  if (w.startsWith('c') && w[1] !== 'h') out.push('k' + w.slice(1));
  if (w.startsWith('k')) out.push('c' + w.slice(1));
  if (!w.endsWith('e') && /[aeiou][^aeiouyw]$/.test(w)) out.push(w + 'e');
  if (/(^|[^aeiou])[aeiou][bdgmnpt]$/.test(w)) out.push(w + w.slice(-1)); // hott, mugg
  if (/[^aeiou](.)\1$/.test(w) || /^[aeiou]?[^aeiou]*[aeiou](.)\1$/.test(w)) { const vi2 = w.length - 3; out.push(w.slice(0, -1), w.slice(0, -1) + 'e', w.slice(0, vi2 + 1) + w[vi2] + w.slice(vi2 + 1, -1)); } // bel, bele, beel
  return out;
}
// More made-up spellings, used only when the common mistakes above are all real words
const SWAP = { b: 'd', d: 'b', m: 'n', n: 'm', f: 'v', v: 'f', p: 'b' };
const LONG = { a: 'ai', i: 'y', o: 'oa', u: 'oo', e: 'ee' };
function moreMisspell(w) {
  const out = [];
  for (const i of loneVowels(w)) {
    for (const v of VOWELS) if (v !== w[i]) out.push(w.slice(0, i) + v + w.slice(i + 1));
    if (w.endsWith('e')) out.push(w.slice(0, i) + LONG[w[i]] + w.slice(i + 1, w[i] === 'i' ? undefined : -1)); // ryde, caik, smoak
  }
  [...w].forEach((c, i) => { if (SWAP[c]) out.push(w.slice(0, i) + SWAP[c] + w.slice(i + 1)); });
  return out;
}
