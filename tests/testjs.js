import * as fs from "node:fs";

// Read file synchronously
try {
    fs.readFile("./tests/data.json", "utf8", (err, data) => {
        if (err) {
            console.error('Error reading the file:', err);
            return;
        }
        const jsonData = JSON.parse(data);
        // console.log('File content:', data);
        jsonData["Sheet1"].forEach((element) => {
            console.log(element);
        })
    });
} catch (err) {
    console.error("Error reading the file:", err);
}
