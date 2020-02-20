// JOB MODEL

const db = require("../db");
const sqlForPartialUpdate = require("../helpers/partialUpdate");

class Job {
  /**
   * CRUD for companies
   */

  /** Create a new job */
  static async create({ title, salary, equity, company_handle }) {
    const results = await db.query(
      `INSERT INTO jobs 
        (title, salary, equity, company_handle)
        VALUES ($1, $2, $3, $4)
        RETURNING title, salary, equity, company_handle`,
      [title, salary, equity, company_handle]
    );

    return results.rows[0];
  }

  /** search takes in a term, and optional min salary and min equity. */
  static async search(searchTerm = "", min_salary = 0, min_equity = 0) {
    let q = `%${searchTerm}%`;
    const results = await db.query(
      `SELECT title, company_handle 
        FROM jobs 
        WHERE title ILIKE $1 
          AND salary >= $2 AND equity >= $3`,
      [q, min_salary, min_equity]
    );
    return results.rows;
  }

  /** Get a job by id */
  static async get(id) {
    const result = await db.query(
      `SELECT id, title, salary, equity, company_handle, date_posted
        FROM jobs
        WHERE id = $1`,
      [id]
    );

    return result.rows[0];
  }

  /** Update existing job by id */
  static async update(id, body) {
    const { title, salary, equity } = body;
    // destructuring because company handle should not be updated here 
    // doesn't throw an error if a nonexistent company handle is passed in 
    const items = { title, salary, equity };
    const { query, values } = sqlForPartialUpdate("jobs", items, "id", id);
    const result = await db.query(query, [...values]);
    return result.rows[0];
  }

  /** Deletes an existing job by id */
  static async delete(id) {
    const result = await db.query(
      `DELETE from jobs 
        WHERE id = $1
        RETURNING id`,
      [id]
    );

    return result.rows[0];
  }

}

module.exports = Job;