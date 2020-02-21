// ROUTES FOR /LOGIN

const express = require("express");
const User = require("../models/user");

const router = new express.Router();

router.post("/", async function(req, res, next) {
	try {
		const token = await User.authenticate(req.body);
		if (!token) {
			throw new ExpressError("Invalid user/password", 400);
		}
		return res.json({ _token: token });
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
