// Exam readiness: how ready she is for each Christmas term exam, measured from her play.
import { store, mastery, today } from './store.js';
import { ALL_SKILLS } from './worlds.js';

// From the Grade 1B Christmas term revision guide. skills: id prefixes or exact ids.
export const EXAMS = [
  { date: '2026-12-02', name: 'Phonics', emoji: '🦁', skills: ['p-vowels', 'p-sounds', 'p-keyword', 'p-onetwo', 'p-mark', 'p-ck', 'p-floss', 'l-rhyme', 'l-first-sound'] },
  { date: '2026-12-02', name: 'Spelling', emoji: '🔤', skills: ['p-spell', 'p-missing', 'p-blend', 'p-rightspell', 'm-spellnum'] },
  { date: '2026-12-03', name: 'English Grammar', emoji: '🏰', skills: ['g-'] },
  { date: '2026-12-03', name: 'Music', emoji: '🎼', skills: ['w-music'] },
  { date: '2026-12-04', name: 'Integrated Studies', emoji: '🌎', skills: ['w-body', 'w-food', 'w-groups', 'w-habits', 'w-senses', 'w-plants', 'w-family', 'w-animals', 'w-foodmore', 'w-care'] },
  { date: '2026-12-07', name: 'Mathematics', emoji: '🐒', skills: ['m-'] },
  { date: '2026-12-08', name: 'Bible', emoji: '📖', skills: ['b-'] },
  { date: '2026-12-08', name: 'Information Technology', emoji: '💻', skills: ['w-computer'] },
  { date: null, name: 'Reading & Comprehension', emoji: '🌳', skills: ['r-', 'l-story'] },
];

export const examSkills = exam => ALL_SKILLS.filter(sk => exam.skills.some(p => (p.endsWith('-') ? sk.id.startsWith(p) : sk.id === p)));

// One skill's readiness 0..1:
//   recent accuracy x level reached (harder questions count more) x how much she has practised it
export function skillReadiness(id) {
  const s = store.skills[id];
  if (!s || !s.seen) return 0;
  const levelFactor = [0.7, 0.85, 1][s.level - 1] || 0.7;
  const practice = Math.min(1, s.seen / 6);
  return mastery(id) * levelFactor * practice;
}

export function examReadiness(exam) {
  const sks = examSkills(exam);
  const scores = sks.map(sk => ({ sk, r: skillReadiness(sk.id) }));
  const pct = Math.round((scores.reduce((a, b) => a + b.r, 0) / Math.max(1, sks.length)) * 100);
  const tried = sks.filter(sk => store.skills[sk.id]?.seen).length;
  const weakest = scores.sort((a, b) => a.r - b.r).slice(0, 3).map(x => x.sk);
  return { pct, tried, total: sks.length, weakest, label: label(pct), colour: pct >= 75 ? '#2ec27e' : pct >= 50 ? '#9ccc3c' : pct >= 25 ? '#ffb020' : '#ff5964' };
}

function label(pct) {
  if (pct >= 75) return 'Ready ✅';
  if (pct >= 50) return 'Almost ready';
  if (pct >= 25) return 'Getting there';
  return 'Needs lots of practice';
}

// Rough number of practice questions still needed to be ready for an exam:
// every topic practised at least 6 times, plus extra for topics not yet at 75% readiness.
export function examNeed(exam) {
  return examSkills(exam).reduce((a, sk) => {
    const seen = store.skills[sk.id]?.seen || 0;
    return a + Math.max(0, 6 - seen) + (skillReadiness(sk.id) < 0.75 ? 3 : 0);
  }, 0);
}

export function daysUntil(date) {
  if (!date) return null;
  return Math.round((new Date(date + 'T00:00:00') - new Date(today() + 'T00:00:00')) / 864e5);
}

// The next exam that hasn't happened yet (the weakest one if two share a day)
export function nextExam() {
  const upcoming = EXAMS.filter(e => e.date && daysUntil(e.date) >= 0);
  if (!upcoming.length) return null;
  const first = upcoming[0].date;
  return upcoming.filter(e => e.date === first).sort((a, b) => examReadiness(a).pct - examReadiness(b).pct)[0];
}
