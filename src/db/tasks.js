const knex = require("../connection");
const omit = require("lodash/omit");
const includes = require("lodash/includes");
const isObject = require("lodash/isObject");
const isEmpty = require("lodash/isEmpty");
const format = require("date-fns/format");
const isDate = require("date-fns/isDate");
const { upsertTags, getTagsByTaskId, getTagsForTaskIds } = require("./tags");

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
  if (!isObject(o)) {
    return o;
  }
  return omit(o, ["user_id"]);
}

function buildFilter(filter) {
  return qb => {
    switch (filter) {
      case "complete":
        qb.whereNotNull("completed");
        break;
      case "incomplete":
        qb.whereNull("completed");
        break;
    }
  };
}

async function countTasks(userId, filter) {
  const { total } = await knex("tasks")
    .count({ total: "*" })
    .where("user_id", userId)
    .modify(buildFilter(filter))
    .first();
  return total;
}

async function getTasks(userId, filter = "all", page = 0, size = 10) {
  // Postgres and Sqlite do this differently
  const orderByRaw =
    knex.client.config.client === "pg"
      ? `CASE
  WHEN due IS NOT NULL AND completed IS NULL THEN due
  ELSE (now() - interval '1000' year)
END DESC,
CASE WHEN completed IS NULL THEN (now() + interval '100' year) ELSE completed END DESC,
created_at ASC`
      : `CASE
  WHEN due IS NOT NULL AND completed IS NULL THEN due
  ELSE date("now", "-1000 year")
END DESC,
CASE WHEN completed IS NULL THEN date("now", "+100 year") ELSE completed END DESC,
created_at ASC`;

  const tasks = await knex("tasks")
    .select(columns)
    .where("user_id", userId)
    .modify(buildFilter(filter))
    // Ensures oldest due are first, then everything by creation date, with complete last
    .orderByRaw(orderByRaw)
    .offset((page - 1) * size)
    .limit(size);

  const tags = await getTagsForTaskIds(
    userId,
    tasks.map(t => t.id)
  );

  const tagsByTaskId = {};

  tags.forEach(t => {
    const taskId = parseInt(t.task_id);

    if (!tagsByTaskId[taskId]) {
      tagsByTaskId[taskId] = [];
    }
    tagsByTaskId[taskId].push(t.name);
  });

  tasks.forEach((task, i) => {
    // Every task should have a tag array
    tasks[i].tags = [];

    if (tagsByTaskId[task.id] != undefined) {
      tasks[i].tags = tagsByTaskId[task.id];
    }
  });

  return tasks.map(omitUserId);
}

async function _getTaskById(userId, taskId) {
  const task = await knex("tasks")
    .select(columns)
    .where("user_id", userId)
    .where("id", taskId)
    .first();

  if (!task) {
    return null;
  }
  return getTagsByTaskId(userId, taskId).then(tags => {
    task.tags = tags;
    return task;
  });
}

async function getTaskById(userId, taskId) {
  return _getTaskById(userId, taskId).then(omitUserId);
}

function deleteTask(userId, taskId) {
  return _getTaskById(userId, taskId).then(verify => {
    if (!verify || verify.user_id !== userId) {
      return false;
    }

    return knex("task_tags")
      .where("task_id", taskId)
      .delete()
      .then(() => {
        return knex("tasks")
          .where("user_id", userId)
          .where("id", taskId)
          .delete()
          .then(() => true);
      });
  });
}

function updateTask(userId, taskId, task) {
  return _getTaskById(userId, taskId).then(verify => {
    if (!verify || verify.user_id !== userId) {
      return null;
    }
    const { tags } = task;
    const data = Object.assign(
      {},
      // Exclude the following properties
      omit(task, ["created_at", "updated_at", "user_id", "tags"]),
      {
        user_id: userId,
        updated_at: format(Date.now(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
        due: isDate(task.due)
          ? format(task.due, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")
          : task.due,
        completed: isDate(task.completed)
          ? format(task.completed, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")
          : task.completed,
      }
    );

    return knex("tasks")
      .where({ id: taskId })
      .update(data)
      .then(() => upsertTaskTags(userId, taskId, tags))
      .then(() =>
        // Refresh the task that we return after updating it.
        getTaskById(userId, taskId)
      );
  });
}

/**
 * Given a list of tags, create the ones that don't exist and map them all to the given task
 * @param {int} userId - User id to whom the tags and task belong
 * @param {int} taskId - Task id to which the tags belong
 * @param {string[]} names - List of tag names
 */
function upsertTaskTags(userId, taskId, tags) {
  // Tags essentially not being set changes nothing, an empty array clears them
  if (tags === undefined) {
    return Promise.resolve([]);
  }

  return upsertTags(userId, tags).then(tags => {
    const tagIds = tags.map(t => t.id);
    return knex("task_tags")
      .select()
      .where("task_id", taskId)
      .whereIn("tag_id", tagIds)
      .then(taskTags => {
        // Ids of all the task tags that  currently exist, some of these may be extra
        const taskTagIds = taskTags.map(t => t.tag_id);
        // Any that don't exist we need to create
        const missing = tagIds
          .filter(id => !includes(taskTagIds, id))
          .map(id => ({
            tag_id: id,
            task_id: taskId,
          }));
        return createTaskTags(missing).then(() => {
          // Delete any tags for this tag that we weren't mapping
          return knex("task_tags")
            .delete()
            .where("task_id", taskId)
            .whereNotIn("tag_id", tagIds);
        });
      });
  });
}

function createTaskTags(taskTags) {
  if (isEmpty(taskTags)) {
    return Promise.resolve([]);
  }

  return knex("task_tags").insert(taskTags);
}

function createTask(userId, task) {
  // Make a sql friendly date for now
  const now = format(Date.now(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
  // Extract tags from the task
  const { tags } = task;
  // Build a copy of the input with our required fields
  const data = omit(
    Object.assign({}, task, {
      user_id: userId,
      created_at: now,
      updated_at: now,
      due: isDate(task.due)
        ? format(task.due, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")
        : task.due,
      completed: isDate(task.completed)
        ? format(task.completed, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")
        : task.completed,
    }),
    ["id", "tags"]
    // Id can't be set because this is a new row
    // We'll deal with tags later
  );

  return knex("tasks")
    .insert(data)
    .returning("id")
    .then(([id]) => {
      // This needs to be nested so that we can access the newly created task's id
      return upsertTaskTags(userId, id, tags).then(() => {
        return getTaskById(userId, id);
      });
    });
}

module.exports = {
  countTasks,
  getTasks,
  getTaskById,
  deleteTask,
  updateTask,
  createTask,
};
