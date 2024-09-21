/**
 * provide the directory of the markdown files to have their
 * frontmatter either created or updated
 * updated means
 *  - changing the "permalink" variable to "title"
 *  - saving the file
 * created means
 *  - prepending "---\n" to the file
 *  - changing the "#" substring of the "# ${TITLE}" first line to "title: ${TITLE}"
 *  - appending "\n---" to the above title
 *  - saving the file
 */

import fs from 'fs';
import path from 'path';

const directory = process.argv[2];

if (!directory) {
  console.error('Please provide a directory path.');
  process.exit(1);
}

processDirectory(directory);

function processFile(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const lines = fileContent.split('\n');
  let hasFrontmatter = false;
  let newContent = '';
  let title = '';

  if (lines[0] === '---') {
    hasFrontmatter = true;
    let i = 1;
    while (i < lines.length && lines[i] !== '---') {
      if (lines[i].startsWith('permalink:')) {
        lines[i] = lines[i].replace('permalink:', 'title:');
      }
      i++;
    }
    newContent = lines.join('\n');
  } else {
    title = lines[0].replace('# ', '');
    newContent = `---\ntitle: ${title}\n---\n${lines.slice(1).join('\n')}`;
  }

  fs.writeFileSync(filePath, newContent, 'utf8');
}

function processDirectory(directory) {
  const items = fs.readdirSync(directory);

  items.forEach((item) => {
    const itemPath = path.join(directory, item);
    const stats = fs.statSync(itemPath);

    if (stats.isDirectory()) {
      processDirectory(itemPath);
    } else if (stats.isFile() && path.extname(item) === '.md') {
      processFile(itemPath);
    }
  });
}
