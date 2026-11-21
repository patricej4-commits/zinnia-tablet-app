// Bible Time: the class A-Z Bible memory verse cards (KJV, from her teacher),
// plus well-known Bible stories in simple words.
import { pick, shuffle, sample, esc } from '../util.js';

// [letter, verse, reference, word to fill in, kid-friendly meaning]
const VERSES = [
  ['A', 'All have sinned and come short of the glory of God.', 'Romans 3:23', 'sinned', 'Everyone has done wrong things. We all need Jesus.'],
  ['B', 'Believe on the Lord Jesus Christ, and thou shalt be saved.', 'Acts 16:31', 'Jesus', 'If we believe in Jesus, He saves us.'],
  ['C', 'Children, obey your parents in the Lord: for this is right.', 'Ephesians 6:1', 'parents', 'Listen to Mummy and Daddy and do what they say.'],
  ['D', 'Depart from evil, and do good.', 'Psalms 34:14', 'good', 'Stay away from bad things. Do good things.'],
  ['E', 'Even a child is known by his doings.', 'Proverbs 20:11', 'child', 'People can see what I am like by what I do.'],
  ['F', 'Fear not: for I am with thee.', 'Isaiah 43:5', 'Fear', 'Do not be afraid. God is with me.'],
  ['G', 'God is love.', '1st John 4:8', 'love', 'God loves us very much.'],
  ['H', 'Honour thy father and thy mother.', 'Exodus 20:12', 'mother', 'Respect and obey Mummy and Daddy.'],
  ['I', 'If ye shall ask anything in My name, I will do it.', 'John 14:14', 'ask', 'We can pray and ask Jesus for help.'],
  ['J', 'Jesus saith unto him, I am the way, the truth and the life.', 'John 14:6', 'way', 'Jesus is the way to God.'],
  ['K', 'Keep thy tongue from evil.', 'Psalms 34:13', 'tongue', 'Use kind words. Do not say bad things.'],
  ['L', 'Look unto Me, and be ye saved.', 'Isaiah 45:22', 'Look', 'Look to God and He will save us.'],
  ['M', 'My son, give Me thine heart.', 'Proverbs 23:26', 'heart', 'God wants us to love Him with all our heart.'],
  ['N', 'No man can serve two masters.', 'Matthew 6:24', 'two', 'We should follow God first.'],
  ['O', 'O give thanks unto the Lord; He is good.', 'Psalms 118:1', 'thanks', 'Say thank you to God. He is good!'],
  ['P', 'Praise ye the Lord: for it is good to sing praises unto our God.', 'Psalms 147:1', 'sing', 'It is good to sing songs to God.'],
  ['Q', 'Quit you like men, be strong.', '1st Corinthians 16:13', 'strong', 'Be brave and strong.'],
  ['R', 'Remember the sabbath day, to keep it holy.', 'Exodus 20:8', 'holy', 'Keep God\'s special day for Him.'],
  ['S', 'Seek ye the Lord while He may be found.', 'Isaiah 55:6', 'Seek', 'Look for God and get to know Him.'],
  ['T', 'Thou God seest me.', 'Genesis 16:13', 'seest', 'God always sees me.'],
  ['U', 'Unto Thee, O God, do we give thanks.', 'Psalms 75:1', 'thanks', 'We say thank you to God.'],
  ['V', 'Verily, verily, I say unto you, whatsoever ye shall ask the Father in My name, He will give it to you.', 'John 16:23', 'Father', 'We can ask God the Father for what we need.'],
  ['W', 'When I am afraid, I will trust in Thee.', 'Psalms 56:3', 'trust', 'When I am scared, I trust God.'],
  ['X', 'Exceeding great and precious promises are given unto us.', '2nd Peter 1:4', 'promises', 'God gives us great promises.'],
  ['Y', 'Ye are the light of the world.', 'Matthew 5:14', 'light', 'We shine God\'s love for others to see.'],
  ['Z', 'Zion heard, and was glad.', 'Psalms 97:8', 'glad', 'God\'s people were happy.'],
];

// Bible stories: [title, picture, story, [question, answer, wrong, wrong]...]
const STORIES = [
  ['Salvation: God\'s gift', '✝️', 'God made us and He loves us very much. But all of us have done wrong things. That is called sin. Sin keeps us away from God. God sent His Son, Jesus, to die on the cross for our sins. Three days later, Jesus rose again! If we believe in Jesus and ask Him to forgive us, we are saved. We become part of God\'s family forever.',
    [['Who loves us very much?', 'God', 'the king', 'Goliath'], ['What do we call the wrong things we do?', 'sin', 'love', 'prayer'], ['Who did God send to save us?', 'Jesus', 'Noah', 'Jonah'], ['What did Jesus do three days later?', 'He rose again', 'He went fishing', 'He built an ark'], ['How are we saved?', 'by believing in Jesus', 'by being rich', 'by being tall']]],
  ['Salvation: God\'s gift', '✝️', 'Romans 3:23 says: All have sinned and come short of the glory of God. Acts 16:31 says: Believe on the Lord Jesus Christ, and thou shalt be saved. Jesus died for us and rose again. When we believe in Him, He forgives us and we can live with God forever.',
    [['Who has sinned?', 'all of us', 'nobody', 'only grown-ups'], ['What must we do to be saved?', 'believe on the Lord Jesus Christ', 'eat good food', 'go to the beach'], ['What does Jesus do when we believe?', 'He forgives us', 'He gets angry', 'He goes away']]],
  ['God made the world', '🌍', 'In the beginning, God made the heavens and the earth. He made the sun, the moon and the stars. He made the plants, the fish, the birds and the animals. Then God made people. God saw that it was very good.',
    [['Who made the world?', 'God', 'Noah', 'David'], ['What did God make last?', 'people', 'fish', 'the sun'], ['What did God say about everything He made?', 'It was very good', 'It was bad', 'It was too small']]],
  ['Noah and the ark', '🚢', 'God told Noah to build a big boat called an ark. Noah obeyed God. The animals went into the ark two by two. It rained for forty days and forty nights. God kept Noah safe. Then God put a rainbow in the sky as a promise.',
    [['What did Noah build?', 'an ark', 'a house', 'a tower'], ['How did the animals go into the ark?', 'two by two', 'one by one', 'ten by ten'], ['What did God put in the sky as a promise?', 'a rainbow', 'a star', 'a cloud']]],
  ['David and Goliath', '🪨', 'Goliath was a very big giant. Everyone was afraid of him. David was just a boy, but he trusted God. David put a small stone in his sling. The stone hit Goliath and he fell down. God helped David win!',
    [['Who was the big giant?', 'Goliath', 'David', 'Moses'], ['What did David use?', 'a sling and a stone', 'a big sword', 'a bow'], ['Who helped David win?', 'God', 'the king', 'his brothers']]],
  ['Jonah and the big fish', '🐋', 'God told Jonah to go to Nineveh. Jonah did not obey. He got on a ship going the other way. A big storm came. Jonah was thrown into the sea and a big fish swallowed him. Jonah prayed. The fish spat him out, and Jonah obeyed God.',
    [['What swallowed Jonah?', 'a big fish', 'a lion', 'a bird'], ['What did Jonah do inside the fish?', 'He prayed', 'He slept', 'He sang'], ['Where did God tell Jonah to go?', 'Nineveh', 'Egypt', 'the beach']]],
  ['Daniel and the lions', '🦁', 'Daniel prayed to God three times every day. Some bad men made a rule that no one could pray to God. Daniel still prayed. He was put in a den of lions. God sent an angel to shut the lions\' mouths. Daniel was safe!',
    [['Who did Daniel pray to?', 'God', 'the king', 'the lions'], ['Where was Daniel put?', 'in a lions\' den', 'in a boat', 'in a tree'], ['Who kept Daniel safe?', 'God', 'the lions', 'the bad men']]],
  ['Baby Jesus is born', '⭐', 'Mary and Joseph went to Bethlehem. There was no room at the inn. Baby Jesus was born and laid in a manger. Angels told the shepherds the good news. A bright star led wise men to Jesus.',
    [['Where was Jesus born?', 'Bethlehem', 'Nineveh', 'Egypt'], ['Where was baby Jesus laid?', 'in a manger', 'in a boat', 'in a big bed'], ['What led the wise men to Jesus?', 'a bright star', 'a rainbow', 'a big fish']]],
  ['Jesus feeds 5000', '🐟', 'Many people came to listen to Jesus. They were hungry. A boy shared his lunch of five loaves of bread and two fish. Jesus gave thanks and broke the bread. Everyone ate and was full!',
    [['What did the boy share?', 'five loaves and two fish', 'ten mangoes', 'a cake'], ['What did Jesus do before sharing the food?', 'He gave thanks', 'He slept', 'He went home'], ['Were the people still hungry after?', 'No, everyone was full', 'Yes, very hungry', 'Only Jesus ate']]],
  ['The lost sheep', '🐑', 'A shepherd had one hundred sheep. One little sheep got lost. The shepherd left the others and looked everywhere until he found it. He was so happy! Jesus loves us like that shepherd.',
    [['How many sheep got lost?', 'one', 'ten', 'one hundred'], ['How did the shepherd feel when he found it?', 'happy', 'angry', 'sleepy'], ['Who loves us like the shepherd?', 'Jesus', 'the sheep', 'the king']]],
];

// Christmas term exam covers verses Aa - Ii: they come up 3 times as often
const EXAM = VERSES.filter(v => 'ABCDEFGHI'.includes(v[0]));
const pickVerse = pool => (Math.random() < 0.75 ? pick(pool.filter(v => EXAM.includes(v)).length ? pool.filter(v => EXAM.includes(v)) : pool) : pick(pool));

export const bibleSkills = [
  {
    id: 'b-verse', name: 'Finish the verse', emoji: '📖',
    gen(l) {
      const pool = l === 1 ? VERSES.filter(v => v[1].length < 45) : VERSES;
      const [letter, verse, ref, word] = pickVerse(pool);
      const wrong = sample([...new Set(VERSES.map(v => v[3]).filter(w => w !== word))], 2);
      const blanked = verse.replace(word, '___');
      return {
        say: l < 3 ? `Finish the verse. ${blanked.replace('___', 'blank')}` : 'Read the verse. Which word is missing?',
        readFirst: l === 3,
        visual: `<div class="sentence" style="font-size:clamp(26px,4.4vw,42px)">${esc(blanked).replace('___', '<span style="color:#5b3fd1;border-bottom:5px solid #5b3fd1;padding:0 18px">?</span>')}<div style="font-size:.55em;color:#7a70b0;margin-top:6px">${letter} · ${ref}</div></div>`,
        options: shuffle([word, ...wrong]).map(w => ({ html: esc(w), value: w })), answer: word,
        explain: `${verse} ${ref}.`,
      };
    },
  },
  {
    id: 'b-letter', name: 'A to Z verses', emoji: '🔠',
    gen(l) {
      const [letter, verse] = pickVerse(VERSES);
      const others = sample(VERSES.filter(v => v[0] !== letter && v[0] !== 'X'), 2);
      if (letter === 'X' || Math.random() < 0.5) return {
        say: `Which verse is the ${letter} verse?`, readFirst: l > 1,
        visual: `<div class="word-big">${letter}${letter.toLowerCase()}</div>`,
        options: shuffle([verse, ...others.map(v => v[1])]).map(v => ({ html: `<span class="lbl" style="font-size:22px">${esc(v)}</span>`, value: v, say: v })), answer: verse,
        explain: `${letter} is for: ${verse}`,
      };
      return {
        say: `${verse} Which letter is this verse for?`,
        options: shuffle([letter, ...others.map(v => v[0])]).map(x => ({ html: x + x.toLowerCase(), value: x })), answer: letter,
        explain: `${verse} This is the ${letter} verse.`,
      };
    },
  },
  {
    id: 'b-meaning', name: 'What does it mean?', emoji: '💡',
    gen(l) {
      const [, verse, ref, , meaning] = pickVerse(VERSES);
      const wrong = sample(VERSES.filter(v => v[4] !== meaning), 2).map(v => v[4]);
      return {
        say: `${verse} What does this verse mean?`, readFirst: l === 3,
        visual: `<div class="sentence" style="font-size:clamp(24px,4vw,38px)">${esc(verse)}</div>`,
        options: shuffle([meaning, ...wrong]).map(m => ({ html: `<span class="lbl" style="font-size:22px">${esc(m)}</span>`, value: m, say: m })), answer: meaning,
        explain: `${verse} This means: ${meaning}`,
      };
    },
  },
  {
    id: 'b-where', name: 'Where is it found?', emoji: '📍',
    gen() {
      const [, verse, ref] = pickVerse(VERSES);
      const wrong = sample([...new Set(VERSES.map(v => v[2]).filter(r => r !== ref))], 2);
      return {
        say: `Where in the Bible do we find: ${verse}`,
        visual: `<div class="sentence" style="font-size:clamp(24px,4vw,38px)">${esc(verse)}</div>`,
        options: shuffle([ref, ...wrong]).map(r => ({ html: r, value: r, say: r })), answer: ref,
        explain: `${verse} That is ${ref}.`,
      };
    },
  },
  {
    id: 'b-story', name: 'Bible stories', emoji: '✝️',
    gen(l) {
      const [title, pic, story, qs] = Math.random() < 0.5 ? pick(STORIES.slice(0, 2)) : pick(STORIES); // Salvation is on the exam
      const [q, a, ...wrong] = pick(qs);
      return {
        // Level 1-2: Ollie reads the story. Level 3: she reads it herself.
        say: l < 3 ? `Listen to the story: ${title}. ${story} ... ${q}` : `Read the story: ${title}. Then answer the question.`,
        text: q, readFirst: l === 3,
        visual: `<div style="font-size:70px">${pic}</div><div class="sentence" style="font-size:clamp(20px,3.4vw,30px);text-align:left">${esc(story)}</div>`,
        options: shuffle([a, ...wrong]).map(o => ({ html: esc(o), value: o, say: o })), answer: a,
        explain: `The story says: ${story}`,
      };
    },
  },

  {
    id: 'b-drill', name: 'Bible drill', emoji: '⏱️',
    gen(l) {
      // Hear the reference, find the verse (like a class Bible drill)
      const [letter, verse, ref] = pickVerse(VERSES);
      const others = sample(VERSES.filter(v => v[1] !== verse), 2).map(v => v[1]);
      return {
        say: `Bible drill! Find the verse: ${ref}.`, text: `Bible drill! Find ${ref}`, readFirst: l > 1,
        visual: `<div class="word-big" style="font-size:clamp(32px,6vw,58px)">📖 ${ref}</div>`,
        options: shuffle([verse, ...others]).map(v => ({ html: `<span class="lbl" style="font-size:22px">${esc(v)}</span>`, value: v, say: v })), answer: verse,
        explain: `${ref}: ${verse}`,
      };
    },
  },
];

