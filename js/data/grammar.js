// Word Castle: grammar from the class — nouns (common/proper), singular & plural,
// articles a/an/the, pronouns, am/is/are, was/were, verbs, adjectives, compound words,
// and sentence writing (capital letters, spaces, full stops).
import { pick, shuffle, sample, esc, textOptions } from '../util.js';
import { picOf } from './pictures.js';

// Fill-in-the-blank sentence question. Reading is required from level 2 up.
function fill(l, [sentence, answer, choices], explain) {
  const shown = esc(sentence).replace('___', '<span style="color:#5b3fd1;border-bottom:5px solid #5b3fd1;padding:0 18px">?</span>');
  return {
    say: l === 1 ? `Which word fits? ${sentence.replace('___', 'blank')}` : 'Read it. Which word fits?',
    readFirst: l > 1,
    visual: `<div class="sentence">${shown}</div>`,
    options: shuffle(choices).map(c => ({ html: esc(c), value: c })), answer,
    explain: `${explain} ${sentence.replace('___', answer)}`,
  };
}

const AM_IS_ARE = [
  ['I ___ happy!', 'am'], ['You ___ tall.', 'are'], ['He ___ small.', 'is'], ['She ___ a nurse.', 'is'], ['It ___ raining.', 'is'],
  ['We ___ at school.', 'are'], ['They ___ my friends.', 'are'], ['The dog ___ black.', 'is'], ['I ___ drawing shapes.', 'am'],
  ['The girls ___ hungry.', 'are'], ['Zinnia ___ reading a book.', 'is'], ['The mangoes ___ sweet.', 'are'], ['I ___ six years old.', 'am'],
  ['The sun ___ hot.', 'is'], ['Mummy and Daddy ___ at home.', 'are'], ['It ___ cold.', 'is'], ['I ___ sleepy.', 'am'], ['The birds ___ singing.', 'are'],
].map(([s, a]) => [s, a, ['am', 'is', 'are']]);

const WAS_WERE = [
  ['I ___ reading.', 'was'], ['She ___ sleeping.', 'was'], ['The boys ___ swimming.', 'were'], ['They ___ jumping on the bed.', 'were'],
  ['The baby ___ crying.', 'was'], ['A man ___ walking his dog.', 'was'], ['We ___ having fun.', 'were'], ['The monkey ___ eating a banana.', 'was'],
  ['All the apples ___ sweet.', 'were'], ['You ___ in the truck.', 'were'], ['It ___ sleeping.', 'was'], ['The girls ___ late for school.', 'were'],
  ['Zinnia ___ at the beach.', 'was'], ['The fish ___ in the sea.', 'were'],
].map(([s, a]) => [s, a, ['was', 'were']]);

const PRONOUNS = [
  ['___ am a girl.', 'I', ['I', 'Me', 'My']], ['Come and play with ___.', 'me', ['me', 'I', 'mine']], ['This is ___ cat.', 'my', ['my', 'mine', 'I']],
  ['This orange cat is ___.', 'mine', ['mine', 'my', 'me']], ['This is ___ hat.', 'your', ['your', 'you', 'yours']],
  ['___ should brush your teeth.', 'You', ['You', 'Your', 'Yours']], ['These books are ___.', 'yours', ['yours', 'your', 'you']],
  ['Kai is a boy. ___ likes to run.', 'He', ['He', 'She', 'They']], ['Maya is a girl. ___ likes to sing.', 'She', ['She', 'He', 'We']],
  ['The cats are hiding. ___ are under the bed.', 'They', ['They', 'He', 'It']], ['Tom and I play ball. ___ have fun.', 'We', ['We', 'They', 'She']],
  ['It is the lady\'s bag. It is ___ bag.', 'her', ['her', 'his', 'our']], ['This is Grandpa\'s hat. It is ___ hat.', 'his', ['his', 'her', 'my']],
  ['The children have sweets. Those are ___ sweets.', 'their', ['their', 'his', 'your']], ['I found the key. ___ was on the table.', 'It', ['It', 'He', 'They']],
  ['The teacher gave Leo a pencil. She gave ___ a pencil.', 'him', ['him', 'he', 'his']],
];

const ARTICLE_SENT = [
  ['There is ___ orange on the table.', 'an', ['a', 'an', 'the']], ['I want ___ banana.', 'a', ['a', 'an', 'the']],
  ['___ sun is very hot today.', 'The', ['A', 'An', 'The']], ['Dad takes ___ umbrella because it is raining.', 'an', ['a', 'an']],
  ['I can see ___ elephant at the zoo.', 'an', ['a', 'an']], ['There is ___ octopus in the water.', 'an', ['a', 'an']],
  ['I can see ___ turtle at the beach.', 'a', ['a', 'an']], ['Zinnia has ___ red bag.', 'a', ['a', 'an']], ['I ate ___ egg for breakfast.', 'an', ['a', 'an']],
];
const A_WORDS = ['cat', 'dog', 'ball', 'banana', 'flower', 'sheep', 'chick', 'bike', 'ship', 'turtle', 'kite', 'book', 'tree', 'house', 'fish', 'car', 'mango', 'horse'];
const AN_WORDS = ['apple', 'egg', 'umbrella', 'orange', 'octopus', 'elephant', 'ant', 'owl', 'ear', 'eye'];

const ES_WORDS = ['box', 'fox', 'dish', 'bus', 'dress', 'glass', 'beach', 'peach', 'match', 'brush', 'kiss', 'mango', 'potato', 'tomato', 'sandwich', 'watch', 'wish', 'bench', 'lunch', 'class'];
const S_WORDS = ['cat', 'pen', 'chair', 'girl', 'tree', 'table', 'cup', 'dog', 'star', 'doll', 'apple', 'pencil', 'frog', 'egg', 'book', 'bird', 'flower', 'shirt', 'car', 'boy'];

const PERSON = ['girl', 'boy', 'baby', 'teacher', 'nurse', 'mother', 'father', 'farmer', 'doctor', 'firefighter'];
const PLACE = ['school', 'beach', 'park', 'house', 'church', 'shop', 'farm', 'hospital', 'zoo', 'city'];
const ANIMAL = ['dog', 'cat', 'bird', 'goat', 'whale', 'turtle', 'frog', 'cow', 'parrot', 'snake'];
const THING = ['pencil', 'ball', 'chair', 'book', 'cup', 'kite', 'car', 'bag', 'spoon', 'clock'];

const PROPER = ['Jamaica', 'Kingston', 'Portmore', 'Zinnia', 'Monday', 'Christmas', 'Peter', 'Ocho Rios', 'Spot', 'Sunday', 'Grandma Rose', 'Montego Bay', 'Mr. Brown', 'Africa', 'December'];
const COMMON = ['dog', 'school', 'girl', 'truck', 'city', 'beach', 'mango', 'teacher', 'mother', 'car', 'island', 'boy', 'day', 'park', 'country'];

const VERBS = ['run', 'swim', 'eat', 'fly', 'jump', 'sing', 'sleep', 'cook', 'wash', 'clean', 'dance', 'read', 'write', 'skip', 'cry', 'clap', 'ride', 'sweep'];
const NOUNS = ['pencil', 'bag', 'water', 'bed', 'pillow', 'book', 'spoon', 'school', 'door', 'cat', 'tree', 'paper', 'teacher', 'mango'];
const VERB_SENT = [
  ['The dog runs in the park.', 'runs'], ['My mom cooks dinner.', 'cooks'], ['The birds sing in the morning.', 'sing'], ['I read a book at bedtime.', 'read'],
  ['The baby cries when she is hungry.', 'cries'], ['We eat lunch at school.', 'eat'], ['He jumps over the puddle.', 'jumps'], ['Zinnia swims in the sea.', 'swims'],
  ['The children laugh at the clown.', 'laugh'], ['Kate drinks water.', 'drinks'],
];
const ADJ_PIC = [
  ['🐢', 'turtle', 'slow', ['fast', 'broken']], ['🧊', 'ice', 'cold', ['hot', 'soft']], ['☀️', 'sun', 'hot', ['cold', 'wet']], ['🐭', 'mouse', 'small', ['big', 'tall']],
  ['🐘', 'elephant', 'big', ['tiny', 'short']], ['🦒', 'giraffe', 'tall', ['short', 'small']], ['🤡', 'clown', 'funny', ['angry', 'sad']], ['🍎', 'apple', 'red', ['blue', 'purple']],
  ['🐱', 'kitten', 'cute', ['scary', 'tall']], ['🐜', 'ant', 'tiny', ['huge', 'tall']], ['🚗', 'race car', 'fast', ['slow', 'sleepy']], ['🌈', 'rainbow', 'colourful', ['dull', 'sad']],
];
const ADJ_SENT = [
  ['Zinnia has curly hair.', 'curly'], ['Paula ate juicy mangoes.', 'juicy'], ['Terry has a blue shirt.', 'blue'], ['Dan sat on the broken chair.', 'broken'],
  ['The backpack is heavy.', 'heavy'], ['The elephant is a huge animal.', 'huge'], ['The little boy is clever.', 'little'], ['Riya has a beautiful dress.', 'beautiful'],
  ['The giraffe has a long neck.', 'long'], ['The ice is cold.', 'cold'],
];
const COMPOUNDS = [['sun', 'flower'], ['foot', 'ball'], ['snow', 'man'], ['rain', 'bow'], ['butter', 'fly'], ['cup', 'cake'], ['tooth', 'brush'], ['lady', 'bug'],
  ['gold', 'fish'], ['jelly', 'fish'], ['pan', 'cake'], ['star', 'fish'], ['sea', 'shell'], ['arm', 'chair'], ['bed', 'room'], ['pop', 'corn'], ['rain', 'coat'], ['hot', 'dog']];
const SENTENCES_OK = ['The cat is big.', 'I like mangoes.', 'We go to school.', 'My dog can run.', 'The sun is hot.', 'I can see a bird.', 'Mummy has a red hat.', 'Look at the boat!'];

export const grammarSkills = [
  {
    id: 'g-noun', name: 'Naming words (nouns)', emoji: '🏷️',
    gen(l) {
      if (l > 1 && Math.random() < 0.5) {
        const v = pick(VERBS), n = pick(NOUNS);
        const askNoun = Math.random() < 0.5;
        return {
          say: askNoun ? 'Which word is a noun, a naming word?' : 'Which word is a verb, an action word?',
          readFirst: true,
          options: shuffle([v, n]).map(w => ({ html: `<span class="lbl" style="font-size:40px">${w}</span>`, value: w })), cols: 'two',
          answer: askNoun ? n : v,
          explain: `${n} is a noun. It is a naming word. ${v} is a verb. It is an action word.`,
        };
      }
      const groups = { person: PERSON, place: PLACE, animal: ANIMAL, thing: THING };
      const kind = pick(Object.keys(groups));
      const w = pick(groups[kind]);
      return {
        say: `${w}. Is ${w} a person, a place, an animal, or a thing?`,
        visual: `<div style="display:flex;align-items:center;gap:12px">${picOf(w) ? `<span style="font-size:90px">${picOf(w)}</span>` : ''}<div class="word-big">${w}</div></div>`,
        options: [['person', '🧍'], ['place', '🏫'], ['animal', '🐾'], ['thing', '🧸']].map(([k, e]) => ({ html: `<span class="pic">${e}</span><span class="lbl">${k}</span>`, value: k, say: k })),
        answer: kind,
        explain: `${w} is a ${kind}.`,
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
          say: `${w}. Is it a common noun or a proper noun?`,
          visual: `<div class="word-big">${esc(w)}</div>`,
          options: [{ html: '<span class="pic">🙂</span><span class="lbl">Common</span>', value: 'c', say: 'common noun' }, { html: '<span class="pic">👑</span><span class="lbl">Proper</span>', value: 'p', say: 'proper noun' }],
          cols: 'two', answer: isP ? 'p' : 'c',
          explain: isP ? `${w} is a special name. It is a proper noun. It starts with a big letter.` : `${w} is a common noun. It starts with a small letter.`,
        };
      }
      const p = pick(PROPER);
      const wrong = sample(COMMON, 2);
      return {
        say: 'Which one is a special name? Look for the big letter!', readFirst: true,
        options: shuffle([p, ...wrong]).map(w => ({ html: esc(w), value: w })), answer: p,
        explain: `${p} is a special name. It starts with a big letter.`,
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
          say: 'Is it one, or more than one?',
          visual: `<div style="font-size:80px">${many ? Array(3).fill(picOf(w)).join(' ') : picOf(w)}</div>`,
          options: [{ html: '<span class="pic">☝️</span><span class="lbl">Singular</span>', value: 's', say: 'singular' }, { html: '<span class="pic">🖐️</span><span class="lbl">Plural</span>', value: 'p', say: 'plural' }],
          cols: 'two', answer: many ? 'p' : 's',
          explain: many ? 'More than one is plural.' : 'One is singular.',
        };
      }
      const es = Math.random() < 0.5;
      const w = pick(es ? ES_WORDS : S_WORDS);
      const right = es ? w + 'es' : w + 's';
      const wrong = es ? w + 's' : w + 'es';
      return {
        say: `One ${w}. Two... which is right?`, readFirst: l === 3,
        visual: `<div class="word-big">one ${w}</div>`,
        options: shuffle([right, wrong]).map(x => ({ html: `two ${x}`, value: x })), cols: 'two', answer: right,
        explain: es ? `Words that end in x, s, sh, ch or o add e s. One ${w}, two ${right}.` : `Just add s. One ${w}, two ${right}.`,
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
          say: `Is it a ${w}, or an ${w}?`,
          visual: `<div style="display:flex;align-items:center;gap:12px"><span style="font-size:90px">${picOf(w)}</span><div class="word-big">___ ${w}</div></div>`,
          options: [{ html: 'a', value: 'a' }, { html: 'an', value: 'an' }], cols: 'two', answer: isAn ? 'an' : 'a',
          explain: isAn ? `${w} starts with a vowel. We say an ${w}.` : `We say a ${w}.`,
        };
      }
      return fill(l, pick(ARTICLE_SENT), 'Use an before a, e, i, o, u.');
    },
  },
  {
    id: 'g-pronoun', name: 'Pronouns', emoji: '🙋‍♀️',
    gen(l) { return fill(l, pick(PRONOUNS), 'A pronoun takes the place of a name.'); },
  },
  {
    id: 'g-amisare', name: 'am, is, are', emoji: '🤝',
    gen(l) { return fill(l, pick(AM_IS_ARE), 'I am. He is. She is. It is. We are. You are. They are.'); },
  },
  {
    id: 'g-waswere', name: 'was & were', emoji: '⏪',
    gen(l) { return fill(l, pick(WAS_WERE), 'One uses was. Many use were. You were.'); },
  },
  {
    id: 'g-verb', name: 'Action words (verbs)', emoji: '🏃‍♀️',
    gen(l) {
      if (l === 1) {
        const v = pick(VERBS.filter(picOf));
        const others = sample(VERBS.filter(x => x !== v && picOf(x)), 2);
        return {
          say: `Find the action: ${v}!`, text: 'Find the action you hear! 👂',
          options: shuffle([v, ...others]).map(w => ({ html: `<span class="pic">${picOf(w)}</span><span class="lbl">${w}</span>`, value: w, say: w })), answer: v,
          explain: `${v} is an action word.`,
        };
      }
      const [s, v] = pick(VERB_SENT);
      const words = s.replace('.', '').split(' ');
      return {
        say: 'Read it. Tap the action word!', readFirst: true,
        visual: `<div class="sentence">${esc(s)}</div>`,
        options: [...new Set(words)].map(w => ({ html: esc(w), value: w })),
        answer: v,
        explain: `${v} is the action word in: ${s}`,
      };
    },
  },
  {
    id: 'g-adjective', name: 'Describing words', emoji: '🌈',
    gen(l) {
      if (l === 1 || Math.random() < 0.5) {
        const [e, w, a, wrong] = pick(ADJ_PIC);
        return {
          say: `Which word describes the ${w}?`,
          visual: `<div style="font-size:110px">${e}</div>`,
          options: shuffle([a, ...wrong]).map(x => ({ html: x, value: x, say: x })), answer: a,
          explain: `The ${w} is ${a}.`,
        };
      }
      const [s, a] = pick(ADJ_SENT);
      return {
        say: 'Read it. Which word tells what it is like?', readFirst: true,
        visual: `<div class="sentence">${esc(s)}</div>`,
        options: [...new Set(s.replace('.', '').split(' '))].map(w => ({ html: esc(w), value: w })),
        answer: a,
        explain: `${a} is the describing word.`,
      };
    },
  },
  {
    id: 'g-compound', name: 'Compound words', emoji: '🧩',
    gen(l) {
      const [a, b] = pick(COMPOUNDS);
      const word = a + b;
      // Wrong answers: mix-ups like "sunball" or "footflower", always different from the real word
      const mixes = shuffle(COMPOUNDS.flatMap(([x, y]) => [a + y, x + b])).filter(m => m !== word && !COMPOUNDS.some(([p, q]) => p + q === m));
      const opts = [word, ...new Set(mixes)].slice(0, 3);
      return {
        say: `${a} plus ${b} makes...?`, readFirst: l === 3,
        visual: `<div class="eq" style="font-size:clamp(36px,7vw,64px)">${a} + ${b} = <span class="gap">?</span></div>` + (picOf(word) ? `<div style="font-size:80px">${picOf(word)}</div>` : ''),
        options: shuffle(opts).map(x => ({ html: x, value: x })), answer: word,
        explain: `${a} and ${b} make ${word}.`,
      };
    },
  },
  {
    id: 'g-sentence', name: 'Super sentences', emoji: '✍️',
    gen() {
      const s = pick(SENTENCES_OK);
      const noCap = s.charAt(0).toLowerCase() + s.slice(1);
      const noStop = s.slice(0, -1);
      const words = s.split(' ');
      const i = 1 + Math.floor(Math.random() * (words.length - 1));
      const noSpace = words.slice(0, i - 1).concat(words[i - 1] + words[i]).concat(words.slice(i + 1)).join(' ');
      const opts = shuffle([s, noCap, noStop, noSpace]);
      return {
        say: 'Which one is written the right way?', readFirst: true,
        options: opts.map(x => ({ html: `<span class="lbl">${esc(x)}</span>`, value: x })), answer: s, cols: 'two',
        explain: `Big letter at the start. Spaces between words. A dot at the end. ${s}`,
      };
    },
  },
];
