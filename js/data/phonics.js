// Sound Safari: phonics from the class (Abeka Special Sounds Charts 6-8, vowels,
// one- and two-vowel rules with marking, C/K rule, ck/k/ke, double consonants).
import { pick, shuffle, sample, esc } from '../util.js';
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
      const L1 = ['cat', 'dog', 'pig', 'hen', 'sun', 'bus', 'cup', 'bed', 'fox', 'hat', 'net', 'egg', 'bat', 'van', 'web', 'six', 'ten', 'map'];
      const L2 = ['duck', 'fish', 'ship', 'frog', 'crab', 'drum', 'bell', 'doll', 'sock', 'cake', 'kite', 'bike', 'goat', 'tree', 'boat', 'moon', 'book', 'star', 'king', 'ring'];
      const L3 = ['snake', 'train', 'sheep', 'clock', 'plant', 'house', 'mouse', 'chick', 'shark', 'cloud', 'night', 'snail', 'horse', 'chair', 'three'];
      const w = pick((l === 1 ? L1 : l === 2 ? L2 : L3).filter(x => picOf(x)));
      const extra = sample('abcdefghilmnoprstu'.split('').filter(c => !w.includes(c)), l === 1 ? 1 : 2);
      return {
        type: 'build', word: w, extra,
        say: `Spell ${w}. ${w}.`, text: 'Spell the word you hear! 👂', visual: `<div style="font-size:110px">${picOf(w)}</div>`,
        explain: `${w} is spelled ${w.split('').join(', ')}.`,
      };
    },
  },
];
