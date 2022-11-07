const path = require('path');
const fs = require('fs');
const { readdir } = require('fs/promises');
const link = path.join(__dirname, 'secret-folder');
async function readSecret() {
  try {
    const folder = await readdir(link, { withFileTypes: true });
    folder.forEach(item => {
      if (!item.isDirectory()) {
        let itemPath = path.join(__dirname, 'secret-folder', item.name);
        let itemObj = path.parse(itemPath);
        fs.stat(itemPath, (err, stats) => {
          console.log(`${itemObj.name} - ${itemObj.ext.split('.')[1]} - ${stats.size / 1024} kb`);
        });
      }
    });
  } catch (err) {
    console.error(err);
  }
}
readSecret()