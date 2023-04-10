const knex = require("./db");
const axios = require("axios");

module.exports = {
  getHealth,
  getStudent,
  getStudentGradesReport,
  getCourseGradesReport,
};

const { getStudentById, getStudentGradesById } = require("./utils/student");

async function getHealth(req, res, next) {
  try {
    await knex("students").first();
    res.json({ success: true });
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
}

async function getStudent(req, res, next) {
  try {
    const studentId = req.params.id;
    const studentInfo = await getStudentById(studentId);
    if (!studentInfo) {
      res
        .status(404)
        .json({ success: false, errorMessage: "Student not found." });
      return;
    }
    res.status(200).json({ success: true, studentInfo });
  } catch (error) {
    // send error to error handler middleware
    next(error);
  }
}

async function getStudentGradesReport(req, res, next) {
  const { id } = req.params;
  const student = await getStudentById(id);
  const grades = await getStudentGradesById(id);
  const report = {
    student,
    grades,
  };
  res.json(report);
}

async function getCourseGradesReport(req, res, next) {
  throw new Error("This method has not been implemented yet.");
}
