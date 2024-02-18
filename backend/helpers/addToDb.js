const axios = require("axios");

//Helper function to add exercise to the database
async function addExerciseToDatabase(exercise) {
  try {
      await axios.post('/', exercise);
  } catch (error) {
      console.error('Error adding exercise to database:', error);
  }
}

module.exports = { addExerciseToDatabase };