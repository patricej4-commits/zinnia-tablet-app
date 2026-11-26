import { store, save, record, mastery, needWeight, addTime, today, dayKey, resetAll, skill } from './store.js';
import { say, sfx, stopSpeaking, listVoices, refreshVoice, micSupported } from './speech.js';
import { runQuestion } from './games.js';
import { pick, shuffle, esc, rnd } from './util.js';
import { WORLDS, ALL_SKILLS } from './worlds.js';
import { reminderFor } from './data/rules.js';
import { funZone, STICKER_PAGES, ALL_STICKERS } from './fun.js';
import { chipGame } from './chips.js';
import { EXAMS, examReadiness, examSkills, daysUntil, nextExam, examNeed, skillReadiness, mocksFor } from './exam.js';

const app = document.getElementById('app');
const h = html => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
const name = () => store.playerName || 'Zinnia';

// ---------- pets & stickers ----------
const PETS = {
  puppy: { label: 'Puppy', stages: ['🎁', '🐶', '🐕', '🦮'] },
  kitty: { label: 'Kitty', stages: ['🎁', '🐱', '🐈', '🦁'] },
  dove: { label: 'Dove', stages: ['🎁', '🐣', '🐥', '🕊️'] },
  bunny: { label: 'Bunny', stages: ['🎁', '🐰', '🐇', '🐇'] },
  lamb: { label: 'Lamb', stages: ['🎁', '🐑', '🐑', '🐑'] },
};
const PET_STEPS = [0, 5, 15, 35];
// From the Grade 1B Christmas term revision guide
const LISTEN_TIPS = ['Remember to listen carefully!', 'Listening ears on!', 'Listen closely to every word.', 'Good listeners hear the whole question.', 'Ears ready? Listen carefully!', 'Listen first, then answer.'];
const OLD_STICKERS = ['🦋', '🐬', '🕊️', '🌈', '✝️', '📖', '🙏', '⛪', '💖', '🍦', '🧁', '🎀', '👑', '🐠', '🦩', '🐼', '🐨', '🦊', '🐯', '🐸', '🐙', '🦀', '🐳', '🌻', '🌺', '🍓', '🍉', '🍍', '🥭', '🎈', '🎨', '🎵', '🚀', '⭐', '🌙', '☀️', '🪐', '💎', '🏆', '🎁', '🍭', '🐝', '🐞', '🦜', '🐢', '🦒', '🐘', '🦓', '🐧', '🦉', '🌴', '🏝️', '🎠', '🎡', '🛼', '🪁', '🧸', '🍩', '🥥', '🐚', '🦕', '🐿️', '🦔', '🌷'];

const STICKERS = ALL_STICKERS; // 14 themed pages; after all of them, ✨ golden stickers
if (store.pet && !PETS[store.pet.kind]) { store.pet = null; save(); }

function petStage() {
  let s = 0;
  PET_STEPS.forEach((t, i) => { if (store.stars >= t) s = i; });
  return s;
}
function petEmoji() { return store.pet ? PETS[store.pet.kind].stages[petStage()] : '🥚'; }
function petProgress() {
  const s = petStage();
  if (s === PET_STEPS.length - 1) return 1;
  return (store.stars - PET_STEPS[s]) / (PET_STEPS[s + 1] - PET_STEPS[s]);
}

function confetti(n = 40) {
  const box = document.getElementById('confetti');
  const bits = ['🎉', '⭐', '✨', '🌟', '💖', '🎊'];
  for (let i = 0; i < n; i++) {
    const c = document.createElement('i');
    c.textContent = pick(bits);
    c.style.left = Math.random() * 100 + 'vw';
    c.style.animationDuration = 1.6 + Math.random() * 1.8 + 's';
    c.style.animationDelay = Math.random() * 0.6 + 's';
    box.append(c);
    setTimeout(() => c.remove(), 4200);
  }
}
function toast(text) {
  const t = h(`<div class="toast">${text}</div>`);
  document.body.append(t);
  setTimeout(() => t.remove(), 2200);
}

// ---------- Sittings: 40-minute sessions, a break between, up to 5 a day ----------
let timing = false;   // true while she is in the game (not on the start, break or grown-up screens)
let breakShown = false;
function startClock() {}   // time is counted by the sitting ticker below
function stopClock() {}
const sitLimit = () => (store.settings.sittingMinutes || 0) * 60;
const sittings = () => (dayRec().sittings ||= []);
// A sitting's own limit: the normal length + any extra minutes added because she was struggling
const limOf = c => sitLimit() + (c?.ext || 0) * 60;
function curSitting() {
  const a = sittings(), s = a[a.length - 1];
  return s && !s.done && s.secs < limOf(s) ? s : null;
}
// ---------- Longer sitting when she is struggling ----------
// When the sitting is nearly over and she got a lot wrong in it (first try), the sitting is
// stretched once: under 70% right → +10 minutes, under 50% → +15 minutes. The extra time is
// spent practising the things she found tricky.
const SIT_STRUGGLE = { min: 8, one: 0.7, two: 0.5, add1: 10, add2: 15 };
function maybeExtendSitting(c) {
  if (!c || c.ext || store.settings.extendOnStruggle === false || !sitLimit()) return;
  if (c.secs < sitLimit() - 60) return;              // decide in the last minute of the normal time
  const n = c.n || 0, pct = n ? (c.ok || 0) / n : 1;
  if (n < SIT_STRUGGLE.min || pct >= SIT_STRUGGLE.one) return;
  c.ext = pct < SIT_STRUGGLE.two ? SIT_STRUGGLE.add2 : SIT_STRUGGLE.add1;
  c.extFrom = c.secs;
  const text = `Some things were tricky in this sitting, ${name()}. Let's practise them for ${minsWord(c.ext)} more, then it's break time. Practice makes you stronger!`;
  bigToast(`💪 ${text}`);
  sfx.pop();
  if (onMap) say(text); else pendingCue = text;
}
const inExtendedTime = () => { const c = curSitting(); return !!(c?.ext && c.secs >= sitLimit()); };
function sittingState() {
  if (!sitLimit()) return { ok: true };
  const a = sittings(), per = basePer() + autoExtra() + carryExtra();
  const cur = curSitting();
  if (cur) return { ok: true, cur, left: limOf(cur) - cur.secs, n: a.length, per };
  if (a.length >= per) return { ok: false, why: 'done', n: a.length, per };
  const last = a[a.length - 1];
  const until = last ? last.end + (store.settings.breakMinutes || 0) * 60000 : 0;
  if (last && Date.now() < until && !dayRec().skipBreak) return { ok: false, why: 'break', until, n: a.length, per };
  return { ok: true, needNew: true, n: a.length, per };
}
// ---------- Longer day when she is struggling ----------
// When she gets a lot wrong today (first try), she gets 1 or 2 extra sittings,
// and that extra time is spent on the topics she found hard today.
const STRUGGLE = { min: 20, one: 0.7, two: 0.5 }; // after 20+ answers: under 70% right → +1 sitting, under 50% → +2
const basePer = () => (store.settings.sittingsPerDay || 5) + (dayRec().extraSittings || 0);
function todayFirstTry(d = today()) {
  const L = store.log?.[d] || [];
  return { n: L.length, pct: L.length ? L.filter(x => x.r && x.f).length / L.length : 1 };
}
function autoExtra() {
  const dr = dayRec();
  if (store.settings.extendOnStruggle === false || !sitLimit()) return 0;
  const { n, pct } = todayFirstTry();
  const want = n < STRUGGLE.min ? 0 : pct < STRUGGLE.two ? 2 : pct < STRUGGLE.one ? 1 : 0;
  if (want > (dr.autoExtra || 0)) { dr.autoExtra = want; save(); } // never taken away again the same day
  return dr.autoExtra || 0;
}
const inExtraSitting = () => sitLimit() > 0 && autoExtra() > 0 && sittings().length > basePer();
// Today's hardest topics: most wrong (first try) today, then her weakest overall
function hardTopics() {
  const by = {};
  for (const x of store.log?.[today()] || []) { const b = (by[x.s] ||= { n: 0, miss: 0 }); b.n++; if (!(x.r && x.f)) b.miss++; }
  const ids = Object.entries(by).filter(([, b]) => b.miss > 0)
    .sort((a, b) => b[1].miss / b[1].n - a[1].miss / a[1].n || b[1].miss - a[1].miss).map(([id]) => id);
  let sks = ids.map(id => ALL_SKILLS.find(sk => sk.id === id)).filter(Boolean).slice(0, 8);
  if (sks.length < 4) sks = sks.concat(ALL_SKILLS.filter(sk => !sks.includes(sk) && store.skills[sk.id]?.seen)
    .sort((a, b) => mastery(a.id) - mastery(b.id)).slice(0, 4 - sks.length));
  return sks.length ? sks : ALL_SKILLS;
}
const sittingUp = () => sitLimit() > 0 && !curSitting();
// Called before any game screen: starts a new sitting if allowed, otherwise shows the break screen
function gate() {
  let st = sittingState();
  if (st.ok && st.needNew) {
    sittings().push({ start: Date.now(), secs: 0, end: Date.now() });
    dayRec().skipBreak = false;
    save();
    st = sittingState();
  }
  if (!st.ok) { breakScreen(st); return false; }
  timing = true; breakShown = false;
  return true;
}
function sitPillText() {
  if (!sitLimit()) return '';
  const st = sittingState();
  if (!st.ok || !st.cur) return '';
  return `⏱️ ${Math.max(1, Math.ceil(st.left / 60))} min · ${st.n} of ${st.per}`;
}
setInterval(() => {
  if (document.hidden || !timing) return;
  addTime(10);
  const c = curSitting();
  if (c) { c.secs += 10; c.end = Date.now(); maybeExtendSitting(c); if (c.secs >= limOf(c)) c.done = true; checkBreakCues(c); save(); }
  document.querySelectorAll('.sitpill').forEach(el => (el.textContent = sitPillText()));
  // Time is up while she is on the map or a menu: straight to the break screen
  if (sitLimit() && !curSitting() && onMap && !breakShown) breakScreen(sittingState());
}, 10000);
// Always the 12-hour clock (she has not learned the 24-hour clock): "8:46 in the evening"
const clock12 = t => { const d = new Date(t), h = d.getHours(); return `${h % 12 || 12}:${String(d.getMinutes()).padStart(2, '0')}`; };
const partOfDay = t => { const h = new Date(t).getHours(); return h < 12 ? 'in the morning' : h < 17 ? 'in the afternoon' : 'in the evening'; };
const hhmm = t => `${clock12(t)} ${partOfDay(t)}`;
const minsWord = m => `${m} minute${m === 1 ? '' : 's'}`;
// Break cues: halfway, 5 minutes left, 1 minute left. Shown at once; spoken before the next question
// (or straight away on the map), so Ollie never talks over a question.
let pendingCue = null;
function checkBreakCues(c) {
  const lim = limOf(c);
  if (!sitLimit()) return;
  c.cues ||= [];
  const played = Math.round(c.secs / 60), left = Math.max(0, Math.round((lim - c.secs) / 60));
  const cues = [
    ['half', c.ext ? 0 : lim / 2, `You've been playing for ${minsWord(played)}. Great job! ${minsWord(left)} more until your break.`],
    [c.ext ? 'five+' : 'five', lim - 300, `You've been playing for ${minsWord(played)}. ${minsWord(left)} left, then it's break time!`],
    [c.ext ? 'one+' : 'one', lim - 60, `You've been playing for ${minsWord(played)}. Almost break time! Let's finish this one.`],
  ];
  for (const [id, at, text] of cues) {
    if (at <= 0 || c.secs < at || c.cues.includes(id)) continue;
    c.cues.push(id);
    bigToast(`⏰ ${text}`);
    sfx.pop();
    if (onMap) say(text); else pendingCue = text;
    break;
  }
}
function bigToast(text) {
  const t = h(`<div class="toast" style="font-size:22px;max-width:90vw;text-align:center;background:#fff8d6;border:3px solid #ffd23f">${esc(text)}</div>`);
  document.body.append(t);
  setTimeout(() => t.remove(), 6000);
}
const todayMinutes = () => Math.round(sittings().reduce((a, x) => a + x.secs, 0) / 60);

// ---------- Daily mission: a set number of questions in EVERY area, every day ----------
const WORLD_OF = {};
WORLDS.forEach(w => w.skills.forEach(sk => (WORLD_OF[sk.id] = w.id)));
const dayRec = (d = today()) => (store.daily[d] ||= { secs: 0, right: 0, total: 0 });
// Mission mode: 'all' = at least one question on EVERY topic in every area each day (default),
// a number = that many questions per area, 0 = off.
const missionMode = () => store.settings.dailyPerWorld ?? 'all';
const coversAll = () => missionMode() === 'all';
const perWorld = () => (Number(missionMode()) === 0 && !coversAll() ? 0 : 1); // mission on?
const topicDoneToday = (sk, d = today()) => (store.daily[d]?.skills?.[sk.id] || 0) - (store.daily[d]?.carryDone?.[sk.id] || 0) > 0;

// ---------- Roll-over: what was not finished yesterday is added to today ----------
// Worked out once each day from yesterday: topics not done (including yesterday's own carried work)
// and exam practice questions left. Only ONE day's worth carries, so it never snowballs.
function carryInfo() {
  const dr = dayRec();
  if (dr.carry) return dr.carry;
  const empty = { topics: [], exam: {} };
  if (store.settings.rollover === false || perWorld() === 0) return empty;
  const y = new Date(); y.setDate(y.getDate() - 1);
  const yk = dayKey(y), yr = store.daily[yk];
  const playedBefore = Object.keys(store.daily).some(k => k <= yk && (store.daily[k].total || store.daily[k].skills));
  if (!playedBefore) { dr.carry = { ...empty, from: yk }; save(); return dr.carry; }
  const yCarry = yr?.carry?.topics || [];
  const doneY = id => (yr?.skills?.[id] || 0);
  const needY = id => (coversAll() ? 1 : 0) + (yCarry.includes(id) ? 1 : 0);
  let topics = ALL_SKILLS.filter(sk => doneY(sk.id) < needY(sk.id)).map(sk => sk.id);
  // a redo area left unfinished yesterday: its missed topics come too
  for (const w of WORLDS) if (yr?.areas?.[w.id] === 'retry') for (const id of yr.missed?.[w.id] || []) if (!topics.includes(id)) topics.push(id);
  const exam = {};
  for (const it of yr?.examGoal?.items || []) {
    const e = EXAMS.find(x => x.name === it.name);
    const left = it.n - (yr.examDoneBy?.[it.name] || 0);
    if (e && left > 0 && daysUntil(e.date) >= 0) exam[it.name] = Math.min(15, left);
  }
  dr.carry = { from: yk, topics, exam, missedDay: !yr };
  save();
  return dr.carry;
}
const carryLeft = () => carryInfo().topics.filter(id => !(dayRec().carryDone?.[id] > 0));
const carryExtra = () => (carryInfo().topics.length >= 25 ? 1 : 0); // a big roll-over gets one more sitting
const worldDoneToday = (w, d = today()) => (coversAll() ? w.skills.filter(sk => topicDoneToday(sk, d)).length : store.daily[d]?.worlds?.[w.id] || 0);
const areaTarget = w => (coversAll() ? w.skills.length : Number(missionMode()));
// An area is 'retry' when she got most of a round wrong: she must redo it before moving on.
const areaStatus = (w, d = today()) => store.daily[d]?.areas?.[w.id];
const missionLeft = w => {
  const left = Math.max(0, areaTarget(w) - worldDoneToday(w));
  return left === 0 && areaStatus(w) === 'retry' ? 1 : left;
};
function missionDone() { return perWorld() === 0 || !!store.daily[today()]?.missionDone || WORLDS.every(w => missionLeft(w) === 0); }
const retryWorld = () => WORLDS.find(w => areaStatus(w) === 'retry');
const nextMissionWorld = () => retryWorld() || WORLDS.find(w => missionLeft(w) > 0);
const PASS_MARK = 0.5; // she must get at least half right first time to move on

// ---------- Daily log: every question she answers, kept for 120 days ----------
const plainText = html => { const d = document.createElement('div'); d.innerHTML = html || ''; return d.textContent.trim(); };
function answerOf(q) {
  const t = q.type || 'choice';
  if (t === 'choice') {
    const o = (q.options || []).find(o => o.value === q.answer);
    const written = o ? plainText(o.html) : '';
    return (/[a-z0-9]/i.test(written) ? written : o && o.say) || String(q.answer);
  }
  if (t === 'build') return q.word;
  if (t === 'order') return q.answer.join(' ');
  if (t === 'mark') return q.word + ' (marked)';
  if (t === 'numline') return String(q.mode === 'tap' ? q.target : q.start + q.hops);
  if (t === 'read') return q.sentence;
  if (t === 'column') return String(q.op === '-' ? q.top - q.bot : q.top + q.bot);
  return '';
}
function logAnswer(q, sk, res) {
  store.log ||= {};
  const cs = curSitting();
  if (cs) { cs.n = (cs.n || 0) + 1; if (res.correct && res.firstTry) cs.ok = (cs.ok || 0) + 1; }
  const d = today();
  (store.log[d] ||= []).push({
    t: (() => { const d = new Date(); return `${clock12(d)} ${d.getHours() < 12 ? 'am' : 'pm'}`; })(), w: WORLD_OF[sk.id], s: sk.id,
    q: (() => {
      // What was asked + what was on screen (word, sentence, sum...) so you can see exactly what she struggled with
      const asked = plainText(q.say);
      const shown = plainText(q.visual).replace(/\s+/g, ' ');
      const extra = q.sentence ? `"${q.sentence}"` : q.word && q.type !== 'mark' ? `[${q.word}]` : shown && !asked.includes(shown) ? `[${shown.slice(0, 80)}]` : '';
      return (asked + (extra ? ' ' + extra : '')).slice(0, 220);
    })(),
    a: answerOf(q).slice(0, 80), r: res.correct ? 1 : 0, f: res.firstTry ? 1 : 0,
  });
  const days = Object.keys(store.log).sort();
  while (days.length > 120) delete store.log[days.shift()];
}
function missionStreak() {
  let n = 0;
  const d = new Date();
  if (!store.daily[today()]?.missionDone) d.setDate(d.getDate() - 1);
  for (;;) {
    const key = dayKey(d);
    if (!store.daily[key]?.missionDone) break;
    n++; d.setDate(d.getDate() - 1);
  }
  return n;
}
function playMission() {
  const w = nextMissionWorld();
  if (!w) return map(false);
  const redo = areaStatus(w) === 'retry';
  if (coversAll() && !redo) {
    // Every topic in the area: rounds of up to 8 topics she has not done yet today, one question each
    const todo = w.skills.filter(sk => !topicDoneToday(sk));
    return play({ title: 'Daily Mission: ' + w.name, skills: todo, coverAll: true, length: Math.min(8, todo.length), mission: true, world: w });
  }
  const missed = dayRec().missed?.[w.id] || [];
  play({ title: (redo ? 'Practise again: ' : 'Daily Mission: ') + w.name, skills: w.skills, mixed: true, length: Math.max(3, redo ? Math.min(8, missed.length + 3) : missionLeft(w)), mission: true, world: w });
}

// ---------- Today's Plan: 1) mission in every area, 2) exam practice, 3) then free play ----------
// Exam practice: worked out each morning from the exam dates and how ready she is.
// The day's questions are shared across ALL upcoming exams by how much each still needs per day,
// with extra for exams in the next 3 days, done in exam-date order.
function examGoal() {
  const dr = dayRec();
  if (dr.examGoal && dr.examGoal.items) return dr.examGoal;
  if (dr.examGoal === null) return null;
  const setting = store.settings.examPerDay ?? 'auto';
  const upcoming = EXAMS.filter(e => e.date && daysUntil(e.date) >= 0)
    .map(e => ({ e, d: daysUntil(e.date), perDay: examNeed(e) / Math.max(1, daysUntil(e.date)) }))
    .filter(x => x.perDay > 0 || x.d <= 3);
  if (!upcoming.length || setting === 0) { dr.examGoal = null; save(); return null; }
  const sum = upcoming.reduce((a, x) => a + x.perDay, 0);
  const total = setting === 'auto' ? Math.max(8, Math.min(coversAll() ? 16 : 25, Math.ceil(sum))) : Number(setting);
  let items = upcoming.map(x => ({ name: x.e.name, date: x.e.date, n: Math.round((total * x.perDay) / Math.max(sum, 0.001)) + (x.d <= 3 ? 3 : 0) }))
    .sort((a, b) => a.date.localeCompare(b.date)); // every upcoming exam gets some practice
  // keep within the day's total, at least 2 questions per exam that made the list
  while (items.reduce((a, x) => a + x.n, 0) > total + 6) { const big = items.reduce((m, x) => (x.n > m.n ? x : m)); big.n--; }
  items.forEach(x => (x.n = Math.max(2, x.n)));
  // + exam practice left over from yesterday
  for (const [name, n] of Object.entries(carryInfo().exam || {})) {
    const it = items.find(x => x.name === name);
    if (it) { it.n += n; it.carried = n; } else { const e = EXAMS.find(x => x.name === name); if (e) items.push({ name, date: e.date, n, carried: n }); }
  }
  items.sort((a, b) => a.date.localeCompare(b.date));
  dr.examGoal = { n: items.reduce((a, x) => a + x.n, 0), items };
  save();
  return dr.examGoal;
}
const examDoneFor = name => dayRec().examDoneBy?.[name] || 0;
const examDoneToday = () => dayRec().examDone || 0;
const examLeftFor = it => Math.max(0, it.n - examDoneFor(it.name));
const examLeft = () => { const g = examGoal(); return g ? g.items.reduce((a, it) => a + examLeftFor(it), 0) : 0; };
const nextExamItem = () => examGoal()?.items.find(it => examLeftFor(it) > 0);
// Fun Zone: open once ALL of today's work is done, or during a break between sittings
const onBreak = () => sitLimit() > 0 && sittingState().why === 'break';
const funOpen = () => planDone() || onBreak();
function planDone() { return !!store.daily[today()]?.planDone || (missionDone() && !retryWorld() && examLeft() === 0 && carryLeft().length === 0); }
function nextStep() {
  const rw = retryWorld();
  const cl = carryLeft();
  if (!rw && cl.length) return { kind: 'carry', label: `📦 Yesterday's unfinished work (${cl.length} left)`, say: `First, let's finish yesterday's work. ${cl.length} topics are waiting for you!` };
  if (rw) return { kind: 'retry', w: rw, label: `🔁 Practise again: ${rw.emo} ${rw.name}`, say: `Let's practise ${rw.name} again before we move on. I will help you!` };
  if (inExtraSitting() || inExtendedTime()) return { kind: 'hard', label: '💪 Extra practice: the tricky things', say: 'Let\'s practise the things that were tricky today. This extra time will make you stronger. I will help you!' };
  if (!missionDone()) { const w = nextMissionWorld(); return { kind: 'mission', w, label: `▶ ${w.emo} ${w.name}`, say: `Let's do ${w.name}!` }; }
  const it = nextExamItem();
  if (it) {
    const e = EXAMS.find(x => x.name === it.name);
    return { kind: 'exam', e, it, label: `📝 Exam Practice: ${e.emoji} ${e.name}`, say: `Now it is exam practice time! Let's get ready for ${e.name}.` };
  }
  return null;
}
// Exam practice woven into every game: pick an upcoming exam (more urgent = more likely)
// and one of its weakest topics.
function weaveExamSkill(excludeId) {
  const ups = EXAMS.filter(e => e.date && daysUntil(e.date) >= 0)
    .map(e => ({ e, u: examNeed(e) / Math.max(1, daysUntil(e.date)) + (daysUntil(e.date) <= 3 ? 2 : 0) }))
    .filter(x => x.u > 0);
  if (!ups.length) return null;
  let r = Math.random() * ups.reduce((a, x) => a + x.u, 0), exam = ups[ups.length - 1].e;
  for (const x of ups) { r -= x.u; if (r <= 0) { exam = x.e; break; } }
  const weakest = examSkills(exam).filter(sk => sk.id !== excludeId).sort((a, b) => skillReadiness(a.id) - skillReadiness(b.id)).slice(0, 4);
  return weakest.length ? { sk: pick(weakest), exam } : null;
}

// 📝 Practice test (mock exam): 10 questions across all the exam's topics, exam difficulty, one try each
function playMock(exam) {
  play({ title: 'Practice Test: ' + exam.name, skills: examSkills(exam), mock: exam, length: 10, examPractice: exam.name });
}

function playStep() {
  const st = nextStep();
  if (!st) return map(false);
  if (st.kind === 'carry') { const cl = carryLeft().map(id => ALL_SKILLS.find(sk => sk.id === id)).filter(Boolean); return play({ title: "Yesterday's unfinished work", skills: cl, coverAll: true, length: Math.min(8, cl.length), carry: true }); }
  if (st.kind === 'hard') return play({ title: 'Extra practice: the tricky things', skills: hardTopics(), mixed: true, length: store.settings.sessionLength, hard: true });
  if (st.kind === 'exam') return play({ title: 'Exam Practice: ' + st.e.name, skills: examSkills(st.e), mixed: true, length: Math.max(2, Math.min(store.settings.sessionLength + 2, examLeftFor(st.it))), examPractice: st.e.name });
  playMission();
}

function greeting() {
  const hr = new Date().getHours();
  return hr < 12 ? 'Good morning' : hr < 17 ? 'Good afternoon' : 'Good evening';
}

// ========== SCREENS ==========
function splash() {
  timing = false;
  stopSpeaking();
  app.innerHTML = '';
  const s = h(`<div class="screen center splash">
    <div class="mascot">🦉</div>
    <div class="title">${esc(name())}'s<br>Adventure</div>
    <p>Tap to start!</p>
    <button class="big-btn">▶ Play</button>
  </div>`);
  s.querySelector('button').onclick = () => {
    sfx.unlock(); sfx.fanfare();
    if (!store.pet) petPicker(); else map(true);
  };
  app.append(s);
}

function petPicker() {
  app.innerHTML = '';
  const s = h(`<div class="screen center">
    <div class="title">Pick a surprise pet!</div>
    <div class="bubble">Get stars ⭐ to open your gift and help your pet grow!</div>
    <div class="options" style="margin-top:20px"></div>
  </div>`);
  const box = s.querySelector('.options');
  const eggs = { puppy: '🐶', kitty: '🐱', dove: '🕊️', bunny: '🐰', lamb: '🐑' };
  for (const [k, e] of Object.entries(eggs)) {
    const b = h(`<button class="opt"><span class="pic">${e}</span><span class="lbl">${PETS[k].label}</span></button>`);
    b.onclick = () => {
      sfx.correct();
      store.pet = { kind: k, name: PETS[k].label };
      save();
      say(`Great choice! Get stars to open your gift. Then your ${PETS[k].label} will come out!`);
      map(false);
    };
    box.append(b);
  }
  app.append(s);
  say(`Hi ${name()}! I am Ollie the owl. Pick a pet!`);
}

function topbar(back) {
  const bar = h(`<div class="topbar">
    ${back ? '<button class="icon-btn" data-a="back" aria-label="Back">⬅️</button>' : ''}
    <div class="pill">🪙 ${store.coins}</div>
    <div class="pill">⭐ ${store.stars}</div>
    <div class="pill sitpill" style="font-size:18px">${sitPillText()}</div>
    <div class="spacer"></div>
    <button class="icon-btn" data-a="progress" aria-label="How am I doing?">📈</button>
    <button class="icon-btn" data-a="stickers" aria-label="Sticker book">📒</button>
    <button class="icon-btn" data-a="parent" aria-label="Grown-ups" style="font-size:18px">👪</button>
  </div>`);
  bar.querySelectorAll('button').forEach(b => {
    b.onclick = () => {
      sfx.tap();
      const a = b.dataset.a;
      if (a === 'back') back();
      if (a === 'stickers') stickerBook();
      if (a === 'progress') progressScreen();
      if (a === 'parent') parentGate();
    };
  });
  return bar;
}

function worldStars(w) {
  const m = w.skills.reduce((a, s) => a + mastery(s.id), 0) / w.skills.length;
  const seen = w.skills.some(s => store.skills[s.id]);
  const n = !seen ? 0 : m > 0.85 ? 3 : m > 0.6 ? 2 : 1;
  return '⭐'.repeat(n) + '☆'.repeat(3 - n);
}

function map(greet) {
  if (updateReady) { location.reload(); return; }
  onMap = true;
  stopSpeaking();
  document.getElementById('confetti').innerHTML = '';
  if (!gate()) return;
  app.innerHTML = '';
  const s = h('<div class="screen"></div>');
  s.append(topbar(null));
  const step = nextStep();
  const locked = !!step; // free exploring only after today's plan is done
  const doneTopics = Object.keys(store.daily[today()]?.skills || {}).length;
  let line;
  if (step) {
    const first = step.kind === 'mission' && WORLDS.every(w => worldDoneToday(w) === 0) && !store.daily[today()]?.examDone;
    line = `${greet ? greeting() + ', ' + name() + '! ' : ''}${!first && greet && doneTopics ? `You have already done ${doneTopics} topics today. Well done! ` : ''}${first ? "Here is today's plan. First, " : 'Next, '}${step.say.charAt(0).toLowerCase() + step.say.slice(1)} Tap the green button.`;
  } else {
    line = greet ? `${greeting()}, ${name()}! You finished today's plan. Explore anything you like!` : 'Today\'s plan is done! Where shall we explore?';
  }
  const hello = h(`<div class="hello">
    <div class="mascot">🦉</div>
    <div class="say" style="flex:1">${esc(line)}</div>
    <div class="pet-box"><div class="pet" style="font-size:${44 + petStage() * 10}px">${petEmoji()}</div><div class="pet-bar"><i style="width:${Math.round(petProgress() * 100)}%"></i></div></div>
  </div>`);
  hello.querySelector('.pet-box').onclick = () => {
    sfx.pop();
    const st = petStage();
    const msg = st === 0 ? 'Your gift is wiggling! Get more stars to open it!' : st === 3 ? `Your ${store.pet.name} is all grown up and so proud of you!` : `Your ${store.pet.name} says thank you! Earn more stars to help it grow!`;
    say(msg);
    hello.querySelector('.pet').animate([{ transform: 'scale(1)' }, { transform: 'scale(1.4) rotate(10deg)' }, { transform: 'scale(1)' }], 500);
  };
  s.append(hello);

  // ----- Today's Plan card -----
  const g = examGoal();
  const doneN = WORLDS.filter(w => missionLeft(w) === 0).length;
  const card = h(`<div class="mission">
    <h3>📋 Today's Plan ${planDone() ? '🏆' : ''} <small style="font-size:.65em;color:#2ec27e">${doneTopics ? `✅ ${doneTopics} topics done today` : ''}</small></h3>
    ${perWorld() > 0 ? `<div style="font-size:18px;margin-bottom:4px"><b>1.</b> Mission in every area: ${doneN} of ${WORLDS.length} ${missionDone() ? '✅' : ''}</div>
    <div class="mchips">${WORLDS.map(w => `<span class="mchip ${missionLeft(w) === 0 ? 'ok' : ''}">${w.emo} ${areaStatus(w) === 'retry' ? '🔁 again' : missionLeft(w) === 0 ? '✅' : `${worldDoneToday(w)}/${areaTarget(w)}`}</span>`).join('')}</div>` : ''}
    ${g ? `<div style="font-size:18px;margin-bottom:4px"><b>${perWorld() > 0 ? '2.' : '1.'}</b> 📝 Exam practice ${examLeft() === 0 ? '✅' : ''}</div>
    <div class="mchips">${g.items.map(it => { const e = EXAMS.find(x => x.name === it.name); return `<span class="mchip ${examLeftFor(it) === 0 ? 'ok' : ''}">${e.emoji} ${esc(it.name)} ${examLeftFor(it) === 0 ? '✅' : `${Math.min(examDoneFor(it.name), it.n)}/${it.n}`}</span>`; }).join('')}</div>` : ''}
    ${carryInfo().topics.length ? `<div style="font-size:18px;margin-bottom:6px;background:#fff3d6;border-radius:12px;padding:6px 10px">📦 <b>Yesterday's unfinished work:</b> ${carryInfo().topics.length - carryLeft().length} of ${carryInfo().topics.length} topics done ${carryLeft().length ? '' : '✅'}${Object.keys(carryInfo().exam).length ? ` · plus ${Object.values(carryInfo().exam).reduce((a, b) => a + b, 0)} exam practice questions added below` : ''}</div>` : ''}
    <div style="font-size:18px;margin-bottom:10px"><b>${(perWorld() > 0 ? 1 : 0) + (g ? 1 : 0) + 1}.</b> 🗺️ Explore anything ${locked ? '🔒' : '🔓'}</div>
    ${inExtraSitting() ? `<div style="font-size:18px;margin-bottom:10px;background:#fff3d6;border-radius:12px;padding:6px 10px">💪 <b>Extra sitting:</b> today was tricky, so this time is for practising the tricky things.</div>` : ''}
  </div>`);
  if (step) {
    const mb = h(`<button class="big-btn green adventure-btn" style="margin:0">${step.label}</button>`);
    mb.onclick = () => { sfx.tap(); playStep(); };
    card.append(mb);
  } else {
    const st = missionStreak();
    card.append(h(`<div style="font-size:20px">🎉 All done for today! ${st > 1 ? `🔥 ${st} days in a row!` : ''}</div>`));
  }
  s.append(card);

  // ----- 🎀 Fun Zone (reward): uses a ticket won by doing well
  const tk = store.fun?.tickets ?? 1;
  const fzOpen = funOpen();
  const fz = h(`<button class="big-btn adventure-btn" style="background:linear-gradient(#ff9ccf,#ff6fae);color:#fff${fzOpen ? '' : ';opacity:.6'}"><span style="font-size:40px">${fzOpen ? '🎀' : '🔒'}</span> Fun Zone: shop, dress up & salon <small style="font-size:.6em">(🎟️ ${tk} ticket${tk === 1 ? '' : 's'}${fzOpen ? '' : ' · opens at break time or when today\'s work is all done'})</small></button>`);
  fz.onclick = () => { sfx.tap(); openFunZone(); };
  s.append(fz);
  const cg = h(`<button class="big-btn adventure-btn" style="background:linear-gradient(#ffb347,#ff7f11);color:#fff"><span style="font-size:40px">🌶️</span> Chip Challenge <small style="font-size:.6em">(play with a grown-up)</small></button>`);
  cg.onclick = () => { sfx.tap(); openChips(); };
  s.append(cg);

  // ----- 📊 Exam readiness meter (every upcoming exam) -----
  const upcoming = EXAMS.filter(e => e.date && daysUntil(e.date) >= 0);
  if (upcoming.length) {
    const rc = h(`<div class="mission"><h3>📊 How ready am I for my exams?</h3>
      ${upcoming.map(e => { const r = examReadiness(e); const d = daysUntil(e.date);
        return `<div style="display:flex;align-items:center;gap:10px;margin:6px 0;font-size:18px">
          <span style="width:190px">${e.emoji} ${esc(e.name)}<br><small style="color:#7a70b0">${d === 0 ? 'today!' : d === 1 ? 'tomorrow' : 'in ' + d + ' days'}</small></span>
          <div class="bar" style="flex:1;height:18px"><i style="width:${r.pct}%;background:${r.colour}"></i></div>
          <b style="width:110px">${r.pct}% ${r.pct >= 75 ? '✅' : ''}</b></div>`; }).join('')}
    </div>`);
    const nx = nextExam();
    if (nx) {
      const mb2 = h(`<button class="big-btn adventure-btn" style="margin:8px 0 0;font-size:clamp(20px,3.2vw,28px)">📝 Take a practice test: ${nx.emoji} ${nx.name}</button>`);
      mb2.onclick = () => { sfx.tap(); playMock(nx); };
      rc.append(mb2);
    }
    s.append(rc);
  }

  // ----- Free exploring (unlocked after the plan) -----
  if (!locked) {
    const adv = h(`<button class="big-btn adventure-btn"><span style="font-size:44px">🗺️</span> Today's Adventure</button>`);
    adv.onclick = () => { sfx.tap(); play({ title: "Today's Adventure", skills: ALL_SKILLS, mixed: true }); };
    s.append(adv);
    const ex = nextExam();
    if (ex) {
      const d = daysUntil(ex.date);
      const eb = h(`<button class="big-btn green adventure-btn" style="font-size:clamp(20px,3.4vw,30px)"><span style="font-size:36px">📝</span> More Exam Practice: ${ex.emoji} ${ex.name} <small style="font-size:.6em">(${d === 0 ? 'today!' : d === 1 ? 'tomorrow' : 'in ' + d + ' days'})</small></button>`);
      eb.onclick = () => { sfx.tap(); play({ title: 'Exam Practice: ' + ex.name, skills: examSkills(ex), mixed: true, examPractice: ex.name }); };
      s.append(eb);
    }
  }

  const grid = h('<div class="islands"></div>');
  for (const w of WORLDS) {
    const badge = perWorld() > 0 ? `<span class="mbadge">${areaStatus(w) === 'retry' ? '🔁' : missionLeft(w) === 0 ? '✅' : `${worldDoneToday(w)}/${areaTarget(w)}`}</span>` : '';
    const b = h(`<button class="island ${w.cls}" style="position:relative">${badge}<div class="emo">${w.emo}</div><div class="name">${w.name}</div><div class="stars">${worldStars(w)}</div></button>`);
    if (locked) b.style.opacity = '.45';
    b.onclick = () => {
      sfx.tap();
      if (locked) { say(`Let's finish today's plan first. Then you can explore ${w.name}! Tap the green button.`); return; }
      island(w);
    };
    grid.append(b);
  }
  s.append(grid);
  app.append(s);
  say(line);
}

function island(w) {
  onMap = false;
  stopSpeaking();
  app.innerHTML = '';
  const s = h('<div class="screen"></div>');
  s.append(topbar(() => map(false)));
  s.append(h(`<div class="title" style="text-align:center">${w.emo} ${w.name}</div>`));
  const go = h(`<button class="big-btn green adventure-btn">▶ Play ${w.name}</button>`);
  go.onclick = () => { sfx.tap(); play({ title: w.name, skills: w.skills, world: w }); };
  s.append(go);
  const list = h('<div class="skills"></div>');
  for (const sk of w.skills) {
    const m = mastery(sk.id);
    const seen = !!store.skills[sk.id];
    const n = !seen ? 0 : m > 0.85 ? 3 : m > 0.6 ? 2 : 1;
    const lv = store.skills[sk.id]?.level || 1;
    const b = h(`<button class="skill-btn"><span class="e">${sk.emoji}</span><span>${esc(sk.name)}<small>${'★'.repeat(n)}${'☆'.repeat(3 - n)} · Level ${lv} of 3${topicDoneToday(sk) ? ' · ✅ today' : ''}</small></span></button>`);
    b.onclick = () => { sfx.tap(); play({ title: sk.name, skills: [sk], world: w }); };
    list.append(b);
  }
  s.append(list);
  app.append(s);
  say(w.intro || `Welcome to ${w.name}!`);
}

// Choose skills: weaker / older skills come up more often
function chooseSkill(pool, last) {
  const cands = pool.length > 1 ? pool.filter(s => s.id !== last) : pool;
  const weights = cands.map(s => needWeight(s.id));
  let r = Math.random() * weights.reduce((a, b) => a + b, 0);
  for (let i = 0; i < cands.length; i++) { r -= weights[i]; if (r <= 0) return cands[i]; }
  return cands[cands.length - 1];
}

// Fingerprint of a question, so the same question does not keep coming back
// It includes what is on screen (the word, picture, sentence) and the choices, not just the instruction.
const qSig = q => [q.skill, q.text, q.say, q.word, q.sentence, q.target, q.start, q.hops, JSON.stringify(q.answer),
  plainText(q.visual).replace(/\s+/g, ' '), (q.options || []).map(o => o.value).sort().join(',')].join('|');
// The main thing a question is about (its word or sentence), so the same word does not keep coming back
// in a topic even when the question is worded a different way.
const qKey = q => q.skill + ':' + (q.word || q.sentence || plainText(q.visual).replace(/\s+/g, ' ').slice(0, 60) || JSON.stringify(q.answer));

// ---------- Memory: what she gets wrong comes back until she knows it ----------
// Same game: the exact question again 3–4 questions later. Later days: again after 1, 3, 7 and 14 days.
// Each time she gets it right first time it waits longer; a miss starts it again.
const REVIEW_GAPS = [0.1, 1, 3, 7, 14]; // days
const plainQ = q => { try { if (Object.values(q).some(v => typeof v === 'function') || q.type === 'read') return null; return JSON.parse(JSON.stringify(q)); } catch (e) { return null; } };
function reviewMiss(sk, q) {
  const p = plainQ(q); if (!p) return;
  store.review ||= {};
  const k = qKey(q), r = store.review[k];
  store.review[k] = { s: sk.id, q: p, box: 0, due: Date.now() + REVIEW_GAPS[0] * 864e5, misses: (r?.misses || 0) + 1 };
  const keys = Object.keys(store.review);
  if (keys.length > 250) keys.sort((a, b) => store.review[a].due - store.review[b].due).slice(0, keys.length - 250).forEach(x => delete store.review[x]);
}
function reviewRight(q) {
  const k = qKey(q), r = store.review?.[k];
  if (!r) return;
  r.box++;
  if (r.box >= REVIEW_GAPS.length) delete store.review[k]; // learned!
  else r.due = Date.now() + REVIEW_GAPS[r.box] * 864e5;
}
const dueReviews = ids => Object.values(store.review || {}).filter(r => r.due <= Date.now() && ids.has(r.s));
function fromReview(r) {
  const q = JSON.parse(JSON.stringify(r.q));
  if (q.options) q.options = shuffle(q.options);
  if (q.items) q.items = shuffle(q.items);
  delete q.preSay; delete q.remind; delete q.remindSay; delete q.why; delete q.whySay;
  if (q.say) q.say = q.say.replace(/^(Here is one you know!|You can do this one!|Let's warm up!|Challenge time!) /, '');
  return q;
}

function makeQuestion(sk, levelOverride) {
  const lvl = levelOverride || skill(sk.id).level;
  const recent = new Set(store.recentQs || []);
  const recentKeys = new Set(store.recentKeys || []);
  let q, fallback = null;
  for (let i = 0; i < 40; i++) {
    q = sk.gen(lvl);
    q.skill = sk.id;
    if (recent.has(qSig(q))) continue;          // seen this exact question lately
    fallback ||= q;
    if (!recentKeys.has(qKey(q))) break;         // new question AND a word she has not had lately in this topic
    q = null;
  }
  q ||= fallback || sk.gen(lvl);
  q.skill = sk.id;
  if (sk.type && !q.type) q.type = sk.type;
  store.recentQs = [...(store.recentQs || []), qSig(q)].slice(-1500);
  store.recentKeys = [...(store.recentKeys || []), qKey(q)].slice(-600);
  return q;
}

// Pick n topics for a game: weaker topics more often, but mixed up, not the same ones
// as last game, and at most 2 brand-new topics per game so she is not overwhelmed.
function pickTopics(skills, n) {
  const lastGame = new Set(store.lastGameSkills || []);
  const cands = [...skills];
  const out = [];
  let fresh = 0;
  while (out.length < n && cands.length) {
    const w = cands.map(sk => {
      const isNew = !store.skills[sk.id];
      if (isNew && fresh >= 2) return 0.0001;
      return needWeight(sk.id) * (lastGame.has(sk.id) ? 0.3 : 1);
    });
    let r = Math.random() * w.reduce((a, b) => a + b, 0), i = 0;
    for (; i < w.length - 1; i++) { r -= w[i]; if (r <= 0) break; }
    const sk = cands.splice(i, 1)[0];
    if (!store.skills[sk.id]) fresh++;
    out.push(sk);
  }
  return out;
}

async function play({ title, skills, mixed, length, mission, world, examPractice, coverAll, mock, hard, carry }) {
  onMap = false;
  stopSpeaking();
  if (!gate()) return;
  const total = length || store.settings.sessionLength;
  let pool = skills;
  if (mixed) {
    // A fresh mix of topics each game (weaker ones more often)
    pool = pickTopics(skills, Math.min(skills.length, Math.max(5, total - 1)));
    if (store.settings.extraNumberLines && !pool.some(sk => sk.id.startsWith('m-nl-')) && Math.random() < 0.6) {
      // Extra number line practice in most games (one topic, not every time)
      const nl = skills.filter(sk => sk.id.startsWith('m-nl-') && sk.id !== 'm-nl-learn');
      if (nl.length) pool.push(...pickTopics(nl, 1));
    }
  } else if (skills.length > 6) {
    pool = pickTopics(skills, 6);
  }
  store.lastGameSkills = pool.map(sk => sk.id);
  // The very first time number lines come up, start with the "Meet the number line" lesson
  let firstLesson = null;
  if (pool.some(sk => sk.id.startsWith('m-nl-')) && !store.skills['m-nl-learn']) firstLesson = ALL_SKILLS.find(sk => sk.id === 'm-nl-learn');

  app.innerHTML = '';
  const s = h(`<div class="screen">
    <div class="play-top">
      <button class="icon-btn" aria-label="Stop">🏠</button>
      <div class="progress"><i style="width:0%"></i></div>
      <div class="combo"></div>
      <div class="pill sitpill" style="font-size:16px">${sitPillText()}</div>
      <div class="pill">🪙 <span class="c">${store.coins}</span></div>
    </div>
    <div class="stage"></div>
  </div>`);
  app.append(s);
  const stage = s.querySelector('.stage');
  const bar = s.querySelector('.progress i');
  const comboEl = s.querySelector('.combo');
  const coinEl = s.querySelector('.c');
  let quit = false;
  s.querySelector('.icon-btn').onclick = () => { quit = true; stopSpeaking(); map(false); };
  startClock();

  const started = Date.now();
  let done = 0, firstRight = 0, combo = 0, bestCombo = 0, earned = 0;
  const retry = [];
  let last = null;
  let count = 0;
  const maxQ = total * 2 + 3; // room for the woven-in exam questions
  let sinceExam = 0, weaveExam = null;
  // Quick checks ("What is a noun?", "Where do we start in columns?") woven in every 4th question
  let sinceCheck = 0;
  const checkSkills = ALL_SKILLS.filter(sk => sk.id === 'g-whatis' || sk.id === 'm-steps');
  const wantCheck = () => {
    const ids = new Set(skills.map(sk => sk.id));
    const g = [...ids].some(id => id.startsWith('g-')), m = [...ids].some(id => id.startsWith('m-'));
    return checkSkills.filter(sk => (sk.id === 'g-whatis' ? g : m));
  };
  const remindCount = {}; let lastWrongRule = null; let whyCount = 0;
  const againQ = [];          // missed this game: the same question comes back 3–4 questions later
  let sinceReview = 0;
  const poolIds = new Set(skills.map(sk => sk.id));

  const timesAsked = {};    // topic -> questions asked this game (max 2 each, so it does not repeat)
  const gameMisses = {};    // topic -> misses this game
  const tally = {};         // area -> { n, right, missed: [] } to decide if she can move on
  // Redoing an area: re-teach (worked example first) the topics she missed, and practise them first
  const reteach = world && areaStatus(world) === 'retry' ? (dayRec().missed?.[world.id] || []) : [];
  for (const id of reteach) gameMisses[id] = 2;
  // Failed this area twice today already: easiest questions, with a worked example for every topic
  const easyMode = !!(world && areaStatus(world) === 'retry' && (dayRec().fails?.[world.id] || 0) >= 2);
  if (easyMode) for (const sk of skills) gameMisses[sk.id] = 2;
  const firstUp = skills.filter(sk => reteach.includes(sk.id)).slice(0, 3); // asked first, with a worked example
  // every-topic mission: each topic once, none skipped. Practice test: spread across all the exam's topics.
  const coverQueue = coverAll ? shuffle(skills) : mock ? (sh => Array.from({ length: total }, (_, i) => sh[i % sh.length]))(shuffle(skills)) : null;
  if (mock) toast(`📝 Practice test: ${mock.name}. One try for each question. Do your best!`);
  for (const sk of firstUp) if (!pool.includes(sk)) pool.push(sk);
  const strongest = [...pool].filter(sk => store.skills[sk.id]?.seen >= 3).sort((a, b) => mastery(b.id) - mastery(a.id))[0];
  let missRun = 0;          // wrong answers in a row this game
  let challengeNext = false; // she is on a streak: offer a harder bonus question

  while (done < total && count < maxQ && !quit && !sittingUp()) {
    let sk, mode = 'normal', againItem = null;
    if (missRun >= 2 && !mock) {
      // Two misses in a row: give her an easy win from something she knows well
      sk = [...pool].sort((a, b) => mastery(b.id) - mastery(a.id))[0];
      mode = 'boost';
      missRun = 0;
    } else if (firstUp.length) { sk = firstUp.shift(); }
    else if (!examPractice && !mock && !easyMode && sinceExam >= 2 && (weaveExam = weaveExamSkill(last))) {
      // Every third question: a woven-in exam practice question (extra, does not replace a mission topic)
      sk = weaveExam.sk; mode = 'exam'; sinceExam = 0;
    }
    else if (!mock && againQ.length && count >= againQ[0].at) {
      const a = againQ.shift(); sk = a.sk; mode = 'again'; againItem = a.q;
    }
    else if (!mock && !easyMode && sinceReview >= 3 && dueReviews(poolIds).length) {
      const r = pick(dueReviews(poolIds)); sk = ALL_SKILLS.find(x => x.id === r.s); mode = 'review'; againItem = fromReview(r); sinceReview = 0;
    }
    else if (!mock && !easyMode && sinceCheck >= 4 && wantCheck().length) {
      sk = pick(wantCheck()); mode = 'check'; sinceCheck = 0;
    }
    else if (coverQueue && coverQueue.length) { sk = coverQueue.shift(); }
    else if (firstLesson) { sk = firstLesson; firstLesson = null; }
    else if (retry.length && (done >= total - retry.length || Math.random() < 0.35)) sk = retry.shift();
    else if (count === 0 && !coverAll && !mock && strongest && mastery(strongest.id) >= 0.6) { sk = strongest; mode = 'warm'; }
    else {
      const open = pool.filter(p => (timesAsked[p.id] || 0) < 2);
      sk = chooseSkill(open.length ? open : pool, last);
    }
    timesAsked[sk.id] = (timesAsked[sk.id] || 0) + 1;
    if (mode === 'normal' && challengeNext && !easyMode && !mock) { mode = 'challenge'; challengeNext = false; }
    last = sk.id;
    count++;
    const lvl = skill(sk.id).level;
    // 🌟 Challenge: one level up; at the top level, topics with stretch questions go beyond (unfamiliar words)
    const chLvl = sk.stretch && lvl >= 3 ? 4 : Math.max(2, Math.min(3, lvl + 1));
    const q = againItem ? (mode === 'again' ? fromReview({ q: againItem }) : againItem)
      : makeQuestion(sk, mode === 'boost' || easyMode ? 1 : mode === 'challenge' ? chLvl : mock ? Math.max(2, Math.min(3, lvl)) : lvl);
    if (againItem) { q.skill = sk.id; if (sk.type && !q.type) q.type = sk.type; }
    if (mode === 'again') q.preSay = pick(['Let\'s try that one again!', 'This one came back. You can do it now!', 'Here is that tricky one again. Remember what we learned!']);
    if (mode === 'review') { q.preSay = pick(['Do you remember this one?', 'Memory time! You had this one before.', 'This one came back. Let\'s see if you remember!']); toast('🔁 Memory check!'); }
    else sinceReview++;
    if (mock) { q.tries = 1; q.preSay = count === 1 ? `Practice test time! Listen carefully and do your best. You get one try for each question.` : q.preSay; }
    if (mode === 'challenge') {
      toast('⭐ Challenge question! Bonus coins! ⭐');
      q.say = 'Challenge time! ' + q.say;
    }
    if (mode === 'boost') q.say = pick(['Here is one you know!', 'You can do this one!', 'Let\'s warm up!']) + ' ' + q.say;
    if (mode === 'warm') q.say = 'Let\'s warm up! ' + q.say;
    if (mode === 'check') toast('📌 Quick check!');
    else sinceCheck++;
    // 📌 Rule / steps reminder: always on screen; said the first time, after a mistake, every 3rd time,
    // and every time for column sums (the steps)
    const rem = mock ? null : reminderFor(sk.id, q);
    if (rem) {
      q.remind = rem.text;
      const n = (remindCount[rem.key] = (remindCount[rem.key] || 0) + 1);
      if (n === 1 || n % 3 === 0 || lastWrongRule === rem.key || /^col/.test(rem.key)) q.remindSay = rem.say;
    }
    // 💡 After a right answer, show WHY (rule-based topics, My World, health and "why" topics); read it out every other time
    if (!mock && q.explain && (rem || q.whyAlways || /^(w-|p-why|g-whatis|m-steps)/.test(sk.id))) {
      q.why = q.why || q.explain;
      q.whyLabel = q.whyAlways || /^(w-|p-why|g-whatis|m-steps)/.test(sk.id) || /because|means|so |to keep|rule/i.test(q.why) ? 'Why?' : 'Remember:';
      whyCount++;
      q.whySay = whyCount % 2 === 1;
    }
    if (mode === 'exam') {
      const d = daysUntil(weaveExam.exam.date);
      toast(`📝 Exam practice: ${weaveExam.exam.emoji} ${weaveExam.exam.name}`);
      q.preSay = `Exam practice! Your ${weaveExam.exam.name} test is ${d === 0 ? 'today' : d === 1 ? 'tomorrow' : 'in ' + d + ' days'}.`;
    } else sinceExam++;
    if (pendingCue) { q.preSay = pendingCue + (q.preSay ? ' ' + q.preSay : ''); pendingCue = null; }
    // Listening reminders: start of the game, every third question, and before listening questions
    if (q.preSay) { /* break cue already set */ }
    else if (count === 1) q.preSay = `${pick(['Let\'s go', 'Here we go', 'Ready'])}, ${name()}! Remember to listen carefully to every question.`;
    else if (q.listenOnly) q.preSay = pick(['Listening question! Ears ready?', 'Super listening ears on!', 'Listen very carefully to this one.']);
    else if (count % 3 === 0 && !q.preSay) q.preSay = pick(LISTEN_TIPS);
    const res = await runQuestion(q, stage);
    if (quit) break;
    lastWrongRule = rem && !(res.correct && res.firstTry) ? rem.key : null;
    // Memory: a miss comes back later this game and on later days; a first-try right pushes it further away
    if (!mock && mode !== 'challenge') {
      if (res.correct && res.firstTry) reviewRight(q);
      else {
        reviewMiss(sk, q);
        if (mode !== 'again' && againQ.length < 4) againQ.push({ sk, q: plainQ(q), at: count + 3 + (Math.random() < 0.5 ? 1 : 0) });
      }
    }
    if (againQ.length && !againQ[0].q) againQ.shift();
    // A missed challenge question is never counted against her
    if (!(mode === 'challenge' && !res.correct)) record(sk.id, res.correct && res.firstTry);
    // Count towards today's mission (every answered question counts in its area)
    const dr = dayRec(); dr.worlds ||= {}; dr.skills ||= {};
    dr.skills[sk.id] = (dr.skills[sk.id] || 0) + 1; // topics covered today
    dr.worlds[WORLD_OF[sk.id]] = (dr.worlds[WORLD_OF[sk.id]] || 0) + 1;
    logAnswer(q, sk, res);
    if (hard) dr.hardDone = (dr.hardDone || 0) + 1;
    if (carry && mode !== 'exam' && mode !== 'check' && mode !== 'again' && mode !== 'review' && carryInfo().topics.includes(sk.id)) { dr.carryDone ||= {}; dr.carryDone[sk.id] = (dr.carryDone[sk.id] || 0) + 1; }
    if (examPractice || mode === 'exam') {
      dr.examDone = (dr.examDone || 0) + 1;
      const en = mode === 'exam' ? weaveExam.exam.name : typeof examPractice === 'string' ? examPractice : EXAMS.find(e => examSkills(e).includes(sk))?.name;
      if (en) { dr.examDoneBy ||= {}; dr.examDoneBy[en] = (dr.examDoneBy[en] || 0) + 1; }
    }
    if (!['challenge', 'exam', 'check', 'again', 'review'].includes(mode) && !mock) {
      const tl = (tally[WORLD_OF[sk.id]] ||= { n: 0, right: 0, missed: [] });
      tl.n++;
      if (res.correct && res.firstTry) tl.right++;
      else if (!tl.missed.includes(sk.id)) tl.missed.push(sk.id);
    }
    const extra = ['exam', 'check', 'again', 'review'].includes(mode); // woven-in questions don't use up the game's questions
    if (res.correct) {
      if (!extra) done++;
      missRun = 0;
      const c = (res.firstTry ? 3 : 1) * (mode === 'challenge' ? 2 : 1);
      earned += c; store.coins += c;
      if (res.firstTry) { firstRight++; combo++; bestCombo = Math.max(bestCombo, combo); } else combo = 0;
      if (combo > 0 && combo % 3 === 0) { store.coins += 2; earned += 2; toast('🔥 Combo bonus +2 🪙'); sfx.coin(); challengeNext = true; }
    } else {
      combo = 0;
      if (!extra) done++;
      if (mode !== 'challenge' && !extra && !mock) {
        missRun++;
        gameMisses[sk.id] = (gameMisses[sk.id] || 0) + 1;
        if (retry.length < 3) retry.push(sk);
      }
    }
    sfx.coin();
    coinEl.textContent = store.coins;
    comboEl.textContent = combo >= 2 ? `🔥${combo}` : '';
    bar.style.width = Math.min(100, (done / total) * 100) + '%';
    save();
  }
  stopClock();
  if (quit) return;
  const timeUp = sittingUp();
  if (timeUp && count === 0) return breakScreen(sittingState());
  const secs = Math.round((Date.now() - started) / 1000);
  store.sessions.push({ date: new Date().toISOString(), title, right: firstRight, total: count, secs });
  if (store.sessions.length > 300) store.sessions.shift();
  const acc = firstRight / count;
  const stars = acc >= 0.85 ? 3 : acc >= 0.6 ? 2 : 1;
  const beforeStage = petStage();
  store.stars += stars;
  // Did she get most of an area wrong? Then she must redo it before moving on.
  const dr2 = dayRec(); dr2.areas ||= {}; dr2.missed ||= {};
  let retryArea = null;
  for (const [wid, tl] of Object.entries(tally)) {
    if (tl.n < 3) continue; // too few questions in this area to judge
    if (tl.right / tl.n < PASS_MARK) {
      dr2.areas[wid] = 'retry'; dr2.missed[wid] = tl.missed;
      dr2.fails ||= {}; dr2.fails[wid] = (dr2.fails[wid] || 0) + 1;
      retryArea = retryArea || WORLDS.find(w => w.id === wid);
    } else {
      dr2.areas[wid] = 'pass'; delete dr2.missed[wid];
    }
  }
  let mockScore = null;
  if (mock) {
    mockScore = Math.round((firstRight / Math.max(1, count)) * 100);
    store.mocks ||= {};
    (store.mocks[mock.name] ||= []).push({ d: today(), s: mockScore, n: count, right: firstRight });
  }
  // Whole daily mission finished?
  let missionComplete = false;
  if (perWorld() > 0 && missionDone() && !dayRec().missionDone) {
    dayRec().missionDone = true; missionComplete = true;
    store.coins += 20; earned += 20;
  }
  save();
  let planComplete = false;
  if (!dayRec().planDone && planDone()) { dayRec().planDone = true; planComplete = true; store.coins += 10; earned += 10; }
  save();
  results({ stars, earned, bestCombo, grew: petStage() > beforeStage, title, missionComplete, retryArea, planComplete, mockScore, mock, mockRight: firstRight, mockTotal: count, timeUp });
}

function results({ stars, earned, bestCombo, grew, missionComplete, retryArea, planComplete, mockScore, mock, mockRight, mockTotal, timeUp }) {
  app.innerHTML = '';
  const r = mock ? examReadiness(mock) : null;
  const s = h(`<div class="screen center">
    <div class="title">${stars === 3 ? 'SUPERSTAR!' : stars === 2 ? 'Great job!' : 'Well done!'}</div>
    ${mock ? `<div class="bubble" style="margin:8px 0">📝 ${esc(mock.name)} practice test: <b>${mockRight} out of ${mockTotal}</b> (${mockScore}%)<br>Exam readiness: <b>${r.pct}%</b> ${r.label}</div>` : ''}
    <div class="result-stars">${[1, 2, 3].map(i => `<span class="${i <= stars ? '' : 'off'}" style="animation-delay:${i * 0.25}s">⭐</span>`).join('')}</div>
    <div class="white">+${earned} 🪙 coins ${bestCombo >= 3 ? ` · best streak 🔥${bestCombo}` : ''}</div>
    <div class="bubble" style="margin:16px 0">Tap the treasure chest!</div>
    <div class="chest">🎁</div>
    <div class="after hidden" style="display:flex;flex-direction:column;align-items:center;gap:14px"></div>
  </div>`);
  app.append(s);
  sfx.fanfare(); confetti(stars * 20);
  if (mock) setTimeout(() => say(`You got ${mockRight} out of ${mockTotal} on your ${mock.name} practice test! ${mockScore >= 75 ? 'You are getting ready!' : 'Keep practising, you are getting stronger every day!'}`), 3500);
  const praise = stars === 3 ? `Wow ${name()}! Three stars! You are a superstar!` : stars === 2 ? `Great job ${name()}! Two stars!` : `Well done ${name()}! Every try makes your brain stronger!`;
  say(praise + ' Tap the treasure chest!');
  const chest = s.querySelector('.chest');
  chest.onclick = () => {
    chest.onclick = null;
    sfx.correct(); confetti(30);
    const left = STICKERS.filter(x => !store.stickers.includes(x));
    store.goldStickers ||= [];
    const goldLeft = left.length ? [] : STICKERS.filter(x => !store.goldStickers.includes(x));
    let prize, msg;
    if (left.length) { prize = pick(left); store.stickers.push(prize); msg = 'A new sticker for your sticker book!'; }
    else if (goldLeft.length) { prize = pick(goldLeft); store.goldStickers.push(prize); msg = 'A shiny golden sticker for your book!'; }
    else { prize = '🪙'; store.coins += 10; msg = 'Ten bonus coins!'; }
    // 🎟️ Fun Zone tickets for doing well
    store.fun ||= {}; store.fun.tickets ??= 1;
    const tickets = (stars === 3 ? 1 : 0) + (planComplete ? 2 : 0) + (missionComplete ? 1 : 0);
    store.fun.tickets += tickets;
    save();
    chest.className = 'prize' + (goldLeft.length && !left.length ? ' gold' : ''); chest.textContent = prize;
    s.querySelector('.bubble').textContent = msg.replace('Ten bonus coins!', '+10 bonus coins!');
    say(msg + (tickets ? ` And you won ${tickets === 1 ? 'a Fun Zone ticket' : tickets + ' Fun Zone tickets'}!` : ''));
    const after = s.querySelector('.after');
    after.classList.remove('hidden');
    if (tickets) after.append(h(`<div class="bubble">🎟️ You won ${tickets === 1 ? 'a Fun Zone ticket' : tickets + ' Fun Zone tickets'}! ${planDone() ? `Use ${tickets === 1 ? 'it' : 'them'} on the map. 🎀` : `Use ${tickets === 1 ? 'it' : 'them'} at break time, or when all of today's work is done. 🎀`}</div>`));
    if (grew) {
      after.append(h(`<div class="bubble">✨ Your ${esc(store.pet.name)} ${petStage() === 1 ? 'came out of the gift' : 'grew'}! ${petEmoji()}</div>`));
      setTimeout(() => say(`Look! Your ${store.pet.name} ${petStage() === 1 ? 'came out of the gift' : 'grew bigger'}!`), 2200);
    }
    if (missionComplete) {
      const st = missionStreak();
      after.append(h(`<div class="bubble">🏆 Daily Mission complete! +20 🪙 ${st > 1 ? `· 🔥 ${st} days in a row!` : ''}</div>`));
      confetti(60); sfx.fanfare();
      setTimeout(() => say(`Hooray ${name()}! You finished your whole mission today! ${st > 1 ? st + ' days in a row!' : ''} I am so proud of you!`), 2600);
    }
    const row = h('<div style="display:flex;gap:14px;flex-wrap:wrap;justify-content:center"></div>');
    if (retryArea && perWorld() > 0) {
      after.append(h(`<div class="bubble">🔁 Let's practise ${esc(retryArea.name)} again. I will show you how!</div>`));
      setTimeout(() => say(`That was tricky! Let's practise ${retryArea.name} again before we move on. I will show you how!`), grew ? 5000 : 2400);
    }
    if (planComplete) {
      after.append(h(`<div class="bubble">🎉 Today's plan is complete! +10 🪙 Now you can explore anything!</div>`));
      setTimeout(() => say(`Well done ${name()}! You finished everything for today. Now you can explore anything you like!`), missionComplete ? 7000 : 2600);
    }
    if (timeUp) {
      // The sitting's time is up: everything is saved, time for a break
      const st = sittingState();
      after.append(h(`<div class="bubble">⏰ You've been playing for ${Math.round((sittings().at(-1)?.secs || sitLimit()) / 60)} minutes. Time to take a break! Your work is saved.</div>`));
      const ok = h('<button class="big-btn green">😴 OK, break time</button>');
      ok.onclick = () => { sfx.tap(); breakScreen(st); };
      after.append(ok);
      setTimeout(() => say(`Great work! You've been playing for ${Math.round((sittings().at(-1)?.secs || sitLimit()) / 60)} minutes. Time to take a break. Your work is saved!`), grew ? 5000 : 2400);
      return;
    }
    // Lead her straight to the next step of today's plan
    const step = nextStep();
    const again = h(`<button class="big-btn green">${step ? `Next: ${step.label}` : 'Play more ▶'}</button>`);
    const home = h('<button class="big-btn">🗺️ Map</button>');
    if (step && !retryArea && !planComplete) setTimeout(() => say(`Next: ${step.say}`), grew ? 5000 : 2400);
    again.onclick = () => { sfx.tap(); if (step) playStep(); else play({ title: "Today's Adventure", skills: ALL_SKILLS, mixed: true }); };
    home.onclick = () => { sfx.tap(); map(false); };
    row.append(again, home);
    after.append(row);
  };
}

function breakScreen(st) {
  timing = false; breakShown = true; onMap = false;
  stopSpeaking();
  document.getElementById('confetti').innerHTML = '';
  app.innerHTML = '';
  const done = Object.keys(dayRec().skills || {}).length;
  const allDone = st.why === 'done';
  const lastMins = Math.round((sittings()[sittings().length - 1]?.secs || 0) / 60);
  const msg = allDone
    ? `You did all ${st.n} sittings today, ${name()}! You played for ${minsWord(todayMinutes())} today. Well done. See you tomorrow!`
    : `You've been playing for ${minsWord(lastMins)}. Time to take a break! Sitting ${st.n} of ${st.per} is done. Come back at ${hhmm(st.until)}.`
      + (st.n >= basePer() && autoExtra() > 0 ? ` Some things were tricky today, so you get ${autoExtra() === 1 ? 'an extra sitting' : 'extra sittings'} to practise them. Practice makes you stronger!` : '');
  const s = h(`<div class="screen center">
    <div class="mascot">${allDone ? '🎉🦉' : '😴🦉'}</div>
    <div class="title">${allDone ? 'All done for today!' : 'Brain break time!'}</div>
    <div class="bubble">${esc(msg)}</div>
    <div class="mission" style="margin-top:16px;min-width:300px">
      <div style="font-size:20px">Sittings today: ${'✅'.repeat(Math.min(st.n, st.per))}${'⬜'.repeat(Math.max(0, st.per - st.n))}</div>
      <div style="font-size:18px;margin-top:6px">✅ ${done} topics done today ${planDone() ? '· 🏆 plan complete' : ''}</div>
      <div style="font-size:18px;margin-top:4px">⏱️ Today: ${minsWord(todayMinutes())} in ${st.n} sitting${st.n === 1 ? '' : 's'}</div>
      ${allDone ? '' : `<div style="font-size:18px;margin-top:10px;text-align:left"><b>Break ideas:</b><br>🤸 Stretch and jump<br>💧 Drink some water<br>👀 Rest your eyes: look far away out of the window<br>🌳 Play outside</div>`}
      <div class="cd" style="font-size:22px;font-weight:700;margin-top:8px"></div>
    </div>
    <div class="go" style="margin-top:14px"></div>
    <div style="margin-top:20px;display:flex;gap:10px;flex-wrap:wrap;justify-content:center">${allDone && !planDone() ? '' : `<button class="icon-btn" data-a="fun" style="font-size:18px;background:#ff8cc6;color:#fff">🎀 Fun Zone (🎟️ ${store.fun?.tickets ?? 1})</button>`}<button class="icon-btn" data-a="chips" style="font-size:18px">🌶️ Chip Challenge</button><button class="icon-btn" data-a="prog" style="font-size:18px">📈 How am I doing?</button><button class="icon-btn" data-a="parent" style="font-size:18px">👪 Grown-ups</button></div>
  </div>`);
  app.append(s);
  s.querySelector('[data-a=parent]').onclick = parentGate;
  s.querySelector('[data-a=prog]').onclick = () => { breakShown = false; progressScreen(); };
  s.querySelector('[data-a=chips]').onclick = () => { breakShown = false; sfx.tap(); openChips(); };
  const fzb = s.querySelector('[data-a=fun]');
  if (fzb) fzb.onclick = () => { sfx.tap(); if (funOpen()) breakShown = false; openFunZone(); };
  say(msg);
  if (allDone) return;
  const cd = s.querySelector('.cd'), go = s.querySelector('.go');
  const refresh = () => {
    if (!document.body.contains(cd)) { clearInterval(iv); return; }
    const left = st.until - Date.now();
    if (left > 0) { cd.textContent = `⏳ Next sitting in ${Math.ceil(left / 60000)} min`; return; }
    clearInterval(iv);
    cd.textContent = '✅ Break is over!';
    const b = h(`<button class="big-btn green">▶ Start sitting ${st.n + 1}</button>`);
    b.onclick = () => { sfx.unlock(); sfx.tap(); map(true); };
    go.append(b);
    say(`Break is over! Tap the green button to start sitting ${st.n + 1}.`);
  };
  const iv = setInterval(refresh, 15000);
  refresh();
}

function breakTime() {
  return breakScreen(sittingState());
  app.innerHTML = '';
  app.append(h(`<div class="screen center">
    <div class="mascot">😴🦉</div>
    <div class="title">Brain break time!</div>
    <div class="bubble">You did lots of learning today, ${esc(name())}. Go play, drink some water, and come back tomorrow!</div>
    <div style="margin-top:20px"><button class="icon-btn" style="font-size:18px">👪 Grown-ups</button></div>
  </div>`));
  app.querySelector('button').onclick = parentGate;
  say(`Brain break time! You did lots of learning today, ${name()}. Come back tomorrow!`);
}

// ---------- 📈 How am I doing? Daily scores, compared day by day ----------
const pctOf = (r, t) => (t ? Math.round((r / t) * 100) : null);
const scoreColour = p => (p >= 85 ? '#2ec27e' : p >= 70 ? '#9ccc3c' : p >= 50 ? '#ffb020' : '#ff5964');
const prettyDay = k => new Date(k + 'T12:00:00').toDateString().slice(0, 10);

// Every day she played, oldest first: overall score + score in each area
function dailyScores() {
  return Object.keys(store.daily).filter(k => (store.daily[k].total || 0) > 0).sort().map(k => {
    const d = store.daily[k];
    const log = store.log?.[k] || [];
    const areas = {};
    for (const w of WORLDS) {
      const es = log.filter(e => e.w === w.id);
      if (es.length) areas[w.id] = { pct: pctOf(es.filter(e => e.f).length, es.length), n: es.length };
    }
    return { k, pct: pctOf(d.right, d.total), right: d.right, total: d.total, mins: Math.round((d.secs || 0) / 60),
      topics: Object.keys(d.skills || {}).length, mission: !!d.missionDone, plan: !!d.planDone, areas };
  });
}

function scoreChart(days) {
  const last = days.slice(-14);
  const W = 700, H = 230, n = last.length, bw = Math.min(60, (W - 66) / Math.max(n, 1) - 10);
  const x = i => 56 + i * ((W - 66) / Math.max(n, 1)) + ((W - 66) / Math.max(n, 1) - bw) / 2;
  const y = p => 190 - p * 1.6;
  let s = `<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto" role="img" aria-label="Daily scores">`;
  for (const g of [50, 75, 100]) s += `<line x1="50" x2="${W - 6}" y1="${y(g)}" y2="${y(g)}" stroke="#e3ddff" stroke-width="2" ${g === 75 ? 'stroke-dasharray="6 5"' : ''}/><text x="44" y="${y(g) + 5}" font-size="13" text-anchor="end" fill="#9a8fd6">${g}%</text>`;
  last.forEach((d, i) => {
    s += `<rect x="${x(i)}" y="${y(d.pct)}" width="${bw}" height="${190 - y(d.pct)}" rx="8" fill="${scoreColour(d.pct)}"/>`;
    s += `<text x="${x(i) + bw / 2}" y="${y(d.pct) - 6}" font-size="15" font-weight="800" text-anchor="middle" fill="#2b2250">${d.pct}%</text>`;
    s += `<text x="${x(i) + bw / 2}" y="${210}" font-size="12" text-anchor="middle" fill="#2b2250">${prettyDay(d.k).slice(4, 10)}</text>`;
  });
  return s + '</svg>';
}

function progressScreen() {
  onMap = false;
  stopSpeaking();
  app.innerHTML = '';
  const s = h('<div class="screen"></div>');
  s.append(topbar(() => map(false)));
  s.append(h(`<div class="title" style="text-align:center">📈 How am I doing?</div>`));
  const days = dailyScores();
  if (!days.length) {
    s.append(h('<div class="bubble" style="margin:auto">Play today and your score will show here!</div>'));
    app.append(s);
    say('Play today and your score will show here!');
    return;
  }
  const t = days[days.length - 1], prev = days[days.length - 2];
  const diff = prev ? t.pct - prev.pct : null;
  const isToday = t.k === today();
  let line = `${isToday ? 'Today' : 'On ' + prettyDay(t.k)} you got ${t.pct} percent right the first time.`;
  if (prev) line += diff > 2 ? ` That is better than ${prettyDay(prev.k)}, when you got ${prev.pct} percent. You are getting better!` : diff < -2 ? ` That is a little lower than ${prettyDay(prev.k)}, when you got ${prev.pct} percent. Let's practise and beat it tomorrow!` : ` That is about the same as ${prettyDay(prev.k)}. Keep going!`;
  const best = days.reduce((m, d) => (d.pct > m.pct ? d : m), days[0]);
  s.append(h(`<div class="hello"><div class="mascot">🦉</div><div class="say" style="flex:1">${esc(line)}<br><small>⭐ Best day: ${prettyDay(best.k)} with ${best.pct}%</small></div></div>`));
  s.append(h(`<div class="mission"><h3>My score each day</h3>${scoreChart(days)}<div style="font-size:14px;color:#7a70b0">Score = questions right the first time. The dashed line is 75%.</div></div>`));

  // Day by day, newest first, compared with the day before
  let rows = '';
  for (let i = days.length - 1; i >= 0 && i >= days.length - 30; i--) {
    const d = days[i], p = days[i - 1];
    const ch = p ? d.pct - p.pct : null;
    const arrow = ch === null ? '' : ch > 2 ? `<span style="color:#2ec27e">⬆️ +${ch}</span>` : ch < -2 ? `<span style="color:#ff5964">⬇️ ${ch}</span>` : '➡️ same';
    const stars = d.pct >= 85 ? '⭐⭐⭐' : d.pct >= 60 ? '⭐⭐' : '⭐';
    const areas = WORLDS.filter(w => d.areas[w.id]).map(w => {
      const a = d.areas[w.id], pa = p?.areas[w.id];
      const tag = pa ? (a.pct - pa.pct > 2 ? '⬆️' : a.pct - pa.pct < -2 ? '⬇️' : '') : '';
      return `<span class="mchip" style="background:${scoreColour(a.pct)}22">${w.emo} ${a.pct}%${tag}</span>`;
    }).join(' ');
    rows += `<div class="mission" style="margin-bottom:10px">
      <div style="display:flex;flex-wrap:wrap;align-items:center;gap:12px;font-size:20px">
        <b>${prettyDay(d.k)}${d.k === today() ? ' (today)' : ''}</b>
        <span style="font-size:28px;font-weight:800;color:${scoreColour(d.pct)}">${d.pct}%</span> ${arrow} <span>${stars}</span>
      </div>
      <div style="font-size:16px;margin:4px 0">${d.right} of ${d.total} right first time · ${d.topics} topics · ${d.mins} min ${d.mission ? '· 📋 mission ✅' : ''} ${d.plan ? '· 🏆 plan done' : ''}</div>
      ${areas ? `<div class="mchips" style="margin:6px 0 0">${areas}</div>` : ''}
    </div>`;
  }
  s.append(h(`<div><h3 style="font-family:var(--fun);color:#fff;text-shadow:0 2px 0 rgba(0,0,0,.2)">Day by day</h3>${rows}</div>`));
  app.append(s);
  say(line);
}

function stickerBook() {
  onMap = false;
  stopSpeaking();
  app.innerHTML = '';
  const gold = store.goldStickers || [];
  const s = h('<div class="screen"></div>');
  s.append(topbar(() => map(false)));
  s.append(h(`<div class="title" style="text-align:center">📒 My Sticker Book</div>`));
  s.append(h(`<div class="white" style="text-align:center;margin-bottom:12px">${store.stickers.filter(x => STICKERS.includes(x)).length} of ${STICKERS.length} stickers${gold.length ? ` · ✨ ${gold.length} golden` : ''}</div>`));
  for (const [page, list] of Object.entries(STICKER_PAGES)) {
    const got = list.filter(x => store.stickers.includes(x)).length;
    s.append(h(`<h3 style="font-family:var(--fun);color:#fff;text-shadow:0 2px 0 rgba(0,0,0,.2);margin:14px 0 6px">${page} <small>${got}/${list.length} ${got === list.length ? '🏅' : ''}</small></h3>`));
    const g = h('<div class="sticker-grid"></div>');
    for (const st of list) {
      const has = store.stickers.includes(st);
      const c = h(`<button class="sticker ${has ? '' : 'locked'} ${gold.includes(st) ? 'gold' : ''}">${has ? st : '?'}</button>`);
      if (has) c.onclick = () => { sfx.pop(); c.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.3) rotate(-10deg)' }, { transform: 'scale(1)' }], 400); };
      g.append(c);
    }
    s.append(g);
  }
  app.append(s);
  say(`You have ${store.stickers.length} stickers! ${STICKERS.length - store.stickers.filter(x => STICKERS.includes(x)).length} more to find. Play more to win more!`);
}

// 🌶️ Chip Challenge with a grown-up: any time, and it does not use up sitting time
function openChips() {
  timing = false; onMap = false; stopSpeaking();
  chipGame({ app, h, say, sfx, store, save, back: () => map(false), confetti, name });
}

function openFunZone() {
  store.fun ||= {}; store.fun.tickets ??= 1;
  // Rule from Mummy: no Fun Zone until ALL of today's work is finished (tickets can still be won and saved)
  if (!funOpen()) { sfx.wrong(); say(`The Fun Zone opens at break time, or when you finish all of today's work. Keep going, ${name()}! Your ${store.fun.tickets === 1 ? 'ticket is' : 'tickets are'} saved for later.`); return; }
  if (store.fun.tickets < 1) { sfx.wrong(); say('You need a Fun Zone ticket. Get three stars in a game, or finish today\'s plan, to win one!'); return; }
  store.fun.tickets--; save();
  timing = false; onMap = false; // play time is not study time (the Fun Zone has its own 5-minute timer)
  funZone({ app, h, say, sfx, store, save, back: () => (onBreak() ? breakScreen(sittingState()) : map(false)), confetti, name });
}

// ---------- Parent zone ----------
// Everything she did on one day: per area summary, then every question
function dayReport(d) {
  const log = store.log?.[d] || [];
  const rec = store.daily[d];
  if (!log.length) return '<p>No questions answered on this day.</p>';
  const byW = {};
  for (const e of log) (byW[e.w] ||= []).push(e);
  const mins = rec ? Math.round(rec.secs / 60) : 0;
  let html = `<p><b>${log.length}</b> questions · <b>${log.filter(e => e.f).length}</b> right first time · ${mins} min · ${rec?.missionDone ? '✅ mission done' : perWorld() ? '❌ mission not finished' : ''}</p>`;
  html += '<table class="ptable"><tr><th>Area</th><th>Questions</th><th>Right first time</th><th>Result</th></tr>';
  for (const w of WORLDS) {
    const es = byW[w.id] || [];
    const right = es.filter(e => e.f).length;
    const st = rec?.areas?.[w.id];
    html += `<tr><td>${w.emo} ${w.name}</td><td>${es.length}${perWorld() ? ` · ${new Set(es.map(e => e.s)).size}/${w.skills.length} topics` : ''}</td><td>${es.length ? Math.round((right / es.length) * 100) + '%' : '—'}</td><td>${st === 'retry' ? '🔁 must redo' : st === 'pass' ? '✅ passed' : es.length ? '' : 'not done'}${rec?.fails?.[w.id] ? `<br><small>had to redo ${rec.fails[w.id]}×</small>` : ''}</td></tr>`;
  }
  html += '</table><details style="margin-top:8px"><summary><b>Every question</b> (tap to open)</summary><table class="ptable" style="margin-top:6px">';
  const skName = id => ALL_SKILLS.find(k => k.id === id)?.name || id;
  for (const e of log) {
    const w = WORLDS.find(x => x.id === e.w);
    html += `<tr><td>${e.t}</td><td>${w ? w.emo : ''} ${esc(skName(e.s))}<br><small>${esc(e.q)}</small></td><td>${e.f ? '✅' : e.r ? '🟡 2nd try' : '❌'}${e.f ? '' : `<br><small>Answer: ${esc(e.a)}</small>`}</td></tr>`;
  }
  return html + '</table></details>';
}

function parentGate() {
  timing = false; onMap = false;
  onMap = false;
  stopSpeaking();
  const a = rnd(6, 9), b = rnd(6, 9);
  app.innerHTML = '';
  const s = h(`<div class="screen center parent">
    <h2>👪 Grown-ups only</h2>
    <p style="font-size:20px">What is ${a} × ${b}?</p>
    <input inputmode="numeric" style="font-size:28px;width:140px;text-align:center;padding:8px" />
    <div class="prow" style="justify-content:center"><button class="pbtn">Enter</button><button class="pbtn" style="background:#888">Back</button></div>
  </div>`);
  app.append(s);
  const inp = s.querySelector('input');
  const [ok, back] = s.querySelectorAll('button');
  ok.onclick = () => { if (Number(inp.value) === a * b) parentZone(); else { inp.value = ''; inp.placeholder = 'Try again'; } };
  back.onclick = () => map(false);
}

function parentZone() {
  app.innerHTML = '';
  const s = h('<div class="screen parent"></div>');
  const d = store.daily[today()] || { secs: 0, right: 0, total: 0 };
  const days = Object.entries(store.daily).sort().slice(-7);
  const weakest = ALL_SKILLS.filter(sk => store.skills[sk.id]).sort((x, y) => mastery(x.id) - mastery(y.id)).slice(0, 5);
  s.append(h(`<div>
    <div class="prow"><button class="pbtn" data-a="exit">⬅ Back to game</button></div>
    <h2>${esc(name())}'s progress</h2>
    <div class="card">Today: <b>${Math.round(d.secs / 60)} min</b> played · <b>${d.right}/${d.total}</b> right first time
      <br>Total: 🪙 ${store.coins} coins · ⭐ ${store.stars} stars · 📒 ${store.stickers.length} stickers · ${store.sessions.length} games played</div>
    <div class="card"><b>📈 Daily scores</b> — her score every day, compared with the day before (also on her 📈 button on the map) <button class="pbtn" data-a="progress" style="padding:4px 10px;font-size:14px">Open</button></div>
    <div class="card"><b>📅 Day report</b> — what she did on any day
      <div class="prow">Day <input type="date" class="rep-date" value="${today()}" max="${today()}"></div>
      <div class="rep-body"></div></div>
    <div class="card"><b>Last 7 days</b> ${perWorld() ? `· mission streak 🔥 ${missionStreak()}` : ''}<br>${days.map(([k, v]) => `${k}: ${v.missionDone ? '✅ mission done' : perWorld() ? '❌ mission not finished' : ''} · ${Math.round(v.secs / 60)} min, ${v.right}/${v.total} right first time<br><small>${WORLDS.map(w => `${w.emo} ${v.worlds?.[w.id] || 0}`).join(' &nbsp; ')}</small>`).join('<br>') || 'No play yet'}</div>
    <div class="card"><b>📋 Today's plan</b><br>
      ${perWorld() ? `1. Mission in every area: ${WORLDS.filter(w => missionLeft(w) === 0).length} of ${WORLDS.length} done${retryWorld() ? ` (🔁 must redo ${retryWorld().name})` : ''}<br>` : ''}
      ${examGoal() ? `2. Exam practice: ${examGoal().items.map(it => `${esc(it.name)} ${Math.min(examDoneFor(it.name), it.n)}/${it.n}`).join(', ')}<br>` : 'No exam practice needed today<br>'}
      ${planDone() ? '✅ <b>Plan complete</b> — free play and the 🎀 Fun Zone are unlocked' : '⏳ <b>Not finished yet</b> — free play stays locked until it is. The 🎀 Fun Zone only opens during her breaks (she can still win tickets; they are saved)'}<br>
      <small>Exam practice is worked out each morning from the exam dates and her readiness so she is ready in time (about 8–25 questions a day, shared across the upcoming exams by how much each still needs; exams in the next 3 days get extra). Done in exam-date order.</small></div>
    <div class="card"><b>📝 Exam readiness</b> <small>(Christmas term exams, measured from how she plays)</small>
      <table class="ptable" style="margin-top:8px"><tr><th>Exam</th><th>Ready?</th><th>Practice test</th><th>Still needed</th><th>Practise next</th></tr>
      ${EXAMS.map(e => { const r = examReadiness(e); const d = daysUntil(e.date);
        const when = !e.date ? 'every day' : `${new Date(e.date + 'T12:00:00').toDateString().slice(0, 10)} · ${d > 1 ? d + ' days' : d === 1 ? 'tomorrow' : d === 0 ? 'today' : 'done'}`;
        return `<tr><td>${e.emoji} <b>${esc(e.name)}</b><br><small>${when}</small></td>
          <td style="min-width:140px"><div class="bar"><i style="width:${r.pct}%;background:${r.colour}"></i></div><b>${r.pct}%</b> ${r.label}<br><small>Daily practice ${r.practicePct}% · ${r.tried} of ${r.total} topics tried</small></td>
          <td><small>${r.lastMock ? `Last: <b>${r.lastMock.s}%</b> (${r.lastMock.right ?? '?'}/${r.lastMock.n}) on ${r.lastMock.d}<br>${mocksFor(e).length} taken` : 'None yet'}</small><br><button class="pbtn" style="padding:4px 8px;font-size:13px;margin-top:4px" data-mock="${esc(e.name)}">Start test</button></td>
          <td><small>${(() => { const n = examNeed(e); if (!n) return 'On track ✅'; if (!e.date) return `~${n} questions`; return d > 0 ? `~${n} questions<br>(~${Math.ceil(n / d)} a day)` : d === 0 ? 'Exam today' : '—'; })()}</small></td>
          <td><small>${r.pct >= 75 ? 'Keep it up!' : r.weakest.map(sk => sk.emoji + ' ' + esc(sk.name)).join('<br>')}</small></td></tr>`; }).join('')}
      </table>
      <small><b>How readiness is measured:</b> half from daily practice (recent accuracy × level reached × amount of practice on every topic in the revision guide) and half from her last two practice tests (10 questions across all the exam's topics, exam difficulty, one try each, no hints). 75%+ = Ready. Take a practice test every few days to keep the measure accurate.</small></div>
    <div class="card"><b>Needs the most practice</b><br>${weakest.map(sk => `${sk.emoji} ${esc(sk.name)} — ${Math.round(mastery(sk.id) * 100)}%`).join('<br>') || 'Not enough play yet'}</div>
  </div>`));

  let table = '<h2>All skills</h2><table class="ptable"><tr><th>Skill</th><th>Recent accuracy</th><th>Level</th><th>Tried</th></tr>';
  for (const w of (WORLDS)) {
    table += `<tr><td colspan="4" style="background:#f0edff"><b>${w.emo} ${w.name}</b></td></tr>`;
    for (const sk of w.skills) {
      const st = store.skills[sk.id];
      const m = mastery(sk.id);
      const col = !st ? '#ccc' : m > 0.8 ? '#2ec27e' : m > 0.55 ? '#ffb020' : '#ff5964';
      table += `<tr><td>${sk.emoji} ${esc(sk.name)}</td><td><div class="bar"><i style="width:${st ? Math.round(m * 100) : 0}%;background:${col}"></i></div>${st ? Math.round(m * 100) + '%' : '—'}</td><td>${st ? st.level : '—'}</td><td>${st ? st.seen : 0}</td></tr>`;
    }
  }
  table += '</table>';
  s.append(h(`<div>${table}</div>`));

  const voices = listVoices();
  const set = store.settings;
  const st = h(`<div>
    <h2>Settings</h2>
    <div class="card">
      <div class="prow">Child's name <input data-k="name" value="${esc(name())}"></div>
      <div class="prow"><label><input type="checkbox" data-k="voiceOn" ${set.voiceOn ? 'checked' : ''}> Ollie talks (voice)</label></div>
      <div class="prow"><label><input type="checkbox" data-k="sfxOn" ${set.sfxOn ? 'checked' : ''}> Sound effects</label></div>
      <div class="prow"><label><input type="checkbox" data-k="micOn" ${set.micOn ? 'checked' : ''}> Read-aloud with microphone ${micSupported ? '' : '(not supported in this browser — reading uses picture matching instead)'}</label></div>
      <div class="prow">Voice <select data-k="voiceName"><option value="">Automatic</option>${voices.map(v => `<option ${v.name === set.voiceName ? 'selected' : ''}>${esc(v.name)}</option>`).join('')}</select> <button class="pbtn" data-a="test">Test voice</button></div>
      <div class="prow">Talking speed <select data-k="speechRate">${[0.75, 0.85, 1, 1.15].map(r => `<option value="${r}" ${r == set.speechRate ? 'selected' : ''}>${r === 1 ? 'Normal' : r < 1 ? 'Slower' + (r < 0.8 ? ' still' : '') : 'Faster'}</option>`).join('')}</select></div>
      <div class="prow">Daily mission <select data-k="dailyPerWorld">${['all', 3, 5, 8, 10, 0].map(n => `<option value="${n}" ${String(n) === String(set.dailyPerWorld ?? 'all') ? 'selected' : ''}>${n === 'all' ? `Every topic in every area (${ALL_SKILLS.length} a day)` : n ? n + ' per area (' + n * WORLDS.length + ' a day)' : 'Off'}</option>`).join('')}</select></div>
      <div class="prow">Exam practice each day (after the mission) <select data-k="examPerDay">${['auto', 0, 10, 15, 20, 25].map(n => `<option value="${n}" ${String(n) === String(set.examPerDay ?? 'auto') ? 'selected' : ''}>${n === 'auto' ? 'Automatic (recommended)' : n ? n + ' questions' : 'Off'}</option>`).join('')}</select></div>
      <div class="prow">Questions per game <select data-k="sessionLength">${[5, 8, 10, 12, 15].map(n => `<option ${n == set.sessionLength ? 'selected' : ''}>${n}</option>`).join('')}</select></div>
      <div class="prow"><label><input type="checkbox" data-k="extraNumberLines" ${set.extraNumberLines ? 'checked' : ''}> Extra number line practice in every Today's Adventure</label></div>
      <div class="prow">Each sitting <select data-k="sittingMinutes">${[0, 15, 20, 25, 30, 40, 45].map(n => `<option value="${n}" ${n == set.sittingMinutes ? 'selected' : ''}>${n ? n + ' minutes' : 'No limit'}</option>`).join('')}</select>
        Sittings a day <select data-k="sittingsPerDay">${[2, 3, 4, 5, 6, 8].map(n => `<option ${n == set.sittingsPerDay ? 'selected' : ''}>${n}</option>`).join('')}</select>
        Break between <select data-k="breakMinutes">${[0, 15, 30, 45, 60, 90].map(n => `<option value="${n}" ${n == set.breakMinutes ? 'selected' : ''}>${n ? n + ' min' : 'No break'}</option>`).join('')}</select></div>
      <div class="prow"><label><input type="checkbox" data-k="rollover" ${set.rollover !== false ? 'checked' : ''}> Roll over: anything not finished yesterday is added to today (done first). Only one day's worth carries over; 25+ topics adds an extra sitting.</label>
        <br><small>Today: ${(() => { const c = carryInfo(); return c.topics.length || Object.keys(c.exam).length ? `${c.topics.length} topics (${carryLeft().length} still to do)${Object.keys(c.exam).length ? ', exam practice: ' + Object.entries(c.exam).map(([k, v]) => k + ' +' + v).join(', ') : ''}${c.missedDay ? ' · she did not play yesterday' : ''}` : 'nothing carried over'; })()}</small></div>
      <div class="prow"><label><input type="checkbox" data-k="extendOnStruggle" ${set.extendOnStruggle !== false ? 'checked' : ''}> Longer sittings and a longer day when she struggles: if she gets under 70% right first time in a sitting, that sitting is stretched by 10 minutes (15 minutes if under 50%). Over the whole day (20+ answers), under 70% adds 1 extra sitting, under 50% adds 2. The extra time is spent on the topics she got wrong.</label>
        <br><small>Today so far: ${(() => { const t = todayFirstTry(); return t.n ? `${Math.round(t.pct * 100)}% right first time (${t.n} answers)` : 'no answers yet'; })()}${autoExtra() ? ` · <b>+${autoExtra()} extra sitting${autoExtra() > 1 ? 's' : ''} added</b>${dayRec().hardDone ? ` · ${dayRec().hardDone} tricky-topic questions done` : ''}` : ''}</small></div>
      <div class="prow">🔁 <b>Memory list</b> (things she got wrong; they come back until she gets them right several times over 2 weeks):
        ${(() => { const r = Object.values(store.review || {}); if (!r.length) return 'empty'; const due = r.filter(x => x.due <= Date.now()).length;
          return `${r.length} items, ${due} due now<br><small>${esc(r.sort((a, b) => b.misses - a.misses).slice(0, 12).map(x => (x.q.word || plainText(x.q.visual).slice(0, 25) || plainText(x.q.say).slice(0, 30)) + (x.misses > 1 ? ` ×${x.misses}` : '')).join(' · '))}</small>`; })()}</div>
      <div class="prow"><button class="pbtn" data-a="extra">Give one extra sitting now</button> <small>Today: ${sittings().length} sitting${sittings().length === 1 ? '' : 's'} (${sittings().map(x => Math.round(x.secs / 60) + ' min').join(' + ') || 'none yet'})</small></div>
      <div class="prow" style="display:none">Daily time limit <select data-k="dailyMinutes">${[0, 15, 20, 30, 45, 60].map(n => `<option value="${n}" ${n == set.dailyMinutes ? 'selected' : ''}>${n ? n + ' minutes' : 'No limit'}</option>`).join('')}</select></div>
      <div class="prow"><button class="pbtn" data-a="pet">Choose a new pet</button><button class="pbtn danger" data-a="reset">Reset all progress</button></div>
    </div>
    <p style="color:#666;font-size:14px">All progress is saved only on this tablet.</p>
  </div>`);
  st.querySelectorAll('[data-k]').forEach(el => {
    el.onchange = () => {
      const k = el.dataset.k;
      if (k === 'name') store.playerName = el.value.trim() || 'Zinnia';
      else if (k === 'examPerDay') { set.examPerDay = el.value === 'auto' ? 'auto' : Number(el.value); delete dayRec().examGoal; }
      else if (el.type === 'checkbox') set[k] = el.checked;
      else if (k === 'dailyPerWorld') set[k] = el.value === 'all' ? 'all' : Number(el.value);
      else if (['speechRate', 'sessionLength', 'dailyMinutes', 'sittingMinutes', 'sittingsPerDay', 'breakMinutes'].includes(k)) set[k] = Number(el.value);
      else set[k] = el.value;
      if (k === 'voiceName') refreshVoice();
      save();
    };
  });
  s.append(st);
  const repDate = s.querySelector('.rep-date'), repBody = s.querySelector('.rep-body');
  const drawReport = () => (repBody.innerHTML = dayReport(repDate.value));
  repDate.onchange = drawReport;
  drawReport();
  s.querySelectorAll('[data-mock]').forEach(b => {
    b.onclick = () => { const e = EXAMS.find(x => x.name === b.dataset.mock); if (e) playMock(e); };
  });
  s.querySelectorAll('[data-a]').forEach(b => {
    b.onclick = () => {
      const a = b.dataset.a;
      if (a === 'exit') map(false);
      if (a === 'extra') { dayRec().extraSittings = (dayRec().extraSittings || 0) + 1; dayRec().skipBreak = true; save(); map(true); }
      if (a === 'progress') progressScreen();
      if (a === 'test') say(`Hello ${name()}! I am Ollie. Let's learn and play!`);
      if (a === 'pet') { store.pet = null; save(); petPicker(); }
      if (a === 'reset' && confirm('Delete all coins, stars, stickers and progress?')) { resetAll(); splash(); }
    };
  });
  app.append(s);
}

// ---------- start ----------
// Keep everything she has done today marked as done (runs every time the app opens):
//  - work saved under "tomorrow" by the old GMT day change is moved back to today
//  - topics she practised today (from the question log, and each topic's last-practised time) are ticked
function restoreToday() {
  const t = today();
  const dr = (store.daily[t] ||= { secs: 0, right: 0, total: 0 });
  // a) records filed under a future date (old GMT clock) belong to today
  for (const k of Object.keys(store.daily)) {
    if (k <= t) continue;
    const f = store.daily[k];
    dr.secs += f.secs || 0; dr.right += f.right || 0; dr.total += f.total || 0;
    for (const field of ['skills', 'worlds', 'examDoneBy']) {
      if (!f[field]) continue;
      dr[field] ||= {};
      for (const [id, n] of Object.entries(f[field])) dr[field][id] = (dr[field][id] || 0) + n;
    }
    dr.examDone = (dr.examDone || 0) + (f.examDone || 0);
    for (const flag of ['missionDone', 'planDone']) if (f[flag]) dr[flag] = true;
    if (f.areas) dr.areas = { ...f.areas, ...(dr.areas || {}) };
    delete store.daily[k];
  }
  if (store.log) for (const k of Object.keys(store.log)) {
    if (k <= t) continue;
    (store.log[t] ||= []).push(...store.log[k]);
    delete store.log[k];
  }
  // b) tick every topic she practised today
  dr.skills ||= {};
  for (const e of store.log?.[t] || []) if (!dr.skills[e.s]) dr.skills[e.s] = 1;
  for (const [id, st] of Object.entries(store.skills)) {
    if (st.last && dayKey(st.last) === t && !dr.skills[id]) dr.skills[id] = 1;
  }
  save();
}
restoreToday();

// One-time upgrade for tablets that already had the app: switch to the every-topic daily mission
if (!store.settings.everyTopicV1) {
  if (store.settings.dailyPerWorld === 5) store.settings.dailyPerWorld = 'all';
  store.settings.everyTopicV1 = true;
  save();
}
// Updates: check when the app opens and whenever she comes back to it. A new version is
// switched in only on the map screen (never in the middle of a question). Progress is kept.
let updateReady = false;
let onMap = false;
if ('serviceWorker' in navigator) {
  const hadController = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!hadController) return; // first install, nothing to update
    updateReady = true;
    if (onMap) location.reload();
  });
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').then(reg => {
      document.addEventListener('visibilitychange', () => { if (!document.hidden) reg.update().catch(() => {}); });
      setInterval(() => reg.update().catch(() => {}), 30 * 60 * 1000);
    }).catch(() => {});
  });
}
splash();
