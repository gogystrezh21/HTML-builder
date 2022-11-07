const path = require('path');
const fs = require('fs');
const fsPromises = fs.promises;
const { readdir } = require('fs/promises');
const link = path.join(__dirname, 'files');
const linkCopy = path.join(__dirname, 'files-copy');
fsPromises.mkdir(linkCopy, {recursive: true}).then(() => {
  rewrite();
  reader();
});

async function copyDir(itemName) {
  try {
    let linkPath = path.join(link, itemName);
    let linkCopyPath = path.join(linkCopy, itemName);
    await fsPromises.copyFile(linkPath, linkCopyPath);
  } catch (err) {
    console.error(err);
  }
}

async function rewrite() {
  try {
    const items = await readdir(linkCopy, { withFileTypes: true });
    items.forEach(item => {
      fs.unlink(path.join(linkCopy, item.name), err => {
        if (err) throw err;
      });
    });
  } catch (err) {
    console.error(err);
  }
}

async function reader() {
  try {
    const items = await readdir(link, { withFileTypes: true });
    items.forEach(item => {
      copyDir(item.name);
    });
  } catch (err) {
    console.error(err);
  }
}
