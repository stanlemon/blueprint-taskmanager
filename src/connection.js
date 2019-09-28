const fs = require("fs");

require("dotenv").config();

const config = require("../knexfile")[process.env.NODE_ENV];

const knex = require("knex")(config);

// Methods for use in tests
knex.test = {
  /**
   * Run all migrations and ensure the schema exists.
   */
  setup: async () => {
    // Run all migrations, which includes schema setup
    await knex.migrate.latest();
  },

  /**
   * Truncate all tables.
   */
  cleanup: async () => {
    await knex.truncate("task_tags");
    await knex.truncate("tags");
    await knex.truncate("tasks");
    await knex.truncate("users");
  },

  /**
   * Destroy the test database.
   */
  teardown: () => {
    fs.unlinkSync(config.connection.filename);
  },
};

module.exports = knex;
