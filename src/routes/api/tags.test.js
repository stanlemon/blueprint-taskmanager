const request = require("supertest");
const knex = require("../../connection");
const app = require("../../app");
const api = require("./tags");
const { createUser } = require("../../db/users");
const { createTag } = require("../../db/tags");

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

describe("/api/tags", () => {
  it("GET lists tags in the database", async done => {
    const user = await createUser({
      email: "test@test.com",
      password: "password",
    });

    await createTag(user.id, "foo");
    await createTag(user.id, "bar");
    await createTag(user.id, "baz");

    function checkAuth(req, res, next) {
      req.user = user;
      next();
    }

    app.use(checkAuth);
    app.use(api);

    request(app)
      .get("/tags")
      .expect("Content-Type", /json/)
      .expect(200)
      .end((err, res) => {
        if (err) {
          throw err;
        }

        expect(res.body).toEqual(["bar", "baz", "foo"]);

        done();
      });
  });
});
