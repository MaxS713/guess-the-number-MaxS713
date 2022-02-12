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

let answer = await ask(`I will now pick a number between 1 and 100 (inclusive), and you will have to try to guess it...\n Type in "Go" when you're ready! Good luck! `);
let saniAnswer = answer.toLowerCase().replaceAll(" ", "");

while (saniAnswer !== "go") {
    answer = await ask(`\nSorry I didn't quite catch that - Type in "Go" when you are ready! `);
    saniAnswer = answer.toLowerCase().replaceAll(" ", "");
}

console.log(`\nOk... Let me think...`);
let randomNumber = Math.floor(Math.random()*99 + 1);
setTimeout(guess, 1500);

function guess(){
    
    numberOfGuesses++
    let guess = await ask(`Ok, I have my number, what do you think it is? `);
    while (guess === NaN) {
        answer = await ask(`\nSorry I didn't quite catch that - Type in a number! `);
    }

if(guess===randomNumber){
    console.log(`Congratulations! You found it! My number was ${randomNumber}. It took you ${numberOfGuesses} tries!`)
}
    
    
    


}






}
