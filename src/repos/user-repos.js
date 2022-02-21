const pool = require("../pool");
const toUpperCase = require("../utils/to-camel-case");
class UserRepo {
  static async find() {
    const { rows } = await pool.query("SELECT * FROM users;");
    return toUpperCase(rows);
  }

  static async addUser(bio, username) {
    const { rows } = await pool.query(
      "INSERT INTO users (username,bio) VALUES ($1,$2) RETURNING *",
      [username, bio]
    );
    return toUpperCase(rows);
  }

  static async findOne(id) {
    const { rows } = await pool.query("SELECT * FROM users where id = $1", [
      id,
    ]);
    return toUpperCase(rows)[0];
  }

  static async updateOne(id, bio, username) {
    const { rows } = await pool.query(
      "UPDATE users SET bio = $1,username = $2 WHERE id = $3 RETURNING *",
      [bio, username, id]
    );
    return toUpperCase(rows)[0];
  }

  static async delete(id) {
    const { rows } = await pool.query(
      "DELETE FROM users WHERE id=$1 RETURNING *;",
      [id]
    );
    if (!rows) throw new Error("User Not Found");
    return "User deleted";
  }

  static async countUser() {
    const { rows } = await pool.query("SELECT COUNT(*) FROM users;");
    return parseInt(rows[0].count);
  }
}
module.exports = UserRepo;
