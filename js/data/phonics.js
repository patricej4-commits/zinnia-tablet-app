// Sound Safari: phonics from the class (Abeka Special Sounds Charts 6-8, vowels,
// one- and two-vowel rules with marking, C/K rule, ck/k/ke, double consonants).
import { pick, shuffle, sample, esc, rnd } from '../util.js';
import { picOf } from './pictures.js';

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
// Sounds that are spelled alike — not used as distractors for each other (too unfair)
const SAME = [['er', 'ur', 'ir'], ['ou', 'ow'], ['oi', 'oy'], ['ck', 'k'], ['sc', 'sk'], ['all', 'alk'], ['th', 'thr'], ['pr', 'pl']];
const clash = (a, b) => SAME.some(g => g.includes(a) && g.includes(b)) || a.includes(b) || b.includes(a);

const VOWELS = ['a', 'e', 'i', 'o', 'u'];

// Picture + word line
const wordCard = (w, shown) => `<div style="display:flex;align-items:center;gap:14px;justify-content:center">${picOf(w) ? `<span style="font-size:96px">${picOf(w)}</span>` : ''}<div class="word-big">${shown}</div></div>`;

// ---- Vowel marking helper (smile = short, dash = long, slash = silent; never mark u after q)
function autoMarks(word) {
  const idx = [];
  word.split('').forEach((c, i) => { if (VOWELS.includes(c) && !(c === 'u' && word[i - 1] === 'q')) idx.push(i); });
  if (idx.length === 1) return { [idx[0]]: 'short' };
  if (idx.length === 2) return { [idx[0]]: 'long', [idx[1]]: 'silent' };
  return null;
}
const ONE_VOWEL = ['cat', 'bat', 'pen', 'sip', 'job', 'cub', 'pot', 'shut', 'bit', 'can', 'mad', 'tub', 'quit', 'slid', 'grim', 'slim', 'quick', 'duck', 'back', 'deck', 'sack', 'rock', 'kick', 'plant', 'math', 'hush', 'blend', 'grasp', 'smell', 'frost', 'quack', 'quiz', 'quilt', 'quest', 'glad', 'fish', 'frog', 'crab', 'drum', 'ship', 'hen', 'six', 'bus'];
const TWO_VOWEL = ['bite', 'cane', 'made', 'tube', 'quite', 'slide', 'grime', 'slime', 'meet', 'team', 'heal', 'tree', 'keep', 'beach', 'reach', 'goat', 'ape', 'bake', 'cape', 'date', 'face', 'gate', 'cake', 'rain', 'road', 'mane', 'tweet', 'glaze', 'brake', 'scale', 'dream', 'queen', 'quote', 'quake', 'kite', 'bike', 'boat', 'snake', 'tail', 'seed', 'leaf'];

const ONE_RULE = 'One vowel? It says its short sound. Give it a smile.';
const TWO_RULE = 'Two vowels? The first one says its name. The second one is quiet. Dash on the first. Slash on the second.';

export const phonicsSkills = [
  {
    id: 'p-vowels', name: 'Vowels & consonants', emoji: '🅰️',
    gen(l) {
      const mode = pick(l === 1 ? [0, 1] : [0, 1, 2]);
      if (mode === 0) {
        const v = pick(VOWELS);
        const cons = sample('bcdfghjklmnprstvwz'.split(''), 3);
        return {
          say: 'Which letter is a vowel?',
          options: shuffle([v, ...cons]).map(c => ({ html: c, value: c, say: c })), answer: v,
          explain: 'The vowels are a, e, i, o, u.',
        };
      }
      if (mode === 1) {
        const isV = Math.random() < 0.4;
        const c = isV ? pick(VOWELS) : pick('bcdfghjklmnpqrstvwxyz'.split(''));
        const up = Math.random() < 0.5;
        return {
          say: `Is ${c} a vowel or a consonant?`, visual: `<div class="word-big">${up ? c.toUpperCase() + ' ' : ''}${c}</div>`,
          options: [{ html: 'Vowel', value: 'v', say: 'vowel' }, { html: 'Consonant', value: 'c', say: 'consonant' }], cols: 'two',
          answer: isV ? 'v' : 'c',
          explain: isV ? `${c} is a vowel. The vowels are a, e, i, o, u.` : `${c} is a consonant. Only a, e, i, o, u are vowels.`,
        };
      }
      // missing short vowel (from class worksheet: p_n, _nt, m_g, _gg ...)
      const words = ['ant', 'egg', 'bug', 'pen', 'pig', 'pot', 'cup', 'bed', 'hen', 'fox', 'sun', 'bus', 'net', 'jet', 'van', 'map', 'hat', 'six', 'ten', 'cat', 'dog', 'bat', 'nut', 'web'].filter(w => picOf(w));
      const w = pick(words);
      const i = w.split('').findIndex(c => VOWELS.includes(c));
      return {
        say: `Which short vowel is missing? ${w}.`, text: 'Which short vowel is missing? 👂', visual: wordCard(w, w.slice(0, i) + '_' + w.slice(i + 1)),
        options: VOWELS.map(v => ({ html: v, value: v, say: v })), answer: w[i],
        explain: `${w} has the short ${w[i]} sound: ${w}.`,
      };
    },
  },
  {
    id: 'p-sounds', name: 'Special sounds', emoji: '🔊',
    gen(l) {
      const charts = l === 1 ? [6] : l === 2 ? [6, 7] : [6, 7, 8];
      const chartNo = pick(charts.concat(l === 3 ? [8, 8] : []));
      const chart = CHARTS[chartNo];
      const sound = pick(Object.keys(chart));
      const word = pick(chart[sound]);
      const at = word.indexOf(sound);
      const shown = esc(word.slice(0, at)) + '<span style="color:#ff5fa2">' + '_'.repeat(sound.length).split('').join(' ') + '</span>' + esc(word.slice(at + sound.length));
      const others = Object.keys(chart).filter(s => !clash(s, sound));
      const opts = shuffle([sound, ...sample(others, 2)]);
      return {
        say: `Which special sound is missing? ${word}.`, text: 'Which special sound is missing? 👂',
        visual: wordCard(word, shown),
        options: opts.map(s => ({ html: s, value: s, say: s })), answer: sound,
        explain: `${word} has the special sound ${sound.split('').join(' ')}.`,
        after: `${sound.split('').join(' ')}... ${word}!`,
      };
    },
  },
  {
    id: 'p-keyword', name: 'Chart key words', emoji: '📋',
    gen(l) {
      const charts = l === 1 ? [6] : l === 2 ? [6, 7] : [6, 7, 8];
      const chartNo = pick(charts);
      const chart = CHARTS[chartNo];
      const sound = pick(Object.keys(chart).filter(s => s.length > 1));
      const key = chart[sound][0];
      const wrong = sample(Object.keys(chart).filter(s => s !== sound && !clash(s, sound)).map(s => chart[s][0]), 2);
      return {
        say: `Which word has the sound ${sound.split('').join(' ')}?`,
        visual: `<div class="word-big" style="border-radius:50%;padding:20px 34px;border:6px solid #ff5fa2">${sound}</div>`,
        readFirst: l > 1,
        options: shuffle([key, ...wrong]).map(w => ({ html: `${picOf(w) ? `<span class="pic">${picOf(w)}</span>` : ''}<span class="lbl">${w}</span>`, value: w })),
        answer: key,
        explain: `On Chart ${chartNo}: ${sound.split('').join(' ')} as in ${key}.`,
      };
    },
  },
  {
    id: 'p-onetwo', name: 'Short or long?', emoji: '↔️',
    gen() {
      const two = Math.random() < 0.5;
      const w = pick(two ? TWO_VOWEL : ONE_VOWEL);
      return {
        say: 'Read the word. Is the vowel short or long?', readFirst: true,
        visual: wordCard(w, w),
        options: [{ html: '<span class="pic">˘</span><span class="lbl">Short (one vowel)</span>', value: 's' },
          { html: '<span class="pic">¯</span><span class="lbl">Long (two vowels)</span>', value: 'l' }],
        cols: 'two', answer: two ? 'l' : 's',
        explain: (two ? TWO_RULE : ONE_RULE) + ` The word is ${w}.`,
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
        say: `Mark the vowels in ${w}. Tap a red letter.`,
        hint: two ? 'Dash on the first. Slash on the second.' : 'One vowel gets a smile.',
        explain: (two ? TWO_RULE : ONE_RULE) + (w.includes('qu') ? ' Do not mark the u after q.' : ''),
      };
    },
  },
  {
    id: 'p-ck', name: 'C or K? ck or ke?', emoji: '🪁',
    gen(l) {
      const mode = l === 1 ? 0 : pick([0, 1, 1]);
      if (mode === 0) {
        const cWords = ['cat', 'cup', 'cub', 'cut', 'cot', 'cap', 'can', 'car', 'cake', 'cow', 'cod', 'cob', 'cop', 'corn'];
        const kWords = ['kite', 'kid', 'kit', 'key', 'keep', 'kick', 'kin', 'keg', 'kitten', 'kettle'];
        const isK = Math.random() < 0.5;
        const w = pick(isK ? kWords : cWords);
        return {
          say: `Does ${w} start with c or k?`, text: 'Does it start with c or k?', visual: wordCard(w, '_' + w.slice(1)),
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
      const shown = w.slice(0, w.length - kind.length) + '_'.repeat(kind.length).split('').join(' ');
      return {
        say: `How do we spell the end of ${w}? c k, k, or k e?`, text: 'How does this word end? ck, k or ke?', visual: wordCard(w, shown),
        options: ['ck', 'k', 'ke'].map(x => ({ html: x, value: x, say: x.split('').join(' ') })), answer: kind,
        explain: kind === 'ck' ? 'Short vowel? End with c k.' : kind === 'ke' ? 'Long vowel? End with k e.' : 'After a consonant or two vowels, just use k.',
      };
    },
  },
  {
    id: 'p-floss', name: 'Double endings', emoji: '👯',
    gen() {
      const words = { ff: ['off', 'cuff', 'puff', 'cliff', 'stuff'], ll: ['ball', 'well', 'shell', 'drill', 'hill', 'bell', 'doll', 'tell', 'fill', 'doll'], ss: ['kiss', 'dress', 'glass', 'mess', 'miss', 'grass', 'boss'], zz: ['buzz', 'fizz', 'jazz'] };
      const kind = pick(['ff', 'll', 'll', 'ss', 'ss', 'zz']);
      const w = pick(words[kind]);
      return {
        say: `Finish the word: ${w}.`, text: 'Finish the word! ff, ll, ss or zz?', visual: wordCard(w, w.slice(0, -2) + '_ _'),
        options: ['ff', 'll', 'ss', 'zz'].map(x => ({ html: x, value: x, say: x.split('').join(' ') })), answer: kind,
        explain: `Short words that end in f, l, s or z get two of them. ${w} ends with ${kind.split('').join(' ')}.`,
      };
    },
  },
  {
    id: 'p-spell', name: 'Spell it!', emoji: '🔤', type: 'build',
    gen(l) {
      const L1 = ['cat', 'dog', 'pig', 'hen', 'sun', 'bus', 'cup', 'bed', 'fox', 'hat', 'net', 'egg', 'bat', 'van', 'web', 'six', 'ten', 'map', 'mug', 'pot', 'bug', 'jet'];
      const L2 = ['duck', 'fish', 'ship', 'frog', 'crab', 'drum', 'bell', 'doll', 'sock', 'cake', 'kite', 'bike', 'goat', 'tree', 'boat', 'moon', 'book', 'star', 'king', 'ring', 'chick', 'shell', 'clock', 'plant', 'flag'];
      const L3 = ['snake', 'train', 'sheep', 'clock', 'house', 'mouse', 'shark', 'cloud', 'night', 'snail', 'horse', 'chair', 'three', 'light', 'spoon', 'stars', 'church', 'bird', 'girl', 'coin', 'toy', 'ball', 'walk', 'corn', 'queen', 'smile', 'swing'];
      const w = pick(l === 1 ? L1 : l === 2 ? L2 : L3);
      // Level 2-3: tiles are whole special sounds (sh, ck, igh...) like the Abeka charts
      const parts = l === 1 ? w.split('') : chunk(w);
      const pool = l === 1 ? 'abcdefghilmnoprstu'.split('') : ['sh', 'ch', 'th', 'ck', 'ar', 'or', 'ee', 'oo', 'ai', 'igh', 'ow', 'ou', 'a', 'e', 'i', 'o', 'u', 's', 't', 'n', 'p', 'l'];
      const extra = sample(pool.filter(c => !parts.includes(c)), l === 1 ? 1 : 2);
      const dictation = l === 3 && Math.random() < 0.5;
      return {
        type: 'build', word: w, parts, extra,
        say: `Spell ${w}. ${w}.` + (l > 1 ? ' Listen for the special sounds!' : ''),
        text: dictation ? 'Spelling test! Spell the word you hear 👂' : 'Spell the word you hear! 👂',
        visual: dictation || !picOf(w) ? '<div style="font-size:90px">👂</div>' : `<div style="font-size:110px">${picOf(w)}</div>`,
        explain: `${w} is spelled ${parts.map(p => p.split('').join(' ')).join(', ')}. ${w}!`,
      };
    },
  },
  {
    id: 'p-missing', name: 'Missing letters', emoji: '🧩',
    gen(l) {
      const words = l === 1
        ? ['cat', 'dog', 'pig', 'hen', 'sun', 'bus', 'cup', 'bed', 'fox', 'hat', 'net', 'bat', 'van', 'web', 'map', 'pot', 'bug', 'jet', 'six', 'ten']
        : ['duck', 'fish', 'frog', 'crab', 'drum', 'bell', 'cake', 'kite', 'bike', 'goat', 'tree', 'boat', 'moon', 'book', 'star', 'snake', 'train', 'sheep', 'clock', 'house', 'shark', 'chair', 'plant', 'horse', 'light', 'spoon', 'queen'];
      const w = pick(words.filter(x => picOf(x)));
      const missCount = l === 3 ? 2 : 1;
      const i = rnd(0, w.length - missCount);
      const gap = w.slice(i, i + missCount);
      const shown = w.slice(0, i) + '_'.repeat(missCount).split('').join(' ') + w.slice(i + missCount);
      const isVowel = c => VOWELS.includes(c);
      const pool = missCount === 1 ? (isVowel(gap) ? VOWELS : 'bcdfghklmnprstw'.split('')) : null;
      let opts;
      if (pool) opts = [gap, ...sample(pool.filter(c => c !== gap), 3)];
      else {
        const others = new Set();
        while (others.size < 3) { const o = pick('aeioubcdklmnprsth'.split('')) + pick('aeioubcdklmnprsth'.split('')); if (o !== gap) others.add(o); }
        opts = [gap, ...others];
      }
      return {
        say: `Which letter${missCount > 1 ? 's are' : ' is'} missing? ${w}.`, text: `Which letter${missCount > 1 ? 's are' : ' is'} missing? 👂`,
        visual: wordCard(w, shown),
        options: shuffle(opts).map(c => ({ html: c, value: c, say: c.split('').join(' ') })), answer: gap,
        explain: `Say it slowly: ${w}. It is spelled ${w.split('').join(' ')}.`,
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
          listenOnly: true, maxReplays: 3, say: `Find the blend: ${blend}. ${blend}.`,
          options: shuffle(opts).map(b => ({ html: b, value: b })), answer: blend,
          explain: `${blend[0]} and ${blend[1]} blend together: ${blend}.`,
        };
      }
      const opts = [blend, ...sample(VOWELS.filter(v => v !== blend[1]), 2).map(v => blend[0] + v)];
      return {
        say: `${w}. Which blend does ${w} start with?`, text: 'Which blend does it start with? 👂',
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
      const words = l === 1 ? ['cat', 'dog', 'sun', 'pig', 'bed', 'cup', 'hen', 'fox', 'bus', 'hat']
        : ['duck', 'cake', 'kite', 'bike', 'goat', 'tree', 'boat', 'fish', 'ship', 'frog', 'bell', 'snake', 'night', 'light', 'sheep', 'train', 'house', 'shark', 'clock', 'chair', 'queen', 'three', 'smile', 'stars'];
      const w = pick(words);
      const wrongs = new Set(misspell(w));
      wrongs.delete(w);
      const opts = [w, ...sample([...wrongs], l === 1 ? 2 : 3)];
      return {
        say: 'Which word is spelled the right way?', readFirst: true,
        visual: picOf(w) ? `<div style="font-size:100px">${picOf(w)}</div>` : '',
        options: shuffle(opts).map(x => ({ html: x, value: x })), answer: w,
        explain: `${w} is spelled ${w.split('').join(' ')}.`,
      };
    },
  },
];

// Split a word into Abeka special-sound chunks (longest first): "night" -> n, igh, t
const CHUNKS = ['thr', 'squ', 'str', 'spr', 'spl', 'scr', 'igh', 'all', 'alk', 'wor', 'sh', 'ch', 'th', 'ck', 'qu', 'ar', 'or', 'ir', 'ur', 'er', 'oo', 'ou', 'ow', 'oi', 'oy', 'ay', 'ee', 'ea', 'oa', 'ai', 'ng'];
function chunk(w) {
  const out = [];
  for (let i = 0; i < w.length;) {
    const c = CHUNKS.find(k => w.startsWith(k, i));
    if (c) { out.push(c); i += c.length; } else { out.push(w[i]); i++; }
  }
  return out;
}
// Common mistakes a young speller makes
function misspell(w) {
  const out = [];
  const vi = [...w].findIndex(c => VOWELS.includes(c));
  if (vi >= 0) for (const v of VOWELS) if (v !== w[vi]) out.push(w.slice(0, vi) + v + w.slice(vi + 1));
  if (w.endsWith('e')) out.push(w.slice(0, -1));
  if (w.endsWith('ck')) out.push(w.slice(0, -2) + 'k', w.slice(0, -2) + 'c');
  if (w.includes('igh')) out.push(w.replace('igh', 'ite'), w.replace('igh', 'i'));
  if (w.includes('ee')) out.push(w.replace('ee', 'e'), w.replace('ee', 'ea'));
  if (w.includes('oa')) out.push(w.replace('oa', 'o'), w.replace('oa', 'ow'));
  if (w.includes('ai')) out.push(w.replace('ai', 'a'), w.replace('ai', 'ay'));
  if (w.includes('sh')) out.push(w.replace('sh', 's'), w.replace('sh', 'ch'));
  if (w.includes('ch')) out.push(w.replace('ch', 'sh'));
  if (w.includes('ar')) out.push(w.replace('ar', 'or'));
  if (w.includes('ou')) out.push(w.replace('ou', 'ow'));
  if (w.startsWith('c')) out.push('k' + w.slice(1));
  if (w.startsWith('k')) out.push('c' + w.slice(1));
  if (w.includes('qu')) out.push(w.replace('qu', 'kw'));
  if (!w.endsWith('e') && /[aeiou][^aeiou]$/.test(w)) out.push(w + 'e');
  out.push(w.split('').reverse().join('') === w ? w + w.slice(-1) : w.slice(0, -1) + w.slice(-1) + w.slice(-1));
  return out;
}
