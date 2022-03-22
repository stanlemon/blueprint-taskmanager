exports.up = async (knex) => {
  return Promise.all([
    knex.schema.alterTable("tasks", (table) => {
      table.foreign("user_id").references("id").inTable("users");
    }),

    knex.schema.alterTable("tags", (table) => {
      table.foreign("user_id").references("id").inTable("users");
    }),

    knex.schema.alterTable("task_tags", (table) => {
      table.foreign("task_id").references("id").inTable("tasks");
      table.foreign("tag_id").references("id").inTable("tags");
    }),
  ]);
};

exports.down = async () => {
  // This migration cannot be reversed
  return new Promise(null);
};

exports.config = { transaction: false };
