const request = require("request-promise");

//Helper function to add exercise to the database
async function addExerciseToDatabase(exercise) {
    try {
      await request.post({
        url: '/add',
        json: exercise
      });
    } catch (error) {
      console.error('Error adding exercise to database:', error);
    }
}

module.exports = { addExerciseToDatabase };