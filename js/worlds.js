import { phonicsSkills } from './data/phonics.js';
import { grammarSkills } from './data/grammar.js';
import { mathSkills } from './data/maths.js';
import { listenSkills } from './data/listening.js';
import { readingSkills } from './data/reading.js';
import { worldSkills } from './data/myworld.js';
import { bibleSkills } from './data/bible.js';
import { spellingSkills } from './data/spelling.js';
import { workbookSkills } from './data/workbook.js';
import { grammarRuleSkills, mathStepSkills, phonicsWhySkills } from './data/rules.js';
import { healthSkills } from './data/health.js';
// Language 1 workbook topics go into the area they belong to
const wb = p => workbookSkills.filter(sk => sk.id.startsWith(p));

export const WORLDS = [
  { id: 'sound', name: 'Sound Safari', emo: '🦁', cls: 'w-sound', skills: [...phonicsSkills, ...wb('p-'), ...phonicsWhySkills], intro: 'Welcome to Sound Safari! Let\'s hunt for special sounds!' },
  { id: 'spell', name: 'Spelling Bee', emo: '🐝', cls: 'w-spell', skills: spellingSkills, intro: 'Welcome to the Spelling Bee! These are your spelling list words!' },
  { id: 'word', name: 'Word Castle', emo: '🏰', cls: 'w-word', skills: [...grammarRuleSkills, ...grammarSkills, ...wb('g-')], intro: 'Welcome to Word Castle! Let us play with words!' },
  { id: 'number', name: 'Number Jungle', emo: '🐒', cls: 'w-number', skills: [...mathSkills, ...mathStepSkills], intro: 'Welcome to Number Jungle! Let\'s count with the monkeys!' },
  { id: 'listen', name: 'Listening Lagoon', emo: '🐬', cls: 'w-listen', skills: listenSkills, intro: 'Welcome to Listening Lagoon! Turn on your super listening ears!' },
  { id: 'story', name: 'Story Tree', emo: '🌳', cls: 'w-story', skills: [...readingSkills, ...wb('r-')], intro: 'Welcome to the Story Tree! Time to read like a superstar!' },
  { id: 'bible', name: 'Bible Time', emo: '📖', cls: 'w-bible', skills: bibleSkills, intro: 'Welcome to Bible Time! Let us learn God\'s Word!' },
  { id: 'myworld', name: 'My World', emo: '🌎', cls: 'w-world', skills: [...worldSkills, ...healthSkills], intro: 'Welcome to My World! Let\'s learn about you and the world around you!' },
];

export const ALL_SKILLS = WORLDS.flatMap(w => w.skills);
