const request = require("supertest");
const knex = require("../../connection");
const app = require("../../app");
const api = require("./tasks");
const { omit } = require("lodash");
const { isToday, parseISO } = require("date-fns");
const { createUser } = require("../../db/users");

beforeAll(async () => {
  await knex.test.setup();

  const user = await createUser({
    email: "test@test.com",
    password: "password",
  });

  function checkAuth(req, res, next) {
    req.user = user;
    next();
  }

  app.use(checkAuth);
  app.use(api);
});

beforeEach(async () => {
  await knex.test.cleanup();
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
});
