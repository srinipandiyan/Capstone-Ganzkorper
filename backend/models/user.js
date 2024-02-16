"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require('uuid');
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

/** Related functions for users. */

class User {
  /** authenticate user with username, password.
   *
   * Returns { id, username }
   *
   * Throws UnauthorizedError is user not found or wrong password.
   **/

  static async authenticate(username, password) {
    // try to find the user first
    const result = await db.query(
          `SELECT id,
                  username,
                  password
           FROM users
           WHERE username = $1`,
        [username],
    );

    const user = result.rows[0];

    if (user) {
      // compare hashed password to a new hash from password
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        delete user.password;
        return user;
      }
    }

    throw new UnauthorizedError("Invalid username/password");
  }

  /** Register user with data.
   *
   * Returns { id, username,  }
   *
   * Throws BadRequestError on duplicates.
   **/

  static async register(
      { username, password }) {
    const duplicateCheck = await db.query(
          `SELECT username
           FROM users
           WHERE username = $1`,
        [username],
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate username: ${username}`);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
    const id = uuidv4();

    const result = await db.query(
          `INSERT INTO users (id, username, password)
           VALUES ($1, $2, $3)
           RETURNING id, username`,
        [ id, username, hashedPassword],
    );

    const user = result.rows[0];

    return user;
  }
  
  /** Given a username, return data about user.
   *
   * Returns [ workouts, ...]
   *   where workouts is { id, workout_name }
   *
   * Throws NotFoundError if user not found.
   **/

  static async getWorkouts(username) {
    const userAndWorkoutQuery = await db.query(
      `SELECT u.id AS "userId",
              u.username,
              w.id AS "workoutId",
              w.workout_name
       FROM users u
       LEFT JOIN workouts w ON u.id = w.user_id
       WHERE u.username = $1`,
      [username],
    );
  
    const userData = userAndWorkoutQuery.rows[0];
  
    if (!userData) {
      throw new NotFoundError(`No user found with username: ${username}`);
    }
  
    const workouts = [];
  
    userAndWorkoutQuery.rows.forEach(row => {
      if (row.workoutId) {
        workouts.push({
          id: row.workoutId,
          workout_name: row.workout_name
        });
      }
    });
  
    return workouts;
  }  

  /** Delete given user from database; returns undefined. */

  static async remove(username) {
    let result = await db.query(
          `DELETE
           FROM users
           WHERE username = $1
           RETURNING username`,
        [username],
    );
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);
  }
}

module.exports = User;