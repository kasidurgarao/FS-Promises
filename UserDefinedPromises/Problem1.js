import fs from "fs";
import path from "path";

const dirPath = "./Durgarao";

const data = {
  name: "rao",
  number: 1234,
};

function createDirectory(dirPath) {
  return new Promise((resolve, reject) => {
    fs.mkdir(dirPath, { recursive: true }, (err) => {
      if (err) {
        reject(`Failed to create directory: ${err}`);
      } else {
        console.log(`Directory created at: ${dirPath}`);
        resolve();
      }
    });
  });
}

function createFiles(dirPath, data, count) {
  return new Promise((resolve, reject) => {
    let completed = 0;
    for (let i = 1; i <= count; i++) {
      const filePath = path.join(dirPath, `file-${i}.json`);
      fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
        if (err) {
          reject(`Failed to create file ${filePath}: ${err}`);
          return;
        }
        console.log(`file-${i} created`);
        completed++;
        if (completed === count) {
          resolve();
        }
      });
    }
  });
}
function deleteFiles(dirPath) {
  return new Promise((resolve, reject) => {
    fs.readdir(dirPath, (err, files) => {
      if (err) {
        reject(`Failed to read directory: ${err}`);
        return;
      }

      let deleted = 0;
      files.forEach((file) => {
        const filePath = path.join(dirPath, file);
        fs.unlink(filePath, (err) => {
          if (err) {
            reject(`Failed to delete file ${filePath}: ${err}`);
            return;
          }
          console.log(`${file} deleted`);
          deleted++;
          if (deleted === files.length) {
            resolve();
          }
        });
      });

      if (files.length === 0) resolve();
    });
  });
}

function main() {
  createDirectory(dirPath)
    .then(() => createFiles(dirPath, data, 5))
    .then(() => deleteFiles(dirPath))
    .then(() => console.log("All operations completed successfully!"))
    .catch((err) => console.error("An error occurred:", err));
}

main();
