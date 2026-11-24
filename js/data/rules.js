// Rules and definitions, in the teacher's words where we have them (class slides / revision guide).
// Shown as a 📌 reminder on questions, and asked directly ("What is a noun?").
import { pick, shuffle, sample } from '../util.js';
import { numberBond, numberLine, tenFrame } from '../visuals.js';

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
  ck: { word: 'c, k, ck, ke', def: 'K comes before i and e; c comes before a, o and u. At the end: a short vowel gets c k (back); a vowel that says its name gets k and a silent e (bake). After a consonant or two vowels, just write k (milk, book).', eg: '' },
  floss: { word: 'double endings', def: 'L, f, s (and z) often walk together at the end of a short-vowel word: bell, cuff, kiss, buzz.', eg: '' },
  blend: { word: 'blends', def: 'Blend the consonant and the vowel together first (b-a, ba), then add the ending (bat).', eg: '' },
  soundout: { word: 'spelling', def: 'To spell, say the word slowly. Listen for every sound, and write a letter or special sound for each one.', eg: '' },
  rhyme: { word: 'rhyming', def: 'Words rhyme when they end with the same vowel and consonant sound.', eg: 'cluck, duck; peep, deep' },
  sight: { word: 'sight words', def: 'Sight words are words we learn by heart, because we cannot always sound them out.', eg: 'the, said, come' },
  // ---- Reading
  findans: { word: 'answering questions', def: 'To answer a question, look back in the story. Who asks for a person. Where asks for a place. When asks for a time. Why asks for a reason.', eg: '' },
  makesense: { word: 'finishing a sentence', def: 'Read the whole sentence with each word. Pick the word that makes sense.', eg: '' },
  // ---- More maths principles
  bond: { word: 'number bonds', def: 'A number bond shows two parts that make a whole. Part plus part equals the whole. The whole take away one part leaves the other part.', eg: '3 + 4 = 7' },
  tens: { word: 'tens and ones', def: 'A number from 10 to 19 is 1 ten and some ones: 14 is 1 ten and 4 ones. The digit on the left shows the tens; the digit on the right shows the ones.', eg: '' },
  compare: { word: 'more and less', def: 'Greater than means bigger. Less than means smaller. The open mouth of > or < always faces the bigger number. = means the same as.', eg: '7 > 3' },
  clock: { word: 'telling time', def: 'The short hand tells the hour. The long hand tells the minutes. When the long hand points to 12, it is o\'clock.', eg: '' },
  counting: { word: 'counting', def: 'Touch and count each thing one time only. The last number you say tells how many there are.', eg: '' },
  order: { word: 'ordinal numbers', def: 'Ordinal numbers tell the order or position: first, second, third, fourth, fifth, sixth, seventh, eighth, ninth, tenth.', eg: '1st, 2nd, 3rd' },
  pattern: { word: 'patterns', def: 'A pattern repeats, or grows by the same amount each time. Find the part that repeats, then continue it.', eg: 'red, blue, red, blue' },
  verse: { word: 'Bible verses', def: 'The Bible is God\'s Word, and it is true. We learn verses by heart so we can remember what God says.', eg: '' },
  // ---- HOW TO: steps for every kind of question
  spellSteps: { word: 'spelling', say: 'Remember the spelling steps: say it slowly, listen for each sound, think of the rule, write the letters, then read it back.',
    def: 'How to spell a word: 1. Say the word slowly. 2. Listen for each sound. 3. Think of the rule (short vowel? two vowels? ck or ke?). 4. Write a letter or special sound for each sound. 5. Read it back to check.', eg: '' },
  readSteps: { word: 'reading a new word', say: 'Remember the reading steps: find the vowel, look for special sounds, say each sound, then blend them together.',
    def: 'How to read a new word: 1. Find the vowel. 2. Look for special sounds (sh, ck, oo...). 3. Say each sound. 4. Blend the sounds together. 5. Read the whole word. Does it make sense?', eg: '' },
  answerSteps: { word: 'answering a story question', say: 'Remember the steps: read the question, is it who, what, where, when or why? Then look back in the story.',
    def: 'How to answer a story question: 1. Read the story. 2. Read the question. Who asks for a person, what for a thing, where for a place, when for a time, why for a reason, how many for a number. 3. Look back in the story to find the answer. 4. Choose the answer.', eg: '' },
  partSteps: { word: 'finding the word type', say: 'Ask about each word: does it name something? Is it an action? Does it describe? Does it take the place of a noun?',
    def: 'How to find the word type: 1. Read the word or sentence. 2. Ask: Does it name a person, animal, place or thing? (noun) Is it an action? (verb) Does it describe? (adjective) Does it take the place of a noun? (pronoun)', eg: '' },
  storySteps: { word: 'word problems', say: 'Remember the steps for a word problem: find the numbers, then decide: add or take away?',
    def: 'How to solve a word problem: 1. Listen or read carefully. 2. Find the numbers. 3. More, altogether, in all → add. Left, ate, gave away, how many fewer → take away. 4. Work it out. 5. Check: does the answer make sense?', eg: '' },
  clockSteps: { word: 'telling the time', say: 'Remember: the short hand shows the hour, the long hand shows the minutes.',
    def: 'How to tell the time: 1. Look at the short hand: it shows the hour. 2. Look at the long hand: on 12 means o\'clock, on 6 means half past. 3. Say the hour, then the minutes.', eg: '' },
  nlineSteps: { word: 'the number line', say: 'Remember: find the start number. Adding hops right. Take away hops left. Count each hop.',
    def: 'How to use a number line: 1. Find the start number. 2. Adding: hop to the right. Take away: hop to the left. 3. Count each hop. 4. Where you land is the answer.', eg: '' },
  sentSteps: { word: 'writing a sentence', say: 'Remember: capital letter at the start, capitals for names, spaces between words, and an end mark.',
    def: 'How to write a sentence correctly: 1. Start with a capital letter. 2. Use capital letters for names, God and I. 3. Leave spaces between words. 4. End with a period, a question mark or an exclamation mark.', eg: '' },
  tellsSteps: { word: 'picture sentences', say: 'Look at the picture, then read each sentence. Which one tells what you see?',
    def: 'How to find the sentence for a picture: 1. Look carefully at the picture. 2. Read each sentence. 3. Pick the one that tells what you see.', eg: '' },
  matchSteps: { word: 'read and find', say: 'Read the whole sentence, then find the picture that shows it.',
    def: 'How to match: 1. Read the whole sentence. 2. Look at each picture. 3. Pick the picture of a thing the sentence talks about.', eg: '' },
  rhymeSteps: { word: 'rhyming', say: 'Remember: say both words and listen to the ending. Same ending? They rhyme!',
    def: 'How to find rhymes: 1. Say both words. 2. Listen to the end: the vowel and the last sound. 3. Same ending? They rhyme! (cluck, duck)', eg: '' },
  // ---- Maths steps
  add: { word: 'adding', say: 'Remember: start with the bigger number, then count on.', def: 'Adding: 1. Put the bigger number in your head. 2. Count on the smaller number. 3. The last number you say is the answer.', eg: '5 + 3: 5... 6, 7, 8' },
  colAdd: { word: 'adding in columns', say: 'Remember the steps: start with the ones. If they make 10 or more, carry 1 ten. Then add the tens.', def: 'Adding in columns: 1. Start with the ones. Add the ones. 2. 10 or more? Write the ones and carry 1 ten to the tens. 3. Add the tens (and the 1 you carried). 4. Write the answer under the line.', eg: '' },
  sub: { word: 'take away', say: 'Remember: start with the big number, take away the small number, then count what is left.', def: 'Take away: 1. Start with the big number. 2. Take away (cross out) the small number. 3. Count what is left.', eg: '8 − 3: cross out 3, count 5' },
  colSub: { word: 'take away in columns', say: 'Remember the steps: big number on top. Start with the ones. If the top ones are smaller, borrow 1 ten. Then the tens.', def: 'Take away in columns: 1. The big number goes on top. 2. Start with the ones. Is the top ones digit smaller? Borrow 1 ten: the tens go down by 1, and the ones get 10 more. 3. Take away the ones. 4. Take away the tens. 5. Check: add your answer and the bottom number. You get the top number!', eg: '' },
  nlineRead: { word: 'number line', say: 'Remember: on a number line the numbers go in order. They get bigger to the right.',
    def: 'On a number line the numbers go in order, one step at a time. They get bigger to the right and smaller to the left. Start at a number you know and count the lines.', eg: '' },
  moreLess: { word: 'more and fewer', say: 'Remember: count each group. The bigger number has more. The smaller number has fewer.',
    def: 'Count each group. The bigger number has more. The smaller number has fewer. Match them up one to one to check.', eg: '' },
  signs: { word: 'maths signs', def: '+ means add. − means take away. = means equals: both sides are the same.', eg: '3 + 2 = 5' },
  shortv: { word: 'short vowels', def: 'Short vowel sounds: a as in apple, e as in egg, i as in insect, o as in octopus, u as in umbrella.', eg: '' },
  blendRule: { word: 'blends', def: 'A blend is two or three letters you can still hear, sliding together: t-r says tr in tree, s-t says st in stop.', eg: '' },
  listenAnswer: { word: 'listening to a story', say: 'Listen to the whole story. Is the question who, what, where, when or why? Tap the ear to hear it again.',
    def: 'How to answer a listening question: 1. Listen to the whole story. 2. Listen to the question. 3. Is it who, what, where, when or why? 4. Tap the ear to hear the story again if you need to.', eg: '' },
  abcLetters: { word: 'ABC order', def: 'Put the letters in alphabet order: a, b, c, d, e, f, g... Sing the ABC song to help you!', eg: '' },
  nline: { word: 'number line', def: 'On the number line, adding hops to the right (numbers get bigger). Take away hops to the left (numbers get smaller).', eg: '' },
};
const BLEND_SET = new Set(['st', 'pl', 'fr', 'tr', 'bl', 'cl', 'fl', 'gl', 'br', 'dr', 'pr', 'gr', 'sm', 'sc', 'sk', 'sp', 'cr', 'tw', 'spl', 'spr', 'scr', 'squ', 'sn', 'sl', 'str', 'sw', 'thr']);
export const PARTS_MIX = 'Noun = naming word. Verb = action word. Adjective = describing word. Pronoun = takes the place of a noun.';

// Which reminder goes with which topic
export const RULE_FOR = {
  'g-noun': 'noun', 'g-proper': 'proper', 'g-plural': 'singular', 'g-article': 'article', 'g-pronoun': 'pronoun', 'g-amisare': 'amisare',
  'g-waswere': 'waswere', 'g-verb': 'verb', 'g-adjective': 'adjective', 'g-compound': 'compound', 'g-sentence': 'sentence', 'g-capital': 'sentSteps',
  'g-endmark': 'endmark', 'g-possessive': 'possessive', 'g-helping': 'helping', 'g-abc': 'abc', 'g-opposites': 'opposite', 'p-vowels': 'vowels',
  'g-parts': 'partSteps', 'g-find': 'partSteps', 'g-use': 'mix', 'g-build': 'sentence',
  'm-add': 'add', 'm-sub': 'sub', 'm-colsub': 'colSub', 'm-coladd': 'colAdd', 'm-nl-hop': 'nlineSteps', 'm-story': 'mathsStory',
  'p-sounds': 'special', 'p-keyword': 'special', 'p-onetwo': 'onetwo', 'p-mark': 'onetwo', 'p-ck': 'ck', 'p-floss': 'floss', 'p-blend': 'blend',
  'p-spell': 'spellSteps', 'p-missing': 'spellSteps', 'p-rightspell': 'spellSteps', 's-unscramble': 'spellSteps', 's-clue': 'spellSteps', 'p-rhyme': 'rhymeSteps', 's-rhyme': 'rhymeSteps', 'l-rhyme': 'rhymeSteps',
  's-sight': 'sight', 'r-sight': 'sight', 'r-story': 'answerSteps', 'l-story': 'listenAnswer', 'r-word': 'readSteps', 'r-picword': 'readSteps', 'r-match': 'matchSteps', 'r-tells': 'tellsSteps', 'r-finish': 'makesense', 'r-wordbank': 'makesense', 's-sentence': 'makesense',
  'm-bond': 'bond', 'm-tens': 'tens', 'm-compare': 'moreLess', 'm-symbols': 'compare', 'm-nl-compare': 'moreLess', 'm-time': 'clockSteps', 'm-digital': 'clock',
  'm-count': 'counting', 'm-oneone': 'counting', 'm-ordinal': 'order', 'm-skip': 'pattern', 'm-pattern': 'pattern',
  'm-nl-read': 'nlineRead', 'm-nl-tap': 'nlineRead', 'm-nl-build': 'nlineRead', 'b-verse': 'verse', 'b-letter': 'verse',
};
export function reminderFor(skillId, q) {
  // Spelling list words: the rule of that list
  if (q.rule) return { key: 'list:' + q.rule.slice(0, 20), text: RULES.spellSteps.def + ' Rule for this list: ' + q.rule, say: 'Remember the rule: ' + q.rule };
  let k = RULE_FOR[skillId];
  if (!k) return null;
  // column rules only for two-digit column sums (the T and O headings); one-digit sums get the simple rule
  const col = /class="vert"/.test(q.visual || '') && /vhead/.test(q.visual || '');
  if (k === 'compare' && /plus|take away|\+|−/.test((q.say || '') + (q.text || ''))) k = 'signs';
  if (k === 'vowels' && /short/i.test((q.say || '') + (q.text || ''))) k = 'shortv';
  if (k === 'abc' && q.type === 'order' && (q.items || []).every(x => String(x).length === 1)) k = 'abcLetters';
  if (k === 'special' && BLEND_SET.has(String(skillId === 'p-sounds' ? q.answer : ((q.say || '').match(/sound ([a-z ]+)\?/) || [, ''])[1].replace(/ /g, '')))) k = 'blendRule';
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
  verb: ['run', 'jump', 'eat', 'sing', 'skip', 'read', 'write', 'clap', 'sleep', 'pray'],
  adjective: ['big', 'red', 'happy', 'soft', 'tall', 'hot', 'little', 'wet', 'sad', 'shiny'],
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
// "Why" questions about the grammar rules, each with a real example shown on screen
// [question, right reason, wrong reasons, example shown]
const hiW = t => `<b style="color:#ff5fa2">${t}</b>`;
const GRAMMAR_WHY = [
  ['Look at the pink letter. Why does Jamaica start with a capital letter?', 'It is a special name (a proper noun)', ['It is an action word', 'It is a small word'], `I live in ${hiW('J')}amaica.`],
  ['Look at this sentence. Why does it start with a capital letter?', 'It is the first word of the sentence', ['To make it long', 'Because it is a verb'], `${hiW('T')}he dog can run.`],
  ['Look at this sentence. Why is there a period at the end?', 'To show the sentence is finished', ['To start the sentence', 'To make a question'], `The dog can run${hiW('.')}`],
  ['Why do we say "an apple" and not "a apple"?', 'Apple starts with a vowel sound', ['Apple is red', 'Apple is a verb'], `🍎 ${hiW('an')} apple`],
  ['There are three cats. Why do we write "cats" with an s?', 'S means more than one', ['S means one', 'S is a verb'], `🐱🐱🐱 three cat${hiW('s')}`],
  ['Look at the pink word. Why is "run" a verb?', 'It is an action word, something we do', ['It is a name', 'It describes a noun'], `I ${hiW('run')} fast.`],
  ['Look at the pink word. Why is "dog" a noun?', 'It names an animal', ['It is an action', 'It describes something'], `The ${hiW('dog')} can run.`],
  ['Look at the pink word. Why is "red" an adjective?', 'It describes the ball', ['It names a place', 'It is an action'], `I have a ${hiW('red')} ball.`],
  ['Look at the pink word. Why do we say "She" and not "Maya" again?', 'She takes the place of the name Maya', ['She is a verb', 'Maya is wrong'], `Maya has a cat. ${hiW('She')} feeds it.`],
  ['Look at the pink part. Why do we write "Tom\'s hat"?', "The 's shows the hat belongs to Tom", ['There are many Toms', 'Tom is an action'], `🎩 Tom${hiW("'s")} hat`],
  ['Look at this sentence. Why does it end with a question mark?', 'It is an asking sentence', ['It is a telling sentence', 'It is a name'], `Can you swim${hiW('?')}`],
  ['Why do we say "they are" and not "they is"?', 'Are is for more than one', ['Is is for more than one', 'They is a name'], `They ${hiW('are')} happy.`],
];
const aan = w => (/^[aeiou]/i.test(w) ? 'an' : 'a');
const egText = r => r.eg.replace(/[.\s]+$/, '');
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
        const [wq, wa, ww, eg] = pick(GRAMMAR_WHY);
        return {
          say: `${wq} Tap the reason.`, text: wq, readFirst: l === 3,
          visual: `<div class="sentence" style="font-size:clamp(30px,5vw,48px)">${eg}</div>`,
          options: shuffle([wa, ...ww]).map(x => ({ html: `<span class="lbl" style="font-size:24px">${x}</span>`, value: x, say: x })), answer: wa,
          explain: `${wa}.`,
        };
      }
      if (mode === 0) return {
        // What is a noun? -> pick what it means
        say: `What is ${aan(r.word)} ${r.word}? Tap what it means.`, text: `What is ${aan(r.word)} ${r.word}?`, readFirst: l > 1,
        options: shuffle([k, ...others]).map(x => ({ html: `<span class="lbl" style="font-size:22px">${DESC[x]}</span>`, value: x, say: DESC[x] })),
        cols: 'two', answer: k,
        explain: `${r.def} For example: ${egText(r)}.`,
      };
      if (mode === 1) return {
        // "An action word or doing word" -> what is it called?
        say: `${DESC[k]}. What do we call it? Tap the name.`, text: `"${DESC[k]}." What do we call it?`,
        options: shuffle([k, ...others]).map(x => ({ html: `<span class="lbl">${RULES[x].word}</span>`, value: x, say: RULES[x].word })), answer: k,
        explain: `${r.def} For example: ${egText(r)}.`,
      };
      // Know it AND find it: "A verb is an action word. Tap the verb."
      const kk = pick(CORE), rr = RULES[kk];
      const right = pick(EXAMPLES[kk]);
      const wrong = sample(CORE.filter(x => x !== kk), l === 1 ? 2 : 3).map(x => pick(EXAMPLES[x]));
      return {
        say: `Remember: ${rr.def.split('. ')[0].replace(/\.$/, '')}. Tap the word that is ${aan(rr.word)} ${rr.word}.`, text: `Tap the word that is ${aan(rr.word)} ${rr.word} (${rr.short}).`,
        options: shuffle([right, ...wrong]).map(x => ({ html: `<span class="lbl" style="font-size:34px">${x}</span>`, value: x, say: x })), answer: right,
        explain: `The word "${right}" is ${aan(rr.word)} ${rr.word}. ${rr.def}`,
      };
    },
  },
];

// ---- Maths steps questions
// Every question shows a REAL example on screen, so she can see what it is asking about.
// A column sum drawing: T and O headings, the sum, the line, and the answer row
const colPic = (top, bot, op, ans = ['?', '?']) => {
  const d = n => [Math.floor(n / 10) || '', n % 10];
  const [tt, to] = d(top), [bt, bo] = d(bot);
  const c = (v, st = '') => `<div style="${st}">${v}</div>`;
  return `<div style="display:inline-grid;grid-template-columns:repeat(3,52px);font-size:44px;font-weight:800;text-align:center;background:#fff;border-radius:14px;padding:6px 16px;line-height:1.2">
    ${c('')}${c('T', 'font-size:20px;color:#5b3fd1')}${c('O', 'font-size:20px;color:#ff5fa2')}
    ${c('')}${c(tt)}${c(to)}${c(op)}${c(bt)}${c(bo)}
    <div style="grid-column:1/4;border-top:5px solid #2b2250;margin:2px 0"></div>
    ${c('')}${c(ans[0], 'color:#5b3fd1')}${c(ans[1], 'color:#5b3fd1')}</div>`;
};
const sumPic = t => `<div class="sentence" style="font-size:clamp(34px,6vw,56px);font-weight:800">${t}</div>`;
const nlPic = () => numberLine({ min: 0, max: 10 });
// [question, answer, wrong answers, a short explanation for THIS question, the example shown]
const STEP_QS = [
  ['We want to take away 23 from 48 in columns. Which number goes on top?', '48, the bigger number', ['23, the smaller number', 'It does not matter'], 'The bigger number, 48, goes on top, because we take away FROM the bigger number.', () => sumPic('48 − 23')],
  ['Look at this sum. Where do we start?', 'With the ones', ['With the tens', 'With the answer'], 'We always start with the ones. The ones are on the right side, under the O.', () => colPic(34, 25, '+')],
  ['Look at this sum. We finished the ones. What do we do next?', 'Do the tens', ['Stop', 'Start again'], 'First the ones, then the tens. 3 plus 2 is 5, so the answer is 59.', () => colPic(34, 25, '+', ['?', 9])],
  ['Look at this sum. Where do we write the answer?', 'Under the line', ['On top', 'Next to the + sign'], 'The answer goes under the line, where the question marks are.', () => colPic(34, 25, '+')],
  ['8 take away 3 is 5. How can we check it?', 'Add 5 and 3. Do we get 8?', ['Take away 3 again', 'Just guess'], 'Check: 5 add 3 makes 8. It matches the top number, so we are right!', () => sumPic('8 − 3 = 5')],
  ['We add 2 + 6 by counting on. Which number do we start with?', '6, the bigger number', ['2, the smaller number', '0'], 'Start with the bigger number, 6, then count on 2 more: 7, 8.', () => sumPic('2 + 6')],
  ['We have 5 sweets. We take away 2. Do we have more or fewer than 5 now?', 'Fewer', ['More', 'The same'], 'Take away means some are gone. 5 take away 2 is 3, and 3 is fewer than 5.', () => tenFrame(5, 2)],
  ['We have 3 apples. We add 2 more. Do we have more or fewer than 3 now?', 'More', ['Fewer', 'The same'], 'Adding puts more together. 3 and 2 more is 5, and 5 is more than 3.', () => tenFrame(5, 0, 2)],
  ['Look at the pink sign. What does it mean?', 'Add (plus)', ['Take away (minus)', 'Equals (the same as)'], '+ means add. 2 + 1 = 3.', () => sumPic('2 <span style="color:#ff5fa2;font-size:1.4em">+</span> 1 = 3')],
  ['Look at the pink sign. What does it mean?', 'Take away (minus)', ['Add (plus)', 'Equals (the same as)'], '− means take away. 3 − 1 = 2.', () => sumPic('3 <span style="color:#ff5fa2;font-size:1.4em">−</span> 1 = 2')],
  ['Look at the pink sign. What does it mean?', 'Equals (the same as)', ['Add (plus)', 'Take away (minus)'], '= means equals: both sides are the same amount. 2 + 2 = 4.', () => sumPic('2 + 2 <span style="color:#ff5fa2;font-size:1.4em">=</span> 4')],
  ['Look at the number line. To add, which way do we hop?', 'To the right', ['To the left', 'Up'], 'Numbers get bigger to the right. Adding makes bigger, so we hop right.', nlPic],
  ['Look at the number line. To take away, which way do we hop?', 'To the left', ['To the right', 'Down'], 'Numbers get smaller to the left. Take away makes smaller, so we hop left.', nlPic],
  ['Here are 8 counters. To take away 3, what do we do?', 'Cross out 3 and count what is left', ['Add 3 more', 'Count all 8'], 'Cross out 3. Count the ones left: 5. So 8 take away 3 is 5.', () => tenFrame(8)],
  ['Look at 8 take away 3. Why does the 8 go first, on top?', 'We cannot take away more than we have', ['It looks nicer', 'The teacher likes it'], 'If you have 3 sweets, you cannot give away 8. So the bigger number goes on top.', () => colPic(8, 3, '−')],
  ['Look at this sum. Why do we put the ones under the ones and the tens under the tens?', 'So we add the right numbers together', ['So it looks long', 'So we can skip the ones'], "Ones go with ones and tens go with tens, so we don't mix them up.", () => colPic(34, 25, '+')],
  ['For 2 + 7, why do we start counting on from 7?', 'It is faster: fewer numbers to count', ['It is slower', 'Because 7 is the answer'], 'For 2 + 7: start at 7 and count 2 more (8, 9). That is faster than counting 7 more.', () => sumPic('2 + 7')],
  ['Look at the number bond. The whole is 9 and one part is 4. What is the other part?', '5', ['13', '4'], '4 and 5 make 9. So the other part is 5.', () => numberBond(9, 4, null)],
  ['When we count these apples, why do we touch each one?', 'So we count each one only one time', ['So it gets dirty', 'So we can skip some'], 'Touching each one stops us counting the same thing twice.', () => sumPic('🍎 🍎 🍎 🍎 🍎')],
];
// Tens and ones questions, made fresh each time, with a picture of the tens and ones
const placeChart = n => `<div style="display:flex;gap:6px;justify-content:center;font-size:44px;font-weight:800">
  <div style="background:#fff;border-radius:14px;padding:4px 18px;text-align:center"><div style="font-size:18px;color:#5b3fd1">tens</div>${Math.floor(n / 10)}</div>
  <div style="background:#fff;border-radius:14px;padding:4px 18px;text-align:center"><div style="font-size:18px;color:#ff5fa2">ones</div>${n % 10}</div></div>`;
function placeQ(l) {
  const n = l === 3 ? 21 + Math.floor(Math.random() * 69) : 11 + Math.floor(Math.random() * 9);
  const t = Math.floor(n / 10), o = n % 10;
  if (t === o) return placeQ(l);
  const askOnes = Math.random() < 0.5;
  const a = String(askOnes ? o : t), w = String(askOnes ? t : o);
  return {
    say: `Look at the number ${n}. Which digit is in the ${askOnes ? 'ones' : 'tens'} place?`,
    text: `Which digit is in the ${askOnes ? 'ONES' : 'TENS'} place?`,
    visual: `<div class="word-big">${n}</div>`,
    options: shuffle([a, w, String(n)]).map(x => ({ html: `<span class="lbl" style="font-size:40px">${x}</span>`, value: x, say: x })), answer: a,
    explain: `${n} is ${t} ten${t === 1 ? '' : 's'} and ${o} one${o === 1 ? '' : 's'}. The digit on the LEFT (${t}) is the tens. The digit on the RIGHT (${o}) is the ones. So the ${askOnes ? 'ones' : 'tens'} digit is ${a}.`,
    explainVisual: placeChart(n),
  };
}
const ORDER_STEPS = [
  { name: 'take away in columns', eg: () => colPic(48, 23, '−'), steps: ['Big number on top', 'Take away the ones', 'Take away the tens', 'Write the answer'] },
  { name: 'adding in columns', eg: () => colPic(34, 25, '+'), steps: ['Add the ones', 'Add the tens', 'Write the answer'] },
  { name: 'take away with counters', eg: () => sumPic('8 − 3') + tenFrame(8), steps: ['Show the big number', 'Cross out the small number', 'Count what is left'] },
  { name: 'adding by counting on', eg: () => sumPic('2 + 6'), steps: ['Start with the big number', 'Count on the small number', 'Say the answer'] },
  { name: 'a word problem', eg: () => sumPic('<span style="font-size:0.6em">Sam has 3 mangoes. He gets 2 more. How many now?</span>'), steps: ['Listen carefully', 'Find the numbers', 'Add or take away?', 'Check the answer'] },
  { name: 'telling the time', eg: () => sumPic('🕒'), steps: ['Look at the short hand', 'Look at the long hand', 'Say the time'] },
  { name: 'using a number line', eg: () => sumPic('5 + 3') + nlPic(), steps: ['Find the start number', 'Hop the right way', 'Count each hop', 'Read where you land'] },
];
export const mathStepSkills = [
  {
    id: 'm-steps', name: 'Steps for adding & take away', emoji: '🪜',
    gen(l) {
      if (l > 1 && Math.random() < 0.4) {
        const o = pick(ORDER_STEPS.filter(x => l === 3 || x.steps.length <= 3));
        return {
          type: 'order', say: `Look at this. What are the steps for ${o.name}? Tap the steps in order. Tap the first step first.`,
          text: `Steps for ${o.name}: tap them in order, first step first.`,
          visual: o.eg(), items: shuffle(o.steps), answer: o.steps,
          explain: `The steps for ${o.name}: ${o.steps.map((x, i) => `${i + 1}. ${x}`).join('. ').replace(/\?\./g, '?')}.`,
        };
      }
      if (Math.random() < 0.25) return placeQ(l);
      const [qq, a, wrong, why, vis] = pick(STEP_QS);
      return {
        say: `${qq} Tap the answer.`, text: qq, visual: vis(), readFirst: l === 3,
        options: shuffle([a, ...wrong]).map(x => ({ html: `<span class="lbl" style="font-size:24px">${x}</span>`, value: x, say: x })), answer: a,
        explain: why,
      };
    },
  },
];

// ---- Sound Safari: "Why is it spelled that way?" (the reason behind the phonics rules)
// [words, question, right reason, wrong reasons, which letters to colour pink]
const tail = n => w => [w.length - n, w.length];
const VOWEL_RE = /[aeiou]/;
const WHY_SPELL = [
  [['back', 'duck', 'sock', 'kick', 'neck', 'truck', 'clock', 'snack'], w => `Why does "${w}" end with c k?`, 'The vowel is short', ['The vowel says its name', 'It starts with c'], tail(2)],
  [['bake', 'cake', 'like', 'snake', 'joke', 'hike', 'smoke', 'rake'], w => `Why does "${w}" end with k e?`, 'The vowel says its name (long)', ['The vowel is short', 'It has no vowel'], tail(2)],
  [['kite', 'kid', 'keep', 'king', 'kiss', 'kick'], w => `Why does "${w}" start with k?`, 'K comes before i and e', ['K comes before a, o and u', 'K is a vowel'], () => [0, 2]],
  [['cat', 'cup', 'cot', 'cub', 'cone', 'cake', 'cut'], w => `Why does "${w}" start with c?`, 'C comes before a, o and u', ['C comes before i and e', 'C is a vowel'], () => [0, 2]],
  [['bell', 'doll', 'hill', 'cuff', 'puff', 'kiss', 'mess', 'buzz', 'well', 'stuff'], w => `Why does "${w}" end with two of the same letter?`, 'It has a short vowel and ends in l, f, s or z', ['It has a long vowel', 'It has two vowels'], tail(2)],
  [['cake', 'goat', 'kite', 'boat', 'bean', 'game', 'ride', 'rain', 'feet'], w => `Why does the first vowel in "${w}" say its name?`, 'There are two vowels; the second one is silent', ['There is only one vowel', 'It ends with c k'], w => [w.search(VOWEL_RE), w.search(VOWEL_RE) + 1]],
  [['cat', 'pig', 'sun', 'bed', 'hop', 'net', 'cub', 'fish'], w => `Why does "${w}" have a short vowel sound?`, 'It has only one vowel', ['It has two vowels', 'It ends with e'], w => [w.search(VOWEL_RE), w.search(VOWEL_RE) + 1]],
  [['go', 'no', 'so', 'me', 'he', 'be', 'we'], w => `Why does the ${w.slice(-1)} in "${w}" say its name?`, 'It is the only vowel, and it is at the end', ['There are two vowels', 'It ends with c k'], tail(1)],
  [['my', 'cry', 'fly', 'by', 'try'], w => `In "${w}", what sound does the y at the end make?`, 'Long i, like in kite', ['Short i, like in pig', 'Y, like in yes'], tail(1)],
  [['ship', 'shell', 'fish', 'this', 'thin', 'chair', 'night', 'moon'], w => `Look at the pink letters in "${w}". Why do they make just one sound?`, 'They are a special sound: letters that work together', ['We spelled it wrong', 'Every sound needs two letters'], w => { const m = w.match(/igh|sh|th|ch|oo/); return [m.index, m.index + m[0].length]; }],
];
export const phonicsWhySkills = [
  {
    id: 'p-why', name: 'Why is it spelled that way?', emoji: '🤔',
    gen(l) {
      const [words, ask, right, wrong, part] = pick(l === 1 ? WHY_SPELL.slice(0, 5) : WHY_SPELL);
      const w = pick(words);
      const [a, b] = part(w);
      return {
        say: `${ask(w)} Tap the reason.`, text: ask(w),
        visual: `<div class="word-big">${w.slice(0, a)}<span style="color:#ff5fa2">${w.slice(a, b)}</span>${w.slice(b)}</div>`,
        options: shuffle([right, ...(l === 1 ? wrong.slice(0, 1) : wrong)]).map(x => ({ html: `<span class="lbl" style="font-size:24px">${x}</span>`, value: x, say: x })),
        cols: 'two', answer: right,
        explain: `${right}. That is why ${w} is spelled ${w.split('').join(' ')}.`,
      };
    },
  },
];

// ---- "How do I...?" — the steps themselves, for spelling and reading
const ex = t => `<div class="sentence" style="font-size:clamp(26px,4vw,40px)">${t}</div>`;
const HOW_ORDER = {
  spell: [
    { name: 'spelling a word', eg: () => ex('🐷 pig'), steps: ['Say it slowly', 'Listen for each sound', 'Write the letters', 'Read it back'] },
    { name: 'spelling a new word', eg: () => ex('🦆 duck'), steps: ['Say it slowly', 'Think of the rule', 'Write the letters', 'Read it back'] },
  ],
  read: [
    { name: 'reading a new word', eg: () => ex('ship'), steps: ['Find the vowel', 'Look for special sounds', 'Say each sound', 'Blend them together'] },
    { name: 'answering a story question', eg: () => ex('Kim has a red kite.') + ex('What colour is the kite?'), steps: ['Read the story', 'Read the question', 'Look back in the story', 'Choose the answer'] },
    { name: 'writing a sentence', eg: () => ex('The dog can run.'), steps: ['Capital letter first', 'Write the words', 'End mark last'] },
  ],
};
// Every "how do I…" question uses a REAL example, so it is clear what to do.
// Each maker returns { say, visual, answer, wrong, why }.
const QTYPES = [
  ['When', ['When do you go to bed?', 'When is your birthday?', 'When does the sun come up?'], "A time (like 7 o'clock)"],
  ['Where', ['Where is your school?', 'Where does a fish live?', 'Where do you sleep?'], 'A place (like at home)'],
  ['Who', ['Who reads you a story?', 'Who is your teacher?', 'Who cooks dinner?'], 'A person (like Mum)'],
  ['Why', ['Why do we wear a raincoat?', 'Why do we brush our teeth?'], 'A reason (because...)'],
];
const HOW_QS = {
  spell: [
    () => { const [w, s, p] = pick([['hen', 'h-e-n', '🐔'], ['sun', 's-u-n', '☀️'], ['pig', 'p-i-g', '🐷'], ['cup', 'c-u-p', '☕']]);
      return { say: `You want to spell ${w}. What do you do first? Tap the answer.`, visual: ex(`${p} ${w}`), answer: `Say it slowly: ${s}`, wrong: ['Write any letters', 'Close the book'], why: `First say the word slowly: ${s}. Then you can hear every sound.` }; },
    () => { const [w, s, n] = pick([['cat', 'c-a-t', 3], ['dog', 'd-o-g', 3], ['frog', 'f-r-o-g', 4], ['ship', 'sh-i-p', 3], ['up', 'u-p', 2]]);
      return { say: `Say ${w} slowly: ${s}. How many sounds do you hear? Tap the number.`, visual: ex(s), answer: String(n), wrong: [String(n + 1), String(n - 1 || 5)], why: `${s}: that is ${n} sounds. Each sound gets a letter, or a special sound like sh.` }; },
    () => { const [w, x, y] = pick([['bed', 'bad', 'bud'], ['pin', 'pan', 'pen'], ['hop', 'hip', 'hut']]);
      return { say: `Here is a word you wrote. Read it back. Tap the word it says.`, visual: ex(w.split('').join(' - ')), answer: w, wrong: [x, y], why: `It says ${w}. Reading it back checks that you wrote the word you wanted.` }; },
    () => { const w = pick(['duck', 'back', 'sock', 'kick', 'neck']);
      return { say: `${w}: the vowel is short. Which letters go in the blanks at the end of ${w}? Tap them.`, visual: ex(w.slice(0, -2) + ' _ _'), answer: 'ck', wrong: ['ke', 'k'], why: `${w} has a short vowel, so the k sound at the end is c k: ${w}.` }; },
    () => { const w = pick(['bake', 'like', 'cake', 'woke', 'bike']);
      return { say: `${w}: the vowel says its name. Which letters go in the blanks at the end of ${w}? Tap them.`, visual: ex(w.slice(0, -2) + ' _ _'), answer: 'ke', wrong: ['ck', 'c'], why: `In ${w} the vowel says its name, so we write k and a silent e: ${w}.` }; },
    () => { const w = pick(['ship', 'shop', 'shell', 'fish', 'dish']); const start = w.startsWith('sh');
      return { say: `Which letters make the sh sound in ${w}? Tap the letters for the blanks.`, visual: ex(start ? '_ _' + w.slice(2) : w.slice(0, -2) + '_ _'), answer: 'sh', wrong: ['s', 'ch'], why: `The sh sound needs two letters, s and h: ${w}.` }; },
    () => { const w = pick(['bell', 'doll', 'hill', 'well', 'fill']);
      return { say: `Which letters go in the blanks at the end of ${w}? Tap them.`, visual: ex(w.slice(0, -2) + ' _ _'), answer: 'll', wrong: ['l', 'le'], why: `${w} is a short word with a short vowel, so the l is doubled: ${w}.` }; },
    () => { const [w, s] = pick([['mat', 'm-a-t'], ['bun', 'b-u-n'], ['jog', 'j-o-g']]);
      return { say: `Your teacher says a word that is not on your list: ${w}. How can you spell it? Tap the answer.`, visual: ex(`🗣️ "${w}"`), answer: `Sound it out: ${s}`, wrong: ['Give up', 'Write a list word'], why: `You can spell new words too! Say it slowly, ${s}, and write a letter for each sound.` }; },
  ],
  read: [
    ...QTYPES.map(([qw, qs, ans]) => () => {
      const qq = pick(qs);
      return { say: `Look at this question: ${qq} What will the answer tell you? Tap it.`, visual: ex(`"${qq}"`), answer: ans,
        wrong: QTYPES.filter(x => x[0] !== qw).map(x => x[2]).slice(0, 2),
        why: `The question starts with ${qw}. ${qw} asks for ${ans.charAt(0).toLowerCase() + ans.slice(1)}.` };
    }),
    () => { const [w, v, others] = pick([['ship', 'i', ['s', 'p']], ['frog', 'o', ['f', 'g']], ['duck', 'u', ['d', 'k']], ['hen', 'e', ['h', 'n']], ['crab', 'a', ['c', 'b']]]);
      return { say: `Here is a new word. To read it, find the vowel first. Tap the vowel.`, visual: ex(w), answer: v, wrong: others, why: `The vowel in ${w} is ${v}. Finding the vowel helps you know how to say the word.` }; },
    () => { const [snd, w, wr] = pick([['c - a - t', 'cat', ['cut', 'cap']], ['s - u - n', 'sun', ['sit', 'nut']], ['b - e - d', 'bed', ['bad', 'red']], ['f - i - sh', 'fish', ['dish', 'fin']], ['m - o - p', 'mop', ['map', 'top']]]);
      return { say: `Say each sound. Then blend them together. Tap the word they make.`, visual: ex(snd), answer: w, wrong: wr, why: `${snd}... ${w}! Blending the sounds makes the word.` }; },
    () => { const [story, q, a, wr] = pick([['Kim has a red kite.', 'What colour is the kite?', 'red', ['blue', 'green']], ['Ben has a dog. The dog is named Spot.', 'What is the dog named?', 'Spot', ['Tip', 'Rex']], ['Pam went to the beach on Sunday.', 'When did Pam go to the beach?', 'on Sunday', ['on Monday', 'at night']]]);
      return { say: `Read the story. Then look back in the story to answer: ${q} Tap the answer.`, visual: ex(story) + ex(`❓ ${q}`), answer: a, wrong: wr, why: `Look back in the story: "${story}" The answer is ${a}.` }; },
    () => { const [sent, a, wr] = pick([['I sit on a ___.', 'chair', ['sky', 'run']], ['The cat drinks ___.', 'milk', ['sad', 'jump']], ['We read a ___.', 'book', ['hat', 'red']]]);
      return { say: `Read the sentence. Try each word in the blank. Tap the word that makes sense.`, visual: ex(sent), answer: a, wrong: wr, why: `"${sent.replace('___', a)}" makes sense. Read the sentence with the word in it to check.` }; },
  ],
};
const howSkill = (id, name, emoji, kind) => ({
  id, name, emoji,
  gen(l) {
    if (l > 1 && Math.random() < 0.4) {
      const o = pick(HOW_ORDER[kind]);
      return { type: 'order', say: `Look at this. What are the steps for ${o.name}? Tap the steps in order. Tap the first step first.`,
        text: `Steps for ${o.name}: tap them in order, first step first.`, visual: o.eg(), items: shuffle(o.steps), answer: o.steps,
        explain: `The steps for ${o.name}: ${o.steps.map((x, i) => `${i + 1}. ${x}`).join('. ').replace(/\?\./g, '?')}.` };
    }
    const { say, visual, answer, wrong, why } = pick(HOW_QS[kind])();
    return { say, visual, readFirst: l === 3, options: shuffle([answer, ...wrong]).map(x => ({ html: `<span class="lbl" style="font-size:24px">${x}</span>`, value: x, say: x })), answer,
      explain: why };
  },
});
export const spellHowSkills = [howSkill('s-how', 'How do I spell it?', '🪜', 'spell')];
export const readHowSkills = [howSkill('r-how', 'How do I read it?', '🪜', 'read')];
