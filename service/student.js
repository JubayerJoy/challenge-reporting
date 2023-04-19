const knex = require("../db");
const gradesData = require("../data/grades.json");

/**
 * Get a student by their ID
 * @param {number} studentId
 * @returns {Promise<*>} The student object
 */
const getStudentById = async (studentId) => {
  return await knex("students").select().where({ id: studentId }).first();
};

/**
 * Get a students grades by their ID
 * @param {number} studentId
 * @returns {Promise<*>} The result object
 */
const getStudentGradesById = async (studentId) => {
  const data = await gradesData
    .filter((grade) => String(grade.id) === studentId)
    .map((data) => {
      const { course, grade } = data;
      return { course, grade };
    });
  return data;
};

module.exports = {
  getStudentById,
  getStudentGradesById,
};
