if (!process.env.DATABASE_NAME) {
  process.env.DATABASE_NAME = "database.sqlite";
}

module.exports = {
  development: {
    client: "sqlite3",
    connection: {
      filename: "./" + process.env.DATABASE_NAME,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },

  production: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    migrations: {
      tableName: "knex_migrations",
    },
  },
};
