// Write a script that looks for all files named README.md recursively
// in the provided directory and renames them to index.md

import fs from "fs";
import path from "path";

const directory = process.argv[2];

if (!directory) {
  console.error("Please provide a directory path.");
  process.exit(1);
}

processDirectory(directory);

function processDirectory(directory) {
  const items = fs.readdirSync(directory);

  items.forEach((item) => {
    const itemPath = path.join(directory, item);
    const stats = fs.statSync(itemPath);

    if (stats.isDirectory()) {
      processDirectory(itemPath);
    } else if (stats.isFile() && path.basename(item) === "README.md") {
      processFile(itemPath);
    }
  });
}

function processFile(filePath) {
  const newFilePath = path.join(path.dirname(filePath), "index.md");
  fs.renameSync(filePath, newFilePath);
}
