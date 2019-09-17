module.exports = {
  development: {
    client: "sqlite3",
    connection: {
      filename: "./database.sqlite",
    },
    migrations: {
      directory: __dirname + "/src/db/migrations",
      tableName: "knex_migrations",
    },
  },

  test: {
    client: "sqlite3",
    connection: {
      filename: "test-database-" + new Date().getTime() + ".sqlite",
    },
    migrations: {
      directory: __dirname + "/src/db/migrations",
      tableName: "knex_migrations",
    },
  },

  production: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: __dirname + "/src/db/migrations",
      tableName: "knex_migrations",
    },
  },
};
