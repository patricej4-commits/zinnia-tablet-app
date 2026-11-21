# Zinnia's Adventure 🦉

A learning game for Zinnia's tablet, built from her Grade 1 class work (Google Classroom, Term 1 2026–27).
Ollie the owl talks to her, shows pictures, makes her read, and rewards her with coins, stars, stickers and a pet that grows. No fantasy or magic content (no monsters, witches, wizards, unicorns, fairies or dragons).

## The six worlds

| World | What she practises (from her class materials) |
|---|---|
| 🦁 **Sound Safari** | Vowels & consonants, Special Sounds Charts 6, 7 & 8, chart key words, one- and two-vowel rules, **marking vowels** (smile ˘ / dash ¯ / slash, never mark the u after q), C/K rule, ck/k/ke endings, double endings (ff, ll, ss, zz), spelling |
| 🏰 **Word Castle** | Nouns (person/place/animal/thing), common & proper nouns, singular & plural (s / es), a/an/the, pronouns (I, me, my, mine, you, your, yours, he, she, they…), am/is/are, was/were, verbs, adjectives, compound words, writing a correct sentence |
| 🐒 **Number Jungle** | Counting, number names 0–19, counting on & back, more/fewer, one-to-one, ordering, tens & ones, number bonds (part-part-whole), adding, **take away with ten frames, number sentences and column layout** (big number on top, minus and number below, line, answer; within 10 like class, teen numbers in tens & ones at level 3), column adding, patterns, partitioning, shapes (natural/man-made), straight & curved lines |
| 🐬 **Listening Lagoon** | Following spoken instructions, listening to short stories, hearing words, first sounds, rhymes, counting words she hears (limited replays to build focus) |
| 🌳 **Story Tree** | Reading sentences **out loud** (the microphone checks her reading), reading and matching pictures, sight words, short stories with questions |
| 🌎 **My World** | My body, healthy food, groups & rules, religious & ethnic groups, good & bad habits, computers (IT study guide), music symbols, Spanish greetings |

## How it teaches
- **Adaptive:** every skill has 3 levels. Three right in a row → harder. Mistakes → easier, and the skill comes back more often. "Today's Adventure" always picks the skills she needs most.
- **Makes her read:** reading questions are never read out to her. Ollie only gives the instruction.
- **Mistakes become lessons:** first mistake → "try again". Second → Ollie explains the rule (using the teacher's wording), and that question comes back later in the game.
- **Never stuck:** two misses in a row → an easy question she already knows, to rebuild confidence.
- **Stretch:** three right in a row → a harder ⭐ Challenge question for double coins. Missing a challenge never counts against her.
- **Forgiving microphone:** if the mic can't understand her after three tries, she gets praise for her effort and moves on.
- **Game rewards:** coins, combo streaks 🔥, 1–3 stars per game, a treasure chest with a new sticker every game, and a surprise pet (puppy, kitty, dove, bunny or lamb) that grows with stars.

## Parent Zone
Tap 👪 (top right) and answer the grown-up multiplication question. There you can:
- See time played, accuracy per skill, and the skills that need the most practice
- Change the voice, talking speed, questions per game, daily time limit and microphone, and reset progress

All progress stays on the tablet; nothing is sent anywhere.

## Install on the tablet
The app has to be hosted on an HTTPS address. Then:
- **Android (Chrome):** open the link → ⋮ menu → **Add to Home screen** / **Install app**
- **iPad (Safari):** open the link → Share button → **Add to Home Screen**

Open it once while online; after that it works offline. The read-aloud microphone check needs Chrome on Android (it uses Google's speech service, so it needs internet). Where it isn't available, reading turns into "read it, then tap the matching picture".

## Developing
Plain HTML/CSS/JavaScript, no build step. Run `python3 -m http.server` in this folder and open `http://localhost:8000`.
Question content lives in `js/data/*.js`. After changing files, bump `CACHE` in `sw.js` so tablets pick up the update.
