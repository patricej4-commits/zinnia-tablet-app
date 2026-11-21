// Number Jungle: maths from Grade 1 (Term 1) — numbers 0-19, counting, sets,
// shapes, patterns, ordering, partitioning, tens & ones, addition and
// subtraction (take away, ten frames, number bonds, number sentences).
import { rnd, pick, shuffle, numOptions, textOptions, NUM_WORDS, cap, sample } from '../util.js';
import { tenFrames, numberBond, tensOnes, group, equation, lineSVG, vertical, numberLine, clockSVG, tally, miniFrame, bar } from '../visuals.js';

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
      if (l > 1 && Math.random() < 0.4) {
        // just before / just after / between
        const n = rnd(1, maxFor(l) - 1);
        const kind = pick(['before', 'after', 'between']);
        const ans = kind === 'before' ? n - 1 : kind === 'after' ? n + 1 : n;
        const q = kind === 'between' ? `Which number comes between ${n - 1} and ${n + 1}?` : `Which number comes just ${kind} ${n}?`;
        return {
          say: q, visual: kind === 'between' ? equation([n - 1, ',', '?', ',', n + 1]) : kind === 'before' ? equation(['?', ',', n]) : equation([n, ',', '?']),
          options: numOptions(ans, 0, 20), answer: ans,
          explain: kind === 'before' ? `Just before means one less. ${ans} comes just before ${n}.` : kind === 'after' ? `Just after means one more. ${ans} comes just after ${n}.` : `${n - 1}, ${n}, ${n + 1}. ${n} is in between.`,
        };
      }
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
      const big = l > 1 && Math.random() < 0.5;
      const sorted = [...nums].sort((a, b) => (big ? b - a : a - b));
      return {
        type: 'order',
        say: big ? 'Descending order! Tap the numbers from biggest to smallest.' : 'Ascending order! Tap the numbers from smallest to biggest.',
        items: shuffle(nums), answer: sorted,
        explain: `${big ? 'Descending means going down' : 'Ascending means going up'}: ${sorted.join(', ')}.`,
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
      const a = rnd(1, Math.min(9, max - 1)), b = rnd(1, Math.min(9, max - a));
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
      if (l > 1 && Math.random() < 0.4) {
        // Find the core: the part that repeats
        const seq = Array.from({ length: core.length * 3 }, (_, i) => pool[core[i % core.length]]).join(' ');
        const right = core.map(i => pool[i]).join(' ');
        const wrongs = [...new Set([core.slice(0, -1).map(i => pool[i]).join(' '), [...core, core[0]].map(i => pool[i]).join(' '), core.map(i => pool[i]).reverse().join(' ')])].filter(x => x && x !== right).slice(0, 2);
        return {
          say: 'What is the core of this pattern? The core is the part that repeats.',
          visual: `<div class="group" style="max-width:none">${seq}</div>`,
          options: shuffle([right, ...wrongs]).map(x => ({ html: `<span class="lbl" style="font-size:36px">${x}</span>`, value: x })), answer: right,
          explain: `The core is ${right}. It repeats again and again.`,
        };
      }
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

  {
    id: 'm-regroup', name: 'Regroup the set', emoji: '🔄',
    gen(l) {
      const [e, w] = pick(THINGS);
      if (l === 1 || Math.random() < 0.5) {
        // Same set, new groups: the number stays the same
        const n = rnd(4, l === 1 ? 8 : 12);
        const a = rnd(1, n - 1), b = rnd(1, n - 1);
        return {
          say: `Here are ${n} ${w}. Zinnia moves them into new groups. How many ${w} are there now?`,
          visual: `<div class="groups">${group(e, a)}${group(e, n - a)}</div><div style="font-size:50px">⬇️</div><div class="groups">${group(e, b)}${group(e, n - b)}</div>`,
          options: numOptions(n, 0, 15), answer: n,
          explain: `Moving them into new groups does not change how many. There are still ${n}.`,
        };
      }
      // Put a set into equal groups
      const size = pick(l === 2 ? [2, 5] : [2, 5, 10]);
      const groups = rnd(2, size === 10 ? 2 : size === 5 ? 3 : 5);
      const n = size * groups;
      return {
        say: `There are ${n} ${w}. Put them in groups of ${size}. How many groups?`,
        visual: `<div class="groups">${Array.from({ length: groups }, () => group(e, size)).join('')}</div>`,
        options: numOptions(groups, 1, 10), answer: groups,
        explain: `${n} ${w} make ${groups} groups of ${size}.`,
      };
    },
  },
  {
    id: 'm-story', name: 'Maths stories', emoji: '📚',
    gen(l) {
      const [e, w] = pick(THINGS);
      const n1 = pick(NAMES), n2 = pick(NAMES.filter(x => x !== n1));
      const kind = pick(l === 1 ? ['add', 'sub'] : l === 2 ? ['add', 'sub', 'more'] : ['add', 'sub', 'more', 'missing']);
      const a = rnd(2, 9), b = rnd(1, Math.min(9, kind === 'sub' ? a : 10 - a));
      const story = {
        add: [`${n1} has ${a} ${w}. ${n2} gives ${n1} ${b} more. How many ${w} does ${n1} have now?`, a + b, `${a} + ${b} = ${a + b}`],
        sub: [`${n1} has ${a} ${w}. ${n1} gives ${b} to ${n2}. How many ${w} are left?`, a - b, `${a} − ${b} = ${a - b}`],
        more: [`${n1} has ${a + b} ${w}. ${n2} has ${a}. How many more does ${n1} have?`, b, `${a + b} − ${a} = ${b}`],
        missing: [`${n1} had ${a} ${w}. Then ${n1} got some more. Now ${n1} has ${a + b}. How many more did ${n1} get?`, b, `${a} + ${b} = ${a + b}`],
      }[kind];
      return {
        say: story[0], readFirst: l === 3,
        visual: kind === 'more' ? `<div class="groups">${group(e, a + b)}${group(e, a)}</div>` : `<div style="font-size:80px">${e}</div>`,
        options: numOptions(story[1], 0, 20), answer: story[1],
        explain: `${story[2]}. The answer is ${story[1]}.`,
      };
    },
  },
  {
    id: 'm-spellnum', name: 'Spell number words', emoji: '🔡', type: 'build',
    gen(l) {
      const n = rnd(l === 1 ? 0 : l === 2 ? 0 : 10, l === 1 ? 10 : 19);
      const word = NUM_WORDS[n];
      return {
        type: 'build', word, extra: sample('abdhlmnoprstuvw'.split('').filter(c => !word.includes(c)), 1),
        say: `Spell the number word for ${n}. ${word}.`, text: `Spell the number word for ${n}`,
        visual: `<div class="eq">${n}</div>`,
        explain: `${n} is spelled ${word.split('').join(' ')}.`,
      };
    },
  },

  // ================= From the Christmas term revision guide =================
  {
    id: 'm-ordinal', name: '1st, 2nd, 3rd', emoji: '🏁',
    gen(l) {
      const ORD = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th'];
      const ORDW = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth'];
      const racers = sample(['🐢', '🐰', '🐶', '🐱', '🐸', '🐥', '🐷', '🐮', '🦊', '🐼'], l === 1 ? 5 : l === 2 ? 7 : 10);
      const i = rnd(0, racers.length - 1);
      const row = `<div style="display:flex;align-items:center;gap:6px;font-size:clamp(34px,6vw,56px)"><span style="font-size:.5em">🏁 Start</span>${racers.join('')}</div>`;
      if (Math.random() < 0.5) return {
        say: `The animals are in a line. The start is on the left. Who is ${ORDW[i]}?`, text: `Who is ${l === 3 ? ORDW[i] : ORD[i]}?`,
        visual: row,
        options: shuffle([racers[i], ...sample(racers.filter((_, j) => j !== i), 2)]).map(r => ({ html: `<span class="pic">${r}</span>`, value: r })), answer: racers[i],
        explain: `Count from the start: ${ORDW.slice(0, i + 1).join(', ')}. ${racers[i]} is ${ORDW[i]}.`,
      };
      const opts = [i, ...sample([...Array(racers.length).keys()].filter(j => j !== i), 2)];
      return {
        say: `What place is the ${racers[i]} in the line? Count from the start.`,
        visual: row,
        options: shuffle(opts).map(j => ({ html: l === 3 ? ORDW[j] : ORD[j], value: j, say: ORDW[j] })), answer: i,
        explain: `Count from the start: ${ORDW.slice(0, i + 1).join(', ')}.`,
      };
    },
  },
  {
    id: 'm-skip', name: 'Number patterns', emoji: '🦘',
    gen(l) {
      const step = pick(l === 1 ? [1, 2] : l === 2 ? [2, 5, 10] : [2, 5, 10, -1, -2]);
      const start = step > 0 ? (step === 1 ? rnd(0, 12) : step === 2 ? pick([0, 1, 2, 4]) : 0) : rnd(10, 19);
      const seq = Array.from({ length: 5 }, (_, i) => start + step * i);
      const gap = rnd(2, 4);
      const ans = seq[gap];
      return {
        say: step > 0 ? `What is the missing number? This pattern counts by ${step}s.` : `What is the missing number? This pattern counts back by ${-step}.`,
        visual: equation(seq.flatMap((v, i) => (i ? [',', i === gap ? '?' : v] : [v]))),
        options: numOptions(ans, 0, 50), answer: ans,
        explain: `The rule is ${step > 0 ? 'add ' + step : 'take away ' + -step} each time: ${seq.join(', ')}.`,
      };
    },
  },
  {
    id: 'm-represent', name: 'Show a number', emoji: '🎲',
    gen(l) {
      const n = rnd(2, l === 1 ? 10 : 19);
      const others = new Set();
      while (others.size < 3) { const v = Math.max(1, Math.min(19, n + rnd(-3, 3))); if (v !== n) others.add(v); }
      const ways = [v => miniFrame(v), v => tally(v), v => `<span class="lbl">${NUM_WORDS[v]}</span>`, v => (v >= 10 ? `<span class="lbl">1 ten ${v - 10} ones</span>` : `<span style="font-size:28px">${'●'.repeat(v)}</span>`)];
      const opts = shuffle([n, ...others]).map(v => ({ html: pick(ways)(v), value: v }));
      return {
        say: `Which one shows ${n}? Numbers can be shown in different ways!`,
        visual: `<div class="eq">${n}</div>`,
        options: opts, answer: n,
        explain: `${n} can be shown with dots, a ten frame, tally marks, or the word ${NUM_WORDS[n]}.`,
      };
    },
  },
  {
    id: 'm-symbols', name: 'Maths signs', emoji: '⚖️',
    gen(l) {
      const mode = pick(l === 1 ? ['cmp'] : l === 2 ? ['cmp', 'cmp', 'op'] : ['cmp', 'op', 'eq']);
      const SIGN = { '>': 'greater than', '<': 'less than', '=': 'equal to', '≠': 'not equal to', '+': 'add', '−': 'minus' };
      const opt = list => list.map(x => ({ html: x, value: x, say: SIGN[x] }));
      if (mode === 'cmp') {
        const a = rnd(0, 19); let b = rnd(0, 19);
        if (l === 1 && a === b) b = (a + 3) % 20;
        const ans = a > b ? '>' : a < b ? '<' : '=';
        return {
          say: `Which sign goes in the box? ${a} and ${b}.`,
          visual: equation([a, '?', b]),
          options: opt(l === 1 ? ['>', '<'] : ['>', '<', '=']), cols: l === 1 ? 'two' : '', answer: ans,
          explain: ans === '=' ? `${a} is equal to ${b}.` : `${a} is ${SIGN[ans]} ${b}. The open mouth eats the bigger number! 🐊`,
        };
      }
      if (mode === 'op') {
        const a = rnd(2, 10), b = rnd(1, a);
        const plus = Math.random() < 0.5;
        const c = plus ? a + b : a - b;
        return {
          say: `Which sign makes it right? ${a}, ${b}, equals ${c}.`,
          visual: equation([a, '?', b, '=', c]),
          options: opt(['+', '−']), cols: 'two', answer: plus ? '+' : '−',
          explain: `${a} ${plus ? '+' : '−'} ${b} = ${c}.`,
        };
      }
      const a = rnd(1, 9), b = rnd(1, 9 - a + 1);
      const shown = Math.random() < 0.5 ? a + b : a + b + pick([-1, 1]);
      return {
        say: `Is ${a} plus ${b} equal to ${shown}, or not equal?`,
        visual: equation([a, '+', b, '?', shown]),
        options: opt(['=', '≠']), cols: 'two', answer: shown === a + b ? '=' : '≠',
        explain: `${a} + ${b} is ${a + b}. ${shown === a + b ? 'So it is equal.' : `${a + b} is not equal to ${shown}.`}`,
      };
    },
  },
  {
    id: 'm-length', name: 'Long & short', emoji: '📏',
    gen(l) {
      if (Math.random() < 0.5) {
        const a = rnd(2, 9); let b = rnd(2, 9); if (a === b) b = a > 5 ? a - 2 : a + 2;
        const askLong = Math.random() < 0.5;
        const ans = (askLong ? a > b : a < b) ? 'A' : 'B';
        return {
          say: askLong ? 'Which ribbon is longer?' : 'Which ribbon is shorter?',
          visual: `<div style="display:flex;flex-direction:column;gap:14px;align-items:flex-start">${bar(a, '#ff8c42', 'A')}${bar(b, '#3fa9f5', 'B')}</div>`,
          options: [{ html: 'A', value: 'A' }, { html: 'B', value: 'B' }], cols: 'two', answer: ans,
          explain: `Line them up at the start. ${ans} is ${askLong ? 'longer' : 'shorter'}.`,
        };
      }
      const n = rnd(2, l === 1 ? 6 : 9);
      return {
        say: 'How many cubes long is the pencil?',
        visual: `<div style="display:flex;flex-direction:column;align-items:flex-start;gap:4px"><div style="font-size:0">${'<span class="cube" style="width:44px;height:30px;margin:0"></span>'.repeat(n)}</div><div style="height:30px;width:${n * 44}px;background:linear-gradient(90deg,#ffd23f 85%,#2b2250 85%);border-radius:6px 30px 30px 6px"></div></div>`,
        options: numOptions(n, 1, 12), answer: n,
        explain: `Count the cubes from one end to the other: the pencil is ${n} cubes long.`,
      };
    },
  },
  {
    id: 'm-calendar', name: 'Days & months', emoji: '📅',
    gen(l) {
      const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const kind = pick(l === 1 ? ['after', 'before', 'count'] : ['after', 'before', 'count', 'month', 'monthcount', 'first']);
      const fact = {
        count: ['How many days are in one week?', 7, 'There are 7 days in a week.'],
        monthcount: ['How many months are in one year?', 12, 'There are 12 months in a year.'],
      }[kind];
      if (fact) return { say: fact[0], visual: '<div style="font-size:90px">📅</div>', options: numOptions(fact[1], 1, 14), answer: fact[1], explain: fact[2] };
      if (kind === 'first') return {
        say: 'What is the first month of the year?', visual: '<div style="font-size:90px">🎉</div>',
        options: shuffle(['January', 'December', 'June']).map(m => ({ html: m, value: m, say: m })), answer: 'January',
        explain: 'January is the first month. December is the last month.',
      };
      const list = kind === 'month' ? MONTHS : DAYS;
      const i = rnd(1, list.length - 2);
      const before = kind === 'before';
      const ans = before ? list[i - 1] : list[i + 1];
      return {
        say: before ? `Which day comes before ${list[i]}?` : kind === 'month' ? `Which month comes after ${list[i]}?` : `Which day comes after ${list[i]}?`,
        visual: `<div class="word-big" style="font-size:clamp(34px,6vw,60px)">${list[i]}</div>`,
        options: shuffle([ans, ...sample(list.filter(x => x !== ans && x !== list[i]), 2)]).map(x => ({ html: x, value: x, say: x })), answer: ans,
        explain: `${list.slice(Math.max(0, i - 1), i + 2).join(', ')}.`,
      };
    },
  },
  {
    id: 'm-time', name: 'Tell the time', emoji: '🕐',
    gen(l) {
      const hr = rnd(1, 12);
      const half = l === 3 && Math.random() < 0.5;
      const label = (h, m) => (m ? `half past ${h}` : `${h} o'clock`);
      const wrong = sample([...Array(12).keys()].map(x => x + 1).filter(x => x !== hr), 2).map(h => label(h, half ? 30 : 0));
      return {
        say: 'What time is it? Look at the short red hand.',
        visual: clockSVG(hr, half ? 30 : 0, 210),
        options: shuffle([label(hr, half), ...wrong]).map(x => ({ html: x, value: x, say: x })), answer: label(hr, half),
        explain: half ? `The long hand points to 6, so it is half past. The short hand is just past ${hr}. It is half past ${hr}.` : `The long hand points to 12, so it is o'clock. The short hand points to ${hr}. It is ${hr} o'clock.`,
      };
    },
  },
];

