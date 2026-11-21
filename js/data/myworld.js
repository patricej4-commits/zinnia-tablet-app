// My World: Integrated Studies (from class slides), plus IT, Music and Spanish
// topics from the Christmas mid-term revision guide.
import { pick, shuffle, sample } from '../util.js';

// [question, right answer, wrong answers, explanation, picture]
const FACTS = {
  'w-body': [
    ['Which of these is an upper limb?', 'arm', ['leg', 'toes'], 'Upper limbs: arms, elbows, wrists, hands and fingers.', '💪'],
    ['Which of these is a lower limb?', 'leg', ['arm', 'fingers'], 'Lower limbs: legs, knees, ankles, feet and toes.', '🦵'],
    ['Where are your toes?', 'on your feet', ['on your hands', 'on your head'], 'Toes are on our feet. They are part of our lower limbs.', '🦶'],
    ['Where are your fingers?', 'on your hands', ['on your feet', 'on your knees'], 'Fingers are on our hands. They are part of our upper limbs.', '✋'],
    ['Why don\'t my old clothes fit me any more?', 'because I am growing', ['because they are wet', 'because they are blue'], 'I grow bigger every year. I am a living thing!', '📏'],
    ['Why do we need sleep?', 'to keep our bodies strong', ['to get hungry', 'to be sad'], 'Sleep keeps us strong. We learn better at school!', '😴'],
  ],
  'w-food': [
    ['Which meal helps us start the day?', 'breakfast', ['a late snack', 'sweets'], 'Breakfast gives us a good start to the day!', '🍳'],
    ['What happens when we eat the right foods?', 'we have energy', ['we feel sick', 'we stop growing'], 'Good food gives us energy to work and play!', '⚡'],
    ['Which one is a healthy food?', 'a banana', ['candy', 'soda'], 'Fruits are healthy. Pick healthy food!', '🍌'],
    ['Which one is a healthy food?', 'carrots', ['chips', 'cake'], 'Vegetables like carrots are healthy foods.', '🥕'],
    ['Which one is a healthy drink?', 'water', ['soda', 'syrup'], 'Water is the best drink for our bodies!', '💧'],
    ['What happens if we do not eat good foods?', 'we have no energy', ['we fly', 'we get taller'], 'Without good food, we feel tired and do not grow well.', '🥱'],
  ],
  'w-groups': [
    ['Which of these is a group we belong to?', 'our family', ['a chair', 'the moon'], 'We belong to groups: home, school and church.', '👨‍👩‍👧'],
    ['What do all groups have?', 'rules', ['wings', 'wheels'], 'All groups have rules that we have to follow.', '📜'],
    ['Why do we have rules?', 'to keep us safe', ['to make us sad', 'to waste time'], 'Rules keep us safe and keep things in order.', '🦺'],
    ['Where do we find rules?', 'at home, school and church', ['only at the beach', 'nowhere'], 'We have rules at home, at school, at church and on the road.', '🚦'],
    ['What is the main religious group in Jamaica?', 'Christianity', ['Islam', 'Buddhism'], 'The main religious group in Jamaica is Christianity.', '⛪'],
    ['People who follow Christianity are called...', 'Christians', ['Muslims', 'Jews'], 'People who follow Jesus are called Christians.', '✝️'],
    ['People who follow Islam are called...', 'Muslims', ['Christians', 'Jews'], 'People who follow Islam are called Muslims.', '🕌'],
    ['People who follow Judaism are called...', 'Jews', ['Christians', 'Muslims'], 'People who follow Judaism are called Jews.', '🕍'],
    ['Which of these is an ethnic group in Jamaica?', 'Chinese', ['Mangoes', 'Teachers'], 'Some groups of people in Jamaica are Africans, Chinese, Indians and Europeans.', '🌍'],
    ['A girl is...', 'female', ['male', 'a baby goat'], 'A girl is female. A boy is male.', '👧'],
    ['My surname is my...', 'last name', ['first name', 'nickname'], 'My first name is my Christian name. My last name is my surname.', '🏷️'],
  ],
  'w-habits': [
    ['Brushing my teeth every day is a...', 'good habit', ['bad habit'], 'Brushing our teeth keeps them clean and strong. Good habit!', '🪥'],
    ['Washing my hands before I eat is a...', 'good habit', ['bad habit'], 'Clean hands keep germs away. Good habit!', '🧼'],
    ['Telling lies is a...', 'bad habit', ['good habit'], 'Always try to tell the truth!', '🤥'],
    ['Eating lots and lots of sweets is a...', 'bad habit', ['good habit'], 'Too many sweets are bad for our teeth and bodies.', '🍭'],
    ['Going to bed on time is a...', 'good habit', ['bad habit'], 'Enough sleep keeps our bodies strong, and we learn better.', '🛏️'],
    ['Waiting my turn is a...', 'good habit', ['bad habit'], 'Waiting my turn is kind.', '⏳'],
    ['Saying "please" and "thank you" is a...', 'good habit', ['bad habit'], 'Good manners make everyone happy!', '🙏'],
    ['Pushing in the line is a...', 'bad habit', ['good habit'], 'Do to others as you want them to do to you.', '🚫'],
    ['When I feel angry, what should I do?', 'take a deep breath and calm down', ['hit someone', 'throw things'], 'It is okay to feel angry. But I must still be kind.', '😤'],
  ],
  'w-computer': [
    ['What is a computer?', 'an electronic device', ['a toy car', 'a kind of food'], 'A computer is a machine. It takes in, thinks, keeps and shows information.', '💻'],
    ['Which part of the computer do we type on?', 'keyboard', ['mouse', 'screen'], 'We type letters and numbers on the keyboard.', '⌨️'],
    ['Which part of the computer shows us pictures and words?', 'screen', ['keyboard', 'mouse'], 'The screen shows information. It is an output device.', '🖥️'],
    ['Which part do we point and click with?', 'mouse', ['screen', 'system unit'], 'We point and click with the mouse. It is an input device.', '🖱️'],
    ['Which part of the computer thinks?', 'system unit', ['mouse', 'keyboard'], 'The system unit processes. That means it thinks!', '🧠'],
    ['The keyboard is an...', 'input device', ['output device'], 'Input puts information in. Keyboard and mouse are input.', '⌨️'],
    ['The mouse is an...', 'input device', ['output device'], 'The mouse puts information inside the computer, so it is input.', '🖱️'],
    ['The screen is an...', 'output device', ['input device'], 'The screen shows information, so it is output.', '🖥️'],
    ['What does the system unit do?', 'process (it thinks)', ['input', 'output'], 'The system unit processes. That means it thinks!', '🧠'],
    ['Which one is a TYPE of computer?', 'tablet', ['mouse', 'keyboard'], 'Types: laptop, tablet, desktop, smartphone. A mouse is a PART.', '📱'],
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
