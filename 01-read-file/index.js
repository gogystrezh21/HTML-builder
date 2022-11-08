const path = require('path');
const link = path.join(__dirname, 'text.txt');
const fs = require('fs');

const readStream = fs.createReadStream( link, 'utf-8');
let data = '';
readStream.on('data', chunk => data += chunk);
readStream.on('end', () => console.log(data));
readStream.on('error', err => console.log(err.message));