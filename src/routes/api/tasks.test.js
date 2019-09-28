const request = require("supertest");
const knex = require("../../connection");
const app = require("../../app");
const api = require("./tasks");
const { createUser } = require("../../db/users");

beforeAll(async done => {
  await knex.test.setup();
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
  it("GET lists tags in the database", async done => {
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
});
