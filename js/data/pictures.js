// Picture dictionary: word -> emoji (works offline, no image files needed)
export const PICS = {
  cat: '🐱', dog: '🐶', pig: '🐷', hen: '🐔', fox: '🦊', cow: '🐮', goat: '🐐', duck: '🦆', fish: '🐟', frog: '🐸',
  bird: '🐦', owl: '🦉', bee: '🐝', bug: '🐛', ant: '🐜', crab: '🦀', snake: '🐍', snail: '🐌', shark: '🦈', whale: '🐳',
  turtle: '🐢', mouse: '🐭', sheep: '🐑', horse: '🐴', lion: '🦁', tiger: '🐯', bear: '🐻', rabbit: '🐰', elephant: '🐘', monkey: '🐒',
  octopus: '🐙', chick: '🐥', worm: '🪱', bat: '🦇', egg: '🥚', apple: '🍎', orange: '🍊', banana: '🍌', mango: '🥭', grapes: '🍇',
  cake: '🎂', cupcake: '🧁', pancake: '🥞', cookie: '🍪', bread: '🍞', cheese: '🧀', milk: '🥛', corn: '🌽', carrot: '🥕', chips: '🍟',
  sun: '☀️', moon: '🌙', star: '⭐', stars: '✨', cloud: '☁️', rain: '🌧️', rainbow: '🌈', snow: '❄️', tree: '🌳', flower: '🌸',
  sunflower: '🌻', leaf: '🍃', rock: '🪨', shell: '🐚', house: '🏠', school: '🏫', church: '⛪', car: '🚗', bus: '🚌', truck: '🚚',
  train: '🚆', plane: '✈️', ship: '🚢', boat: '⛵', bike: '🚲', ball: '⚽', kite: '🪁', doll: '🪆', drum: '🥁', bell: '🔔',
  book: '📖', pen: '🖊️', pencil: '✏️', bag: '👜', hat: '🎩', cap: '🧢', dress: '👗', shoe: '👟', sock: '🧦', ring: '💍',
  clock: '🕰️', key: '🔑', lock: '🔒', box: '📦', cup: '☕', spoon: '🥄', fork: '🍴', bed: '🛏️', chair: '🪑', door: '🚪',
  tent: '⛺', bath: '🛁', brush: '🪥', comb: '🪮', glove: '🧤', crown: '👑', coin: '🪙', gift: '🎁', flag: '🚩', glue: '🧴',
  hand: '✋', foot: '🦶', eye: '👁️', ear: '👂', nose: '👃', tooth: '🦷', baby: '👶', girl: '👧', boy: '👦', queen: '👸',
  king: '🤴', man: '👨', clown: '🤡', ghost: '👻', robot: '🤖', web: '🕸️', net: '🥅', jet: '🛩️', van: '🚐', fan: '🪭',
  map: '🗺️', mop: '🧹', pot: '🍲', jam: '🍯', nut: '🥜', ten: '🔟', six: '6️⃣', three: '3️⃣', sock2: '🧦', fire: '🔥',
  night: '🌃', light: '💡', snowman: '⛄', jellyfish: '🪼', butterfly: '🦋', ladybug: '🐞', football: '🏈', toothbrush: '🪥', goldfish: '🐠', dragonfly: '🪰',
  sheep2: '🐑', smile: '😃', swim: '🏊', run: '🏃', sleep: '😴', eat: '😋', jump: '🤸', sing: '🎤', read: '📚', cry: '😢',
  dance: '💃', cook: '🧑‍🍳', write: '✍️', ride: '🚴', wave: '👋', skate: '⛸️', drink: '🥤', clap: '👏', sweep: '🧹', wash: '🧼',
  spoon2: '🥄', broom: '🧹', frost: '🥶', smoke: '💨', swing: '🎠', skunk: '🦨', storm: '⛈️', grass: '🌱', igloo: '🏠', umbrella: '☂️',
  ice: '🧊', plant: '🪴', block: '🧱', plug: '🔌', flute: '🪈', crown2: '👑', bowl: '🥣', boot: '👢', moon2: '🌕', pool: '🏊',
  hook: '🪝', wood: '🪵', girl2: '👧', nurse: '🧑‍⚕️', burger: '🍔', circle: '⭕', spider: '🕷️', finger: '👆', oil: '🛢️', toy: '🧸',
  cherry: '🍒', chain: '⛓️', shoes: '👞', sheep3: '🐑', farm: '🚜', barn: '🛖', scarf: '🧣', thread: '🧵', throne: '🪑', church2: '⛪',
  pie: '🥧', fries: '🍟', walk: '🚶', chalk: '🖍️', talk: '🗣️', squirrel: '🐿️', swan: '🦢', skull: '💀', sled: '🛷', desk: '🖥️',
  milk2: '🥛', rake: '🧹', lake: '🏞️', neck: '🦒', sack: '🎒', mug: '☕', pin: '📌', ink: '🖋️', mat: '🟫', gate: '🚧',
  cave: '🕳️', bone: '🦴', rope: '🪢', cone: '🍦', nest: '🪺', lamp: '🪔', hill: '⛰️', bus2: '🚌', dish: '🍽️', watch: '⌚',
  peach: '🍑', fox2: '🦊', glass: '🥛', sandwich: '🥪', coconut: '🥥', pineapple: '🍍', ackee: '🍳', patty: '🥟',
};
// Remove duplicates, ambiguous pictures, and very new emoji older tablets can't show
const DROP = ['igloo', 'ackee', 'patty', 'rake', 'mop', 'broom', 'desk', 'barn', 'mat', 'gate', 'cave', 'throne', 'lamp', 'frost',
  'smoke', 'glass', 'toothbrush', 'pool', 'fries', 'mug', 'glue', 'flute', 'jellyfish', 'comb', 'fan', 'dragonfly', 'sweep', 'nest',
  'dish', 'spoon', 'nurse', 'oil', 'chain', 'shoes', 'farm', 'circle', 'wood', 'boot', 'thread', 'ink', 'pin', 'church', 'skull', 'cook'];
// Pictures that are fine as a hint next to a written word (but too ambiguous for "find the picture")
const HINT_OK = ['broom', 'nest', 'spoon', 'nurse', 'oil', 'chain', 'shoes', 'farm', 'circle', 'wood', 'boot', 'thread', 'ink', 'pin', 'church', 'skull', 'cook', 'glass', 'mug', 'fries', 'pool', 'smoke'];
const HINTS = {};
for (const k of HINT_OK) HINTS[k] = PICS[k];
for (const k of Object.keys(PICS)) if (/\d$/.test(k) || DROP.includes(k)) delete PICS[k];
export const hasPic = w => !!(PICS[w] || HINTS[w]);
export const picOf = w => PICS[w] || HINTS[w] || '';
