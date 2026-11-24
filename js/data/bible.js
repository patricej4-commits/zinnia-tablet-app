// Bible Time: the class A-Z Bible memory verse cards (KJV, from her teacher),
// plus well-known Bible stories in simple words.
import { pick, shuffle, sample, esc } from '../util.js';

// [letter, verse (KJV), reference, word to fill in, kid-friendly meaning,
//  wrong words for the blank (they must NOT make a true or sensible verse),
//  meaning tags: meanings that share a tag are too alike to be used as wrong answers for each other]
const VERSES = [
  ['A', 'All have sinned, and come short of the glory of God.', 'Romans 3:23', 'sinned', 'Everyone has done wrong things. We all need Jesus.', ['jumped', 'smiled', 'eaten'], 'sin saved'],
  ['B', 'Believe on the Lord Jesus Christ, and thou shalt be saved.', 'Acts 16:31', 'Jesus', 'If we believe in Jesus, He saves us.', ['Moses', 'David', 'Noah'], 'saved'],
  ['C', 'Children, obey your parents in the Lord: for this is right.', 'Ephesians 6:1', 'parents', 'Listen to Mummy and Daddy and do what they say.', ['toys', 'shoes', 'pets'], 'parents'],
  ['D', 'Depart from evil, and do good.', 'Psalm 34:14', 'good', 'Stay away from bad things. Do good things.', ['wrong', 'evil', 'nothing'], 'behave'],
  ['E', 'Even a child is known by his doings.', 'Proverbs 20:11', 'child', 'People can see what I am like by what I do.', ['chair', 'spoon', 'shoe'], 'behave shine'],
  ['F', 'Fear not: for I am with thee.', 'Isaiah 43:5', 'Fear', 'Do not be afraid. God is with me.', ['Eat', 'Jump', 'Sing'], 'brave near'],
  ['G', 'God is love.', '1st John 4:8', 'love', 'God loves us very much.', ['tired', 'small', 'sleepy'], 'love'],
  ['H', 'Honour thy father and thy mother.', 'Exodus 20:12', 'mother', 'Respect and obey Mummy and Daddy.', ['chair', 'dog', 'ball'], 'parents'],
  ['I', 'If ye shall ask any thing in my name, I will do it.', 'John 14:14', 'ask', 'We can pray and ask Jesus for help.', ['throw', 'hide', 'break'], 'pray'],
  ['J', 'Jesus saith unto him, I am the way, the truth, and the life.', 'John 14:6', 'way', 'Jesus is the way to God.', ['cup', 'box', 'hat'], 'saved'],
  ['K', 'Keep thy tongue from evil.', 'Psalm 34:13', 'tongue', 'Use kind words. Do not say bad things.', ['hat', 'spoon', 'bed'], 'behave'],
  ['L', 'Look unto me, and be ye saved.', 'Isaiah 45:22', 'Look', 'Look to God and He will save us.', ['Sleep', 'Sit', 'Eat'], 'saved seek'],
  ['M', 'My son, give me thine heart.', 'Proverbs 23:26', 'heart', 'God wants us to love Him with all our heart.', ['shoe', 'hat', 'spoon'], 'love seek'],
  ['N', 'No man can serve two masters.', 'Matthew 6:24', 'two', 'We should follow God first.', ['red', 'wet', 'soft'], 'seek behave'],
  ['O', 'O give thanks unto the Lord; for he is good.', 'Psalm 118:1', 'thanks', 'Say thank you to God. He is good!', ['socks', 'sand', 'mud'], 'thanks'],
  ['P', 'Praise ye the Lord: for it is good to sing praises unto our God.', 'Psalm 147:1', 'sing', 'It is good to sing songs to God.', ['eat', 'sleep', 'throw'], 'thanks'],
  ['Q', 'Quit you like men, be strong.', '1st Corinthians 16:13', 'strong', 'Be brave and strong.', ['lazy', 'sleepy', 'scared'], 'brave'],
  ['R', 'Remember the sabbath day, to keep it holy.', 'Exodus 20:8', 'holy', 'Keep God\'s special day for Him.', ['messy', 'noisy', 'muddy'], 'sabbath'],
  ['S', 'Seek ye the Lord while he may be found.', 'Isaiah 55:6', 'Seek', 'Look for God and get to know Him.', ['Hide', 'Sleep', 'Forget'], 'seek saved pray'],
  ['T', 'Thou God seest me.', 'Genesis 16:13', 'seest', 'God always sees me.', ['sits', 'runs', 'jumps'], 'near'],
  ['U', 'Unto thee, O God, do we give thanks.', 'Psalm 75:1', 'thanks', 'We say thank you to God.', ['socks', 'sand', 'mud'], 'thanks'],
  ['V', 'Verily, verily, I say unto you, Whatsoever ye shall ask the Father in my name, he will give it you.', 'John 16:23', 'Father', 'We can ask God the Father for what we need.', ['Table', 'Window', 'Spoon'], 'pray'],
  ['W', 'What time I am afraid, I will trust in thee.', 'Psalm 56:3', 'trust', 'When I am scared, I trust God.', ['sneeze', 'yawn', 'spill'], 'brave near'],
  ['X', 'Exceeding great and precious promises are given unto us.', '2nd Peter 1:4', 'promises', 'God gives us great promises.', ['puddles', 'socks', 'crumbs'], 'promise'],
  ['Y', 'Ye are the light of the world.', 'Matthew 5:14', 'light', 'We shine God\'s love for others to see.', ['spoons', 'socks', 'chairs'], 'shine'],
  ['Z', 'Zion heard, and was glad.', 'Psalm 97:8', 'glad', 'God\'s people were happy.', ['square', 'wet', 'sticky'], 'glad'],
];
// Do two verses' meanings share a tag (so one would also fit the other)?
const alike = (a, b) => a[6].split(' ').some(t => b[6].split(' ').includes(t));

// Bible stories: [title, picture, story, [question, answer, wrong, wrong]...]
const STORIES = [
  ['Salvation: God\'s gift', '✝️', 'God made us and He loves us very much. But all of us have done wrong things. That is called sin. Sin keeps us away from God. God sent His Son, Jesus, to die on the cross for our sins. Three days later, Jesus rose again! If we believe in Jesus and ask Him to forgive us, we are saved. We become part of God\'s family forever.',
    [['Who loves us very much?', 'God', 'the king', 'Goliath'], ['What do we call the wrong things we do?', 'sin', 'love', 'prayer'], ['Who did God send to save us?', 'Jesus', 'Noah', 'Jonah'], ['What did Jesus do three days later?', 'He rose again', 'He went fishing', 'He built an ark'], ['How are we saved?', 'by believing in Jesus', 'by being rich', 'by being tall']]],
  ['Salvation: God\'s gift', '✝️', 'Romans 3:23 says: All have sinned, and come short of the glory of God. Acts 16:31 says: Believe on the Lord Jesus Christ, and thou shalt be saved. Jesus died for us and rose again. When we believe in Him, He forgives us and we can live with God forever.',
    [['Who has sinned?', 'all of us', 'nobody', 'only grown-ups'], ['What must we do to be saved?', 'believe on the Lord Jesus Christ', 'eat good food', 'go to the beach'], ['What does Jesus do when we believe?', 'He forgives us', 'He gets angry', 'He goes away']]],
  ['God made the world', '🌍', 'In the beginning, God made the heavens and the earth. He made the sun, the moon and the stars. He made the plants, the fish, the birds and the animals. Then God made people. God saw that it was very good.',
    [['Who made the world?', 'God', 'Noah', 'David'], ['What did God make last?', 'people', 'fish', 'the sun'], ['What did God say about everything He made?', 'It was very good', 'It was bad', 'It was too small']]],
  ['Noah and the ark', '🛶', 'God told Noah to build a big boat called an ark. Noah obeyed God. The animals went into the ark two by two. It rained for forty days and forty nights. God kept Noah safe. Then God put a rainbow in the sky as a promise.',
    [['What did Noah build?', 'an ark', 'a house', 'a tower'], ['How did the animals go into the ark?', 'two by two', 'one by one', 'ten by ten'], ['What did God put in the sky as a promise?', 'a rainbow', 'a star', 'a cloud']]],
  ['David and Goliath', '👦', 'Goliath was a very big giant. Everyone was afraid of him. David was just a boy, but he trusted God. David put a small stone in his sling. The stone hit Goliath and he fell down. God helped David win!',
    [['Who was the big giant?', 'Goliath', 'David', 'Moses'], ['What did David use?', 'a sling and a stone', 'a big sword', 'a bow'], ['Who helped David win?', 'God', 'the king', 'his brothers']]],
  ['Jonah and the big fish', '🐟', 'God told Jonah to go to Nineveh. Jonah did not obey. He got on a ship going the other way. A big storm came. Jonah was thrown into the sea and a big fish swallowed him. Jonah prayed. The fish spat him out, and Jonah obeyed God.',
    [['What swallowed Jonah?', 'a big fish', 'a lion', 'a bird'], ['What did Jonah do inside the fish?', 'He prayed', 'He played', 'He sang'], ['Where did God tell Jonah to go?', 'Nineveh', 'Egypt', 'the beach']]],
  ['Daniel and the lions', '🦁', 'Daniel prayed to God three times every day. Some bad men made a rule that no one could pray to God. Daniel still prayed. He was put in a den of lions. God sent an angel to shut the lions\' mouths. God kept Daniel safe!',
    [['Who did Daniel pray to?', 'God', 'the king', 'the lions'], ['Where was Daniel put?', 'in a lions\' den', 'in a boat', 'in a tree'], ['Who kept Daniel safe?', 'God', 'the lions', 'the bad men']]],
  ['Baby Jesus is born', '👶', 'Mary and Joseph went to Bethlehem. There was no room at the inn. Baby Jesus was born there, in Bethlehem. Mary laid Him in a manger. Angels told the shepherds the good news. A bright star led wise men to Jesus.',
    [['Where was Jesus born?', 'Bethlehem', 'Nineveh', 'Egypt'], ['Where was baby Jesus laid?', 'in a manger', 'in a boat', 'in a big bed'], ['What led the wise men to Jesus?', 'a bright star', 'a rainbow', 'a big fish']]],
  ['Jesus feeds 5000', '🍞', 'Many people came to listen to Jesus. They were hungry. A boy shared his lunch of five loaves of bread and two fish. Jesus gave thanks and broke the bread. Everyone ate and was full!',
    [['What did the boy share?', 'five loaves and two fish', 'ten mangoes', 'a cake'], ['What did Jesus do before sharing the food?', 'He gave thanks', 'He slept', 'He went home'], ['Were the people still hungry after?', 'No, everyone was full', 'Yes, very hungry', 'Only Jesus ate']]],
  ['The lost sheep', '🐑', 'A shepherd had one hundred sheep. One little sheep got lost. The shepherd left the others and looked everywhere until he found it. He was so happy! Jesus loves us like that shepherd.',
    [['How many sheep got lost?', 'one', 'ten', 'one hundred'], ['How did the shepherd feel when he found it?', 'happy', 'angry', 'sleepy'], ['Who loves us like the shepherd?', 'Jesus', 'the sheep', 'the king']]],
];

// The one sentence of a story that holds the answer (for the explanation)
const WORDS = t => t.toLowerCase().match(/[a-z']+/g) || [];
const SKIP = new Set('a an the he she it we us they them his her of to in on and was did do what who how where is are be by for that this with into'.split(' '));
const stem = w => w.replace(/(ing|ed|es|s)$/, '').slice(0, 5);
function storyLine(story, q, a) {
  const lines = story.match(/[^.!?]+[.!?]+/g).map(x => x.trim());
  const aw = WORDS(a).filter(w => !SKIP.has(w)).map(stem), qw = WORDS(q).filter(w => !SKIP.has(w)).map(stem);
  const score = line => { const lw = WORDS(line).map(stem); return aw.filter(w => lw.includes(w)).length * 3 + qw.filter(w => lw.includes(w)).length; };
  return lines.reduce((best, line) => (score(line) > score(best) ? line : best), lines[0]);
}

// Christmas term exam covers verses Aa - Ii: they come up 3 times as often
const EXAM = VERSES.filter(v => 'ABCDEFGHI'.includes(v[0]));
const pickVerse = pool => (Math.random() < 0.75 ? pick(pool.filter(v => EXAM.includes(v)).length ? pool.filter(v => EXAM.includes(v)) : pool) : pick(pool));

export const bibleSkills = [
  {
    id: 'b-verse', name: 'Finish the verse', emoji: '📖',
    gen(l) {
      const pool = l === 1 ? VERSES.filter(v => v[1].length < 45) : VERSES;
      const [letter, verse, ref, word, , wrongWords] = pickVerse(pool);
      // Wrong words are chosen for this verse, so none of them makes a true or sensible verse
      const wrong = sample(wrongWords, 2);
      const blanked = verse.replace(word, '___');
      const first = blanked.startsWith('___');
      return {
        say: l < 3 ? `${blanked.replace('___', 'blank')} ${ref}. Tap the word that goes in the blank.` : 'Read the verse. Tap the word that goes in the blank.',
        text: l < 3 ? 'Tap the word that goes in the blank.' : undefined,
        readFirst: l === 3,
        visual: `<div style="flex-basis:100%;display:flex;justify-content:center;align-items:center;gap:12px;font-size:22px;color:#7a70b0"><span style="background:#5b3fd1;color:#fff;border-radius:14px;padding:2px 14px;font-weight:700">${letter}${letter.toLowerCase()}</span>${ref}</div>`
          + `<div class="sentence" style="font-size:clamp(26px,4.4vw,42px)">${esc(blanked).replace('___', '<span style="color:#5b3fd1;border-bottom:5px solid #5b3fd1;padding:0 18px">?</span>')}</div>`,
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
        say: `Tap the verse for the letter ${letter}.`, readFirst: l > 1,
        visual: `<div class="word-big">${letter}${letter.toLowerCase()}</div>`,
        options: shuffle([verse, ...others.map(v => v[1])]).map(v => ({ html: `<span class="lbl" style="font-size:22px">${esc(v)}</span>`, value: v, say: v })), answer: verse,
        explain: `${letter} is for: ${verse}`,
      };
      return {
        say: `${verse} Which letter does this verse start with? Tap that letter.`, text: 'Which letter does this verse start with? Tap that letter.',
        visual: `<div class="sentence" style="font-size:clamp(24px,4vw,38px)">${esc(verse)}</div>`,
        options: shuffle([letter, ...others.map(v => v[0])]).map(x => ({ html: x + x.toLowerCase(), value: x })), answer: letter,
        explain: `${verse} This is the ${letter} verse.`,
      };
    },
  },
  {
    id: 'b-meaning', name: 'What does it mean?', emoji: '💡',
    gen(l) {
      const v = pickVerse(VERSES);
      const [, verse, , , meaning] = v;
      // Wrong meanings come from verses about something quite different, so only one meaning fits
      const others = shuffle(VERSES.filter(o => !alike(o, v)));
      const wrong = [others[0], others.find(o => !alike(o, others[0]))].map(o => o[4]);
      return {
        say: l === 3 ? 'Read the verse. Tap what it means.' : `${verse} Tap what this verse means.`, text: 'What does this verse mean? Tap the answer.', readFirst: l === 3,
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
        say: `${verse} Where is this verse in the Bible? Tap the right place.`, text: 'Where is this verse in the Bible? Tap the right place.',
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
        // Level 1-2: Ollie reads the story. Level 3: she reads it herself (the whole story is on screen).
        say: l < 3 ? `Listen to the story: ${title}. ${story} ... ${q} Tap the answer.` : `Read the story: ${title}. Then answer: ${q} Tap the answer.`,
        text: `${q} Tap the answer.`, readFirst: l === 3,
        visual: `<div style="font-size:70px">${pic}</div><div class="sentence" style="font-size:clamp(20px,3.4vw,30px);text-align:left">${esc(story)}</div>`,
        options: shuffle([a, ...wrong]).map(o => ({ html: esc(o), value: o, say: o })), answer: a,
        explain: ((line) => (line.includes('says:') ? line : `The story says: ${line}`))(storyLine(story, q, a)),
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
        say: `Bible drill! Tap the verse that is ${ref}.`, readFirst: l > 1,
        visual: `<div class="word-big" style="font-size:clamp(32px,6vw,58px)">📖 ${ref}</div>`,
        options: shuffle([verse, ...others]).map(v => ({ html: `<span class="lbl" style="font-size:22px">${esc(v)}</span>`, value: v, say: v })), answer: verse,
        explain: `${ref}: ${verse}`,
      };
    },
  },

  {
    id: 'b-doctrine', name: 'Doctrinal drills', emoji: '🙏',
    gen(l) {
      const [q, a, wrongs, reason] = pick(DRILLS);
      const wrong = sample(wrongs, 2);
      return {
        say: `${q} Tap the answer.`, readFirst: l === 3,
        visual: '<div style="font-size:90px">✝️</div>',
        options: shuffle([a, ...wrong]).map(x => ({ html: `<span class="lbl" style="font-size:22px">${esc(x)}</span>`, value: x, say: x })), answer: a,
        explain: `${a} ${reason}`,
      };
    },
  },
];
// Ms Bennett's "Bible Time - First Term" doctrinal drills
// [question, answer, wrong answers of the same kind, a short reason]
const DRILLS = [
  ['What is the Bible?', 'The Bible is the holy book of God.', ['The Bible is a storybook someone made up.', 'The Bible is a school reading book.'], 'God gave us the Bible. Every word in it is true.'],
  ['Who wrote the Bible?', 'God inspired godly men to write the Bible.', ['One king wrote it all by himself.', 'Children wrote it at school.'], 'God told godly men what to write. That is why it is God\'s Word.'],
  ['Where can we find the Word of God?', 'In the Bible.', ['In a comic book.', 'On the television.'], 'The Bible is the Word of God.'],
  ['What is sin?', 'Sin is all the bad things we do.', ['Sin is all the good things we do.', 'Sin is a kind of game.'], 'When we do wrong things, that is sin.'],
  ['Who sins?', 'Everyone.', ['Nobody.', 'Only grown-ups.'], 'The Bible says all have sinned. That means every one of us.'],
  ['What are some of the sins we do?', 'Lying, stealing, cheating, fighting and being disobedient.', ['Helping, sharing, praying and obeying.', 'Eating, sleeping, reading and playing.'], 'These are wrong things, so they are sins.'],
  ['Who forgives our sins?', 'God.', ['The teacher.', 'Nobody.'], 'Only God can forgive our sins.'],
  ['How can we ask for forgiveness?', 'By praying.', ['By hiding.', 'By running away.'], 'We pray and tell God we are sorry.'],
  ['Who died for our sins?', 'Jesus.', ['Moses.', 'David.'], 'He died on the cross for us, and He rose again.'],
  ['Does God love sin?', 'No, He hates sin.', ['Yes, He loves sin.', 'Yes, sin makes Him happy.'], 'God is holy. Sin is wrong, and it hurts us.'],
  ['Does God hate us when we sin?', 'No, He still loves us.', ['Yes, He hates us.', 'Yes, He goes away from us.'], 'God hates sin, but He always loves us.'],
  ['What is heaven?', 'Heaven is where we will go to live forever.', ['Heaven is a town in Jamaica.', 'Heaven is a big playground at school.'], 'Heaven is God\'s home. People who believe in Jesus will live there with Him forever.'],
  ['Who will go to heaven?', 'People who believe and accept Jesus as Lord and Saviour.', ['People who are rich.', 'People who are tall and strong.'], 'We get to heaven by believing in Jesus.'],
  ['What will be in heaven?', 'God, angels, joy, peace and happiness.', ['Crying, pain and sadness.', 'Fighting and being afraid.'], 'Heaven is a happy place with God.'],
  ['What will not be in heaven?', 'Crying and pain.', ['God and the angels.', 'Joy and peace.'], 'God will wipe away all tears in heaven.'],
  ['How can we spread the Good News?', 'By telling people we meet about the love of Jesus.', ['By keeping it a secret.', 'By telling only our pets.'], 'The Good News is that Jesus saves. We tell others so they can know Him too.'],
];
