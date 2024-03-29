"use strict";

/** Routes for histories. */

const jsonschema = require("jsonschema");

const express = require("express");
const { verifyUserOrAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const Exercise = require("../models/exercise");
const History = require("../models/history");
const historyCreateSchema = require("../schemas/historyCreate.json");

const router = new express.Router();

/** GET / => { [ { id, userRef, exerciseId, weightUsed, numSets, numReps, createdAt }, ... ] }
 *
 * Returns list of all histories for a workout.
 *
 * Authorization required: username-matched user or admin
 **/
router.get("/", verifyUserOrAdmin, async function (req, res, next) {
  try {
    const histories = await Exercise.getHistories(req.body);
    return res.json({ histories });
  } catch (err) {
    return next(err);
  }
});

/** POST / => { id, user_id, exercise_id, weight_used, num_sets, num_reps }
 * Creates a history session for an exercise.
 *
 * Authorization required: username-matched user or admin
 **/
router.post("/", verifyUserOrAdmin, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, historyCreateSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
      const history = await History.create(req.body);
      return res.status(201).json({ history });
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
      await History.remove(req.params.id);
      return res.json({ deleted: req.params.id });
    } catch (err) {
      return next(err);
    }
});
  
  
module.exports = router;