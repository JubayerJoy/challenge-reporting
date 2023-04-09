const knex = require('./../db');

/**
 * Get a student by their ID
 * @param {number} studentId
 * @returns {Promise<*>} The student object
 */
const getStudentById = async (studentId) => {
    return await knex('students').select().where({ id: studentId }).first()
}

module.exports = {
    getStudentById
}