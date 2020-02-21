// ROUTES FOR /USERS

const express = require("express");
const User = require("../models/user");
const ExpressError = require("../helpers/expressError");
const jsonSchema = require("jsonschema");
const userCreateSchema = require("../schemas/userCreateSchema.json");
const userUpdateSchema = require("../schemas/userUpdateSchema.json");

const router = new express.Router();

// create a new user, returns newly created => {user: user}
router.post("/", async function (req, res, next) {
  try {
    const result = jsonSchema.validate(req.body, userCreateSchema);
    if (!result.valid) {
      //Throws listOfErrors if !result.valid
      throw new ExpressError(result.errors.map((e) => e.stack), 400);
    }
    const newUser = await User.create(req.body);
    return res
      .status(201)
      .json({ user: newUser });
  }
  catch (err) {
    return next(err);
  }
});

//returns a list of all users => {users: [{username, first_name, last_name, email}, ...]}
router.get("/", async function (req, res, next) {
  try {
    const users = await User.getAll();
    return res.json({ users });
  }
  catch (err) {
    return next(err);
  }
});

//get a user object by username => {user: {username, first_name, last_name, email, photo_url}}
router.get("/:username", async function (req, res, next) {
  try {
    const username = req.params.username;
    const user = await User.get(username);
    if (!user) {
      throw new ExpressError(`No such user: ${username}`, 404);
    }
    return res.json({ user });
  }
  catch (err) {
    return next(err);
  }
});

/** Updates an existing user by username
 * returns updated user info => {user: {username, first_name, last_name, email, photo_url}}
 */
router.patch("/:username", async function (req, res, next) {
  try {
    const result = jsonSchema.validate(req.body, userUpdateSchema);
    if (!result.valid) {
      //Throws listOfErrors if !result.valid
      throw new ExpressError(result.errors.map((e) => e.stack), 400);
    }
    const username = req.params.username;
    const user = await User.update(username, req.body);
    if (!user) {
      throw new ExpressError(`No such user: ${username}`, 404);
    }
    return res.json({ user });
  }
  catch (err) {
    return next(err);
  }
});

/** DELETE/users/[username] 
 * Deletes an existing user by username */
router.delete("/:username", async function (req, res, next) {
  try {
    const username = req.params.username;
    const user = await User.delete(username);
    if (!user) {
      throw new ExpressError(`Cannot delete user: ${username}`, 404);
    }
    return res.json({ message: "User deleted" });
  }
  catch (err) {
    return next(err);
  }
});



module.exports = router;
