const tape = require("tape");
const jsonist = require("jsonist");
const httpMocks = require("node-mocks-http");
const { handleError, notFound } = require("../middleware");

const port = (process.env.PORT =
  process.env.PORT || require("get-port-sync")());
const endpoint = `http://localhost:${port}`;

const server = require("../server");

const STUDNENT_1_GRADES = [
  {
    course: "Calculus",
    grade: 50,
  },
  {
    course: "Microeconomics",
    grade: 43,
  },
  {
    course: "Statistics",
    grade: 50,
  },
  {
    course: "Astronomy",
    grade: 63,
  },
];

tape("health", async function (t) {
  const url = `${endpoint}/health`;
  try {
    const { data, response } = await jsonist.get(url);
    if (response.statusCode !== 200) {
      throw new Error(
        "Error connecting to sqlite database; did you initialize it by running `npm run init-db`?"
      );
    }
    t.ok(data.success, "should have successful healthcheck");
    t.end();
  } catch (e) {
    t.error(e);
  }
});

/**
 * Test for `/student/:id` endpoint
 * 1. Should should return correct student information when given a valid ID
 * 2. Should return 404 when given an invalid ID
 */
tape(
  "getStudent should return correct student information when given a valid ID",
  async (t) => {
    try {
      const url = `${endpoint}/student/1`;
      const { data: result, response } = await jsonist.get(url);
      const { success, data } = result;
      t.equal(response.statusCode, 200, "should return 200");
      t.equal(success, true, "should return success as true");
      t.equal(data.student.id, 1, "should return student with id 1");
      t.end();
    } catch (e) {
      t.error(e);
    }
  }
);

tape("getStudent should return 404 when given an invalid ID", async (t) => {
  try {
    const url = `${endpoint}/student/-1`;
    const { data: result, response } = await jsonist.get(url);
    const { success, error } = result;
    t.equal(response.statusCode, 404, "should return 404");
    t.equal(success, false, "should return success as false");
    t.equal(error, "Student not found.", "should return student not found");
    t.end();
  } catch (e) {
    t.error(e);
  }
});

/**
 * Test for `/student/:id/grades` endpoint
 * 1. Should should return correct student and grade information when given a valid ID
 * 2. Should return 404 when given an invalid ID
 */
tape(
  "getStudentGradesReport should return correct student and grade information when given a valid ID",
  async (t) => {
    try {
      const url = `${endpoint}/student/1/grades`;
      const { data: result, response } = await jsonist.get(url);
      const { success, data } = result;
      t.equal(response.statusCode, 200, "should return 200");
      t.equal(success, true, "should return success as true");
      t.equal(data.student.id, 1, "should return student with id 1");
      t.deepEqual(
        data.grades,
        STUDNENT_1_GRADES,
        "should return correct grades"
      );
      t.end();
    } catch (e) {
      t.error(e);
    }
  }
);

tape(
  "getStudentGradesReport should return 404 when given an invalid ID",
  async (t) => {
    try {
      const url = `${endpoint}/student/-1/grades`;
      const { data: result, response } = await jsonist.get(url);
      const { success, error } = result;
      t.equal(response.statusCode, 404, "should return 404");
      t.equal(success, false, "should return success as false");
      t.equal(error, "Student not found.", "should return student not found");
      t.end();
    } catch (e) {
      t.error(e);
    }
  }
);

/**
 * Test for `/course/all/grades` endpoint
 * 1. Should should return grades statistics for all courses
 */
tape(
  "getStudentGradesReport should return correct student and grade information when given a valid ID",
  async (t) => {
    try {
      const url = `${endpoint}/course/all/grades`;
      const { data: result, response } = await jsonist.get(url);
      const { success, data } = result;
      t.equal(response.statusCode, 200, "should return 200");
      t.equal(success, true, "should return success as true");

      // check response has correct keys
      t.ok(
        data.hasOwnProperty("Calculus"),
        "should return grades for Calculus"
      );
      t.ok(
        data.hasOwnProperty("Microeconomics"),
        "should return grades for Microeconomics"
      );
      t.ok(
        data.hasOwnProperty("Statistics"),
        "should return grades for Statistics"
      );
      t.ok(
        data.hasOwnProperty("Astronomy"),
        "should return grades for Astronomy"
      );

      // check response has correct nested keys
      t.ok(
        data.Calculus.hasOwnProperty("highest"),
        "should return highest for Calculus"
      );
      t.ok(
        data.Calculus.hasOwnProperty("lowest"),
        "should return lowest for Calculus"
      );
      t.ok(
        data.Calculus.hasOwnProperty("average"),
        "should return average for Calculus"
      );

      t.ok(
        data.Microeconomics.hasOwnProperty("highest"),
        "should return highest for Microeconomics"
      );
      t.ok(
        data.Microeconomics.hasOwnProperty("lowest"),
        "should return lowest for Microeconomics"
      );
      t.ok(
        data.Microeconomics.hasOwnProperty("average"),
        "should return average for Microeconomics"
      );

      t.ok(
        data.Statistics.hasOwnProperty("highest"),
        "should return highest for Statistics"
      );
      t.ok(
        data.Statistics.hasOwnProperty("lowest"),
        "should return lowest for Statistics"
      );
      t.ok(
        data.Statistics.hasOwnProperty("average"),
        "should return average for Statistics"
      );

      t.ok(
        data.Astronomy.hasOwnProperty("highest"),
        "should return highest for Astronomy"
      );
      t.ok(
        data.Astronomy.hasOwnProperty("lowest"),
        "should return lowest for Astronomy"
      );
      t.ok(
        data.Astronomy.hasOwnProperty("average"),
        "should return average for Astronomy"
      );

      t.end();
    } catch (e) {
      t.error(e);
    }
  }
);

/**
 * Not found middleware tests
 */
tape("notFound middleware function", (t) => {
  t.plan(2);

  const req = httpMocks.createRequest();
  const res = httpMocks.createResponse();

  notFound(req, res);

  t.equal(res.statusCode, 404, "should return 404 status code");
  t.deepEqual(
    JSON.parse(res._getData()),
    { error: "Not Found" },
    "should return Not Found error message"
  );
});

/**
 * Middleware to handle errors tests
 * 1. Should return 500 status code
 * 2. Should return error message
 */
tape("handleError middleware function", (t) => {
  t.plan(6);

  const err = new Error("Something went wrong");
  const req = httpMocks.createRequest();
  let res = httpMocks.createResponse();

  handleError(err, req, res);
  t.equal(res.statusCode, 500, "should return 500 status code");
  t.deepEqual(
    JSON.parse(res._getData()),
    { error: "Internal Server Error" },
    "should return error message"
  );

  // test error response with status code
  const errorWithStatusCode = new Error("Internal Error");
  errorWithStatusCode.statusCode = 512;
  res = httpMocks.createResponse();
  handleError(errorWithStatusCode, req, res);
  t.equal(res.statusCode, 512, "should return 512 status code");
  t.deepEqual(
    JSON.parse(res._getData()),
    { error: "Internal Error" },
    "should return Internal Error"
  );

  // test Header already sent error
  const headerSentError = new Error("Header already sent");
  res.headersSent = true;
  handleError(headerSentError, req, res, (err) => {
    t.equal(
      err.message,
      "Header already sent",
      "should return Header already sent error"
    );
    t.ok(true, "should call next function");
  });
});

tape("cleanup", function (t) {
  server.closeDB();
  server.close();
  t.end();
});
