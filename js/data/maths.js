// Number Jungle: maths from Grade 1 (Term 1) — numbers 0-19, counting, sets,
// shapes, patterns, ordering, partitioning, tens & ones, addition and
// subtraction (take away, ten frames, number bonds, number sentences).
import { rnd, pick, shuffle, numOptions, textOptions, NUM_WORDS, cap, sample } from '../util.js';
import { tenFrames, numberBond, tensOnes, group, equation, lineSVG, vertical, numberLine } from '../visuals.js';

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
      if (l > 1 && Math.random() < 0.35) {
        // Column addition (no carrying): ones add to 9 or less
        const top = l === 3 ? rnd(10, 18) : rnd(2, 9);
        const bot = rnd(0, Math.min(9, 9 - (top % 10)));
        return {
          say: `${top} plus ${bot}. How many altogether?`,
          visual: vertical(top, '+', bot),
          options: numOptions(top + bot, 0, 19), answer: top + bot,
          explain: top >= 10 ? `Add the ones: ${top % 10} plus ${bot} is ${top % 10 + bot}. Keep the 1 ten. The answer is ${top + bot}.` : `${top} plus ${bot} is ${top + bot}.`,
        };
      }
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
      const mode = l === 1 ? pick([0, 3]) : pick([0, 1, 2, 3, 3]);
      if (mode === 3) {
        // Column subtraction: big number on top, take-away number below, line, answer.
        // Level 3 uses teen numbers in tens & ones (no borrowing).
        let top = a, bot = b;
        if (l === 3 && Math.random() < 0.5) { top = rnd(11, 19); bot = rnd(0, top % 10); }
        return {
          say: `${top} take away ${bot}. How many are left?`,
          visual: vertical(top, '−', bot) + (top <= 10 ? tenFrames(top, bot) : ''),
          options: numOptions(top - bot, 0, 19), answer: top - bot,
          explain: top >= 10 ? `Start with the ones: ${top % 10} take away ${bot} is ${top % 10 - bot}. The 1 ten stays. So the answer is ${top - bot}.` : `${top} take away ${bot} is ${top - bot}.`,
        };
      }
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

  // ================= NUMBER LINES =================
  {
    id: 'm-nl-learn', name: 'Meet the number line', emoji: '📺',
    gen(l) {
      const lessons = ['intro', 'back'];
      if (l > 1) lessons.push('add');
      if (l > 2) lessons.push('sub');
      const kind = pick(lessons);
      const line = { min: 0, max: 10 };
      const nl = extra => `<div class="nl-wrap">${numberLine({ ...line, ...extra })}</div>`;
      // Frog hops from a to b, counting each hop out loud
      const hopAlong = async (vis, speak, a, b, countNumbers) => {
        const d = Math.sign(b - a), hops = [];
        let f = a;
        vis.innerHTML = nl({ frogAt: f });
        while (f !== b) {
          hops.push([f, f + d]); f += d;
          vis.innerHTML = nl({ frogAt: f, hops: [...hops] });
          await speak(countNumbers ? String(f) : String(hops.length), { rate: 0.85 });
        }
      };
      if (kind === 'intro') return {
        say: 'This is a number line! It is like a road for numbers. It starts at 0.',
        visual: nl({ frogAt: 0, marks: { 0: '#ffd23f' } }),
        prelude: async (vis, speak) => {
          await speak('Each hop this way is one more. Count with Froggy!');
          await hopAlong(vis, speak, 0, 10, true);
          await speak('The numbers get bigger as Froggy hops to the right.');
        },
        ask: 'Which way do numbers get bigger?',
        options: [{ html: '<span class="pic">➡️</span><span class="lbl">This way</span>', value: 'r', say: 'to the right' }, { html: '<span class="pic">⬅️</span><span class="lbl">That way</span>', value: 'l', say: 'to the left' }],
        cols: 'two', answer: 'r',
        explain: 'Numbers get bigger as we go to the right. 1, 2, 3, 4...',
      };
      if (kind === 'back') return {
        say: 'Let us count back on the number line! Froggy starts at 10.',
        visual: nl({ frogAt: 10 }),
        prelude: async (vis, speak) => {
          await speak('Each hop back is one less. Count back with Froggy!');
          await hopAlong(vis, speak, 10, 0, true);
          await speak('The numbers get smaller as Froggy hops to the left.');
        },
        ask: 'Which way do numbers get smaller?',
        options: [{ html: '<span class="pic">➡️</span><span class="lbl">This way</span>', value: 'r', say: 'to the right' }, { html: '<span class="pic">⬅️</span><span class="lbl">That way</span>', value: 'l', say: 'to the left' }],
        cols: 'two', answer: 'l',
        explain: 'Numbers get smaller as we go to the left. 10, 9, 8, 7...',
      };
      if (kind === 'add') {
        const a = rnd(1, 6), b = rnd(2, 4);
        return {
          say: `Let us add on the number line! ${a} plus ${b}. Froggy starts at ${a}.`,
          visual: nl({ frogAt: a, marks: { [a]: '#ffd23f' } }),
          prelude: async (vis, speak) => {
            await speak(`Adding means hop to the right. We hop ${b} times. Count the hops!`);
            await hopAlong(vis, speak, a, a + b, false);
          },
          ask: `Where did Froggy land? ${a} + ${b} = ?`,
          options: numOptions(a + b, 0, 10), answer: a + b,
          explain: `Start at ${a}. Hop ${b} to the right. Froggy lands on ${a + b}.`,
        };
      }
      const a = rnd(5, 10), b = rnd(2, 4);
      return {
        say: `Let us take away on the number line! ${a} take away ${b}. Froggy starts at ${a}.`,
        visual: nl({ frogAt: a, marks: { [a]: '#ffd23f' } }),
        prelude: async (vis, speak) => {
          await speak(`Take away means hop to the left. We hop ${b} times. Count the hops!`);
          await hopAlong(vis, speak, a, a - b, false);
        },
        ask: `Where did Froggy land? ${a} − ${b} = ?`,
        options: numOptions(a - b, 0, 10), answer: a - b,
        explain: `Start at ${a}. Hop ${b} to the left. Froggy lands on ${a - b}.`,
      };
    },
  },
  {
    id: 'm-nl-build', name: 'Build the number line', emoji: '🧱',
    gen(l) {
      const max = l === 3 ? 20 : 10;
      const n = rnd(1, max - 1);
      // level 1: every other number shown. level 2+: only some numbers shown
      const show = v => v === 0 || v === max || v === n - 1 || v === n + 1 || (l === 1 && v % 2 === 0) || (l === 2 && v % 5 === 0) || (l === 3 && v % 10 === 0);
      return {
        say: 'Which number is missing in the box? Count along the line.',
        visual: `<div class="nl-wrap">${numberLine({ min: 0, max, show, boxAt: n })}</div>`,
        options: numOptions(n, 0, max), answer: n,
        explain: `It goes ${n - 1}, ${n}, ${n + 1}. The missing number is ${n}.`,
        explainVisual: `<div class="nl-wrap">${numberLine({ min: 0, max, marks: { [n]: '#2ec27e' } })}</div>`,
      };
    },
  },
  {
    id: 'm-nl-read', name: 'Read the number line', emoji: '🔻',
    gen(l) {
      const max = l === 3 ? 20 : 10;
      const n = rnd(1, max - 1);
      const show = l === 1 ? v => v !== n : l === 2 ? v => v % 5 === 0 : v => v % 5 === 0;
      return {
        say: 'What number is the pink arrow pointing to?',
        visual: `<div class="nl-wrap">${numberLine({ min: 0, max, show, arrowAt: n })}</div>`,
        options: numOptions(n, 0, max), answer: n,
        explain: l === 1 ? `Look at the numbers next to it: ${n - 1} and ${n + 1}. The arrow is on ${n}.` : `Count the lines from ${Math.floor(n / 5) * 5}. The arrow is on ${n}.`,
        explainVisual: `<div class="nl-wrap">${numberLine({ min: 0, max, arrowAt: n, marks: { [n]: '#2ec27e' } })}</div>`,
      };
    },
  },
  {
    id: 'm-nl-tap', name: 'Find it on the line', emoji: '👆', type: 'numline',
    gen(l) {
      const max = l === 3 ? 20 : 10;
      const n = rnd(1, max);
      const show = l === 1 ? () => true : v => v % 5 === 0;
      return {
        type: 'numline', mode: 'tap', target: n, line: { min: 0, max, show },
        say: `Tap the number ${n} on the number line.`,
        hint: l === 1 ? '' : 'Count the lines from 0.',
        explain: l === 1 ? `Here is ${n}.` : `Count from 0, one line at a time, until you get to ${n}.`,
      };
    },
  },
  {
    id: 'm-nl-hop', name: 'Hop to add & take away', emoji: '🐸', type: 'numline',
    gen(l) {
      const sub = l > 1 && Math.random() < 0.5;
      const max = l === 3 ? 20 : 10;
      const b = rnd(1, l === 1 ? 3 : 5);
      const a = sub ? rnd(b, max) : rnd(0, max - b);
      return {
        type: 'numline', mode: 'hop', start: a, hops: sub ? -b : b, line: { min: 0, max },
        say: sub ? `${a} take away ${b}. Froggy is on ${a}. Tap to hop ${b} to the left!` : `${a} plus ${b}. Froggy is on ${a}. Tap to hop ${b} to the right!`,
        text: sub ? `${a} − ${b}: hop ${b} to the left ⬅️` : `${a} + ${b}: hop ${b} to the right ➡️`,
        hint: 'Tap the very next number. One hop at a time!',
        after: sub ? `${a} take away ${b} is ${a - b}!` : `${a} plus ${b} is ${a + b}!`,
        explain: sub ? `Take away means hop left. Start on ${a}, hop ${b} times, and land on ${a - b}.` : `Plus means hop right. Start on ${a}, hop ${b} times, and land on ${a + b}.`,
      };
    },
  },
  {
    id: 'm-nl-compare', name: 'Bigger or smaller?', emoji: '↔️',
    gen(l) {
      const max = l === 3 ? 20 : 10;
      const [a, b] = sample(Array.from({ length: max + 1 }, (_, i) => i), 2);
      const askBig = Math.random() < 0.5;
      const ans = askBig ? Math.max(a, b) : Math.min(a, b);
      return {
        say: askBig ? `Which number is bigger, ${a} or ${b}? Look at the number line.` : `Which number is smaller, ${a} or ${b}? Look at the number line.`,
        visual: `<div class="nl-wrap">${numberLine({ min: 0, max, marks: { [a]: '#ffd23f', [b]: '#ffd23f' } })}</div>`,
        options: [a, b].map(v => ({ html: String(v), value: v, say: String(v) })), cols: 'two', answer: ans,
        explain: askBig ? `${Math.max(a, b)} is further to the right, so it is bigger.` : `${Math.min(a, b)} is further to the left, so it is smaller.`,
      };
    },
  },
];
