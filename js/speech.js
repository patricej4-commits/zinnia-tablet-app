// Voice (text-to-speech), microphone reading checks, and sound effects.
import { store } from './store.js';

const synth = window.speechSynthesis;
let voice = null;

function pickVoice() {
  if (!synth) return;
  const voices = synth.getVoices().filter(v => /^en/i.test(v.lang));
  const wanted = store.settings.voiceName;
  voice =
    voices.find(v => v.name === wanted) ||
    voices.find(v => /female|samantha|karen|serena|moira|tessa|zira|aria|jenny|libby|sonia|google uk english female/i.test(v.name)) ||
    voices.find(v => /en-GB/i.test(v.lang)) ||
    voices.find(v => /en-US/i.test(v.lang)) ||
    voices[0] || null;
}
if (synth) {
  pickVoice();
  synth.onvoiceschanged = pickVoice;
}

export function listVoices() {
  return synth ? synth.getVoices().filter(v => /^en/i.test(v.lang)) : [];
}
export function refreshVoice() { pickVoice(); }

// Speak text. Returns a promise that resolves when speech ends.
// opts: { rate, onWord(charIndex) }
export function say(text, opts = {}) {
  return new Promise(resolve => {
    if (!synth || !store.settings.voiceOn || !text) { resolve(); return; }
    synth.cancel();
    const u = new SpeechSynthesisUtterance(String(text).replace(/_+/g, ' blank '));
    if (voice) u.voice = voice;
    u.lang = voice ? voice.lang : 'en-GB';
    u.rate = (opts.rate || 0.9) * (store.settings.speechRate || 1);
    u.pitch = 1.15;
    let done = false;
    const finish = () => { if (!done) { done = true; resolve(); } };
    u.onend = finish;
    u.onerror = finish;
    if (opts.onWord) u.onboundary = e => { if (e.name === 'word' || e.name === undefined) opts.onWord(e.charIndex); };
    synth.speak(u);
    // Safety: some tablets never fire onend.
    setTimeout(finish, Math.max(2500, String(text).length * 120));
  });
}
export function stopSpeaking() { if (synth) synth.cancel(); }

// Slowly sound out a word, e.g. "c... a... t... cat"
export async function soundOut(parts, word) {
  for (const p of parts) await say(p, { rate: 0.7 });
  await say(word, { rate: 0.8 });
}

// ---------- Microphone: check that she read the words out loud ----------
const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
export const micSupported = !!Recognition;

const norm = s => String(s).toLowerCase().replace(/[^a-z0-9' ]/g, ' ').replace(/\s+/g, ' ').trim();

// Small edit distance so "shop" ~ "chop" style mishearings get partial credit
function close(a, b) {
  if (a === b) return true;
  if (Math.abs(a.length - b.length) > 1) return false;
  let diff = 0;
  for (let i = 0, j = 0; i < a.length || j < b.length; i++, j++) {
    if (a[i] !== b[j]) {
      diff++;
      if (a.length > b.length) j--; else if (b.length > a.length) i--;
    }
    if (diff > 1) return false;
  }
  return a.length > 3;
}

// Returns fraction of target words heard (0..1)
export function scoreReading(target, heardList) {
  const want = norm(target).split(' ');
  let best = 0;
  for (const heard of heardList) {
    const got = norm(heard).split(' ');
    let hit = 0;
    for (const w of want) if (got.some(g => g === w || close(g, w))) hit++;
    best = Math.max(best, hit / want.length);
  }
  return best;
}

// Why the last listen() failed ('no-speech', 'audio-capture', 'network', ...)
export let lastListenError = '';

// Listen once. Resolves with array of alternative transcripts ([] on failure).
export function listen(timeoutMs = 8000) {
  return new Promise(resolve => {
    if (!Recognition) { resolve(null); return; }
    stopSpeaking();
    const r = new Recognition();
    r.lang = 'en-US';
    r.interimResults = false;
    r.maxAlternatives = 5;
    let results = [];
    let finished = false;
    lastListenError = '';
    const end = () => { if (!finished) { finished = true; try { r.stop(); } catch (e) {} resolve(results); } };
    r.onresult = e => {
      for (const res of e.results) for (const alt of res) results.push(alt.transcript);
      end();
    };
    r.onerror = e => { lastListenError = e.error || 'error'; if (e.error === 'not-allowed' || e.error === 'service-not-allowed') results = null; end(); };
    r.onend = end;
    try { r.start(); } catch (e) { end(); }
    setTimeout(end, timeoutMs);
  });
}

// ---------- Sound effects (generated, no files needed) ----------
let ctx = null;
function audio() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}
function tone(freq, start, dur, type = 'sine', vol = 0.18) {
  const a = audio(); if (!a || !store.settings.sfxOn) return;
  const o = a.createOscillator(), g = a.createGain();
  o.type = type; o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, a.currentTime + start);
  g.gain.exponentialRampToValueAtTime(vol, a.currentTime + start + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + start + dur);
  o.connect(g).connect(a.destination);
  o.start(a.currentTime + start); o.stop(a.currentTime + start + dur + 0.05);
}
export const sfx = {
  unlock() { audio(); },
  tap() { tone(660, 0, 0.08, 'triangle', 0.08); },
  correct() { [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.08, 0.25, 'triangle')); },
  wrong() { tone(220, 0, 0.18, 'sine', 0.12); tone(180, 0.15, 0.25, 'sine', 0.1); },
  coin() { tone(988, 0, 0.08, 'square', 0.06); tone(1319, 0.08, 0.2, 'square', 0.06); },
  fanfare() { [523, 523, 523, 659, 784, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.12, 0.3, 'triangle', 0.15)); },
  pop() { tone(400, 0, 0.05, 'sine', 0.1); tone(800, 0.03, 0.08, 'sine', 0.08); },
};

// ---------- Record her reading and play it straight back (kept in memory only) ----------
export const recordSupported = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);
let lastUrl = null;

// Starts recording. Returns { stop() -> Promise<url> }. Throws if the mic is not allowed.
export async function startRecording() {
  stopSpeaking();
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const rec = new MediaRecorder(stream);
  const chunks = [];
  rec.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); };
  rec.start();
  let stopped = null;
  return {
    stop() {
      if (stopped) return stopped;
      stopped = new Promise(resolve => {
        rec.onstop = () => {
          stream.getTracks().forEach(t => t.stop());
          discardRecording();
          lastUrl = chunks.length ? URL.createObjectURL(new Blob(chunks, { type: rec.mimeType || 'audio/webm' })) : null;
          resolve(lastUrl);
        };
        try { rec.stop(); } catch (e) { stream.getTracks().forEach(t => t.stop()); resolve(null); }
      });
      return stopped;
    },
  };
}
export function playRecording(url) {
  return new Promise(resolve => {
    if (!url) { resolve(); return; }
    stopSpeaking();
    const a = new Audio(url);
    a.onended = resolve; a.onerror = resolve;
    a.play().catch(resolve);
    setTimeout(resolve, 30000);
  });
}
// Recordings are never saved: this deletes the last one.
export function discardRecording() {
  if (lastUrl) { URL.revokeObjectURL(lastUrl); lastUrl = null; }
}
