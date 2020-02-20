const db = require("../db");
const sqlForPartialUpdate = require("../helpers/partialUpdate");
const expressError = require("../helpers/expressError");

class Company {
  /**
   * CRUD for companies 
   */

  /**
   * 
    search takes in a term, and optional min and max employees. 
   */
  static async search(searchTerm, min_employees = 0, max_employees = 1000000) {
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

  /** Get a company by HANDLE */
  static async get(handle) {
    const result = await db.query(
      `SELECT handle, name, num_employees, description, logo_url 
        FROM companies
        WHERE handle = $1`,
      [handle]
    );

    return result.rows[0];
  }

  /** Update exisiting company by handle */
  static async update(handle, body) {
    // const { handle: newHandle, name, num_employees, description, logo_url } = body;
    // const items = {
    //   handle: newHandle,
    //   name,
    //   num_employees,
    //   description,
    //   logo_url
    // }
    const { query, values } = sqlForPartialUpdate("companies", body, "handle", handle)
    // console.log("VALUES IS....", values);
    // console.log("QUERY IS....", query);
    const result = await db.query(query, [...values]);
    return result.rows[0];
  }

}

module.exports = Company;