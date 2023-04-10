const fs = require("fs");
const request = require("request");
const promise = require("promise");

const DATA_DIR = "./data";
const STUDENT_DB_PATH = `${DATA_DIR}/students.db`;
const GRADES_JSON_PATH = `${DATA_DIR}/grades.json`;

(async () => {
    if (!fs.existsSync(DATA_DIR)) {
        await fs.mkdirSync(DATA_DIR);
    }

    const studentsPromise = new Promise((resolve, reject) => {
        console.log("Fetching students.db...");
        request("https://outlier-coding-test-data.onrender.com/students.db")
            .pipe(fs.createWriteStream(STUDENT_DB_PATH))
            .on("finish", resolve)
            .on("error", reject);
    });
    const gradesPromise = new Promise((resolve, reject) => {
        console.log("Fetching grades.json...");
        request("https://outlier-coding-test-data.onrender.com/grades.json")
            .pipe(fs.createWriteStream(GRADES_JSON_PATH))
            .on("finish", resolve)
            .on("error", reject);
    });

    await promise.all([studentsPromise, gradesPromise]);
    console.log("Done!");
})();
