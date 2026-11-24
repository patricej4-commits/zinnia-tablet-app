# Zinnia's Adventure 🦉

A learning game for Zinnia's tablet, built from her Grade 1 class work (Google Classroom, Term 1 2026–27).
Ollie the owl talks to her, shows pictures, makes her read, and rewards her with coins, stars, stickers and a pet that grows. No fantasy or magic content (no monsters, witches, wizards, unicorns, fairies or dragons).

## The eight areas

| World | What she practises (from her class materials) |
|---|---|
| 🦁 **Sound Safari** | Vowels & consonants, Special Sounds Charts 6, 7 & 8, chart key words, one- and two-vowel rules, **marking vowels** (smile ˘ / dash ¯ / slash, never mark the u after q), C/K rule, ck/k/ke endings, double endings (ff, ll, ss, zz). **Spelling:** spell what she hears (sound-chunk tiles like sh, igh, ck at higher levels, spelling-test mode), missing letters, Abeka vowel blends (ba, be, bi…), spot the right spelling |
| 🐝 **Spelling Bee** | Her Abeka **Spelling Lists 1–12** (exam: lists 1–11) with the book's rules: spell the word she hears (sound-chunk tiles; spelling-test mode at level 3), fill in the missing special sound, unscramble, finish the sentence (workbook sentences), clue words, rhyming words, sight words |
| 🏰 **Word Castle** | Nouns (person/place/animal/thing), common & proper nouns, singular & plural (s / es), a/an/the, pronouns (I, me, my, mine, you, your, yours, he, she, they…), am/is/are, was/were, verbs, adjectives, compound words, writing a correct sentence. **Parts of speech:** say what kind of word it is (noun, verb, adjective, pronoun), find it in a sentence, use the right kind of word to finish a sentence, **build sentences** from word tiles |
| 🐒 **Number Jungle** | Counting, number names 0–19, counting on & back, more/fewer, one-to-one, ordering, tens & ones, number bonds (part-part-whole), adding, **take away with ten frames, number sentences and column layout** (big number on top, minus and number below, line, answer; within 10 like class, teen numbers in tens & ones at level 3), column adding, patterns (incl. finding the core), regrouping sets, before/after/between, maths story problems, spelling number words, partitioning, shapes (natural/man-made), straight & curved lines |
| 🐸 **Number lines** (in Number Jungle) | Watch-and-learn lessons (Froggy hops while Ollie counts), building the line (missing numbers), reading where the arrow points, tapping a number, **hopping to add (right) and take away (left)** one tap per hop, bigger/smaller. First visit starts with the lesson; Today's Adventure always includes number lines (switch in Parent Zone) |
| 🐬 **Listening Lagoon** | Following spoken instructions, listening to short stories, hearing words, first sounds, rhymes, counting words she hears (limited replays to build focus) |
| 🌳 **Story Tree** | Reading sentences **out loud** (the microphone checks her reading), reading and matching pictures, sight words, 12 short stories with who/what/where/why/what-happened-first questions |
| 📖 **Bible Time** | The class **A–Z Bible memory verses** (KJV, from her teacher's Bible Cards): finish the verse, which letter, what it means, where it is found; Bible stories (Creation, Noah, David & Goliath, Jonah, Daniel, Baby Jesus, feeding the 5000, the lost sheep) |
| 🌎 **My World** | My body, healthy food, groups & rules, religious & ethnic groups, good & bad habits, computers (IT study guide), music notes & symbols |

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
- ~~Watch me first~~ worked examples were removed at the parent's request. After a second wrong answer Ollie still explains the rule and shows the right answer.
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

## From the Google Classroom log (Sept–Nov 2026)
Added from Ms Bennett's posts and slides: Opposites (her full list), one more / one less, measuring with body parts (hand span, cubit, foot pace, foot span, arm span), centimetres vs metres, tall/short and wide/narrow, analogue vs digital clocks, Go/Glow/Grow foods and traffic light foods in her words, all six food providers, needs vs wants, iris and hair follicles, exercise, the 16 Bible doctrinal drills, IT step-by-step instructions (ordering steps) and her hardware/software definitions.

## Every topic, every day, with exam practice woven in
- **Daily mission = every topic in every area** (about 100 questions; each topic at least once a day). Areas run in rounds of up to 8 new topics. Each topic shows its level (1–3) and a ✅ once done today. Parents can switch to a lighter mission (3–10 per area) in the Parent Zone.
- **Exam practice everywhere:** in every game, every third question is an extra 📝 exam question from the weakest topic of an upcoming exam (more urgent exams more often). These count toward the day's exam practice.
- Spanish has been removed.

## Measuring exam readiness
- **📊 Readiness meter on the map:** a bar for each upcoming exam with the days left, and a "Take a practice test" button.
- **📝 Practice tests (mock exams):** 10 questions across all of an exam's topics at exam difficulty, one try each, no hints or worked examples, scored like a test (e.g. 9 out of 10 = 90%). Start one from the map or from the Parent Zone (a button for each exam). They also count as exam practice.
- **Readiness score** = half daily practice (accuracy × level × amount of practice on every revision-guide topic) + half her last two practice tests from the past 14 days. 75%+ = Ready.

## "Done today" is kept
The day changes at midnight on the tablet's own clock (it used to change at 7 pm Jamaica time because of GMT). Each time the app opens it re-ticks every topic she practised today (from the question log and each topic's last-practised time) and moves any work filed under "tomorrow" back to today. A finished mission or plan stays finished for the rest of the day. The map shows how many topics she has done today.

## 📈 How am I doing? (daily scores)
On the map (📈 button) and in the Parent Zone: a chart of her score every day (questions right first time) for the last 14 days, and a day-by-day list (last 30 days) with each day compared with the day before (⬆️ better / ⬇️ lower / ➡️ same), stars, questions, topics, minutes, mission done, and a score for each area with its own ⬆️⬇️. Ollie reads out today's score and how it compares with the day before.

## Sittings (time on the tablet)
Default: **5 sittings of 30 minutes a day, with at least 30 minutes break between them.** A timer shows the minutes left and which sitting it is. When time is up she finishes the question she is on, sees her results, and goes to the break screen (work saved). During a break the game is locked; when the break is over a "Start sitting" button appears. After the last sitting the game is done for the day. Parent Zone: change sitting length, number of sittings and break length, or give one extra sitting now.
- **Break cues:** "You've been playing for 15 minutes…" at halfway, "…5 minutes left" and "Almost break time!" with 1 minute left (shown on screen at once, spoken before the next question so Ollie never talks over a question). At the end: "You've been playing for 30 minutes. Time to take a break!" with break ideas and today's total minutes.

## Longer day when she struggles
After 20+ answers in a day, if fewer than 70% are right first time she gets 1 extra sitting (under 50%: 2 extra).
The extra sitting is spent on "💪 Extra practice: the tricky things": the topics she got wrong today (then her weakest overall).
An area she must redo still comes first. Parents can switch this off in the Parent Zone, which also shows today's first-try score.

## Language 1 workbook (Abeka)
Topics built from her workbook pages (Lessons 13–30+): Picture words (fig/fit, pen/pet, duck/ducks...), Finish the sentence
(The rat had a bat, The cat had a nap...), Word bank stories (The Goat, The Hike, Ted and Tip, Greg's Boat), Sentence for the
picture, Riddles, Rhyming words (Sound Safari, counts for Phonics) and Capital letter & period (Word Castle, counts for Grammar).

## New words, not just list words
About 4 in 10 spelling questions use a NEW word that follows the same rule as her list (e.g. list 4 ck/ke: neck, joke, hike),
marked "🆕 New word! Use the list N rule". The sound charts and vowel rules also have many extra words, so she learns
the rule and can spell words the teacher picks that are not on the list.

## Rules and steps, all the time
- 📌 Every grammar question shows its rule in the teacher's words (a noun is the name of a person, animal, place or thing;
  a verb is an action word or doing word; an adjective is a describing word; a pronoun takes the place of a noun ...).
  Ollie reads it the first time in a game, after a mistake, and every 3rd time.
- Every adding / take away question shows the numbered steps; for column sums Ollie says the steps every time.
- New topics: "What is a…?" (Word Castle) and "Steps for adding & take away" (Number Jungle), plus a "📌 Quick check"
  from them woven into every 4th question of grammar and maths games.

## Principles: what things are and WHY
- 📌 Rules on screen in every area: phonics (special sounds, one/two vowels, c/k/ck/ke, ll/ff/ss, blends, rhymes),
  spelling (the rule of the word's list), reading (how to find answers), maths (bonds, tens & ones, < >, clocks, counting, patterns), Bible.
- 💡 After a RIGHT answer the reason is shown too ("Why? ..."), and read out every other time.
- New topics: "Why is it spelled that way?" (Sound Safari), "why" questions in "What is a…?" and maths steps.
- Health, Safety & Manners 1 (Abeka, pages 2–37): 3 My World topics with every habit's reason — growing, habits, the 5 food
  groups, breakfast, snacks, exercise, sunshine, rest, sleep, posture, skin, germs, nails, hair, eyes, ears, nose, teeth,
  clothes, home and chores, with the book's Bible verses. Counted for Integrated Studies.

## How-to steps, memory and stretch
- HOW TO steps on screen for spelling a word, reading a new word, answering a story question, finding word types, word problems,
  telling time, the number line, writing a sentence and rhyming. New topics "How do I spell it?" and "How do I read it?" ask the steps.
- Memory: a missed question comes back 3–4 questions later in the same game, then on later days (after 1, 3, 7, 14 days) until she
  gets it right first time each time. Parent Zone shows the memory list.
- Challenge: at the top spelling level, challenge questions use 🌟 stretch words (sunset, picnic, rainbow, toothbrush...) built from her rules.

## Roll-over
Anything not finished yesterday (topics, a redo area's missed topics, exam practice questions) is added to today as
"📦 Yesterday's unfinished work", done first, on top of today's plan. Only one day's worth carries (no snowballing);
25+ carried topics adds one extra sitting. Switch off in the Parent Zone.

## Rewards: 220 stickers + golden stickers, and the 🎀 Fun Zone
- 220 stickers on 14 themed pages (Animals, Under the sea, Church & Bible, Jamaica & beach, ...). After all of them she wins ✨ golden versions.
- 🎟️ Fun Zone tickets: 1 for a 3-star game, 1 for finishing the mission, 2 for finishing today's plan. One ticket = 5 minutes of:
  🛍️ Shop (buy clothes with her coins, paying by tapping 10, 5 and 1 coins = tens & ones), 👗 Dress up (Ollie describes the outfit),
  💇‍♀️ Salon (hair styles, colours, clips, nails; customers ask for a look out loud — listen, then style; +5 coins when right).

- Fun Zone is hands-on (no words to press): drag things into the shop basket and coins onto the counter; drag clothes onto the doll;
  in the salon rub shampoo into her hair (bubbles), rinse, blow-dry and comb (sparkles, shiny hair), drag bows anywhere on her hair,
  pick hairstyles from little pictures, and paint each nail on a big hand.

## 🌶️ Chip Challenge (two players, pass and play)
Zinnia and a grown-up each secretly hide 1–3 hot chips in a grid of 12, 16 or 20 chips (a "look away!" screen between turns).
Take turns: tap a chip to point at it, tap again to eat it. Safe = crunch; hot chip = lose a life (your own count too; a chip both
picked is a double hot chip). Out of lives = lose; the board then shows where every hot chip was. Wins are counted.
Open it from the map or the break screen any time; it does not use sitting time.
