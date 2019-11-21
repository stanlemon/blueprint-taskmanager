const format = require("date-fns/format");
const knex = require("../connection");
const isEmpty = require("lodash/isEmpty");
const mapKeys = require("lodash/mapKeys");
const has = require("lodash/has");

async function getTags(userId) {
  const tags = await knex("tags")
    .select(["name"])
    .where("user_id", userId)
    .orderBy("name");

  // Remap the tags so that they're just a list of strings
  return tags.map(t => t.name);
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

/**
 * Get tags for a set of tasks.
 * @param {int} userId User id the tasks belong to
 * @param {int[]} taskIds Task ids to get tags for
 */
function getTagsForTaskIds(userId, taskIds) {
  return knex
    .from("tags")
    .innerJoin("task_tags", "tags.id", "task_tags.tag_id")
    .select(["name", "task_tags.task_id"])
    .where("user_id", userId)
    .whereIn("task_tags.task_id", taskIds)
    .orderBy("name");
}

function getTagsByName(userId, names) {
  if (!Array.isArray(names)) {
    return Promise.resolve([]);
  }

  return knex
    .from("tags")
    .select(["id", "name"])
    .where("user_id", userId)
    .whereIn("name", names)
    .orderBy("name");
}

/**
 * Given a list of tags, insert the ones that don't already exist and return the full collection.
 * @param {int} userId - User id to whom the tags belong
 * @param {string[]} names - List of tag names
 */
function upsertTags(userId, names) {
  if (isEmpty(names)) {
    return Promise.resolve([]);
  }

  return getTagsByName(userId, names)
    .then(tags => mapKeys(tags, tag => tag.name))
    .then(tagsByName => {
      const missing = names.filter(name => !has(tagsByName, name));
      return createTags(userId, missing).then(t =>
        t.concat(Object.values(tagsByName))
      );
    });
}

function createTag(userId, name) {
  return createTags(userId, [name]).then(tags => {
    // If it's empty, return null
    if (tags.length === 0) {
      return null;
    }
    // Otherwise return the first entry
    return tags[0];
  });
}

function createTags(userId, names) {
  if (isEmpty(names)) {
    return Promise.resolve([]);
  }

  const now = format(Date.now(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");

  const tags = names.map(name => ({
    user_id: userId,
    name,
    created_at: now,
    updated_at: now,
  }));

  return knex("tags")
    .insert(tags)
    .returning("id")
    .then(() => {
      // Refresh the full record so we have ids
      return getTagsByName(userId, names);
    });
}

module.exports = {
  getTags,
  getTagsByTaskId,
  getTagsForTaskIds,
  upsertTags,
  createTag,
  createTags,
};
