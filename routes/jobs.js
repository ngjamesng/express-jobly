// ROUTES FOR /JOBS

const express = require("express");
const Job = require("../models/job");
const db = require("../db");
const config = require("../config");
const ExpressError = require("../helpers/expressError");
const jsonSchema = require("jsonschema");
const jobCreateSchema = require("../schemas/jobCreateSchema.json");
const jobUpdateSchema = require("../schemas/jobUpdateSchema.json");

const router = new express.Router();

// create a new job, returns newly created => {job: jobData}
router.post("/", async function (req, res, next) {
  try {
    const result = jsonSchema.validate(req.body, jobCreateSchema);
    if (!result.valid) {
      //Throws listOfErrors if !result.valid
      throw new ExpressError(result.errors.map((e) => e.stack), 400);
    }
    const newJob = await Job.create(req.body);
    return res
      .status(201)
      .json({ job: newJob });
  }
  catch (err) {
    return next(err);
  }
});

//returns a list of jobs => {jobs: [job, ...]}
router.get("/", async function (req, res, next) {
  try {
    const { search: searchTerm, min_salary, min_equity } = req.body;
    const jobs = await Job.search(searchTerm, min_salary, min_equity);
    return res.json({ jobs });
  }
  catch (err) {
    return next(err);
  }
});

/**  GET/jobs/[id]
 get job by id => return {job: jobData}
*/
router.get("/:id", async function (req, res, next) {
  try {
    const id = req.params.id;
    const job = await Job.get(id);
    if (!job) {
      throw new ExpressError(`No such job of id: ${id}`, 404);
    }
    return res.json({ job });
  }
  catch (err) {
    return next(err);
  }
});

/** Updates an existing job by id
 * returns updated job info => return {job: jobData}
 */
router.patch("/:id", async function (req, res, next) {
  try {
    const result = jsonSchema.validate(req.body, jobUpdateSchema);
    if (!result.valid) {
      //Throws listOfErrors if !result.valid
      throw new ExpressError(result.errors.map((e) => e.stack), 400);
    }
    const id = req.params.id;
    const job = await Job.update(id, req.body);
    if (!job) {
      throw new ExpressError(`No such job of id: ${id}`, 404);
    }
    return res.json({ job });
  }
  catch (err) {
    return next(err);
  }
});

/** DELETE/jobs/[id] 
 * Deletes an existing job by id */
router.delete("/:id", async function (req, res, next) {
  try {
    const id = req.params.id;
    const job = await Job.delete(id);
    if (!job) {
      throw new ExpressError(`Cannot delete job of id: ${id}`, 404);
    }
    return res.json({ message: "Job deleted" });
  }
  catch (err) {
    return next(err);
  }
});


module.exports = router;
