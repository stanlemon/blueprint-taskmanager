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
    .first()
    .then(task => {
      return getTagsByTaskId(userId, taskId).then(tags => {
        task.tags = tags;
        return task;
      });
    });
}

function deleteTaskById(userId, taskId) {
  return knex("tasks")
    .where("user_id", userId)
    .where("id", taskId)
    .delete();
}

function updateTask(userId, taskId, task) {
  return getTaskById(userId, taskId).then(verify => {
    if (verify.userId !== userId) {
      throw Error("Task does not belong to user");
    }

    const data = Object.assign(
      {},
      // Exclude the following properties
      omit(task, ["created_at", "updated_at", "user_id"]),
      {
        userId,
        updated_at: format(Date.now(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
      }
    );

    return knex("tasks")
      .where({ id: taskId })
      .update(data);
  });
}

function createTask(userId, task) {
  // Make a sql friendly date for now
  const now = format(Date.now(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
  // Build a copy of the input with our required fields
  const data = Object.assign({}, data, {
    userId,
    created_at: now,
    updated_at: now,
  });

  return knex("tasks").insert(task);
}

module.exports = {
  getTasks,
  getTaskById,
  deleteTaskById,
  updateTask,
  createTask,
};
