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

//this "sanitize" any input given to it by lower casing and taking away any extra spaces
//called for every input throughout the code
function sani(inputToSani) {
  return inputToSani.toLowerCase().replaceAll(" ", "");
}

//creating values that I'll need throughout the code
let maxNumber = 100;
let minNumber = 0;
let numberOfGuesses = 0;
let numberToGuess = 50;

//this function 'reboots' the game and resets all values needed
function restart() {
  maxNumber = 100;
  minNumber = 0;
  numberOfGuesses = 0;
  numberToGuess = 50;
  mainMenu();
}

//A menu that introduces the game and also allows you to change the range or play the reverse game
async function mainMenu() {
  
  console.clear();
  console.log("\nLet's play a game where you (human) make up a number and I (computer) \
try to guess it.");
  
  let answer = await ask(`Pick a number between 1 and ${maxNumber} (inclusive), \
and I will try to guess it...\n\
\n- Type in "Go" to play!\
\n- Or type in "X" to change the guess range\
\n- Or type in "R" to play the reverse game\n\
\nInput: `);
  answer = sani(answer);

//if the sanitized input is not as expected, the computer complains and asks again
//this while loop shows up for every input
  while (answer !== "go" && answer !== "x" && answer !== "r") {
    answer = await ask(`\nSorry I didn't quite catch that\n\
\n- Type in "Go" to play!\
\n- Or type in "X" to change the guess range\
\n- Or type in "R" to play the reverse game\n\
\nInput: `);
    answer = sani(answer);
  }
  
//Depending on the input, calls the different functions
  if (answer === "go") {
    game();
  } else if (answer === "x") {
    changeRange();
  } else if (answer === "r") {
    reverseGameIntro();
  }
}

//Menu that allows you to change range by changing the maxNumber value
async function changeRange(x) {
  
  console.clear();
  
  maxNumber = await ask("Here you can change the range of the game - the highest \
number available to guess.\n\
What would you like it to be? (Input any number from 1 to 9007199254740991)\n\
\nInput: ");
  
  while (isNaN(parseInt(maxNumber))) {
    maxNumber = await ask(`Sorry I didn't quite catch that - Type in a number! `);
  }
  
  maxNumber = parseInt(maxNumber);
  
  console.log(`\nOk, the new range is 1 to ${maxNumber} Press any key to continue`);
  
  await keypress();
  if (x === 1) { 
//I have a x argument here because I wanted it to go back to the reverseGame if you 
//changed the range within the reverseGame and not the main menu 
    reverseGameIntro();
  } else {
    mainMenu();
  }
}

//Function called when game is over and asks if you would like to play again, else exits
async function retry() {
  
  let retryInput = await ask("\nWould you like to play again? (Y or N) ");
  retryInput = sani(retryInput);
  
  while (retryInput !== "y" && retryInput !== "n") {
    retryInput = await ask(`\nSorry I didn't quite get that, answer with Y or N `);
    retryInput = sani(retryInput);
  }
  
  if (retryInput === "y") {
    restart();
  } else if (retryInput === "n") {
    console.log("Ok! I'll see you next time!");
    process.exit();
  }
}

//The actual guessing game where the computer tries to guess your number
//I wanted to note here that I didn't ask the user to input his number as if the game was played with a human
//Although this was in the original code
//I hope that's ok 
async function game() {

//Before the first guess (numberOfGuesses===0), the computer does a little bit of pre-code
  if (numberOfGuesses === 0) {
    maxNumber = maxNumber + 1; //not sure why I needed this, but now the computer can actually guess the maxNumber of the range inclusive now
    numberToGuess = Math.floor(maxNumber/2); //the computer guesses the number right in the middle of the range
    numberOfGuesses++; //keeps track of number of guesses so far
    console.log(`\nOk... Let me think...`);
    setTimeout(game, 1500); //don't actually need the setTimeout but I thought it was funny to make it seems like the computer is actually "thinking"

//if there is only one posibility left in the range (maxNumber - minNumber === 2), the computer guesses the number by itself!
  } else if (maxNumber - minNumber === 2) {
    let confirm = await ask(`\nThen your number's got to be ${numberToGuess}! (Y or N) `);
    confirm = sani(confirm);
    
    while (confirm !== "y" && confirm !== "n") {
      confirm = await ask(`\nSorry I didn't quite get that, answer with Y or N `);
      confirm = sani(confirm);
    }

//success! 
    if (confirm === "y") {
      console.log(`\nYour number was ${numberToGuess}! It took me ${numberOfGuesses} tries!`);
      retry();

//if the number is not the final possibility something is not quite right - cheating?
    } else if (confirm === "n") {
      console.log("Hmmm... something is not quite right, did you change your guess mid-game?\n\
Let's try again - Press any key to restart");
      await keypress();
      restart();
    }

//if the computer doesn't know for sure the number yet, it asks if the guessed number is correct
  } else {
    let confirm = await ask(`Is your number ${numberToGuess}? (Y or N?) `);
    confirm = sani(confirm);
    while (confirm !== "y" && confirm !== "n") {
      confirm = await ask(`\nSorry I didn't quite get that, answer with Y or N `);
      confirm = sani(confirm);
    }

//success!! and prints the numberOfGuesses accumulated so far
    if (confirm === "y") {
      console.log(
        `\nYour number was ${numberToGuess}! It took me ${numberOfGuesses} tries!`
      );
      retry();

//if no success - the computer asks if the number is higher or lower and adds a guess to numberOfGuesses
    } else if (confirm === "n") {
      numberOfGuesses++;
      let higherOrLower = await ask("Hmmm... Ok... Is it higher or lower? (H or L) ");
      higherOrLower = sani(higherOrLower);
      while (higherOrLower !== "h" && higherOrLower !== "l") {
        higherOrLower = await ask(`\nSorry I didn't quite get that, answer with H or L `);
        higherOrLower = sani(higherOrLower);
      }

//if the number is higher the minNumber available to guess becomes the guess
//it does the opposite if the number is lower
//then the computer calculates the "floor" of a median for a new number to guess
//and goes back to the beginning of the function
      if (higherOrLower === "h") {
        minNumber = numberToGuess;
        numberToGuess = Math.floor((maxNumber + numberToGuess)/2);
        console.log(`\nOk... Let me think...`);
        setTimeout(game, 1500);
      } else if (higherOrLower === "l") {
        maxNumber = numberToGuess;
        numberToGuess = Math.ceil((minNumber + numberToGuess)/2);
        console.log(`\nOk... Let me think...`);
        setTimeout(game, 1500);
      }
    }
  }
}


//that's it for the guessing game, here's the reverseGame where you try to guess the computer's number
//little intro similar to the mainMenu of the main game then then the actual reverse guessing game starts
async function reverseGameIntro() {
  
  console.clear();
  
  console.log("\nLet's play the reverse game where I (computer) make up a number \
and you (human) try to guess it!");
  
  let answer = await ask(`I will now pick a number between 1 and ${maxNumber} (inclusive), \
and you will have to try to guess it...\n\
\n- Type in "Go" when you're ready!\
\n- Or type in "X" to change the guess range\
\n- Or type in "R" to go back to the standard game\n\
\nInput: `);
  answer = sani(answer);
  
  while (answer !== "go" && answer !== "x" && answer !== "r") {
    answer = await ask(`\nSorry I didn't quite catch that\n\
\n- Type in "Go" to play!\
\n- Or type in "X" to change the guess range\
\n- Or type in "R" to go back to the standard game\n\
\nInput: `);
    answer = sani(answer);
  }
  
  if (answer === "go") {
    console.log(`\nOk... Give me a sec...`);
    randomNumber = Math.floor(Math.random()*(maxNumber - 1 + 1)+1); 
// this calculates a random number inclusive of maxNumber and 1 before starting the game
    setTimeout(reverseGame, 1500);
  } else if (answer === "x") {
    changeRange(1);
  } else if (answer === "r") {
    mainMenu();
  }
}

//actual reverseGame start
async function reverseGame() {

//the first guess has a little bit of different text
  if (numberOfGuesses === 0) {
    maxNumber = maxNumber + 1
    guess = await ask(`\nOk, I have my number, what do you think it is? `);
    numberOfGuesses++;
    guess = parseInt(guess); 
//I found out that you need to "parseInt" the value given - else it sees it as a text string... I do it for every input that follows
  }

//if the input is not a number a.k.a if isNaN === true, the computer complains
  while (isNaN(guess)) {
    guess = await ask(`Sorry I didn't quite catch that - Type in a number! `);
    guess = parseInt(guess);
    console.log("");
  }
  
//success!
  if (guess === randomNumber) {
    console.log(`\nCongratulations! You found it! My number was ${randomNumber}. \
It took you ${numberOfGuesses} tries!`);
    retry();

//If you try to guess a number that is outside the range of possibilities, the computer lets you know
//the computer is generous and doesn't count it as a guess, so numberOfGuesses--
  } else if (guess>=maxNumber || guess<=minNumber){
    numberOfGuesses--
    guess = await ask(`Hmm.. this is outside the range of possibilities. Guess again! `);
    numberOfGuesses++;
    guess = parseInt(guess);
    reverseGame();

//the computer tells you if your guess is higher or lower than the number it generated
//then we add a numberOfGuess, then we go back to the beginning
  } else if (guess > randomNumber) {
    maxNumber = guess
    guess = await ask(`That wasn't it. My number is LOWER. Guess again! `);
    numberOfGuesses++;
    guess = parseInt(guess);
    reverseGame();
  } else if (guess < randomNumber) {
    minNumber = guess
    guess = await ask(`That wasn't it. My number is HIGHER. Guess again! `);
    numberOfGuesses++;
    guess = parseInt(guess);
    reverseGame();
  }
}

restart();
