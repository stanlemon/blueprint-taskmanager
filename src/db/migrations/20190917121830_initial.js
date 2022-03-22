exports.up = async (knex) => {
  return Promise.all([
    knex.schema.dropTableIfExists("task_tags"),
    knex.schema.dropTableIfExists("tags"),
    knex.schema.dropTableIfExists("tasks"),
    knex.schema.dropTableIfExists("users"),

    knex.schema.createTable("users", (table) => {
      table.increments("id");
      table.string("name");
      table.string("email");
      table.string("password");
      table.string("token");
      table.boolean("active").defaultTo(true);
      table.dateTime("created_at").notNullable();
      table.dateTime("updated_at").notNullable();
    }),

    knex.schema.createTable("tasks", (table) => {
      table.increments("id");
      table.string("name");
      table.text("description");
      table.dateTime("completed");
      table.dateTime("due");
      table.integer("user_id").notNullable();
      table.dateTime("created_at").notNullable();
      table.dateTime("updated_at").notNullable();
    }),

    knex.schema.createTable("tags", (table) => {
      table.increments("id");
      table.string("name");
      table.integer("user_id").notNullable();
      table.dateTime("created_at").notNullable();
      table.dateTime("updated_at").notNullable();
    }),

    knex.schema.createTable("task_tags", (table) => {
      table.increments("id");
      table.integer("task_id").notNullable();
      table.integer("tag_id").notNullable();
    }),
  ]);
};

exports.down = async () => {
  // This migration cannot be reversed
  return new Promise(null);
};

exports.config = { transaction: false };
