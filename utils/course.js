const knex = require("../db");
const gradesData = require("../data/grades.json");

/**
 * Get Grade Report for all course
 * @returns {Promise<*>} The report object
 */
const getCourseGradesStatistics = async () => {
  const courses = {};

  gradesData.forEach((gradeData) => {
    if (!courses[gradeData.course]) {
      courses[gradeData.course] = {
        highest: gradeData.grade,
        lowest: gradeData.grade,
        sum: gradeData.grade,
        count: 1,
      };
    } else {
      const course = courses[gradeData.course];
      course.highest = Math.max(course.highest, gradeData.grade);
      course.lowest = Math.min(course.lowest, gradeData.grade);
      course.sum += gradeData.grade;
      course.count++;
    }
  });

  const report = Object.entries(courses).reduce((acc, [course, data]) => {
    const average = data.sum / data.count;
    acc[course] = {
      highest: data.highest,
      lowest: data.lowest,
      average,
    };
    return acc;
  }, {});

  return report;
};

module.exports = {
  getCourseGradesStatistics,
};
