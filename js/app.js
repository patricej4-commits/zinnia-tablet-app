import { store, save, record, mastery, needWeight, addTime, today, resetAll, skill } from './store.js';
import { say, sfx, stopSpeaking, listVoices, refreshVoice, micSupported } from './speech.js';
import { runQuestion, runDemo, canDemo } from './games.js';
import { pick, shuffle, esc, rnd } from './util.js';
import { WORLDS, ALL_SKILLS } from './worlds.js';
import { EXAMS, examReadiness, examSkills, daysUntil, nextExam } from './exam.js';

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
const STICKERS = ['🦋', '🐬', '🕊️', '🌈', '✝️', '📖', '🙏', '⛪', '💖', '🍦', '🧁', '🎀', '👑', '🐠', '🦩', '🐼', '🐨', '🦊', '🐯', '🐸', '🐙', '🦀', '🐳', '🌻', '🌺', '🍓', '🍉', '🍍', '🥭', '🎈', '🎨', '🎵', '🚀', '⭐', '🌙', '☀️', '🪐', '💎', '🏆', '🎁', '🍭', '🐝', '🐞', '🦜', '🐢', '🦒', '🐘', '🦓', '🐧', '🦉', '🌴', '🏝️', '🎠', '🎡', '🛼', '🪁', '🧸', '🍩', '🥥', '🐚', '🦕', '🐿️', '🦔', '🌷'];

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

// ---------- timing ----------
let tick = null;
function startClock() {
  stopClock();
  tick = setInterval(() => { if (!document.hidden) addTime(10); }, 10000);
}
function stopClock() { clearInterval(tick); }
function overTime() {
  const lim = store.settings.dailyMinutes;
  // The time limit only applies once today's mission is finished
  return lim > 0 && (store.daily[today()]?.secs || 0) >= lim * 60 && missionDone();
}

// ---------- Daily mission: a set number of questions in EVERY area, every day ----------
const WORLD_OF = {};
WORLDS.forEach(w => w.skills.forEach(sk => (WORLD_OF[sk.id] = w.id)));
const dayRec = (d = today()) => (store.daily[d] ||= { secs: 0, right: 0, total: 0 });
const perWorld = () => store.settings.dailyPerWorld || 0;
const worldDoneToday = (w, d = today()) => store.daily[d]?.worlds?.[w.id] || 0;
// An area is 'retry' when she got most of a round wrong: she must redo it before moving on.
const areaStatus = (w, d = today()) => store.daily[d]?.areas?.[w.id];
const missionLeft = w => {
  const left = Math.max(0, perWorld() - worldDoneToday(w));
  return left === 0 && areaStatus(w) === 'retry' ? perWorld() : left;
};
function missionDone() { return perWorld() === 0 || WORLDS.every(w => missionLeft(w) === 0); }
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
  return '';
}
function logAnswer(q, sk, res) {
  store.log ||= {};
  const d = today();
  (store.log[d] ||= []).push({
    t: new Date().toTimeString().slice(0, 5), w: WORLD_OF[sk.id], s: sk.id,
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
    const key = d.toISOString().slice(0, 10);
    if (!store.daily[key]?.missionDone) break;
    n++; d.setDate(d.getDate() - 1);
  }
  return n;
}
function playMission() {
  const w = nextMissionWorld();
  if (!w) return map(false);
  const redo = areaStatus(w) === 'retry';
  play({ title: (redo ? 'Practise again: ' : 'Daily Mission: ') + w.name, skills: w.skills, mixed: true, length: Math.max(3, redo ? perWorld() : missionLeft(w)), mission: true, world: w });
}

function greeting() {
  const hr = new Date().getHours();
  return hr < 12 ? 'Good morning' : hr < 17 ? 'Good afternoon' : 'Good evening';
}

// ========== SCREENS ==========
function splash() {
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
    <div class="spacer"></div>
    <button class="icon-btn" data-a="stickers" aria-label="Sticker book">📒</button>
    <button class="icon-btn" data-a="parent" aria-label="Grown-ups" style="font-size:18px">👪</button>
  </div>`);
  bar.querySelectorAll('button').forEach(b => {
    b.onclick = () => {
      sfx.tap();
      const a = b.dataset.a;
      if (a === 'back') back();
      if (a === 'stickers') stickerBook();
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
  if (overTime()) return breakTime();
  app.innerHTML = '';
  const s = h('<div class="screen"></div>');
  s.append(topbar(null));
  let line = greet ? `${greeting()}, ${name()}! Where shall we go today?` : 'Where shall we go next?';
  const rw = perWorld() > 0 ? retryWorld() : null;
  if (rw) line = `${greet ? greeting() + ', ' + name() + '! ' : ''}Let's practise ${rw.name} again before we move on. I will help you!`;
  if (!rw && perWorld() > 0 && !missionDone()) { const left = WORLDS.filter(w => missionLeft(w) > 0).length; line += ` You have ${left} area${left === 1 ? '' : 's'} left in today's mission. Let's do it!`; }
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

  if (perWorld() > 0) {
    const doneN = WORLDS.filter(w => missionLeft(w) === 0).length;
    const card = h(`<div class="mission">
      <h3>📋 Today's Mission: ${doneN} of ${WORLDS.length} areas done ${missionDone() ? '🏆' : ''}</h3>
      <div class="mchips">${WORLDS.map(w => `<span class="mchip ${missionLeft(w) === 0 ? 'ok' : ''}">${w.emo} ${areaStatus(w) === 'retry' ? '🔁 again' : missionLeft(w) === 0 ? '✅' : `${worldDoneToday(w)}/${perWorld()}`}</span>`).join('')}</div>
    </div>`);
    if (!missionDone()) {
      const nw = nextMissionWorld();
      const redo = areaStatus(nw) === 'retry';
      const mb = h(`<button class="big-btn green adventure-btn" style="margin:0"><span style="font-size:40px">${redo ? '🔁' : '▶'}</span> ${redo ? 'Practise again' : 'Do my mission'}: ${nw.emo} ${nw.name}</button>`);
      mb.onclick = () => { sfx.tap(); playMission(); };
      card.append(mb);
    } else {
      const st = missionStreak();
      card.append(h(`<div style="font-size:20px">🎉 Mission complete! ${st > 1 ? `🔥 ${st} days in a row!` : 'Great work today!'}</div>`));
    }
    s.append(card);
  }
  const adv = h(`<button class="big-btn adventure-btn"><span style="font-size:44px">🗺️</span> Today's Adventure</button>`);
  adv.onclick = () => { sfx.tap(); play({ title: "Today's Adventure", skills: ALL_SKILLS, mixed: true }); };
  if (!rw) s.append(adv); // locked until the area she needs to redo is passed
  const ex = rw ? null : nextExam();
  if (ex) {
    const d = daysUntil(ex.date);
    const eb = h(`<button class="big-btn green adventure-btn" style="font-size:clamp(20px,3.4vw,30px)"><span style="font-size:36px">📝</span> Exam Practice: ${ex.emoji} ${ex.name} <small style="font-size:.6em">(${d === 0 ? 'today!' : d === 1 ? 'tomorrow' : 'in ' + d + ' days'})</small></button>`);
    eb.onclick = () => { sfx.tap(); play({ title: 'Exam Practice: ' + ex.name, skills: examSkills(ex), mixed: true }); };
    s.append(eb);
  }

  const grid = h('<div class="islands"></div>');
  for (const w of WORLDS) {
    const badge = perWorld() > 0 ? `<span class="mbadge">${missionLeft(w) === 0 ? '✅' : `${worldDoneToday(w)}/${perWorld()}`}</span>` : '';
    const b = h(`<button class="island ${w.cls}" style="position:relative">${badge}<div class="emo">${w.emo}</div><div class="name">${w.name}</div><div class="stars">${worldStars(w)}</div></button>`);
    if (rw && w !== rw) b.style.opacity = '.45';
    b.onclick = () => {
      sfx.tap();
      if (rw && w !== rw) { say(`Let's finish ${rw.name} first. Then you can go to ${w.name}!`); return; }
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
    const b = h(`<button class="skill-btn"><span class="e">${sk.emoji}</span><span>${esc(sk.name)}<small>${'★'.repeat(n)}${'☆'.repeat(3 - n)}</small></span></button>`);
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
const qSig = q => [q.skill, q.text, q.say, q.word, q.sentence, q.target, q.start, q.hops, JSON.stringify(q.answer)].join('|');

function makeQuestion(sk, levelOverride) {
  const lvl = levelOverride || skill(sk.id).level;
  const recent = new Set(store.recentQs || []);
  let q;
  for (let i = 0; i < 20; i++) {
    q = sk.gen(lvl);
    q.skill = sk.id;
    if (!recent.has(qSig(q))) break; // try for one she has not seen lately
  }
  if (sk.type && !q.type) q.type = sk.type;
  store.recentQs = [...(store.recentQs || []), qSig(q)].slice(-400);
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

async function play({ title, skills, mixed, length, mission, world }) {
  onMap = false;
  stopSpeaking();
  if (overTime()) return breakTime();
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
  const maxQ = total + 3;

  const timesAsked = {};    // topic -> questions asked this game (max 2 each, so it does not repeat)
  const gameMisses = {};    // topic -> misses this game
  const tally = {};         // area -> { n, right, missed: [] } to decide if she can move on
  // Redoing an area: re-teach (worked example first) the topics she missed, and practise them first
  const reteach = world && areaStatus(world) === 'retry' ? (dayRec().missed?.[world.id] || []) : [];
  for (const id of reteach) gameMisses[id] = 2;
  const firstUp = skills.filter(sk => reteach.includes(sk.id)).slice(0, 3); // asked first, with a worked example
  for (const sk of firstUp) if (!pool.includes(sk)) pool.push(sk);
  const strongest = [...pool].filter(sk => store.skills[sk.id]?.seen >= 3).sort((a, b) => mastery(b.id) - mastery(a.id))[0];
  let missRun = 0;          // wrong answers in a row this game
  let challengeNext = false; // she is on a streak: offer a harder bonus question

  while (done < total && count < maxQ && !quit) {
    let sk, mode = 'normal';
    if (missRun >= 2) {
      // Two misses in a row: give her an easy win from something she knows well
      sk = [...pool].sort((a, b) => mastery(b.id) - mastery(a.id))[0];
      mode = 'boost';
      missRun = 0;
    } else if (firstUp.length) { sk = firstUp.shift(); }
    else if (firstLesson) { sk = firstLesson; firstLesson = null; }
    else if (retry.length && (done >= total - retry.length || Math.random() < 0.35)) sk = retry.shift();
    else if (count === 0 && strongest && mastery(strongest.id) >= 0.6) { sk = strongest; mode = 'warm'; }
    else {
      const open = pool.filter(p => (timesAsked[p.id] || 0) < 2);
      sk = chooseSkill(open.length ? open : pool, last);
    }
    timesAsked[sk.id] = (timesAsked[sk.id] || 0) + 1;
    if (mode === 'normal' && challengeNext) { mode = 'challenge'; challengeNext = false; }
    last = sk.id;
    count++;
    const lvl = skill(sk.id).level;
    const q = makeQuestion(sk, mode === 'boost' ? 1 : mode === 'challenge' ? Math.min(3, lvl + 1) : lvl);
    if (mode === 'challenge') {
      toast('⭐ Challenge question! Bonus coins! ⭐');
      q.say = 'Challenge time! ' + q.say;
    }
    if (mode === 'boost') q.say = pick(['Here is one you know!', 'You can do this one!', 'Let\'s warm up!']) + ' ' + q.say;
    if (mode === 'warm') q.say = 'Let\'s warm up! ' + q.say;
    // First time on a topic, or she is finding it hard: Ollie shows a worked example first
    const st = store.skills[sk.id];
    if (mode !== 'challenge' && (!st || !st.seen || (gameMisses[sk.id] || 0) >= 2)) {
      const demo = makeQuestion(sk, 1);
      if (canDemo(demo)) { await runDemo(demo, stage); gameMisses[sk.id] = 0; if (quit) break; }
    }
    // Listening reminders: start of the game, every third question, and before listening questions
    if (count === 1) q.preSay = `${pick(['Let\'s go', 'Here we go', 'Ready'])}, ${name()}! Remember to listen carefully to every question.`;
    else if (q.listenOnly) q.preSay = pick(['Listening question! Ears ready?', 'Super listening ears on!', 'Listen very carefully to this one.']);
    else if (count % 3 === 0) q.preSay = pick(LISTEN_TIPS);
    const res = await runQuestion(q, stage);
    if (quit) break;
    // A missed challenge question is never counted against her
    if (!(mode === 'challenge' && !res.correct)) record(sk.id, res.correct && res.firstTry);
    // Count towards today's mission (every answered question counts in its area)
    const dr = dayRec(); dr.worlds ||= {};
    dr.worlds[WORLD_OF[sk.id]] = (dr.worlds[WORLD_OF[sk.id]] || 0) + 1;
    logAnswer(q, sk, res);
    if (mode !== 'challenge') {
      const tl = (tally[WORLD_OF[sk.id]] ||= { n: 0, right: 0, missed: [] });
      tl.n++;
      if (res.correct && res.firstTry) tl.right++;
      else if (!tl.missed.includes(sk.id)) tl.missed.push(sk.id);
    }
    if (res.correct) {
      done++; missRun = 0;
      const c = (res.firstTry ? 3 : 1) * (mode === 'challenge' ? 2 : 1);
      earned += c; store.coins += c;
      if (res.firstTry) { firstRight++; combo++; bestCombo = Math.max(bestCombo, combo); } else combo = 0;
      if (combo > 0 && combo % 3 === 0) { store.coins += 2; earned += 2; toast('🔥 Combo bonus +2 🪙'); sfx.coin(); challengeNext = true; }
    } else {
      combo = 0;
      done++;
      if (mode !== 'challenge') {
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
      retryArea = retryArea || WORLDS.find(w => w.id === wid);
    } else {
      dr2.areas[wid] = 'pass'; delete dr2.missed[wid];
    }
  }
  // Whole daily mission finished?
  let missionComplete = false;
  if (perWorld() > 0 && missionDone() && !dayRec().missionDone) {
    dayRec().missionDone = true; missionComplete = true;
    store.coins += 20; earned += 20;
  }
  save();
  results({ stars, earned, bestCombo, grew: petStage() > beforeStage, title, missionComplete, retryArea });
}

function results({ stars, earned, bestCombo, grew, missionComplete, retryArea }) {
  app.innerHTML = '';
  const s = h(`<div class="screen center">
    <div class="title">${stars === 3 ? 'SUPERSTAR!' : stars === 2 ? 'Great job!' : 'Well done!'}</div>
    <div class="result-stars">${[1, 2, 3].map(i => `<span class="${i <= stars ? '' : 'off'}" style="animation-delay:${i * 0.25}s">⭐</span>`).join('')}</div>
    <div class="white">+${earned} 🪙 coins ${bestCombo >= 3 ? ` · best streak 🔥${bestCombo}` : ''}</div>
    <div class="bubble" style="margin:16px 0">Tap the treasure chest!</div>
    <div class="chest">🎁</div>
    <div class="after hidden" style="display:flex;flex-direction:column;align-items:center;gap:14px"></div>
  </div>`);
  app.append(s);
  sfx.fanfare(); confetti(stars * 20);
  const praise = stars === 3 ? `Wow ${name()}! Three stars! You are a superstar!` : stars === 2 ? `Great job ${name()}! Two stars!` : `Well done ${name()}! Every try makes your brain stronger!`;
  say(praise + ' Tap the treasure chest!');
  const chest = s.querySelector('.chest');
  chest.onclick = () => {
    chest.onclick = null;
    sfx.correct(); confetti(30);
    const left = STICKERS.filter(x => !store.stickers.includes(x));
    let prize;
    if (left.length) { prize = pick(left); store.stickers.push(prize); }
    else { prize = '🪙'; store.coins += 10; }
    save();
    chest.className = 'prize'; chest.textContent = prize;
    s.querySelector('.bubble').textContent = left.length ? 'A new sticker for your book!' : '+10 bonus coins!';
    say(left.length ? 'A new sticker for your sticker book!' : 'Ten bonus coins!');
    const after = s.querySelector('.after');
    after.classList.remove('hidden');
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
    const nw = !missionDone() && nextMissionWorld();
    const again = h(`<button class="big-btn green">${nw ? (areaStatus(nw) === 'retry' ? `🔁 Practise ${nw.emo} ${nw.name} again` : `Next mission: ${nw.emo} ${nw.name} ▶`) : 'Play more ▶'}</button>`);
    const home = h('<button class="big-btn">🗺️ Map</button>');
    if (nw && !retryArea) setTimeout(() => say(`Next, let's do ${nw.name}!`), grew ? 5000 : 2400);
    again.onclick = () => { sfx.tap(); if (nw) playMission(); else play({ title: "Today's Adventure", skills: ALL_SKILLS, mixed: true }); };
    home.onclick = () => { sfx.tap(); map(false); };
    row.append(again, home);
    after.append(row);
  };
}

function breakTime() {
  stopClock();
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

function stickerBook() {
  onMap = false;
  stopSpeaking();
  app.innerHTML = '';
  const s = h('<div class="screen"></div>');
  s.append(topbar(() => map(false)));
  s.append(h(`<div class="title" style="text-align:center">📒 My Sticker Book</div>`));
  s.append(h(`<div class="white" style="text-align:center;margin-bottom:12px">${store.stickers.length} of ${STICKERS.length} stickers</div>`));
  const g = h('<div class="sticker-grid"></div>');
  for (const st of STICKERS) {
    const has = store.stickers.includes(st);
    const c = h(`<button class="sticker ${has ? '' : 'locked'}">${has ? st : '?'}</button>`);
    if (has) c.onclick = () => { sfx.pop(); c.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.3) rotate(-10deg)' }, { transform: 'scale(1)' }], 400); };
    g.append(c);
  }
  s.append(g);
  app.append(s);
  say(`You have ${store.stickers.length} stickers! Play more to win more!`);
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
    html += `<tr><td>${w.emo} ${w.name}</td><td>${es.length}${perWorld() ? ' / ' + perWorld() : ''}</td><td>${es.length ? Math.round((right / es.length) * 100) + '%' : '—'}</td><td>${st === 'retry' ? '🔁 must redo' : st === 'pass' ? '✅ passed' : es.length ? '' : 'not done'}</td></tr>`;
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
    <div class="card"><b>📅 Day report</b> — what she did on any day
      <div class="prow">Day <input type="date" class="rep-date" value="${today()}" max="${today()}"></div>
      <div class="rep-body"></div></div>
    <div class="card"><b>Last 7 days</b> ${perWorld() ? `· mission streak 🔥 ${missionStreak()}` : ''}<br>${days.map(([k, v]) => `${k}: ${v.missionDone ? '✅ mission done' : perWorld() ? '❌ mission not finished' : ''} · ${Math.round(v.secs / 60)} min, ${v.right}/${v.total} right first time<br><small>${WORLDS.map(w => `${w.emo} ${v.worlds?.[w.id] || 0}`).join(' &nbsp; ')}</small>`).join('<br>') || 'No play yet'}</div>
    <div class="card"><b>📝 Exam readiness</b> <small>(Christmas term exams, measured from how she plays)</small>
      <table class="ptable" style="margin-top:8px"><tr><th>Exam</th><th>Ready?</th><th>Practise next</th></tr>
      ${EXAMS.map(e => { const r = examReadiness(e); const d = daysUntil(e.date);
        const when = !e.date ? 'every day' : `${new Date(e.date + 'T12:00:00').toDateString().slice(0, 10)} · ${d > 1 ? d + ' days' : d === 1 ? 'tomorrow' : d === 0 ? 'today' : 'done'}`;
        return `<tr><td>${e.emoji} <b>${esc(e.name)}</b><br><small>${when}</small></td>
          <td style="min-width:140px"><div class="bar"><i style="width:${r.pct}%;background:${r.colour}"></i></div><b>${r.pct}%</b> ${r.label}<br><small>${r.tried} of ${r.total} topics tried</small></td>
          <td><small>${r.pct >= 75 ? 'Keep it up!' : r.weakest.map(sk => sk.emoji + ' ' + esc(sk.name)).join('<br>')}</small></td></tr>`; }).join('')}
      </table>
      <small>Readiness = recent accuracy × level reached × amount of practice, for every topic in the revision guide. 75%+ means she is answering harder questions correctly and consistently.</small></div>
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
      <div class="prow">Daily mission: questions in EVERY area each day <select data-k="dailyPerWorld">${[0, 3, 5, 8, 10].map(n => `<option value="${n}" ${n == set.dailyPerWorld ? 'selected' : ''}>${n ? n + ' per area (' + n * WORLDS.length + ' a day)' : 'Off'}</option>`).join('')}</select></div>
      <div class="prow">Questions per game <select data-k="sessionLength">${[5, 8, 10, 12, 15].map(n => `<option ${n == set.sessionLength ? 'selected' : ''}>${n}</option>`).join('')}</select></div>
      <div class="prow"><label><input type="checkbox" data-k="extraNumberLines" ${set.extraNumberLines ? 'checked' : ''}> Extra number line practice in every Today's Adventure</label></div>
      <div class="prow">Daily time limit <select data-k="dailyMinutes">${[0, 15, 20, 30, 45, 60].map(n => `<option value="${n}" ${n == set.dailyMinutes ? 'selected' : ''}>${n ? n + ' minutes' : 'No limit'}</option>`).join('')}</select></div>
      <div class="prow"><button class="pbtn" data-a="pet">Choose a new pet</button><button class="pbtn danger" data-a="reset">Reset all progress</button></div>
    </div>
    <p style="color:#666;font-size:14px">All progress is saved only on this tablet.</p>
  </div>`);
  st.querySelectorAll('[data-k]').forEach(el => {
    el.onchange = () => {
      const k = el.dataset.k;
      if (k === 'name') store.playerName = el.value.trim() || 'Zinnia';
      else if (el.type === 'checkbox') set[k] = el.checked;
      else if (['speechRate', 'sessionLength', 'dailyMinutes', 'dailyPerWorld'].includes(k)) set[k] = Number(el.value);
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
  s.querySelectorAll('[data-a]').forEach(b => {
    b.onclick = () => {
      const a = b.dataset.a;
      if (a === 'exit') map(false);
      if (a === 'test') say(`Hello ${name()}! I am Ollie. Let's learn and play!`);
      if (a === 'pet') { store.pet = null; save(); petPicker(); }
      if (a === 'reset' && confirm('Delete all coins, stars, stickers and progress?')) { resetAll(); splash(); }
    };
  });
  app.append(s);
}

// ---------- start ----------
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
