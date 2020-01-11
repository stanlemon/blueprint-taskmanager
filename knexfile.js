module.exports = {
  /*
  development: {
    client: "sqlite3",
    connection: {
      filename: "./database.sqlite",
    },
    useNullAsDefault: true,
    migrations: {
      directory: __dirname + "/src/db/migrations",
      tableName: "knex_migrations",
    },
  },
  */

  development: {
    client: "pg",
    connection: "postgres://stan@localhost:5432/blueprint",
    migrations: {
      directory: __dirname + "/src/db/migrations",
      tableName: "knex_migrations",
    },
  },

  test: {
    client: "sqlite3",
    connection: ":memory:",
    useNullAsDefault: true,
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
