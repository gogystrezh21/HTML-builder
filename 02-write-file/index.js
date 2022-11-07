const path = require('path');
const link = path.join(__dirname, 'text.txt');
const fs = require('fs');
const { stdin, stdout, exit } = process;
const writeFile = fs.createWriteStream(link);

stdout.write('Write your text ');
stdin.on('data', data => {
  const stringData = data.toString();
  if (stringData .indexOf('exit') !== -1) {
    exit();
  } else {
    writeFile.write(stringData);
  }
});
process.on('SIGINT', () => exit());
process.on('exit', () => { stdout.write('Good bye'); });