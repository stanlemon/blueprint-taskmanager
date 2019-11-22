const request = require("supertest");
const knex = require("../../connection");
const app = require("../../app");
const api = require("./tasks");
const { omit } = require("lodash");
const { isToday, parseISO } = require("date-fns");
const { createUser, getUserByEmail } = require("../../db/users");
const { createTask, getTaskById } = require("../../db/tasks");

const email = "test@test.com";

beforeAll(async () => {
  await knex.test.setup();
});

beforeEach(async () => {
  await knex.test.cleanup();

  const user = await createUser({
    email,
    password: "password",
    active: true,
  });

  function checkAuth(req, res, next) {
    req.user = user;
    next();
  }

  app.use(checkAuth);
  app.use(api);
});

afterAll(() => {
  knex.test.teardown();
});

describe("/api/tasks", () => {
  it("GET empty list of tasks", async () => {
    await request(app)
      .get("/tasks")
      .expect("Content-Type", /json/)
      .expect(200)
      .then(res => {
        expect(res.body).toEqual([]);
      });
  });

  it("GET list of tasks", async () => {
    const user = await getUserByEmail(email);

    const task1 = {
      name: "Test task 1",
      description: "Description of a test task",
    };
    const task2 = {
      name: "Test task 2",
      completed: new Date(),
      tags: ["foo", "bar"],
    };

    const task1Data = await createTask(user.id, task1);
    const task2Data = await createTask(user.id, task2);

    const { body: allTasks } = await request(app)
      .get("/tasks")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(allTasks).toMatchObject([
      {
        ...omit(task1Data, ["created_at", "updated_at"]),
        createdAt: task1Data.created_at,
        updatedAt: task1Data.updated_at,
      },
      {
        ...omit(task2Data, ["created_at", "updated_at"]),
        createdAt: task2Data.created_at,
        updatedAt: task2Data.updated_at,
      },
    ]);
  });

  it("POST, GET and PUT task", async () => {
    const newTask = {
      name: "Test Task",
      description: "Description of a test task",
    };

    const { body: savedTask } = await request(app)
      .post("/tasks")
      .send(newTask)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);

    // The task is returned when successfully created
    expect(savedTask).toMatchObject(newTask);
    expect(savedTask.id).not.toBe(undefined);
    expect(isToday(parseISO(savedTask.createdAt))).toBe(true);
    expect(savedTask.createdAt).toEqual(savedTask.updatedAt);

    // Go back to the API and retrieve it, make sure that it exists
    const { body: theTask } = await request(app)
      .get("/tasks/" + savedTask.id)
      .expect("Content-Type", /json/)
      .expect(200);

    expect(theTask).toEqual(savedTask);

    const updatedTaskName = "Updated task name!!";

    // Go back to the API and retrieve it, make sure that it exists
    const { body: updatedTask } = await request(app)
      .put("/tasks/" + savedTask.id)
      .send({ name: updatedTaskName })
      .expect("Content-Type", /json/)
      .expect(200);

    expect(updatedTask).toMatchObject({
      // Filter out updatedAt because it should have changed from the original task
      ...omit(savedTask, ["updatedAt"]),
      // Override the existing task name
      ...{ name: updatedTaskName },
    });
    expect(isToday(parseISO(updatedTask.updatedAt))).toBe(true);
  });

  it("DELETE a task", async () => {
    const user = await getUserByEmail(email);

    const task1 = {
      name: "Test task 1",
      description: "Description of a test task",
    };

    const task1Data = await createTask(user.id, task1);

    await request(app)
      .delete("/tasks/" + task1Data.id)
      .expect("Content-Type", /json/)
      .expect(200);

    const tasks1Refresh = await getTaskById(user.id, task1Data.id);

    expect(tasks1Refresh).toBe(null);
  });
});
