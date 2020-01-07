const shortid = require("shortid");

exports.up = async function(knex) {
  await knex.schema.alterTable("users", table => {
    table.string("verification_token");
    table.dateTime("verified").nullable();
  });

  const users = await knex("users").select();

  users.forEach(async user => {
    await knex("users")
      .update({ verification_token: shortid.generate() })
      .where("id", user.id);
  });

  await knex.schema.alterTable("users", table => {
    table.unique("verification_token");
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable("users", table => {
    table.dropColumn("verified");
    table.dropColumn("verification_token");
  });
};
