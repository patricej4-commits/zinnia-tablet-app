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
export function dollSVG(look, outfit = {}, size = 300) {
  const skin = SKIN[look.skin] || SKIN.b, hc = HAIR_COL[look.hair] || HAIR_COL.black;
  const it = id => (id ? ITEM[id] : null);
  const dress = it(outfit.dress), top = it(outfit.top), bottom = it(outfit.bottom), shoes = it(outfit.shoes), place = it(outfit.place);
  const ex = slot => (outfit.extras || []).map(it).find(x => x && x.slot === slot);
  const clip = look.clip ? CLIP_COL[look.clip] : null;
  let back = '', front = '';
  switch (look.style) {
    case 'puffs': back = `<circle cx="88" cy="78" r="38" fill="${hc}"/><circle cx="212" cy="78" r="38" fill="${hc}"/>`; break;
    case 'afro': back = `<circle cx="150" cy="112" r="96" fill="${hc}"/>`; break;
    case 'long': back = `<rect x="80" y="80" width="140" height="160" rx="60" fill="${hc}"/>`; break;
    case 'ponytail': back = `<ellipse cx="226" cy="140" rx="24" ry="60" fill="${hc}" transform="rotate(-15 226 140)"/>`; break;
    case 'braids': back = `<rect x="82" y="110" width="16" height="150" rx="8" fill="${hc}"/><rect x="202" y="110" width="16" height="150" rx="8" fill="${hc}"/>` +
      [0, 1, 2].map(i => `<circle cx="90" cy="${200 + i * 22}" r="7" fill="${clip || '#ffd23f'}"/><circle cx="210" cy="${200 + i * 22}" r="7" fill="${clip || '#ffd23f'}"/>`).join(''); break;
    case 'bun': back = `<circle cx="150" cy="48" r="34" fill="${hc}"/>`; break;
  }
  front = look.style === 'afro' ? '' : `<path d="M86 118 Q150 18 214 118 Q186 78 150 76 Q114 78 86 118 Z" fill="${hc}"/>`;
  const legs = `<rect x="117" y="325" width="24" height="78" rx="10" fill="${skin}"/><rect x="159" y="325" width="24" height="78" rx="10" fill="${skin}"/>`;
  const arms = `<rect x="72" y="212" width="24" height="100" rx="12" fill="${skin}" transform="rotate(12 84 212)"/><rect x="204" y="212" width="24" height="100" rx="12" fill="${skin}" transform="rotate(-12 216 212)"/>`;
  const nails = look.nails ? [[66, 312], [74, 316], [226, 316], [234, 312]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="4" ry="5" fill="${NAIL_COL[look.nails]}"/>`).join('') : '';
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
  if (clip && look.style !== 'braids') acc += `<circle cx="${look.style === 'puffs' ? 112 : 196}" cy="80" r="9" fill="${clip}" stroke="rgba(0,0,0,.2)"/>`;
  if (bow) acc += `<g transform="translate(${look.style === 'bun' ? 150 : 192} ${look.style === 'bun' ? 22 : 66})"><path d="M0 0 L-24 -14 L-24 14 Z M0 0 L24 -14 L24 14 Z" fill="${bow.col}"/><circle r="7" fill="${bow.col}" stroke="rgba(0,0,0,.2)"/></g>`;
  if (hat && hat.id === 'x-hat') acc += `<ellipse cx="150" cy="74" rx="96" ry="18" fill="${hat.col}"/><path d="M102 74 Q150 0 198 74 Z" fill="${hat.col}"/><rect x="104" y="62" width="92" height="10" fill="#ff6fae"/>`;
  else if (hat) acc += `<path d="M90 96 Q150 40 210 96" stroke="${hat.col}" stroke-width="10" fill="none" stroke-linecap="round"/>`;
  if (eyes) acc += `<g fill="none" stroke="${eyes.col}" stroke-width="4"><circle cx="128" cy="124" r="15"/><circle cx="172" cy="124" r="15"/><path d="M143 124 L157 124"/></g>`;
  if (neck) acc += `<path d="M126 206 Q150 232 174 206" stroke="${neck.col}" stroke-width="7" fill="none" stroke-dasharray="${neck.id === 'x-pearls' ? '1 9' : '0'}" stroke-linecap="round"/>`;
  if (bag) acc += `<rect x="214" y="290" width="40" height="34" rx="8" fill="${bag.col}"/><path d="M220 292 Q234 268 248 292" stroke="${bag.col}" stroke-width="4" fill="none"/>`;
  const bg = (place || ITEM['g-sky']).col;
  return `<svg viewBox="0 0 300 440" width="${size}" style="max-width:100%;border-radius:24px;background:${bg};box-shadow:0 6px 0 rgba(0,0,0,.08)">
    ${place && place.id !== 'g-sky' ? `<text x="18" y="420" font-size="44">${place.icon}</text>` : ''}
    ${back}${legs}${shoe}${arms}${clothes}${hands}${head}${front}${acc}</svg>`;
}

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
    const cf = document.getElementById('confetti'); if (cf && !body.querySelector('.buy')) setTimeout(() => (cf.innerHTML = ''), 1500);
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

  function hub() {
    const body = h(`<div style="display:flex;flex-direction:column;align-items:center;gap:14px">
      <div style="display:flex;gap:16px;flex-wrap:wrap;justify-content:center;align-items:center">
        <div>${dollSVG(f.look, f.outfit, 200)}</div>
        <div style="display:flex;flex-direction:column;gap:12px;min-width:240px">
          <button class="big-btn green" data-g="shop">🛍️ Shop</button>
          <button class="big-btn" data-g="dress">👗 Dress up</button>
          <button class="big-btn" data-g="salon">💇‍♀️ Salon</button>
        </div></div></div>`);
    shell('🎀 Fun Zone', body);
    body.querySelector('[data-g=shop]').onclick = () => { sfx.tap(); shop('dress'); };
    body.querySelector('[data-g=dress]').onclick = () => { sfx.tap(); dressUp('dress'); };
    body.querySelector('[data-g=salon]').onclick = () => { sfx.tap(); salon(); };
  }

  // ---- 🛍️ Shop: pay with 10, 5 and 1 coins
  function shop(cat) {
    const body = h(`<div><div class="funtabs">${CATS.map(([c, l]) => `<button class="pill ${c === cat ? 'on' : ''}" data-c="${c}">${l}</button>`).join('')}</div>
      <div class="shelf">${ITEMS.filter(i => i.cat === cat).map(i => `<button class="shopitem ${f.owned.includes(i.id) ? 'owned' : ''}" data-i="${i.id}">
        <span class="swatch" style="background:${i.col}">${i.icon}</span><span class="lbl">${esc(i.name)}</span>
        <b>${f.owned.includes(i.id) ? '✅ yours' : `🪙 ${i.price}`}</b></button>`).join('')}</div></div>`);
    shell('🛍️ The Shop', body);
    body.querySelectorAll('[data-c]').forEach(b => (b.onclick = () => { sfx.tap(); shop(b.dataset.c); }));
    body.querySelectorAll('[data-i]').forEach(b => (b.onclick = () => {
      sfx.tap();
      const it = ITEM[b.dataset.i];
      if (f.owned.includes(it.id)) { say(`You already have the ${it.name}. Go to dress up to wear it!`); return; }
      checkout(it, () => shop(cat));
    }));
    say(pick(['Welcome to the shop! What would you like to buy?', 'Look at all these nice things! Tap one to buy it.']));
  }

  function checkout(it, after) {
    if (store.coins < it.price) {
      const need = it.price - store.coins;
      say(`The ${it.name} costs ${it.price} coins. You have ${store.coins}. You need ${need} more coins. Keep learning to earn more!`);
      return;
    }
    let paid = [];
    const tens = Math.floor(it.price / 10), ones = it.price % 10;
    const body = h(`<div style="display:flex;flex-direction:column;align-items:center;gap:12px">
      <div class="bubble" style="text-align:center"><span style="font-size:60px">${it.icon}</span><br>The <b>${esc(it.name)}</b> costs <b>🪙 ${it.price}</b>.<br>Tap the coins to pay <b>${it.price}</b>.</div>
      <div class="coinrow">${[10, 5, 1].map(v => `<button class="coin c${v}" data-v="${v}">${v}</button>`).join('')}</div>
      <div class="bubble tray" style="min-height:70px;min-width:280px;text-align:center"></div>
      <div class="white paidtxt" style="font-size:26px">You paid: 0</div>
      <div style="display:flex;gap:12px"><button class="big-btn green buy" disabled style="opacity:.5">🛒 Buy it!</button><button class="big-btn cancel">✖ Not now</button></div></div>`);
    shell('🛒 Pay for it', body);
    const tray = body.querySelector('.tray'), txt = body.querySelector('.paidtxt'), buy = body.querySelector('.buy');
    const total = () => paid.reduce((a, b) => a + b, 0);
    const draw = () => {
      tray.innerHTML = paid.map((v, i) => `<button class="coin small c${v}" data-k="${i}">${v}</button>`).join(' ') || '<span style="opacity:.5">Your coins go here</span>';
      tray.querySelectorAll('[data-k]').forEach(b => (b.onclick = () => { sfx.pop(); paid.splice(+b.dataset.k, 1); draw(); }));
      const t = total();
      txt.textContent = `You paid: ${t}` + (t > it.price ? '  — too much! Tap a coin to take it back.' : '');
      const ok = t === it.price;
      buy.disabled = !ok; buy.style.opacity = ok ? 1 : 0.5;
      if (ok) say(`${it.price}! That is just right. Tap buy it!`);
    };
    body.querySelectorAll('.coinrow .coin').forEach(b => (b.onclick = () => {
      sfx.coin(); paid.push(+b.dataset.v); draw();
      if (total() > it.price) say(`Oops, that is ${total()}. That is more than ${it.price}. Take a coin back.`);
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
    say(`The ${it.name} costs ${it.price} coins. Tap the coins to make ${it.price}. Tens first, then ones!`);
  }

  // ---- 👗 Dress up
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
      <div class="dollbox">${dollSVG(f.look, f.outfit, 260)}</div>
      <div style="flex:1;min-width:260px;max-width:520px">
        <div class="funtabs">${CATS.map(([c, l]) => `<button class="pill ${c === cat ? 'on' : ''}" data-c="${c}">${l}</button>`).join('')}</div>
        <div class="shelf">${mine.map(i => `<button class="shopitem" data-i="${i.id}"><span class="swatch" style="background:${i.col}">${i.icon}</span><span class="lbl">${esc(i.name)}</span></button>`).join('') || '<div class="bubble">Nothing here yet. Buy some in the shop! 🛍️</div>'}</div>
        <button class="big-btn green show" style="margin-top:12px">🦉 Show Ollie!</button>
      </div></div>`);
    shell('👗 Dress Up', body);
    body.querySelectorAll('[data-c]').forEach(b => (b.onclick = () => { sfx.tap(); dressUp(b.dataset.c); }));
    body.querySelectorAll('[data-i]').forEach(b => (b.onclick = () => { sfx.pop(); wear(b.dataset.i); body.querySelector('.dollbox').innerHTML = dollSVG(f.look, f.outfit, 260); }));
    // "Show Ollie" — he describes the outfit (describing words!)
    body.querySelector('.show').onclick = () => { sfx.correct(); say(`${pick(['Wow!', 'How lovely!', 'So pretty!'])} I love your ${describe()}! You look wonderful, ${name()}!`); };
  }

  // ---- 💇‍♀️ Salon: style her own doll, or a customer who asks for a look (listen carefully!)
  const CUSTOMERS = ['Maya', 'Leah', 'Grace', 'Ruth', 'Hannah', 'Naomi', 'Esther', 'Joy', 'Faith', 'Kayla'];
  let customer = null;
  function newCustomer() {
    const want = { style: pick(STYLES), nails: pick(Object.keys(NAIL_COL)), clip: pick(Object.keys(CLIP_COL)) };
    customer = { name: pick(CUSTOMERS), want, look: { skin: pick(Object.keys(SKIN)), style: 'long', hair: pick(Object.keys(HAIR_COL)), clip: null, nails: null } };
    return customer;
  }
  const wantText = c => `I would like ${STYLE_NAME[c.want.style]}, ${c.want.nails} nails and a ${c.want.clip} clip, please.`;
  function salon(tab = 'style') {
    const look = customer ? customer.look : f.look;
    const tabs = [['style', '💇‍♀️ Hair style'], ['hair', '🎨 Hair colour'], ['clip', '🎀 Clips'], ['nails', '💅 Nails'], ['skin', '🙂 Skin']];
    const opts = tab === 'style' ? STYLES.map(s => [s, `${STYLE_ICON[s]} ${STYLE_NAME[s]}`, null])
      : tab === 'hair' ? Object.keys(HAIR_COL).map(k => [k, k, HAIR_COL[k]])
      : tab === 'clip' ? [[null, 'none', '#eee'], ...Object.keys(CLIP_COL).map(k => [k, k, CLIP_COL[k]])]
      : tab === 'nails' ? [[null, 'none', '#eee'], ...Object.keys(NAIL_COL).map(k => [k, k, NAIL_COL[k]])]
      : Object.keys(SKIN).map((k, i) => [k, ['deep brown', 'brown', 'golden', 'light'][i], SKIN[k]]);
    const body = h(`<div style="display:flex;gap:16px;flex-wrap:wrap;justify-content:center;align-items:flex-start">
      <div style="text-align:center"><div class="dollbox">${dollSVG(look, customer ? { place: 'g-party' } : f.outfit, 260)}</div>
        ${customer ? `<div class="bubble" style="margin-top:8px">💁‍♀️ <b>${customer.name}</b> <button class="icon-btn hear">👂</button></div>` : ''}</div>
      <div style="flex:1;min-width:260px;max-width:520px">
        <div class="funtabs">${tabs.filter(t => !customer || t[0] !== 'skin').map(([t, l]) => `<button class="pill ${t === tab ? 'on' : ''}" data-t="${t}">${l}</button>`).join('')}</div>
        <div class="shelf">${opts.map(([v, l, c]) => `<button class="shopitem" data-v="${v ?? ''}">${c ? `<span class="swatch" style="background:${c}"></span>` : ''}<span class="lbl">${esc(l)}</span></button>`).join('')}</div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:12px">
          ${customer ? '<button class="big-btn green finish">✔ All done!</button>' : '<button class="big-btn green cust">💁‍♀️ A customer is here!</button>'}
        </div></div></div>`);
    shell(customer ? `💇‍♀️ Salon: ${customer.name}` : '💇‍♀️ Salon', body);
    body.querySelectorAll('[data-t]').forEach(b => (b.onclick = () => { sfx.tap(); salon(b.dataset.t); }));
    body.querySelectorAll('[data-v]').forEach(b => (b.onclick = () => {
      sfx.pop();
      const v = b.dataset.v || null;
      look[{ style: 'style', hair: 'hair', clip: 'clip', nails: 'nails', skin: 'skin' }[tab]] = v;
      save();
      body.querySelector('.dollbox').innerHTML = dollSVG(look, customer ? { place: 'g-party' } : f.outfit, 260);
    }));
    const hear = body.querySelector('.hear'); if (hear) hear.onclick = () => say(`${customer.name} says: ${wantText(customer)}`);
    const cust = body.querySelector('.cust');
    if (cust) cust.onclick = () => {
      sfx.tap(); newCustomer();
      salon('style');
      say(`Hello! I am ${customer.name}. ${wantText(customer)} Listen carefully! Tap the ear to hear me again.`);
    };
    const fin = body.querySelector('.finish');
    if (fin) fin.onclick = () => {
      const c = customer, l = c.look, w = c.want, miss = [];
      if (l.style !== w.style) miss.push(STYLE_NAME[w.style]);
      if (l.nails !== w.nails) miss.push(`${w.nails} nails`);
      if (l.clip !== w.clip) miss.push(`a ${w.clip} clip`);
      if (!miss.length) {
        sfx.fanfare(); ctx.confetti(40);
        store.coins += 5; f.happy++; save();
        say(`Thank you! I love it! You listened so well. Here are 5 coins!`);
        customer = null;
        setTimeout(() => salon('style'), 2500);
      } else {
        sfx.wrong();
        say(`Hmm, not quite. Remember, I wanted ${miss.join(' and ')}. Listen again: ${wantText(c)}`);
      }
    };
  }

  hub();
  say(`Welcome to the Fun Zone, ${name()}! You have 5 minutes. Shop, dress up, or go to the salon!`);
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
