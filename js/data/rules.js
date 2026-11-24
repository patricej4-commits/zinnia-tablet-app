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
  // ---- Phonics & spelling principles
  special: { word: 'special sounds', def: 'Special sounds are letters that work together to make one sound, like s h in ship and c k in duck.', eg: '' },
  onetwo: { word: 'one and two vowels', def: 'One vowel in a word? It says its short sound (cat). Two vowels? The first vowel says its name and the second is silent (cake).', eg: '' },
  ck: { word: 'c, k, ck, ke', def: 'K comes before i and e; c comes before a, o and u. At the end: a short vowel gets c k (back); a long vowel gets k and a silent e (bake).', eg: '' },
  floss: { word: 'double endings', def: 'L, f, s (and z) often walk together at the end of a short-vowel word: bell, cuff, kiss, buzz.', eg: '' },
  blend: { word: 'blends', def: 'Blend the consonant and the vowel together first (b-a, ba), then add the ending (bat).', eg: '' },
  soundout: { word: 'spelling', def: 'To spell, say the word slowly. Listen for every sound, and write a letter or special sound for each one.', eg: '' },
  rhyme: { word: 'rhyming', def: 'Words rhyme when they end with the same vowel and consonant sound.', eg: 'cluck, duck; peep, deep' },
  sight: { word: 'sight words', def: 'Sight words are words we learn by heart, because we cannot always sound them out.', eg: 'the, said, come' },
  // ---- Reading
  findans: { word: 'answering questions', def: 'To answer a question, look back in the story. Who asks for a person. Where asks for a place. When asks for a time. Why asks for a reason.', eg: '' },
  makesense: { word: 'finishing a sentence', def: 'Read the whole sentence with each word. Pick the word that makes sense and matches the picture.', eg: '' },
  // ---- More maths principles
  bond: { word: 'number bonds', def: 'A number bond shows two parts that make a whole. Part plus part equals the whole. The whole take away one part leaves the other part.', eg: '3 + 4 = 7' },
  tens: { word: 'tens and ones', def: 'A teen number is 1 ten and some ones: 14 is 1 ten and 4 ones. The digit on the left shows the tens; the digit on the right shows the ones.', eg: '' },
  compare: { word: 'more and less', def: 'Greater than means bigger. Less than means smaller. The open mouth of > or < always faces the bigger number. = means the same as.', eg: '7 > 3' },
  clock: { word: 'telling time', def: 'The short hand tells the hour. The long hand tells the minutes. When the long hand points to 12, it is o\'clock.', eg: '' },
  counting: { word: 'counting', def: 'Touch and count each thing one time only. The last number you say tells how many there are.', eg: '' },
  order: { word: 'ordinal numbers', def: 'Ordinal numbers tell the order or position: first, second, third, fourth, fifth.', eg: '1st, 2nd, 3rd' },
  pattern: { word: 'patterns', def: 'A pattern repeats, or grows by the same amount each time. Find the part that repeats, then continue it.', eg: '2, 4, 6, 8' },
  verse: { word: 'Bible verses', def: 'The Bible is God\'s Word, and it is true. We learn verses by heart so we can remember what God says.', eg: '' },
  // ---- HOW TO: steps for every kind of question
  spellSteps: { word: 'spelling', say: 'Remember the spelling steps: say it slowly, listen for each sound, write a letter for each sound, think of the rule, then read it back.',
    def: 'How to spell a word: 1. Say the word. 2. Say it slowly and listen for each sound. 3. Write a letter or special sound for each sound. 4. Think of the rule (short vowel? two vowels? ck or ke?). 5. Read it back to check.', eg: '' },
  readSteps: { word: 'reading a new word', say: 'Remember the reading steps: find the vowel, look for special sounds, say each sound, then blend them together.',
    def: 'How to read a new word: 1. Find the vowel. 2. Look for special sounds (sh, ck, oo...). 3. Say each sound. 4. Blend the sounds together. 5. Read the whole word. Does it make sense?', eg: '' },
  answerSteps: { word: 'answering a story question', say: 'Remember the steps: read the question, is it who, what, where, when or why? Then look back in the story.',
    def: 'How to answer a story question: 1. Read the story. 2. Read the question. 3. Is it who (a person), where (a place), when (a time) or why (a reason)? 4. Look back in the story to find it. 5. Choose the answer.', eg: '' },
  partSteps: { word: 'finding the word type', say: 'Ask about each word: does it name something? Is it an action? Does it describe? Does it take the place of a noun?',
    def: 'How to find the word type: 1. Read the sentence. 2. For each word ask: Does it name a person, animal, place or thing? (noun) Is it an action? (verb) Does it describe? (adjective) Does it take the place of a noun? (pronoun)', eg: '' },
  storySteps: { word: 'word problems', say: 'Remember the steps for a word problem: find the numbers, then decide: add or take away?',
    def: 'How to solve a word problem: 1. Listen or read carefully. 2. Find the numbers. 3. More, altogether, in all → add. Left, ate, gave away, how many fewer → take away. 4. Work it out. 5. Check: does the answer make sense?', eg: '' },
  clockSteps: { word: 'telling the time', say: 'Remember: the short hand shows the hour, the long hand shows the minutes.',
    def: 'How to tell the time: 1. Look at the short hand: it shows the hour. 2. Look at the long hand: on 12 means o\'clock, on 6 means half past. 3. Say the hour, then the minutes.', eg: '' },
  nlineSteps: { word: 'the number line', say: 'Remember: find the start number. Adding hops right. Take away hops left. Count each hop.',
    def: 'How to use a number line: 1. Find the start number. 2. Adding: hop to the right. Take away: hop to the left. 3. Count each hop. 4. Where you land is the answer.', eg: '' },
  sentSteps: { word: 'writing a sentence', say: 'Remember: capital letter at the start, capitals for names, spaces between words, and an end mark.',
    def: 'How to write a sentence correctly: 1. Start with a capital letter. 2. Use capital letters for names, God and I. 3. Leave spaces between words. 4. End with a period, a question mark or an exclamation mark.', eg: '' },
  rhymeSteps: { word: 'rhyming', say: 'Remember: say both words and listen to the ending. Same ending? They rhyme!',
    def: 'How to find rhymes: 1. Say both words. 2. Listen to the end: the vowel and the last sound. 3. Same ending? They rhyme! (cluck, duck)', eg: '' },
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
  'g-waswere': 'waswere', 'g-verb': 'verb', 'g-adjective': 'adjective', 'g-compound': 'compound', 'g-sentence': 'sentence', 'g-capital': 'sentSteps',
  'g-endmark': 'endmark', 'g-possessive': 'possessive', 'g-helping': 'helping', 'g-abc': 'abc', 'g-opposites': 'opposite', 'p-vowels': 'vowels',
  'g-parts': 'partSteps', 'g-find': 'partSteps', 'g-use': 'mix', 'g-build': 'sentence',
  'm-add': 'add', 'm-sub': 'sub', 'm-nl-hop': 'nlineSteps', 'm-story': 'mathsStory',
  'p-sounds': 'special', 'p-keyword': 'special', 'p-onetwo': 'onetwo', 'p-mark': 'onetwo', 'p-ck': 'ck', 'p-floss': 'floss', 'p-blend': 'blend',
  'p-spell': 'spellSteps', 'p-missing': 'spellSteps', 'p-rightspell': 'spellSteps', 's-unscramble': 'spellSteps', 's-clue': 'spellSteps', 'p-rhyme': 'rhymeSteps', 's-rhyme': 'rhymeSteps', 'l-rhyme': 'rhymeSteps',
  's-sight': 'sight', 'r-sight': 'sight', 'r-story': 'answerSteps', 'l-story': 'answerSteps', 'r-word': 'readSteps', 'r-picword': 'readSteps', 'r-match': 'readSteps', 'r-tells': 'readSteps', 'r-finish': 'makesense', 'r-wordbank': 'makesense', 's-sentence': 'makesense',
  'm-bond': 'bond', 'm-tens': 'tens', 'm-compare': 'compare', 'm-symbols': 'compare', 'm-nl-compare': 'compare', 'm-time': 'clockSteps', 'm-digital': 'clock',
  'm-count': 'counting', 'm-oneone': 'counting', 'm-ordinal': 'order', 'm-skip': 'pattern', 'm-pattern': 'pattern',
  'm-nl-read': 'nline', 'm-nl-tap': 'nlineSteps', 'm-nl-build': 'nline', 'b-verse': 'verse', 'b-letter': 'verse',
};
export function reminderFor(skillId, q) {
  // Spelling list words: the rule of that list
  if (q.rule) return { key: 'list:' + q.rule.slice(0, 20), text: RULES.spellSteps.def + ' Rule for this list: ' + q.rule, say: 'Remember the rule: ' + q.rule };
  let k = RULE_FOR[skillId];
  if (!k) return null;
  const col = /class="vert"/.test(q.visual || '');
  if (k === 'add' && col) k = 'colAdd';
  if (k === 'sub' && col) k = 'colSub';
  if (k === 'mathsStory') k = 'storySteps';
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
// "Why" questions about the grammar rules
const GRAMMAR_WHY = [
  ['Why does Jamaica start with a capital letter?', 'It is a special name (a proper noun)', ['It is an action word', 'It is a small word']],
  ['Why does a sentence start with a capital letter?', 'To show where a new sentence begins', ['To make it long', 'Because it is a verb']],
  ['Why do we put a period at the end of a sentence?', 'To show the sentence is finished', ['To start the sentence', 'To make a question']],
  ['Why do we say "an apple" and not "a apple"?', 'Apple starts with a vowel sound', ['Apple is red', 'Apple is a verb']],
  ['Why do we say "cats" when there are three cats?', 'S means more than one', ['S means one', 'S is a verb']],
  ['Why is "run" a verb?', 'It is an action word, something we do', ['It is a name', 'It describes a noun']],
  ['Why is "dog" a noun?', 'It names an animal', ['It is an action', 'It describes something']],
  ['Why is "red" an adjective?', 'It describes a noun', ['It names a place', 'It is an action']],
  ['Why do we use "she" instead of saying "Maya" again?', 'A pronoun takes the place of a noun', ['She is a verb', 'Maya is wrong']],
  ['Why do we write "Tom\'s hat"?', "The 's shows the hat belongs to Tom", ['There are many Toms', 'Tom is an action']],
  ['Why does a question end with a question mark?', 'It is an asking sentence', ['It is a telling sentence', 'It is a name']],
  ['Why do we say "they are" and not "they is"?', 'Are is for more than one', ['Is is for more than one', 'They is a name']],
];
const clashKeys = (a, b) => (a === 'noun' && ['common', 'proper'].includes(b)) || (b === 'noun' && ['common', 'proper'].includes(a));
export const grammarRuleSkills = [
  {
    id: 'g-whatis', name: 'What is a…?', emoji: '📌',
    gen(l) {
      const keys = l === 1 ? CORE : DEF_KEYS;
      const k = pick(l === 3 ? keys : keys.concat(CORE)); // the big four come up most
      const r = RULES[k];
      const others = sample(keys.filter(x => x !== k && !clashKeys(k, x)), l === 1 ? 2 : 3);
      const mode = l === 1 ? pick([0, 1, 2]) : pick([0, 1, 2, 2, 3]);
      if (mode === 3) {
        const [wq, wa, ww] = pick(GRAMMAR_WHY);
        return {
          say: wq, readFirst: l === 3,
          options: shuffle([wa, ...ww]).map(x => ({ html: `<span class="lbl" style="font-size:24px">${x}</span>`, value: x, say: x })), answer: wa,
          explain: `${wa}.`,
        };
      }
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
  ['Why does the bigger number go on top when we take away?', 'We cannot take away more than we have', ['It looks nicer', 'The teacher likes it']],
  ['Why do we line up the ones under the ones and the tens under the tens?', 'So we add and take away the right places', ['So it looks long', 'So we can skip the ones']],
  ['Why do we start counting on from the bigger number?', 'It is faster: fewer numbers to count', ['It is slower', 'Because it is the answer']],
  ['Why does adding give us more?', 'We are putting more things together', ['We are taking things away', 'Nothing changes']],
  ['Why does take away give us less?', 'Some things are taken away', ['We are adding more', 'Nothing changes']],
  ['In a number bond, the whole is 9 and one part is 4. Why is the other part 5?', 'Because 4 and 5 make 9', ['Because 9 and 4 make 5', 'Because 5 is bigger']],
  ['Why is 14 the same as 1 ten and 4 ones?', 'The 1 is in the tens place and the 4 is in the ones place', ['Because 1 and 4 make 5', 'Because 14 is small']],
  ['Why do we touch each thing when we count?', 'So we count each thing only one time', ['So it gets dirty', 'So we can skip some']],
];
const ORDER_STEPS = [
  { name: 'take away in columns', steps: ['Big number on top', 'Take away the ones', 'Take away the tens', 'Write the answer'] },
  { name: 'adding in columns', steps: ['Add the ones', 'Add the tens', 'Write the answer'] },
  { name: 'take away with counters', steps: ['Show the big number', 'Cross out the small number', 'Count what is left'] },
  { name: 'adding by counting on', steps: ['Start with the big number', 'Count on the small number', 'Say the answer'] },
  { name: 'a word problem', steps: ['Listen carefully', 'Find the numbers', 'Add or take away?', 'Check the answer'] },
  { name: 'telling the time', steps: ['Look at the short hand', 'Look at the long hand', 'Say the time'] },
  { name: 'using a number line', steps: ['Find the start number', 'Hop the right way', 'Count each hop', 'Read where you land'] },
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

// ---- Sound Safari: "Why is it spelled that way?" (the reason behind the phonics rules)
const WHY_SPELL = [
  [['back', 'duck', 'sock', 'kick', 'neck', 'truck', 'clock', 'snack'], w => `Why does "${w}" end with c k?`, 'The vowel is short', ['The vowel is long', 'It starts with c']],
  [['bake', 'cake', 'like', 'snake', 'joke', 'hike', 'smoke', 'rake'], w => `Why does "${w}" end with k e?`, 'The vowel is long', ['The vowel is short', 'It has no vowel']],
  [['kite', 'kid', 'keep', 'king', 'kiss', 'kick'], w => `Why does "${w}" start with k?`, 'K comes before i and e', ['K comes before a, o and u', 'K is a vowel']],
  [['cat', 'cup', 'cot', 'cub', 'cone', 'cake', 'cut'], w => `Why does "${w}" start with c?`, 'C comes before a, o and u', ['C comes before i and e', 'C is a vowel']],
  [['bell', 'doll', 'hill', 'cuff', 'puff', 'kiss', 'mess', 'buzz', 'well', 'stuff'], w => `Why does "${w}" end with two of the same letter?`, 'It is a short-vowel word ending in l, f, s or z', ['It is a long-vowel word', 'It has two vowels']],
  [['cake', 'goat', 'kite', 'boat', 'bean', 'game', 'ride', 'rain', 'feet'], w => `Why does the first vowel in "${w}" say its name?`, 'There are two vowels; the second one is silent', ['There is only one vowel', 'It ends with ck']],
  [['cat', 'pig', 'sun', 'bed', 'hop', 'net', 'cub', 'fish'], w => `Why does "${w}" have a short vowel sound?`, 'It has only one vowel', ['It has two vowels', 'It ends with e']],
  [['go', 'no', 'so', 'me', 'he', 'be', 'my', 'cry', 'fly'], w => `Why does the last letter in "${w}" say its long sound?`, 'It is the only vowel, at the end of the word', ['There are two vowels', 'It ends with ck']],
  [['ship', 'shell', 'fish', 'this', 'thin', 'chair', 'night', 'moon'], w => `In "${w}", why do we write two (or three) letters for one sound?`, 'They are a special sound: letters that work together', ['We spelled it wrong', 'Every sound needs two letters']],
];
export const phonicsWhySkills = [
  {
    id: 'p-why', name: 'Why is it spelled that way?', emoji: '🤔',
    gen(l) {
      const [words, ask, right, wrong] = pick(l === 1 ? WHY_SPELL.slice(0, 5) : WHY_SPELL);
      const w = pick(words);
      return {
        say: ask(w), text: ask(w), visual: `<div class="word-big">${w}</div>`,
        options: shuffle([right, ...(l === 1 ? wrong.slice(0, 1) : wrong)]).map(x => ({ html: `<span class="lbl" style="font-size:24px">${x}</span>`, value: x, say: x })),
        cols: 'two', answer: right,
        explain: `${right}. That is why ${w} is spelled ${w.split('').join(' ')}.`,
      };
    },
  },
];

// ---- "How do I...?" — the steps themselves, for spelling and reading
const HOW_ORDER = {
  spell: [
    { name: 'spelling a word', steps: ['Say the word', 'Listen for each sound', 'Write a letter for each sound', 'Read it back'] },
    { name: 'spelling a new word', steps: ['Say it slowly', 'Think of the rule', 'Write the letters', 'Check it'] },
  ],
  read: [
    { name: 'reading a new word', steps: ['Find the vowel', 'Look for special sounds', 'Say each sound', 'Blend them together'] },
    { name: 'answering a story question', steps: ['Read the story', 'Read the question', 'Look back in the story', 'Choose the answer'] },
    { name: 'writing a sentence', steps: ['Capital letter first', 'Spaces between words', 'End mark last'] },
  ],
};
const HOW_QS = {
  spell: [
    ['What is the first step to spell a word?', 'Say the word slowly', ['Write any letters', 'Close the book']],
    ['How do you know how many letters to write?', 'Listen for each sound', ['Guess', 'Count your fingers']],
    ['After you spell a word, what should you do?', 'Read it back to check', ['Throw it away', 'Spell it faster']],
    ['You hear a short vowel and a k sound at the end. What do you write?', 'ck', ['ke', 'kk']],
    ['You hear a long vowel and a k sound at the end. What do you write?', 'ke', ['ck', 'c']],
    ['You hear the sound sh. How many letters do you write?', 'two: s and h', ['one: s', 'three']],
    ['A short word ends in an l sound after a short vowel. What do you write?', 'll', ['l', 'le']],
    ['The teacher says a word that is not on your list. What do you do?', 'Use the rules and the sounds', ['Give up', 'Write your list word']],
  ],
  read: [
    ['You see a new word. What do you look for first?', 'The vowel', ['The pictures', 'The last page']],
    ['What do you do after you say each sound?', 'Blend the sounds together', ['Stop reading', 'Skip the word']],
    ['A question asks "Where...?". What are you looking for?', 'A place', ['A person', 'A time']],
    ['A question asks "Who...?". What are you looking for?', 'A person or animal', ['A place', 'A reason']],
    ['A question asks "When...?". What are you looking for?', 'A time', ['A place', 'A colour']],
    ['A question asks "Why...?". What are you looking for?', 'A reason', ['A place', 'A name']],
    ['You do not know the answer to a story question. What do you do?', 'Look back in the story', ['Guess', 'Close the book']],
    ['How do you know if you picked the right word for a sentence?', 'Read the sentence again. Does it make sense?', ['Pick the longest word', 'Pick the first word']],
  ],
};
const howSkill = (id, name, emoji, kind) => ({
  id, name, emoji,
  gen(l) {
    if (l > 1 && Math.random() < 0.4) {
      const o = pick(HOW_ORDER[kind]);
      return { type: 'order', say: `Put the steps for ${o.name} in the right order.`, items: shuffle(o.steps), answer: o.steps,
        explain: `The steps for ${o.name}: ${o.steps.map((x, i) => `${i + 1}. ${x}`).join('. ')}.` };
    }
    const [qq, a, wrong] = pick(HOW_QS[kind]);
    return { say: qq, readFirst: l === 3, options: shuffle([a, ...wrong]).map(x => ({ html: `<span class="lbl" style="font-size:24px">${x}</span>`, value: x, say: x })), answer: a,
      explain: `${a}. ${kind === 'spell' ? RULES.spellSteps.def : /story|Who|Where|When|Why/.test(qq) ? RULES.answerSteps.def : RULES.readSteps.def}` };
  },
});
export const spellHowSkills = [howSkill('s-how', 'How do I spell it?', '🪜', 'spell')];
export const readHowSkills = [howSkill('r-how', 'How do I read it?', '🪜', 'read')];
