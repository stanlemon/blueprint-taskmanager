const request = require("supertest");
const knex = require("../../connection");
const app = require("../../app");
const api = require("./tags");
const { createUser } = require("../../db/users");
const { upsertTags } = require("../../db/tags");

beforeAll(async () => {
  await knex.test.setup();
});

beforeEach(async () => {
  await knex.test.cleanup();
});

afterAll(() => {
  knex.test.teardown();
});

describe("/api/tags", () => {
  it("GET lists tags in the database", async () => {
    const user = await createUser({
      email: "test@test.com",
      password: "password",
    });

    await upsertTags(user.id, ["foo", "bar", "baz"]);

    function checkAuth(req, res, next) {
      req.user = user;
      next();
    }

    app.use(checkAuth);
    app.use(api);

    await request(app)
      .get("/tags")
      .expect("Content-Type", /json/)
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual(["bar", "baz", "foo"]);
      });
  });
});
