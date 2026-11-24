// Listening Lagoon: listening, focus and following instructions.
import { pick, shuffle, sample, rnd, numOptions, NUM_WORDS } from '../util.js';
import { SHAPE_NAMES, COLOURS } from '../visuals.js';
import { FIND_PICS, picOf } from './pictures.js';

const pic = w => ({ html: `<span class="pic">${picOf(w)}</span>`, value: w, say: w });
// Action words sound odd in "Find the ___" (they are used in other games)
const ACTIONS = ['swim', 'run', 'sleep', 'eat', 'jump', 'sing', 'read', 'cry', 'dance', 'cook', 'write', 'ride', 'wave', 'skate', 'drink', 'clap', 'sweep', 'wash', 'walk', 'talk', 'smile'];
const HEAR_PICS = FIND_PICS.filter(w => !ACTIONS.includes(w));
// First-sound words: short, with a clear picture, and starting with a plain letter sound
// (no sh/ch/th/wh, no "ow" as in owl, no long vowels like ice). Octopus gives a good short o.
const FIRST_SOUND = [...HEAR_PICS.filter(w => w.length <= 5 && !/^(sh|ch|th|wh|ph|kn|wr|qu)/.test(w) && !['owl', 'ice', 'orange', 'eye', 'ear'].includes(w)), 'octopus'];

// Mini stories to listen to (set in Jamaica, using class words)
const STORIES = [
  { s: 'Zinnia went to the beach with Grandma. She found a pink shell in the sand. She put the shell in her red bag.',
    qs: [['What did Zinnia find?', ['shell', 'fish', 'hat'], 'shell'], ['Who went to the beach with Zinnia?', ['Grandma', 'Daddy', 'Teacher'], 'Grandma'], ['What colour was her bag?', ['red', 'blue', 'green'], 'red']] },
  { s: 'Kai has a little brown dog called Spot. Every morning Spot barks at the postman. Then Spot eats his bone.',
    qs: [['What is the dog called?', ['Spot', 'Rex', 'Max'], 'Spot'], ['What colour is the dog?', ['brown', 'black', 'white'], 'brown'], ['What does Spot eat?', ['a bone', 'a cake', 'a mango'], 'a bone']] },
  { s: 'Maya climbed the mango tree in the yard. She picked three big mangoes. She shared them with her two friends.',
    qs: [['What tree did Maya climb?', ['mango tree', 'apple tree', 'coconut tree'], 'mango tree'], ['How many mangoes did she pick?', ['three', 'five', 'one'], 'three'], ['What did she do with the mangoes?', ['shared them', 'threw them', 'hid them'], 'shared them']] },
  { s: 'It was raining, so Leo put on his yellow raincoat and his boots. He jumped in a big puddle. Splash!',
    qs: [['What was the weather like?', ['rainy', 'sunny', 'windy'], 'rainy'], ['What colour was the raincoat?', ['yellow', 'red', 'purple'], 'yellow'], ['What did Leo jump in?', ['a puddle', 'a pool', 'the sea'], 'a puddle']] },
  { s: 'At school, Ava painted a picture of a green turtle. Her teacher said, well done! Ava put the picture on the wall.',
    qs: [['What did Ava paint?', ['a turtle', 'a cat', 'a house'], 'a turtle'], ['What colour was the turtle?', ['green', 'blue', 'orange'], 'green'], ['Where did Ava put the picture?', ['on the wall', 'in her bag', 'on the floor'], 'on the wall']] },
  { s: 'Daddy made breakfast. He made eggs and toast, and a cup of cocoa tea. Breakfast gives us energy for the day!',
    qs: [['Who made breakfast?', ['Daddy', 'Mummy', 'Grandma'], 'Daddy'], ['What drink did he make?', ['cocoa tea', 'juice', 'milk'], 'cocoa tea'], ['What does breakfast give us?', ['energy', 'sleep', 'toys'], 'energy']] },
  { s: 'A little bird sat on a branch. It sang a happy song. Then a cat came, and the bird flew up into the sky.',
    qs: [['Where did the bird sit?', ['on a branch', 'on a car', 'on a hat'], 'on a branch'], ['What animal came along?', ['a cat', 'a dog', 'a cow'], 'a cat'], ['Where did the bird fly?', ['into the sky', 'into the sea', 'into a box'], 'into the sky']] },
  { s: 'On Sunday, Zinnia and Mummy baked a cake. They put six candles on top. It was for Grandpa\'s birthday!',
    qs: [['What did they bake?', ['a cake', 'bread', 'cookies'], 'a cake'], ['How many candles did they put on the cake?', ['six', 'two', 'ten'], 'six'], ['Whose birthday was it?', ["Grandpa's", "Mummy's", "Kai's"], "Grandpa's"]] },
];

// [word, rhymes, non-rhymes] — every word here has a picture
const RHYMES = [['cat', ['hat', 'bat'], ['dog', 'sun', 'pig']], ['dog', ['frog'], ['cat', 'bus', 'sun']], ['star', ['car'], ['fish', 'cup', 'hen']],
  ['cake', ['snake'], ['dog', 'fish', 'sun']], ['goat', ['boat'], ['fish', 'cup', 'star']], ['bee', ['tree'], ['cat', 'bus', 'pig']],
  ['house', ['mouse'], ['tree', 'dog', 'cup']], ['clock', ['sock', 'lock'], ['bed', 'sun', 'egg']], ['bear', ['chair'], ['cat', 'ball', 'moon']],
  ['box', ['fox'], ['bed', 'hat', 'sun']], ['hen', ['pen', 'ten'], ['cat', 'bus', 'pig']], ['bell', ['shell'], ['car', 'dog', 'cake']],
  ['king', ['ring'], ['boat', 'cup', 'bed']], ['moon', ['spoon'], ['hat', 'pig', 'car']], ['bed', ['bread'], ['cat', 'dog', 'sun']]]
  .map(([w, r, n]) => [w, r.filter(x => picOf(x)), n.filter(x => picOf(x))]).filter(([, r, n]) => r.length && n.length >= 2);

export const listenSkills = [
  {
    id: 'l-follow', name: 'Follow Ollie', emoji: '👂', type: 'follow',
    gen(l) {
      const colours = sample(['red', 'blue', 'yellow', 'green', 'purple', 'orange'], 4);
      const shapes = sample(SHAPE_NAMES, 4);
      // 8 cells: each colour/shape mix, unique combos
      const combos = new Set();
      const cells = [];
      while (cells.length < 8) {
        const c = { shape: pick(shapes), colour: pick(colours) };
        const k = c.shape + c.colour;
        if (!combos.has(k)) { combos.add(k); cells.push(c); }
      }
      const targets = sample(cells, l);
      const words = targets.map(t => `the ${t.colour} ${t.shape}`);
      const sayIt = 'Tap ' + (words.length === 1 ? words[0] : words.slice(0, -1).join(', then ') + ', and then ' + words[words.length - 1]) + '.';
      return { type: 'follow', listenOnly: true, maxReplays: l === 3 ? 1 : 2, say: sayIt, cells, targets,
        explain: `Ollie said: ${sayIt}` };
    },
  },
  {
    id: 'l-word', name: 'Hear & find', emoji: '🔊',
    gen() {
      const words = sample(HEAR_PICS, 4);
      const w = words[0];
      return { listenOnly: true, say: `Tap the picture of the ${w}.`, options: shuffle(words).map(pic), answer: w, explain: `The word was ${w}. Here is the picture of ${w}.` };
    },
  },
  {
    id: 'l-first-sound', name: 'First sound', emoji: '🅰️',
    gen() {
      const w = pick(FIRST_SOUND);
      const first = w[0];
      const letters = new Set([first]);
      // c and k make the same sound, so they are never both offered.
      const pool = 'abcdefghijklmnoprstw'.split('').filter(c => !(first === 'c' && c === 'k') && !(first === 'k' && c === 'c'));
      while (letters.size < 3) letters.add(pick(pool));
      return { listenOnly: true, say: `Look at the picture. ${w}. What sound does ${w} start with? Tap the letter.`, visual: `<div style="font-size:110px">${picOf(w)}</div>`,
        options: shuffle([...letters]).map(c => ({ html: c, value: c, say: c })), answer: first,
        explain: `${w} starts with ${first}.` };
    },
  },
  {
    id: 'l-rhyme', name: 'Rhyme time', emoji: '🎶',
    gen() {
      const [w, rh, not] = pick(RHYMES);
      const good = pick(rh);
      const opts = [good, ...sample(not, 2)];
      return { listenOnly: true, say: `Listen: ${w}. Tap the picture that rhymes with ${w}.`, options: shuffle(opts).map(pic), answer: good,
        explain: `${w} and ${good} rhyme. They end with the same sound!` };
    },
  },
  {
    id: 'l-story', name: 'Story ears', emoji: '📻',
    gen(l) {
      const st = pick(STORIES);
      const [q, opts, ans] = pick(st.qs);
      return { listenOnly: true, maxReplays: l === 3 ? 1 : 2, say: `Listen to the story. ${st.s} ... ${q} Tap the answer.`,
        options: shuffle(opts).map(o => ({ html: o, value: o, say: o })), answer: ans,
        explain: `The story said: ${st.s}` };
    },
  },
  {
    id: 'l-count-sounds', name: 'Count the words', emoji: '🥁',
    gen(l) {
      const word = pick(['boing', 'pop', 'beep', 'quack', 'moo', 'ding']);
      const other = pick(['splash', 'zoom', 'tick']);
      const n = rnd(2, l === 1 ? 4 : 6);
      const seq = shuffle([...Array(n).fill(word), ...Array(l === 1 ? 0 : rnd(1, 3)).fill(other)]);
      // Each sound is its own short sentence so the voice pauses between them
      return { listenOnly: true, maxReplays: 1, say: `Listen and count! ... ${seq.map(x => `${x}!`).join(' ... ')} ... How many times did I say ${word}? Tap the number.`,
        options: numOptions(n, 1, 9).map(o => ({ html: o.html, value: o.value })), answer: n,
        explain: `I said ${word} ${NUM_WORDS[n]} times.` };
    },
  },
];
