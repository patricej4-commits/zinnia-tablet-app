// Rules and definitions, in the teacher's words where we have them (class slides / revision guide).
// Shown as a 📌 reminder on questions, and asked directly ("What is a noun?").
import { pick, shuffle, sample } from '../util.js';

export const RULES = {
  noun: { word: 'noun', short: 'a naming word', def: 'A noun is the name of a person, animal, place or thing.', eg: 'girl, dog, school, ball' },
  common: { word: 'common noun', short: 'any person, animal, place or thing', def: 'A common noun is the name of any person, animal, place or thing. It starts with a small letter.', eg: 'girl, dog, city' },
  proper: { word: 'proper noun', short: 'a special name', def: 'A proper noun is the special name of a person, animal, place or thing. It starts with a capital letter.', eg: 'Zinnia, Spot, Jamaica' },
  verb: { word: 'verb', short: 'an action word', def: 'A verb is an action word or doing word.', eg: 'run, jump, eat, sing' },
  adjective: { word: 'adjective', short: 'a describing word', def: 'An adjective is a describing word. It tells us more about a noun or a pronoun.', eg: 'big, red, happy, soft' },
  pronoun: { word: 'pronoun', short: 'a word that takes the place of a noun', def: 'A pronoun is a word that takes the place of a noun.', eg: 'I, you, he, she, it, we, they' },
  article: { word: 'article', short: 'a, an or the', def: 'A, an and the are articles. Use an before a vowel sound: an apple. Use a before other sounds: a ball.', eg: 'a cat, an egg, the sun' },
  singular: { word: 'singular', short: 'one', def: 'Singular means one. Plural means more than one. Add s or es to make more than one.', eg: 'cat → cats, box → boxes' },
  compound: { word: 'compound word', short: 'two small words joined together', def: 'A compound word is two small words joined together to make one new word.', eg: 'sun + flower = sunflower' },
  sentence: { word: 'sentence', short: 'a complete thought', def: 'A sentence tells a complete thought. It starts with a capital letter and ends with a period, a question mark or an exclamation mark.', eg: 'The dog can run.' },
  possessive: { word: 'possessive noun', short: "a noun with 's", def: "Add 's to a noun to show that something belongs to it.", eg: "Tom's hat, the dog's bone" },
  helping: { word: 'helping verb', short: 'a verb that helps another verb', def: 'A helping verb helps the main verb. Has, have, had, do, does, am, is, are, was and were can be helping verbs.', eg: 'She is singing. I have eaten.' },
  amisare: { word: 'am, is, are', short: '', def: 'Use am with I. Use is for one person or thing. Use are with you, we, they, or more than one.', eg: 'I am. He is. They are.' },
  waswere: { word: 'was, were', short: '', def: 'Use was for one person or thing. Use were with you, or for more than one.', eg: 'I was. They were.' },
  opposite: { word: 'opposites', short: '', def: 'Opposites are words that mean something totally different.', eg: 'hot and cold, big and small' },
  abc: { word: 'ABC order', short: '', def: 'For ABC order, look at the first letter of each word. The letter that comes first in the alphabet goes first.', eg: 'ant, bat, cat' },
  endmark: { word: 'end marks', short: '', def: 'A telling sentence ends with a period. An asking sentence ends with a question mark. A sentence with strong feeling ends with an exclamation mark.', eg: '. ? !' },
  vowels: { word: 'vowels', short: '', def: 'The vowels are a, e, i, o and u. All the other letters are consonants.', eg: 'a e i o u' },
  // ---- Maths steps
  add: { word: 'adding', say: 'Remember: start with the bigger number, then count on.', def: 'Adding: 1. Put the bigger number in your head. 2. Count on the smaller number. 3. The last number you say is the answer.', eg: '5 + 3: 5... 6, 7, 8' },
  colAdd: { word: 'adding in columns', say: 'Remember the steps: start with the ones. Then the tens. Write the answer under the line.', def: 'Adding in columns: 1. Start with the ones. Add the ones. 2. Then add the tens. 3. Write the answer under the line.', eg: '' },
  sub: { word: 'take away', say: 'Remember: start with the big number, take away the small number, then count what is left.', def: 'Take away: 1. Start with the big number. 2. Take away (cross out) the small number. 3. Count what is left.', eg: '8 − 3: cross out 3, count 5' },
  colSub: { word: 'take away in columns', say: 'Remember the steps: big number on top. Start with the ones. Then the tens. Write the answer under the line.', def: 'Take away in columns: 1. The big number goes on top. 2. Start with the ones: take away the ones. 3. Then the tens. 4. Write the answer under the line. 5. Check: add your answer and the bottom number. You get the top number!', eg: '' },
  nline: { word: 'number line', def: 'On the number line, adding hops to the right (numbers get bigger). Take away hops to the left (numbers get smaller).', eg: '' },
};
export const PARTS_MIX = 'Noun = naming word. Verb = action word. Adjective = describing word. Pronoun = takes the place of a noun.';

// Which reminder goes with which topic
export const RULE_FOR = {
  'g-noun': 'noun', 'g-proper': 'proper', 'g-plural': 'singular', 'g-article': 'article', 'g-pronoun': 'pronoun', 'g-amisare': 'amisare',
  'g-waswere': 'waswere', 'g-verb': 'verb', 'g-adjective': 'adjective', 'g-compound': 'compound', 'g-sentence': 'sentence', 'g-capital': 'sentence',
  'g-endmark': 'endmark', 'g-possessive': 'possessive', 'g-helping': 'helping', 'g-abc': 'abc', 'g-opposites': 'opposite', 'p-vowels': 'vowels',
  'g-parts': 'mix', 'g-find': 'mix', 'g-use': 'mix', 'g-build': 'sentence',
  'm-add': 'add', 'm-sub': 'sub', 'm-nl-hop': 'nline', 'm-story': 'mathsStory',
};
export function reminderFor(skillId, q) {
  let k = RULE_FOR[skillId];
  if (!k) return null;
  const col = /class="vert"/.test(q.visual || '');
  if (k === 'add' && col) k = 'colAdd';
  if (k === 'sub' && col) k = 'colSub';
  if (k === 'mathsStory') k = /take away|left|ate|gave|lost|fewer|less/i.test(q.say || '') ? 'sub' : 'add';
  if (k === 'mix') return { key: 'mix', text: PARTS_MIX, say: 'Remember: ' + PARTS_MIX };
  const r = RULES[k];
  return r ? { key: k, text: r.def + (r.eg ? ` (${r.eg})` : ''), say: r.say || 'Remember: ' + r.def, maths: ['add', 'colAdd', 'sub', 'colSub', 'nline'].includes(k) } : null;
}

// ---- "What is a ...?" questions
const DEF_KEYS = ['noun', 'verb', 'adjective', 'pronoun', 'proper', 'common', 'compound', 'sentence', 'article', 'singular', 'possessive', 'helping'];
const CORE = ['noun', 'verb', 'adjective', 'pronoun'];
const EXAMPLES = {
  noun: ['girl', 'dog', 'school', 'ball', 'teacher', 'mango', 'church', 'bird', 'chair', 'beach'],
  verb: ['run', 'jump', 'eat', 'sing', 'swim', 'read', 'write', 'clap', 'sleep', 'pray'],
  adjective: ['big', 'red', 'happy', 'soft', 'tall', 'hot', 'little', 'kind', 'sweet', 'shiny'],
  pronoun: ['he', 'she', 'it', 'they', 'we', 'I', 'you', 'him', 'her', 'them'],
};
// What each word means, WITHOUT saying the word (so the answer is not given away)
const DESC = {
  noun: 'The name of a person, animal, place or thing', common: 'The name of ANY person, animal, place or thing (small letter)',
  proper: 'The SPECIAL name of a person, animal, place or thing (capital letter)', verb: 'An action word or doing word',
  adjective: 'A describing word that tells more about a noun', pronoun: 'A word that takes the place of a noun',
  article: 'The little words a, an and the', singular: 'Just one of something', compound: 'Two small words joined to make one new word',
  sentence: 'A complete thought with a capital letter and an end mark', possessive: "A noun with 's to show something belongs to it",
  helping: 'A verb that helps the main verb',
};
const clashKeys = (a, b) => (a === 'noun' && ['common', 'proper'].includes(b)) || (b === 'noun' && ['common', 'proper'].includes(a));
export const grammarRuleSkills = [
  {
    id: 'g-whatis', name: 'What is a…?', emoji: '📌',
    gen(l) {
      const keys = l === 1 ? CORE : DEF_KEYS;
      const k = pick(l === 3 ? keys : keys.concat(CORE)); // the big four come up most
      const r = RULES[k];
      const others = sample(keys.filter(x => x !== k && !clashKeys(k, x)), l === 1 ? 2 : 3);
      const mode = l === 1 ? pick([0, 1, 2]) : pick([0, 1, 2, 2]);
      if (mode === 0) return {
        // What is a noun? -> pick what it means
        say: `What is a ${r.word}?`, text: `What is a ${r.word}?`, readFirst: l > 1,
        options: shuffle([k, ...others]).map(x => ({ html: `<span class="lbl" style="font-size:22px">${DESC[x]}</span>`, value: x, say: DESC[x] })),
        cols: 'two', answer: k,
        explain: `${r.def} For example: ${r.eg}.`,
      };
      if (mode === 1) return {
        // "An action word or doing word" -> what is it called?
        say: `${DESC[k]}. What is it called?`, text: `"${DESC[k]}." What is it called?`,
        options: shuffle([k, ...others]).map(x => ({ html: `<span class="lbl">${RULES[x].word}</span>`, value: x, say: RULES[x].word })), answer: k,
        explain: `${r.def} For example: ${r.eg}.`,
      };
      // Know it AND find it: "A verb is an action word. Which word is a verb?"
      const kk = pick(CORE), rr = RULES[kk];
      const right = pick(EXAMPLES[kk]);
      const wrong = sample(CORE.filter(x => x !== kk), l === 1 ? 2 : 3).map(x => pick(EXAMPLES[x]));
      return {
        say: `Remember: ${rr.def.split('. ')[0].replace(/\.$/, '')}. Which word is a ${rr.word}?`, text: `Which word is a ${rr.word}? (${rr.short})`,
        options: shuffle([right, ...wrong]).map(x => ({ html: `<span class="lbl" style="font-size:34px">${x}</span>`, value: x, say: x })), answer: right,
        explain: `${right} is a ${rr.word}. ${rr.def}`,
      };
    },
  },
];

// ---- Maths steps questions
const STEP_QS = [
  ['When we take away in columns, which number goes on top?', 'The bigger number', ['The smaller number', 'Any number']],
  ['When we add or take away in columns, where do we start?', 'With the ones', ['With the tens', 'With the answer']],
  ['We finished the ones. What do we do next?', 'Do the tens', ['Stop', 'Start again']],
  ['Where do we write the answer?', 'Under the line', ['On top', 'Next to the sign']],
  ['How can we check a take away answer?', 'Add the answer and the bottom number', ['Take away again', 'Guess']],
  ['When we add by counting on, which number do we start with?', 'The bigger number', ['The smaller number', 'Zero']],
  ['When we take away, do we get more or less?', 'Less', ['More', 'The same']],
  ['When we add, do we get more or less?', 'More', ['Less', 'The same']],
  ['What does the + sign mean?', 'Add (plus)', ['Take away (minus)', 'Equals']],
  ['What does the − sign mean?', 'Take away (minus)', ['Add (plus)', 'Equals']],
  ['What does the = sign mean?', 'Equals (the same as)', ['Add', 'Take away']],
  ['On a number line, which way do we hop to add?', 'To the right', ['To the left', 'Up']],
  ['On a number line, which way do we hop to take away?', 'To the left', ['To the right', 'Down']],
  ['In 15, which digit is in the ones place?', '5', ['1', '15']],
  ['In 17, which digit is in the tens place?', '1', ['7', '17']],
  ['To take away 3 from 8 with counters, what do we do?', 'Cross out 3 and count what is left', ['Add 3 more', 'Count all 8']],
];
const ORDER_STEPS = [
  { name: 'take away in columns', steps: ['Big number on top', 'Take away the ones', 'Take away the tens', 'Write the answer'] },
  { name: 'adding in columns', steps: ['Add the ones', 'Add the tens', 'Write the answer'] },
  { name: 'take away with counters', steps: ['Show the big number', 'Cross out the small number', 'Count what is left'] },
  { name: 'adding by counting on', steps: ['Start with the big number', 'Count on the small number', 'Say the answer'] },
];
export const mathStepSkills = [
  {
    id: 'm-steps', name: 'Steps for adding & take away', emoji: '🪜',
    gen(l) {
      if (l > 1 && Math.random() < 0.4) {
        const o = pick(ORDER_STEPS.filter(x => l === 3 || x.steps.length <= 3));
        return {
          type: 'order', say: `Put the steps for ${o.name} in the right order.`, items: shuffle(o.steps), answer: o.steps,
          explain: `The steps for ${o.name}: ${o.steps.map((s, i) => `${i + 1}. ${s}`).join('. ')}.`,
        };
      }
      const [qq, a, wrong] = pick(STEP_QS);
      return {
        say: qq, readFirst: l === 3,
        options: shuffle([a, ...wrong]).map(x => ({ html: `<span class="lbl" style="font-size:24px">${x}</span>`, value: x, say: x })), answer: a,
        explain: `${a}. ${/column|ones|tens|line|top|check/i.test(qq) ? RULES.colSub.def : /add|\+/i.test(qq) ? RULES.add.def : RULES.sub.def}`,
      };
    },
  },
];
