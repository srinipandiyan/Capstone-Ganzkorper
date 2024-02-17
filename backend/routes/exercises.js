"use strict";

/** Routes for exercises. */

const jsonschema = require("jsonschema");
const request = require("request-promise");

const express = require("express");
const { verifyUserOrAdmin, verifyAdmin } = require("../middleware/auth");
const { addExerciseToDatabase } = require("../helpers/addToDb")
const { BadRequestError } = require("../expressError");
const Exercise = require("../models/exercise");
const API_KEY = require("../config");
const exerciseSchema = require("../schemas/exercise.json");

const router = new express.Router();

/** GET /[exerciseId] => { [ { id, exerciseId, weightUsed, numSets, numReps, createdAt }, ... ] }
 *
 * Returns list of all histories for a workout.
 *
 * Authorization required: username-matched user or admin
 **/
router.get("/:exerciseId", verifyUserOrAdmin, async function (req, res, next) {
    try {
      const histories = await Exercise.getHistories(req.params.exerciseId);
      return res.json({ histories });
    } catch (err) {
      return next(err);
    }
});

/** GET /[muscle] => { [ { name, type, muscle, equipment, difficulty, instructions }, ... ] }
 *
 * Returns a list of matching exercises by muscle query.
 *
 * Authorization required: username-matched user or admin
 **/
router.get("/:muscle", verifyUserOrAdmin, async function (req, res, next) {
    try {
      const muscle = req.params.muscle;

      //Make a GET request to the external API to fetch exercises by muscle
      const response = await request.get({
        url: `https://api.api-ninjas.com/v1/exercises?muscle=${muscle}`,
        headers: {
          'X-Api-Key': API_KEY
        }
      });

      const exercisesList = JSON.parse(response);
      
      //exercise validation
      exercisesList.forEach(exercise => {
        const validator = jsonschema.validate(exercise, exerciseSchema);
        if (!validator.valid) {
          const errs = validator.errors.map(e => e.stack);
          throw new BadRequestError(errs);
        }
      });
      
      //Add all exercises in API call to exercise table in database
      for (const exercise of exercisesList) {
        await addExerciseToDatabase(exercise);
      }

      return res.json({ exercisesList });
    } catch (error) {
      return next(error);
    }
});

/** POST / => { id, workout_id, name, type, muscle, equipment, difficulty, instructions }
 * Creates an exercise for use in database.
 *
 * Authorization required: username-matched user or admin
 **/
router.post("/", verifyUserOrAdmin, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, exerciseSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
      const exercise = await Exercise.create(req.body);
      return res.status(201).json({ exercise });
    } catch (err) {
      return next(err);
    }
});

/** DELETE /[id]  =>  { deleted: id }
 *
 * Authorization required: username-matched user or admin
 **/

router.delete("/:id", verifyAdmin, async function (req, res, next) {
    try {
      await Exercise.remove(req.params.id);
      return res.json({ deleted: req.params.id });
    } catch (err) {
      return next(err);
    }
});
  
  
module.exports = router;