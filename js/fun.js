// 🎀 Fun Zone: a reward she earns by doing well (🎟️ tickets).
// 🛍️ Shop: buy clothes with the coins she earned — pay by tapping 10, 5 and 1 coins (tens & ones practice).
// 👗 Dress-up: wear what she bought.  💇‍♀️ Salon: hairstyles, clips and nails, plus customers who ask for a look (listening).
import { pick, shuffle, esc, rnd } from './util.js';

const SKIN = { a: '#8d5524', b: '#a0673a', c: '#c68642', d: '#f1c27d' };
const HAIR_COL = { black: '#1c1410', 'dark brown': '#3b2414', brown: '#6b4226', 'light brown': '#a0703c' };
const NAIL_COL = { pink: '#ff6fae', red: '#e63946', purple: '#9b5de5', blue: '#4895ef', yellow: '#ffd23f', green: '#2ec27e', orange: '#ff9f1c', gold: '#d4a017' };
const CLIP_COL = { pink: '#ff6fae', purple: '#9b5de5', yellow: '#ffd23f', blue: '#4895ef', white: '#ffffff', red: '#e63946' };
const STYLES = ['puffs', 'braids', 'ponytail', 'afro', 'bun', 'long'];
const STYLE_NAME = { puffs: 'two puffs', braids: 'braids', ponytail: 'a ponytail', afro: 'an afro', bun: 'a bun', long: 'long hair' };
const STYLE_ICON = { puffs: '🎀', braids: '🪢', ponytail: '🐴', afro: '☁️', bun: '🍩', long: '💁‍♀️' };

// ---- Things to buy. price in coins (≤ 60, so she can pay with tens and ones)
export const ITEMS = [
  // dresses
  { id: 'd-pink', cat: 'dress', name: 'pink party dress', icon: '👗', col: '#ff6fae', price: 30 },
  { id: 'd-yellow', cat: 'dress', name: 'yellow Sunday dress', icon: '👗', col: '#ffd23f', price: 35 },
  { id: 'd-purple', cat: 'dress', name: 'purple twirl dress', icon: '👗', col: '#9b5de5', price: 40 },
  { id: 'd-blue', cat: 'dress', name: 'blue church dress', icon: '👗', col: '#4895ef', price: 35 },
  { id: 'd-green', cat: 'dress', name: 'green garden dress', icon: '👗', col: '#2ec27e', price: 30 },
  { id: 'd-red', cat: 'dress', name: 'red Christmas dress', icon: '👗', col: '#d62828', price: 45 },
  { id: 'd-white', cat: 'dress', name: 'white and gold dress', icon: '👗', col: '#fffaf0', trim: '#d4a017', price: 60 },
  // tops
  { id: 't-white', cat: 'top', name: 'white T-shirt', icon: '👕', col: '#ffffff', price: 0 },
  { id: 't-red', cat: 'top', name: 'red T-shirt', icon: '👕', col: '#e63946', price: 10 },
  { id: 't-orange', cat: 'top', name: 'orange T-shirt', icon: '👕', col: '#ff9f1c', price: 10 },
  { id: 't-teal', cat: 'top', name: 'teal blouse', icon: '👚', col: '#2ec4b6', price: 15 },
  { id: 't-heart', cat: 'top', name: 'pink heart top', icon: '👚', col: '#ffc2d9', motif: '❤', price: 20 },
  { id: 't-star', cat: 'top', name: 'blue star top', icon: '👕', col: '#a7c7ff', motif: '★', price: 20 },
  { id: 't-yellow', cat: 'top', name: 'yellow blouse', icon: '👚', col: '#ffe066', price: 12 },
  // bottoms
  { id: 'b-blue', cat: 'bottom', name: 'blue skirt', icon: '👗', col: '#3a86ff', kind: 'skirt', price: 0 },
  { id: 'b-jeans', cat: 'bottom', name: 'blue jeans', icon: '👖', col: '#355c9a', kind: 'pants', price: 20 },
  { id: 'b-pink', cat: 'bottom', name: 'pink skirt', icon: '👗', col: '#ff8fc0', kind: 'skirt', price: 15 },
  { id: 'b-denim', cat: 'bottom', name: 'denim skirt', icon: '👗', col: '#5b7db1', kind: 'skirt', price: 18 },
  { id: 'b-purple', cat: 'bottom', name: 'purple shorts', icon: '🩳', col: '#9b5de5', kind: 'shorts', price: 12 },
  { id: 'b-yellow', cat: 'bottom', name: 'yellow skirt', icon: '👗', col: '#ffd23f', kind: 'skirt', price: 15 },
  { id: 'b-black', cat: 'bottom', name: 'black pants', icon: '👖', col: '#2b2d42', kind: 'pants', price: 20 },
  // shoes
  { id: 's-white', cat: 'shoes', name: 'white sneakers', icon: '👟', col: '#ffffff', price: 0 },
  { id: 's-pink', cat: 'shoes', name: 'pink sneakers', icon: '👟', col: '#ff6fae', price: 18 },
  { id: 's-gold', cat: 'shoes', name: 'gold sandals', icon: '👡', col: '#d4a017', price: 25 },
  { id: 's-red', cat: 'shoes', name: 'red party shoes', icon: '👠', col: '#e63946', price: 25 },
  { id: 's-boots', cat: 'shoes', name: 'brown boots', icon: '👢', col: '#7f4f24', kind: 'boots', price: 30 },
  { id: 's-blue', cat: 'shoes', name: 'blue flats', icon: '🥿', col: '#4895ef', price: 15 },
  // extras
  { id: 'x-bowpink', cat: 'extra', slot: 'bow', name: 'pink bow', icon: '🎀', col: '#ff6fae', price: 8 },
  { id: 'x-bowred', cat: 'extra', slot: 'bow', name: 'red bow', icon: '🎀', col: '#e63946', price: 8 },
  { id: 'x-bowyellow', cat: 'extra', slot: 'bow', name: 'yellow bow', icon: '🎀', col: '#ffd23f', price: 8 },
  { id: 'x-band', cat: 'extra', slot: 'head', name: 'purple headband', icon: '〰️', col: '#9b5de5', price: 10 },
  { id: 'x-hat', cat: 'extra', slot: 'head', name: 'sun hat', icon: '👒', col: '#f4d58d', price: 25 },
  { id: 'x-pearls', cat: 'extra', slot: 'neck', name: 'pearl necklace', icon: '📿', col: '#fffaf0', price: 30 },
  { id: 'x-goldnk', cat: 'extra', slot: 'neck', name: 'gold necklace', icon: '📿', col: '#d4a017', price: 40 },
  { id: 'x-bag', cat: 'extra', slot: 'bag', name: 'purple bag', icon: '👜', col: '#9b5de5', price: 20 },
  { id: 'x-glasses', cat: 'extra', slot: 'eyes', name: 'red glasses', icon: '👓', col: '#e63946', price: 15 },
  // backgrounds
  { id: 'g-sky', cat: 'place', name: 'blue sky', icon: '🌤️', col: '#cfe8ff', price: 0 },
  { id: 'g-garden', cat: 'place', name: 'garden', icon: '🌳', col: '#c7f0c2', price: 20 },
  { id: 'g-beach', cat: 'place', name: 'beach', icon: '🏖️', col: '#ffe9b3', price: 20 },
  { id: 'g-party', cat: 'place', name: 'party', icon: '🎉', col: '#ffd6ec', price: 25 },
  { id: 'g-church', cat: 'place', name: 'church', icon: '⛪', col: '#ede4ff', price: 25 },
];
const ITEM = Object.fromEntries(ITEMS.map(i => [i.id, i]));
const CATS = [['dress', '👗 Dresses'], ['top', '👕 Tops'], ['bottom', '👖 Skirts & pants'], ['shoes', '👟 Shoes'], ['extra', '🎀 Extras'], ['place', '🏞️ Places']];

function funState(store) {
  store.fun ||= {};
  const f = store.fun;
  f.tickets ??= 1; // one to try it out
  f.owned ||= ITEMS.filter(i => i.price === 0).map(i => i.id);
  f.outfit ||= { top: 't-white', bottom: 'b-blue', shoes: 's-white', place: 'g-sky' };
  f.look ||= { skin: 'b', style: 'puffs', hair: 'black', clip: 'pink', nails: null };
  f.happy ??= 0;
  return f;
}

// ---------------- the doll (SVG) ----------------
const clipsOf = look => look.clips || (look.clip ? [{ x: look.style === 'puffs' ? 112 : 196, y: 80, c: look.clip }] : []);
const nailsOf = look => look.nailCols || (look.nails ? Array(5).fill(look.nails) : Array(5).fill(null));
const bowShape = (x, y, col, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 L-16 -10 L-16 10 Z M0 0 L16 -10 L16 10 Z" fill="${col}" stroke="rgba(0,0,0,.25)" stroke-width="1.5"/><circle r="5" fill="${col}" stroke="rgba(0,0,0,.25)"/></g>`;
export function dollSVG(look, outfit = {}, size = 300, cls = '') {
  const skin = SKIN[look.skin] || SKIN.b, hc = HAIR_COL[look.hair] || HAIR_COL.black;
  const it = id => (id ? ITEM[id] : null);
  const dress = it(outfit.dress), top = it(outfit.top), bottom = it(outfit.bottom), shoes = it(outfit.shoes), place = it(outfit.place);
  const ex = slot => (outfit.extras || []).map(it).find(x => x && x.slot === slot);
  const clips = clipsOf(look), beadCol = clips[0] ? CLIP_COL[clips[0].c] : '#ffd23f';
  let back = '';
  switch (look.style) {
    case 'puffs': back = `<circle cx="88" cy="78" r="38" fill="${hc}"/><circle cx="212" cy="78" r="38" fill="${hc}"/>`; break;
    case 'afro': back = `<circle cx="150" cy="112" r="96" fill="${hc}"/>`; break;
    case 'long': back = `<rect x="80" y="80" width="140" height="160" rx="60" fill="${hc}"/>`; break;
    case 'ponytail': back = `<ellipse cx="226" cy="140" rx="24" ry="60" fill="${hc}" transform="rotate(-15 226 140)"/>`; break;
    case 'braids': back = `<rect x="82" y="110" width="16" height="150" rx="8" fill="${hc}"/><rect x="202" y="110" width="16" height="150" rx="8" fill="${hc}"/>` +
      [0, 1, 2].map(i => `<circle cx="90" cy="${200 + i * 22}" r="7" fill="${beadCol}"/><circle cx="210" cy="${200 + i * 22}" r="7" fill="${beadCol}"/>`).join(''); break;
    case 'bun': back = `<circle cx="150" cy="48" r="34" fill="${hc}"/>`; break;
  }
  const front = look.style === 'afro' ? '' : `<path d="M86 118 Q150 18 214 118 Q186 78 150 76 Q114 78 86 118 Z" fill="${hc}"/>`;
  const shine = look.shiny ? `<path d="M110 70 Q150 44 190 70" stroke="#fff" stroke-width="5" fill="none" opacity=".55" stroke-linecap="round"/>` : '';
  const legs = `<rect x="117" y="325" width="24" height="78" rx="10" fill="${skin}"/><rect x="159" y="325" width="24" height="78" rx="10" fill="${skin}"/>`;
  const arms = `<rect x="72" y="212" width="24" height="100" rx="12" fill="${skin}" transform="rotate(12 84 212)"/><rect x="204" y="212" width="24" height="100" rx="12" fill="${skin}" transform="rotate(-12 216 212)"/>`;
  const nc = nailsOf(look);
  const nails = [[64, 314, 0], [72, 319, 1], [228, 319, 2], [236, 314, 3]].map(([x, y, i]) => (nc[i] ? `<ellipse cx="${x}" cy="${y}" rx="4" ry="5" fill="${NAIL_COL[nc[i]]}"/>` : '')).join('');
  const hands = `<circle cx="70" cy="310" r="14" fill="${skin}"/><circle cx="230" cy="310" r="14" fill="${skin}"/>${nails}`;
  let clothes = '';
  if (dress) clothes = `<path d="M108 206 L192 206 L232 340 L68 340 Z" fill="${dress.col}" stroke="${dress.trim || 'rgba(0,0,0,.15)'}" stroke-width="${dress.trim ? 5 : 2}"/><rect x="98" y="204" width="104" height="40" rx="16" fill="${dress.col}"/>`;
  else {
    const b = bottom || ITEM['b-blue'];
    if (b.kind === 'pants') clothes += `<rect x="112" y="268" width="36" height="128" rx="8" fill="${b.col}"/><rect x="152" y="268" width="36" height="128" rx="8" fill="${b.col}"/>`;
    else if (b.kind === 'shorts') clothes += `<rect x="110" y="268" width="40" height="62" rx="8" fill="${b.col}"/><rect x="150" y="268" width="40" height="62" rx="8" fill="${b.col}"/>`;
    else clothes += `<path d="M104 266 L196 266 L220 336 L80 336 Z" fill="${b.col}" stroke="rgba(0,0,0,.15)" stroke-width="2"/>`;
    const t = top || ITEM['t-white'];
    clothes += `<rect x="100" y="204" width="100" height="72" rx="20" fill="${t.col}" stroke="rgba(0,0,0,.15)" stroke-width="2"/>` + (t.motif ? `<text x="150" y="252" font-size="30" text-anchor="middle" fill="${t.motif === '❤' ? '#e63946' : '#ffd23f'}">${t.motif}</text>` : '');
  }
  const sh = shoes || ITEM['s-white'];
  const shoe = sh.kind === 'boots'
    ? `<rect x="112" y="372" width="34" height="40" rx="8" fill="${sh.col}"/><rect x="154" y="372" width="34" height="40" rx="8" fill="${sh.col}"/>`
    : `<ellipse cx="129" cy="408" rx="22" ry="11" fill="${sh.col}" stroke="rgba(0,0,0,.25)" stroke-width="2"/><ellipse cx="171" cy="408" rx="22" ry="11" fill="${sh.col}" stroke="rgba(0,0,0,.25)" stroke-width="2"/>`;
  const head = `<rect x="138" y="170" width="24" height="40" fill="${skin}"/><circle cx="88" cy="124" r="11" fill="${skin}"/><circle cx="212" cy="124" r="11" fill="${skin}"/>
    <circle cx="150" cy="122" r="62" fill="${skin}"/>
    <circle cx="128" cy="124" r="8" fill="#1c1410"/><circle cx="172" cy="124" r="8" fill="#1c1410"/><circle cx="131" cy="121" r="2.5" fill="#fff"/><circle cx="175" cy="121" r="2.5" fill="#fff"/>
    <circle cx="116" cy="146" r="9" fill="#ff7aa8" opacity=".35"/><circle cx="184" cy="146" r="9" fill="#ff7aa8" opacity=".35"/>
    <path d="M132 152 Q150 168 168 152" stroke="#7a2e2e" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  const bow = ex('bow'), hat = ex('head'), neck = ex('neck'), bag = ex('bag'), eyes = ex('eyes');
  let acc = '';
  if (look.style !== 'braids' || clips.length > 1) acc += clips.map(c => bowShape(c.x, c.y, CLIP_COL[c.c])).join('');
  if (bow) acc += bowShape(look.style === 'bun' ? 150 : 192, look.style === 'bun' ? 22 : 66, bow.col, 1.5);
  if (hat && hat.id === 'x-hat') acc += `<ellipse cx="150" cy="74" rx="96" ry="18" fill="${hat.col}"/><path d="M102 74 Q150 0 198 74 Z" fill="${hat.col}"/><rect x="104" y="62" width="92" height="10" fill="#ff6fae"/>`;
  else if (hat) acc += `<path d="M90 96 Q150 40 210 96" stroke="${hat.col}" stroke-width="10" fill="none" stroke-linecap="round"/>`;
  if (eyes) acc += `<g fill="none" stroke="${eyes.col}" stroke-width="4"><circle cx="128" cy="124" r="15"/><circle cx="172" cy="124" r="15"/><path d="M143 124 L157 124"/></g>`;
  if (neck) acc += `<path d="M126 206 Q150 232 174 206" stroke="${neck.col}" stroke-width="7" fill="none" stroke-dasharray="${neck.id === 'x-pearls' ? '1 9' : '0'}" stroke-linecap="round"/>`;
  if (bag) acc += `<rect x="214" y="290" width="40" height="34" rx="8" fill="${bag.col}"/><path d="M220 292 Q234 268 248 292" stroke="${bag.col}" stroke-width="4" fill="none"/>`;
  const bg = (place || ITEM['g-sky']).col;
  return `<svg class="doll ${cls}" viewBox="0 0 300 440" width="${size}" style="max-width:100%;border-radius:24px;background:${bg};box-shadow:0 6px 0 rgba(0,0,0,.08);touch-action:none">
    ${place && place.id !== 'g-sky' ? `<text x="18" y="420" font-size="44">${place.icon}</text>` : ''}
    ${back}${legs}${shoe}${arms}${clothes}${hands}${head}${front}${shine}${acc}</svg>`;
}

// Small pictures of each thing (no words to read)
function itemSVG(i, size = 70) {
  const c = i.col, st = 'stroke="rgba(0,0,0,.25)" stroke-width="2"';
  let g = '';
  if (i.cat === 'dress') g = `<path d="M38 18 L62 18 L80 88 L20 88 Z" fill="${c}" ${st}/><rect x="32" y="14" width="36" height="20" rx="8" fill="${c}" ${st}/>`;
  else if (i.cat === 'top') g = `<path d="M30 20 L70 20 L88 36 L78 46 L70 40 L70 82 L30 82 L30 40 L22 46 L12 36 Z" fill="${c}" ${st}/>` + (i.motif ? `<text x="50" y="66" font-size="26" text-anchor="middle" fill="${i.motif === '❤' ? '#e63946' : '#ffd23f'}">${i.motif}</text>` : '');
  else if (i.cat === 'bottom') g = i.kind === 'pants' ? `<path d="M28 14 L72 14 L76 90 L56 90 L50 40 L44 90 L24 90 Z" fill="${c}" ${st}/>`
    : i.kind === 'shorts' ? `<path d="M26 26 L74 26 L78 66 L54 66 L50 46 L46 66 L22 66 Z" fill="${c}" ${st}/>` : `<path d="M30 20 L70 20 L84 80 L16 80 Z" fill="${c}" ${st}/>`;
  else if (i.cat === 'shoes') g = i.kind === 'boots' ? `<path d="M30 20 L50 20 L50 66 L78 66 L78 82 L30 82 Z" fill="${c}" ${st}/>` : `<ellipse cx="50" cy="62" rx="34" ry="16" fill="${c}" ${st}/><rect x="24" y="44" width="28" height="18" rx="8" fill="${c}" ${st}/>`;
  else if (i.slot === 'bow') g = bowShape(50, 50, c, 2.2);
  else if (i.id === 'x-hat') g = `<ellipse cx="50" cy="62" rx="44" ry="12" fill="${c}" ${st}/><path d="M24 62 Q50 10 76 62 Z" fill="${c}" ${st}/><rect x="26" y="52" width="48" height="8" fill="#ff6fae"/>`;
  else if (i.slot === 'head') g = `<path d="M16 66 Q50 10 84 66" stroke="${c}" stroke-width="10" fill="none" stroke-linecap="round"/>`;
  else if (i.slot === 'neck') g = `<path d="M18 30 Q50 90 82 30" stroke="${c}" stroke-width="9" fill="none" stroke-dasharray="${i.id === 'x-pearls' ? '1 13' : '0'}" stroke-linecap="round"/>`;
  else if (i.slot === 'bag') g = `<rect x="22" y="40" width="56" height="44" rx="10" fill="${c}" ${st}/><path d="M32 42 Q50 6 68 42" stroke="${c}" stroke-width="6" fill="none"/>`;
  else if (i.slot === 'eyes') g = `<g fill="none" stroke="${c}" stroke-width="6"><circle cx="30" cy="52" r="16"/><circle cx="70" cy="52" r="16"/><path d="M46 52 L54 52"/></g>`;
  else g = `<rect x="6" y="6" width="88" height="88" rx="18" fill="${c}"/><text x="50" y="66" font-size="44" text-anchor="middle">${i.icon}</text>`;
  return `<svg viewBox="0 0 100 100" width="${size}" height="${size}">${g}</svg>`;
}

// Drag something with a finger (or tap it). onDrop(elementUnderFinger, event); onTap() for a simple tap.
function dragify(el, { ghost, onDrop, onTap }) {
  el.style.touchAction = 'none';
  el.addEventListener('pointerdown', e => {
    e.preventDefault();
    const sx = e.clientX, sy = e.clientY;
    let g = null;
    const move = ev => {
      if (!g && Math.hypot(ev.clientX - sx, ev.clientY - sy) > 8) {
        g = document.createElement('div'); g.className = 'ghost'; g.innerHTML = ghost || el.innerHTML; document.body.append(g);
      }
      if (g) { g.style.left = ev.clientX + 'px'; g.style.top = ev.clientY + 'px'; }
    };
    const up = ev => {
      window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up);
      if (g) { g.remove(); onDrop && onDrop(document.elementFromPoint(ev.clientX, ev.clientY), ev); } else onTap && onTap();
    };
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', up);
  });
}
// Finger position → doll picture position (300 x 440)
const dollPoint = (svg, ev) => { const r = svg.getBoundingClientRect(); return { x: (ev.clientX - r.left) / r.width * 300, y: (ev.clientY - r.top) / r.height * 440 }; };

// ---------------- the Fun Zone ----------------
// ctx: { app, h, say, sfx, store, save, back, confetti, name }
export function funZone(ctx) {
  const { app, h, say, sfx, store, save, back, name } = ctx;
  const f = funState(store);
  const endAt = Date.now() + 5 * 60e3; // one ticket = 5 minutes of fun
  let timer = null;
  const done = () => { clearInterval(timer); say('Fun time is over! Great job. Let\'s go back to learning!'); back(); };
  timer = setInterval(() => {
    const left = Math.max(0, endAt - Date.now());
    document.querySelectorAll('.funtime').forEach(el => (el.textContent = `⏱️ ${Math.ceil(left / 60000)} min`));
    if (!left) done();
    if (!document.querySelector('.funtime')) clearInterval(timer);
  }, 5000);

  const shell = (title, body) => {
    app.innerHTML = '';
    const cf = document.getElementById('confetti'); if (cf) setTimeout(() => (cf.innerHTML = ''), 1500);
    const s = h(`<div class="screen">
      <div class="topbar"><button class="icon-btn" data-a="home" aria-label="Fun Zone">🎀</button>
        <div class="pill">🪙 <span class="coins">${store.coins}</span></div><div class="pill funtime">⏱️ ${Math.ceil((endAt - Date.now()) / 60000)} min</div>
        <div class="spacer"></div><button class="icon-btn" data-a="exit" aria-label="Back to learning">🗺️</button></div>
      <div class="title" style="text-align:center">${title}</div></div>`);
    s.querySelector('[data-a=home]').onclick = () => { sfx.tap(); hub(); };
    s.querySelector('[data-a=exit]').onclick = () => { sfx.tap(); clearInterval(timer); back(); };
    s.append(body);
    app.append(s);
    return s;
  };
  const tabsHTML = (cats, cur) => `<div class="funtabs">${cats.map(([c, l]) => `<button class="pill tabicon ${c === cur ? 'on' : ''}" data-c="${c}" aria-label="${l}">${l.split(' ')[0]}</button>`).join('')}</div>`;

  function hub() {
    const body = h(`<div style="display:flex;flex-direction:column;align-items:center;gap:14px">
      <div style="display:flex;gap:16px;flex-wrap:wrap;justify-content:center;align-items:center">
        <div>${dollSVG(f.look, f.outfit, 200)}</div>
        <div style="display:flex;flex-direction:column;gap:12px;min-width:240px">
          <button class="big-btn green" data-g="salon">💇‍♀️ Salon</button>
          <button class="big-btn" data-g="dress">👗 Dress up</button>
          <button class="big-btn" data-g="shop">🛍️ Shop</button>
        </div></div></div>`);
    shell('🎀 Fun Zone', body);
    body.querySelector('[data-g=shop]').onclick = () => { sfx.tap(); shop('dress'); };
    body.querySelector('[data-g=dress]').onclick = () => { sfx.tap(); dressUp('dress'); };
    body.querySelector('[data-g=salon]').onclick = () => { sfx.tap(); salon(); };
  }

  // ---- 🛍️ Shop: drag things into the basket, then drag coins onto the counter
  function shop(cat) {
    const body = h(`<div>${tabsHTML(CATS, cat)}
      <div style="display:flex;gap:14px;align-items:flex-start;flex-wrap:wrap;justify-content:center">
        <div class="shelf" style="flex:1;min-width:280px">${ITEMS.filter(i => i.cat === cat).map(i => `<div class="shopitem ${f.owned.includes(i.id) ? 'owned' : ''}" data-i="${i.id}" aria-label="${esc(i.name)}">
          ${itemSVG(i)}<b class="tag">${f.owned.includes(i.id) ? '✅' : `🪙 ${i.price}`}</b></div>`).join('')}</div>
        <div class="basket">🧺<div style="font-size:16px">Drag it here!</div></div></div></div>`);
    shell('🛍️ The Shop', body);
    body.querySelectorAll('[data-c]').forEach(b => (b.onclick = () => { sfx.tap(); shop(b.dataset.c); }));
    const tryBuy = it => {
      if (f.owned.includes(it.id)) { say(`You already have the ${it.name}. Go to dress up to wear it!`); return; }
      checkout(it, () => shop(cat));
    };
    body.querySelectorAll('[data-i]').forEach(el => {
      const it = ITEM[el.dataset.i];
      dragify(el, {
        ghost: itemSVG(it, 90),
        onTap: () => { sfx.pop(); say(`The ${it.name}. It costs ${it.price} coins. Drag it into the basket to buy it!`); },
        onDrop: t => { if (t && t.closest('.basket')) { sfx.coin(); tryBuy(it); } },
      });
    });
    say(pick(['Welcome to the shop! Drag what you like into the basket!', 'Look at all these nice things! Drag one into the basket to buy it.']));
  }

  function checkout(it, after) {
    if (store.coins < it.price) {
      say(`The ${it.name} costs ${it.price} coins. You have ${store.coins}. You need ${it.price - store.coins} more coins. Keep learning to earn more!`);
      return;
    }
    const paid = [];
    const tens = Math.floor(it.price / 10), ones = it.price % 10;
    const body = h(`<div style="display:flex;flex-direction:column;align-items:center;gap:12px">
      <div class="bubble" style="text-align:center">${itemSVG(it, 90)}<br>It costs <b style="font-size:1.4em">🪙 ${it.price}</b></div>
      <div class="coinrow">${[10, 5, 1].map(v => `<div class="coin c${v}" data-v="${v}">${v}</div>`).join('')}</div>
      <div class="counter"><div class="tray"></div><div class="paidtxt">Drag coins here</div></div>
      <div style="display:flex;gap:12px"><button class="big-btn green buy" disabled style="opacity:.5">🛒</button><button class="big-btn cancel">✖</button></div></div>`);
    shell('🛒 Pay for it', body);
    const tray = body.querySelector('.tray'), txt = body.querySelector('.paidtxt'), buy = body.querySelector('.buy');
    const total = () => paid.reduce((a, b) => a + b, 0);
    const draw = () => {
      tray.innerHTML = paid.map((v, i) => `<div class="coin small c${v}" data-k="${i}">${v}</div>`).join('');
      tray.querySelectorAll('[data-k]').forEach(b => (b.onclick = () => { sfx.pop(); paid.splice(+b.dataset.k, 1); draw(); }));
      const t = total();
      txt.textContent = paid.length ? `${t}` + (t > it.price ? ' — too much! Tap a coin to take it back.' : '') : 'Drag coins here';
      const ok = t === it.price;
      buy.disabled = !ok; buy.style.opacity = ok ? 1 : 0.5;
      if (ok) { buy.classList.add('pulse'); say(`${it.price}! That is just right. Tap the cart to buy it!`); } else buy.classList.remove('pulse');
    };
    const add = v => {
      sfx.coin(); paid.push(v); draw();
      if (total() > it.price) say(`Oops, that is ${total()}. That is more than ${it.price}. Take a coin back.`);
      else if (total() < it.price) say(`${total()}`);
    };
    body.querySelectorAll('.coinrow .coin').forEach(el => dragify(el, {
      onTap: () => add(+el.dataset.v),
      onDrop: t => { if (t && t.closest('.counter')) add(+el.dataset.v); },
    }));
    buy.onclick = () => {
      if (total() !== it.price) return;
      store.coins -= it.price; f.owned.push(it.id); save();
      sfx.fanfare(); ctx.confetti(30);
      say(`You bought the ${it.name}! ${it.price} is ${tens} ten${tens === 1 ? '' : 's'} and ${ones} one${ones === 1 ? '' : 's'}. Now you have ${store.coins} coins.`);
      after();
    };
    body.querySelector('.cancel').onclick = () => { sfx.tap(); after(); };
    draw();
    say(`It costs ${it.price} coins. Drag the coins onto the counter to make ${it.price}. Tens first, then ones!`);
  }

  // ---- 👗 Dress up: drag clothes onto the doll
  function wear(id) {
    const it = ITEM[id];
    const o = f.outfit;
    if (it.cat === 'dress') { o.dress = id; }
    else if (it.cat === 'top' || it.cat === 'bottom') { o.dress = null; o[it.cat] = id; }
    else if (it.cat === 'extra') {
      o.extras ||= [];
      const on = o.extras.includes(id);
      o.extras = o.extras.filter(x => ITEM[x].slot !== it.slot);
      if (!on) o.extras.push(id);
    } else o[it.cat] = id;
    save();
  }
  function describe() {
    const o = f.outfit, parts = [];
    if (o.dress) parts.push(ITEM[o.dress].name);
    else { parts.push(ITEM[o.top || 't-white'].name, ITEM[o.bottom || 'b-blue'].name); }
    parts.push(ITEM[o.shoes || 's-white'].name);
    for (const x of o.extras || []) parts.push(ITEM[x].name);
    return parts.slice(0, -1).join(', ') + (parts.length > 1 ? ' and ' : '') + parts[parts.length - 1];
  }
  function dressUp(cat) {
    const mine = ITEMS.filter(i => i.cat === cat && f.owned.includes(i.id));
    const body = h(`<div style="display:flex;gap:16px;flex-wrap:wrap;justify-content:center;align-items:flex-start">
      <div class="dollbox drop">${dollSVG(f.look, f.outfit, 260)}</div>
      <div style="flex:1;min-width:260px;max-width:520px">
        ${tabsHTML(CATS, cat)}
        <div class="shelf">${mine.map(i => `<div class="shopitem" data-i="${i.id}" aria-label="${esc(i.name)}">${itemSVG(i)}</div>`).join('') || '<div class="bubble">🛍️ Buy some in the shop!</div>'}</div>
        <button class="big-btn green show" style="margin-top:12px">🦉 Show Ollie!</button>
      </div></div>`);
    shell('👗 Dress Up', body);
    const box = body.querySelector('.dollbox');
    const put = id => { sfx.pop(); wear(id); box.innerHTML = dollSVG(f.look, f.outfit, 260); box.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.05)' }, { transform: 'scale(1)' }], 300); };
    body.querySelectorAll('[data-c]').forEach(b => (b.onclick = () => { sfx.tap(); dressUp(b.dataset.c); }));
    body.querySelectorAll('[data-i]').forEach(el => dragify(el, {
      ghost: itemSVG(ITEM[el.dataset.i], 100),
      onTap: () => put(el.dataset.i),
      onDrop: t => { if (t && t.closest('.dollbox')) put(el.dataset.i); },
    }));
    body.querySelector('.show').onclick = () => { sfx.correct(); say(`${pick(['Wow!', 'How lovely!', 'So pretty!'])} I love your ${describe()}! You look wonderful, ${name()}!`); };
    say('Drag the clothes onto her!');
  }

  // ---- 💇‍♀️ Salon: wash, rinse, dry and comb her hair with your finger, put bows anywhere, paint each nail
  const CUSTOMERS = ['Maya', 'Leah', 'Grace', 'Ruth', 'Hannah', 'Naomi', 'Esther', 'Joy', 'Faith', 'Kayla'];
  let customer = null, tool = 'shampoo', polish = 'pink', bubbles = [];
  const TOOLS = [['shampoo', '🧴'], ['water', '🚿'], ['dryer', '💨'], ['comb', '🪮'], ['nails', '💅']];
  const TOOL_SAY = { shampoo: 'Rub the shampoo into her hair!', water: 'Rinse the bubbles away!', dryer: 'Blow her hair dry!', comb: 'Comb her hair nice and shiny!', nails: 'Pick a colour, then tap each nail!' };
  function newCustomer() {
    const want = { style: pick(STYLES), nails: pick(Object.keys(NAIL_COL)), clip: pick(Object.keys(CLIP_COL)) };
    customer = { name: pick(CUSTOMERS), want, look: { skin: pick(Object.keys(SKIN)), style: 'long', hair: pick(Object.keys(HAIR_COL)), clips: [], nailCols: Array(5).fill(null) } };
  }
  const wantText = c => `I would like ${STYLE_NAME[c.want.style]}, ${c.want.nails} nails and a ${c.want.clip} bow, please.`;
  const curLook = () => customer ? customer.look : f.look;
  const curOutfit = () => customer ? { place: 'g-party' } : f.outfit;

  function salon() {
    const look = curLook();
    if (tool === 'nails') return nailsView();
    const body = h(`<div style="display:flex;gap:14px;flex-wrap:wrap;justify-content:center;align-items:flex-start">
      <div style="text-align:center"><div class="dollbox salonbox" style="position:relative">${dollSVG(look, curOutfit(), 270)}<svg class="fx" viewBox="0 0 300 440"></svg></div>
        ${customer ? `<div class="bubble" style="margin-top:8px">💁‍♀️ <b>${customer.name}</b> <button class="icon-btn hear">👂</button></div>` : ''}</div>
      <div style="flex:1;min-width:270px;max-width:520px;display:flex;flex-direction:column;gap:10px">
        <div class="toolrow">${TOOLS.map(([t, e]) => `<button class="tool ${t === tool ? 'on' : ''}" data-t="${t}">${e}</button>`).join('')}</div>
        <div class="toolrow">${STYLES.map(s => `<button class="tool mini ${look.style === s ? 'on' : ''}" data-s="${s}" aria-label="${STYLE_NAME[s]}">${dollSVG({ ...look, style: s, clips: [] }, {}, 60)}</button>`).join('')}</div>
        <div class="toolrow">${Object.keys(HAIR_COL).map(k => `<button class="dot ${look.hair === k ? 'on' : ''}" data-h="${k}" style="background:${HAIR_COL[k]}" aria-label="${k}"></button>`).join('')}
          ${customer ? '' : Object.keys(SKIN).map(k => `<button class="dot face ${look.skin === k ? 'on' : ''}" data-k="${k}" style="background:${SKIN[k]}">🙂</button>`).join('')}</div>
        <div class="toolrow">${Object.keys(CLIP_COL).map(k => `<div class="bowpick" data-b="${k}" aria-label="${k} bow"><svg viewBox="-24 -16 48 32" width="56">${bowShape(0, 0, CLIP_COL[k], 1.3)}</svg></div>`).join('')}
          <button class="tool" data-x="clear" aria-label="Take the bows off">🧹</button></div>
        <div style="display:flex;gap:10px;flex-wrap:wrap">${customer ? '<button class="big-btn green finish">✔</button>' : '<button class="big-btn green cust">💁‍♀️ A customer!</button>'}</div>
      </div></div>`);
    shell(customer ? `💇‍♀️ ${customer.name}` : '💇‍♀️ Salon', body);
    const box = body.querySelector('.salonbox'), fx = body.querySelector('.fx');
    const redraw = () => { box.querySelector('.doll').outerHTML = dollSVG(look, curOutfit(), 270); drawFx(); };
    const drawFx = () => { fx.innerHTML = bubbles.map(b => `<circle cx="${b.x}" cy="${b.y}" r="${b.r}" fill="#fff" stroke="#bde0fe" stroke-width="2" opacity=".9"/>`).join(''); };
    drawFx();
    // tools
    body.querySelectorAll('[data-t]').forEach(b => (b.onclick = () => { sfx.tap(); tool = b.dataset.t; if (tool === 'nails') return nailsView(); salon(); say(TOOL_SAY[tool]); }));
    body.querySelectorAll('[data-s]').forEach(b => (b.onclick = () => { sfx.pop(); look.style = b.dataset.s; save(); salon(); say(`Now she has ${STYLE_NAME[look.style]}!`); }));
    body.querySelectorAll('[data-h]').forEach(b => (b.onclick = () => { sfx.pop(); look.hair = b.dataset.h; save(); salon(); }));
    body.querySelectorAll('[data-k]').forEach(b => (b.onclick = () => { sfx.pop(); look.skin = b.dataset.k; save(); salon(); }));
    body.querySelector('[data-x=clear]').onclick = () => { sfx.pop(); look.clips = []; delete look.clip; save(); redraw(); };
    // bows: drag onto her hair, wherever she likes (tap = put it on top)
    body.querySelectorAll('[data-b]').forEach(el => dragify(el, {
      ghost: `<svg viewBox="-24 -16 48 32" width="70">${bowShape(0, 0, CLIP_COL[el.dataset.b], 1.3)}</svg>`,
      onTap: () => { look.clips = [...clipsOf(look), { x: 150 + rnd(-40, 40), y: 70 + rnd(-10, 10), c: el.dataset.b }].slice(-6); delete look.clip; save(); sfx.pop(); redraw(); },
      onDrop: (t, ev) => {
        if (!t || !t.closest('.salonbox')) return;
        const p = dollPoint(box.querySelector('.doll'), ev);
        look.clips = [...clipsOf(look), { x: Math.round(p.x), y: Math.round(p.y), c: el.dataset.b }].slice(-6); delete look.clip;
        save(); sfx.pop(); redraw();
      },
    }));
    // rub her hair with your finger
    let rubbing = false, rubs = 0;
    const inHair = p => Math.hypot(p.x - 150, p.y - 105) < 115 && p.y < 215;
    box.style.touchAction = 'none';
    box.addEventListener('pointerdown', ev => { rubbing = true; rub(ev); });
    box.addEventListener('pointermove', ev => { if (rubbing) rub(ev); });
    for (const e of ['pointerup', 'pointerleave', 'pointercancel']) box.addEventListener(e, () => (rubbing = false));
    function sparkle(p, ch) {
      const s = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      s.setAttribute('x', p.x); s.setAttribute('y', p.y); s.setAttribute('font-size', 26); s.textContent = ch;
      fx.append(s); s.animate([{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(-30px)' }], 900).onfinish = () => s.remove();
    }
    function rub(ev) {
      const p = dollPoint(box.querySelector('.doll'), ev);
      if (!inHair(p)) return;
      rubs++;
      if (tool === 'shampoo') {
        if (bubbles.length < 60) { bubbles.push({ x: p.x + rnd(-8, 8), y: p.y + rnd(-8, 8), r: rnd(6, 14) }); drawFx(); }
        if (rubs % 12 === 0) sfx.pop();
        if (bubbles.length === 25) say('Lots of bubbles! Now rinse them away with the water!');
      } else if (tool === 'water') {
        const before = bubbles.length;
        bubbles = bubbles.filter(b => Math.hypot(b.x - p.x, b.y - p.y) > 26);
        if (rubs % 3 === 0) sparkle(p, '💧');
        drawFx();
        if (before && !bubbles.length) { sfx.correct(); say('All clean! Now dry her hair!'); }
      } else if (tool === 'dryer') {
        if (rubs % 3 === 0) sparkle(p, '💨');
        if (rubs === 40) { sfx.correct(); say('Nice and dry! Now comb it!'); }
      } else if (tool === 'comb') {
        if (rubs % 3 === 0) sparkle(p, '✨');
        if (rubs > 30 && !look.shiny) { look.shiny = true; save(); sfx.correct(); redraw(); say('So shiny and neat! Now add some bows!'); }
      }
    }
    const hear = body.querySelector('.hear'); if (hear) hear.onclick = () => say(`${customer.name} says: ${wantText(customer)}`);
    const cust = body.querySelector('.cust');
    if (cust) cust.onclick = () => {
      sfx.tap(); newCustomer(); bubbles = []; tool = 'shampoo';
      salon();
      say(`Hello! I am ${customer.name}. ${wantText(customer)} Listen carefully! Tap the ear to hear me again.`);
    };
    const fin = body.querySelector('.finish');
    if (fin) fin.onclick = () => checkCustomer();
  }

  // 💅 Big hand: pick a colour, tap each nail
  function nailsView() {
    const look = curLook();
    look.nailCols = nailsOf(look).slice(); delete look.nails;
    const skin = SKIN[look.skin] || SKIN.b;
    const fingers = [[60, 120, -18], [105, 70, -6], [150, 58, 0], [195, 72, 6], [238, 112, 16]];
    const hand = () => `<svg viewBox="0 0 300 330" width="300" class="hand"><rect x="60" y="170" width="180" height="150" rx="60" fill="${skin}"/>
      ${fingers.map(([x, y, r], i) => `<g transform="rotate(${r} ${x} ${y + 60})"><rect x="${x - 20}" y="${y}" width="40" height="${i === 0 ? 110 : 140}" rx="20" fill="${skin}"/>
        <ellipse class="nail" data-n="${i}" cx="${x}" cy="${y + 22}" rx="14" ry="18" fill="${look.nailCols[i] ? NAIL_COL[look.nailCols[i]] : '#f8e1d4'}" stroke="rgba(0,0,0,.2)" stroke-width="2"/></g>`).join('')}</svg>`;
    const body = h(`<div style="display:flex;gap:14px;flex-wrap:wrap;justify-content:center;align-items:center">
      <div class="handbox">${hand()}</div>
      <div style="display:flex;flex-direction:column;gap:12px;align-items:center">
        <div class="toolrow" style="max-width:320px">${Object.keys(NAIL_COL).map(k => `<button class="bottle ${polish === k ? 'on' : ''}" data-p="${k}" aria-label="${k}"><span style="background:${NAIL_COL[k]}"></span></button>`).join('')}</div>
        <button class="big-btn back2">💇‍♀️ Back to hair</button>
        ${customer ? '<button class="big-btn green finish">✔</button>' : ''}
      </div></div>`);
    shell('💅 Nails', body);
    const hb = body.querySelector('.handbox');
    const bind = () => hb.querySelectorAll('.nail').forEach(n => (n.onclick = () => {
      look.nailCols[+n.dataset.n] = polish; save(); sfx.pop();
      n.setAttribute('fill', NAIL_COL[polish]);
      n.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.25)' }, { transform: 'scale(1)' }], 250);
      if (look.nailCols.every(Boolean)) say(pick(['Beautiful nails!', 'All ten fingers look lovely! Well, five of them!', 'So pretty!']));
    }));
    bind();
    body.querySelectorAll('[data-p]').forEach(b => (b.onclick = () => { sfx.tap(); polish = b.dataset.p; body.querySelectorAll('[data-p]').forEach(x => x.classList.toggle('on', x === b)); say(polish); }));
    body.querySelector('.back2').onclick = () => { sfx.tap(); tool = 'comb'; salon(); };
    const fin = body.querySelector('.finish'); if (fin) fin.onclick = () => checkCustomer();
    say('Pick a colour, then tap each nail!');
  }

  function checkCustomer() {
    const c = customer, l = c.look, w = c.want, miss = [];
    if (l.style !== w.style) miss.push(STYLE_NAME[w.style]);
    if (!nailsOf(l).every(n => n === w.nails)) miss.push(`all ${w.nails} nails`);
    if (!clipsOf(l).some(x => x.c === w.clip)) miss.push(`a ${w.clip} bow`);
    if (!miss.length) {
      sfx.fanfare(); ctx.confetti(40);
      store.coins += 5; f.happy++; save();
      say(`Thank you! I love it! You listened so well. Here are 5 coins!`);
      customer = null; tool = 'shampoo'; bubbles = [];
      setTimeout(() => salon(), 2500);
    } else {
      sfx.wrong();
      say(`Hmm, not quite. Remember, I wanted ${miss.join(' and ')}. Listen again: ${wantText(c)}`);
    }
  }

  hub();
  say(`Welcome to the Fun Zone, ${name()}! You have 5 minutes. Go to the salon, dress up, or go shopping!`);
}

// ---------------- More stickers, in themed pages ----------------
export const STICKER_PAGES = {
  'Animals': ['🐼', '🐨', '🦊', '🐯', '🦒', '🐘', '🦓', '🐿️', '🦔', '🐶', '🐱', '🐰', '🐹', '🐻', '🐮', '🐷', '🐴', '🐑', '🐐', '🦘', '🦥', '🦦', '🦙', '🐪', '🐸', '🦕'],
  'Under the sea': ['🐬', '🐠', '🐙', '🦀', '🐳', '🐚', '🐟', '🐡', '🦈', '🦭', '🐢', '🦞', '🦐', '🦑', '🪸', '🐋'],
  'Birds & bugs': ['🦋', '🕊️', '🦩', '🐝', '🐞', '🦜', '🐧', '🦉', '🐤', '🦆', '🦢', '🦚', '🐌', '🐛', '🐜', '🦗'],
  'Yummy treats': ['🍦', '🧁', '🍭', '🍩', '🍪', '🎂', '🍰', '🥧', '🍫', '🍬', '🥞', '🧇', '🍿', '🥨', '🍯', '🥛'],
  'Fruit & garden': ['🍓', '🍉', '🍍', '🥭', '🥥', '🍌', '🍎', '🍊', '🍇', '🍒', '🍑', '🍋', '🥝', '🫐', '🥕', '🌽'],
  'Flowers & nature': ['🌻', '🌺', '🌷', '🌸', '🌼', '🌹', '💐', '🌴', '🌳', '🍀', '🍁', '🌵', '🍄', '🪴', '🌿', '🍂'],
  'Church & Bible': ['✝️', '📖', '🙏', '⛪', '🕊️', '💒', '🎶', '🕯️', '🌅', '👑', '💖', '🎄', '⭐', '🐑', '🫶', '😇'],
  'Toys & fun': ['🎀', '🎈', '🎁', '🧸', '🪁', '🎠', '🎡', '🛼', '🪀', '🧩', '🎲', '🪅', '🎪', '🛝', '🎉', '🧃'],
  'Sky & space': ['🌈', '🌙', '☀️', '🪐', '🚀', '⭐', '🌟', '☁️', '⛅', '🌤️', '❄️', '⚡', '🌍', '🛰️', '🔭', '🌠'],
  'Music & art': ['🎨', '🎵', '🎹', '🥁', '🎸', '🎺', '🎻', '🪇', '🖍️', '✏️', '🖌️', '📚', '🎤', '🎧', '🩰', '🪕'],
  'Sports & play': ['🏆', '⚽', '🏀', '🏐', '🎾', '🏏', '🥇', '🏊‍♀️', '🚴‍♀️', '🤸‍♀️', '⛸️', '🏓', '🥏', '🛹', '🎯', '🏅'],
  'Things that go': ['🚗', '🚌', '🚂', '✈️', '🚁', '⛵', '🚤', '🚲', '🛵', '🚒', '🚑', '🚜', '🚀', '🛶', '🚠', '🚕'],
  'Jamaica & beach': ['🇯🇲', '🏝️', '🏖️', '🌊', '⛱️', '🩴', '👒', '🕶️', '🍹', '🥭', '🥥', '🦜', '🐠', '🌴', '☀️', '🛟'],
  'Sparkle': ['💎', '💍', '👑', '✨', '💫', '🌟', '💖', '💜', '💙', '💚', '💛', '🧡', '🤍', '🩷', '🪞', '🎀'],
};
// unique list, in page order
export const ALL_STICKERS = [...new Set(Object.values(STICKER_PAGES).flat())];
