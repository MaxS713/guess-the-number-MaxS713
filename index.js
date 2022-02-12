const { clear } = require("console");
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal:false
});
const keypress = async () => {
  process.stdin.setRawMode(true)
  return new Promise(resolve => process.stdin.once('data', () => {
    process.stdin.setRawMode(false)
    resolve()
  }))
}

function ask(questionText) {
  return new Promise((resolve, reject) => {
    rl.question(questionText, resolve);
  });
}

async function restart(){
let maxNumber = 100;
game()
async function game(){
  console.clear()
  console.log("\nLet's play a game where you (human) make up a number and I (computer) \
try to guess it.");
  
  let answer = await ask(`Pick a number between 1 and ${maxNumber} (inclusive), \
and I will try to guess it...\n\
\n- Type in "Go" to play!\
\n- Or type in "X" to extend the guess range\
\n- Or type in "R" to play the reverse game\n\
\nInput: `);
  let saniAnswer = answer.toLowerCase().replaceAll(" ", "");

  while (saniAnswer !== "go" && saniAnswer !== "x" && saniAnswer !== "r") {
    answer = await ask(`\nSorry I didn't quite catch that\n\
\n- Type in "Go" to play!\
\n- Or type in "X" to extend the guess range\
\n- Or type in "R" to play the reverse game\n\
\nInput: `);
    saniAnswer = answer.toLowerCase().replaceAll(" ", "");
  }

  if(saniAnswer === 'go'){
    start()
  } else if(saniAnswer === 'x'){
    changeRange()
  } else if (saniAnswer === 'r'){
    reverseStart()
  }

async function changeRange(){
  console.clear()
  maxNumber = await ask("Here you can change the range of the game - the highest \
number available to guess.\n\
What would you like it to be? (Input any number from 1 to 9007199254740991)\n\
\nInput: ")
console.log(`\nOk, the new range is 1 to ${maxNumber} Press any key to continue`)
await keypress()
game()
}
}

async function start() {

  

  let numberGuess = maxNumber/2;
  let minNumber = 0;
  let numberOfGuesses = 0;

  console.log(`\nOk... Let me think...`);

  setTimeout(guess, 1500);

  async function guess() {
    if (numberGuess === minNumber || numberGuess === maxNumber) {
      console.log("\nSomething's not quite right, are you trying to cheat?\n\
Let's try again - Press any key to continue");
      await keypress()
      restart()
    }
    numberOfGuesses++;
    let confirm = await ask(`\nIs your number ${numberGuess}? (Y or N?) `);
    let saniConfirm = confirm.toLowerCase().replaceAll(" ", "");

    while (saniConfirm !== "y" && saniConfirm !== "n") {
      confirm = await ask(`\nSorry I didn't quite get that, answer with Y or N `);
      saniConfirm = confirm.toLowerCase().replaceAll(" ", "");
    }
    if (saniConfirm === "y") {
      console.log(`\nYour number was ${numberGuess}! It took me ${numberOfGuesses} tries!`);

      let retry = await ask("\nWould you like to play again? (Y or N) ");
      let saniRetry = retry.toLowerCase().replaceAll(" ", "");

      while (saniRetry !== "y" && saniRetry !== "n") {
        retry = await ask(`\nSorry I didn't quite get that, answer with Y or N `);
        saniRetry = retry.toLowerCase().replaceAll(" ", "");
      }
      if (saniRetry === "y") {
        restart();
      } else if (saniRetry === "n") {
        console.log("Ok! I'll see you next time!");
        process.exit();
      }
    } else {
      let higherOrLower = await ask("\nHmmm... Ok... Is it higher or lower? (H or L) ");
      let saniHigherOrLower = higherOrLower.toLowerCase().replaceAll(" ", "");
      while (saniHigherOrLower !== "h" && saniHigherOrLower !== "l") {
        higherOrLower = await ask(`\nSorry I didn't quite get that, answer with H or L `);
        saniHigherOrLower = higherOrLower.toLowerCase().replaceAll(" ", "");
      }
      if (saniHigherOrLower === "h") {
        minNumber = numberGuess;
        numberGuess = Math.floor((maxNumber + numberGuess) / 2);
        console.log(`\nOk... Let me think...`);
        setTimeout(guess, 1500);
      } else if (saniHigherOrLower === "l") {
        maxNumber = numberGuess;
        numberGuess = Math.ceil((minNumber + numberGuess) / 2);
        console.log(`\nOk... Let me think...`);
        setTimeout(guess, 1500);
      }
    }
  }
}

async function reverseStart() {

  console.clear()
  
  let numberOfGuesses = 0
  
  console.log("\nLet's play the reverse game where I (computer) make up a number \
and you (human) try to guess it!");
  
  let answer = await ask(`I will now pick a number between 1 and ${maxNumber} (inclusive), \
and you will have to try to guess it...\nType in "Go" when you're ready! Good luck! `);
  let saniAnswer = answer.toLowerCase().replaceAll(" ", "");
  
  while (saniAnswer !== "go") {
      answer = await ask(`\nSorry I didn't quite catch that - Type in "Go" when you are ready! `);
      saniAnswer = answer.toLowerCase().replaceAll(" ", "");
  }
  
  console.log(`\nOk... Give me a sec...`);
  let randomNumber = Math.floor(Math.random()*(maxNumber-1) + 1);
  setTimeout(firstGuess, 1500);
  
  async function firstGuess(){
  let guess = await ask(`\nOk, I have my number, what do you think it is? `);
  console.log("")
  humanGuess()
  
  async function humanGuess(){
      numberOfGuesses++
  if (isNaN(guess) === true) {
          guess = await ask(`\nSorry I didn't quite catch that - Type in a number! `);
      }
  if(parseInt(guess)===randomNumber){
      console.log(`\nCongratulations! You found it! My number was ${randomNumber}. \
It took you ${numberOfGuesses} tries!`)
      let retry = await ask("\nWould you like to play again? (Y or N) ");
      let saniRetry = retry.toLowerCase().replaceAll(" ", "");
  
      while (saniRetry !== "y" && saniRetry !== "n") {
          retry = await ask(`\nSorry I didn't quite get that, answer with Y or N `);
          saniRetry = retry.toLowerCase().replaceAll(" ", "");
      }
      if (saniRetry === "y") {
          restart();
      } else if (saniRetry === "n") {
          console.log("Ok! I'll see you next time!");
          process.exit();
      }
  } else if (guess>randomNumber){
      guess = await ask(`That wasn't it. My number is LOWER. Guess again! `);
      humanGuess()
  } else if (guess<randomNumber){
      guess = await ask(`That wasn't it. My number is HIGHER. Guess again! `);
      humanGuess()
  }
  }
  }
  }
}
restart();
