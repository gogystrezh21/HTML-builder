const path = require('path');
const fs = require('fs');
const { readdir } = require('fs/promises');

const linkMain = path.join(__dirname, 'styles');
const linkCopy = path.join(__dirname, 'project-dist');
const result = fs.createWriteStream(path.join(linkCopy, 'bundle.css'));

async function start() {
  try {
    const files = await readdir(linkMain, { withFileTypes: true });
    files.forEach((item) => {

      if (!item.isDirectory()) {
        let itemPath = path.join(linkMain, item.name);
        let itemObj = path.parse(itemPath);
        if (itemObj.ext === '.css') {
          let styles = '';
          const inputItem = fs.createReadStream(itemPath, 'utf-8');
          inputItem.on('data', chunk => styles += chunk);
          inputItem.on('end', () => {
            result.write(styles);
            result.write('\n');
          });
        }
      }
    });
  } catch (err) {
    console.error(err);
  }
}

start();