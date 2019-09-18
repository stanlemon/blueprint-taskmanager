const express = require("express");
const router = express.Router();
const isEmpty = require("lodash/isEmpty");
const format = require("date-fns/format");
const knex = require("../../connection");
const schemaHandler = require("../../helpers/schemaHandler");
const asyncHandler = require("../../helpers/asyncHandler");
const { getTasks, getTaskById } = require("../../db/tasks");
const { convertCamelCase, convertSnakeCase } = require("../../helpers");
const schema = require("../../schema/task");

router.get(
  "/tasks",
  asyncHandler(async req => {
    const tasks = await getTasks(req.user.id);
    console.log(tasks);
    return tasks.map(v => convertCamelCase(v));
  })
);

router.get(
  "/tasks/:taskId",
  asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const taskId = req.params.taskId;

    const data = await getTaskById(userId, taskId);

    if (isEmpty(data)) {
      res.status(404).json({ message: "Not Found" });
    }

    return convertCamelCase(data);
  })
);

router.post(
  "/tasks",
  schemaHandler(schema, async (req, res) => {
    const userId = req.user.id;
    const task = req.body;

    task.userId = userId;
    task.createdAt = format(Date.now(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
    task.updatedAt = task.createdAt;

    const [taskId] = await knex("tasks").insert(convertSnakeCase(task));

    const data = await getTaskById(userId, taskId);

    res.status(200).json(convertCamelCase(data));
  })
);

router.put(
  "/tasks/:taskId",
  schemaHandler(schema, async (req, res) => {
    const userId = req.user.id;

    const taskId = req.params.taskId;
    const task = req.body;

    // Verify that this task exists for this user, if it doesn't 404
    const verify = await getTaskById(userId, taskId);

    if (isEmpty(verify)) {
      res.status(404).json({ message: "Not Found" });
      return;
    }

    // Don't let created_at be changed
    delete task.createdAt;
    // Force set the user id
    task.userId = userId;
    // Update the updated at time
    task.updatedAt = format(Date.now(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");

    await knex("tasks")
      .where({ id: taskId })
      .update(convertSnakeCase(task));

    const data = await getTaskById(userId, taskId);

    res.status(200).json(convertCamelCase(data));
  })
);

router.delete("/tasks/:taskId", async (req, res) => {
  const userId = req.user.id;
  const taskId = req.params.taskId;

  // Verify that this task exists for this user, if it doesn't 404
  const verify = await getTaskById(userId, taskId);

  if (isEmpty(verify)) {
    res.status(404).json({ message: "Not Found" });
    return;
  }

  await knex("tasks")
    .where("user_id", userId)
    .where("id", taskId)
    .delete();

  res.status(200).json({ success: true });
});

module.exports = router;
