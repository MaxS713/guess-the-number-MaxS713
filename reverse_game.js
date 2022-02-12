const readline = require("readline");
const rl = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
return new Promise((resolve, reject) => {
    rl.question(questionText, resolve);
});
}

async function start() {

console.clear()

let numberOfGuesses = 0

console.log("\nLet's play the reverse game where I (computer) make up a number and you (human) try to guess it!");

let answer = await ask(`I will now pick a number between 1 and 100 (inclusive), and you will have to try to guess it...\n \
Type in "Go" when you're ready! Good luck! `);
let saniAnswer = answer.toLowerCase().replaceAll(" ", "");

while (saniAnswer !== "go") {
    answer = await ask(`\nSorry I didn't quite catch that - Type in "Go" when you are ready! `);
    saniAnswer = answer.toLowerCase().replaceAll(" ", "");
}

console.log(`\nOk... Give me a sec...`);
let randomNumber = Math.floor(Math.random()*99 + 1);
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
    console.log(`\nCongratulations! You found it! My number was ${randomNumber}. It took you ${numberOfGuesses} tries!`)
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

start()