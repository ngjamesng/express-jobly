const db = require("../db");

const expressError = require("../helpers/expressError");

class Company {
	/**
 * CRUD for companies 
 */

  /**
   * 
    search takes in a term, and optional min and max employees. 
   */
	static async search(searchTerm, min_employees = 0, max_employees = Infinity) {
		let q = `%${searchTerm}%`;
		const results = await db.query(
			`SELECT handle, name 
    FROM companies 
    WHERE LOWER(handle) ILIKE $1 
    OR LOWER(name) ILIKE $1`,
			[ q, min_employees, max_employees ]
    );
    return results
	}
}
