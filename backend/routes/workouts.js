"use strict";

/** Routes for workouts. */

const jsonschema = require("jsonschema");

const express = require("express");
const { verifyUserOrAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const Workout = require("../models/workout");
const workoutCreateSchema = require("../schemas/workoutCreate.json");
const workoutUpdateSchema = require("../schemas/workoutUpdate.json");

const router = new express.Router();

/** GET /[workoutName] => { [ { id, workoutId, name, type, muscle, equipment, difficulty, instructions }, ... ] }
 *
 * Returns list of all exercises for a workout.
 *
 * Authorization required: username-matched user or admin
 **/
router.get("/:workoutName", verifyUserOrAdmin, async function (req, res, next) {
    try {
      const exercises = await Workout.getExercises(req.params.workoutName);
      return res.json({ exercises });
    } catch (err) {
      return next(err);
    }
});


/** POST /[user] => { id, user_id, workout_name }
 *
 * Creates a workout.
 *
 * Authorization required: username-matched user or admin
 **/
router.get("/:user", verifyUserOrAdmin, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, workoutCreateSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
      const workout = await Workout.create(req.params.user, req.body);
      return res.json({ workout });
    } catch (err) {
      return next(err);
    }
});


/** PATCH /[workoutName] workoutName => { workout }
 *
 * Data can include:
 *   { name: 'new_workout_name' }
 *
 * Returns { workout }
 *
 * Authorization required: username-matched user or admin
 **/
router.patch("/:workoutName", verifyUserOrAdmin, async function (req, res, next) {
    try {
      const validator = jsonschema.validate(req.body, workoutUpdateSchema);
      if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack);
        throw new BadRequestError(errs);
      }
  
      const workout = await Workout.update(req.params.workoutName, req.body);
      return res.json({ workout });
    } catch (err) {
      return next(err);
    }
});
  
  
/** DELETE /[id]  =>  { deleted: id }
 *
 * Authorization required: username-matched user or admin
 **/

router.delete("/:id", verifyUserOrAdmin, async function (req, res, next) {
    try {
      await Workout.remove(req.params.id);
      return res.json({ deleted: req.params.id });
    } catch (err) {
      return next(err);
    }
});
  
  
module.exports = router;