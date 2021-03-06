const express = require("express");
const router = express.Router();
const schemaHandler = require("../../helpers/schemaHandler");
const asyncHandler = require("../../helpers/asyncHandler");
const {
  createTask,
  updateTask,
  deleteTask,
  countTasks,
  getTasks,
  getTaskById,
} = require("../../db/tasks");
const { convertCamelCase, convertSnakeCase } = require("../../helpers");
const schema = require("../../schema/task");

router.get(
  "/tasks",
  asyncHandler(async (req) => {
    const filter = req.query.filter || "all";
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;

    const all = await countTasks(req.user.id, "all");
    const total = await countTasks(req.user.id, filter);
    const tasks = await getTasks(req.user.id, filter, page, size);

    return {
      tasks: tasks.map((v) => convertCamelCase(v)),
      filter,
      page,
      pages: Math.ceil(total / size),
      total,
      all,
    };
  })
);

router.get(
  "/tasks/:taskId",
  asyncHandler(async (req, res) => {
    const task = await getTaskById(req.user.id, req.params.taskId);

    if (task === null) {
      res.status(404).json({ message: "Not Found" });
      return;
    }

    return convertCamelCase(task);
  })
);

router.post(
  "/tasks",
  schemaHandler(schema, async (req, res) => {
    const task = await createTask(req.user.id, convertSnakeCase(req.body));

    res.status(200).json(convertCamelCase(task));
  })
);

router.put(
  "/tasks/:taskId",
  schemaHandler(schema, async (req, res) => {
    const task = await updateTask(
      req.user.id,
      req.params.taskId, // It's possible  the id is set in req.body too, but we ignore it
      convertSnakeCase(req.body)
    );

    if (task === null) {
      res.status(404).json({ message: "Not Found" });
      return;
    }

    res.status(200).json(convertCamelCase(task));
  })
);

router.delete(
  "/tasks/:taskId",
  asyncHandler(async (req, res) => {
    const status = await deleteTask(req.user.id, req.params.taskId);

    if (!status) {
      res.status(404).json({ message: "Not Found" });
      return;
    }

    res.status(200).json({ success: true });
  })
);

module.exports = router;
