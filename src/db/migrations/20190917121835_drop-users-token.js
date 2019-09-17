exports.up = async knex => {
  return knex.schema.alterTable("users", table => {
    table.dropColumn("token");
  });
};

exports.down = async knex => {
  return knex.schema.table("users", table => {
    table.string("token");
  });
};

exports.config = { transaction: false };
