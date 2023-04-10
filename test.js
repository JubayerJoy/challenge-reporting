const tape = require('tape')
const jsonist = require('jsonist')

const port = (process.env.PORT = process.env.PORT || require('get-port-sync')())
const endpoint = `http://localhost:${port}`

const server = require('./server')

const STUDNENT_1_GRADES = [
  {
    "course": "Calculus",
    "grade": 50
  },
  {
    "course": "Microeconomics",
    "grade": 43
  },
  {
    "course": "Statistics",
    "grade": 50
  },
  {
    "course": "Astronomy",
    "grade": 63
  }
]

tape('health', async function (t) {
  const url = `${endpoint}/health`
  try {
    const { data, response } = await jsonist.get(url)
    if (response.statusCode !== 200) {
      throw new Error('Error connecting to sqlite database; did you initialize it by running `npm run init-db`?')
    }
    t.ok(data.success, 'should have successful healthcheck')
    t.end()
  } catch (e) {
    t.error(e)
  }
})

/**
 * Test for `/student/:id` endpoint
 * 1. Should should return correct student information when given a valid ID
 * 2. Should return 404 when given an invalid ID 
 */
tape('getStudent should return correct student information when given a valid ID', async (t) => {
  try {
    const url = `${endpoint}/student/1`
    const { data: result, response } = await jsonist.get(url)
    const { success, data } = result;
    t.equal(response.statusCode, 200, 'should return 200')
    t.equal(success, true, 'should return success as true')
    t.equal(data.student.id, 1, 'should return student with id 1')
    t.end()
  } catch (e) {
    t.error(e);
  }
})

tape('getStudent should return 404 when given an invalid ID', async (t) => {
  try {
    const url = `${endpoint}/student/-1`
    const { data: result, response } = await jsonist.get(url)
    const { success, error } = result;
    t.equal(response.statusCode, 404, 'should return 404')
    t.equal(success, false, 'should return success as false')
    t.equal(error, 'Student not found.', 'should return student not found')
    t.end()
  } catch (e) {
    t.error(e);
  }
})

/**
 * Test for `/student/:id/grades` endpoint
 * 1. Should should return correct student and grade information when given a valid ID
 * 2. Should return 404 when given an invalid ID 
 */
tape('getStudentGradesReport should return correct student and grade information when given a valid ID', async (t) => {
  try {
    const url = `${endpoint}/student/1/grades`
    const { data: result, response } = await jsonist.get(url)
    const { success, data } = result;
    t.equal(response.statusCode, 200, 'should return 200')
    t.equal(success, true, 'should return success as true')
    t.equal(data.student.id, 1, 'should return student with id 1')
    t.deepEqual(data.grades, STUDNENT_1_GRADES, 'should return correct grades');
    t.end()
  } catch (e) {
    t.error(e);
  }
})

tape('getStudentGradesReport should return 404 when given an invalid ID', async (t) => {
  try {
    const url = `${endpoint}/student/-1/grades`
    const { data: result, response } = await jsonist.get(url)
    const { success, error } = result;
    t.equal(response.statusCode, 404, 'should return 404')
    t.equal(success, false, 'should return success as false')
    t.equal(error, 'Student not found.', 'should return student not found')
    t.end()
  } catch (e) {
    t.error(e);
  }
})

tape('cleanup', function (t) {
  server.closeDB()
  server.close()
  t.end()
})
