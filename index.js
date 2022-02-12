const { clear } = require("console");
const readline = require("readline");
const rl = readline.createInterface(process.stdin, process.stdout);
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

async function start() {

  console.clear()

  let numberGuess = 50;
  let maxNumber = 100;
  let minNumber = 0;
  let numberOfGuesses = 0;

  console.log("\nLet's play a game where you (human) make up a number and I (computer) try to guess it.");

  let answer = await ask(`Pick a number between 1 and 100 (inclusive), and I will try to guess it...\n Type in "Go" when you're ready! `);
  let saniAnswer = answer.toLowerCase().replaceAll(" ", "").replaceAll("!", "");

  while (saniAnswer !== "go") {
    answer = await ask(`\nSorry I didn't quite catch that - Type in "Go" when you are ready! `);
    saniAnswer = answer.toLowerCase().replaceAll(" ", "");
  }

  console.log(`\nOk... Let me think...`);

  setTimeout(guess, 1500);

  async function guess() {
    if (numberGuess === minNumber || numberGuess === maxNumber) {
      console.log("\nSomething's not quite right, are you trying to cheat?\nLet's try again - Press any key to continue");
      await keypress()
      start()
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
        start();
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

start();
