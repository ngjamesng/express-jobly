const express = require("express");
const Company = require("../models/company");
const db = require("../db");
const config = require("../config");
const ExpressError = require("../helpers/expressError");

const router = new express.Router();

modules.exports = router;

//returns a list of companies => {companies: [companyData, ...]}
router.get("/", async function(req, res, next) {
	try {
    let { search: searchTerm, min_employees, max_employees } = req.body;
    if(min_employees > max_employees) throw new ExpressError("min_employees cannot be greater than max_employees", 400)
    let companies = await Companies.search(searchTerm, max_employees, min_employees);
    return res.json(companies);
	} catch (err) {
		return next(err);
	}
});
