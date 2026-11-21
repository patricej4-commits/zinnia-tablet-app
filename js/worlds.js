import { phonicsSkills } from './data/phonics.js';
import { grammarSkills } from './data/grammar.js';
import { mathSkills } from './data/maths.js';
import { listenSkills } from './data/listening.js';
import { readingSkills } from './data/reading.js';
import { worldSkills } from './data/myworld.js';

export const WORLDS = [
  { id: 'sound', name: 'Sound Safari', emo: '🦁', cls: 'w-sound', skills: phonicsSkills, intro: 'Welcome to Sound Safari! Let\'s hunt for special sounds!' },
  { id: 'word', name: 'Word Castle', emo: '🏰', cls: 'w-word', skills: grammarSkills, intro: 'Welcome to Word Castle! Words are magic here!' },
  { id: 'number', name: 'Number Jungle', emo: '🐒', cls: 'w-number', skills: mathSkills, intro: 'Welcome to Number Jungle! Let\'s count with the monkeys!' },
  { id: 'listen', name: 'Listening Lagoon', emo: '🐬', cls: 'w-listen', skills: listenSkills, intro: 'Welcome to Listening Lagoon! Turn on your super listening ears!' },
  { id: 'story', name: 'Story Tree', emo: '🌳', cls: 'w-story', skills: readingSkills, intro: 'Welcome to the Story Tree! Time to read like a superstar!' },
  { id: 'myworld', name: 'My World', emo: '🌎', cls: 'w-world', skills: worldSkills, intro: 'Welcome to My World! Let\'s learn about you and the world around you!' },
];

export const ALL_SKILLS = WORLDS.flatMap(w => w.skills);
