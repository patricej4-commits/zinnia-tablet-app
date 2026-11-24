// Spelling Bee: her Abeka Spelling & Poetry Book lists 1-12 (Spelling exam: lists 1-11),
// with the same kinds of exercises as her workbook pages.
import { pick, shuffle, sample, esc, rnd } from '../util.js';
import { picOf } from './pictures.js';
import { chunk } from './phonics.js';

// rule (as printed in the book), words, sight words (blue "Advanced / Sight Words"), the sounds the list teaches
export const LISTS = {
  1: { rule: 'When there is one vowel in a word, it usually says its short sound.', words: ['man', 'ran', 'sun', 'bus', 'hot', 'net', 'sit', 'cub'], sight: ['a', 'the'], sounds: ['a', 'e', 'i', 'o', 'u'] },
  2: { rule: 'When there are two vowels in a word, the first vowel says its long sound, and the second vowel is silent.', words: ['coat', 'goat', 'boat', 'bean', 'read', 'made', 'game', 'ride'], sight: ['to', 'the'], sounds: ['oa', 'ea', 'a', 'i'] },
  3: { rule: 'K comes before i and e; C before the other three: a, o, u.', words: ['cone', 'kite', 'cute', 'came', 'kick', 'keep', 'cake', 'cat'], sight: ['come', 'I'], sounds: ['c', 'k'], at: 'start' },
  4: { rule: 'When you hear a k sound at the end of a word and the vowel is short, write ck. If the vowel is long, write k and a silent e.', words: ['back', 'bake', 'lick', 'like', 'snack', 'snake', 'brick', 'clock', 'shake', 'broke'], sight: ['come', 'to'], sounds: ['ck', 'ke'], at: 'end' },
  5: { rule: 'ay in pray.', words: ['day', 'play', 'pray', 'gray', 'stay', 'spray', 'clay', 'way', 'stray', 'hay'], sight: ['to', 'you'], sounds: ['ay', 'ai', 'a'] },
  6: { rule: 'L, f, and s often walk together at the end of a short-vowel word.', words: ['cuff', 'puff', 'stuff', 'sniff', 'cross', 'bless', 'will', 'well', 'bell', 'doll'], sight: ['you', 'of'], sounds: ['ll', 'ff', 'ss'], at: 'end' },
  7: { rule: 'When e, o, or y is the only vowel at the end of a word, it usually says its long sound.', words: ['be', 'he', 'me', 'by', 'my', 'cry', 'try', 'go', 'no', 'so'], sight: ['one', 'two'], sounds: ['e', 'o', 'y'], at: 'last' },
  8: { rule: 'sh in ship, th in this, th in thick.', words: ['shy', 'she', 'shade', 'sheep', 'brush', 'fresh', 'this', 'that', 'then', 'with'], sight: ['of', 'do'], sounds: ['sh', 'th'] },
  9: { rule: 'ou in out, ow in owl, ow in bowl.', words: ['round', 'shout', 'cloud', 'south', 'cow', 'now', 'down', 'brown', 'clown', 'crown', 'town', 'slow', 'snow'], sight: ['what', 'was'], sounds: ['ou', 'ow'] },
  10: { rule: 'er in verse, ur in nurse, ir in bird.', words: ['her', 'serve', 'purse', 'burn', 'curl', 'turn', 'dirt', 'first', 'girl', 'sir', 'stir', 'shirt', 'third'], sight: ['said', 'have'], sounds: ['er', 'ur', 'ir'] },
  11: { rule: 'oi in coin, oy in boy, and review words.', words: ['oil', 'boil', 'spoil', 'join', 'moist', 'noise', 'point', 'boy', 'joy', 'toy', 'proud', 'blow', 'skirt'], sight: ['said', 'what'], sounds: ['oi', 'oy'] },
  12: { rule: 'oo in book, oo in tooth.', words: ['book', 'look', 'good', 'foot', 'wood', 'shook', 'boot', 'food', 'loose', 'moon', 'room', 'roof', 'tooth'], sight: ['have', 'give'], sounds: ['oo'] },
};
// NEW words that follow the same rule as each list, so she learns the rule, not just the list.
// (If the teacher uses a different word in a test, she can still spell it.)
const MORE = {
  1: ['cat', 'bed', 'pig', 'hop', 'cup', 'fan', 'jet', 'lid', 'dog', 'rug', 'map', 'hen', 'pin', 'pot', 'tub', 'bag', 'web', 'fix', 'log', 'mud', 'jam', 'leg', 'dip', 'fox', 'gum', 'pen', 'rib', 'mop', 'nut', 'six'],
  2: ['road', 'soap', 'toad', 'loaf', 'seat', 'meat', 'team', 'leaf', 'beak', 'gate', 'lake', 'name', 'tape', 'bike', 'kite', 'time', 'line', 'five', 'hide', 'cake'],
  3: ['cot', 'cub', 'cap', 'cave', 'coat', 'cut', 'cod', 'camp', 'cup', 'cold', 'kid', 'kit', 'key', 'kin', 'king', 'kiss', 'kept', 'kelp', 'keg', 'kind'],
  4: ['duck', 'sock', 'pack', 'neck', 'rock', 'truck', 'stick', 'trick', 'black', 'lake', 'make', 'rake', 'poke', 'woke', 'joke', 'hike', 'bike', 'smoke', 'cake', 'luck'],
  5: ['say', 'may', 'pay', 'tray', 'ray', 'bay', 'rain', 'pain', 'tail', 'mail', 'paint', 'wait', 'train', 'snail', 'nail', 'sail'],
  6: ['hill', 'fill', 'tell', 'sell', 'yell', 'fell', 'call', 'tall', 'hiss', 'kiss', 'miss', 'mess', 'boss', 'toss', 'off', 'cliff', 'huff', 'fluff', 'spill', 'grass'],
  7: ['we', 'she', 'fly', 'dry', 'sky', 'fry', 'spy', 'why', 'shy'],
  8: ['shop', 'shell', 'shut', 'dish', 'fish', 'wish', 'cash', 'ship', 'shed', 'thin', 'thick', 'bath', 'math', 'moth', 'them', 'than', 'path', 'thud'],
  9: ['out', 'loud', 'house', 'mouse', 'mouth', 'found', 'sound', 'count', 'owl', 'how', 'gown', 'frown', 'grow', 'show', 'blow', 'bowl', 'glow', 'crowd'],
  10: ['fern', 'herd', 'perch', 'hurt', 'fur', 'surf', 'church', 'burst', 'bird', 'skirt', 'firm', 'swirl', 'twirl', 'chirp'],
  11: ['coin', 'soil', 'foil', 'coil', 'voice', 'joint', 'broil', 'enjoy', 'annoy', 'cowboy'],
  12: ['cook', 'hook', 'took', 'hood', 'stood', 'wool', 'spoon', 'pool', 'cool', 'tool', 'zoo', 'soon', 'broom', 'goose', 'shoot'],
};
const EXAM_LISTS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]; // Christmas exam: lists 1-11
// Level 1: lists 1-4, level 2: lists 1-8, level 3: all exam lists (+ list 12)
const listsFor = l => (l === 1 ? [1, 2, 3, 4] : l === 2 ? [1, 2, 3, 4, 5, 6, 7, 8] : [...EXAM_LISTS, 12]);
// About 4 in 10 questions use a NEW word that follows the list's rule (more as she gets better)
const pickWord = (l, newShare = [0.3, 0.4, 0.45][l - 1]) => {
  const n = pick(listsFor(l));
  const fresh = (MORE[n] || []).filter(w => !LISTS[n].words.includes(w));
  const isNew = fresh.length > 0 && Math.random() < newShare;
  return { n, list: LISTS[n], w: pick(isNew ? fresh : LISTS[n].words), isNew };
};
const newNote = (isNew, n) => (isNew ? ` This is a new word, not on your list. Use the rule from list ${n}!` : '');

// Where is the list's special sound in this word?
function soundIn(w, list) {
  if (list.at === 'start') return { i: 0, s: w[0] };
  if (list.at === 'end') { const s = list.sounds.find(x => w.endsWith(x)); return s ? { i: w.length - s.length, s } : null; }
  if (list.at === 'last') return { i: w.length - 1, s: w[w.length - 1] };
  const sorted = [...list.sounds].sort((a, b) => b.length - a.length);
  for (let i = 0; i < w.length; i++) for (const s of sorted) if (w.startsWith(s, i)) return { i, s };
  return null;
}

// Sentences from her workbook, plus more in the same style: [sentence, answer, list]
const SENTENCES = [
  ['I like ___ ride in a boat.', 'to'], ['I can read ___ Bible.', 'the'], ['This is the ___ which the Lord hath made.', 'day'],
  ['Tom and Sara went out to ___.', 'play'], ['Dad will ___ the grass.', 'spray'], ['Horses like to eat ___.', 'hay'],
  ['I need help, I ___ to God.', 'pray'], ['Jesus came as a baby ___.', 'boy'], ['If we know Him, we can have ___.', 'joy'],
  ['Will you ___ us to worship Him?', 'join'], ['The ___ is hot today.', 'sun'], ['We ride the ___ to school.', 'bus'],
  ['The ___ eats grass.', 'goat'], ['I fly my ___ in the sky.', 'kite'], ['Mummy made a ___ for my party.', 'cake'],
  ['The ___ says tick tock.', 'clock'], ['A ___ can hiss.', 'snake'], ['The ___ goes ding dong.', 'bell'],
  ['I play with my ___.', 'doll'], ['A ___ is a baby bear.', 'cub'], ['The ___ says baa.', 'sheep'], ['I ___ my teeth.', 'brush'],
  ['The ___ says moo.', 'cow'], ['The ___ makes us laugh.', 'clown'], ['The king has a ___.', 'crown'], ['A turtle is very ___.', 'slow'],
  ['A ___ is a young lady.', 'girl'], ['I came ___ in the race!', 'first'], ['Do not ___ yourself on the stove.', 'burn'],
  ['We cook with ___.', 'oil'], ['I play with my ___ truck.', 'toy'], ['Please do not make a ___.', 'noise'],
  ['I read a good ___.', 'book'], ['I can see the ___ at night.', 'moon'], ['I eat good ___.', 'food'], ['My ___ is in my shoe.', 'foot'],
  ['Please ___ with me.', 'stay'],
  ['I can ___ the ball.', 'kick'], ['I ___ to eat mangoes.', 'like'], ['Please come ___ to me.', 'back'],
  ['The fish is in the ___.', 'net'], ['Please ___ down on the chair.', 'sit'], ['I put on my ___ when it is cold.', 'coat'],
  ['The ___ sails on the sea.', 'boat'], ['I like to ___ my book.', 'read'], ['We ___ a game at school.', 'made'], ['I ___ my bike to the park.', 'ride'],
  ['Let us have a ___ after school.', 'snack'], ['The wind will ___ and blow.', 'puff'], ['Please ___ the bell.', 'ring'],
  ['God will ___ you.', 'bless'], ['I ___ when I am sad.', 'cry'], ['Can you ___ again?', 'try'], ['I will ___ to the shop.', 'go'],
  ['I like ___ fish.', 'fresh'], ['Let us go ___ to play.', 'out'], 
  ['The ball is ___.', 'round'], ['She has a ___ in her hair.', 'curl'], ['It is my ___ to play.', 'turn'], ['Do not get ___ on your dress.', 'dirt'],
  ['Please ___ the soup.', 'stir'], ['The water will ___.', 'boil'], ['I ___ my finger at the bird.', 'point'], ['My tooth is ___!', 'loose'],
  ['___ at the stars!', 'look'], ['I wear a ___ on my foot.', 'boot'], ['It is time to ___ the table.', 'serve'],
];
// Clue words: "Write the spelling word next to its clue"
const CLUES = [
  ['It is on top of your house.', 'roof'], ['You eat it.', 'food'], ['You can see it at night.', 'moon'], ['You read it.', 'book'],
  ['It may fall out of your mouth.', 'tooth'], ['It floats on water.', 'boat'], ['It says baa.', 'sheep'], ['It is hot and in the sky.', 'sun'],
  ['You wear it when it is cold.', 'coat'], ['It rings: ding dong!', 'bell'], ['It tells the time.', 'clock'], ['It flies on a string.', 'kite'],
  ['A king wears it on his head.', 'crown'], ['It says moo.', 'cow'], ['It is white and falls from the sky when it is very cold.', 'snow'],
  ['You wear it on your top half.', 'shirt'], ['A boy plays with it.', 'toy'], ['It is the number after one.', 'two'],
  ['It is a baby bear.', 'cub'], ['A big car that takes children to school.', 'bus'], ['It says maa and eats grass.', 'goat'], ['You fly it in the wind.', 'kite'],
  ['You eat it at a party.', 'cake'], ['It is long and says hiss.', 'snake'], ['A little girl plays with it.', 'doll'], ['You brush your teeth with it.', 'brush'],
  ['It is a funny man at the circus.', 'clown'], ['The colour of chocolate.', 'brown'], ['A young lady.', 'girl'], ['After first and second comes ___.', 'third'],
  ['We cook with it.', 'oil'], ['It is money that is round.', 'coin'], ['A happy, glad feeling.', 'joy'], ['A young man.', 'boy'],
  ['You talk to God.', 'pray'], ['The opposite of night.', 'day'], ['Horses eat it.', 'hay'], ['The opposite of fast.', 'slow'],
  ['It is white and floats in the sky.', 'cloud'], ['Dirt that plants grow in.', 'soil'], ['To not go away.', 'stay'], ['The opposite of up.', 'down'],
  ['You wear it on your foot.', 'boot'], ['The opposite of bad.', 'good'], ['A place in your house, like a bedroom.', 'room'], ['To talk very loudly.', 'shout'],
];
// Rhyming families from the lists ("Color the words that rhyme with ...")
const RHYMES = [['tan', ['man', 'ran']], ['float', ['coat', 'goat', 'boat']], ['lake', ['bake', 'snake', 'shake', 'cake']], ['stick', ['lick', 'kick', 'brick']],
  ['day', ['play', 'pray', 'gray', 'stay', 'spray', 'clay', 'way', 'stray', 'hay']], ['muff', ['cuff', 'puff', 'stuff']], ['fell', ['well', 'bell']],
  ['how', ['cow', 'now']], ['gown', ['down', 'brown', 'clown', 'crown', 'town']], ['grow', ['slow', 'snow', 'blow', 'go', 'no', 'so']],
  ['soil', ['oil', 'boil', 'spoil']], ['soy', ['boy', 'joy', 'toy']], ['turn', ['burn']], ['hook', ['book', 'look', 'shook']],
  ['spoon', ['moon']], ['hood', ['good', 'wood']], ['fry', ['by', 'my', 'cry', 'try', 'shy']], ['sea', ['be', 'he', 'me', 'she']]];
const ALL_WORDS = [...new Set(Object.values(LISTS).flatMap(L => L.words))];
const SIGHT = [...new Set(Object.values(LISTS).flatMap(L => L.sight))];
const pic = w => (picOf(w) ? `<div style="font-size:96px">${picOf(w)}</div>` : '');

export const spellingSkills = [
  {
    id: 's-spell', name: 'Spell my list words', emoji: '🐝', type: 'build',
    gen(l) {
      const { n, list, w, isNew } = pickWord(l);
      const parts = chunk(w);
      const pool = ['sh', 'th', 'ck', 'ke', 'ay', 'ou', 'ow', 'er', 'ir', 'ur', 'oi', 'oy', 'oo', 'a', 'e', 'i', 'o', 'u', 's', 't', 'n', 'l'];
      const extra = sample(pool.filter(c => !parts.includes(c) && c !== w), l === 1 ? 1 : 2);
      const test = l === 3; // spelling-test style: no picture
      return {
        type: 'build', word: w, parts, extra, rule: list.rule,
        say: isNew ? `A new word! Use your list ${n} rule. Spell ${w}. ${w}.` : `Spelling list ${n}. Spell ${w}. ${w}.`,
        text: isNew ? `🆕 New word! Use the list ${n} rule: spell the word you hear 👂` : `Spelling list ${n}: spell the word you hear 👂`,
        visual: test || !picOf(w) ? '<div style="font-size:80px">👂</div>' : pic(w),
        explain: `${w} is spelled ${w.split('').join(' ')}. ${list.rule}${newNote(isNew, n)}`,
      };
    },
  },
  {
    id: 's-sound', name: 'Missing special sound', emoji: '🧩',
    gen(l) {
      let n, list, w, found, isNew;
      for (let t = 0; t < 30; t++) { ({ n, list, w, isNew } = pickWord(l)); found = soundIn(w, list); if (found) break; }
      const shown = w.slice(0, found.i) + '_'.repeat(found.s.length).split('').join(' ') + w.slice(found.i + found.s.length);
      const opts = [...new Set([found.s, ...list.sounds.filter(s => s !== found.s), ...sample(['sh', 'th', 'ou', 'ow', 'er', 'ir', 'ur', 'oi', 'oy', 'ay', 'ck', 'oo'], 3)])]
        .filter(s => s === found.s || s.length === found.s.length || list.sounds.includes(s)).slice(0, 3);
      return {
        say: `${isNew ? 'A new word! ' : ''}Fill in the missing letters. ${w}.`, text: `${isNew ? '🆕 New word! ' : ''}Fill in the missing letters 👂`,
        visual: `<div style="display:flex;align-items:center;gap:12px;justify-content:center">${pic(w)}<div class="word-big">${esc(shown)}</div></div>`,
        options: shuffle(opts).map(s => ({ html: s, value: s, say: s.split('').join(' ') })), answer: found.s, rule: list.rule,
        explain: `${w} is spelled ${w.split('').join(' ')}. List ${n}: ${list.rule}${newNote(isNew, n)}`,
      };
    },
  },
  {
    id: 's-unscramble', name: 'Unscramble the word', emoji: '🔀', type: 'build',
    gen(l) {
      const { n, w } = pickWord(l);
      let mixed = w;
      for (let t = 0; t < 10 && mixed === w; t++) mixed = shuffle(w.split('')).join('');
      return {
        type: 'build', word: w, extra: [],
        say: `Unscramble the letters to make a spelling word. It is ${w}.`, text: `Unscramble the letters to make a spelling word: ${mixed}`,
        visual: `<div class="word-big" style="background:#ffd6d9">${esc(mixed)}</div>`,
        explain: `The letters ${mixed.split('').join(' ')} make ${w}.`,
      };
    },
  },
  {
    id: 's-sentence', name: 'Finish the sentence', emoji: '✏️',
    gen(l) {
      const [s, a] = pick(SENTENCES);
      const wrong = sample(ALL_WORDS.concat(SIGHT).filter(x => x !== a), 2);
      return {
        say: l === 1 ? `Finish the sentence. ${s.replace('___', 'blank')}` : 'Read the sentence. Which spelling word finishes it?', readFirst: l > 1,
        visual: `<div class="sentence">${esc(s).replace('___', '<span style="color:#5b3fd1;border-bottom:5px solid #5b3fd1;padding:0 18px">?</span>')}</div>`,
        options: shuffle([a, ...wrong]).map(x => ({ html: esc(x), value: x })), answer: a,
        explain: s.replace('___', a),
      };
    },
  },
  {
    id: 's-clue', name: 'Word clues', emoji: '🔎',
    gen(l) {
      const [clue, a] = pick(CLUES);
      if (l === 3) return {
        type: 'build', word: a, extra: sample('abdeilmnorstu'.split('').filter(c => !a.includes(c)), 2),
        say: `${clue} Spell the word.`, text: `${clue} Spell the word.`, readFirst: true, visual: '',
        explain: `${clue} The word is ${a}: ${a.split('').join(' ')}.`,
      };
      const wrong = sample([...new Set(CLUES.map(c => c[1]))].filter(x => x !== a), 2);
      return {
        say: `${clue} Which spelling word is it?`, readFirst: l > 1,
        visual: `<div class="sentence">${esc(clue)}</div>`,
        options: shuffle([a, ...wrong]).map(x => ({ html: `${picOf(x) && l === 1 ? `<span class="pic">${picOf(x)}</span>` : ''}<span class="lbl">${x}</span>`, value: x })), answer: a,
        explain: `${clue} The word is ${a}.`,
      };
    },
  },
  {
    id: 's-rhyme', name: 'Rhyming list words', emoji: '🎵',
    gen() {
      const [word, fam] = pick(RHYMES);
      const a = pick(fam);
      const wrong = sample(ALL_WORDS.filter(x => !fam.includes(x) && x.slice(-2) !== a.slice(-2)), 2);
      return {
        say: `Which word rhymes with ${word}?`, text: `Which word rhymes with "${word}"?`,
        options: shuffle([a, ...wrong]).map(x => ({ html: x, value: x, say: x })), answer: a,
        explain: `${word} and ${a} rhyme. They end with the same sound.`,
      };
    },
  },
  {
    id: 's-sight', name: 'List sight words', emoji: '👀',
    gen(l) {
      const a = pick(SIGHT);
      if (l === 3) {
        const sw = pick(SIGHT.filter(x => x.length > 1)); // spell the longer sight words
        return {
        type: 'build', word: sw, extra: sample('abdeilmnorstuw'.split('').filter(c => !sw.includes(c)), 1),
        say: `Spell the sight word ${sw}. ${sw}.`, text: 'Spell the sight word you hear 👂', visual: '<div style="font-size:80px">👂</div>',
        explain: `${sw} is a sight word. We learn it by heart: ${sw.split('').join(' ')}.`,
        };
      }
      const SIGHT_SENT = { a: 'I have ___ cat.', the: 'Look at ___ sun.', to: 'I like ___ play.', come: 'Please ___ here.', I: '___ can read.', you: 'I love ___.', of: 'A cup ___ tea.', one: 'I have ___ nose.', two: 'I have ___ eyes.', do: 'What ___ you see?', what: '___ is your name?', was: 'It ___ hot.', said: 'Mom ___ yes.', have: 'I ___ a dog.', give: 'Please ___ me a hug.' };
      if (l === 2 && SIGHT_SENT[a] && Math.random() < 0.5) {
        const s = SIGHT_SENT[a];
        return {
          say: 'Read the sentence. Which sight word goes in the blank?', readFirst: true,
          visual: `<div class="sentence">${esc(s).replace('___', '<span style="color:#5b3fd1;border-bottom:5px solid #5b3fd1;padding:0 18px">?</span>')}</div>`,
          options: shuffle([a, ...sample(SIGHT.filter(x => x !== a && x.toLowerCase() !== a.toLowerCase()), 2)]).map(x => ({ html: x, value: x })), answer: a,
          explain: s.replace('___', a),
        };
      }
      return {
        say: `Find the sight word: ${a}.`, text: 'Find the sight word you hear 👂',
        options: shuffle([a, ...sample(SIGHT.filter(x => x !== a), 3)]).map(x => ({ html: x, value: x })), answer: a,
        explain: `This is the sight word ${a}. Sight words are the blue words on your spelling list.`,
      };
    },
  },
];
