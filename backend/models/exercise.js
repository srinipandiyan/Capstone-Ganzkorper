"use strict";

const db = require("../db");
const { v4: uuidv4 } = require('uuid');
const { NotFoundError} = require("../expressError");

/** Related functions for exercises. */

class Exercise {
/** Creates an exercise, updates the db, and returns the new exercise data.
   * Accepts workout_id and JSON data from API as data
   * Returns { id, workout_id, name, type, muscle, equipment, difficulty, instructions }
   **/

static async create(data) {
    const id = uuidv4();
    const { name, type, muscle, equipment, difficulty, instructions } = data;
    const result = await db.query(
          `INSERT INTO exercises (id, name, type, muscle, equipment, difficulty, instructions)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           RETURNING id, name, type, muscle, equipment, difficulty, instructions`,
        [id, name, type, muscle, equipment, difficulty, instructions]);

    let exercise = result.rows[0];

    return exercise;
  }

  /** Finds all histories associated with the exercise id
   *  Returns [ history, ...]
   *   where history is { id, exercise_id, weight_used, num_sets, num_reps, created_at }
   * */
  
  static async getHistories(userRef, exerciseId) {
    const historiesQuery = await db.query(
      `SELECT id, exercise_id, weight_used, num_sets, num_reps, created_at
       FROM histories
       WHERE user_ref = $1 AND exercise_id = $2`,
      [userRef, exerciseId],
    );
  
    const histories = historiesQuery.rows.map(row => ({
        id: row.id,
        userRef: row.user_ref,
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