// My World: Integrated Studies (from class slides), plus IT and Music
// topics from the Christmas mid-term revision guide.
import { pick, shuffle, sample } from '../util.js';

// A music staff: 5 lines with 4 spaces between them
const STAFF = '<svg viewBox="0 0 200 100" width="220">' + [10, 30, 50, 70, 90].map(y => `<line x1="5" y1="${y}" x2="195" y2="${y}" stroke="#2b2250" stroke-width="4"/>`).join('') + '</svg>';

// [question, right answer (or a list of right answers, one is used), wrong answers, explanation, picture]
const FACTS = {
  'w-body': [
    ['Which of these is an upper limb?', 'arm', ['leg', 'toes'], 'Upper limbs: arms, elbows, wrists, hands and fingers.', '🧍'],
    ['Which of these is a lower limb?', 'leg', ['arm', 'fingers'], 'Lower limbs: legs, knees, ankles, feet and toes.', '🧍'],
    ['Where are your toes?', 'on your feet', ['on your hands', 'on your head'], 'Toes are on our feet. They are part of our lower limbs.', ''],
    ['Where are your fingers?', 'on your hands', ['on your feet', 'on your knees'], 'Fingers are on our hands. They are part of our upper limbs.', ''],
    ['Why don\'t my old clothes fit me any more?', 'because I am growing', ['because they are wet', 'because they are blue'], 'I grow bigger every year. I am a living thing!', '📏'],
    ['Why do we need sleep?', 'to keep our bodies strong', ['to get hungry', 'to be sad'], 'Sleep keeps us strong. We learn better at school!', '😴'],
  ],
  'w-food': [
    ['Which meal helps us start the day?', 'breakfast', ['lunch', 'dinner'], 'Breakfast is the first meal of the day. It gives us energy to start the day! Lunch and dinner come later.', '🌅'],
    ['What happens when we eat the right foods?', 'we have energy', ['we feel sick', 'we stop growing'], 'Good food gives us energy to work and play!', '⚡'],
    ['Which one is a healthy food?', 'a banana', ['candy', 'soda'], 'Fruits are healthy. Pick healthy food!', ''],
    ['Which one is a healthy food?', 'carrots', ['chips', 'cake'], 'Vegetables like carrots are healthy foods.', ''],
    ['Which one is a healthy drink?', 'water', ['soda', 'syrup'], 'Water is the best drink for our bodies!', ''],
    ['What happens if we do not eat good foods?', 'we have no energy', ['we fly', 'we get taller'], 'Without good food, we feel tired and do not grow well.', '🥱'],
  ],
  'w-groups': [
    ['Which of these is a group we belong to?', 'our family', ['a chair', 'the moon'], 'Our family is a group we belong to. We also belong to groups at school and at church.', '👨‍👩‍👧'],
    ['What do all groups have?', 'rules', ['wings', 'wheels'], 'All groups have rules that we have to follow.', '📜'],
    ['Why do we have rules?', 'to keep us safe', ['to make us sad', 'to waste time'], 'Rules keep us safe and keep things in order.', '🦺'],
    ['Where do we find rules?', 'at home, school and church', ['only at the beach', 'nowhere'], 'We have rules at home, at school, at church and on the road.', '🚦'],
    ['What is the main religion in Jamaica?', 'Christianity', ['Islam', 'Buddhism'], 'Most people in Jamaica are Christians. The main religion in Jamaica is Christianity.', '⛪'],
    ['People who follow Christianity are called...', 'Christians', ['Muslims', 'Jews'], 'People who follow Jesus are called Christians.', '✝️'],
    ['People who follow Islam are called...', 'Muslims', ['Christians', 'Jews'], 'People who follow Islam are called Muslims.', '🕌'],
    ['People who follow Judaism are called...', 'Jews', ['Christians', 'Muslims'], 'People who follow Judaism are called Jews.', '🕍'],
    ['Many people came from other lands to live in Jamaica. Which group came from another land?', ['Africans', 'Indians', 'Chinese', 'Europeans'], ['Teachers', 'Neighbours'], 'Africans, Indians, Chinese and Europeans came from other lands to live in Jamaica. Out of many, one people!', '🇯🇲'],
    ['Is a girl male or female?', 'female', ['male'], 'A girl is female. A boy is male.', '👧'],
    ['My surname is my...', 'last name', ['first name', 'nickname'], 'My first name is my given name. My last name is my surname.', '🏷️'],
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
    ['Which part of the computer do we type on?', 'keyboard', ['mouse', 'monitor (screen)'], 'We type letters and numbers on the keyboard.', ''],
    ['Which part of the computer shows us pictures and words?', 'monitor (screen)', ['keyboard', 'mouse'], 'The monitor (screen) shows information. It is an output device.', ''],
    ['Which part do we point and click with?', 'mouse', ['monitor (screen)', 'system unit'], 'We point and click with the mouse. It is an input device.', ''],
    ['Which part of the computer thinks?', 'system unit', ['mouse', 'keyboard'], 'The system unit processes. That means it thinks!', '🖥️'],
    ['The keyboard is an...', 'input device', ['output device'], 'Input puts information in. Keyboard and mouse are input.', '⌨️'],
    ['The mouse is an...', 'input device', ['output device'], 'The mouse puts information inside the computer, so it is input.', '🖱️'],
    ['The monitor is an...', 'output device', ['input device'], 'The monitor shows information, so it is output.', '🖥️'],
    ['What does the system unit do?', 'process (it thinks)', ['input', 'output'], 'The system unit processes. That means it thinks!', '🗄️'],
    ['Which one is a TYPE of computer?', 'tablet', ['mouse', 'keyboard'], 'Types: laptop, tablet, desktop, smartphone. A mouse is a PART.', ''],
    ['Which one is a TYPE of computer?', 'laptop', ['monitor (screen)', 'mouse'], 'The four types of computer are: laptop, tablet, desktop and smartphone.', ''],
    ['Which one is a PART of the computer?', 'keyboard', ['smartphone', 'laptop'], 'The four parts are: monitor, keyboard, mouse and system unit.', ''],
    ['A smartphone is a...', 'type of computer', ['part of a computer'], 'A smartphone is one of the four types of computer: laptop, tablet, desktop, smartphone.', '📱'],
  ],
  'w-music': [
    ['The treble clef is also called the...', 'G clef', ['F clef', 'stave'], 'The treble clef is also called the G clef.', '🎼'],
    ['The bass clef is also called the...', 'F clef', ['G clef', 'staff'], 'The bass clef is also called the F clef.', ''],
    ['Another name for the staff is the...', 'stave', ['clef', 'drum'], 'The staff is also called the stave.', '🎶'],
    ['Count the lines on the staff. How many lines are there?', '5', ['3', '10'], 'The staff has 5 lines and 4 spaces.', STAFF],
    ['Count the spaces between the lines on the staff. How many spaces are there?', '4', ['5', '2'], 'The staff has 5 lines and 4 spaces between them.', STAFF],
  ],
};

// Name the action: a sentence to finish, or a question to answer, then "Tap ..."
const ask = q => (q.endsWith('...') ? `${q} Tap the answer that finishes the sentence.` : `${q} Tap the answer.`);

const META = {
  'w-body': ['My body', '🧍‍♀️'], 'w-food': ['Healthy food', '🥗'], 'w-groups': ['Groups & rules', '👨‍👩‍👧‍👦'],
  'w-habits': ['Good & bad habits', '🌟'], 'w-computer': ['Computers', '💻'], 'w-music': ['Music notes & symbols', '🎼'],
};


// ===== Added from the Christmas term revision guide =====
const WHOLE = '<svg viewBox="0 0 60 90" width="70"><ellipse cx="30" cy="70" rx="16" ry="11" fill="none" stroke="#2b2250" stroke-width="5" transform="rotate(-20 30 70)"/></svg>', HALF = '<svg viewBox="0 0 60 90" width="70"><ellipse cx="26" cy="72" rx="14" ry="10" fill="none" stroke="#2b2250" stroke-width="5" transform="rotate(-20 26 72)"/><line x1="39" y1="70" x2="39" y2="8" stroke="#2b2250" stroke-width="5"/></svg>', QUARTER = '<svg viewBox="0 0 60 90" width="70"><ellipse cx="26" cy="72" rx="14" ry="10" fill="#2b2250" transform="rotate(-20 26 72)"/><line x1="39" y1="70" x2="39" y2="8" stroke="#2b2250" stroke-width="5"/></svg>';
Object.assign(FACTS, {
  'w-senses': [
    ['How many senses do we have?', '5', ['3', '10'], 'We have 5 senses: sight, hearing, smell, taste and touch.', '🖐️'],
    ['Which sense organ helps us see?', 'eyes', ['ears', 'nose'], 'We see with our eyes. Seeing is the sense of sight.', '🌈'],
    ['Which sense organ helps us hear?', 'ears', ['eyes', 'tongue'], 'We hear with our ears.', '🔔'],
    ['Which sense organ helps us smell?', 'nose', ['ears', 'skin'], 'We smell with our nose.', '🌺'],
    ['Which sense organ helps us taste?', 'tongue', ['nose', 'eyes'], 'We taste with our tongue.', '🍋'],
    ['Which sense organ helps us feel and touch?', 'skin', ['ears', 'eyes'], 'We feel with our skin. Touch is a sense.', '🧸'],
    ['How can we protect our eyes?', 'do not look at the sun', ['rub them hard', 'poke them'], 'Never look at the sun. Do not rub or poke your eyes.', '😎'],
    ['How can we protect our ears?', 'do not put things in them', ['shout in them', 'put pencils in them'], 'Never put things in your ears, and stay away from very loud noise.', '👂'],
    ['How can we protect our skin?', 'keep it clean', ['play with fire', 'never bathe'], 'Bathe every day, keep it clean, and stay safe from hot things.', '🧼'],
    ['A flower smells sweet. Which sense do we use?', 'smell', ['hearing', 'sight'], 'We use our nose to smell. That is the sense of smell.', '🌺'],
    ['A drum is loud. Which sense do we use?', 'hearing', ['taste', 'smell'], 'We use our ears to hear the drum.', '🥁'],
  ],
  'w-plants': [
    ['Which part of the plant holds it in the soil?', 'roots', ['leaves', 'flower'], 'The roots hold the plant in the soil and take in water.', '🌱'],
    ['Which part of the plant holds it up?', 'stem', ['roots', 'seeds'], 'The stem holds the plant up and carries water to the leaves.', '🌿'],
    ['Which part makes food for the plant?', 'leaves', ['roots', 'stem'], 'The leaves use sunlight to make food for the plant.', '☀️'],
    ['Which part makes the seeds?', 'flower', ['roots', 'stem'], 'The flower makes seeds. Seeds grow into new plants.', ''],
    ['What does a seed grow into?', 'a new plant', ['a rock', 'a bird'], 'A seed grows into a new plant.', '🌰'],
    ['What do plants need to grow?', 'water, sunlight, air and soil', ['candy and juice', 'toys'], 'Plants need water, sunlight, air and soil to grow.', '☀️'],
    ['What comes first in a plant life cycle?', 'seed', ['flower', 'fruit'], 'Seed, then seedling, then young plant, then adult plant with flowers and seeds.', ''],
    ['A baby plant is called a...', 'seedling', ['puppy', 'calf'], 'A baby plant is a seedling.', '🌱'],
    ['Why are plants important?', 'they give us food and air', ['they are noisy', 'they bite'], 'Plants give us food, fresh air, shade, and homes for animals.', '🌳'],
  ],
  'w-family': [
    ['Who was the first family?', 'Adam and Eve', ['Noah and his sons', 'Moses and his sister'], 'God made the first family: Adam and Eve.', '👫'],
    ['A family with a mother, father and children is a...', 'nuclear family', ['extended family', 'school family'], 'Mother, father and children make a nuclear family.', '👨‍👩‍👧'],
    ['A family with grandparents, aunts and cousins too is called...', 'extended family', ['nuclear family', 'single-parent family'], 'When grandparents, aunts, uncles and cousins are included, it is an extended family.', '👵'],
    ['A family with one parent and children is a...', 'single-parent family', ['extended family', 'nuclear family'], 'One parent with children is a single-parent family.', '👩‍👧'],
    ['What are the basic needs of a family?', 'food, clothing and shelter', ['toys, games and TV', 'sweets and soda'], 'Every family needs food, clothing and shelter (a home), and love!', '🏠'],
    ['What does a family tree show?', 'the people in my family', ['the trees in my yard', 'my toys'], 'A family tree shows the people in my family.', '🌳'],
    ['My mother\'s mother is my...', 'grandmother', ['sister', 'aunt'], 'My mother\'s mother is my grandmother.', ''],
    ['My father\'s brother is my...', 'uncle', ['cousin', 'grandfather'], 'My father\'s brother is my uncle.', '👨'],
    ['Which one is a NEED?', 'food', ['a toy', 'a video game'], 'Needs are things we must have to live: food, clothing and shelter. Wants are nice to have.', '🍲'],
    ['Which one is a WANT?', 'a new toy', ['water', 'a home'], 'A toy is a want. We can live without it. Food, clothes and a home are needs.', '🧸'],
    ['A home is also called...', 'shelter', ['clothing', 'food'], 'Shelter is a home that keeps us safe. It is a basic need.', '🏠'],
  ],
  'w-animals': [
    ['Does a chick hatch or is it born?', 'hatch', ['born'], 'A chick hatches from an egg.', '🐣'],
    ['Does a puppy hatch or is it born?', 'born', ['hatch'], 'A puppy is born. It grows inside its mother.', '🐶'],
    ['Does a turtle hatch or is it born?', 'hatch', ['born'], 'Baby turtles hatch from eggs.', '🐢'],
    ['Does a calf hatch or is it born?', 'born', ['hatch'], 'A calf is born.', '🐮'],
    ['Does a duckling hatch or is it born?', 'hatch', ['born'], 'A duckling hatches from an egg.', '🦆'],
    ['Does a kitten hatch or is it born?', 'born', ['hatch'], 'A kitten is born.', '🐱'],
    ['A baby dog is called a...', 'puppy', ['kitten', 'calf'], 'A baby dog is a puppy.', '🐶'],
    ['A baby cat is called a...', 'kitten', ['puppy', 'chick'], 'A baby cat is a kitten.', '🐱'],
    ['A baby cow is called a...', 'calf', ['foal', 'kid'], 'A baby cow is a calf.', '🐮'],
    ['A baby goat is called a...', 'kid', ['lamb', 'calf'], 'A baby goat is a kid.', '🐐'],
    ['A baby sheep is called a...', 'lamb', ['kid', 'puppy'], 'A baby sheep is a lamb.', '🐑'],
    ['A baby horse is called a...', 'foal', ['calf', 'chick'], 'A baby horse is a foal.', '🐴'],
    ['A baby chicken is called a...', 'chick', ['duckling', 'kitten'], 'A baby chicken is a chick.', '🐔'],
    ['A baby frog is called a...', 'tadpole', ['puppy', 'foal'], 'A baby frog is a tadpole.', '🐸'],
    ['A baby pig is called a...', 'piglet', ['kitten', 'lamb'], 'A baby pig is a piglet.', '🐷'],
  ],
  'w-foodmore': [
    ['Green light foods mean...', 'healthy: we can eat them every day', ['never eat them', 'only at parties'], 'Green light foods are healthy. We can eat them every day. They should be at least half of our plate.', '🟢'],
    ['Yellow light foods mean...', 'slow down: eat small portions', ['eat lots and lots', 'never eat them'], 'Yellow light foods: slow down and eat small portions.', '🟡'],
    ['Red light foods mean...', 'stop: a treat once in a while', ['eat every day', 'the best foods'], 'Red light foods are unhealthy. Stop! Eat them once in a while as a treat, not every day.', '🔴'],
    ['Go foods give us...', 'energy', ['shiny hair', 'strong teeth'], 'Go foods give us energy. Rice, bread, yam and potatoes are Go foods.', '🍚'],
    ['Glow foods give us...', 'vitamins and minerals', ['energy only', 'nothing'], 'Glow foods are fruits and vegetables, like bananas, carrots, apples and cabbage. They give us vitamins and minerals that keep us healthy.', '🥕'],
    ['Grow foods give us...', 'protein', ['candy', 'sugar'], 'Grow foods give us protein. Protein helps our bodies grow and builds strong muscles. Meat, fish, eggs, beans and milk are Grow foods. Milk also builds strong bones and teeth.', '🥚'],
    ['Rice is a...', 'Go food', ['Grow food', 'Glow food'], 'Rice gives us energy, so it is a Go food.', '🍚'],
    ['Eggs are a...', 'Grow food', ['Go food', 'Glow food'], 'Eggs give us protein to help our bodies grow, so they are a Grow food.', '🥚'],
    ['Carrots are a...', 'Glow food', ['Go food', 'Grow food'], 'Carrots are a vegetable. They give us vitamins, so they are a Glow food.', '🥕'],
    ['Fish is a...', 'Grow food', ['Go food', 'Glow food'], 'Fish gives us protein, so it is a Grow food.', '🐟'],
    ['Bread is a...', 'Go food', ['Grow food', 'Glow food'], 'Bread gives us energy, so it is a Go food.', '🍞'],
    ['Bananas are a...', 'Glow food', ['Grow food', 'Go food'], 'Bananas are a fruit. They give us vitamins, so they are a Glow food.', '🍌'],
    ['Which is a green light food?', 'a mango', ['candy', 'soda'], 'Fruits and vegetables are green light foods. We can eat them every day.', '🟢'],
    ['Which is a red light food?', 'candy', ['carrots', 'water'], 'Candy is a red light food. It is a treat only once in a while.', '🔴'],
    ['Which part of the carrot do we eat?', 'root', ['leaf', 'flower'], 'We eat the root of the carrot.', '🥕'],
    ['Which part of the sugar cane do we eat?', 'stem', ['root', 'flower'], 'We eat the stem of the sugar cane.', ''],
    ['Which part of callaloo do we eat?', 'leaves', ['roots', 'seeds'], 'We eat the leaves of callaloo and cabbage.', '🥬'],
    ['Which part of the mango tree do we eat?', 'fruit', ['root', 'stem'], 'We eat the fruit of the mango tree.', '🥭'],
    ['Which part of the plant are peas and beans?', 'seeds', ['leaves', 'roots'], 'Peas and beans are seeds.', '🫘'],
    ['Which part of broccoli do we eat?', 'flower', ['root', 'seeds'], 'We eat the flower of broccoli.', '🥦'],
    ['Who grows vegetables for us?', 'farmer', ['baker', 'fisherman'], 'Farmers grow fruits and vegetables. They are food providers.', '🥕'],
    ['Who catches fish for us?', 'fisherman', ['farmer', 'baker'], 'Fishermen catch fish. They are food providers.', '🎣'],
    ['Who bakes bread for us?', 'baker', ['farmer', 'fisherman'], 'Bakers bake bread and cakes. They are food providers.', '🍞'],
    ['What are food providers?', 'people who grow, sell or produce our food', ['people who eat our food', 'people who throw food away'], 'Food providers grow, sell or produce the food we eat.', '🧺'],
    ['Who gives us meat like beef, pork and chicken?', 'butcher', ['baker', 'fisherman'], 'The butcher gets meat from the animals that the farmer raises.', '🥩'],
    ['Who plants food and raises animals?', 'farmer', ['butcher', 'baker'], 'The farmer plants food or raises animals and sells them to others.', '🐄'],
    ['Who buys food and sells it at the market?', 'vendor', ['fisherman', 'farmer'], 'The vendor buys food from the farmer, baker, butcher and fisherman and sells it.', '🛒'],
    ['Where can we buy lots of different foods?', 'supermarket', ['library', 'church'], 'The supermarket buys food from farmers, bakers, butchers, fishermen and vendors.', '🛍️'],
    ['Who catches crab, lobster and shrimp?', 'fisherman', ['baker', 'butcher'], 'The fisherman catches all kinds of seafood.', '🦀'],
  ],
  'w-care': [
    ['How do I care for my body?', 'bathe every day', ['never bathe', 'eat only candy'], 'I bathe, brush my teeth, comb my hair and wear clean clothes.', '🛁'],
    ['How can I help care for my home?', 'put my toys away', ['throw toys on the floor', 'draw on the walls'], 'I put my toys away, make my bed and help keep my home clean.', '🧸'],
    ['Where does garbage go?', 'in the bin', ['on the floor', 'in the yard'], 'Garbage goes in the bin to keep our home clean.', '🗑️'],
    ['What should I do with my bed in the morning?', 'make my bed', ['leave it messy', 'jump on it'], 'Making my bed helps keep my room tidy.', '🛏️'],
    ['Why do we wash our hands?', 'to wash away germs', ['to get dirty', 'to waste water'], 'Washing hands washes away germs so we stay healthy.', '🧼'],
  ],
});
FACTS['w-body'].push(
  ['What do we use our legs for?', 'to walk and run', ['to eat', 'to see'], 'Our legs help us walk, run and jump.', '🦵'],
  ['What do we use our hands for?', 'to hold and write', ['to hear', 'to smell'], 'Our hands help us hold things, write and clap.', '✋'],
  ['What do our feet help us do?', 'stand and walk', ['see and hear', 'taste'], 'Our feet help us stand and walk.', '🦶'],
  ['What makes my fingers special?', 'my fingerprints are unique', ['they are blue', 'they can fly'], 'Nobody else has fingerprints just like mine. God made me unique!', '👆'],
  ['The coloured part of my eye is called the...', 'iris', ['nose', 'elbow'], 'The iris is the coloured part of the eye. Everyone\'s iris is unique!', '👁️'],
  ['My hair grows from tiny holes in my skin called...', 'hair follicles', ['fingerprints', 'teeth'], 'Hair grows from hair follicles. Everyone\'s hair is different. God made us unique!', '💇‍♀️'],
  ['Why should we exercise?', 'to keep our bodies strong and healthy', ['to feel sleepy', 'to get sick'], 'Exercise keeps our bodies strong and healthy.', '🤸'],
  ['Which joint is in the middle of my arm?', 'elbow', ['knee', 'ankle'], 'The elbow is in the middle of the arm. The knee is in the middle of the leg.', '💪'],
  ['Which joint is in the middle of my leg?', 'knee', ['elbow', 'wrist'], 'The knee is in the middle of the leg.', '🦵'],
);
FACTS['w-music'].push(
  ['Look at the note. Which note is this?', 'whole note', ['half note', 'quarter note'], 'A whole note is open with no stem. It gets 4 beats.', WHOLE],
  ['Look at the note. Which note is this?', 'half note', ['whole note', 'quarter note'], 'A half note is open with a stem. It gets 2 beats.', HALF],
  ['Look at the note. Which note is this?', 'quarter note', ['whole note', 'half note'], 'A quarter note is filled in with a stem. It gets 1 beat.', QUARTER],
  ['How many beats does a whole note get?', '4', ['1', '2'], 'A whole note gets 4 beats.', WHOLE],
  ['How many beats does a half note get?', '2', ['4', '1'], 'A half note gets 2 beats.', HALF],
  ['How many beats does a quarter note get?', '1', ['2', '4'], 'A quarter note gets 1 beat.', QUARTER],
  ['What are the parts of most music notes?', 'head and stem', ['arms and legs', 'roots and leaves'], 'Most notes have a head (the round part) and a stem (the line). A whole note has a head but no stem.', QUARTER],
);
FACTS['w-computer'].push(
  ['Hardware is the part of the computer we can...', 'touch', ['eat', 'hear only'], 'Hardware is the parts we can touch, like the mouse and keyboard.', '🖱️'],
  ['Software is...', 'instructions that tell the computer how to do a task', ['the mouse', 'the keyboard'], 'Software is a set of instructions that tells the computer how to do a task. We cannot touch it, but we can use it.', '🖥️'],
  ['What does a computer need to do a task?', 'step-by-step instructions', ['a nap', 'a sandwich'], 'A computer needs step-by-step instructions to complete a task.', '🤖'],
  ['What does step-by-step mean?', 'one at a time, in the correct order', ['all at once', 'in any order'], 'Step-by-step means doing things one at a time and in the correct order.', '🪜'],
  ['Is the monitor hardware or software?', 'hardware', ['software'], 'We can touch the monitor, so it is hardware.', '🖥️'],
  ['Is a drawing app hardware or software?', 'software', ['hardware'], 'An app is software. We cannot touch it, but we can use it.', '🎨'],
  ['Is a keyboard hardware or software?', 'hardware', ['software'], 'We can touch the keyboard, so it is hardware.', '⌨️'],
  ['Is a game app hardware or software?', 'software', ['hardware'], 'A game app is software. We cannot touch it.', '📲'],
  ['How can we use a computer?', 'to learn and type', ['to cook rice', 'to sweep'], 'We use computers to learn, type, draw, play games and talk to family.', '💻'],
);
Object.assign(META, {
  'w-senses': ['My senses', '👀'], 'w-plants': ['Plants', '🌱'], 'w-family': ['My family', '👨‍👩‍👧'], 'w-animals': ['Animals & babies', '🐣'],
  'w-foodmore': ['Food: stoplight & parts', '🚦'], 'w-care': ['Caring for me & home', '🧼'],
});

export const worldSkills = Object.keys(FACTS).map(id => ({
  id, name: META[id][0], emoji: META[id][1],
  gen(l) {
    const [q, ans, wrong, ex, pic] = pick(FACTS[id]);
    const a = Array.isArray(ans) ? pick(ans) : ans; // a list of right answers: one is used each time
    return {
      say: ask(q), readFirst: l === 3,
      visual: pic ? `<div style="font-size:100px">${pic}</div>` : '',
      options: shuffle([a, ...wrong]).map(x => ({ html: `<span class="lbl">${x}</span>`, value: x, say: x })),
      cols: wrong.length === 1 ? 'two' : '', answer: a, explain: ex,
    };
  },
}));

// IT: put the steps in the correct order (step-by-step instructions)
// [task, 3 steps, 4 steps for level 3]: each list has only one sensible order
const STEPS = [
  ['Brushing my teeth', ['Put toothpaste on the brush', 'Brush my teeth', 'Rinse my mouth'], ['Put toothpaste on the brush', 'Brush my teeth', 'Rinse my mouth', 'Put the brush away']],
  ['Washing my hands', ['Turn on the tap', 'Use soap', 'Rinse and dry'], ['Wet my hands', 'Rub them with soap', 'Rinse off the soap', 'Dry my hands']],
  ['Making a sandwich', ['Get two slices of bread', 'Put cheese inside', 'Eat the sandwich'], ['Get two slices of bread', 'Put cheese on one slice', 'Put the other slice on top', 'Eat the sandwich']],
  ['Planting a seed', ['Dig a hole', 'Put in the seed', 'Water it'], ['Dig a hole', 'Put in the seed', 'Cover it with soil', 'Watch it grow']],
  ['Getting ready for school', ['Wake up', 'Get dressed', 'Go to school']],
  ['Using the computer', ['Turn on the computer', 'Click the app with the mouse', 'Start playing'], ['Turn on the computer', 'Click the app with the mouse', 'Start playing', 'Close the app when I finish']],
];
worldSkills.push({
  id: 'w-steps', name: 'Step-by-step', emoji: '🪜', type: 'order',
  gen(l) {
    const [task, three, four] = pick(STEPS);
    const steps = l === 3 && four ? four : three;
    return {
      type: 'order', say: `${task}. Tap the step that comes first. Then tap the next step, until all the steps are in order.`, text: `${task}: tap the first step, then the next one.`,
      items: shuffle(steps), answer: steps,
      explain: `Step-by-step means one at a time, in the correct order: ${steps.map((x, i) => (i ? x[0].toLowerCase() + x.slice(1) : x)).join(', then ')}.`,
    };
  },
});

