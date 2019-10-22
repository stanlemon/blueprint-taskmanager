const request = require("supertest");
const knex = require("../../connection");
const app = require("../../app");
const api = require("./tasks");
const { omit } = require("lodash");
const { isToday, parseISO } = require("date-fns");
const { createUser } = require("../../db/users");

beforeAll(async done => {
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

  done();
});

beforeEach(async done => {
  await knex.test.cleanup();
  done();
});

afterAll(() => {
  knex.test.teardown();
});

describe("/api/tasks", () => {
  it("GET empty list of tasks", async done => {
    request(app)
      .get("/tasks")
      .expect("Content-Type", /json/)
      .expect(200)
      .end((err, res) => {
        if (err) {
          throw err;
        }

        expect(res.body).toEqual([]);

        done();
      });
  });

  it("POST new task to the database", async done => {
    const newTask = {
      name: "Test Task",
      description: "Description of a test task",
    };

    request(app)
      .post("/tasks")
      .send(newTask)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .end((err, res) => {
        if (err) {
          throw err;
        }

        // Copy this so we can reference it later
        const task = res.body;

        // The task is returned when successfully created
        expect(task).toMatchObject(newTask);
        expect(task.id).not.toBe(undefined);
        expect(isToday(parseISO(task.createdAt))).toBe(true);
        expect(task.createdAt).toEqual(task.updatedAt);

        // Go back to the API and retrieve it, make sure that it exists
        request(app)
          .get("/tasks/" + task.id)
          .expect("Content-Type", /json/)
          .expect(200)
          .end((err, res) => {
            if (err) {
              throw err;
            }

            expect(res.body).toEqual(task);

            const updatedTaskName = "Updated task name!!";

            // Go back to the API and retrieve it, make sure that it exists
            request(app)
              .put("/tasks/" + task.id)
              .send({ name: updatedTaskName })
              .expect("Content-Type", /json/)
              .expect(200)
              .end((err, res) => {
                if (err) {
                  throw err;
                }

                expect(res.body).toMatchObject({
                  // Filter out updatedAt because it should have changed from the original task
                  ...omit(task, ["updatedAt"]),
                  // Override the existing task name
                  ...{ name: updatedTaskName },
                });
                expect(isToday(parseISO(res.body.updatedAt))).toBe(true);

                done();
              });

            done();
          });
      });
  });
});
