// COMPANY MODEL

const db = require("../db");
const sqlForPartialUpdate = require("../helpers/partialUpdate");
const expressError = require("../helpers/expressError");

class Company {
  /**
   * CRUD for companies 
   */

  /** Create new company */
  static async create({ handle, name, num_employees, description, logo_url }) {
    const results = await db.query(
      `INSERT INTO companies 
        (handle, name, num_employees, description, logo_url)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING handle, name, num_employees, description, logo_url`,
      [handle, name, num_employees, description, logo_url]
    );

    return results.rows[0];
  }

  /** search takes in a term, and optional min and max employees. */
  static async search(searchTerm = "", min_employees = 0, max_employees = 1000000) {
    let q = `%${searchTerm}%`;
    const results = await db.query(
      `SELECT handle, name 
      FROM companies 
      WHERE LOWER(handle) ILIKE $1 
        OR LOWER(name) ILIKE $1
        AND num_employees >= $2 AND num_employees <= $3`,
      [q, min_employees, max_employees]
    );
    return results.rows;
  }

  /** Get a company by HANDLE */
  // static async get(handle) {
  //   const result = await db.query(
  //     `SELECT handle, name, num_employees, description, logo_url 
  //       FROM companies
  //       WHERE handle = $1`,
  //     [handle]
  //   );

  //   return result.rows[0];
  // }

  static async get(handle) {
    const result = await db.query(
      `SELECT handle, name, num_employees, description, logo_url, json_agg(jobs.*) AS jobs
        FROM companies
        FULL OUTER JOIN jobs
        ON jobs.company_handle = companies.handle
        WHERE handle = $1
        GROUP BY handle`,
      [handle]
    );
    if (result.rows[0].jobs[0] === null) {
      result.rows[0].jobs = [];
    }
    return result.rows[0];
  }

  /** Get a company's jobs by HANDLE */
  // static async getCompanyJobs(handle) {
  //   const result = await db.query(
  //     `SELECT id, title, salary, equity, date_posted
  //       FROM jobs
  //       WHERE company_handle = $1`,
  //     [handle]
  //   );

  //   return result.rows;
  // }

  /** Update exisiting company by handle */
  static async update(handle, body) {
    const { query, values } = sqlForPartialUpdate("companies", body, "handle", handle);
    const result = await db.query(query, [...values]);
    return result.rows[0];
  }

  /** Deletes an existing company by handle */
  static async delete(handle) {
    const result = await db.query(
      `DELETE from companies 
        WHERE handle = $1
        RETURNING handle`,
      [handle]
    );

    return result.rows[0];
  }


}

module.exports = Company;