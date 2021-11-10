const { join, extname } = require("path");
const { readdir, copyFile, mkdir, rmdir } = require("fs/promises");
const { createWriteStream, createReadStream } = require("fs");

const dist = join(__dirname, "project-dist");
const fileStyleBundle = join(__dirname, "project-dist", "style.css");

const createDir = async (folder) => {
  await rmdir(folder, { recursive: true });
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

  console.log("Copy is complete");
};

const findCSSFiles = async (dirname, folder, writeStreamCSS) => {
  const pathToFolder = join(dirname, folder);
  const files = await readdir(pathToFolder, { withFileTypes: true });

  files.forEach(async (file) => {
    if (file.isFile()) {
      const extension = extname(file.name);
      const pathToFile = join(pathToFolder, file.name);

      if (extension === ".css") {
        const readStream = createReadStream(pathToFile, "utf-8");

        readStream.pipe(writeStreamCSS);
      }
    } else {
      findCSSFiles(pathToFolder, file.name);
    }
  });

  console.log("Merge is complete");
};

const mergeStyles = async () => {
  const writeStreamCSS = createWriteStream(fileStyleBundle, "utf-8");

  findCSSFiles(__dirname, "styles", writeStreamCSS);
};

const buildingProject = async () => {
  await createDir(dist);
  await copyFiles(__dirname, "assets", dist, "assets");
  await mergeStyles();
};

buildingProject();
