const path = require('path');
const link = path.join(__dirname, 'text.txt');
const fs = require('fs');

try {
  const data = fs.readFileSync(link, 'utf-8');
  console.log(data);
} catch (err) {
  console.error(err);
}