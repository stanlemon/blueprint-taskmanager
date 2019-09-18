exports.up = function(knex) {
  return knex.schema.alterTable("users", table => {
    table.datetime("last_logged_in").nullable();
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable("users", table => {
    table.dropColumn("last_logged_in");
  });
};
