import * as readline from 'node:readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function selectDifficulty() {
  console.log('\nPlease select the difficulty level:');
  console.log('1. Easy (10 chances)');
  console.log('2. Medium (5 chances)');
  console.log('3. Hard (3 chances)');
  
  let choice = await ask('Enter your choice (1-3): ');
  choice = parseInt(choice);
  
  let maxAttempts, level;
  switch(choice) {
    case 1:
      maxAttempts = 10;
      level = 'Easy';
      break;
    case 2:
      maxAttempts = 5;
      level = 'Medium';
      break;
    case 3:
      maxAttempts = 3;
      level = 'Hard';
      break;
    default:
      console.log('Invalid choice! Defaulting to Medium.');
      maxAttempts = 5;
      level = 'Medium';
  }
  console.log(`\nGreat! You have selected the ${level} difficulty level.`);
  return { maxAttempts, level };
}

async function playGame(highScores) {
  const secretNumber = Math.floor(Math.random() * 100) + 1;
  console.log("\nI'm thinking of a number between 1 and 100.");
  
  const { maxAttempts, level } = await selectDifficulty();
  console.log("\nLet's start the game!");
  
  let attempts = 0;
  const startTime = Date.now();
  
  while (attempts < maxAttempts) {
    let guessInput = await ask(`\nEnter your guess (1-100): `);
    const guess = parseInt(guessInput);
    
    if (isNaN(guess) || guess < 1 || guess > 100) {
      console.log('Please enter a valid number between 1 and 100!');
      continue;
    }
    
    attempts++;
    
    if (guess === secretNumber) {
      const timeTaken = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log(`\n🎉 Congratulations! You guessed the correct number in ${attempts} attempts.`);
      console.log(`⏱️ Time taken: ${timeTaken} seconds.`);
      
      if (!highScores[level] || attempts < highScores[level]) {
        highScores[level] = attempts;
        console.log(`🏆 New high score for ${level} difficulty!`);
      }
      return true;
    } else if (guess < secretNumber) {
      console.log(`❌ Incorrect! The number is greater than ${guess}.`);
    } else {
      console.log(`❌ Incorrect! The number is less than ${guess}.`);
    }
    
    const remaining = maxAttempts - attempts;
    if (remaining > 0) {
      console.log(`You have ${remaining} chances left.`);
    }
  }
  
  console.log(`\n💥 Game Over! The number was ${secretNumber}.`);
  return false;
}

async function main() {
  console.log("=====================================");
  console.log("🎲 Welcome to the Number Guessing Game! 🎲");
  console.log("=====================================");
  console.log("Rules:");
  console.log("• Guess the number I'm thinking of (1-100)");
  console.log("• Choose difficulty to set your attempt limit");
  console.log("• Get hints if your guess is too high or too low");
  console.log("• Beat your high score on each difficulty level!");
  console.log("=====================================");
  
  const highScores = { Easy: null, Medium: null, Hard: null };
  
  let playAgain = true;
  
  while (playAgain) {
    await playGame(highScores);
    
    console.log('\n' + '='.repeat(50));
    console.log('HIGH SCORES (fewest attempts):');
    Object.keys(highScores).forEach(lvl => {
      if (highScores[lvl] !== null) {
        console.log(`  ${lvl.padEnd(8)} → ${highScores[lvl]} attempts`);
      } else {
        console.log(`  ${lvl.padEnd(8)} → Not set yet`);
      }
    });
    console.log('='.repeat(50));
    
    const againInput = await ask('\nDo you want to play again? (y/n): ');
    playAgain = againInput.toLowerCase() === 'y' || againInput.toLowerCase() === 'yes';
  }
  
  console.log('\nThanks for playing! Goodbye 👋');
  rl.close();
}

main().catch(err => {
  console.error('Something went wrong:', err);
  rl.close();
});