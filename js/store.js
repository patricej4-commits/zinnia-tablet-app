// Saves progress on the tablet (localStorage). Nothing leaves the device.
const KEY = 'zinnia-adventure-v1';

const defaults = () => ({
  playerName: 'Zinnia',
  coins: 0,
  stars: 0,
  stickers: [],          // collected sticker ids
  pet: null,             // { kind, name }
  skills: {},            // id -> { seen, right, streak, level, last, history: [1,0,...] }
  sessions: [],          // { date, world, right, total, secs }
  daily: {},             // 'YYYY-MM-DD' -> { secs, right, total }
  settings: {
    voiceOn: true,
    sfxOn: true,
    micOn: true,
    speechRate: 1,
    voiceName: '',
    sessionLength: 8,
    dailyPerWorld: 'all',  // daily mission: 'all' = every topic in every area; a number = questions per area; 0 = off
    examPerDay: 'auto',   // exam practice questions per day after the mission ('auto' = based on exam dates and readiness)     // daily mission: questions in EVERY area each day (0 = off)
    dailyMinutes: 0,      // 0 = no limit
    extraNumberLines: true, // she finds number lines hard: practise them in every adventure
  },
});

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaults();
    const d = JSON.parse(raw);
    const base = defaults();
    return { ...base, ...d, settings: { ...base.settings, ...(d.settings || {}) } };
  } catch (e) { return defaults(); }
}

export const store = load();

export function save() {
  try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) {}
}

export function resetAll() {
  const fresh = defaults();
  for (const k of Object.keys(store)) delete store[k];
  Object.assign(store, fresh);
  save();
}

// The tablet's own calendar day (local time), so the day ends at midnight in Jamaica, not 7 pm
export const dayKey = (t = new Date()) => {
  const d = new Date(t);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
export const today = () => dayKey();

export function skill(id) {
  if (!store.skills[id]) store.skills[id] = { seen: 0, right: 0, streak: 0, wrongRun: 0, level: 1, last: 0, history: [] };
  return store.skills[id];
}

// Record an answer and adapt difficulty (levels 1..3)
export function record(id, correct) {
  const s = skill(id);
  s.seen++; s.last = Date.now();
  s.history.push(correct ? 1 : 0);
  if (s.history.length > 20) s.history.shift();
  if (correct) {
    s.right++; s.streak++; s.wrongRun = 0;
    if (s.streak >= 3 && s.level < 3) { s.level++; s.streak = 0; }
  } else {
    s.streak = 0; s.wrongRun++;
    if (s.wrongRun >= 2 && s.level > 1) { s.level--; s.wrongRun = 0; }
  }
  const d = (store.daily[today()] ||= { secs: 0, right: 0, total: 0 });
  d.total++; if (correct) d.right++;
  save();
}

// Recent accuracy 0..1 (unknown skills count as 0.5)
export function mastery(id) {
  const h = store.skills[id]?.history || [];
  if (!h.length) return 0.5;
  const recent = h.slice(-10);
  return recent.reduce((a, b) => a + b, 0) / recent.length;
}

// Weight for picking practice: weak + not-seen-recently skills come up more
export function needWeight(id) {
  const s = store.skills[id];
  if (!s) return 1.2;
  const hoursAgo = (Date.now() - s.last) / 36e5;
  return (1.15 - mastery(id)) * 2 + Math.min(hoursAgo / 24, 1);
}

export function addTime(secs) {
  const d = (store.daily[today()] ||= { secs: 0, right: 0, total: 0 });
  d.secs += secs;
  save();
}
