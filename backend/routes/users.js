"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");

const express = require("express");
const { verifyUserOrAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const userUpdateSchema = require("../schemas/userUpdate.json");

const router = express.Router();

/** PATCH /[username] { user } => { user }
 *
 * Data can include:
 *   { username, { username: 'new_username' } }
 *
 * Returns { username }
 *
 * Authorization required: username-matched user or admin
 **/

router.patch("/:username", verifyUserOrAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const user = await User.update(req.params.username, req.body);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});


/** DELETE /[username]  =>  { deleted: username }
 *
 * Authorization required: username-matched user or admin
 **/

router.delete("/:username", verifyUserOrAdmin, async function (req, res, next) {
  try {
    await User.remove(req.params.username);
    return res.json({ deleted: req.params.username });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;
