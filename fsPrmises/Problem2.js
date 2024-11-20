import fs from "fs/promises";

const filepath = "lipsum.txt";
function upperCase() {
  return fs
    .readFile(filepath, "utf-8")
    .then((text) => {
      const convertfile = text.toUpperCase();
      fs.writeFile("uppercasefile.txt", convertfile)
        .then(() => fs.writeFile("files_new.txt", "uppercasefile.txt"))
        .catch((err) => console.log("Unable to write file:", err));
      return text;
    })

    .catch((err) => console.error("Unable to read file:", err));
}

function lowerCase(data) {
  return fs
    .readFile(filepath, "utf-8")
    .then((text) => {
      // console.log(data);
      const lower = text.toLowerCase();
      const splitdata = lower.split(",").join("\n");
      return fs
        .writeFile("lowercasefile.txt", splitdata)
        .then(() => fs.appendFile("files_new.txt", "\nlowercasefile.txt"))
        .catch((err) => console.log("Unable to write or append file:", err));
    })
    .catch((err) => console.log("Unable to read file:", err));
}

function sortContent(files_new) {
  return fs
    .readFile(files_new, "utf-8")
    .then((data) => {
      const fileList = data.split("\n");
      const fileContentsPromises = fileList.map((file) =>
        fs.readFile(file, "utf8").catch((err) => {
          console.log(`Error reading file ${file}:`, err);
        })
      );

      return Promise.all(fileContentsPromises).then((contents) => {
        let sortedData = contents
          .flatMap((content) => content.split("\n"))
          .sort()
          .join("\n");

        return fs.writeFile("sortedfile.txt", sortedData).then(() => {
          console.log("Sorted file created and updated files_new.txt list.");
          return fs.appendFile(files_new, "\nsortedfile.txt");
        });
      });
    })
    .catch((err) => {
      console.log("Error reading files_new.txt file:", err);
    });
}

function deleteAllatOnce(filepath) {
  return fs
    .readFile(filepath, "utf-8")
    .then((files) => {
      const fileList = files.split("\n");
      // console.log(fileList)
      const deletePromises = fileList.map((file) =>
        fs
          .unlink(file)
          .then(() => {
            console.log(`Deleted ${file}`);
          })
          .catch((err) => {
            console.error(`Failed to delete ${file}:`, err);
          })
      );
      Promise.all(deletePromises).then(() => {
        console.log("All specified files have been processed.");
      });
    })
    .catch((err) => {
      console.error(`Failed to read the file list from ${filepath}:`, err);
    });
}
const combinedpath = "files_new.txt";
upperCase()
  .then((data) => lowerCase(data))
  .then(() => sortContent(combinedpath))
  .then(() => deleteAllatOnce(combinedpath))
  .catch((err) => console.log("Error occurred:", err));
