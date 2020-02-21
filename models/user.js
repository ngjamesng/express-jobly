//USER MODEL


const db = require("../db");
const sqlForPartialUpdate = require("../helpers/partialUpdate");

class User {
  /**
   * CRUD for users
   */
  /** Create a new user */
  static async create({ username, password, first_name, last_name, email, photo_url }) {
    const results = await db.query(
      `INSERT INTO users
        (username, password, first_name, last_name, email, photo_url)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING username, password, first_name, last_name, email, photo_url, is_admin`,
      [username, password, first_name, last_name, email, photo_url]
    );

    return results.rows[0];
  }

  /** Get ALL users
   * GET/users
   */
  static async getAll() {
    const results = await db.query(
      `SELECT username, first_name, last_name, email
        FROM users`
    )
    return results.rows;
  }

  /** Get user by username
   * GET/users/[username]
   */
  static async get(username) {
    const results = await db.query(
      `SELECT username, first_name, last_name, email, photo_url
        FROM users
        WHERE username = $1`,
      [username]
    )
    return results.rows[0];
  }

  /** Update existing user by username */
  static async update(username, body) {
    const { username: newUsername, first_name, last_name, email, photo_url, is_admin } = body;
    // destructuring because company handle should not be updated here 
    // doesn't throw an error if a nonexistent company handle is passed in 
    const items = { username: newUsername, first_name, last_name, email, photo_url, is_admin };
    const { query, values } = sqlForPartialUpdate("users", items, "username", username);
    const result = await db.query(query, [...values]);
    return result.rows[0];
  }

  /** Deletes an existing user by username */
  static async delete(username) {
    const result = await db.query(
      `DELETE from users
        WHERE username = $1
        RETURNING username`,
      [username]
    );

    return result.rows[0];
  }


}
module.exports = User;