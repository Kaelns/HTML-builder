const { join, extname } = require("path");
const { readdir, copyFile, mkdir, rm } = require("fs/promises");
const { createWriteStream, createReadStream } = require("fs");

const dist = join(__dirname, "project-dist");

const createDir = async (folder) => {
  await rm(folder, { recursive: true, force: true });
  await mkdir(folder, { recursive: true });
};

const copyFiles = async (dirname, folder, dirnameCopy, folderCopy) => {
  const pathToFolder = join(dirname, folder);
  const pathToFolderCopy = join(dirnameCopy, folderCopy);

  await createDir(pathToFolderCopy);
  const files = await readdir(pathToFolder, { withFileTypes: true });

  files.forEach(async (file) => {
    if (file.isFile()) {
      const pathToFile = join(pathToFolder, file.name);
      const pathToFileCopy = join(pathToFolderCopy, file.name);

      await copyFile(pathToFile, pathToFileCopy);
    } else {
      copyFiles(pathToFolder, file.name, pathToFolderCopy, file.name);
    }
  });
};

const findCSSFiles = async (dirname, folder, writeStreamCSS) => {
  const pathToFolder = join(dirname, folder);
  const files = await readdir(pathToFolder, { withFileTypes: true });

  files.forEach(async (file) => {
    if (file.isFile()) {
      const extension = extname(file.name);
      const pathToFile = join(pathToFolder, file.name);

      if (extension === ".css") {
        const readStreamCSS = createReadStream(pathToFile, "utf-8");

        readStreamCSS.pipe(writeStreamCSS);
      }
    } else {
      findCSSFiles(pathToFolder, file.name);
    }
  });
};

const mergeStyles = async () => {
  const fileStyleBundle = join(__dirname, "project-dist", "style.css");
  const writeStreamCSS = createWriteStream(fileStyleBundle, "utf-8");

  findCSSFiles(__dirname, "styles", writeStreamCSS);
};

const findComponent = (elem) => {
  const nameOfComp = elem.replace(/[{]+/, "").replace(/[}]+/, "");
  const linkOfComp = join(__dirname, "components", `${nameOfComp}.html`);

  return createReadStream(linkOfComp, "utf-8");
};

const writeInFile = (textHTML) => {
  const fileHTML = join(dist, "index.html");
  const writeStreamHTML = createWriteStream(fileHTML, "utf-8");

  writeStreamHTML.write(textHTML);
  writeStreamHTML.end();
};

const readHTMLFiles = async () => {
  const patternHTML = join(__dirname, "template.html");
  const readStreamHTML = createReadStream(patternHTML, "utf-8");
  const regOfMark = /[{]+\w+[}]+/g;
  let markInPattern = [];
  let textHTML = "";

  readStreamHTML.on("data", (chunk) => {
    markInPattern = [...markInPattern, ...chunk.match(regOfMark)];
    textHTML += chunk;
  });

  readStreamHTML.on("end", () => {
    markInPattern.forEach((elem, index) => {
      const component = findComponent(elem);

      component.on("data", (chunk) => {
        textHTML = textHTML.replace(elem, chunk);
      });

      if (index === markInPattern.length - 1) {
        component.on("end", () => {
          writeInFile(textHTML);
        });
      }
    });
  });
};

const buildingProject = async () => {
  await createDir(dist);
  await copyFiles(__dirname, "assets", dist, "assets");
  await mergeStyles();
  await readHTMLFiles();

  console.log("The build is complete");
};

buildingProject();
