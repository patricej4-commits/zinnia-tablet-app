// Story Tree: reading practice. Words are shown but NOT read out, so she has to read.
// Sentences use the sounds from her class charts (ck, sh, th, ar, or, igh, oo, ...).
import { pick, shuffle, sample, esc } from '../util.js';
import { PICS, picOf } from './pictures.js';

// [sentence, matching picture word, other picture words]
const SENTENCES = [
  // level 1: short one-vowel words + sight words
  [1, 'The cat sat on a mat.', 'cat', ['dog', 'pig']], [1, 'I see a red bus.', 'bus', ['car', 'boat']], [1, 'The hen is in a box.', 'hen', ['fox', 'duck']],
  [1, 'A big pig can run.', 'pig', ['cat', 'cow']], [1, 'The sun is hot.', 'sun', ['moon', 'snow']], [1, 'I can hop like a frog.', 'frog', ['fish', 'duck']],
  [1, 'The dog has a bone.', 'dog', ['cat', 'hen']], [1, 'Ten pens are in the cup.', 'pen', ['bat', 'egg']], [1, 'The duck is wet.', 'duck', ['frog', 'pig']],
  [1, 'Look at my hat!', 'hat', ['cap', 'bag']], [1, 'The fox is in the den.', 'fox', ['dog', 'cat']], [1, 'Mum has a hot cup of tea.', 'cup', ['bed', 'pot']],
  // level 2: special sounds charts 6 & 7
  [2, 'The ship is on the sea.', 'ship', ['train', 'plane']], [2, 'A fish can swim fast.', 'fish', ['bird', 'snake']], [2, 'The clock says it is time for bed.', 'clock', ['bell', 'book']],
  [2, 'I can see a crab on the sand.', 'crab', ['frog', 'shark']], [2, 'The train goes on the track.', 'train', ['ship', 'bike']], [2, 'A plane can fly in the sky.', 'plane', ['car', 'boat']],
  [2, 'Grandma has a black and white sheep.', 'sheep', ['goat', 'cow']], [2, 'The snail is very slow.', 'snail', ['snake', 'frog']], [2, 'Dad will drum on the drum.', 'drum', ['bell', 'ball']],
  [2, 'The snake is long and green.', 'snake', ['snail', 'worm']], [2, 'I put a stamp on the flag.', 'flag', ['kite', 'cake']], [2, 'We had cake at the party!', 'cake', ['bread', 'egg']],
  [2, 'The queen has a crown.', 'crown', ['ring', 'hat']], [2, 'Kai rides his bike to school.', 'bike', ['bus', 'car']],
  // level 3: chart 8 sounds and longer sentences
  [3, 'The stars shine at night.', 'stars', ['sun', 'cloud']], [3, 'A shark swims in the dark sea.', 'shark', ['whale', 'turtle']], [3, 'The owl sits on a branch at night.', 'owl', ['bird', 'bat']],
  [3, 'I brush my tooth with a toothbrush.', 'tooth', ['foot', 'hand']], [3, 'The boy has a toy truck.', 'truck', ['car', 'bus']], [3, 'Look at the moon! It is so bright.', 'moon', ['sun', 'star']],
  [3, 'The bird sat on the fork.', 'bird', ['fish', 'bee']], [3, 'A brown cow is in the barn.', 'cow', ['horse', 'pig']], [3, 'Turn on the light so I can read.', 'light', ['moon', 'fire']],
  [3, 'The girl has a pink shirt.', 'girl', ['boy', 'baby']], [3, 'My house has a big red door.', 'house', ['school', 'tent']], [3, 'I put a coin in my piggy bank.', 'coin', ['key', 'ring']],
  [3, 'Three little chicks are in the yard.', 'chick', ['hen', 'duck']], [3, 'The horse can run and jump.', 'horse', ['cow', 'goat']],
];

const SIGHT = ['the', 'see', 'my', 'me', 'is', 'a', 'I', 'can', 'we', 'go', 'to', 'and', 'look', 'said', 'you', 'he', 'she', 'was', 'are', 'come', 'play', 'here', 'like', 'it', 'in', 'at', 'up', 'for', 'have', 'they', 'what', 'this', 'with', 'all', 'do', 'one', 'two', 'three', 'red', 'blue'];

const MINI_STORIES = [
  { s: 'Zinnia has a pet fish. The fish is gold. It swims in a big bowl.', q: 'What colour is the fish?', o: ['gold', 'red', 'black'], a: 'gold' },
  { s: 'Kai went to the shop with Dad. They got milk and bread. Then they went home.', q: 'Who went to the shop with Kai?', o: ['Dad', 'Mum', 'Grandma'], a: 'Dad' },
  { s: 'The sun is up. Maya puts on her hat. She plays in the sand at the beach.', q: 'Where does Maya play?', o: ['at the beach', 'at school', 'in bed'], a: 'at the beach' },
  { s: 'A little frog sat on a log. It saw a fly. Snap! The frog ate the fly.', q: 'What did the frog eat?', o: ['a fly', 'a fish', 'a cake'], a: 'a fly' },
  { s: 'Leo has a red kite. The wind is strong. The kite flies up, up, up!', q: 'What colour is the kite?', o: ['red', 'green', 'blue'], a: 'red' },
  { s: 'It is night. The stars shine. Ava is in bed with her teddy. She is sleepy.', q: 'Who is in bed with Ava?', o: ['her teddy', 'her dog', 'her mum'], a: 'her teddy' },
  { s: 'Grandma has six hens. Each hen has an egg. Grandma puts the eggs in a basket.', q: 'How many hens does Grandma have?', o: ['six', 'two', 'ten'], a: 'six' },
  { s: 'The bus is big and yellow. It takes the children to school. They sing on the bus.', q: 'What do the children do on the bus?', o: ['sing', 'sleep', 'eat'], a: 'sing' },
];

const levelSentences = l => SENTENCES.filter(s => s[0] <= l && (l === 1 || s[0] >= l - 1));

function pictureChoice([, sentence, word, others]) {
  return {
    options: shuffle([word, ...others]).map(w => ({ html: `<span class="pic">${picOf(w)}</span>`, value: w })),
    answer: word,
    explain: `It says: ${sentence}`,
  };
}

export const readingSkills = [
  {
    id: 'r-aloud', name: 'Read it out loud', emoji: '🎤', type: 'read',
    gen(l) {
      const row = pick(levelSentences(l));
      return {
        type: 'read', sentence: row[1],
        say: 'Read this sentence out loud to me! Tap the button, then read.',
        fallback: { say: 'Read the sentence. Then tap the picture that matches!', ...pictureChoice(row) },
        explain: `It says: ${row[1]}`,
      };
    },
  },
  {
    id: 'r-match', name: 'Read & find', emoji: '🔎',
    gen(l) {
      const row = pick(levelSentences(l));
      return {
        say: 'Read the sentence. Which picture matches?', readFirst: true,
        visual: `<div class="sentence">${esc(row[1])}</div>`,
        ...pictureChoice(row),
      };
    },
  },
  {
    id: 'r-word', name: 'Word to picture', emoji: '🖼️',
    gen(l) {
      const pool = Object.keys(PICS).filter(w => (l === 1 ? w.length <= 3 : l === 2 ? w.length <= 5 : w.length >= 4) && !w.includes(' '));
      const words = sample(pool, 3);
      const w = words[0];
      return {
        say: 'Read the word. Find its picture!', readFirst: true,
        visual: `<div class="word-big">${w}</div>`,
        options: shuffle(words).map(x => ({ html: `<span class="pic">${PICS[x]}</span>`, value: x })), answer: w,
        explain: `This word says ${w}.`,
      };
    },
  },
  {
    id: 'r-sight', name: 'Sight words', emoji: '👀',
    gen() {
      const words = sample(SIGHT, 4);
      return {
        say: `Find the word: ${words[0]}.`, text: 'Find the word you hear! 👂',
        options: shuffle(words).map(w => ({ html: w, value: w })), answer: words[0],
        explain: `This is the word ${words[0]}. We see it in lots of books!`,
      };
    },
  },
  {
    id: 'r-story', name: 'Read a story', emoji: '📖',
    gen() {
      const st = pick(MINI_STORIES);
      return {
        say: 'Read the little story, then answer the question.', readFirst: true,
        text: st.q,
        visual: `<div class="sentence" style="font-size:clamp(24px,4vw,38px);text-align:left">${esc(st.s)}</div>`,
        options: shuffle(st.o).map(o => ({ html: esc(o), value: o })), answer: st.a,
        explain: `The story says: ${st.s}`,
      };
    },
  },
];
