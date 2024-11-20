import fs from "fs/promises";
import path from "path";

const dirPath = "./Durgarao";

const data = {
  name: "rao",
  number: 1234,
};

export function readAndDeletPromises() {
  fs.mkdir(dirPath, { recursive: true })
    .then(() => {
      let promiselist = [];
      for (let i = 1; i <= 5; i++) {
        const filepath = path.join(dirPath, `file-${i}.json`);
        let promisefromwritefile = fs
          .writeFile(filepath, JSON.stringify(data, null, 2))
          .then(() => {
            console.log(`file-${i} created`);
          })
          .catch((err) => console.error("unable to write"));
        promiselist.push(promisefromwritefile);
      }
      Promise.all(promiselist)
        .then(() => {
          fs.readdir(dirPath)
            .then((files) => {
              files.forEach((file, index) => {
                const files_path = path.join(dirPath, file);
                fs.unlink(files_path)
                  .then(() => {
                    console.log(`file ${index + 1} deleted`);
                  })
                  .catch((err) => console.error("unable to delete"));
              });
            })
            .catch((err) => console.log("unable to read the directory"));
        })
        .catch((err) => console.error("promises are rejected"));
    })

    .catch((err) => console.error("directory already exists"));
}
readAndDeletPromises();
