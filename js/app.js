import { store, save, record, mastery, needWeight, addTime, today, resetAll, skill } from './store.js';
import { say, sfx, stopSpeaking, listVoices, refreshVoice, micSupported } from './speech.js';
import { runQuestion } from './games.js';
import { pick, shuffle, esc, rnd } from './util.js';
import { WORLDS, ALL_SKILLS } from './worlds.js';

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
  return lim > 0 && (store.daily[today()]?.secs || 0) >= lim * 60;
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
  stopSpeaking();
  document.getElementById('confetti').innerHTML = '';
  if (overTime()) return breakTime();
  app.innerHTML = '';
  const s = h('<div class="screen"></div>');
  s.append(topbar(null));
  const line = greet ? `${greeting()}, ${name()}! Where shall we go today?` : 'Where shall we go next?';
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

  const adv = h(`<button class="big-btn adventure-btn"><span style="font-size:44px">🗺️</span> Today's Adventure</button>`);
  adv.onclick = () => { sfx.tap(); play({ title: "Today's Adventure", skills: ALL_SKILLS, mixed: true }); };
  s.append(adv);

  const grid = h('<div class="islands"></div>');
  for (const w of WORLDS) {
    const b = h(`<button class="island ${w.cls}"><div class="emo">${w.emo}</div><div class="name">${w.name}</div><div class="stars">${worldStars(w)}</div></button>`);
    b.onclick = () => { sfx.tap(); island(w); };
    grid.append(b);
  }
  s.append(grid);
  app.append(s);
  say(line);
}

function island(w) {
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

function makeQuestion(sk, levelOverride) {
  const lvl = levelOverride || skill(sk.id).level;
  const q = sk.gen(lvl);
  q.skill = sk.id;
  if (sk.type && !q.type) q.type = sk.type;
  // Reading/mic questions only when the device can do it, otherwise fallback still works
  return q;
}

async function play({ title, skills, mixed }) {
  stopSpeaking();
  if (overTime()) return breakTime();
  const total = store.settings.sessionLength;
  let pool = skills;
  if (mixed) {
    // Today's Adventure: the 6 skills that need the most practice + 2 random others
    const ranked = [...skills].sort((a, b) => needWeight(b.id) - needWeight(a.id));
    pool = [...ranked.slice(0, 6), ...shuffle(ranked.slice(6)).slice(0, 2)];
    if (store.settings.extraNumberLines) {
      // Always add the two number-line skills she needs most
      const nl = ranked.filter(sk => sk.id.startsWith('m-nl-') && !pool.includes(sk)).slice(0, 2);
      pool.push(...nl);
    }
  }
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

  let missRun = 0;          // wrong answers in a row this game
  let challengeNext = false; // she is on a streak: offer a harder bonus question

  while (done < total && count < maxQ && !quit) {
    let sk, mode = 'normal';
    if (missRun >= 2) {
      // Two misses in a row: give her an easy win from something she knows well
      sk = [...pool].sort((a, b) => mastery(b.id) - mastery(a.id))[0];
      mode = 'boost';
      missRun = 0;
    } else if (firstLesson) { sk = firstLesson; firstLesson = null; }
    else if (retry.length && (done >= total - retry.length || Math.random() < 0.35)) sk = retry.shift();
    else sk = chooseSkill(pool, last);
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
    const res = await runQuestion(q, stage);
    if (quit) break;
    // A missed challenge question is never counted against her
    if (!(mode === 'challenge' && !res.correct)) record(sk.id, res.correct && res.firstTry);
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
  save();
  results({ stars, earned, bestCombo, grew: petStage() > beforeStage, title });
}

function results({ stars, earned, bestCombo, grew }) {
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
    const row = h('<div style="display:flex;gap:14px;flex-wrap:wrap;justify-content:center"></div>');
    const again = h('<button class="big-btn green">Play more ▶</button>');
    const home = h('<button class="big-btn">🗺️ Map</button>');
    again.onclick = () => { sfx.tap(); play({ title: "Today's Adventure", skills: ALL_SKILLS, mixed: true }); };
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
function parentGate() {
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
    <div class="card"><b>Last 7 days</b><br>${days.map(([k, v]) => `${k}: ${Math.round(v.secs / 60)} min, ${v.right}/${v.total} right`).join('<br>') || 'No play yet'}</div>
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
      else if (['speechRate', 'sessionLength', 'dailyMinutes'].includes(k)) set[k] = Number(el.value);
      else set[k] = el.value;
      if (k === 'voiceName') refreshVoice();
      save();
    };
  });
  s.append(st);
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
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
splash();
