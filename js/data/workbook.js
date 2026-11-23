// From her Abeka Language 1 workbook (Lessons 13–30+): picture words, finish the sentence,
// word-bank stories, "which sentence tells about the picture", riddles, rhyming boxes,
// and writing sentences with a capital letter and a period.
import { pick, shuffle, sample, esc } from '../util.js';

const big = e => `<div style="font-size:96px;line-height:1.1">${e}</div>`;
const blank = '<span style="color:#5b3fd1;border-bottom:5px solid #5b3fd1;padding:0 18px">?</span>';
const words = (list, cls = '') => list.map(w => ({ html: `<span class="lbl ${cls}" style="font-size:34px">${esc(w)}</span>`, value: w }));

// ---- Picture → word (Lesson 13 "Draw a line to the correct word", Lesson 19, "Circle the picture word")
// [picture, right word, look-alike words]
const PIC_WORDS = [
  ['🛁', 'tub', ['tan', 'tug']], ['🖊️', 'pen', ['pet', 'pan']], ['🐷', 'pig', ['peg', 'big']], ['🪆', 'doll', ['dull', 'dot']],
  ['🍖', 'ham', ['him', 'hat']], ['6️⃣', 'six', ['sat', 'sit']], ['🕸️', 'web', ['wet', 'wed']], ['🟥', 'red', ['rib', 'rod']],
  ['🦆', 'duck', ['ducks', 'dogs']], ['🪣', 'pail', ['peel', 'pile']], ['🥛', 'milk', ['silk', 'mill']], ['🐝🐝🐝', 'bees', ['bee', 'beds']],
  ['🐝', 'bee', ['bees', 'see']], ['🧼', 'soap', ['sob', 'soup']], ['🍽️', 'plate', ['plates', 'plane']], ['🚚🚚', 'trucks', ['truck', 'tracks']],
  ['🚚', 'truck', ['trucks', 'track']], ['🐱', 'cat', ['cats', 'cut']], ['🐱🐱🐱', 'cats', ['cat', 'caps']], ['🐶', 'dog', ['dogs', 'dig']],
  ['🐶🐶🐶', 'dogs', ['dog', 'dots']], ['🐷🐷🐷', 'pigs', ['pig', 'pegs']], ['🐔', 'hen', ['ten', 'pen']], ['🥅', 'net', ['nut', 'not']],
  ['🏏', 'bat', ['bet', 'but']], ['🥫', 'can', ['ran', 'cap']], ['🎩', 'hat', ['hot', 'hut']], ['🦊', 'fox', ['box', 'fix']],
  ['📦', 'box', ['fox', 'bus']], ['🔟', 'ten', ['tan', 'hen']], ['🚆', 'train', ['rain', 'trap']], ['⛵', 'boat', ['coat', 'bat']],
  // action words (Lesson 14: run, hop, dig, jump, yell, lick, sip)
  ['🏃', 'run', ['ran', 'sun']], ['🤸', 'jump', ['hump', 'jam']], ['🐸💨', 'hop', ['hip', 'top']], ['🗣️', 'yell', ['bell', 'yes']],
  ['🍦👅', 'lick', ['lock', 'kick']], ['🥤', 'sip', ['sit', 'lip']], ['⛏️', 'dig', ['dog', 'big']],
];

// ---- Finish the sentence (Lessons 14, 19, 27 and "Finish the sentences")
// [picture, sentence, answer, other choices]
const FINISH = [
  ['🥫', 'Sam will hit the ___.', 'can', ['ran']], ['🏏', 'Tom hid the ___.', 'bat', ['win']], ['🐱', 'Jill will pet the ___.', 'cat', ['hat']],
  ['🐷', 'The pig is in a ___.', 'pen', ['nap', 'hand']], ['🐶✋', "The dog will lick Tim's ___.", 'hand', ['pen', 'nap']],
  ['🐱😴', 'The cat will take a ___.', 'nap', ['hand', 'pen']], ['🐀🏏', 'The rat had a ___.', 'bat', ['hat', 'mat']],
  ['🐀🎩', 'The rat ate a ___.', 'hat', ['bat', 'cat']], ['👧🐱', "The cat sat in Pat's ___.", 'lap', ['cap', 'map']],
  ['🐱💤', 'The cat had a ___.', 'nap', ['net', 'nut']], ['🐔', "Ted's pet is a red ___.", 'hen', ['pen', 'ten']],
  ['👩‍🍳🥧', 'Meg will help Mom ___ a pie.', 'bake', ['bike']], ['🚴', 'Dan likes to ___ his bike.', 'ride', ['rope']],
  ['🐻', 'The cub will ___ in the cave.', 'sit', ['sip']], ['🐶🛁', 'The dog is ___.', 'wet', ['web', 'well']],
  ['⛵', 'A boat can sail on the blue ___.', 'sea', ['see', 'tea']], ['🚆', 'Tim rode on a fast ___.', 'train', ['rain', 'tray']],
  ['☀️', 'God made the ___ that shines on me.', 'sun', ['son', 'run']], ['🐐🌱', 'The goat likes to eat ___.', 'grass', ['glass', 'gas']],
  ['🐶', 'A dog can wag his ___.', 'tail', ['tall', 'tell']],
];

// ---- Word-bank stories (Lesson "Write the correct words in the blanks. Read the story.")
// Each story: sentences with {word} blanks. One blank is asked; the others are shown filled in.
const STORIES = [
  { title: 'The Goat', bank: ['eat', 'at', 'grass', 'Ann', 'Goat'], pic: '🐐👧',
    lines: ['The {Goat}', 'The goat is {at} the pond.', '{Ann} will feed him.', 'The goat likes to {eat} {grass}.'] },
  { title: 'The Hike', bank: ['hill', 'hike', 'lake', 'rocks'], pic: '👨👦⛰️',
    lines: ['Dad and Ben went on a {hike}.', 'Ben ran up the {hill}.', 'Dad and Ben will toss {rocks} in the {lake}.'] },
  { title: 'Ted and Tip', bank: ['cat', 'Tip', 'sun', 'play'], pic: '👦🐱',
    lines: ['Ted has a big {cat}.', 'The cat is named {Tip}.', 'Tip naps in the {sun}.', 'Ted and Tip like to {play}.'] },
  { title: "Greg's Boat", bank: ['boat', 'blue', 'fast', 'beat'], pic: '⛵⛵',
    lines: ['Greg has a fine {boat}.', 'It is red and {blue}.', "Greg's boat can sail {fast}.", "It will {beat} Tom's boat."] },
  { title: 'Pat and the Cat', bank: ['lap', 'nap', 'milk', 'pet'], pic: '👧🐱',
    lines: ['Pat has a {pet} cat.', "The cat sat in Pat's {lap}.", 'The cat had a {nap}.', 'Then the cat had some {milk}.'] },
];

// ---- Which sentence tells about the picture? (Lesson "Circle the sentence that tells about the picture")
// [picture, right sentence, wrong sentences]
const TELLS = [
  ['🐻🕳️', 'The cub is in the den.', ['The cub is lost.', 'The cub is in the net.']],
  ['🦭🐟', 'Sam Seal ate the fish.', ['Sam Seal will take a nap.', 'Sam Seal is in the bag.']],
  ['👧👀🐬', 'Jan likes the trick.', ['Jan can eat a big cone.', 'Jan is on the bed.']],
  ['🐞🍃', 'The red bug is on the leaf.', ['The red bug is on the tree.', 'The red bug is in the box.']],
  ['🐶🫧🛁', 'The dog is wet.', ['The cat is wet.', 'The dog is on the log.']],
  ['🐸🪵', 'The frog is on the log.', ['The frog is in the net.', 'The frog is on the bed.']],
  ['🐟🥅', 'The fish is in the net.', ['The fish is on the log.', 'The fish is in the bag.']],
  ['🦊💤', 'The fox is in the den.', ['The fox is at the well.', 'The fox is in the net.']],
  ['🐱👜', 'The cat is in the bag.', ['The cat is on the bed.', 'The cat is on the log.']],
  ['👦📖🛏️', 'The boy is on the bed.', ['The boy is in the bag.', 'The boy is at the well.']],
  ['🐀🎩', 'The rat ate a hat.', ['The rat had a bat.', 'The cat had a nap.']],
  ['🐱💤', 'The cat had a nap.', ['The cat ate a hat.', 'The cat is wet.']],
  ['⛵🌊', 'A boat can sail on the sea.', ['A boat can ride on a track.', 'A boat can fly in the sky.']],
];

// ---- Riddles ("Finish the riddle")
const RIDDLES = [
  ['I am not a plane. I ride on a track. I am a ___.', 'train', '🚆', [['plane', '✈️'], ['boat', '⛵']]],
  ['I say tick-tock. I have two hands. I am a ___.', 'clock', '🕰️', [['bell', '🔔'], ['book', '📖']]],
  ['I am big and yellow. I take children to school. I am a ___.', 'bus', '🚌', [['bike', '🚲'], ['plane', '✈️']]],
  ['I live on a farm. I say moo. I am a ___.', 'cow', '🐮', [['hen', '🐔'], ['pig', '🐷']]],
  ['I have a sail. I float on the sea. I am a ___.', 'boat', '⛵', [['train', '🚆'], ['car', '🚗']]],
  ['I am hot. I shine in the sky in the day. I am the ___.', 'sun', '☀️', [['moon', '🌙'], ['rain', '🌧️']]],
  ['I am green. I hop and sit on a log. I am a ___.', 'frog', '🐸', [['fish', '🐟'], ['duck', '🦆']]],
  ['I have pages. You can read me. I am a ___.', 'book', '📖', [['bed', '🛏️'], ['hat', '🎩']]],
  ['I am round. You can kick me. I am a ___.', 'ball', '⚽', [['box', '📦'], ['kite', '🪁']]],
  ['I lay eggs. I say cluck, cluck. I am a ___.', 'hen', '🐔', [['cat', '🐱'], ['dog', '🐶']]],
  ['I have wings. I fly in the sky. I am not a bird. I am a ___.', 'plane', '✈️', [['bus', '🚌'], ['bee', '🐝']]],
  ['You sleep on me at night. I am a ___.', 'bed', '🛏️', [['chair', '🪑'], ['cup', '☕']]],
];

// ---- Rhyming boxes ("Circle the rhyming words in each box", "Match the rhyming words")
// [rhyming words, the one that does not rhyme]
const RHYME_BOX = [
  [['stop', 'pop', 'flop'], 'Bob'], [['me', 'we', 'she'], 'men'], [['plane', 'mane', 'train'], 'plus'], [['free', 'tree', 'me'], 'my'],
  [['say', 'play', 'clay'], 'shy'], [['duck', 'cluck', 'truck'], 'back'], [['brush', 'hush', 'plush'], 'dish'], [['rake', 'take', 'make', 'lake'], 'poke'],
  [['meat', 'seat'], 'stop'], [['lid', 'bid'], 'joke'], [['joke', 'poke'], 'lid'], [['go', 'so'], 'he'], [['he', 'she'], 'go'],
  [['must', 'rust'], 'shy'], [['shy', 'try'], 'must'], [['mop', 'top'], 'ten'], [['ten', 'pen'], 'box'], [['box', 'fox'], 'mop'],
  [['peep', 'deep'], 'duck'], [['cluck', 'duck'], 'deep'], [['bus', 'plus'], 'his'],
];
const RHYME_PIC = { mop: '🧹', top: '🪀', ten: '🔟', pen: '🖊️', box: '📦', fox: '🦊', duck: '🦆', truck: '🚚', train: '🚆', plane: '✈️', tree: '🌳', bee: '🐝', brush: '🪮', rake: '🍂', lake: '🏞️', bus: '🚌' };

// ---- Capital letter and period (Lesson 30 and on: "Write each sentence correctly")
const CAPS = [
  'A boat can sail on the blue sea.', 'Tim rode on a fast train.', 'God made the sun that shines on me.', 'Ted has a big cat.',
  'The cat is named Tip.', 'Tip naps in the sun.', 'Ted and Tip like to play.', 'Greg has a fine boat.', 'It is red and blue.',
  "Greg's boat can sail fast.", "It will beat Tom's boat.", 'A dog can wag his tail.', "Trish wore Mom's hat.", "Steve wore Dad's hat.",
  'I will help Mom and Dad.', 'Jan likes the trick.', 'Sam Seal ate the fish.', 'Meg will help Mom bake a pie.',
];
// Words that always need a big letter (names, God, Mom, Dad, I)
const NAMES = ['Tim', 'God', 'Ted', 'Tip', 'Greg', "Greg's", "Tom's", 'Trish', "Mom's", "Dad's", 'Steve', 'Mom', 'Dad', 'Jan', 'Sam', 'Seal', 'Meg', 'I'];
const lowerAll = s => s.split(' ').map(w => w.toLowerCase()).join(' ');
const firstLow = s => s.charAt(0).toLowerCase() + s.slice(1);

export const workbookSkills = [
  {
    id: 'r-picword', name: 'Picture words', emoji: '🖼️',
    gen(l) {
      const [p, w, look] = pick(PIC_WORDS);
      const opts = l === 1 ? [w, look[0]] : [w, ...look];
      return {
        say: 'Look at the picture. Read the words. Which word matches the picture?', readFirst: true,
        visual: big(p), options: shuffle(words(opts)), cols: opts.length === 2 ? 'two' : undefined, answer: w,
        explain: `The picture shows ${w}. Look at every letter: ${w.split('').join(', ')}.`,
      };
    },
  },
  {
    id: 'r-finish', name: 'Finish the sentence', emoji: '✏️',
    gen(l) {
      const [p, s, a, others] = pick(FINISH);
      const opts = l === 1 ? [a, others[0]] : [a, ...others];
      return {
        say: l === 1 ? `Look at the picture. ${s.replace('___', 'blank')} Which word finishes the sentence?` : 'Look at the picture. Read the sentence. Which word finishes it?',
        readFirst: l > 1,
        visual: `${big(p)}<div class="sentence">${esc(s).replace('___', blank)}</div>`,
        options: shuffle(words(opts)), cols: opts.length === 2 ? 'two' : undefined, answer: a,
        explain: `Look at the picture! ${s.replace('___', a)}`,
      };
    },
  },
  {
    id: 'r-wordbank', name: 'Word bank story', emoji: '📝',
    gen(l) {
      const st = pick(STORIES);
      const blanks = st.lines.flatMap((t, li) => [...t.matchAll(/\{(\w+)\}/g)].map((m, k) => ({ li, k, w: m[1] })));
      const t = pick(blanks), a = t.w;
      const lines = st.lines.map((line, li) => {
        let k = -1;
        return esc(line).replace(/\{(\w+)\}/g, (m, w) => (++k, li === t.li && k === t.k ? blank : `<u>${w}</u>`));
      });
      const asked = st.lines[t.li].replace(/\{(\w+)\}/g, (m, w) => w);
      const said = (() => { let k = -1; return st.lines[t.li].replace(/\{(\w+)\}/g, (m, w) => (++k === t.k ? 'blank' : w)); })();
      const opts = l === 1 ? [a, pick(st.bank.filter(b => b !== a))] : l === 2 ? [a, ...sample(st.bank.filter(b => b !== a), 2)] : st.bank;
      return {
        say: l === 1 ? `Read the story. ${said} Which word from the word box goes in the blank?` : 'Read the story. Which word from the word box goes in the blank?',
        readFirst: l > 1,
        visual: `<div style="font-size:56px">${st.pic}</div>
          <div style="border:3px dashed #5b3fd1;border-radius:14px;padding:6px 14px;font-size:26px;margin:4px 0">📦 ${st.bank.map(esc).join(' · ')}</div>
          <div class="sentence" style="font-size:clamp(22px,3.6vw,34px);text-align:left">${lines.join('<br>')}</div>`,
        options: shuffle(words(opts)), cols: opts.length === 2 ? 'two' : undefined, answer: a,
        explain: `${asked} Read it again. Does it make sense? Yes!`,
      };
    },
  },
  {
    id: 'r-tells', name: 'Sentence for the picture', emoji: '🔍',
    gen(l) {
      const [p, right, wrong] = pick(TELLS);
      const opts = l === 1 ? [right, wrong[0]] : [right, ...wrong];
      return {
        say: 'Look at the picture. Read the sentences. Which sentence tells about the picture?', readFirst: true,
        visual: big(p), options: shuffle(opts.map(s => ({ html: `<span class="lbl">${esc(s)}</span>`, value: s }))), cols: 'two', answer: right,
        explain: `The picture shows: ${right}`,
      };
    },
  },
  {
    id: 'r-riddle', name: 'Riddles', emoji: '❓',
    gen(l) {
      const [r, a, pic, others] = pick(RIDDLES);
      const opts = [[a, pic], ...others];
      return {
        say: l === 1 ? `Here is a riddle. ${r.replace('___', 'what')}?` : 'Read the riddle. What am I?',
        text: l === 1 ? 'Finish the riddle!' : undefined, readFirst: l > 1,
        visual: `<div class="sentence" style="text-align:left">${esc(r).replace('___', blank)}</div>`,
        options: shuffle(opts.map(([w, e]) => ({ html: `<span class="pic">${e}</span>${l === 3 ? '' : `<span class="lbl">${w}</span>`}`, value: w, say: w }))), answer: a,
        explain: r.replace('___', a),
      };
    },
  },
  {
    id: 'p-rhyme', name: 'Rhyming words', emoji: '🎵',
    gen(l) {
      const [fam, odd] = pick(RHYME_BOX);
      if (l === 1) {
        const [w, a] = sample(fam, 2);
        const opts = [a, odd];
        return {
          say: `Which word rhymes with ${w}?`, text: `Which word rhymes with "${w}"?`,
          visual: RHYME_PIC[w] ? big(RHYME_PIC[w]) : `<div class="word-big">${w}</div>`,
          options: shuffle(opts.map(x => ({ html: `${RHYME_PIC[x] ? `<span class="pic">${RHYME_PIC[x]}</span>` : ''}<span class="lbl">${x}</span>`, value: x, say: x }))), cols: 'two', answer: a,
          explain: `${w} and ${a} rhyme. They end with the same sound: ${a.slice(-2)}.`,
        };
      }
      const shown = shuffle([...sample(fam, Math.min(fam.length, l === 2 ? 2 : 3)), odd]);
      return {
        say: l === 2 ? `Listen: ${shown.join(', ')}. Which word does NOT rhyme?` : 'Read the words in the box. Which word does NOT rhyme?',
        readFirst: l === 3,
        options: shown.map(x => ({ html: `<span class="lbl" style="font-size:34px">${x}</span>`, value: x, say: x })), cols: 'two', answer: odd,
        explain: `${fam.join(', ')} rhyme. ${odd} does not rhyme.`,
      };
    },
  },
  {
    id: 'g-capital', name: 'Capital letter & period', emoji: '🔠',
    gen(l) {
      const s = pick(CAPS);
      if (l === 1 || Math.random() < 0.4) {
        // Which one is written correctly?
        const wrong = [firstLow(s), s.slice(0, -1), lowerAll(s)];
        const opts = l === 1 ? [s, pick(wrong)] : [s, ...sample(wrong.filter(w => w !== s), 2)];
        return {
          say: 'Which sentence is written correctly? Remember the capital letter and the period.', readFirst: true,
          options: shuffle([...new Set(opts)].map(x => ({ html: `<span class="lbl">${esc(x)}</span>`, value: x }))), cols: 'two', answer: s,
          explain: `A sentence starts with a capital letter and ends with a period. ${s}`,
        };
      }
      // Which word needs a capital letter? (first word, or a name in the middle)
      const ws = s.replace(/\.$/, '').split(' ');
      const named = ws.map((w, i) => ({ w, i })).filter(x => x.i > 0 && NAMES.includes(x.w));
      const target = named.length && Math.random() < 0.6 ? pick(named) : { w: ws[0], i: 0 };
      // Only the target word loses its capital, so there is just one right answer
      const lw = ws.map((w, i) => (i === target.i ? w.charAt(0).toLowerCase() + w.slice(1) : w));
      return {
        say: 'One word needs a capital letter. Tap the word that needs a capital letter.', readFirst: true,
        visual: `<div class="sentence">${esc(lw.join(' '))}.</div>`,
        options: lw.map((w, i) => ({ html: `<span class="lbl" style="font-size:30px">${esc(w)}</span>`, value: String(i) })), answer: String(target.i),
        explain: target.i === 0
          ? `The first word of a sentence needs a capital letter: ${target.w}. ${s}`
          : `${target.w} is a name, so it needs a capital letter. ${s}`,
      };
    },
  },
];
