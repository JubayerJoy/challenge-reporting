//const cache = require('node-cache')
//const fetch = require('node:node-fetch')
const knex = require('./db')


module.exports = {
  getHealth,
  getStudent,
  getStudentGradesReport,
  getCourseGradesReport
}

const { getStudentById } = require('./helpers/student');

const cacheTTL = 60 * 60 * 24; // 24 hours
const cacheKey = 'grades';
//const cache = new cache({ stdTTL: cacheTTL, checkperiod: cacheTTL * 0.2, useClones: false });

async function getHealth (req, res, next) {
  try {
    await knex('students').first()
    res.json({ success: true })
  } catch (e) {
    console.log(e)
    res.status(500).end()
  }
}

async function getStudent (req, res, next) {
  try {
    const studentId = req.params.id;
    const studentInfo = await getStudentById(studentId);
    if(!studentInfo) {
      res.status(404).json({ success: false, errorMessage: "Student not found." });
      return;
    }
    res.status(200).json({ success: true, studentInfo });
  }
  catch (error) {
    // send error to error handler middleware
    next(error);
  }
}

async function getStudentGradesReport (req, res, next) {
  throw new Error('This method has not been implemented yet.')
}

async function getCourseGradesReport (req, res, next) {
  throw new Error('This method has not been implemented yet.')
}
