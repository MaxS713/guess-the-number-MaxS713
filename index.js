const readline = require("readline");
const rl = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    rl.question(questionText, resolve);
  });
}

async function start() {

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
        if (numberGuess === minNumber) {
          console.log("\nIt could just be me but I feel like you're trying to cheat...\nLet's try again");
          start();
        }
        console.log(`\nOk... Let me think...`);
        setTimeout(guess, 1500);
      } else if (saniHigherOrLower === "l") {
        maxNumber = numberGuess;
        numberGuess = Math.ceil((minNumber + numberGuess) / 2);
        if (numberGuess === maxNumber) {
          console.log("\nIt could just be me but I feel like you're trying to cheat...\nLet's try again");
          start();
        }
        console.log(`\nOk... Let me think...`);
        setTimeout(guess, 1500);
      }
    }
  }
}

start();
