// Number Jungle: maths from Grade 1 (Term 1) — numbers 0-19, counting, sets,
// shapes, patterns, ordering, partitioning, tens & ones, addition and
// subtraction (take away, ten frames, number bonds, number sentences).
import { rnd, pick, shuffle, numOptions, textOptions, NUM_WORDS, cap, sample } from '../util.js';
import { tenFrames, numberBond, tensOnes, group, equation, lineSVG } from '../visuals.js';

const THINGS = [
  ['🥭', 'mangoes'], ['🍌', 'bananas'], ['🐟', 'fish'], ['🌺', 'flowers'], ['🐢', 'turtles'],
  ['🦜', 'parrots'], ['🥥', 'coconuts'], ['⚽', 'balls'], ['🐞', 'ladybugs'], ['⭐', 'stars'],
  ['🍎', 'apples'], ['🐥', 'chicks'], ['🦋', 'butterflies'], ['🍪', 'cookies'], ['🎈', 'balloons'],
];
const NAMES = ['Zinnia', 'Mummy', 'Daddy', 'Grandma', 'Kai', 'Maya', 'Leo', 'Ava'];
const maxFor = l => [10, 10, 15, 19][l];

export const mathSkills = [
  {
    id: 'm-count', name: 'Count them!', emoji: '🔢',
    gen(l) {
      const n = rnd(l === 1 ? 1 : 4, maxFor(l));
      const [e, w] = pick(THINGS);
      return {
        say: `How many ${w} can you count?`,
        visual: group(e, n, 'style="max-width:560px"'),
        options: numOptions(n, 0, 20), answer: n,
        explain: `Touch each one and count: there are ${n} ${w}.`,
      };
    },
  },
  {
    id: 'm-names', name: 'Number names', emoji: '🔤',
    gen(l) {
      const n = rnd(0, l === 1 ? 10 : 19);
      if (Math.random() < 0.5) {
        // read the word, pick the number (forces reading)
        return {
          say: 'Read the number word. Which number is it?', readFirst: true,
          visual: `<div class="word-big">${NUM_WORDS[n]}</div>`,
          options: numOptions(n, 0, 19), answer: n,
          explain: `This word says ${NUM_WORDS[n]}. ${NUM_WORDS[n]} is ${n}.`,
        };
      }
      const opts = new Set([n]);
      while (opts.size < 4) opts.add(Math.max(0, Math.min(19, n + rnd(-4, 4))));
      return {
        say: `Find the word for this number.`,
        visual: `<div class="eq">${n}</div>`,
        options: shuffle([...opts]).map(v => ({ html: NUM_WORDS[v], value: v })), answer: n,
        explain: `${n} is spelled ${NUM_WORDS[n].split('').join(' ')}: ${NUM_WORDS[n]}.`,
      };
    },
  },
  {
    id: 'm-sequence', name: 'Count on & back', emoji: '🐸',
    gen(l) {
      const back = l > 1 && Math.random() < 0.5;
      const len = 4;
      const start = back ? rnd(len, maxFor(l)) : rnd(0, maxFor(l) - len);
      const seq = Array.from({ length: len }, (_, i) => (back ? start - i : start + i));
      const gap = rnd(1, len - 1);
      const ans = seq[gap];
      const shown = seq.map((v, i) => (i === gap ? '?' : v));
      return {
        say: back ? 'Froggy is hopping backwards! Which number is missing?' : 'Froggy is hopping forwards! Which number is missing?',
        visual: `<div style="font-size:60px">🐸</div>` + equation(shown.flatMap((v, i) => (i ? [',', v] : [v]))),
        options: numOptions(ans, 0, 20), answer: ans,
        explain: back ? `Counting back: ${seq.join(', ')}.` : `Counting on: ${seq.join(', ')}.`,
      };
    },
  },
  {
    id: 'm-compare', name: 'More or fewer?', emoji: '⚖️',
    gen(l) {
      const [e, w] = pick(THINGS);
      let a = rnd(1, l === 1 ? 8 : 12), b = rnd(1, l === 1 ? 8 : 12);
      if (a === b && (l === 1 || Math.random() < 0.7)) b = a + (a > 2 ? -1 : 1) * rnd(1, 2);
      const askMore = Math.random() < 0.5;
      const opts = [
        { html: '<span class="pic">👈</span><span class="lbl">This side</span>', value: 'L' },
        { html: '<span class="pic">👉</span><span class="lbl">That side</span>', value: 'R' },
      ];
      if (l > 1) opts.push({ html: '<span class="pic">🟰</span><span class="lbl">Same</span>', value: 'S' });
      const ans = a === b ? 'S' : (askMore ? (a > b ? 'L' : 'R') : (a < b ? 'L' : 'R'));
      return {
        say: askMore ? `Which group has more ${w}?` : `Which group has fewer ${w}?`,
        visual: `<div class="groups">${group(e, a)}${group(e, b)}</div>`,
        options: opts, answer: ans, cols: 'two',
        explain: `This side has ${a} and that side has ${b}. ${a === b ? 'They are the same!' : (a > b ? a + ' is more than ' + b : b + ' is more than ' + a) + '.'} Match them up one to one to check!`,
      };
    },
  },
  {
    id: 'm-order', name: 'Order the numbers', emoji: '📏', type: 'order',
    gen(l) {
      const count = l === 1 ? 3 : 4;
      const nums = sample(Array.from({ length: maxFor(l) + 1 }, (_, i) => i), count);
      const big = l === 3 && Math.random() < 0.5;
      const sorted = [...nums].sort((a, b) => (big ? b - a : a - b));
      return {
        type: 'order',
        say: big ? 'Tap the numbers from biggest to smallest.' : 'Tap the numbers from smallest to biggest.',
        items: shuffle(nums), answer: sorted,
        explain: `In order: ${sorted.join(', ')}.`,
      };
    },
  },
  {
    id: 'm-tens', name: 'Tens & ones', emoji: '🧱',
    gen(l) {
      const n = rnd(10, 19);
      const mode = l === 1 ? 0 : rnd(0, 2);
      if (mode === 0) return {
        say: 'One bundle is ten. How many altogether?',
        visual: tensOnes(n), options: numOptions(n, 10, 20), answer: n,
        explain: `1 ten and ${n - 10} ones make ${n}.`,
      };
      if (mode === 1) return {
        say: `How many ones are in ${n}?`,
        visual: `<div class="eq">${n} = 1 ten and <span class="gap">?</span> ones</div>`,
        options: numOptions(n - 10, 0, 9), answer: n - 10,
        explain: `${n} is 1 ten and ${n - 10} ones.`,
      };
      return {
        say: `What number is 1 ten and ${n - 10} ones?`,
        visual: `<div class="eq">1 ten + ${n - 10} ones = <span class="gap">?</span></div>`,
        options: numOptions(n, 10, 19), answer: n,
        explain: `10 and ${n - 10} more make ${n}.`,
      };
    },
  },
  {
    id: 'm-bond', name: 'Number bonds', emoji: '🔗',
    gen(l) {
      const whole = rnd(3, l === 1 ? 6 : l === 2 ? 10 : 15);
      const a = rnd(0, whole), b = whole - a;
      const miss = l === 1 ? 'part' : pick(['part', 'part', 'whole']);
      if (miss === 'whole') return {
        say: 'Put the two parts together. How many in all?',
        visual: numberBond(null, a, b), options: numOptions(whole, 0, 20), answer: whole,
        explain: `${a} and ${b} together make ${whole}.`,
      };
      return {
        say: `${whole} in all. One part is ${a}. What is the other part?`,
        visual: numberBond(whole, a, null), options: numOptions(b, 0, 20), answer: b,
        explain: `${whole} take away ${a} is ${b}. So ${a} and ${b} make ${whole}.`,
      };
    },
  },
  {
    id: 'm-add', name: 'Adding', emoji: '➕',
    gen(l) {
      const max = l === 1 ? 6 : l === 2 ? 10 : 18;
      const a = rnd(1, Math.min(9, max - 1)), b = rnd(0, Math.min(9, max - a));
      const [e, w] = pick(THINGS);
      const name = pick(NAMES);
      if (l === 1 || Math.random() < 0.4) return {
        say: `${name} has ${a} ${w}, and gets ${b} more. How many now?`,
        visual: `<div class="groups">${group(e, a)}<div class="eq">+</div>${group(e, b)}</div>`,
        options: numOptions(a + b, 0, 20), answer: a + b,
        explain: `Count them all: ${a} and ${b} more makes ${a + b}.`,
      };
      return {
        say: `What is ${a} plus ${b}?`,
        visual: (a + b <= 20 ? tenFrames(a + b, 0, b) : '') + equation([a, '+', b, '=', '?']),
        options: numOptions(a + b, 0, 20), answer: a + b,
        explain: `Start at ${a} and count on ${b}: ${a + b}.`,
      };
    },
  },
  {
    id: 'm-sub', name: 'Take away', emoji: '➖',
    gen(l) {
      // Class works within 10
      const a = rnd(l === 1 ? 2 : 3, 10);
      const b = rnd(0, a);
      const [e, w] = pick(THINGS);
      const mode = l === 1 ? 0 : rnd(0, 2);
      if (mode === 0) return {
        say: `There are ${a} dots. Take away ${b}. How many are left?`,
        visual: tenFrames(a, b) + equation([a, '−', b, '=', '?']),
        options: numOptions(a - b, 0, 10), answer: a - b,
        explain: `Cross out ${b}. Count what is left. ${a} take away ${b} is ${a - b}.`,
      };
      if (mode === 1) {
        const name = pick(NAMES);
        return {
          say: `${name} had ${a} ${w}. ${b === 0 ? 'Nobody ate any!' : `${b} got eaten!`} How many are left?`,
          visual: group(e, a - b) + `<div class="group" style="opacity:.3">${Array(b).fill(e).join(' ')}</div>`,
          options: numOptions(a - b, 0, 10), answer: a - b,
          explain: `${a} take away ${b} equals ${a - b}.`,
        };
      }
      // fact family pair, like the class slides: 8 - 3 = 5 so 8 - 5 = ?
      return {
        say: `If ${a} take away ${b} equals ${a - b}, then what is ${a} take away ${a - b}?`,
        visual: `<div class="eq" style="font-size:44px">${a} − ${b} = ${a - b}</div>` + equation([a, '−', a - b, '=', '?']),
        options: numOptions(b, 0, 10), answer: b,
        explain: `${a} − ${b} = ${a - b}, so ${a} − ${a - b} = ${b}.`,
      };
    },
  },
  {
    id: 'm-pattern', name: 'Patterns', emoji: '🌈',
    gen(l) {
      const pool = shuffle(['🔴', '🔵', '🟡', '🟢', '⭐', '🌸', '🐠', '🍓', '🌙', '🦋']);
      const cores = l === 1 ? [[0, 1]] : l === 2 ? [[0, 1], [0, 0, 1], [0, 1, 1]] : [[0, 1, 2], [0, 0, 1, 1], [0, 1, 1], [0, 1, 2, 2]];
      const core = pick(cores);
      const len = core.length * 2 + rnd(1, core.length);
      const seq = Array.from({ length: len }, (_, i) => pool[core[i % core.length]]);
      const ans = pool[core[len % core.length]];
      const choices = [...new Set([ans, ...pool.slice(0, 3)])].slice(0, 3);
      return {
        say: 'What comes next in the pattern?',
        visual: `<div class="group" style="max-width:none">${seq.join(' ')} <span class="gap" style="border-bottom:6px solid #5b3fd1">❓</span></div>`,
        options: shuffle(choices).map(c => ({ html: `<span class="pic">${c}</span>`, value: c })), answer: ans,
        explain: `The pattern goes ${core.map(i => pool[i]).join(' ')}, again and again.`,
      };
    },
  },
  {
    id: 'm-partition', name: 'Split it up', emoji: '✂️',
    gen(l) {
      const n = rnd(4, l === 1 ? 8 : l === 2 ? 10 : 15);
      const a = rnd(1, n - 1);
      const [e, w] = pick(THINGS);
      return {
        say: `${n} ${w} go in two baskets. ${a} are in the first basket. How many are in the other basket?`,
        visual: `<div class="groups">${group(e, a)}<div class="group">🧺 ?</div></div>` + numberBond(n, a, null),
        options: numOptions(n - a, 0, 15), answer: n - a,
        explain: `${n} is ${a} and ${n - a}.`,
      };
    },
  },
  {
    id: 'm-shapes', name: 'Shapes', emoji: '🔺',
    gen(l) {
      if (l === 1 || Math.random() < 0.5) {
        const shapes = { circle: '<svg viewBox="0 0 100 100" width="130"><circle cx="50" cy="50" r="44" fill="#ff5964"/></svg>',
          square: '<svg viewBox="0 0 100 100" width="130"><rect x="8" y="8" width="84" height="84" fill="#3fa9f5"/></svg>',
          triangle: '<svg viewBox="0 0 100 100" width="130"><polygon points="50,6 96,92 4,92" fill="#2ec27e"/></svg>',
          rectangle: '<svg viewBox="0 0 160 100" width="190"><rect x="6" y="18" width="148" height="64" fill="#ffd23f"/></svg>',
          oval: '<svg viewBox="0 0 160 100" width="190"><ellipse cx="80" cy="50" rx="74" ry="42" fill="#b36bff"/></svg>' };
        const name = pick(Object.keys(shapes));
        return {
          say: 'What is the name of this shape?', visual: shapes[name],
          options: textOptions(sample(Object.keys(shapes).filter(s => s !== name), 2).concat(name)), answer: name,
          explain: `This is a ${name}.`,
        };
      }
      const natural = [['🌳', 'tree'], ['🌸', 'flower'], ['🪨', 'rock'], ['🐚', 'shell'], ['🌙', 'moon'], ['☀️', 'sun'], ['🍃', 'leaf'], ['🏔️', 'mountain'], ['🥚', 'egg']];
      const made = [['🏠', 'house'], ['🚗', 'car'], ['⚽', 'ball'], ['📺', 'TV'], ['🪑', 'chair'], ['📦', 'box'], ['🕰️', 'clock'], ['🚲', 'bike'], ['✏️', 'pencil']];
      const isNat = Math.random() < 0.5;
      const [e, w] = pick(isNat ? natural : made);
      return {
        say: `Is the ${w} a natural shape or a man-made shape?`, visual: `<div style="font-size:120px">${e}</div>`,
        options: [{ html: '<span class="pic">🌿</span><span class="lbl">Natural</span>', value: 'n', say: 'natural' },
          { html: '<span class="pic">🛠️</span><span class="lbl">Man-made</span>', value: 'm', say: 'man-made' }],
        cols: 'two', answer: isNat ? 'n' : 'm',
        explain: isNat ? `God made the ${w}. It is natural.` : `People made the ${w}. It is man-made.`,
      };
    },
  },
  {
    id: 'm-lines', name: 'Straight & curved', emoji: '〰️',
    gen() {
      const straight = ['straight', 'slant', 'zigzag', 'vertical'];
      const curved = ['curved', 'wavy', 'circleline'];
      const isS = Math.random() < 0.5;
      const k = pick(isS ? straight : curved);
      return {
        say: 'Is this line straight or curved?', visual: lineSVG(k),
        options: [{ html: '<span class="pic">📏</span><span class="lbl">Straight</span>', value: 's', say: 'straight' },
          { html: '<span class="pic">🌙</span><span class="lbl">Curved</span>', value: 'c', say: 'curved' }],
        cols: 'two', answer: isS ? 's' : 'c',
        explain: isS ? 'A straight line does not bend.' : 'A curved line bends, like a rainbow.',
      };
    },
  },
  {
    id: 'm-oneone', name: 'Match one to one', emoji: '🤝',
    gen(l) {
      const kids = rnd(2, l === 1 ? 5 : 8);
      const hats = kids + rnd(-2, 2) || 1;
      const ans = hats === kids ? 'same' : hats > kids ? 'extra' : 'short';
      return {
        say: 'Each child needs one hat. Are there enough hats?',
        visual: `<div class="groups">${group('🧒', kids)}${group('🧢', Math.max(1, hats))}</div>`,
        options: [{ html: '<span class="pic">✅</span><span class="lbl">Just right</span>', value: 'same', say: 'just right' },
          { html: '<span class="pic">➕</span><span class="lbl">Too many hats</span>', value: 'extra', say: 'too many hats' },
          { html: '<span class="pic">😢</span><span class="lbl">Not enough</span>', value: 'short', say: 'not enough hats' }],
        answer: hats < 1 ? 'short' : ans,
        explain: `${kids} children. ${Math.max(1, hats)} hats. Give one hat to each child to check.`,
      };
    },
  },
];
