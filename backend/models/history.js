"use strict";

const db = require("../db");
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');
const { NotFoundError} = require("../expressError");

/** Related functions for histories. */

class History {
/** Creates a history session, updates the db, and returns the new history data.
   * Accepts exercise_id and a useInput object: { weightsUsed, numSets, numReps }
   * Returns { id, exercise_id, weight_used, num_sets, num_reps, created_at }
   **/

static async create(exerciseId, userInput) {
    const id = uuidv4();
    const { weightUsed, numSets, numReps } = userInput;
    const createdAt = moment().format('MM-DD-YYYY');
    const result = await db.query(
          `INSERT INTO histories (id, exercise_id, weight_used, num_sets, num_reps, created_at)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING id, exercise_id AS "exerciseId", weight_used AS "weightUsed", num_sets AS "numSets", num_reps AS "numReps", created_at AS "createdAt"`,
        [id, exerciseId, weightUsed, numSets, numReps, createdAt]);

    let history = result.rows[0];

    return history;
  }

  /** 
   * Deletes history from database given an id; returns undefined.
   * Throws NotFoundError if workout cannot be found in db query.
   **/

  static async remove(id) {
    const result = await db.query(
          `DELETE
           FROM histories
           WHERE id = $1
           RETURNING id`, [id]);
    const history = result.rows[0];

    if (!history) {
        throw new NotFoundError(`No history found with id: ${id}`);
    }
  }

};

module.exports = History;