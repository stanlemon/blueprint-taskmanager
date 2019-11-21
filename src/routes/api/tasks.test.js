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

  it("POST new task to the database", async () => {
    const newTask = {
      name: "Test Task",
      description: "Description of a test task",
    };

    await request(app)
      .post("/tasks")
      .send(newTask)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .then(res => {
        // Copy this so we can reference it later
        const task = res.body;

        // The task is returned when successfully created
        expect(task).toMatchObject(newTask);
        expect(task.id).not.toBe(undefined);
        expect(isToday(parseISO(task.createdAt))).toBe(true);
        expect(task.createdAt).toEqual(task.updatedAt);

        // Go back to the API and retrieve it, make sure that it exists
        return request(app)
          .get("/tasks/" + task.id)
          .expect("Content-Type", /json/)
          .expect(200)
          .then(res => {
            expect(res.body).toEqual(task);

            const updatedTaskName = "Updated task name!!";

            // Go back to the API and retrieve it, make sure that it exists
            return request(app)
              .put("/tasks/" + task.id)
              .send({ name: updatedTaskName })
              .expect("Content-Type", /json/)
              .expect(200)
              .then(res => {
                expect(res.body).toMatchObject({
                  // Filter out updatedAt because it should have changed from the original task
                  ...omit(task, ["updatedAt"]),
                  // Override the existing task name
                  ...{ name: updatedTaskName },
                });
                expect(isToday(parseISO(res.body.updatedAt))).toBe(true);
              });
          });
      });
  });
});
