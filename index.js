const { clear } = require("console");
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});
const keypress = async () => {
  process.stdin.setRawMode(true);
  return new Promise((resolve) =>
    process.stdin.once("data", () => {
      process.stdin.setRawMode(false);
      resolve();
    })
  );
};

function ask(questionText) {
  return new Promise((resolve, reject) => {
    rl.question(questionText, resolve);
  });
}

function sani(inputToSani){
  return inputToSani.toLowerCase().replaceAll(" ", "");
}

let maxNumber = 100;
let minNumber = 0;
let numberOfGuesses = 0;
let numberToGuess = 50;

function restart() {
maxNumber = 100;
minNumber = 0;
numberOfGuesses = 0;
numberToGuess = 50;
mainMenu();
}

async function mainMenu(){
  console.clear();
  console.log("\nLet's play a game where you (human) make up a number and I (computer) \
try to guess it.");

  let answer = await ask(`Pick a number between 1 and ${maxNumber} (inclusive), \
and I will try to guess it...\n\
\n- Type in "Go" to play!\
\n- Or type in "X" to extend the guess range\
\n- Or type in "R" to play the reverse game\n\
\nInput: `);
  answer = sani(answer)

  while (answer !== "go" && answer !== "x" && answer !== "r") {
    answer = await ask(`\nSorry I didn't quite catch that\n\
\n- Type in "Go" to play!\
\n- Or type in "X" to extend the guess range\
\n- Or type in "R" to play the reverse game\n\
\nInput: `);
    answer = sani(answer)
  }

  if (answer === "go") {
    game();
  } else if (answer === "x") {
    changeRange();
  } else if (answer === "r") {
    reverseGameIntro();
  }
}

async function changeRange() {
  console.clear();
  maxNumber = await ask("Here you can change the range of the game - the highest \
number available to guess.\n\
What would you like it to be? (Input any number from 1 to 9007199254740991)\n\
\nInput: ");
  console.log(`\nOk, the new range is 1 to ${maxNumber} Press any key to continue`);
  await keypress();
  mainMenu();
}

async function retry(){
  let retryInput = await ask("\nWould you like to play again? (Y or N) ");
  retryInput = sani(retryInput)
  while (retryInput !== "y" && retryInput !== "n") {
    retryInput = await ask(`\nSorry I didn't quite get that, answer with Y or N `);
    retryInput = sani(retry)
  }
  if (retryInput === "y") {
    restart();
  } else if (retryInput === "n") {
    console.log("Ok! I'll see you next time!");
    process.exit();
  }
}

async function game() {

  if (numberOfGuesses === 0){
    numberToGuess = Math.floor(maxNumber/2);
    numberOfGuesses++
    console.log(`\nOk... Let me think...`);
    setTimeout(game, 1500);
  } else if (numberToGuess === minNumber || numberToGuess === maxNumber) {
    console.log("\nSomething's not quite right, are you trying to cheat?\n\
Let's try again - Press any key to continue");
    await keypress();
    restart();
  } else {
    let confirm = await ask(`Is your number ${numberToGuess}? (Y or N?) `);
    confirm = sani(confirm)
    while (confirm !== "y" && confirm !== "n") {
      confirm = await ask(`\nSorry I didn't quite get that, answer with Y or N `);
      confirm = sani(confirm)
    }

    if (confirm === "y") {
      console.log(`\nYour number was ${numberToGuess}! It took me ${numberOfGuesses} tries!`);
      retry() 
    } else if(confirm==="n") {
      numberOfGuesses++
      let higherOrLower = await ask("Hmmm... Ok... Is it higher or lower? (H or L) ");
      higherOrLower = sani(higherOrLower);
      while (higherOrLower !== "h" && higherOrLower !== "l") {
        higherOrLower = await ask(`\nSorry I didn't quite get that, answer with H or L `);
        higherOrLower = sani(higherOrLower);
      }

      if (higherOrLower === "h") {
        minNumber = numberToGuess;
        numberToGuess = Math.floor((maxNumber + numberToGuess) / 2);
        console.log(`\nOk... Let me think...`);
        setTimeout(game, 1500);
      } else if (higherOrLower === "l") {
        maxNumber = numberToGuess;
        numberToGuess = Math.ceil((minNumber + numberToGuess) / 2);
        console.log(`\nOk... Let me think...`);
        setTimeout(game, 1500);
      }
    }
  }
}

async function reverseGameIntro() {

  console.clear();

  console.log("\nLet's play the reverse game where I (computer) make up a number \
and you (human) try to guess it!");

  let answer = await ask(`I will now pick a number between 1 and ${maxNumber} (inclusive), \
and you will have to try to guess it...\nType in "Go" when you're ready! Good luck! `);
  answer = sani(answer);

  while (answer !== "go") {
    answer = await ask(`\nSorry I didn't quite catch that - Type in "Go" when you are ready! `);
    answer = sani(answer);
  }
  console.log(`\nOk... Give me a sec...`);
  randomNumber = Math.floor(Math.random() * (maxNumber - 1) + 1);
  setTimeout(reverseGame, 1500);
}

async function reverseGame(){

  if (numberOfGuesses === 0) { 
    guess = await ask(`\nOk, I have my number, what do you think it is? `);
    numberOfGuesses++
    guess = parseInt(guess);
    console.log("");
  } 

  while (isNaN(guess)) {
    guess = await ask(`Sorry I didn't quite catch that - Type in a number! `);
    guess = parseInt(guess);
    console.log("");
  }

  if (guess === randomNumber) {
    console.log(`\nCongratulations! You found it! My number was ${randomNumber}. \
It took you ${numberOfGuesses} tries!`);
    retry()
  } else if (guess > randomNumber) {
    guess = await ask(`That wasn't it. My number is LOWER. Guess again! `);
    numberOfGuesses++;
    guess = parseInt(guess);
    reverseGame();
  } else if (guess < randomNumber) {
    guess = await ask(`That wasn't it. My number is HIGHER. Guess again! `);
    numberOfGuesses++;
    guess = parseInt(guess);
    reverseGame();
  }
}

restart()
