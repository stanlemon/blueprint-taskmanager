module.exports = async function(knex) {
  await knex.schema.dropTableIfExists("users");
  await knex.schema.createTable("users", table => {
    table.increments("id");
    table.string("name");
    table.string("email");
    table.string("password");
    table.boolean("active").defaultTo(true);
    table.dateTime("created_at").notNullable();
    table.dateTime("updated_at").notNullable();
  });

  await knex.schema.dropTableIfExists("tasks");
  await knex.schema.createTable("tasks", table => {
    table.increments("id");
    table.string("name");
    table.text("description");
    table.dateTime("completed");
    table.dateTime("due");
    table.integer("user_id").notNullable();
    table.dateTime("created_at").notNullable();
    table.dateTime("updated_at").notNullable();

    table
      .foreign("user_id")
      .references("id")
      .inTable("users");
  });

  await knex.schema.dropTableIfExists("tags");
  await knex.schema.createTable("tags", table => {
    table.increments("id");
    table.string("name");
    table.integer("user_id").notNullable();
    table.dateTime("created_at").notNullable();
    table.dateTime("updated_at").notNullable();

    table
      .foreign("user_id")
      .references("id")
      .inTable("users");
  });

  await knex.schema.dropTableIfExists("task_tags");
  await knex.schema.createTable("task_tags", table => {
    table.increments("id");
    table.integer("task_id").notNullable();
    table.integer("tag_id").notNullable();

    table
      .foreign("task_id")
      .references("id")
      .inTable("tasks");

    table
      .foreign("tag_id")
      .references("id")
      .inTable("tags");
  });
};
