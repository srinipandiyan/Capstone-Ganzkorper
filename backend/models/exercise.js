"use strict";

const db = require("../db");
const { v4: uuidv4 } = require('uuid');
const { NotFoundError} = require("../expressError");

/** Related functions for exercises. */

class Exercise {
/** Creates an exercise, updates the db, and returns the new exercise data.
   * Accepts workout_id and JSON data from API as API
   * Returns { id, workout_id, exercise_data, weight_used, num_sets, num_reps, created_at }
   **/

static async create(workoutId, API) {
    const id = uuidv4();
    const { name, type, muscle, equipment, difficulty, instructions } = API;
    const result = await db.query(
          `INSERT INTO exercises (id, workout_id, name, type, muscle, equipment, difficulty, instructions)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           RETURNING id, workout_id AS "workoutId", name, type, muscle, equipment, difficulty, instructions`,
        [id, workoutId, name, type, muscle, equipment, difficulty, instructions]);

    let exercise = result.rows[0];

    return exercise;
  }

  /** Finds all histories associated with the exercise id
   *  Returns [ history, ...]
   *   where history is { id, exercise_id, exercise_data, weight_used, num_sets, num_reps, created_at }
   * */
  
  static async getHistories(exerciseId) {
    const historiesQuery = await db.query(
      `SELECT id, exercise_id, weight_used, num_sets, num_reps, created_at
       FROM histories
       WHERE exercise_id = $1`,
      [exerciseId],
    );
  
    const histories = historiesQuery.rows.map(row => ({
        id: row.id,
        exerciseId: row.exercise_id,
        weightUsed: row.weight_used,
        numSets: row.num_sets,
        numReps: row.num_reps,
        createdAt: row.created_at
    }));

    if (!histories) {
        throw new NotFoundError(`No histories found for exercise id: ${exerciseId}`);
    };
  
    return histories;
  }
  

  /** 
   * Deletes exercise from database given an id; returns undefined.
   * Throws NotFoundError if workout cannot be found in db query.
   **/

  static async remove(id) {
    const result = await db.query(
          `DELETE
           FROM exercises
           WHERE id = $1
           RETURNING id`, [id]);
    const exercise = result.rows[0];

    if (!exercise) {
        throw new NotFoundError(`No exercise found with id: ${id}`);
    }
  }

};

module.exports = Exercise;