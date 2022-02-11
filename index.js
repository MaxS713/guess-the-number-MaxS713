

const readline = require('readline');
const rl = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    rl.question(questionText, resolve);
  });
}

let numberGuess = 50
let maxNumber = 100
let minNumber = 1

async function start() {
console.log("Let's play a game where you (human) make up a number and I (computer) try to guess it.")
let answer = await ask(`Pick a number between 1 and 100(inclusive), and I will try to guess it...\n Type in "Go" when you're ready!\n`);
let saniAnswer = answer.toLowerCase().replaceAll(" ","")
while(saniAnswer !=="go"){ 
  answer = await ask(`\nSorry I didn't quite catch that - Type in "Go" when you are!\n`);
  saniAnswer = answer.toLowerCase().replaceAll(" ","")
}

console.log(`\nOk... Let me think...`);

setTimeout(guess, 1500)

async function guess(){
  let confirm = await ask(`\nIs your number ${numberGuess}? (Y or N?)\n`)
  let saniConfirm = confirm.toLowerCase().replaceAll(" ","")

  while(saniConfirm !== "y" && saniConfirm !=="n") {
  confirm = await ask(`\nSorry I didn't quite get that, answer with Y or N\n`);
  saniConfirm = confirm.toLowerCase().replaceAll(" ","")
}
if (saniConfirm === "y"){
  console.log(`\nYour number was ${numberGuess}!`)
} else { 
  let higherOrLower = await ask("\nHmmm... Ok... Is it higher or lower? (H or L)\n")
  let saniHigherOrLower = higherOrLower.toLowerCase().replaceAll(" ","")
  while(saniHigherOrLower !== "h" && saniHigherOrLower !=="l") {
    higherOrLower = await ask(`\nSorry I didn't quite get that, answer with H or L\n`);
    saniHigherOrLower = higherOrLower.toLowerCase().replaceAll(" ","")
  }
  console.log(`\nOk... Let me think...`);
  if (saniHigherOrLower === "h"){
    minNumber=numberGuess
    numberGuess = Math.floor((maxNumber + numberGuess)/2)
    setTimeout(guess, 1500)
  } else if(saniHigherOrLower === "l"){
    maxNumber=numberGuess
    numberGuess = Math.floor((minNumber + numberGuess)/2)
    setTimeout(guess, 1500)
  }
}


}





}


start();