"use strict";

const db = require("../db");
const { v4: uuidv4 } = require('uuid');
const { NotFoundError} = require("../expressError");

/** Related functions for workouts. */

class Workout {
/** Creates a workout, updates the db, and returns the new workout data.
   *
   * Returns { id, user_id, workout_name }
   **/

static async create(userId, workoutName) {
    const id = uuidv4();
    const result = await db.query(
          `INSERT INTO workouts (id, user_id, workout_name)
           VALUES ($1, $2, $3)
           RETURNING id, user_id AS "userId", workout_name AS "workoutName"`,
        [ id, userId, workoutName ]);

    let workout = result.rows[0];

    return workout;
  }

  /** Finds all exercises associated with the workout id
   *  Returns [ exercise, ...]
   *   where exercise is { id, workout_id, exercise_data, weight_used, num_sets, num_reps, created_at }
   * */
  
  static async getExercises(workoutId) {
    const exercisesQuery = await db.query(
      `SELECT id, name, type, muscle, equipment, difficulty, instructions
       FROM exercises
       WHERE workout_id = $1`,
      [workoutId],
    );
  
    const exercises = exercisesQuery.rows.map(row => ({
      id: row.id,
      workoutId: workoutId,
      name: row.name,
      type: row.type,
      muscle: row.muscle,
      equipment: row.equipment,
      difficulty: row.difficulty,
      instructions: row.instructions,
    }));
  
    if (!exercises.length) {
      throw new NotFoundError(`No exercises found for workout id: ${workoutId}`);
    }
  
    return exercises;
  }
  
  

  /** 
   * Deletes workout from database given an id; returns undefined.
   * Throws NotFoundError if workout cannot be found in db query.
   **/

  static async remove(id) {
    const result = await db.query(
          `DELETE
           FROM workouts
           WHERE id = $1
           RETURNING id`, [id]);
    const workout = result.rows[0];

    if (!workout) {
        throw new NotFoundError(`No workout found with id: ${id}`);
    }
  }

};

module.exports = Workout;