// Word Castle: grammar from the class — nouns (common/proper), singular & plural,
// articles a/an/the, pronouns, am/is/are, was/were, verbs, adjectives, compound words,
// and sentence writing (capital letters, spaces, periods).
import { pick, shuffle, sample, esc, textOptions } from '../util.js';
import { picOf } from './pictures.js';

// "a" or "an" for a word (by its first sound).
function aan(word) {
  const w = String(word).toLowerCase();
  if (/^(hour|honest|honour)/.test(w)) return 'an';
  if (/^(uni|use|usu|eu|one|once)/.test(w)) return 'a';
  return /^[aeiou]/.test(w) ? 'an' : 'a';
}
// The empty box shown on screen where a word is missing. The owl says "hmm" for it
// (not "box" or "blank", which could be heard as part of the sentence: "The box is hot").
const BOX = '<span style="display:inline-block;min-width:1.8em;height:1.1em;vertical-align:-0.15em;border:4px solid #5b3fd1;border-radius:8px;margin:0 4px"></span>';
const boxed = s => esc(s).replace('___', BOX);
const spoken = s => s.replace('___', '... hmm ...');
// 'The word "kick"' — used at the start of explanations.
const theWord = w => `The word "${w}"`;

// Fill-in-the-box sentence question. Reading is required from level 2 up.
// item = [sentence, answer, choices, reason?]; explain = text or (item) => text, used when the item has no reason.
function fill(l, item, explain) {
  const [sentence, answer, choices, reason] = item;
  const why = reason || (typeof explain === 'function' ? explain(item) : explain);
  return {
    say: l === 1 ? `Tap the word that goes in the box. ${spoken(sentence)}` : 'Read the sentence. Tap the word that goes in the box.',
    text: l === 1 ? 'Tap the word that goes in the box.' : undefined,
    readFirst: l > 1,
    visual: `<div class="sentence">${boxed(sentence)}</div>`,
    options: shuffle(choices).map(c => ({ html: esc(c), value: c })), answer,
    explain: `${why} ${sentence.replace('___', answer)}`,
  };
}

const AM_IS_ARE = [
  ['I ___ happy!', 'am'], ['You ___ tall.', 'are'], ['He ___ small.', 'is'], ['She ___ a nurse.', 'is'], ['It ___ raining.', 'is'],
  ['We ___ at school.', 'are'], ['They ___ my friends.', 'are'], ['The dog ___ black.', 'is'], ['I ___ drawing shapes.', 'am'],
  ['The girls ___ hungry.', 'are'], ['Zinnia ___ reading a book.', 'is'], ['The mangoes ___ sweet.', 'are'], ['I ___ six years old.', 'am'],
  ['The sun ___ hot.', 'is'], ['Mummy and Daddy ___ at home.', 'are'], ['It ___ cold.', 'is'], ['I ___ sleepy.', 'am'], ['The birds ___ singing.', 'are'],
].map(([s, a]) => [s, a, ['am', 'is', 'are']]);

// Every noun here is clearly one (was) or clearly more than one (were).
const WAS_WERE = [
  ['I ___ reading.', 'was'], ['She ___ sleeping.', 'was'], ['The boys ___ swimming.', 'were'], ['They ___ jumping on the bed.', 'were'],
  ['The baby ___ crying.', 'was'], ['A man ___ walking his dog.', 'was'], ['We ___ having fun.', 'were'], ['The monkey ___ eating a banana.', 'was'],
  ['All the apples ___ sweet.', 'were'], ['You ___ in the truck.', 'were'], ['The cat ___ sleeping.', 'was'], ['The girls ___ late for school.', 'were'],
  ['Zinnia ___ at the beach.', 'was'], ['The crabs ___ in the sea.', 'were'],
].map(([s, a]) => [s, a, ['was', 'were']]);

// [sentence, answer, choices, reason, lowest level]
const MY_MINE = 'Use my before a thing: my cat. Use mine at the end: The cat is mine.';
const YOUR_YOURS = 'Use your before a thing: your hat. Use yours at the end: The books are yours.';
const PRONOUNS = [
  ['___ am a girl.', 'I', ['I', 'Me', 'My'], 'Use I when you talk about yourself at the start of a sentence.', 1],
  ['___ should brush your teeth.', 'You', ['You', 'Your', 'Yours'], 'Use you when you talk to someone.', 1],
  ['Kai is a boy. ___ likes to run.', 'He', ['He', 'She', 'They'], 'Kai is a boy, so we say he.', 1],
  ['Maya is a girl. ___ likes to sing.', 'She', ['She', 'He', 'We'], 'Maya is a girl, so we say she.', 1],
  ['The cats are hiding. ___ are under the bed.', 'They', ['They', 'He', 'It'], 'There is more than one cat, so we say they.', 1],
  ['Tom and I play ball. ___ have fun.', 'We', ['We', 'They', 'She'], 'Tom and I means me and someone else, so we say we.', 1],
  ['I found the key. ___ was on the table.', 'It', ['It', 'He', 'They'], 'A key is a thing, so we say it.', 1],
  ['It is the lady\'s bag. It is ___ bag.', 'her', ['her', 'his', 'our'], 'The bag belongs to a lady, so we say her bag.', 2],
  ['This is Grandpa\'s hat. It is ___ hat.', 'his', ['his', 'her', 'my'], 'The hat belongs to Grandpa, so we say his hat.', 2],
  ['The children have sweets. Those are ___ sweets.', 'their', ['their', 'his', 'your'], 'The sweets belong to the children, so we say their sweets.', 2],
  ['Come and play with ___.', 'me', ['me', 'I', 'mine'], 'Use me after words like with and to: with me, to me.', 3],
  ['This is ___ cat.', 'my', ['my', 'mine', 'I'], MY_MINE, 3],
  ['This orange cat is ___.', 'mine', ['mine', 'my', 'me'], MY_MINE, 3],
  ['This is ___ hat.', 'your', ['your', 'you', 'yours'], YOUR_YOURS, 3],
  ['These books are ___.', 'yours', ['yours', 'your', 'you'], YOUR_YOURS, 3],
  ['The teacher gave Leo a pencil. She gave ___ a pencil.', 'him', ['him', 'he', 'his'], 'Leo is a boy. After gave, we say him, not he.', 3],
];

// "the" only where it is the one right answer; a/an sentences offer only a and an.
const THE_SENT = [
  ['___ sun is very hot today.', 'The', ['A', 'An', 'The'], 'We say the sun because there is only one sun.'],
  ['___ moon is bright tonight.', 'The', ['A', 'An', 'The'], 'We say the moon because there is only one moon.'],
  ['___ sky is blue.', 'The', ['A', 'An', 'The'], 'We say the sky because there is only one sky.'],
];
const A_AN_SENT = [
  'There is ___ orange on the table.', 'I want ___ banana.', 'Dad takes ___ umbrella because it is raining.', 'I can see ___ elephant at the zoo.',
  'There is ___ octopus in the water.', 'I can see ___ turtle at the beach.', 'Zinnia has ___ red bag.', 'I ate ___ egg for breakfast.',
  'Kai has ___ new kite.', 'Mummy gave me ___ apple.',
];
const aAnReason = w => aan(w) === 'an'
  ? `${theWord(w)} starts with a vowel sound, so we say an.`
  : `${theWord(w)} starts with ${w[0]}, not a vowel sound, so we say a.`;
const A_WORDS = ['cat', 'dog', 'ball', 'banana', 'flower', 'sheep', 'chick', 'bike', 'ship', 'turtle', 'kite', 'book', 'tree', 'house', 'fish', 'car', 'mango', 'horse'];
const AN_WORDS = ['apple', 'egg', 'umbrella', 'orange', 'octopus', 'elephant', 'ant', 'owl', 'ear', 'eye'];

// Words that add es. The o-words are special ones that we learn by heart.
const ES_WORDS = ['box', 'fox', 'dish', 'bus', 'dress', 'glass', 'beach', 'peach', 'match', 'brush', 'kiss', 'potato', 'tomato', 'sandwich', 'watch', 'wish', 'bench', 'lunch', 'class'];
// Words that just add s. None of them makes a real word when "es" is added.
const S_WORDS = ['cat', 'chair', 'girl', 'tree', 'table', 'cup', 'doll', 'apple', 'pencil', 'frog', 'egg', 'book', 'bird', 'flower', 'shirt', 'boy', 'goat', 'kite'];

const PERSON = ['girl', 'boy', 'baby', 'teacher', 'nurse', 'mother', 'father', 'farmer', 'doctor', 'firefighter'];
const PLACE = ['school', 'beach', 'park', 'market', 'church', 'shop', 'farm', 'hospital', 'zoo', 'city'];
const ANIMAL = ['dog', 'cat', 'bird', 'goat', 'whale', 'turtle', 'frog', 'cow', 'parrot', 'snake'];
const THING = ['pencil', 'ball', 'chair', 'book', 'cup', 'kite', 'car', 'bag', 'spoon', 'clock'];

const PROPER = ['Jamaica', 'Kingston', 'Portmore', 'Zinnia', 'Monday', 'Christmas', 'Peter', 'Ocho Rios', 'Spot', 'Sunday', 'Grandma Rose', 'Montego Bay', 'Mr. Brown', 'Africa', 'December'];
const COMMON = ['dog', 'school', 'girl', 'truck', 'city', 'beach', 'mango', 'teacher', 'mother', 'car', 'island', 'boy', 'day', 'park', 'country'];

// Single words shown alone: each is clearly only one kind of word.
const VERBS = ['eat', 'sit', 'give', 'go', 'see', 'cry', 'sing', 'swim', 'write', 'jump', 'sweep', 'pray', 'climb', 'take'];
const NOUNS = ['pencil', 'bag', 'pillow', 'spoon', 'school', 'chair', 'cat', 'tree', 'teacher', 'mango', 'goat', 'banana', 'house', 'girl'];
// Action pictures for level 1 (people doing the action).
const VERB_PIC = {
  swim: '🏊', run: '🏃', jump: '🤸', sleep: '😴', clap: '👏', dance: '💃', write: '✍️', sweep: '🧹',
  cry: '😢', ride: '🚴', wave: '👋', pray: '🙏', climb: '🧗', walk: '🚶', surf: '🏄', row: '🚣',
};
// Exactly one action word in each sentence. Level 2: short. Level 3: longer.
const VERB_SENT_SHORT = [
  ['The dog runs.', 'runs'], ['Birds sing.', 'sing'], ['Zinnia swims.', 'swims'], ['He jumps high.', 'jumps'], ['We eat lunch.', 'eat'],
  ['Kai claps.', 'claps'], ['The baby cries.', 'cries'], ['Mummy cooks rice.', 'cooks'], ['I read books.', 'read'], ['The frog hops.', 'hops'],
];
const VERB_SENT_LONG = [
  ['The dog runs in the park.', 'runs'], ['Mummy cooks dinner for us.', 'cooks'], ['The birds sing in the morning.', 'sing'], ['I read a book at bedtime.', 'read'],
  ['The baby cries in the night.', 'cries'], ['We eat lunch at school.', 'eat'], ['He jumps over the puddle.', 'jumps'], ['Zinnia swims in the sea.', 'swims'],
  ['The children laugh at the clown.', 'laugh'], ['Kate drinks a cup of water.', 'drinks'],
];
const ADJ_PIC = [
  ['🐢', 'turtle', 'slow', ['fast', 'broken']], ['🧊', 'ice', 'cold', ['hot', 'soft']], ['☀️', 'sun', 'hot', ['cold', 'wet']], ['🐭', 'mouse', 'small', ['big', 'tall']],
  ['🐘', 'elephant', 'big', ['tiny', 'short']], ['🦒', 'giraffe', 'tall', ['short', 'small']], ['🤡', 'clown', 'funny', ['angry', 'sad']], ['🍎', 'apple', 'red', ['blue', 'purple']],
  ['🐱', 'kitten', 'cute', ['scary', 'tall']], ['🐜', 'ant', 'tiny', ['huge', 'tall']], ['🏎️', 'race car', 'fast', ['slow', 'sleepy']], ['🌈', 'rainbow', 'colourful', ['dull', 'sad']],
];
// [sentence, the one describing word, what it describes]
const ADJ_SENT = [
  ['Zinnia has curly hair.', 'curly', 'hair'], ['Paula ate juicy mangoes.', 'juicy', 'mangoes'], ['Terry has a blue shirt.', 'blue', 'shirt'],
  ['Dan sat on the broken chair.', 'broken', 'chair'], ['The backpack is heavy.', 'heavy', 'backpack'], ['The elephant is a huge animal.', 'huge', 'elephant'],
  ['The boy is clever.', 'clever', 'boy'], ['Riya has a beautiful dress.', 'beautiful', 'dress'], ['The giraffe has a long neck.', 'long', 'neck'],
  ['The ice is cold.', 'cold', 'ice'],
];
const COMPOUNDS = [['sun', 'flower'], ['foot', 'ball'], ['snow', 'man'], ['rain', 'bow'], ['butter', 'fly'], ['cup', 'cake'], ['tooth', 'brush'], ['lady', 'bug'],
  ['gold', 'fish'], ['jelly', 'fish'], ['pan', 'cake'], ['star', 'fish'], ['sea', 'shell'], ['arm', 'chair'], ['bed', 'room'], ['pop', 'corn'], ['rain', 'coat'], ['sun', 'shine']];
const COMPOUND_PIC = { football: '⚽', sunshine: '☀️' };
// Mix-ups that are real words, so they are never used as wrong answers.
const REAL_MIXES = ['sunfish', 'seaman', 'snowball', 'footman', 'butterfish', 'butterball', 'buttercake', 'bedbug', 'panfish', 'toothfish', 'sunroom', 'sunbed',
  'seafish', 'goldbug', 'starman', 'starflower', 'starshine', 'rainman', 'ladyfish', 'sunbow', 'snowflower', 'goldman', 'cupfish'];
// [sentence, lowest level]. Level 3 has longer sentences.
const SENTENCES_OK = [
  ['The cat is big.', 1], ['I like mangoes.', 1], ['We go to school.', 1], ['My dog can run.', 1], ['The sun is hot.', 1], ['I can see a bird.', 1],
  ['Mummy has a red hat.', 2], ['Look at the boat!', 2], ['We go to church on Sunday.', 3], ['I can see a bird in the tree.', 3],
  ['Kai and I play at the beach.', 3], ['Wow, look at the big boat!', 3], ['My little sister can swim fast.', 3],
];
const END_NAME = { '.': 'period', '?': 'question mark', '!': 'exclamation mark' };

export const grammarSkills = [
  {
    id: 'g-noun', name: 'Naming words (nouns)', emoji: '🏷️',
    gen(l) {
      if (l > 1 && Math.random() < 0.5) {
        const askNoun = Math.random() < 0.5;
        const many = l === 3 ? 2 : 1; // level 3: three words to choose from
        const ans = pick(askNoun ? NOUNS : VERBS);
        const others = sample(askNoun ? VERBS : NOUNS, many);
        const n = askNoun ? ans : others[0], v = askNoun ? others[0] : ans;
        return {
          say: askNoun ? 'Read the words. Tap the noun, the naming word.' : 'Read the words. Tap the verb, the action word.',
          readFirst: true,
          options: shuffle([ans, ...others]).map(w => ({ html: `<span class="lbl" style="font-size:40px">${w}</span>`, value: w })), cols: many === 1 ? 'two' : '',
          answer: ans,
          explain: `${theWord(n)} is a noun. It is a naming word. ${theWord(v)} is a verb. It is an action word.`,
        };
      }
      const groups = { person: PERSON, place: PLACE, animal: ANIMAL, thing: THING };
      const kind = pick(Object.keys(groups));
      const w = pick(groups[kind]);
      return {
        say: `Look at the word ${w}. Is ${aan(w)} ${w} a person, a place, an animal, or a thing? Tap one.`,
        text: `Is ${aan(w)} ${w} a person, a place, an animal, or a thing? Tap one.`,
        visual: `<div style="display:flex;align-items:center;gap:12px">${picOf(w) ? `<span style="font-size:90px">${picOf(w)}</span>` : ''}<div class="word-big">${w}</div></div>`,
        options: [['person', '🧍'], ['place', '🏫'], ['animal', '🐾'], ['thing', '🧸']].map(([k, e]) => ({ html: `<span class="pic">${e}</span><span class="lbl">${k}</span>`, value: k, say: k })),
        answer: kind,
        explain: `${theWord(w)} names ${aan(kind)} ${kind}.`,
      };
    },
  },
  {
    id: 'g-proper', name: 'Common & proper nouns', emoji: '👑',
    gen(l) {
      if (l === 1 || Math.random() < 0.5) {
        const isP = Math.random() < 0.5;
        const w = pick(isP ? PROPER : COMMON);
        return {
          say: `Look at the word ${w}. Is it a special name, a proper noun? Or is it a common noun? Tap one.`,
          text: `Look at the word. Tap common noun or proper noun (special name).`,
          visual: `<div class="word-big">${esc(w)}</div>`,
          options: [{ html: '<span class="pic">🙂</span><span class="lbl">Common noun</span><small style="font-size:18px">any one, small letter</small>', value: 'c', say: 'common noun' }, { html: '<span class="pic">👑</span><span class="lbl">Proper noun</span><small style="font-size:18px">special name, big letter</small>', value: 'p', say: 'proper noun' }],
          cols: 'two', answer: isP ? 'p' : 'c',
          explain: isP ? `${theWord(w)} is a special name. It is a proper noun. It starts with a big letter.` : `${theWord(w)} is a common noun. It starts with a small letter.`,
        };
      }
      const p = pick(PROPER);
      const wrong = sample(COMMON, 2);
      return {
        say: 'Read the words. Tap the special name, the proper noun. Look for the big letter!', readFirst: true,
        options: shuffle([p, ...wrong]).map(w => ({ html: esc(w), value: w })), answer: p,
        explain: `${theWord(p)} is a special name. It starts with a big letter.`,
      };
    },
  },
  {
    id: 'g-plural', name: 'One or many?', emoji: '🍎',
    gen(l) {
      if (l === 1 || Math.random() < 0.35) {
        const w = pick(['apple', 'cat', 'star', 'mango', 'fish', 'dog', 'ball', 'flower', 'car', 'egg'].filter(picOf));
        const many = Math.random() < 0.5;
        return {
          say: 'Look at the picture. Is there one, or more than one? Tap singular for one. Tap plural for more than one.',
          text: 'Is there one, or more than one? Tap singular or plural.',
          visual: `<div style="font-size:80px">${many ? Array(3).fill(picOf(w)).join(' ') : picOf(w)}</div>`,
          options: [{ html: '<span class="pic">☝️</span><span class="lbl">Singular</span><small style="font-size:18px">one</small>', value: 's', say: 'singular, one' }, { html: '<span class="pic">🖐️</span><span class="lbl">Plural</span><small style="font-size:18px">more than one</small>', value: 'p', say: 'plural, more than one' }],
          cols: 'two', answer: many ? 'p' : 's',
          explain: many ? 'More than one is plural.' : 'One is singular.',
        };
      }
      const es = Math.random() < 0.5;
      const w = pick(es ? ES_WORDS : S_WORDS);
      const right = es ? w + 'es' : w + 's';
      const wrong = es ? w + 's' : w + 'es';
      return {
        say: `Here is one ${w}. Now there are two. Tap the right way to write two.`, readFirst: l === 3,
        visual: `<div class="word-big">one ${w}</div>`,
        options: shuffle([right, wrong]).map(x => ({ html: `two ${x}`, value: x })), cols: 'two', answer: right,
        explain: !es ? `Just add s. One ${w}, two ${right}.`
          : w.endsWith('o') ? `Some words that end in o add e s, like tomatoes and potatoes. One ${w}, two ${right}.`
          : `Words that end in s, x, sh or ch add e s. One ${w}, two ${right}.`,
      };
    },
  },
  {
    id: 'g-article', name: 'a, an, the', emoji: '🍊',
    gen(l) {
      if (l === 1 || Math.random() < 0.5) {
        const isAn = Math.random() < 0.5;
        const w = pick((isAn ? AN_WORDS : A_WORDS).filter(picOf));
        return {
          say: `Look at the picture. Do we say a ${w}, or an ${w}? Tap the word that goes in the box.`,
          text: `Tap a or an to go in the box.`,
          visual: `<div style="display:flex;align-items:center;gap:12px"><span style="font-size:90px">${picOf(w)}</span><div class="word-big">${BOX} ${w}</div></div>`,
          options: [{ html: 'a', value: 'a' }, { html: 'an', value: 'an' }], cols: 'two', answer: isAn ? 'an' : 'a',
          explain: `${aAnReason(w)} ${aan(w) === 'an' ? 'An' : 'A'} ${w}.`,
        };
      }
      if (Math.random() < 0.25) return fill(l, pick(THE_SENT));
      const s = pick(A_AN_SENT);
      const next = s.split('___ ')[1].split(/[ .]/)[0];
      return fill(l, [s, aan(next), ['a', 'an'], aAnReason(next)]);
    },
  },
  {
    id: 'g-pronoun', name: 'Pronouns', emoji: '🙋‍♀️',
    gen(l) { return fill(l, pick(PRONOUNS.filter(p => p[4] <= l))); },
  },
  {
    id: 'g-amisare', name: 'am, is, are', emoji: '🤝',
    gen(l) { return fill(l, pick(AM_IS_ARE), 'I am. He is. She is. It is. We are. You are. They are.'); },
  },
  {
    id: 'g-waswere', name: 'was & were', emoji: '⏪',
    gen(l) { return fill(l, pick(WAS_WERE), 'Use was for one: She was. I was. Use were for more than one, and with you: They were. You were.'); },
  },
  {
    id: 'g-verb', name: 'Action words (verbs)', emoji: '🏃‍♀️',
    gen(l) {
      if (l === 1) {
        const all = Object.keys(VERB_PIC);
        const v = pick(all);
        const others = sample(all.filter(x => x !== v), 2);
        return {
          say: `Tap the picture that shows: ${v}!`, text: 'Tap the action you hear! 👂',
          options: shuffle([v, ...others]).map(w => ({ html: `<span class="pic">${VERB_PIC[w]}</span><span class="lbl">${w}</span>`, value: w, say: w })), answer: v,
          explain: `${theWord(v)} is an action word.`,
        };
      }
      const [s, v] = pick(l === 2 ? VERB_SENT_SHORT : VERB_SENT_LONG);
      const words = s.replace('.', '').split(' ');
      return {
        say: 'Read the sentence. Tap the action word, the verb!', readFirst: true,
        visual: `<div class="sentence">${esc(s)}</div>`,
        options: [...new Set(words)].map(w => ({ html: esc(w), value: w })),
        answer: v,
        explain: `${theWord(v)} is the action word. ${s}`,
      };
    },
  },
  {
    id: 'g-adjective', name: 'Describing words', emoji: '🌈',
    gen(l) {
      if (l === 1 || Math.random() < 0.5) {
        const [e, w, a, wrong] = pick(ADJ_PIC);
        return {
          say: `Look at the ${w}. Tap the word that tells what the ${w} is like.`,
          text: `Tap the word that describes the ${w}.`,
          visual: `<div style="font-size:110px">${e}</div>`,
          options: shuffle([a, ...wrong]).map(x => ({ html: x, value: x, say: x })), answer: a,
          explain: `The ${w} is ${a}. ${theWord(a)} describes the ${w}.`,
        };
      }
      const [s, a, noun] = pick(ADJ_SENT);
      return {
        say: 'Read the sentence. Tap the describing word, the adjective!', readFirst: true,
        visual: `<div class="sentence">${esc(s)}</div>`,
        options: [...new Set(s.replace('.', '').split(' '))].map(w => ({ html: esc(w), value: w })),
        answer: a,
        explain: `${theWord(a)} describes the ${noun}.`,
      };
    },
  },
  {
    id: 'g-compound', name: 'Compound words', emoji: '🧩',
    gen(l) {
      const [a, b] = pick(COMPOUNDS);
      const word = a + b;
      // Wrong answers: made-up mix-ups like "sunball" or "footflower", never a real word
      const mixes = shuffle(COMPOUNDS.flatMap(([x, y]) => [a + y, x + b]))
        .filter(m => m !== word && !COMPOUNDS.some(([p, q]) => p + q === m) && !REAL_MIXES.includes(m));
      const opts = [word, ...new Set(mixes)].slice(0, 3);
      const pic = COMPOUND_PIC[word] || picOf(word);
      return {
        say: l === 3 ? 'Read the two small words. Put them together. Tap the new word they make!' : `${a} plus ${b} makes one new word. Tap the new word!`,
        text: 'Put the two words together. Tap the new word!', readFirst: l === 3,
        visual: `<div class="eq" style="font-size:clamp(36px,7vw,64px)">${a} + ${b} = <span class="gap">?</span></div>` + (pic ? `<div style="font-size:80px">${pic}</div>` : ''),
        options: shuffle(opts).map(x => ({ html: x, value: x })), answer: word,
        explain: `The words "${a}" and "${b}" make "${word}".`,
      };
    },
  },
  {
    id: 'g-sentence', name: 'Super sentences', emoji: '✍️',
    gen(l) {
      const pool = SENTENCES_OK.filter(([, lv]) => lv <= l && (l < 3 || lv >= 2));
      const [s] = pick(pool);
      const mark = s.slice(-1);
      const noCap = s.charAt(0).toLowerCase() + s.slice(1);
      const noStop = s.slice(0, -1);
      const words = s.split(' ');
      const i = 1 + Math.floor(Math.random() * (words.length - 1));
      const noSpace = words.slice(0, i - 1).concat(words[i - 1] + words[i]).concat(words.slice(i + 1)).join(' ');
      // Level 1: three choices. Levels 2 and 3: four choices.
      const wrong = l === 1 ? sample([noCap, noStop, noSpace], 2) : [noCap, noStop, noSpace];
      const opts = shuffle([s, ...wrong]);
      return {
        say: 'Tap the sentence that is written the right way. Look for a big letter at the start, spaces between words, and a mark at the end.', readFirst: true,
        text: 'Tap the sentence that is written the right way.',
        options: opts.map(x => ({ html: `<span class="lbl">${esc(x)}</span>`, value: x })), answer: s, cols: 'two',
        explain: `Big letter at the start. Spaces between words. ${mark === '!' ? 'An exclamation mark' : mark === '?' ? 'A question mark' : 'A period'} at the end. ${s}`,
      };
    },
  },

  // ======== Parts of speech: name them, find them, use them, build sentences ========
  {
    id: 'g-parts', name: 'What kind of word?', emoji: '🧠',
    gen(l) {
      const kinds = l === 1 ? ['n', 'v'] : l === 2 ? ['n', 'v', 'a'] : ['n', 'v', 'a', 'p'];
      const k = pick(kinds);
      const w = pick(WORDS[k]);
      return {
        say: `Look at the word ${w}. Is it ${kinds.map(x => `${aan(KIND[x].name)} ${KIND[x].name}`).join(', or ')}? Tap one.`, text: `What kind of word is "${w}"? Tap one.`,
        visual: `<div class="word-big">${esc(w)}</div>`,
        options: kinds.map(x => ({ html: `<span class="pic">${KIND[x].e}</span><span class="lbl">${KIND[x].name}</span><small style="font-size:18px">${KIND[x].hint}</small>`, value: x, say: KIND[x].name })),
        cols: kinds.length === 2 ? 'two' : '', answer: k,
        explain: `${theWord(w)} is ${aan(KIND[k].name)} ${KIND[k].name}. ${KIND[k].rule}`,
      };
    },
  },
  {
    id: 'g-find', name: 'Find the word', emoji: '🔎',
    gen(l) {
      const kinds = l === 1 ? ['n', 'v'] : l === 2 ? ['n', 'v', 'a'] : ['n', 'v', 'a', 'p'];
      // Only ask for a kind of word that the sentence has exactly once.
      const choices = [];
      for (const t of TAGGED) {
        const row = t.split(' ').map(x => x.split('/'));
        for (const k of kinds) {
          const hits = row.filter(([, tag]) => tag === k);
          if (hits.length === 1) choices.push([row, k, hits[0][0]]);
        }
      }
      const [row, k, target] = pick(choices);
      const words = [...new Set(row.map(([w]) => w))];
      const sentence = row.map(([w]) => w).join(' ') + '.';
      return {
        say: l === 1 ? `${sentence} Tap the ${KIND[k].name}, the ${KIND[k].desc}!` : `Read the sentence. Tap the ${KIND[k].name}, the ${KIND[k].desc}!`,
        text: `Tap the ${KIND[k].name}, the ${KIND[k].desc}!`, readFirst: l > 1,
        visual: `<div class="sentence">${esc(sentence)}</div>`,
        options: words.map(w => ({ html: esc(w), value: w })), answer: target,
        explain: `${theWord(target)} is the ${KIND[k].name}. ${KIND[k].rule}`,
      };
    },
  },
  {
    id: 'g-use', name: 'Use the right word', emoji: '✏️',
    gen(l) {
      const [sentence, k, opts] = pick(USE.filter(u => l === 3 || u[1] !== 'p'));
      const name = KIND[k].name, desc = KIND[k].desc;
      return {
        say: l === 1 ? `Tap the ${name}, the ${desc}, that goes in the box. ${spoken(sentence)}` : `Read the sentence. Tap the ${name}, the ${desc}, that goes in the box.`,
        text: `Tap the ${name} (${desc}) that goes in the box.`,
        readFirst: l > 1,
        visual: `<div class="sentence">${boxed(sentence)}</div>`,
        options: shuffle(Object.values(opts)).map(w => ({ html: esc(w), value: w })), answer: opts[k],
        explain: `${theWord(opts[k])} is ${aan(name)} ${name}. ${sentence.replace('___', opts[k])}`,
      };
    },
  },
  {
    id: 'g-build', name: 'Make a sentence', emoji: '🧱', type: 'order',
    gen(l) {
      const len = s => s.split(' ').length;
      const pool = BUILD.filter(([, s]) => l === 1 ? len(s) <= 4 : l === 2 ? len(s) >= 4 && len(s) <= 5 : len(s) >= 5);
      const [pic, s] = pick(pool);
      const words = s.split(' ');
      return {
        type: 'order',
        say: l === 1 ? `Make this sentence: ${s} Tap the words in order.` : 'Look at the picture. Tap the words in order to make a sentence about it!',
        text: 'Tap the words in order to make a sentence. Start with the big letter!',
        visual: `<div style="font-size:90px">${pic}</div>`,
        items: shuffle(words), answer: words,
        explain: `The sentence is: ${s} It starts with a big letter and ends with a period.`,
      };
    },
  },

  {
    id: 'g-possessive', name: "Possessive nouns ('s)", emoji: '🎒',
    gen(l) {
      const [owner, thing, pic, where] = pick(POSS);
      const right = `${owner}'s ${thing}`;
      // Level 1: two choices. Level 2: three choices, or "who owns it?". Level 3: in a longer sentence.
      if (l === 1 || Math.random() < 0.5) {
        const wrong = l === 1 ? [`${owner}s ${thing}`] : [`${owner}s ${thing}`, `${owner}s' ${thing}`];
        const opts = l === 3 ? [right, ...wrong].map(x => `${x[0].toUpperCase()}${x.slice(1)} is ${where}.`) : [right, ...wrong];
        return {
          say: `The ${thing} belongs to ${owner}. Tap the one that is written the right way.`, readFirst: l > 1,
          visual: `<div style="font-size:90px">${pic}</div>`,
          options: shuffle(opts).map(x => ({ html: esc(x), value: x })), answer: opts[0], cols: l === 1 ? 'two' : '',
          explain: `We add an apostrophe and s to show who owns it: ${right}.`,
        };
      }
      const sentence = l === 3 ? `Look! ${right} is ${where}.` : `This is ${right}.`;
      return {
        say: `Read the sentence. Whose ${thing} is it? Tap the name.`, readFirst: true,
        visual: `<div class="sentence">${esc(sentence)}</div>`,
        options: shuffle([owner, ...sample(POSS.map(p => p[0]).filter(o => o !== owner), 2)]).map(x => ({ html: esc(x), value: x })), answer: owner,
        explain: `The words "${right}" mean the ${thing} belongs to ${owner}.`,
      };
    },
  },
  {
    id: 'g-helping', name: 'has, have, do, does', emoji: '🤝',
    gen(l) { return fill(l, pick(HELPING.filter(h => l > 1 || !h[3].startsWith('Yesterday') && !h[3].startsWith('Last')))); },
  },
  {
    id: 'g-abc', name: 'ABC order', emoji: '🔤',
    gen(l) {
      if (l === 1) {
        const letters = sample('abcdefghijklmnopqrstuvwxyz'.split(''), 3).sort();
        return {
          type: 'order', say: 'Tap the letters in ABC order. Tap the one that comes first in the alphabet, then the next.', text: 'Tap the letters in ABC order.', items: shuffle(letters), answer: letters,
          explain: `In ABC order: ${letters.join(', ')}.`,
        };
      }
      let words;
      do { words = sample(ABC_WORDS, l === 2 ? 3 : 4); } while (new Set(words.map(w => w[0])).size !== words.length);
      const sorted = [...words].sort();
      if (Math.random() < 0.4) return {
        say: 'Tap the word that comes first in ABC order. Look at the first letter of each word.', readFirst: true,
        options: shuffle(words).map(w => ({ html: w, value: w })), answer: sorted[0],
        explain: `${theWord(sorted[0])} starts with ${sorted[0][0]}, which comes first in the alphabet.`,
      };
      return {
        type: 'order', say: 'Tap the words in ABC order. Look at the first letter of each word.', text: 'Tap the words in ABC order.', items: shuffle(words), answer: sorted,
        explain: `In ABC order: ${sorted.join(', ')}.`,
      };
    },
  },
  {
    id: 'g-endmark', name: 'Period, ? or !', emoji: '❗',
    gen(l) {
      const [s, mark] = pick(ENDMARKS);
      return {
        say: l === 1 ? `${s}... Tap the mark that goes in the box at the end.` : 'Read the sentence. Tap the mark that goes in the box at the end.', text: 'Tap the mark that goes in the box at the end.', readFirst: l > 1,
        visual: `<div class="sentence">${esc(s)} ${BOX}</div>`,
        options: ['.', '?', '!'].map(m => ({ html: `<span class="pic">${m}</span><span class="lbl">${END_NAME[m]}</span>`, value: m, say: END_NAME[m] })), answer: mark,
        explain: mark === '.' ? 'A telling sentence ends with a period.'
          : mark === '?' ? 'An asking sentence ends with a question mark.'
          : `A sentence with a strong feeling, like "${s.split(',')[0]}", ends with an exclamation mark.`,
      };
    },
  },

  {
    id: 'g-opposites', name: 'Opposites', emoji: '🔄',
    gen(l) {
      const pairs = OPPOSITES.filter(p => p[2] <= l);
      const [a, b] = pick(pairs);
      const [w, ans] = Math.random() < 0.5 ? [a, b] : [b, a];
      // Leave out look-alike words (opposite of "up" is "down", so "bottom" is not offered).
      const near = NEAR.filter(g => g.includes(w)).flat();
      const wrong = sample(pairs.flatMap(p => [p[0], p[1]]).filter(x => x !== ans && x !== w && !near.includes(x)), 2);
      return {
        say: `Tap the word that is the opposite of ${w}.`, readFirst: l === 3,
        visual: `<div class="word-big">${w}</div>`,
        options: shuffle([ans, ...wrong]).map(x => ({ html: x, value: x, say: x })), answer: ans,
        explain: `Opposites mean completely different, like hot and cold, up and down. The opposite of "${w}" is "${ans}".`,
      };
    },
  },
];
// Ms Bennett's Opposites slides: [word, opposite, lowest level].
// No two pairs share a meaning (no hard/easy, high/up, right/correct), so a wrong choice is never also right.
const OPPOSITES = [
  ['hot', 'cold', 1], ['big', 'small', 1], ['up', 'down', 1], ['happy', 'sad', 1], ['wet', 'dry', 1], ['fast', 'slow', 1], ['night', 'day', 1],
  ['open', 'shut', 1], ['empty', 'full', 1], ['top', 'bottom', 1], ['in', 'out', 1], ['push', 'pull', 1], ['hard', 'soft', 1], ['loud', 'quiet', 1],
  ['thick', 'thin', 2], ['far', 'near', 2], ['before', 'after', 2], ['rough', 'smooth', 2], ['right', 'wrong', 2], ['heavy', 'light', 2],
  ['give', 'take', 2], ['messy', 'neat', 2], ['more', 'less', 2], ['early', 'late', 2], ['asleep', 'awake', 2], ['tight', 'loose', 2], ['rich', 'poor', 2],
  ['wide', 'narrow', 3], ['deep', 'shallow', 3], ['curved', 'straight', 3], ['even', 'odd', 3], ['entrance', 'exit', 3],
];
// Groups of words that are close in meaning, so they are never wrong answers for each other.
const NEAR = [['up', 'down', 'top', 'bottom'], ['in', 'out', 'entrance', 'exit', 'open', 'shut'], ['before', 'after', 'early', 'late'],
  ['empty', 'full', 'more', 'less'], ['big', 'small', 'thick', 'thin', 'wide', 'narrow'], ['far', 'near', 'deep', 'shallow'], ['night', 'day', 'asleep', 'awake'],
  ['hard', 'soft', 'rough', 'smooth', 'heavy', 'light'], ['right', 'wrong', 'even', 'odd']];
// [owner, thing, picture, where it is (level 3 sentences)]
const POSS = [['Zinnia', 'book', '📖', 'on the bed'], ['Mummy', 'bag', '👜', 'on the chair'], ['Daddy', 'car', '🚗', 'red'], ['Spot', 'bone', '🦴', 'in the yard'],
  ['Kai', 'ball', '⚽', 'under the table'], ['Grandma', 'hat', '👒', 'very big'], ['Ruth', 'toy', '🧸', 'soft'], ['Maya', 'kite', '🪁', 'up in the sky'],
  ['Baby Joy', 'cup', '🍼', 'full of milk'], ['Leo', 'bike', '🚲', 'new']];
// [sentence, answer, choices, reason]
const HELPING = [
  ['Zinnia ___ a red bag.', 'has', ['has', 'have'], 'Zinnia is one girl, so we say has.'],
  ['I ___ two pencils.', 'have', ['have', 'has'], 'With I, we say have.'],
  ['They ___ a big dog.', 'have', ['have', 'has'], 'They means more than one, so we say have.'],
  ['The cat ___ a long tail.', 'has', ['has', 'have'], 'The cat is one, so we say has.'],
  ['We ___ a new car.', 'have', ['have', 'has'], 'With we, we say have.'],
  ['The dogs ___ long tails.', 'have', ['have', 'has'], 'The dogs are more than one, so we say have.'],
  ['Yesterday I ___ fun.', 'had', ['had', 'has'], 'Yesterday is in the past, so we say had.'],
  ['Last week Kai ___ a cold.', 'had', ['had', 'have'], 'Last week is in the past, so we say had.'],
  ['___ you like mangoes?', 'Do', ['Do', 'Does'], 'With you, we say do.'],
  ['___ she like to sing?', 'Does', ['Does', 'Do'], 'She is one person, so we say does.'],
  ['___ Kai have a kite?', 'Does', ['Does', 'Do'], 'Kai is one boy, so we say does.'],
  ['He ___ his homework.', 'does', ['does', 'do'], 'He is one person, so we say does.'],
  ['I ___ my best at school.', 'do', ['do', 'does'], 'With I, we say do.'],
  ['They ___ not like rain.', 'do', ['do', 'does'], 'They means more than one, so we say do.'],
  ['She ___ not run fast.', 'does', ['does', 'do'], 'She is one person, so we say does.'],
];
const ABC_WORDS = ['apple', 'ball', 'cat', 'dog', 'egg', 'fish', 'goat', 'hat', 'ink', 'jam', 'kite', 'lion', 'mango', 'nest', 'owl', 'pig', 'queen', 'rain', 'sun', 'tree', 'van', 'web', 'yam', 'zoo'];
// "!" sentences start with a feeling word; "?" sentences are clearly asking; "." sentences are plain telling.
const ENDMARKS = [
  ['I like to read', '.'], ['The sun is hot', '.'], ['We go to church on Sunday', '.'], ['My dog is brown', '.'], ['Kai has a red kite', '.'],
  ['What is your name', '?'], ['Can you swim', '?'], ['Where is my hat', '?'], ['Do you like mangoes', '?'], ['Who is at the door', '?'],
  ['Yay, I won the race', '!'], ['Wow, that is a big cake', '!'], ['Oh no, the milk fell', '!'], ['Ouch, I hurt my toe', '!'], ['Hooray, it is my birthday', '!'],
];

const KIND = {
  n: { name: 'noun', e: '🏷️', hint: 'Naming word', desc: 'naming word', rule: 'A noun names a person, place, animal or thing.' },
  v: { name: 'verb', e: '🏃‍♀️', hint: 'Action word', desc: 'action word', rule: 'A verb is an action word. It tells what someone or something does.' },
  a: { name: 'adjective', e: '🌈', hint: 'Describing word', desc: 'describing word', rule: 'An adjective describes a noun. It tells what it is like.' },
  p: { name: 'pronoun', e: '🙋‍♀️', hint: 'Takes the place of a name', desc: 'word that takes the place of a name', rule: 'A pronoun takes the place of a name, like he, she, it, we, they, I.' },
};
// Single words shown alone: each one is clearly only one kind of word.
const WORDS = {
  n: ['dog', 'girl', 'school', 'mango', 'teacher', 'beach', 'cat', 'house', 'bird', 'tree', 'mother', 'church', 'pencil', 'goat', 'banana', 'chair'],
  v: ['eat', 'sit', 'give', 'go', 'see', 'cry', 'sing', 'swim', 'write', 'jump', 'sweep', 'pray', 'climb', 'take'],
  a: ['big', 'tall', 'tiny', 'happy', 'soft', 'sad', 'funny', 'little', 'shiny', 'pretty', 'small', 'busy'],
  p: ['he', 'she', 'it', 'they', 'we', 'I', 'you', 'him', 'them'],
};
// word/tag (n noun, v verb, a adjective, p pronoun — my, his, her, their count as pronouns too).
const TAGGED = [
  'The/ big/a dog/n runs/v', 'She/p eats/v a/ sweet/a mango/n', 'Zinnia/n reads/v a/ funny/a book/n', 'He/p kicks/v the/ red/a ball/n',
  'The/ little/a bird/n sings/v', 'We/p swim/v in/ the/ blue/a sea/n', 'They/p play/v at/ the/ beach/n', 'The/ tall/a boy/n waves/v',
  'The/ happy/a baby/n hugs/v me/p', 'The/ happy/a girl/n dances/v', 'The/ green/a frog/n jumps/v', 'Grandma/n cooks/v hot/a soup/n',
  'The/ fast/a car/n zooms/v', 'He/p climbs/v the/ big/a hill/n', 'She/p sings/v a/ happy/a song/n', 'The/ cat/n sleeps/v',
  'His/p cat/n sleeps/v', 'They/p eat/v sweet/a mangoes/n',
];
// [sentence, kind of word needed, { n, v, a, p }]
const USE = [
  ['The ___ dog barks.', 'a', { a: 'big', v: 'jump', n: 'table' }],
  ['Zinnia can ___ fast.', 'v', { v: 'run', a: 'red', n: 'cup' }],
  ['I see a ___ in the sky.', 'n', { n: 'bird', v: 'sing', a: 'happy' }],
  ['The mango is ___.', 'a', { a: 'sweet', v: 'swim', n: 'chair' }],
  ['We ___ to school.', 'v', { v: 'walk', a: 'tall', n: 'apple' }],
  ['My ___ is in the bag.', 'n', { n: 'book', v: 'eat', a: 'cold' }],
  ['The ___ cat is sleeping.', 'a', { a: 'fluffy', v: 'kick', n: 'door' }],
  ['Birds can ___.', 'v', { v: 'fly', a: 'green', n: 'shoe' }],
  ['The ___ is hot today.', 'n', { n: 'sun', v: 'eat', a: 'soft' }],
  ['Kai is a ___ boy.', 'a', { a: 'happy', v: 'clap', n: 'pen' }],
  ['Maya likes to ___ songs.', 'v', { v: 'sing', a: 'tiny', n: 'goat' }],
  ['Kai has a ball. ___ kicks it.', 'p', { p: 'He', v: 'Run', n: 'Dog' }],
  ['Maya and I play. ___ have fun.', 'p', { p: 'We', a: 'Big', v: 'Jump' }],
  ['The girls sing. ___ are happy.', 'p', { p: 'They', n: 'Cat', v: 'Eat' }],
];
// [picture, sentence] — each sentence has only one right word order.
const BUILD = [
  ['🐶', 'The dog can run.'], ['☀️', 'The sun is hot.'], ['🐱', 'I see a cat.'], ['🥭', 'I like mangoes.'], ['🏫', 'We go to school.'],
  ['📖', 'She reads a book.'], ['🐟', 'The fish can swim.'], ['🐦', 'The bird sings.'], ['⚽', 'He kicks the ball.'], ['🐢', 'The turtle is slow.'],
  ['🌳', 'The tree is very tall.'], ['🏖️', 'We play at the beach.'], ['🙏', 'I pray to God.'], ['🎂', 'Mummy made a big cake.'],
  ['🌧️', 'It is raining today.'], ['🐸', 'The frog hops on a log.'], ['⛪', 'We sing at church.'], ['🐕', 'My dog has a long tail.'],
  ['🍼', 'The baby drinks milk from a cup.'], ['🚲', 'Kai rides his bike to school.'], ['🌊', 'We swim in the sea.'],
];
