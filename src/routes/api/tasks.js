const express = require("express");
const router = express.Router();
const isEmpty = require("lodash/isEmpty");
const snakeCase = require("lodash/snakeCase");
const camelCase = require("lodash/camelCase");
const mapKeys = require("lodash/mapKeys");
const format = require("date-fns/format");

if (!process.env.DATABASE_NAME) {
  process.env.DATABASE_NAME = "database.sqlite";
}

const config =
  process.env.NODE_ENV == "production"
    ? { client: "pg", connection: process.env.DATABASE_URL }
    : {
        client: "sqlite3",
        connection: { filename: process.env.DATABASE_NAME },
      };

const knex = require("knex")(config);

function convertCamelCase(obj) {
  return mapKeys(obj, (value, key) => {
    return camelCase(key);
  });
}

function convertSnakeCase(obj) {
  return mapKeys(obj, (value, key) => {
    return snakeCase(key);
  });
}

// TODO: Move database configuration out
// TODO: Add object validation
// TODO: Add error handling for issues that come from knex

router.get("/tasks", (req, res) => {
  const userId = req.user.id;

  knex("tasks")
    .select(
      "id",
      "name",
      "description",
      "due",
      "completed",
      "created_at",
      "updated_at"
    )
    .where("user_id", userId)
    .then(tasks => {
      res.status(200).json(tasks.map(v => convertCamelCase(v)));
    });
});

function getTaskForUserById(userId, taskId) {
  return knex("tasks")
    .select(
      "id",
      "name",
      "description",
      "due",
      "completed",
      "created_at AS createdAt",
      "updated_at AS updatedAt"
    )
    .where("user_id", userId)
    .where("id", taskId)
    .first();
}

router.get("/tasks/:taskId", async (req, res) => {
  const userId = req.user.id;
  const taskId = req.params.taskId;

  const data = await getTaskForUserById(userId, taskId);

  if (isEmpty(data)) {
    res.status(404).json({ message: "Not Found" });
  }

  res.status(200).json(convertCamelCase(data));
});

router.post("/tasks", async (req, res) => {
  const userId = req.user.id;
  const task = req.body;

  task.userId = userId;
  task.createdAt = format(Date.now(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
  task.updatedAt = task.createdAt;

  const [taskId] = await knex("tasks").insert(convertSnakeCase(task));

  const data = await getTaskForUserById(userId, taskId);

  res.status(200).json(convertCamelCase(data));
});

router.put("/tasks/:taskId", async (req, res) => {
  const userId = req.user.id;

  const taskId = req.params.taskId;
  const task = req.body;

  // Verify that this task exists for this user, if it doesn't 404
  const verify = await getTaskForUserById(userId, taskId);

  if (isEmpty(verify)) {
    res.status(404).json({ message: "Not Found" });
  }

  // Don't let created_at be changed
  delete task.createdAt;
  // Force set the user id
  task.userId = userId;
  // Update the updated at time
  task.updatedAt = format(Date.now(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
  console.log(convertSnakeCase(task));
  await knex("tasks")
    .where({ id: taskId })
    .update(convertSnakeCase(task));

  const data = await getTaskForUserById(userId, taskId);

  res.status(200).json(convertCamelCase(data));
});

router.delete("/tasks/:taskId", async (req, res) => {
  const userId = req.user.id;
  const taskId = req.params.taskId;

  // Verify that this task exists for this user, if it doesn't 404
  const verify = await getTaskForUserById(userId, taskId);

  if (isEmpty(verify)) {
    res.status(404).json({ message: "Not Found" });
  }

  await knex("tasks")
    .where("user_id", userId)
    .where("id", taskId)
    .delete();

  res.status(200).json({ success: true });
});

module.exports = router;
