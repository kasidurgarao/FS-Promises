import fs from "fs";

function upperCase(filepath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filepath, "utf-8", (err, data) => {
      if (err) {
        return reject(
          "Error occurred during the readFile in upperCase: " + err
        );
      }
      const uppercase = data.toUpperCase();
      fs.writeFile("uppercasefile.txt", uppercase, (err) => {
        if (err) {
          return reject("Unable to write the content in uppercase: " + err);
        }
        fs.writeFile("FileNames.txt", "uppercasefile.txt", (err) => {
          if (err) {
            return reject("Unable to write to FileNames.txt: " + err);
          }
          resolve("Uppercase conversion done.");
        });
      });
    });
  });
}

function lowerCase(filepath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filepath, "utf-8", (err, data) => {
      if (err) {
        return reject(
          "Error occurred during the readFile in lowerCase: " + err
        );
      }
      const lower = data.toLowerCase();
      const splitdata = lower.split(", ").join("\n");
      fs.writeFile("lowercasefile.txt", splitdata, (err) => {
        if (err) {
          return reject("Unable to write the content in lowercase: " + err);
        }
        fs.appendFile("FileNames.txt", "\nlowercasefile.txt", (err) => {
          if (err) {
            return reject("Unable to append to FileNames.txt: " + err);
          }
          resolve("Lowercase conversion done.");
        });
      });
    });
  });
}

function sortContent(fileList) {
  return new Promise((resolve, reject) => {
    fs.readFile(fileList, "utf-8", (err, data) => {
      if (err) {
        return reject("Unable to read FileNames.txt in sortContent: " + err);
      }
      const multiFiles = data.split("\n").filter((file) => file.trim() !== ""); // Remove empty lines
      let sortedData = [];
      let count = 0;

      multiFiles.forEach((file) => {
        fs.readFile(file, "utf-8", (err, content) => {
          if (err) {
            console.error(`Error reading file ${file}:`, err);
          } else {
            sortedData.push(content.split("\n"));
          }
          count++;
          if (count === multiFiles.length) {
            // sortedData = sortedData.flat()
            sortedData = sortedData.flat().sort().join("\n");
            fs.writeFile("sortedfile.txt", sortedData, (err) => {
              if (err) {
                return reject("Error writing sortedfile.txt: " + err);
              }
              fs.appendFile("FileNames.txt", "\nsortedfile.txt", (err) => {
                if (err) {
                  return reject(
                    "Error appending sortedfile.txt to FileNames.txt: " + err
                  );
                }
                resolve("Sorting successfully done.");
              });
            });
          }
        });
      });
    });
  });
}

function deleteAllFiles(fileList) {
  return new Promise((resolve, reject) => {
    fs.readFile(fileList, "utf-8", (err, files) => {
      if (err) {
        reject("Error while reading the fileList.txt " + err);
      }
      let multiFiles = files.split("\n");
      multiFiles.forEach((file) => {
        fs.unlink(file, (err) => {
          if (err) {
            reject("Unable to delete the file : " + err);
          }

          resolve("All files deleted succesfully");
        });
      });
    });
  });
}
const filepath = "lipsum.txt";

upperCase(filepath)
  .then(() => lowerCase(filepath))
  .then(() => sortContent("FileNames.txt"))
  .then(() => deleteAllFiles("FileNames.txt"))
  .then((messeage) => {
    console.log(messeage);
    console.log("All operations completed successfully.");
  })
  .catch((err) => {
    console.error("Error occurred:", err);
  });
