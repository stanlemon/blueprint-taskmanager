const knex = require("../connection");
const omit = require("lodash/omit");
const format = require("date-fns/format");
const { getTagsByTaskId } = require("./tags");

const columns = [
  "id",
  "name",
  "description",
  "due",
  "completed",
  "created_at",
  "updated_at",
  "user_id",
];

function omitUserId(o) {
  return omit(o, ["user_id"]);
}

function getTasks(userId) {
  return knex("tasks")
    .select(columns)
    .where("user_id", userId)
    .orderBy("created_at")
    .then(tasks => tasks.map(omitUserId));
}

function _getTaskById(userId, taskId) {
  return knex("tasks")
    .select(columns)
    .where("user_id", userId)
    .where("id", taskId)
    .first()
    .then(task => {
      if (!task) {
        return null;
      }
      return getTagsByTaskId(userId, taskId).then(tags => {
        task.tags = tags;
        return task;
      });
    });
}

function getTaskById(userId, taskId) {
  return _getTaskById(userId, taskId).then(omitUserId);
}

function deleteTask(userId, taskId) {
  return _getTaskById(userId, taskId).then(verify => {
    if (!verify || verify.user_id !== userId) {
      return false;
    }

    return knex("tasks")
      .where("user_id", userId)
      .where("id", taskId)
      .delete()
      .then(() => true);
  });
}

function updateTask(userId, taskId, task) {
  return _getTaskById(userId, taskId).then(verify => {
    if (!verify || verify.user_id !== userId) {
      return null;
    }

    const data = Object.assign(
      {},
      // Exclude the following properties
      omit(task, ["created_at", "updated_at", "user_id"]),
      {
        user_id: userId,
        updated_at: format(Date.now(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
      }
    );

    return knex("tasks")
      .where({ id: taskId })
      .update(data)
      .then(() => {
        // Refresh the task that we return after updating it.
        return getTaskById(userId, taskId);
      });
  });
}

function createTask(userId, task) {
  // Make a sql friendly date for now
  const now = format(Date.now(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
  // Build a copy of the input with our required fields
  const data = Object.assign({}, task, {
    user_id: userId,
    created_at: now,
    updated_at: now,
  });

  return knex("tasks")
    .insert(data)
    .then(([id]) => {
      return getTaskById(userId, id);
    });
}

module.exports = {
  getTasks,
  getTaskById,
  deleteTask,
  updateTask,
  createTask,
};
