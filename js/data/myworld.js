// My World: Integrated Studies (from class slides), plus IT, Music and Spanish
// topics from the Christmas mid-term revision guide.
import { pick, shuffle, sample } from '../util.js';

// [question, right answer, wrong answers, explanation, picture]
const FACTS = {
  'w-body': [
    ['Which of these is an upper limb?', 'arm', ['leg', 'toes'], 'Our upper limbs are our arms, elbows, wrists, palms, shoulders and fingers.', '💪'],
    ['Which of these is a lower limb?', 'leg', ['arm', 'fingers'], 'Our lower limbs are our legs, knees, feet, thighs, ankles and toes.', '🦵'],
    ['Where are your toes?', 'on your feet', ['on your hands', 'on your head'], 'Toes are on our feet. They are part of our lower limbs.', '🦶'],
    ['Where are your fingers?', 'on your hands', ['on your feet', 'on your knees'], 'Fingers are on our hands. They are part of our upper limbs.', '✋'],
    ['Why don\'t my old clothes fit me any more?', 'because I am growing', ['because they are wet', 'because they are blue'], 'As days, weeks, months and years go by, I grow and get bigger, because I am a living thing!', '📏'],
    ['Why do we need enough sleep and rest?', 'to keep our bodies strong', ['to get hungry', 'to grow sad'], 'Rest keeps our bodies strong and healthy, and we learn better at school!', '😴'],
  ],
  'w-food': [
    ['Which meal is one of the most important meals of the day?', 'breakfast', ['a midnight snack', 'sweets'], 'Breakfast helps us get off to a good start for the day!', '🍳'],
    ['What happens when we eat the right foods?', 'we have energy', ['we feel sick', 'we stop growing'], 'When we eat the right foods we have energy, and we work and play better.', '⚡'],
    ['Which one is a healthy food?', 'a banana', ['candy', 'soda'], 'Fruits like bananas are healthy. We must try to pick healthy foods all the time.', '🍌'],
    ['Which one is a healthy food?', 'carrots', ['chips', 'cake'], 'Vegetables like carrots are healthy foods.', '🥕'],
    ['Which one is a healthy drink?', 'water', ['soda', 'syrup'], 'Water is the best drink for our bodies!', '💧'],
    ['What happens if we do not eat good foods?', 'we have no energy', ['we fly', 'we get taller'], 'When we do not eat good foods, we have no energy and cannot grow properly.', '🥱'],
  ],
  'w-groups': [
    ['Which of these is a group we belong to?', 'our family', ['a chair', 'the moon'], 'We all belong to groups: home, school, church, clubs and work.', '👨‍👩‍👧'],
    ['What do all groups have?', 'rules', ['wings', 'wheels'], 'All groups have rules that we have to follow.', '📜'],
    ['Why do we have rules?', 'to keep us safe', ['to make us sad', 'to waste time'], 'Rules keep us safe and keep things in order.', '🦺'],
    ['Where do we find rules?', 'everywhere: home, school, church and on the road', ['only at the beach', 'nowhere'], 'Rules are at home, at school, at church, at clubs, at stores and on the road.', '🚦'],
    ['What is the main religious group in Jamaica?', 'Christianity', ['Islam', 'Buddhism'], 'The main religious group in Jamaica is Christianity.', '⛪'],
    ['People who follow Christianity are called...', 'Christians', ['Muslims', 'Jews'], 'Christianity → Christians. Islam → Muslims. Judaism → Jews. Rastafarianism → Rastafarians.', '✝️'],
    ['People who follow Islam are called...', 'Muslims', ['Christians', 'Jews'], 'People who follow Islam are called Muslims.', '🕌'],
    ['People who follow Judaism are called...', 'Jews', ['Christians', 'Muslims'], 'People who follow Judaism are called Jews.', '🕍'],
    ['Which of these is an ethnic group in Jamaica?', 'Chinese', ['Mangoes', 'Teachers'], 'Ethnic groups in Jamaica include Africans, Chinese, Indians, Europeans and Japanese.', '🌍'],
    ['A girl is...', 'female', ['male', 'a baby goat'], 'Gender tells if I am a boy or a girl. A girl is female. A boy is male.', '👧'],
    ['My surname is my...', 'last name', ['first name', 'nickname'], 'We have a first name, called a Christian name, and a last name, called a surname.', '🏷️'],
  ],
  'w-habits': [
    ['Brushing my teeth every day is a...', 'good habit', ['bad habit'], 'Brushing our teeth keeps them clean and strong. Good habit!', '🪥'],
    ['Washing my hands before I eat is a...', 'good habit', ['bad habit'], 'Clean hands keep germs away. Good habit!', '🧼'],
    ['Telling lies is a...', 'bad habit', ['good habit'], 'Always try to tell the truth!', '🤥'],
    ['Eating lots and lots of sweets is a...', 'bad habit', ['good habit'], 'Too many sweets are bad for our teeth and bodies.', '🍭'],
    ['Going to bed on time is a...', 'good habit', ['bad habit'], 'Enough sleep keeps our bodies strong, and we learn better.', '🛏️'],
    ['Waiting my turn is a...', 'good habit', ['bad habit'], 'Waiting our turn shows self control and respect.', '⏳'],
    ['Saying "please" and "thank you" is a...', 'good habit', ['bad habit'], 'Good manners make everyone happy!', '🙏'],
    ['Pushing in the line is a...', 'bad habit', ['good habit'], 'We should wait our turn. Do to others as you would like them to do to you.', '🚫'],
    ['When I feel angry, what should I do?', 'take a deep breath and calm down', ['hit someone', 'throw things'], 'It is okay to be angry, but how I behave matters.', '😤'],
  ],
  'w-computer': [
    ['What is a computer?', 'an electronic device', ['a toy car', 'a kind of food'], 'A computer is an electronic device that can input, process, store and output information.', '💻'],
    ['Which part of the computer do we type on?', 'keyboard', ['mouse', 'screen'], 'We type letters and numbers on the keyboard.', '⌨️'],
    ['Which part of the computer shows us pictures and words?', 'screen', ['keyboard', 'mouse'], 'The screen shows information. It is an output device.', '🖥️'],
    ['Which part do we point and click with?', 'mouse', ['screen', 'system unit'], 'We point and click with the mouse. It is an input device.', '🖱️'],
    ['Which part of the computer thinks?', 'system unit', ['mouse', 'keyboard'], 'The system unit processes. That means it thinks!', '🧠'],
    ['The keyboard is an...', 'input device', ['output device'], 'An input device puts information inside the computer. Keyboard and mouse are input.', '⌨️'],
    ['The mouse is an...', 'input device', ['output device'], 'The mouse puts information inside the computer, so it is input.', '🖱️'],
    ['The screen is an...', 'output device', ['input device'], 'The screen shows information, so it is output.', '🖥️'],
    ['What does the system unit do?', 'process (it thinks)', ['input', 'output'], 'The system unit processes. That means it thinks!', '🧠'],
    ['Which one is a TYPE of computer?', 'tablet', ['mouse', 'keyboard'], 'The four types of computer are: laptop, tablet, desktop and smartphone. Mouse and keyboard are PARTS.', '📱'],
    ['Which one is a TYPE of computer?', 'laptop', ['screen', 'mouse'], 'The four types of computer are: laptop, tablet, desktop and smartphone.', '💻'],
    ['Which one is a PART of the computer?', 'keyboard', ['smartphone', 'laptop'], 'The four parts are: screen, keyboard, mouse and system unit.', '⌨️'],
    ['A smartphone is a...', 'type of computer', ['part of a computer'], 'A smartphone is one of the four types of computer: laptop, tablet, desktop, smartphone.', '📱'],
  ],
  'w-music': [
    ['The treble clef is also called the...', 'G clef', ['F clef', 'stave'], 'The treble clef is also called the G clef.', '🎼'],
    ['The bass clef is also called the...', 'F clef', ['G clef', 'staff'], 'The bass clef is also called the F clef.', '🎵'],
    ['Another name for the staff is the...', 'stave', ['clef', 'drum'], 'The staff is also called the stave.', '🎶'],
    ['How many lines are on the staff?', '5', ['3', '10'], 'The staff has 5 lines and 4 spaces.', '🎼'],
    ['How many spaces are on the staff?', '4', ['5', '2'], 'The staff has 5 lines and 4 spaces between them.', '🎼'],
  ],
  'w-spanish': [
    ['How do you say "good morning" in Spanish?', 'Buenos días', ['Buenas noches', 'Buenas tardes'], 'Good morning is Buenos días!', '🌅'],
    ['How do you say "good afternoon" in Spanish?', 'Buenas tardes', ['Buenos días', 'Buenas noches'], 'Good afternoon is Buenas tardes!', '🌤️'],
    ['How do you say "good night" in Spanish?', 'Buenas noches', ['Buenos días', 'Buenas tardes'], 'Good night is Buenas noches!', '🌙'],
    ['What does "Hola" mean?', 'Hello', ['Goodbye', 'Thank you'], 'Hola means hello!', '👋'],
    ['How do you say "My name is Zinnia" in Spanish?', 'Me llamo Zinnia', ['Buenas noches Zinnia', 'Adiós Zinnia'], 'Me llamo means my name is. Me llamo Zinnia!', '🙋‍♀️'],
  ],
};

const META = {
  'w-body': ['My body', '🧍‍♀️'], 'w-food': ['Healthy food', '🥗'], 'w-groups': ['Groups & rules', '👨‍👩‍👧‍👦'],
  'w-habits': ['Good & bad habits', '🌟'], 'w-computer': ['Computers', '💻'], 'w-music': ['Music symbols', '🎼'], 'w-spanish': ['Spanish', '🇪🇸'],
};

export const worldSkills = Object.keys(FACTS).map(id => ({
  id, name: META[id][0], emoji: META[id][1],
  gen(l) {
    const [q, a, wrong, ex, pic] = pick(FACTS[id]);
    return {
      say: q, readFirst: l === 3,
      visual: pic ? `<div style="font-size:100px">${pic}</div>` : '',
      options: shuffle([a, ...wrong]).map(x => ({ html: `<span class="lbl">${x}</span>`, value: x, say: x })),
      cols: wrong.length === 1 ? 'two' : '', answer: a, explain: ex,
    };
  },
}));
