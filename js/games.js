// Renders one question and resolves when it is finished.
import { say, sfx, listen, scoreReading, micSupported, stopSpeaking, recordSupported, startRecording, playRecording, discardRecording, lastListenError } from './speech.js';
import { store } from './store.js';
import { pick, shuffle, esc } from './util.js';
import { shapeSVG, numberLine } from './visuals.js';

const PRAISE = ['Yes! Brilliant!', 'Woo-hoo! You got it!', 'Super star!', 'Amazing!', 'Wow, clever girl!', 'Fantastic!', 'You are on fire!', 'Correct! High five!', 'Awesome job!', 'Yay!'];
const RETRY = ['Oops! Try again.', 'Almost! Have another go.', 'Not quite. You can do it!', 'Hmm, look again.', 'Listen carefully and try again.', 'Let\'s listen again and have another go.'];

const h = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };

// Main entry. root = element to draw into. Returns { correct, firstTry }
export function runQuestion(q, root) {
  return new Promise(resolve => {
    root.innerHTML = '';
    let attempts = 0;
    let finished = false;
    let earUses = 0;

    // ----- prompt with Ollie -----
    const listenOnly = q.listenOnly;
    const shownText = listenOnly ? '🎧 Listen carefully!' : esc(q.text || q.say);
    const ask = h(`<div class="ask"><div class="mascot">🦉</div><div class="bubble">${shownText}</div><button class="icon-btn ear" aria-label="Hear it again">👂</button></div>`);
    const owl = ask.querySelector('.mascot');
    const ear = ask.querySelector('.ear');
    discardRecording(); // recordings from the last question are deleted
    if (q.preSay) root.append(h(`<div class="listen-tip">👂 ${esc(q.preSay)}</div>`));
    root.append(ask);
    // 📌 The rule or steps for this kind of question, always on screen
    if (q.remind) root.append(h(`<div class="remind">📌 ${esc(q.remind).replace(/ (\d)\. /g, '<br>$1. ')}</div>`));

    const speak = async (text, opts) => { owl.classList.add('talk'); await say(text, opts); owl.classList.remove('talk'); };

    // 🎙️ On reading questions she can record herself reading and hear it straight back
    let activeRec = null;
    if (q.readFirst && (q.type || 'choice') !== 'read' && recordSupported && store.settings.micOn) {
      const rb = h('<button class="icon-btn" aria-label="Record my reading" title="Read it out loud and hear yourself">🎙️</button>');
      ask.append(rb);
      let stopTimer;
      const stopAndPlay = async () => {
        clearTimeout(stopTimer);
        const r = activeRec; activeRec = null;
        rb.textContent = '🎙️'; rb.classList.remove('rec-on');
        const url = r ? await r.stop() : null;
        if (url && !finished) { await speak('Listen to yourself!'); await playRecording(url); }
      };
      rb.onclick = async () => {
        sfx.tap();
        if (activeRec) { stopAndPlay(); return; }
        try {
          activeRec = await startRecording();
          rb.textContent = '⏹'; rb.classList.add('rec-on');
          stopTimer = setTimeout(stopAndPlay, 20000);
        } catch (e) { rb.remove(); }
      };
    }
    const maxEars = listenOnly ? (q.maxReplays ?? 2) : 99;

    ear.onclick = () => {
      if (earUses >= maxEars) { speak('Listen with your best ears. Have a go!'); return; }
      earUses++;
      if (listenOnly && earUses >= maxEars) ear.classList.add('used');
      speak(q.earSay || q.say);
    };

    // Reading questions: Ollie says the instruction, but never reads the words for her.
    const intro = speak((q.preSay ? q.preSay + ' ' : '') + (q.remindSay ? q.remindSay + ' ' : '') + (q.readFirst ? `${pick(['Reading time!', 'You can read this!', 'Use your reading eyes!'])} ${q.say}` : q.say));

    const vis = q.visual ? h(`<div class="visual">${q.visual}</div>`) : null;
    if (vis) root.append(vis);
    const area = h('<div style="width:100%;display:flex;flex-direction:column;align-items:center;gap:14px"></div>');
    root.append(area);
    // Listen first: she can't answer until Ollie has finished reading the question
    if (store.settings.voiceOn && window.speechSynthesis) {
      area.classList.add('wait-listen');
      intro.then(() => area.classList.remove('wait-listen'));
    }

    const finish = (correct) => {
      if (finished) return;
      finished = true;
      if (activeRec) { activeRec.stop().then(discardRecording); activeRec = null; }
      resolve({ correct, firstTry: correct && attempts === 0, listened: earUses });
    };

    // Called by each type when she answers
    const onRight = async () => {
      sfx.correct();
      await speak(q.praise || pick(PRAISE));
      if (q.after) await speak(q.after);
      // 💡 Why it is right: shown, and read out when asked (so she learns the reason, not just the answer)
      if (q.why) {
        area.append(h(`<div class="teach why">💡 <b>${q.whyLabel || 'Why?'}</b> ${esc(q.why)}</div>`));
        if (q.whySay) await speak(q.why); else await new Promise(r => setTimeout(r, 2200));
      }
      setTimeout(() => finish(true), 250);
    };
    const onWrong = async (showAnswer) => {
      attempts++;
      sfx.wrong();
      if (attempts < (q.tries || 2)) {
        speak(pick(RETRY) + (q.hint ? ' ' + q.hint : ''));
        return false;
      }
      // Teach, then move on (the skill will come back later)
      showAnswer && showAnswer();
      const teach = h(`<div class="teach">💡 ${esc(q.explain || 'Let\'s remember this one!')}${q.explainVisual ? `<div style="margin-top:8px">${q.explainVisual}</div>` : ''}</div>`);
      const nextRow = h('<div class="next-row"><button class="big-btn green">Next ➜</button></div>');
      area.append(teach, nextRow);
      nextRow.querySelector('button').onclick = () => { stopSpeaking(); sfx.tap(); finish(false); };
      speak(q.explain || '');
      return true;
    };

    const type = q.type || 'choice';
    const ctx = { onRight, onWrong, speak, noteMiss: () => { attempts++; } };
    const startPlay = () => ({ choice, order, build, mark, read, follow, numline, column }[type])(q, area, ctx);
    if (q.prelude) {
      // Watch-and-learn lesson first, then the question
      ear.style.visibility = 'hidden';
      intro.then(() => q.prelude(vis, speak)).then(() => {
        if (q.ask) { ask.querySelector('.bubble').textContent = q.ask; q.say = q.ask; speak(q.ask); }
        ear.style.visibility = '';
        startPlay();
      });
    } else startPlay();
  });
}

// ---------- multiple choice ----------
function choice(q, area, { onRight, onWrong, speak }) {
  const box = h(`<div class="options ${q.cols || ''}"></div>`);
  let locked = false;
  for (const o of q.options) {
    const b = h(`<button class="opt">${o.html}</button>`);
    b.onclick = async () => {
      if (locked || b.classList.contains('dim')) return;
      if (o.value === q.answer) {
        locked = true;
        b.classList.add('right');
        [...box.children].forEach(c => c !== b && c.classList.add('dim'));
        onRight();
      } else {
        b.classList.add('wrong');
        setTimeout(() => b.classList.add('dim'), 400);
        const done = await onWrong(() => {
          [...box.children].forEach((c, i) => { if (q.options[i].value === q.answer) c.classList.add('right'); });
        });
        if (done) locked = true;
      }
    };
    // long-press an option to hear it (only when not a reading question)
    if (o.say && !q.readFirst) {
      let t;
      b.addEventListener('pointerdown', () => { t = setTimeout(() => speak(o.say), 600); });
      ['pointerup', 'pointerleave'].forEach(ev => b.addEventListener(ev, () => clearTimeout(t)));
    }
    box.append(b);
  }
  area.append(box);
}

// ---------- tap in order ----------
function order(q, area, { onRight, onWrong }) {
  const row = h('<div class="order-row"></div>');
  const tiles = h('<div class="tiles"></div>');
  const how = h('<div class="marklegend">👆 Tap the tiles in order. Tap the first one first.</div>');
  let idx = 0, locked = false;
  for (const v of q.items) {
    const t = h(`<button class="tile" style="width:auto;min-width:86px;padding:0 12px">${v}</button>`);
    t.onclick = async () => {
      if (locked || t.classList.contains('used')) return;
      if (v === q.answer[idx]) {
        sfx.pop();
        t.classList.add('used');
        row.append(h(`<div class="slot filled" style="width:auto;min-width:86px;padding:0 12px">${v}</div>`));
        idx++;
        if (idx === q.answer.length) { locked = true; onRight(); }
      } else {
        t.animate([{ transform: 'translateX(-8px)' }, { transform: 'translateX(8px)' }, { transform: 'none' }], 300);
        const done = await onWrong(() => {
          row.innerHTML = q.answer.map(a => `<div class="slot filled" style="width:auto;min-width:86px;padding:0 12px">${a}</div>`).join('');
          tiles.remove(); how.remove();
        });
        if (done) locked = true;
      }
    };
    tiles.append(t);
  }
  area.append(row, tiles, how);
}

// ---------- build a word from letter tiles ----------
function build(q, area, { onRight, onWrong, speak }) {
  const target = q.parts || q.word.split(''); // parts = sound chunks like sh, igh, ck
  const letters = shuffle([...target, ...(q.extra || [])]);
  const slots = h('<div class="slots"></div>');
  const tiles = h('<div class="tiles"></div>');
  const filled = [];
  let locked = false;
  const drawSlots = () => {
    slots.innerHTML = '';
    target.forEach((_, i) => {
      const f = filled[i];
      const s = h(`<button class="slot ${f ? 'filled' : ''}">${f ? f.ch : ''}</button>`);
      s.onclick = () => { if (locked || !f) return; f.tile.classList.remove('used'); filled.splice(i, 1); drawSlots(); };
      slots.append(s);
    });
  };
  letters.forEach(ch => {
    const t = h(`<button class="tile">${ch}</button>`);
    t.onclick = async () => {
      if (locked || t.classList.contains('used') || filled.length >= target.length) return;
      sfx.pop();
      t.classList.add('used');
      filled.push({ ch, tile: t });
      drawSlots();
      if (filled.length === target.length) {
        const word = filled.map(f => f.ch).join('');
        if (word === q.word) { locked = true; speak(q.word); onRight(); }
        else {
          const done = await onWrong(() => {
            filled.length = 0;
            target.forEach(c => filled.push({ ch: c, tile: t }));
            drawSlots();
          });
          if (done) { locked = true; return; }
          setTimeout(() => { filled.splice(0).forEach(f => f.tile.classList.remove('used')); drawSlots(); }, 700);
        }
      }
    };
    tiles.append(t);
  });
  drawSlots();
  const how = h(`<div class="marklegend">👆 Tap the ${q.parts ? 'tiles' : 'letters'} in order to make the word. Tap a box to take one out.</div>`);
  area.append(slots, tiles, how);
}

// ---------- mark the vowels (short ˘ / long ¯ / silent /) ----------
const MARKS = [null, 'short', 'long', 'silent'];
const MARK_CH = { short: '˘', long: '¯', silent: '', null: '' };
function mark(q, area, { onRight, onWrong }) {
  const word = q.word;
  const state = word.split('').map(() => null);
  const box = h('<div class="markword"></div>');
  const legend = h('<div class="marklegend"><span>Tap a red vowel to mark it. Tap it again to change the mark:</span><span>˘ short</span><span>¯ long (says its name)</span><span><s>e</s> silent</span></div>');
  let locked = false;
  const draw = () => {
    box.innerHTML = '';
    word.split('').forEach((ch, i) => {
      const isV = q.marks[i] !== undefined;
      const el = h(`<div class="mletter ${isV ? 'vowel' : ''} ${state[i] === 'silent' ? 'silent' : ''}"><span class="mk">${MARK_CH[state[i]] || '&nbsp;'}</span><span class="ch">${ch}</span></div>`);
      if (isV) el.onclick = () => { if (locked) return; sfx.tap(); state[i] = MARKS[(MARKS.indexOf(state[i]) + 1) % MARKS.length]; draw(); };
      box.append(el);
    });
  };
  draw();
  const check = h('<button class="big-btn green">Check ✔</button>');
  check.onclick = async () => {
    if (locked) return;
    const ok = Object.entries(q.marks).every(([i, m]) => state[i] === m);
    if (ok) { locked = true; check.remove(); onRight(); }
    else {
      const done = await onWrong(() => { Object.entries(q.marks).forEach(([i, m]) => (state[i] = m)); draw(); });
      if (done) { locked = true; check.remove(); }
    }
  };
  area.append(box, legend, check);
}

// ---------- read aloud: record her, play it back, and check with the microphone ----------
let recogOK = true; // false if this tablet can't record and check speech at the same time
function read(q, area, ctx) {
  const words = q.sentence.split(' ');
  const sent = h(`<div class="visual"><div class="sentence">${words.map((w, i) => `<span class="rw" data-i="${i}">${esc(w)}</span>`).join(' ')}</div></div>`);
  area.append(sent);
  const spans = [...sent.querySelectorAll('.rw')];
  let tries = 0;
  let canTapWords = false;
  spans.forEach(s => (s.onclick = () => { if (canTapWords) { sfx.tap(); say(s.textContent); } }));

  const canRecord = recordSupported && store.settings.micOn;
  const canCheck = micSupported && store.settings.micOn && recogOK;
  if (!canRecord && !canCheck) { readFallback(q, area, ctx, sent); return; }

  const btn = h('<button class="big-btn mic-btn">🎤 I\'m ready to read!</button>');
  const again = h('<button class="big-btn hidden">▶️ Hear myself again</button>');
  let url = null;
  again.onclick = () => { sfx.tap(); playRecording(url); };
  area.append(btn, again);
  let busy = false;
  btn.onclick = async () => {
    if (busy) return; busy = true;
    sfx.tap();
    btn.classList.add('listening');
    let rec = null;
    if (canRecord) { try { rec = await startRecording(); } catch (e) { rec = null; } }
    let heard = [];
    if (canCheck && recogOK) {
      btn.textContent = '🎤 Reading… (I\'m listening)';
      heard = await listen(9000);
    } else {
      // Record only: she taps when she has finished reading
      btn.textContent = '⏹ Tap when you finish';
      await new Promise(res => {
        const done = () => { btn.removeEventListener('click', done); res(); };
        setTimeout(() => btn.addEventListener('click', done), 400);
        setTimeout(res, 15000);
      });
    }
    url = rec ? await rec.stop() : null;
    btn.classList.remove('listening');
    if (url) {
      // Play her reading straight back to her
      btn.textContent = '🔊 Listen to yourself!';
      again.classList.remove('hidden');
      await ctx.speak('Listen to yourself reading!');
      await playRecording(url);
    }
    busy = false;
    if (!canCheck || !recogOK || heard === null) { btn.remove(); readFallback(q, area, ctx, sent); return; }
    if (!heard.length && rec && lastListenError && lastListenError !== 'no-speech') {
      // This tablet can't record and check at the same time: keep recording, check with pictures instead
      recogOK = false; btn.remove(); readFallback(q, area, ctx, sent); return;
    }
    const score = scoreReading(q.sentence, heard);
    // colour the words she said
    const heardWords = heard.join(' ').toLowerCase();
    spans.forEach(s => {
      const w = s.textContent.toLowerCase().replace(/[^a-z']/g, '');
      s.className = 'rw ' + (heardWords.includes(w) ? 'ok' : 'miss');
    });
    if (score >= 0.6) { btn.remove(); ctx.onRight(); return; }
    tries++;
    ctx.noteMiss();
    sfx.wrong();
    canTapWords = true;
    if (tries === 1) { btn.textContent = '🎤 Try again!'; ctx.speak('Good try! Tap any pink word to hear it, then read it again.'); }
    else if (tries === 2) {
      btn.textContent = '🎤 Your turn!';
      ctx.speak('Listen to me first, then you read it.').then(() => readAlong(spans, q.sentence));
    } else {
      // Third try: she has heard it read and tried hard. The microphone can
      // mishear children, so praise the effort and move on (not counted as first-try right).
      btn.remove();
      ctx.speak('Great reading effort! Well done for trying so hard.').then(ctx.onRight);
    }
  };
}
async function readAlong(spans, sentence) {
  for (const s of spans) { s.classList.add('hl'); await say(s.textContent, { rate: 0.75 }); s.classList.remove('hl'); }
}
// No microphone: read the sentence, then pick the matching picture.
function readFallback(q, area, ctx, sent) {
  sent.querySelectorAll('.rw').forEach(s => (s.className = 'rw'));
  ctx.speak('Read the sentence. Then tap the picture that matches!');
  const fq = q.fallback;
  if (!fq) {
    const b = h('<button class="big-btn green">I read it! ✔</button>');
    b.onclick = () => { b.remove(); ctx.onRight(); };
    area.append(b);
    return;
  }
  choice({ ...fq, readFirst: true }, area, ctx);
}

// ---------- follow spoken instructions (listening) ----------
function follow(q, area, { onRight, onWrong }) {
  const grid = h('<div class="shapes-grid"></div>');
  let step = 0, locked = false;
  q.cells.forEach(c => {
    const cell = h(`<button class="shape-cell">${shapeSVG(c.shape, c.colour)}</button>`);
    cell.onclick = async () => {
      if (locked) return;
      const t = q.targets[step];
      if (c.shape === t.shape && c.colour === t.colour && !cell.classList.contains('picked')) {
        sfx.pop(); cell.classList.add('picked'); step++;
        if (step === q.targets.length) { locked = true; onRight(); }
      } else {
        cell.classList.add('bad'); setTimeout(() => cell.classList.remove('bad'), 500);
        const done = await onWrong(() => {
          [...grid.children].forEach((el, i) => {
            const cc = q.cells[i];
            if (q.targets.some(tt => tt.shape === cc.shape && tt.colour === cc.colour)) el.classList.add('picked');
          });
        });
        if (done) locked = true;
      }
    };
    grid.append(cell);
  });
  area.append(grid, h('<div class="marklegend">👆 Tap the shapes the owl tells you, in the same order.</div>'));
}

// ---------- number line: tap a number, or hop the frog ----------
// q.line = numberLine options. q.mode = 'tap' (tap q.target) or 'hop' (start at q.start, hop q.hops; + right, - left)
function numline(q, area, { onRight, onWrong, speak }) {
  const wrap = h('<div class="nl-wrap tappable"></div>');
  const sum = q.mode === 'hop' ? h('<div class="nl-sum"></div>') : null;
  const marks = {};
  let frog = q.mode === 'hop' ? q.start : undefined;
  const hops = [];
  const dir = Math.sign(q.hops || 0), need = Math.abs(q.hops || 0);
  let locked = false;
  const draw = () => {
    wrap.innerHTML = numberLine({ ...q.line, frogAt: frog, hops, marks });
    wrap.querySelectorAll('.nl-hit').forEach(el => (el.onclick = () => tap(Number(el.dataset.n))));
    if (sum) sum.textContent = `${q.start} ${dir > 0 ? '+' : '−'} ${need} = ${hops.length === need ? frog : '?'}   ${'🐾'.repeat(hops.length)}`;
  };
  const showPath = () => {
    hops.length = 0; frog = q.start;
    for (let i = 0; i < need; i++) { hops.push([frog, frog + dir]); frog += dir; }
    marks[frog] = '#2ec27e';
    draw();
  };
  async function tap(n) {
    if (locked) return;
    if (q.mode === 'tap') {
      if (n === q.target) { locked = true; marks[n] = '#2ec27e'; draw(); sfx.pop(); onRight(); }
      else {
        marks[n] = '#ff5964'; draw(); setTimeout(() => { delete marks[n]; draw(); }, 600);
        if (await onWrong(() => { marks[q.target] = '#2ec27e'; draw(); })) locked = true;
      }
      return;
    }
    // hop mode: she must tap the very next number, one hop at a time
    if (n === frog) return;
    if (n === frog + dir) {
      hops.push([frog, n]); frog = n; sfx.pop(); draw();
      speak(String(hops.length));
      if (hops.length === need) { locked = true; marks[frog] = '#2ec27e'; draw(); onRight(); }
    } else {
      marks[n] = '#ff5964'; draw(); setTimeout(() => { delete marks[n]; draw(); }, 600);
      if (await onWrong(showPath)) locked = true;
    }
  }
  draw();
  const how = h(`<div class="marklegend">👆 ${q.mode === 'hop' ? `Tap the next number to make the frog hop ${dir > 0 ? 'right' : 'left'}, one hop at a time.` : 'Tap the right number on the line.'}</div>`);
  area.append(wrap);
  if (sum) area.append(sum);
  area.append(how);
}

// ---------- "Watch me do one first!" ----------
// Ollie shows a worked example with the answer and the reason, before she tries.
const plain = html => { const d = document.createElement('div'); d.innerHTML = html; return d.textContent.trim(); };
export function canDemo(q) {
  const t = q.type || 'choice';
  return !q.prelude && !q.listenOnly && ['choice', 'build', 'order', 'mark', 'numline'].includes(t);
}
export function runDemo(q, root) {
  return new Promise(resolve => {
    discardRecording();
    root.innerHTML = '';
    const ask = h(`<div class="ask"><div class="mascot talk">🦉</div><div class="bubble">👀 Watch me do one first!<br><small>${esc(q.text || q.say)}</small></div></div>`);
    root.append(ask);
    if (q.visual) root.append(h(`<div class="visual">${q.visual}</div>`));
    const area = h('<div style="width:100%;display:flex;flex-direction:column;align-items:center;gap:14px"></div>');
    root.append(area);
    const t = q.type || 'choice';
    let answer = '';
    if (t === 'choice') {
      const box = h(`<div class="options ${q.cols || ''}"></div>`);
      for (const o of q.options) {
        const right = o.value === q.answer;
        box.append(h(`<div class="opt ${right ? 'right' : 'dim'}">${o.html}</div>`));
        if (right) answer = o.say || plain(o.html);
      }
      area.append(box);
    } else if (t === 'build') {
      const parts = q.parts || q.word.split('');
      area.append(h(`<div class="slots">${parts.map(p => `<div class="slot filled">${esc(p)}</div>`).join('')}</div>`));
      answer = q.word;
    } else if (t === 'order') {
      area.append(h(`<div class="order-row">${q.answer.map(a => `<div class="slot filled" style="width:auto;min-width:86px;padding:0 12px">${esc(a)}</div>`).join('')}</div>`));
      answer = q.answer.join(', ');
    } else if (t === 'mark') {
      const MK = { short: '˘', long: '¯', silent: '' };
      area.append(h(`<div class="markword">${q.word.split('').map((ch, i) => `<div class="mletter ${q.marks[i] ? 'vowel' : ''} ${q.marks[i] === 'silent' ? 'silent' : ''}"><span class="mk">${MK[q.marks[i]] || '&nbsp;'}</span><span class="ch">${ch}</span></div>`).join('')}</div>`));
    } else if (t === 'numline') {
      let opts = { ...q.line, marks: {} };
      if (q.mode === 'tap') { opts.marks[q.target] = '#2ec27e'; answer = String(q.target); }
      else {
        const d = Math.sign(q.hops), hops = [];
        let f = q.start;
        for (let i = 0; i < Math.abs(q.hops); i++) { hops.push([f, f + d]); f += d; }
        opts = { ...opts, hops, frogAt: f }; opts.marks[f] = '#2ec27e'; answer = String(f);
      }
      area.append(h(`<div class="nl-wrap">${numberLine(opts)}</div>`));
    }
    const teach = h(`<div class="teach">💡 ${esc(q.explain || '')}${q.explainVisual ? `<div style="margin-top:8px">${q.explainVisual}</div>` : ''}</div>`);
    const go = h('<div class="next-row"><button class="big-btn green">My turn! ▶</button></div>');
    area.append(teach, go);
    let done = false;
    go.querySelector('button').onclick = () => { if (done) return; done = true; stopSpeaking(); sfx.tap(); resolve(); };
    (async () => {
      await say(`Watch me do one first! ${q.say}`);
      if (answer) await say(`The answer is ${answer}.`);
      if (q.explain) await say(q.explain);
      if (!done) await say('Now it is your turn!');
    })();
  });
}

// ---------- work out a column sum herself: borrow / carry, then type each digit ----------
// q: { type: 'column', op: '-' | '+', top, bot }
function column(q, area, { onRight, speak, noteMiss }) {
  const sub = q.op === '-';
  const T = Math.floor(q.top / 10), O = q.top % 10, t = Math.floor(q.bot / 10), o = q.bot % 10;
  const need = sub ? O < o : O + o >= 10;          // borrow (take away) or carry (add)?
  const ansOnes = sub ? (need ? O + 10 - o : O - o) : (O + o) % 10;
  const ansTens = sub ? (need ? T - 1 - t : T - t) : T + t + (need ? 1 : 0);
  let step = 'decide', did = false, misses = 0, gotOnes = null, gotTens = null;
  const box = h('<div class="colsum"></div>');
  const say1 = h('<div class="bubble colmsg" style="text-align:center;max-width:640px"></div>');
  const ctl = h('<div class="colctl"></div>');
  area.append(box, say1, ctl);
  const cell = (v, cls = '') => `<div class="cc ${cls}">${v ?? ''}</div>`;
  function draw() {
    const topT = sub && did ? `<span class="crossed">${T}</span>` : T || '';
    const smallT = sub && did ? `<span class="small">${T - 1}</span>` : !sub && did ? '<span class="small">1</span>' : '';
    const topO = sub && did ? `<span class="small">1</span>${O}` : O;
    box.innerHTML = `
      <div class="crow">${cell('')}${cell('T', 'head')}${cell('O', 'head')}</div>
      <div class="crow small-row">${cell('')}${cell(smallT)}${cell('')}</div>
      <div class="crow">${cell('')}${cell(topT, `tens ${step === 'borrow' || step === 'carry' ? 'tapme' : ''}`)}${cell(topO)}</div>
      <div class="crow">${cell(sub ? '−' : '+', 'op')}${cell(t || '')}${cell(o)}</div>
      <div class="cline"></div>
      <div class="crow">${cell('')}${cell(gotTens ?? (step === 'tens' ? '?' : ''), `ans ${step === 'tens' ? 'now' : ''}`)}${cell(gotOnes ?? (step === 'ones' ? '?' : ''), `ans ${step === 'ones' ? 'now' : ''}`)}</div>`;
    const tens = box.querySelector('.tens');
    tens.onclick = () => {
      if (step === 'borrow') { sfx.pop(); did = true; step = 'ones'; draw(); go(); }
      else if (step === 'carry') { sfx.pop(); did = true; step = 'tens'; draw(); go(); }
    };
  }
  const miss = msg => { misses++; noteMiss(); sfx.wrong(); say1.textContent = msg; speak(msg); };
  function pad() {
    ctl.innerHTML = `<div class="numpad">${[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(n => `<button class="nk" data-n="${n}">${n}</button>`).join('')}</div>`;
    ctl.querySelectorAll('.nk').forEach(b => (b.onclick = () => typed(+b.dataset.n)));
  }
  let buf = '';
  function padMulti() {
    ctl.innerHTML = `<div class="numpad">${[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(n => `<button class="nk" data-n="${n}">${n}</button>`).join('')}</div>
      <div style="display:flex;gap:10px;align-items:center"><div class="bubble entry" style="font-size:40px;min-width:90px;text-align:center">${buf || '?'}</div>
      <button class="nk del" style="width:70px">⌫</button><button class="nk ok" style="width:90px;background:#2ec27e;color:#fff">✔</button></div>`;
    ctl.querySelectorAll('.nk[data-n]').forEach(b => (b.onclick = () => { sfx.tap(); if (buf.length < 2) buf += b.dataset.n; padMulti(); }));
    ctl.querySelector('.del').onclick = () => { buf = buf.slice(0, -1); padMulti(); };
    ctl.querySelector('.ok').onclick = () => { const n = +buf; buf = ''; if (n || n === 0) typedSum(n); };
  }
  function typedSum(n) {
    if (n !== O + o) {
      stepMiss++;
      if (stepMiss >= 2) { stepMiss = 0; miss(`${O} plus ${o} is ${O + o}.`); setTimeout(() => { step = 'ones'; go(); }, 2200); return; }
      return miss(`Not quite. Start at ${Math.max(O, o)} and count on ${Math.min(O, o)}. Try again!`);
    }
    sfx.correct(); stepMiss = 0; step = 'ones'; go();
  }
  function go() {
    draw();
    if (step === 'onesSum') {
      const msg = `Add the ones: ${O} plus ${o}. Tap the numbers for the answer, then tap the green tick.`;
      say1.textContent = msg; speak(msg); padMulti(); return;
    }
    if (step === 'carry') {
      const msg = `Now carry the 1 ten! Tap the pink box in the tens to carry it over.`;
      say1.textContent = msg; speak(msg); ctl.innerHTML = ''; return;
    }
    if (step === 'decide') {
      const msg = sub ? `Start with the ones. Can we take ${o} away from ${O}?` : `Start with the ones. ${O} plus ${o}. Is it 10 or more?`;
      say1.textContent = msg; speak(msg);
      ctl.innerHTML = sub
        ? `<button class="big-btn green yes">✅ Yes, take away</button><button class="big-btn no">🔁 No, borrow a ten</button>`
        : `<button class="big-btn green yes">🔟 Yes, 10 or more</button><button class="big-btn no">👍 No, less than 10</button>`;
      const yes = ctl.querySelector('.yes'), no = ctl.querySelector('.no');
      const pickBorrow = sub ? no : yes, pickPlain = sub ? yes : no;
      pickBorrow.onclick = () => {
        if (!need) return miss(sub ? `${O} is bigger than ${o}, so we CAN take away. No need to borrow.` : `${O} plus ${o} is ${O + o}. That is less than 10, so there is nothing to carry.`);
        sfx.tap();
        if (sub) { step = 'borrow'; draw(); const m = `Yes! ${O} is smaller than ${o}, so we borrow. Tap the pink ${T} in the tens to borrow 1 ten.`; say1.textContent = m; speak(m); ctl.innerHTML = ''; }
        else { step = 'onesSum'; go(); }
      };
      pickPlain.onclick = () => {
        if (need) return miss(sub ? `Look again: ${O} is smaller than ${o}. We cannot take ${o} away from ${O}. We must borrow a ten.` : `${O} plus ${o} is ${O + o}. That is 10 or more, so we carry a ten.`);
        sfx.tap(); step = 'ones'; go();
      };
      return;
    }
    if (step === 'ones') {
      const msg = sub
        ? (did ? `Now the ones: ${O + 10} take away ${o}. Tap the answer.` : `Now the ones: ${O} take away ${o}. Tap the answer.`)
        : (need ? `${O + o} is 1 ten and ${(O + o) % 10} ones. We write only the ONES in the ones place. Tap the ones digit of ${O + o}.` : `Now the ones: ${O} plus ${o}. Tap the answer.`);
      say1.textContent = msg; speak(msg); pad(); return;
    }
    if (step === 'tens') {
      const msg = sub ? (did ? `Now the tens: ${T - 1} take away ${t}. Tap the answer.` : `Now the tens: ${T} take away ${t}. Tap the answer.`)
        : (did ? `Now the tens: the 1 we carried, plus ${T}, plus ${t}. Tap the answer.` : `Now the tens: ${T} plus ${t}. Tap the answer.`);
      say1.textContent = msg; speak(msg); pad(); return;
    }
  }
  let stepMiss = 0;
  function typed(n) {
    if (step === 'ones') {
      if (n !== ansOnes) {
        stepMiss++;
        if (stepMiss >= 2) {
          gotOnes = ansOnes; stepMiss = 0;
          miss(`The ones answer is ${ansOnes}. ${sub ? `${did ? O + 10 : O} take away ${o} is ${ansOnes}` : `${O} plus ${o} is ${O + o}`}.`);
          if (!sub && need) { step = 'carry'; setTimeout(go, 2600); return; }
          if (ansTens === 0 && !(q.bot >= 10)) { setTimeout(done, 2600); return; }
          step = 'tens'; setTimeout(go, 2600); return;
        }
        return miss(sub ? `Not quite. Count back: ${did ? O + 10 : O} take away ${o}. Try again!` : need ? `Only the ones digit! ${O + o} is 1 ten and ${(O + o) % 10} ones. Tap the ones.` : `Not quite. ${O} plus ${o}... try again!`);
      }
      sfx.correct(); gotOnes = n; stepMiss = 0;
      if (!sub && need) { step = 'carry'; go(); return; }
      if (ansTens === 0 && !(q.bot >= 10)) return done();
      step = 'tens'; go(); return;
    }
    if (step === 'tens') {
      if (n !== ansTens) {
        stepMiss++;
        if (stepMiss >= 2) { gotTens = ansTens; draw(); miss(`The tens answer is ${ansTens}.`); return setTimeout(done, 2200); }
        return miss(sub ? (did ? `Remember, we borrowed, so the ${T} is now ${T - 1}. ${T - 1} take away ${t}. Try again!` : `${T} take away ${t}. Try again!`) : (did ? `Don't forget the 1 we carried! ${T} plus ${t} plus 1. Try again!` : `${T} plus ${t}. Try again!`));
      }
      sfx.correct(); gotTens = n; done();
    }
  }
  function done() {
    step = 'done'; draw(); ctl.innerHTML = '';
    const ans = sub ? q.top - q.bot : q.top + q.bot;
    say1.textContent = `${q.top} ${sub ? 'take away' : 'plus'} ${q.bot} is ${ans}! ${sub ? `Check: ${ans} + ${q.bot} = ${q.top} ✔` : `Check: ${ans} − ${q.bot} = ${q.top} ✔`}`;
    onRight();
  }
  go();
}
