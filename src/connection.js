const config = require("../knexfile")[process.env.NODE_ENV];

const knex = require("knex")(config);

(async () => {
  // Check for our database and set it up if needed
  if (process.env.NODE_ENV === "development") {
    const fs = require("fs");

    if (!fs.existsSync(config.connection.filename)) {
      console.warn(
        "No database file detected in development, creating a new one."
      );
      const setupSchema = require("./db/tables");
      await setupSchema(knex);
    }
  }

  const version = await knex.migrate.currentVersion();
  console.log("Current migration version: " + version);

  // Run any migrations we have pending
  await knex.migrate.latest();
})();

module.exports = knex;
