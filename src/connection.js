if (!process.env.DATABASE_NAME) {
  process.env.DATABASE_NAME = "database.sqlite";
}

const config =
  process.env.NODE_ENV == "production"
    ? { client: "pg", connection: process.env.DATABASE_URL }
    : {
        //debug: true,
        client: "sqlite3",
        connection: {
          filename: __dirname + "/../" + process.env.DATABASE_NAME,
        },
      };

const knex = require("knex")(config);

module.exports = knex;
