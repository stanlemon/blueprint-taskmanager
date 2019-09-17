if (!process.env.DATABASE_NAME) {
  process.env.DATABASE_NAME = "database.sqlite";
}

const config = require("../knexfile");

const knex = require("knex")(config[process.env.NODE_ENV]);

module.exports = knex;
