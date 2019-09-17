module.exports = {
  development: {
    client: "sqlite3",
    connection: {
      filename: "./database.sqlite",
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },

  test: {
    client: "sqlite3",
    connection: {
      filename: "test-database-" + new Date().getTime() + ".sqlite",
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
