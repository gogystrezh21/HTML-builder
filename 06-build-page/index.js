const path = require('path');
const fs = require('fs');
const fsPromises = fs.promises;
const { readdir } = require('fs/promises');

const template = path.join(__dirname, 'template.html');
const project = path.join(__dirname, 'project-dist');
const resultHtml = path.join(__dirname, 'project-dist', 'index.html');
const assets = path.join(__dirname, 'assets');
const assetsResult = path.join(__dirname, 'project-dist', 'assets');
const cssResult = path.join(__dirname, 'project-dist');
const css = path.join(__dirname, 'styles');
const components = path.join(__dirname, 'components');

fsPromises.mkdir(project, { recursive: true }).then(async () => {
  await AssetsDelete();
  fsPromises.readdir(assetsResult).catch((err) => {
    if (err) {
      console.log('1');
    }
  });
  create();
  assetsAdd(assets, assetsResult);
  start();
});

async function AssetsDelete() {
  return fsPromises.rm(assetsResult, { recursive: true, force: true });
}

async function assetsAdd(pathToAssets, destPath) {
  await fsPromises.mkdir(assetsResult, { recursive: true });
  try {
    const assetsStructure = await readdir(pathToAssets, { withFileTypes: true });
    assetsStructure.forEach(item => {
      if (item.isDirectory()) {
        fsPromises.mkdir(path.join(destPath, item.name), { recursive: true });
        let pathToAssetsDir = path.join(pathToAssets, item.name);
        let destAssetsDirPath = path.join(destPath, item.name);
        assetsAdd(pathToAssetsDir, destAssetsDirPath);
      } else {
        (async () => {
          try {
            let pathToFile = path.join(pathToAssets, item.name);
            let destPathToFile = path.join(destPath, item.name);
            await fsPromises.copyFile(pathToFile, destPathToFile);
          } catch (err) {
            console.error(err);
          }
        })();
      }
    });
  } catch (err) {
    console.log(err);
  }
}

async function create() {
  fs.readFile(template, (err, data) => {
    let template;
    if (err) console.log(err);
    template = data.toString();
    (
      async () => {
        const items = await readdir(components, { withFileTypes: true });
        items.forEach(item => {
          let itemName = item.name.split('.')[0];
          let componentRStream = fs.createReadStream(path.join(components, item.name));
          let componentData = '';
          componentRStream.on('data', chunk => componentData += chunk);
          componentRStream.on('end', () => {
            if (itemName) {
              template = template.replace(`{{${itemName}}}`, componentData);
            }
            let ws = fs.createWriteStream(resultHtml);
            ws.write(template);
          });
        });
      }
    )();
  });
}

async function start() {
  try {
    const result = fs.createWriteStream(path.join(cssResult, 'style.css'));
    const items = await readdir(css, { withFileTypes: true });
    items.forEach((item) => {
      if (!item.isDirectory()) {
        let itemPath = path.join(__dirname, 'styles', item.name);
        let itemObj = path.parse(itemPath);
        if (itemObj.ext === '.css') {
          let styles = '';
          const inputItem = fs.createReadStream(itemPath, 'utf-8');
          inputItem.on('data', chunk => styles += chunk);
          inputItem.on('end', () => {
            result.write(styles);
            result.write('\n\n');
          });
        }
      }
    });
  } catch (err) {
    console.error(err);
  }
}