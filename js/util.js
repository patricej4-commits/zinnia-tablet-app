export const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
export const pick = arr => arr[Math.floor(Math.random() * arr.length)];
export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
export const sample = (arr, n) => shuffle(arr).slice(0, n);
export const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
export const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export const NUM_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];

// Number answer options near the answer
export function numOptions(answer, min = 0, max = 20, n = 4) {
  const set = new Set([answer]);
  let tries = 0;
  while (set.size < n && tries++ < 100) {
    const v = answer + rnd(-3, 3);
    if (v >= min && v <= max) set.add(v);
  }
  for (let v = min; set.size < n && v <= max; v++) set.add(v);
  return shuffle([...set]).map(v => ({ html: String(v), value: v, say: String(v) }));
}

// Text options from a list of strings
export const textOptions = (list, sayIt = true) => shuffle(list).map(t => ({ html: esc(t), value: t, say: sayIt ? t : undefined }));
