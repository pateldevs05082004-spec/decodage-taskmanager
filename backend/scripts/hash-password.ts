import bcrypt from 'bcrypt';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter password to hash: ', (password) => {
  const saltRounds = 10;
  
  bcrypt.hash(password, saltRounds).then((hash) => {
    console.log('\n✅ Password hashed successfully!');
    console.log('Password:', password);
    console.log('Hash:', hash);
    console.log('\n📋 Copy the hash above and use it in your Neon SQL Editor.');
    rl.close();
  }).catch((error) => {
    console.error('Error hashing password:', error);
    rl.close();
  });
});
