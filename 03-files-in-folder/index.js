const path = require("path");
const fs = require("fs");

let pathToFolder = "./secret-folder";
let pathToFile;
let names;

const showInfo = (basename, extension, size) => {
  console.log(`${basename} - ${extension.slice(1)} - ${size}`);
};

const getSizeOfFile = async (pathToFile, basename, extension) => {
  return fs.stat(pathToFile, (err, stats) => {
    showInfo(basename, extension, stats.size);
  });
};

const getInfoOfFiles = (names, pathTo) => {
  names.forEach((name) => {
    if (name.isFile()) {
      const nameOfFile = name.name;
      const extension = path.extname(nameOfFile)
        ? path.extname(nameOfFile)
        : " none";
      const basename = path.basename(nameOfFile, `${extension}`);

      pathToFile = path.join(__dirname, pathTo, nameOfFile);
      getSizeOfFile(pathToFile, basename, extension);
    }
  });
};

const readDir = async (pathTo) => {
  try {
    names = await fs.promises.readdir(path.join(__dirname, pathTo), {
      withFileTypes: true,
    });

    getInfoOfFiles(names, pathTo);
  } catch (e) {
    console.log("e", e);
  }
};

readDir(pathToFolder);
