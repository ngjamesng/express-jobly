const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

function authenticateJWT(req, res, next) {
	try {
		const tokenFromBody = req.body._token;
    const payload = jwt.verify(tokenFromBody, SECRET_KEY);
		req.user = payload;
		return next();
	} catch (err) {
    return next({ status: 401, message: "Unauthorized" });
	}
}

function ensureCorrectUser(req, res, next) {
	try {
		// may need to change this. Can replicate/forge being the correct user in the req.body
		const tokenFromBody = req.body._token;
		const payload = jwt.decode(tokenFromBody);
		if (payload.username === req.params.username) {
			return next();
		} else {
			return next({ status: 401, message: "Unauthorized" });
		}
	} catch (err) {
		return next(err);
	}
}

function ensureAdmin(req, res, next) {
	try {
		const tokenFromBody = req.body._token;
		payload = jwt.decode(tokenFromBody);
		if (payload.is_admin === true) {
			return next();
		} else {
			return next({ status: 401, message: "Unauthorized" });
		}
	} catch (err) {
		return next(err);
	}
}

module.exports = {
	authenticateJWT,
	ensureCorrectUser,
	ensureAdmin
};
