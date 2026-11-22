# Zinnia's Adventure 🦉

A learning game for Zinnia's tablet, built from her Grade 1 class work (Google Classroom, Term 1 2026–27).
Ollie the owl talks to her, shows pictures, makes her read, and rewards her with coins, stars, stickers and a pet that grows. No fantasy or magic content (no monsters, witches, wizards, unicorns, fairies or dragons).

## The seven worlds

| World | What she practises (from her class materials) |
|---|---|
| 🦁 **Sound Safari** | Vowels & consonants, Special Sounds Charts 6, 7 & 8, chart key words, one- and two-vowel rules, **marking vowels** (smile ˘ / dash ¯ / slash, never mark the u after q), C/K rule, ck/k/ke endings, double endings (ff, ll, ss, zz). **Spelling:** spell what she hears (sound-chunk tiles like sh, igh, ck at higher levels, spelling-test mode), missing letters, Abeka vowel blends (ba, be, bi…), spot the right spelling |
| 🏰 **Word Castle** | Nouns (person/place/animal/thing), common & proper nouns, singular & plural (s / es), a/an/the, pronouns (I, me, my, mine, you, your, yours, he, she, they…), am/is/are, was/were, verbs, adjectives, compound words, writing a correct sentence. **Parts of speech:** say what kind of word it is (noun, verb, adjective, pronoun), find it in a sentence, use the right kind of word to finish a sentence, **build sentences** from word tiles |
| 🐒 **Number Jungle** | Counting, number names 0–19, counting on & back, more/fewer, one-to-one, ordering, tens & ones, number bonds (part-part-whole), adding, **take away with ten frames, number sentences and column layout** (big number on top, minus and number below, line, answer; within 10 like class, teen numbers in tens & ones at level 3), column adding, patterns (incl. finding the core), regrouping sets, before/after/between, maths story problems, spelling number words, partitioning, shapes (natural/man-made), straight & curved lines |
| 🐸 **Number lines** (in Number Jungle) | Watch-and-learn lessons (Froggy hops while Ollie counts), building the line (missing numbers), reading where the arrow points, tapping a number, **hopping to add (right) and take away (left)** one tap per hop, bigger/smaller. First visit starts with the lesson; Today's Adventure always includes number lines (switch in Parent Zone) |
| 🐬 **Listening Lagoon** | Following spoken instructions, listening to short stories, hearing words, first sounds, rhymes, counting words she hears (limited replays to build focus) |
| 🌳 **Story Tree** | Reading sentences **out loud** (the microphone checks her reading), reading and matching pictures, sight words, 12 short stories with who/what/where/why/what-happened-first questions |
| 📖 **Bible Time** | The class **A–Z Bible memory verses** (KJV, from her teacher's Bible Cards): finish the verse, which letter, what it means, where it is found; Bible stories (Creation, Noah, David & Goliath, Jonah, Daniel, Baby Jesus, feeding the 5000, the lost sheep) |
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

## Christmas term 2026 exam coverage
Built from the class **1B Christmas Term Revision Guide** (exams Dec 2–8, 2026). The Parent Zone shows the exam timetable with a countdown.
- **Maths:** sets, numbers 1–19, number patterns (skip counting), ordinals, tens & ones, comparing & ordering (ascending/descending), representing numbers, addition & subtraction (number lines, bonds, ten frames, number sentences, column), symbols (= ≠ > < + −), shapes & lines, patterning, measurement (length, calendar, time)
- **Phonics:** vowels & consonants, Special Sounds Charts 6–8, marking, c/k rule, k/ck/ke, rhyming words
- **Grammar:** sentences (capitals & punctuation), possessive nouns, helping verbs (is, are, am, has, have, had, was, were, do, does), nouns, adjectives, pronouns, singular & plural, verbs, common & proper nouns, ABC order
- **Spelling:** spelling by sounds, vowel blends and special sounds (the class Spelling Lists 1–11 can be added when available)
- **Reading & comprehension:** stories with questions, sight words, one- and two-vowel words, special-sound words
- **Integrated Studies:** myself & growth, care for self & home, unique body parts, groups, limbs (names & functions), senses, plants, family, animals (hatch/born, babies & adults), healthy eating (stoplight foods, edible plant parts), food providers
- **Music:** whole/half/quarter notes, parts of a note, staff/stave, treble (G) and bass (F) clefs
- **IT:** what is a computer, hardware & software, input/output/processing, parts (monitor, mouse, keyboard, system unit), types and uses
- **Bible:** verses Aa–Ii (extra focus), Bible drills, Salvation
- Not in the app: penmanship (cursive) and the poem "The Secret" (text not available yet)

## Listening and exam readiness
- **Listening reminders:** Ollie reminds her to listen at the start of every game, every third question and before every listening question (spoken and shown as a 👂 line). Some "try again" messages also remind her to listen.
- **Exam readiness (Parent Zone):** a score for each exam subject = recent accuracy × level reached × amount of practice, across every topic in the revision guide. 75%+ = Ready ✅, 50–74% = Almost ready, 25–49% = Getting there, below 25% = Needs lots of practice. Each subject lists the 3 topics to practise next.
- **📝 Exam Practice button** on the map: practises the next exam coming up (the weaker subject if two are on the same day), focusing on her weakest topics.

## Easy first, understanding, variety, and hearing herself read
- **Watch me first:** the first time she meets a topic (and again if she misses it twice in a game), Ollie shows a worked example with the answer and the reason, then says "Now it is your turn!"
- **Easy to hard:** every topic starts at level 1 and only gets harder after 3 right in a row; games start with a warm-up question she knows; at most 2 brand-new topics per game.
- **Less repetition:** the app remembers the last 400 questions and avoids repeating them, picks a fresh mix of topics each game (topics from the last game are less likely), and asks each topic at most twice per game.
- **Recording:** in "Read it out loud" her reading is recorded and played straight back ("Listen to yourself reading!"), with a ▶️ Hear myself again button. Every reading question also has a 🎙️ button to record and hear herself. Recordings are kept only in memory and deleted when the question ends; nothing is saved or sent anywhere.

## Daily mission and listening first
- **Daily Mission:** a set number of questions in EVERY area each day (default 5 per area = 35 a day; change it in the Parent Zone). The map shows a checklist and a big "Do my mission" button that goes area by area. Finishing earns a trophy, +20 coins and a day streak. The daily time limit only starts after the mission is done. The Parent Zone shows which days the mission was completed.
- **Listen first:** answer buttons are greyed out with "👂 Listen to Ollie first…" until Ollie finishes reading the question.

## Updates
The app checks for a new version when it opens, whenever she comes back to it, and every 30 minutes. A new version is switched in only when she is on the map, never in the middle of a question. Progress is kept.

## Day report and "redo before moving on"
- **Day report (Parent Zone):** pick any date to see every question she answered: the time, the area, the topic, the question and the word or sentence shown, whether she got it right first time (✅), on a second try (🟡) or wrong (❌), and the right answer. There is also a summary per area and whether the daily mission was finished. Kept for 120 days.
- **Must pass to move on:** if she gets more than half of an area's questions wrong (first try) in a round, that area is marked "🔁 practise again". The mission will not count it done, Today's Adventure, Exam Practice and the other areas are locked, and Ollie re-teaches the topics she missed first with a worked example. When she gets at least half right, the area passes and she moves on.
- After 2 failed redos of the same area in one day, the redo uses the easiest level with a worked example for every topic, so she can always get through. The Day report shows how many times each area had to be redone.

## Today's Plan (guided every day)
1. **Mission in every area** (with the "redo if most is wrong" rule)
2. **Exam Practice**: worked out each morning from the exam dates and her readiness, so she is ready by each exam day. About 8–25 questions a day, shared across all upcoming exams by how much each still needs (at least 2 each; exams in the next 3 days get extra), done in exam-date order. Change it in the Parent Zone ("Exam practice each day": Automatic, 10–25, or Off).
3. **Explore**: Today's Adventure, any area and extra exam practice unlock only after steps 1 and 2.

Ollie tells her each step, and after every game the big green button takes her straight to the next one. The Parent Zone shows today's plan and, for each exam, roughly how many more practice questions she still needs and how many a day that is.
