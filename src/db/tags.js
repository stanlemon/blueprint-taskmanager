const format = require("date-fns/format");
const knex = require("../connection");

function getTags(userId) {
  return (
    knex("tags")
      .select(["name"])
      .where("user_id", userId)
      .orderBy("name")
      // Remap the tags so that they're just a list of strings
      .then(tags => tags.map(t => t.name))
  );
}

function getTagsByTaskId(userId, taskId) {
  return knex
    .from("tags")
    .innerJoin("task_tags", "tags.id", "task_tags.tag_id")
    .select(["name"])
    .where("user_id", userId)
    .where("task_tags.task_id", taskId)
    .orderBy("name")
    .then(tags => tags.map(t => t.name));
}

function createTag(userId, name) {
  const now = format(Date.now(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");

  return knex("tags").insert({
    user_id: userId,
    name,
    created_at: now,
    updated_at: now,
  });
}

module.exports = { getTags, getTagsByTaskId, createTag };
