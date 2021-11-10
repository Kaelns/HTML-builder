const { join } = require("path");
const { readdir, copyFile, mkdir, rmdir } = require("fs/promises");

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

copyFiles(__dirname, "files", __dirname, "files-copy");
