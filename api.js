const knex = require("./db");

module.exports = {
  getHealth,
  getStudent,
  getStudentGradesReport,
  getCourseGradesReport,
};

const { getStudentById, getStudentGradesById } = require("./service/student");
const { getCourseGradesStatistics } = require("./service/course");

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
    const student = await getStudentById(studentId);
    if (!student) {
      res.status(404).json({ success: false, error: "Student not found." });
      return;
    }
    res.status(200).json({ success: true, data: { student } });
  } catch (error) {
    // send error to error handler middleware
    next(error);
  }
}

async function getStudentGradesReport(req, res, next) {
  try {
    const { id } = req.params;
    const student = await getStudentById(id);
    if (!student) {
      res.status(404).json({ success: false, error: "Student not found." });
      return;
    }

    const grades = await getStudentGradesById(id);
    const report = {
      success: true,
      data: { student, grades },
    };
    res.json(report);
  } catch (error) {
    next(error);
  }
}

async function getCourseGradesReport(req, res, next) {
  try {
    const data = await getCourseGradesStatistics();
    const report = {
      success: true,
      data,
    };
    res.json(report);
  } catch (error) {
    next(error);
  }
}
