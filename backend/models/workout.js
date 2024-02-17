"use strict";

const db = require("../db");
const { v4: uuidv4 } = require('uuid');
const { sqlForPartialUpdate } = require("../helpers/sql");
const { NotFoundError} = require("../expressError");

/** Related functions for workouts. */

class Workout {
/** Creates a workout, updates the db, and returns the new workout data.
   *
   * Returns { id, user_id, workout_name }
   **/

static async create(user, workoutName) {
    const id = uuidv4();
    const result = await db.query(
          `INSERT INTO workouts (id, user_id, workout_name)
           VALUES ($1, $2, $3)
           RETURNING id, user, workout_name AS "workoutName"`,
        [ id, user, workoutName ]);

    let workout = result.rows[0];

    return workout;
  }

  /** Finds all exercises associated with the workout id
   *  Returns [ exercise, ...]
   *   where exercise is { id, workoutId, name, type, muscle, equipment, difficulty, instructions }
   * */
  
  static async getExercises(workoutName) {
    const exercisesQuery = await db.query(
      `SELECT id, name, type, muscle, equipment, difficulty, instructions
       FROM exercises
       WHERE name = $1`,
      [workoutName],
    );
  
    const exercises = exercisesQuery.rows.map(row => ({
      id: row.id,
      workoutId: row.workout_id,
      name: workoutName,
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

  /** Update workout name.
   * 
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   * 
   * Data can include:
   *   { name: 'new_workout_name' }
   * 
   * returns workout { name }
  */
  static async update(workoutName, newName) {
    const { setCols, values } = sqlForPartialUpdate(
      { name: newName },
      {
        name: "name",
      });

      const workoutNameVarIdx = "$" + (values.length + 1);

    const querySql = `
      UPDATE users
      SET ${setCols}
      WHERE username = $${workoutNameVarIdx} 
      RETURNING *
    `;

    const result = await db.query(querySql, [...values, workoutName]);
    const updatedWorkout = result.rows[0];

    if (!updatedWorkout) {
      throw new NotFoundError(`No workout found with name: ${workoutName}`);
    }

    return updatedWorkout;
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