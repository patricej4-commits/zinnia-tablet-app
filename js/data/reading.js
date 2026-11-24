// Story Tree: reading practice. Words are shown but NOT read out, so she has to read.
// Sentences use the sounds from her class charts (ck, sh, th, ar, or, igh, oo, ...).
import { pick, shuffle, sample, esc } from '../util.js';
import { PICS, FIND_PICS, picOf } from './pictures.js';

// [sentence, matching picture word, other picture words]
const SENTENCES = [
  // level 1: short one-vowel words + sight words
  [1, 'The cat sat on a mat.', 'cat', ['dog', 'pig']], [1, 'I see a red bus.', 'bus', ['car', 'boat']], [1, 'The hen is in a box.', 'hen', ['fox', 'duck']],
  [1, 'A big pig can run.', 'pig', ['cat', 'cow']], [1, 'The sun is hot.', 'sun', ['moon', 'snow']], [1, 'I can hop like a frog.', 'frog', ['fish', 'duck']],
  [1, 'The dog has a bone.', 'dog', ['cat', 'hen']], [1, 'Ten pens are in the cup.', 'pen', ['bat', 'egg']], [1, 'The duck is wet.', 'duck', ['frog', 'pig']],
  [1, 'Look at my hat!', 'hat', ['shoe', 'bag']], [1, 'The fox is in the den.', 'fox', ['dog', 'cat']], [1, 'Mum has a hot cup of tea.', 'cup', ['bed', 'pot']],
  // level 2: special sounds charts 6 & 7
  [2, 'The ship is on the sea.', 'ship', ['train', 'plane']], [2, 'A fish can swim fast.', 'fish', ['bird', 'snake']], [2, 'The clock says it is time for bed.', 'clock', ['bell', 'book']],
  [2, 'I can see a crab on the sand.', 'crab', ['frog', 'shark']], [2, 'The train goes on the track.', 'train', ['ship', 'bike']], [2, 'A plane can fly in the sky.', 'plane', ['car', 'boat']],
  [2, 'Grandma has a black and white sheep.', 'sheep', ['goat', 'cow']], [2, 'The snail is very slow.', 'snail', ['snake', 'frog']], [2, 'Dad will drum on the drum.', 'drum', ['bell', 'ball']],
  [2, 'The snake is long and green.', 'snake', ['snail', 'worm']], [2, 'The flag flaps in the wind.', 'flag', ['cake', 'drum']], [2, 'We had cake at the party!', 'cake', ['bread', 'egg']],
  [2, 'The queen has a crown.', 'crown', ['ring', 'hat']], [2, 'Kai rides his bike to school.', 'bike', ['bus', 'car']], [2, 'I brush my teeth.', 'brush', ['spoon', 'pen']],
  // level 3: chart 8 sounds and longer sentences
  [3, 'A star shines at night.', 'star', ['sun', 'cloud']], [3, 'A shark swims in the dark sea.', 'shark', ['whale', 'turtle']], [3, 'The owl sits on a branch at night.', 'owl', ['cow', 'fish']],
  [3, 'The boy has a toy truck.', 'truck', ['car', 'bus']], [3, 'Look at the moon! It is so bright.', 'moon', ['sun', 'star']],
  [3, 'The bird sat on the branch.', 'bird', ['fish', 'cow']], [3, 'A brown cow is in the barn.', 'cow', ['horse', 'pig']], [3, 'Turn on the light so I can read.', 'light', ['moon', 'fire']],
  [3, 'The girl has a pink shirt.', 'girl', ['boy', 'baby']], [3, 'My house has a big red door.', 'house', ['school', 'tent']], [3, 'I put a coin in my piggy bank.', 'coin', ['key', 'ring']],
  [3, 'Three little chicks are in the yard.', 'chick', ['hen', 'duck']], [3, 'The horse can run and jump.', 'horse', ['cow', 'goat']],
];

const SIGHT = ['the', 'see', 'my', 'me', 'is', 'a', 'I', 'can', 'we', 'go', 'to', 'and', 'look', 'said', 'you', 'he', 'she', 'was', 'are', 'come', 'play', 'here', 'like', 'it', 'in', 'at', 'up', 'for', 'have', 'they', 'what', 'this', 'with', 'all', 'do', 'one', 'two', 'three', 'red', 'blue'];

// Comprehension: each story has who / what / where / why / what-first questions
// [story, [question, answer, wrong, wrong]...]
const MINI_STORIES = [
  ['Zinnia has a pet fish. The fish is gold. It swims in a big bowl. Every morning Zinnia feeds it.',
    [['What pet does Zinnia have?', 'a fish', 'a dog', 'a cat'], ['What colour is the fish?', 'gold', 'red', 'black'], ['Where does the fish swim?', 'in a big bowl', 'in the sea', 'in a cup'], ['When does Zinnia feed the fish?', 'every morning', 'at night', 'never']]],
  ['Kai went to the shop with Dad. They got milk and bread. Then they went home and made toast.',
    [['Who went to the shop with Kai?', 'Dad', 'Mum', 'Grandma'], ['What did Kai and Dad get?', 'milk and bread', 'cake and juice', 'fish'], ['What did Kai and Dad do first?', 'went to the shop', 'made toast', 'went to bed'], ['What did Kai and Dad make?', 'toast', 'soup', 'a kite']]],
  ['The sun is up. Maya puts on her hat. She plays in the sand at the beach. She makes a big sand castle.',
    [['Where does Maya play?', 'at the beach', 'at school', 'in bed'], ['What does Maya put on?', 'her hat', 'her coat', 'her boots'], ['What does Maya make?', 'a sand castle', 'a cake', 'a boat'], ['Why does Maya wear a hat?', 'the sun is up', 'it is raining', 'it is night']]],
  ['A little frog sat on a log. It saw a fly. Snap! The frog ate the fly. Then it jumped into the pond.',
    [['Where did the frog sit?', 'on a log', 'on a car', 'on a bed'], ['What did the frog eat?', 'a fly', 'a fish', 'a cake'], ['What did the frog do last?', 'jumped into the pond', 'sat on a log', 'saw a fly']]],
  ['Leo has a red kite. The wind is strong. The kite flies up, up, up! Leo holds the string tight.',
    [['What colour is the kite?', 'red', 'green', 'blue'], ['Why can the kite fly?', 'the wind is strong', 'it is raining', 'Leo is sleeping'], ['What does Leo hold?', 'the string', 'a cup', 'a book']]],
  ['It is night. The stars shine. Ava says her prayers. Then she gets into bed with her teddy.',
    [['When does this happen?', 'at night', 'in the morning', 'at lunch'], ['What does Ava do first?', 'says her prayers', 'gets into bed', 'eats lunch'], ['What is in bed with Ava?', 'her teddy', 'her dog', 'her mum']]],
  ['Grandma has six hens. Each hen lays an egg. Grandma puts the eggs in a basket. She will bake a cake.',
    [['How many hens does Grandma have?', 'six', 'two', 'ten'], ['Where does Grandma put the eggs?', 'in a basket', 'in a box', 'in the sea'], ['What will Grandma bake?', 'a cake', 'bread', 'a pie']]],
  ['The bus is big and yellow. It takes the children to school. They sing on the bus. The driver waves goodbye.',
    [['What colour is the bus?', 'yellow', 'red', 'blue'], ['Where does the bus go?', 'to school', 'to the beach', 'to church'], ['What do the children do on the bus?', 'sing', 'sleep', 'eat'], ['Who waves goodbye?', 'the driver', 'the teacher', 'Grandma']]],
  ['Zinnia fell and hurt her knee. She cried. Mummy gave her a big hug and a plaster. Zinnia felt better.',
    [['What did Zinnia hurt?', 'her knee', 'her hand', 'her nose'], ['Why did Zinnia cry?', 'she hurt her knee', 'she was happy', 'she was hungry'], ['Who gave her a hug?', 'Mummy', 'Daddy', 'Kai'], ['How did Zinnia feel at the end?', 'better', 'sad', 'angry']]],
  ['It rained all day. Kai could not play outside. He read a book and drew a picture of a rainbow.',
    [['What was the weather?', 'rainy', 'sunny', 'windy'], ['Why did Kai stay inside?', 'it rained', 'he was sick', 'it was night'], ['What did Kai draw?', 'a rainbow', 'a dog', 'a car']]],
  ['On Sunday we went to church. We sang songs and prayed. After church, we ate rice and peas with chicken.',
    [['When did we go to church?', 'on Sunday', 'on Monday', 'at night'], ['What did we do at church?', 'sang songs and prayed', 'went swimming', 'played ball'], ['What did we eat after church?', 'rice and peas with chicken', 'cake', 'ice cream']]],
  ['Maya planted a seed. She gave it water every day. The sun shone on it. Soon a pretty flower grew!',
    [['What did Maya plant?', 'a seed', 'a stone', 'a toy'], ['What did Maya give the seed every day?', 'water', 'milk', 'juice'], ['What grew?', 'a flower', 'a tree house', 'a mango'], ['What happened first?', 'Maya planted a seed', 'a flower grew', 'the sun shone']]],
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
      const pool = FIND_PICS.filter(w => (l === 1 ? w.length <= 3 : l === 2 ? w.length <= 5 : w.length >= 4) && !w.includes(' '));
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
        explain: `This is the word "${words[0]}". We see it in lots of books!`,
      };
    },
  },
  {
    id: 'r-story', name: 'Read a story', emoji: '📖',
    gen(l) {
      const [story, qs] = pick(MINI_STORIES);
      const [q, a, ...wrong] = pick(qs);
      return {
        say: l === 1 ? 'Read the little story. Then answer the question. Tap the ear if you need help.' : 'Read the little story, then answer the question.',
        readFirst: true, text: q,
        earSay: l === 1 ? `${story} ... ${q}` : undefined,
        visual: `<div class="sentence" style="font-size:clamp(24px,4vw,38px);text-align:left">${esc(story)}</div>`,
        options: shuffle([a, ...wrong]).map(o => ({ html: esc(o), value: o })), answer: a,
        explain: `The story says: ${story}`,
      };
    },
  },
];
