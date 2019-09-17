const knex = require("../connection");

const columns = [
  "id",
  "name",
  "description",
  "due",
  "completed",
  "created_at",
  "updated_at",
];

function getTasks(userId) {
  return knex("tasks")
    .select(columns)
    .where("user_id", userId);
}

function getTaskById(userId, taskId) {
  return knex("tasks")
    .select(columns)
    .where("user_id", userId)
    .where("id", taskId)
    .first();
}

module.exports = { getTasks, getTaskById };
