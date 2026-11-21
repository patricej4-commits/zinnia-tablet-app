// Drawings for maths: ten frames, number bonds, tens & ones, groups of objects.

// n red counters in a ten frame; `crossed` of the last ones get an X (take away)
export function tenFrame(n, crossed = 0, blue = 0) {
  let cells = '';
  for (let i = 0; i < 10; i++) {
    let inner = '';
    if (i < n) {
      const isBlue = i >= n - blue;
      inner = `<i class="dot${isBlue ? ' b' : ''}"></i>`;
    }
    const x = i < n && i >= n - crossed ? ' x' : '';
    cells += `<span class="${x}">${inner}</span>`;
  }
  return `<div class="tenframe">${cells}</div>`;
}

// One or two ten frames for numbers up to 20
export function tenFrames(n, crossed = 0, blue = 0) {
  if (n <= 10) return `<div class="frames">${tenFrame(n, crossed, blue)}</div>`;
  // crossed / blue apply to the last frame
  return `<div class="frames">${tenFrame(10, Math.max(0, crossed - (n - 10)), Math.max(0, blue - (n - 10)))}${tenFrame(n - 10, Math.min(crossed, n - 10), Math.min(blue, n - 10))}</div>`;
}

// Number bond: whole on top, two parts below. Pass null for the missing one.
export function numberBond(whole, a, b) {
  const t = v => (v === null || v === undefined ? '?' : v);
  const fill = v => (v === null || v === undefined ? '#fff3b0' : '#fff');
  return `<div class="bond"><svg viewBox="0 0 300 230" role="img" aria-label="number bond">
    <line x1="150" y1="60" x2="70" y2="170" stroke="#2b2250" stroke-width="6"/>
    <line x1="150" y1="60" x2="230" y2="170" stroke="#2b2250" stroke-width="6"/>
    <circle cx="150" cy="58" r="50" fill="${fill(whole)}" stroke="#5b3fd1" stroke-width="7"/>
    <circle cx="70" cy="170" r="46" fill="${fill(a)}" stroke="#ff5fa2" stroke-width="7"/>
    <circle cx="230" cy="170" r="46" fill="${fill(b)}" stroke="#3fa9f5" stroke-width="7"/>
    <text x="150" y="76" font-size="50" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" fill="#2b2250">${t(whole)}</text>
    <text x="70" y="187" font-size="46" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" fill="#2b2250">${t(a)}</text>
    <text x="230" y="187" font-size="46" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" fill="#2b2250">${t(b)}</text>
  </svg></div>`;
}

// Bundle of ten sticks + loose cubes
export function tensOnes(n) {
  const tens = Math.floor(n / 10), ones = n % 10;
  let html = '<div class="tens">';
  for (let i = 0; i < tens; i++) html += '<div><span class="stick"></span><div style="font-size:18px">10</div></div>';
  html += '<div style="max-width:120px;display:flex;flex-wrap:wrap">';
  for (let i = 0; i < ones; i++) html += '<span class="cube"></span>';
  html += '</div></div>';
  return html;
}

// A group of n emoji, wrapped nicely
export function group(emoji, n, extra = '') {
  return `<div class="group" ${extra}>${Array(n).fill(emoji).join(' ') || '&nbsp;'}</div>`;
}

export function equation(parts) {
  return `<div class="eq">${parts.map(p => (p === '?' ? '<span class="gap">?</span>' : p)).join(' ')}</div>`;
}

// Simple coloured shapes for listening games
const SHAPES = {
  circle: c => `<circle cx="50" cy="50" r="42" fill="${c}"/>`,
  square: c => `<rect x="10" y="10" width="80" height="80" rx="6" fill="${c}"/>`,
  triangle: c => `<polygon points="50,6 94,90 6,90" fill="${c}"/>`,
  star: c => `<polygon points="50,4 61,38 97,38 68,59 79,94 50,73 21,94 32,59 3,38 39,38" fill="${c}"/>`,
  heart: c => `<path d="M50 88 C10 60 4 34 22 20 C36 9 48 18 50 28 C52 18 64 9 78 20 C96 34 90 60 50 88Z" fill="${c}"/>`,
  rectangle: c => `<rect x="4" y="25" width="92" height="50" rx="6" fill="${c}"/>`,
};
export const SHAPE_NAMES = Object.keys(SHAPES);
export const COLOURS = { red: '#ff3b4a', blue: '#2f7cf6', yellow: '#ffcc00', green: '#22b45a', purple: '#8a4dff', orange: '#ff8a1f', pink: '#ff6fb5' };
export function shapeSVG(shape, colour) {
  return `<svg viewBox="0 0 100 100">${SHAPES[shape](COLOURS[colour] || colour)}</svg>`;
}

// Straight / curved lines
export function lineSVG(kind) {
  const paths = {
    straight: '<line x1="10" y1="50" x2="190" y2="50" stroke="#5b3fd1" stroke-width="10" stroke-linecap="round"/>',
    slant: '<line x1="20" y1="90" x2="180" y2="10" stroke="#5b3fd1" stroke-width="10" stroke-linecap="round"/>',
    curved: '<path d="M10 80 Q100 -20 190 80" fill="none" stroke="#ff5fa2" stroke-width="10" stroke-linecap="round"/>',
    wavy: '<path d="M10 50 Q55 0 100 50 T190 50" fill="none" stroke="#ff5fa2" stroke-width="10" stroke-linecap="round"/>',
    zigzag: '<polyline points="10,80 50,20 90,80 130,20 170,80" fill="none" stroke="#5b3fd1" stroke-width="10" stroke-linejoin="round" stroke-linecap="round"/>',
    vertical: '<line x1="100" y1="5" x2="100" y2="95" stroke="#5b3fd1" stroke-width="10" stroke-linecap="round"/>',
    circleline: '<circle cx="100" cy="50" r="40" fill="none" stroke="#ff5fa2" stroke-width="10"/>',
  };
  return `<svg viewBox="0 0 200 100" style="width:clamp(120px,22vw,200px)">${paths[kind]}</svg>`;
}

// Column (vertical) sum, the way it is written in class:
//     1 0
//   −   2
//   -----
//      ?
// Digits line up in tens (T) and ones (O) columns.
export function vertical(top, op, bottom) {
  const two = top >= 10 || bottom >= 10;
  const digits = n => (two ? [n >= 10 ? String(Math.floor(n / 10)) : '', String(n % 10)] : [String(n)]);
  const cells = arr => arr.map(d => `<span class="vd">${d}</span>`).join('');
  const head = two ? `<div class="vrow vhead"><span class="vop"></span><span class="vd">T</span><span class="vd">O</span></div>` : '';
  return `<div class="vert">${head}
    <div class="vrow"><span class="vop"></span>${cells(digits(top))}</div>
    <div class="vrow"><span class="vop">${op}</span>${cells(digits(bottom))}</div>
    <div class="vline"></div>
    <div class="vrow"><span class="vop"></span><span class="vans" style="grid-column: span ${two ? 2 : 1}">?</span></div>
  </div>`;
}

// Number line. opts: { min, max, show(n) -> bool (which labels to print), arrowAt, boxAt,
//   frogAt, hops: [[from, to], ...], marks: { n: colour } }
// Every number has an invisible tap target: <rect class="nl-hit" data-n="...">
export function numberLine(o) {
  const { min = 0, max = 10 } = o;
  const n = max - min;
  const step = n <= 10 ? 70 : 44;
  const pad = 46;
  const W = pad * 2 + n * step, H = 170;
  const X = v => pad + (v - min) * step;
  const Y = 105;
  const show = o.show || (() => true);
  let s = `<svg class="nl" viewBox="0 0 ${W} ${H}" role="img" aria-label="number line from ${min} to ${max}">`;
  // the line with arrow ends (number lines keep going!)
  s += `<line x1="8" y1="${Y}" x2="${W - 8}" y2="${Y}" stroke="#2b2250" stroke-width="5"/>`;
  s += `<polygon points="2,${Y} 18,${Y - 9} 18,${Y + 9}" fill="#2b2250"/><polygon points="${W - 2},${Y} ${W - 18},${Y - 9} ${W - 18},${Y + 9}" fill="#2b2250"/>`;
  // hops (arcs above the line)
  for (const [a, b] of o.hops || []) {
    const x1 = X(a), x2 = X(b), mid = (x1 + x2) / 2;
    const col = b > a ? '#2ec27e' : '#ff5964';
    s += `<path d="M${x1} ${Y - 6} Q${mid} ${Y - 62} ${x2} ${Y - 6}" fill="none" stroke="${col}" stroke-width="4" stroke-dasharray="7 5"/>`;
    s += `<polygon points="${x2},${Y - 6} ${x2 + (b > a ? -11 : 11)},${Y - 16} ${x2 + (b > a ? -2 : 2)},${Y - 19}" fill="${col}"/>`;
  }
  for (let v = min; v <= max; v++) {
    const x = X(v);
    const big = v % 5 === 0;
    const mark = o.marks && o.marks[v];
    if (mark) s += `<circle cx="${x}" cy="${Y + 42}" r="${step <= 44 ? 19 : 25}" fill="${mark}" opacity=".35"/>`;
    s += `<line x1="${x}" y1="${Y - (big ? 16 : 11)}" x2="${x}" y2="${Y + (big ? 16 : 11)}" stroke="#2b2250" stroke-width="${big ? 5 : 4}"/>`;
    if (o.boxAt === v) {
      s += `<rect x="${x - 22}" y="${Y + 22}" width="44" height="42" rx="8" fill="#fff3b0" stroke="#5b3fd1" stroke-width="4"/><text x="${x}" y="${Y + 53}" font-size="30" text-anchor="middle" font-weight="800" fill="#5b3fd1" font-family="Baloo 2, sans-serif">?</text>`;
    } else if (show(v)) {
      s += `<text x="${x}" y="${Y + 54}" font-size="${step <= 44 ? 26 : 32}" text-anchor="middle" font-weight="800" fill="#2b2250" font-family="Baloo 2, sans-serif">${v}</text>`;
    }
    if (o.arrowAt === v) s += `<polygon points="${x - 15},${Y - 48} ${x + 15},${Y - 48} ${x},${Y - 22}" fill="#ff5fa2"/>`;
    s += `<rect class="nl-hit" data-n="${v}" x="${x - step / 2}" y="0" width="${step}" height="${H}" fill="transparent"/>`;
  }
  if (o.frogAt !== undefined && o.frogAt !== null) s += `<text x="${X(o.frogAt)}" y="${Y - 24}" font-size="40" text-anchor="middle">🐸</text>`;
  return s + '</svg>';
}
