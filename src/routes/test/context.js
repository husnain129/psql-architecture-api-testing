const { randomBytes } = require("crypto");
const { default: migrate } = require("node-pg-migrate");
const format = require("pg-format");
const pool = require("../../pool");

const DEFAULT_OPTS = {
  host: process.env.HOST,
  port: process.env.PORT,
  database: process.env.DATABASE_TEST,
  user: process.env.USER,
  password: process.env.PASSWORD,
};

class Context {
  static async build() {
    // Randomly generated a role name to connect to pg as
    const roleName = "a" + randomBytes(4).toString("hex");

    // Connect a PG as usual
    await pool.connect(DEFAULT_OPTS);

    // Create a new Role
    await pool.query(
      format("CREATE ROLE %I WITH LOGIN PASSWORD %L;", roleName, roleName)
    );

    // Create a schema with the same name
    await pool.query(
      format("CREATE SCHEMA %I AUTHORIZATION %I;", roleName, roleName)
    );

    // Disconnect entirelu from PG
    await pool.close();

    // Run our migrations in the new schema
    await migrate({
      schema: roleName,
      direction: "up",
      log: () => {},
      noLock: true,
      dir: "migrations",
      databaseUrl: {
        host: process.env.HOST,
        port: process.env.PORT,
        database: process.env.DATABASE_TEST,
        user: roleName,
        password: roleName,
      },
    });

    // Connect to PG as the newly create role
    await pool.connect({
      host: process.env.HOST,
      port: process.env.PORT,
      database: process.env.DATABASE_TEST,
      user: roleName,
      password: roleName,
    });
    return new Context(roleName);
  }
  constructor(roleName) {
    this.roleName = roleName;
  }

  async reset() {
    // Delete everything from users table
    // We only create single table in test now: users
    return pool.query("DELETE FROM users;");
  }

  async close() {
    // Disconnect from PG
    await pool.close();

    // Reconnect as our root user
    await pool.connect(DEFAULT_OPTS);

    // Delete the role and schema we created
    await pool.query(format("DROP SCHEMA %I CASCADE;", this.roleName));
    await pool.query(format("DROP ROLE %I;", this.roleName));

    // Disconnected
    await pool.close();
  }
}

module.exports = Context;
