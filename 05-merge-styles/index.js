const { join, extname } = require("path");
const { readdir } = require("fs/promises");
const { createWriteStream, createReadStream } = require("fs");

const fileStyleBundle = join(__dirname, "project-dist", "bundle.css");
// TODO If you check merging for test file
// const fileStyleBundle = join(__dirname, "test-files", "bundle.css");
const writeStream = createWriteStream(fileStyleBundle, "utf-8");

const mergeStyles = (filename) => {
  const readStream = createReadStream(filename, "utf-8");

  readStream.pipe(writeStream);
};

const findCSSFiles = async (dirname, folder) => {
  // TODO If you are checking this folder, then uncomment the code below on Ctrl + Alt + A
  const pathToFolder = join(dirname, /* "test-files", */ folder);
  const files = await readdir(pathToFolder, { withFileTypes: true });

  files.forEach(async (file) => {
    if (file.isFile()) {
      const extension = extname(file.name);
      const pathToFile = join(pathToFolder, file.name);

      if (extension === ".css") mergeStyles(pathToFile);
    } else {
      findCSSFiles(pathToFolder, file.name);
    }
  });

  console.log("Merge is complete");
};

findCSSFiles(__dirname, "styles");
