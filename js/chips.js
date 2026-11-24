// 🌶️ Chip Challenge — a two-player pass-and-play game for Zinnia and a grown-up.
// Each player secretly hides "hot chips" in the grid. Take turns eating chips:
// a safe chip goes crunch, a hot chip costs a life. First to run out of lives loses.
import { pick, shuffle, esc } from './util.js';

const CHIP = (cls = '') => `<svg viewBox="0 0 100 80" class="chipimg ${cls}"><ellipse cx="50" cy="42" rx="44" ry="32" fill="#f4c542" stroke="#c99a1c" stroke-width="4"/>
  <ellipse cx="38" cy="34" rx="9" ry="5" fill="#ffe08a"/><circle cx="62" cy="48" r="3" fill="#d9a521"/><circle cx="34" cy="52" r="2.5" fill="#d9a521"/><circle cx="58" cy="28" r="2" fill="#d9a521"/></svg>`;

export function chipGame(ctx) {
  const { app, h, say, sfx, store, save, back, name } = ctx;
  store.chips ||= { p2: 'Mummy', size: 20, traps: 1, wins: {} };
  const cfg = store.chips;
  let game = null;

  const screen = (title, body, sub = '') => {
    app.innerHTML = '';
    document.getElementById('confetti').innerHTML = '';
    const s = h(`<div class="screen center">
      <div class="topbar" style="width:100%"><button class="icon-btn" data-a="exit" aria-label="Back">⬅️</button><div class="spacer"></div>
        <div class="pill">🏆 ${esc(name())} ${cfg.wins[name()] || 0} · ${esc(cfg.p2)} ${cfg.wins[cfg.p2] || 0}</div></div>
      <div class="title">${title}</div>${sub ? `<div class="white" style="font-size:22px;margin-bottom:8px">${sub}</div>` : ''}</div>`);
    s.querySelector('[data-a=exit]').onclick = () => { sfx.tap(); back(); };
    s.append(body);
    app.append(s);
    return s;
  };

  // ---- 1. Set up
  function setup() {
    const body = h(`<div class="mission" style="max-width:560px;width:100%;font-size:20px">
      <div style="margin:6px 0">👧 Player 1: <b>${esc(name())}</b></div>
      <div style="margin:6px 0">🧑 Player 2: <input class="p2" value="${esc(cfg.p2)}" style="font-size:20px;padding:6px 10px;border-radius:12px;border:2px solid #ccc;width:180px"></div>
      <div style="margin:10px 0">How many chips? ${[12, 16, 20].map(n => `<button class="pill opt-size ${cfg.size === n ? 'on' : ''}" data-n="${n}">${n}</button>`).join(' ')}</div>
      <div style="margin:10px 0">Hot chips each (lives): ${[1, 2, 3].map(n => `<button class="pill opt-traps ${cfg.traps === n ? 'on' : ''}" data-n="${n}">${'🌶️'.repeat(n)}</button>`).join(' ')}</div>
      <div style="font-size:16px;color:#666;margin-top:8px">How to play: each player secretly hides hot chips 🌶️. Take turns eating chips. Tap a chip once to point at it, tap it again to eat it. A hot chip costs a life ❤️ — even your own! Lose all your lives and you lose.</div>
      <button class="big-btn green go" style="margin-top:12px">🌶️ Start!</button></div>`);
    screen('🌶️ Chip Challenge', body, 'A game for two players');
    body.querySelectorAll('.opt-size').forEach(b => (b.onclick = () => { sfx.tap(); cfg.size = +b.dataset.n; save(); setup(); }));
    body.querySelectorAll('.opt-traps').forEach(b => (b.onclick = () => { sfx.tap(); cfg.traps = +b.dataset.n; save(); setup(); }));
    body.querySelector('.p2').onchange = e => { cfg.p2 = e.target.value.trim() || 'Mummy'; save(); };
    body.querySelector('.go').onclick = () => {
      sfx.tap();
      cfg.p2 = body.querySelector('.p2').value.trim() || 'Mummy'; save();
      game = { players: [name(), cfg.p2], traps: [new Set(), new Set()], lives: [cfg.traps, cfg.traps], eaten: new Set(), turn: Math.random() < 0.5 ? 0 : 1, sel: null, over: false };
      cover(0, () => hide(0));
    };
    say(`Chip Challenge! Who is playing with you, ${name()}?`);
  }

  // Privacy screen: "pass the tablet, the other player looks away"
  function cover(p, next, msg) {
    const other = game.players[1 - p];
    const body = h(`<div style="display:flex;flex-direction:column;align-items:center;gap:16px">
      <div style="font-size:110px">🙈</div>
      <div class="bubble" style="font-size:24px;text-align:center">${msg || `Give the tablet to <b>${esc(game.players[p])}</b>.<br>${esc(other)}, look away! No peeking! 👀`}</div>
      <button class="big-btn green ready">I'm ${esc(game.players[p])} — I'm ready!</button></div>`);
    screen('🌶️ Chip Challenge', body);
    body.querySelector('.ready').onclick = () => { sfx.tap(); next(); };
    say(msg ? '' : `Give the tablet to ${game.players[p]}. ${other}, look away! No peeking!`);
  }

  // ---- 2. Hide your hot chips (secret)
  function hide(p) {
    const mine = game.traps[p], need = cfg.traps;
    const body = h(`<div style="display:flex;flex-direction:column;align-items:center;gap:12px;width:100%">
      <div class="chipgrid g${cfg.size}">${Array.from({ length: cfg.size }, (_, i) => `<button class="chip ${mine.has(i) ? 'trap' : ''}" data-i="${i}">${CHIP()}<span class="pepper">🌶️</span></button>`).join('')}</div>
      <button class="big-btn green lock" ${mine.size === need ? '' : 'disabled style="opacity:.5"'}>🔒 Lock in</button></div>`);
    screen(`${esc(game.players[p])}: hide ${need} hot chip${need > 1 ? 's' : ''}`, body, `Tap ${need === 1 ? 'a chip' : need + ' chips'} to hide your 🌶️. Don't let anyone see!`);
    body.querySelectorAll('.chip').forEach(b => (b.onclick = () => {
      const i = +b.dataset.i;
      sfx.pop();
      if (mine.has(i)) mine.delete(i);
      else { if (mine.size >= need) mine.delete([...mine][0]); mine.add(i); }
      hide(p);
    }));
    body.querySelector('.lock').onclick = () => {
      if (mine.size !== need) return;
      sfx.correct();
      if (p === 0) cover(1, () => hide(1));
      else cover(game.turn, play, `All the hot chips are hidden! 🤫<br>Put the tablet between you.<br><b>${esc(game.players[game.turn])}</b> goes first!`);
    };
    say(`${game.players[p]}, tap ${need === 1 ? 'one chip' : need + ' chips'} to hide your hot chips. Then tap lock in.`);
  }

  // ---- 3. Play: take turns eating chips
  const isTrap = i => game.traps[0].has(i) || game.traps[1].has(i);
  const trapHits = i => (game.traps[0].has(i) ? 1 : 0) + (game.traps[1].has(i) ? 1 : 0);
  function play() {
    const left = cfg.size - game.eaten.size;
    const hearts = p => '❤️'.repeat(Math.max(0, game.lives[p])) + '🤍'.repeat(Math.max(0, cfg.traps - game.lives[p]));
    const body = h(`<div style="display:flex;flex-direction:column;align-items:center;gap:10px;width:100%">
      <div class="chipscore"><div class="${game.turn === 0 ? 'on' : ''}">👧 ${esc(game.players[0])}<br>${hearts(0)}</div><div class="${game.turn === 1 ? 'on' : ''}">🧑 ${esc(game.players[1])}<br>${hearts(1)}</div></div>
      <div class="white" style="font-size:20px">${game.sel === null ? `<b>${esc(game.players[game.turn])}</b>, pick a chip!` : 'Are you sure? Tap it again to eat it! 😬'} · ${left} chips left</div>
      <div class="chipgrid g${cfg.size}">${Array.from({ length: cfg.size }, (_, i) => game.eaten.has(i)
        ? `<div class="chip gone">${game.boom === i ? '🔥' : ''}</div>`
        : `<button class="chip ${game.sel === i ? 'sel' : ''}" data-i="${i}">${CHIP()}</button>`).join('')}</div></div>`);
    screen('🌶️ Chip Challenge', body);
    game.boom = null;
    body.querySelectorAll('.chip[data-i]').forEach(b => (b.onclick = () => {
      if (game.over) return;
      const i = +b.dataset.i;
      if (game.sel !== i) { sfx.tap(); game.sel = i; play(); say(pick(['Are you sure?', 'Hmm... that one?', 'Ooh, are you sure?', 'Is it hot?'])); return; }
      game.sel = null;
      game.eaten.add(i);
      const p = game.turn;
      if (isTrap(i)) {
        const hit = trapHits(i);
        game.lives[p] -= hit;
        game.boom = i;
        sfx.wrong(); navigator.vibrate?.(400);
        document.body.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-14px)' }, { transform: 'translateX(14px)' }, { transform: 'translateX(0)' }], { duration: 350, iterations: 2 });
        const own = game.traps[p].has(i) && hit === 1;
        say(`${hit > 1 ? 'DOUBLE ' : ''}HOT HOT HOT! 🌶️ ${own ? `That was your own hot chip, ${game.players[p]}!` : `${game.players[p]} found a hot chip!`}`);
        if (game.lives[p] <= 0) return setTimeout(() => finish(1 - p), 1400);
      } else {
        sfx.pop();
        say(pick(['Crunch crunch! Safe!', 'Yum! Safe!', 'Crunch! Phew!', 'Safe! Yummy!']));
      }
      game.turn = 1 - p;
      play();
    }));
  }

  // ---- 4. Winner + show where the hot chips were
  function finish(w) {
    game.over = true;
    cfg.wins[game.players[w]] = (cfg.wins[game.players[w]] || 0) + 1; save();
    const body = h(`<div style="display:flex;flex-direction:column;align-items:center;gap:12px;width:100%">
      <div class="bubble" style="font-size:26px;text-align:center">🏆 <b>${esc(game.players[w])}</b> wins!</div>
      <div class="chipgrid g${cfg.size}">${Array.from({ length: cfg.size }, (_, i) => {
        const t0 = game.traps[0].has(i), t1 = game.traps[1].has(i);
        const mark = t0 && t1 ? '🌶️🌶️' : t0 ? '🌶️👧' : t1 ? '🌶️🧑' : '';
        return `<div class="chip ${game.eaten.has(i) ? 'gone' : ''} reveal">${game.eaten.has(i) ? '' : CHIP()}${mark ? `<span class="mark">${mark}</span>` : ''}</div>`;
      }).join('')}</div>
      <div class="white" style="font-size:18px">🌶️👧 = ${esc(game.players[0])}'s hot chips · 🌶️🧑 = ${esc(game.players[1])}'s hot chips</div>
      <div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center"><button class="big-btn green again">🔁 Play again</button><button class="big-btn done">🗺️ Back</button></div></div>`);
    screen('🌶️ Chip Challenge', body);
    sfx.fanfare(); ctx.confetti(60);
    say(`${game.players[w]} wins! Well played, both of you! Look where the hot chips were hiding!`);
    body.querySelector('.again').onclick = () => { sfx.tap(); setup(); };
    body.querySelector('.done').onclick = () => { sfx.tap(); back(); };
  }

  setup();
}
