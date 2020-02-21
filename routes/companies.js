//ROUTES FOR /COMPANIES

const express = require("express");
const Company = require("../models/company");
const db = require("../db");
const config = require("../config");
const ExpressError = require("../helpers/expressError");
const jsonSchema = require("jsonschema");
const companySchema = require("../schemas/companySchema.json");

const { authenticateJWT, ensureAdmin } = require("../middleware/auth")

const router = new express.Router();

// create a new company, returns newly created => {company: companyData}
router.post("/", ensureAdmin, async function (req, res, next) {
	try {
		const result = jsonSchema.validate(req.body, companySchema);
		if (!result.valid) {
			//Throws listOfErrors if !result.valid
			throw new ExpressError(result.errors.map((e) => e.stack), 400);
		}
		// const { handle, name, num_employees, description, logo_url } = req.body;
		//Should we just pass in req.body, or individually pass in data?
		const newCompany = await Company.create(req.body);
		return res
			.status(201)
			.json({ company: newCompany });
	} catch (err) {
		return next(err);
	}
});

//returns a list of companies => {companies: [companyData, ...]}
router.get("/", authenticateJWT, async function (req, res, next) {
	try {
		const { search: searchTerm, min_employees, max_employees } = req.body;
		if (min_employees > max_employees) {
			throw new ExpressError("min_employees cannot be greater than max_employees", 400);
		}
		const companies = await Company.search(searchTerm, max_employees, min_employees);
		return res.json({ companies });
	} catch (err) {
		return next(err);
	}
});

/**  GET/companies/[handle]
 get company by handle => return {company: {...companyData, jobs: [job, ...]}}
*/
router.get("/:handle", authenticateJWT, async function (req, res, next) {
	try {
		const handle = req.params.handle;
		const company = await Company.get(handle);
		if (!company) {
			throw new ExpressError(`No such company with handle: ${handle}`, 404);
		}

		const companyJobs = await Company.getCompanyJobs(handle);
		return res.json({ company, jobs: companyJobs });
	} catch (err) {
		return next(err);
	}
});

/** Updates an existing company by handle
 * returns updated company info => return {company: companyData}
 */
router.patch("/:handle", ensureAdmin, async function (req, res, next) {
	try {
		if ("handle" in req.body) {
			throw new ExpressError("Not allowed to change handle", 400);
		}

		const result = jsonSchema.validate(req.body, companySchema);
		if (!result.valid) {
			//Throws listOfErrors if !result.valid
			throw new ExpressError(result.errors.map((e) => e.stack), 400);
		}

		const handle = req.params.handle;
		const company = await Company.update(handle, req.body);
		if (!company) {
			throw new ExpressError(`No such company with handle: ${handle}`, 404);
		}
		return res.json({ company });
	} catch (err) {
		return next(err);
	}
});

/** DELETE/companies/[handle] 
 * Deletes an existing company by handle */
router.delete("/:handle", ensureAdmin, async function (req, res, next) {
	try {
		const handle = req.params.handle;
		const company = await Company.delete(handle);
		if (!company) {
			throw new ExpressError(`Cannot delete company handle: ${handle}`, 404);
		}
		return res.json({ message: "Company deleted" });
	}
	catch (err) {
		return next(err);
	}
});


module.exports = router;
