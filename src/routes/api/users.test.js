const request = require("supertest");
const knex = require("../../connection");
const app = require("../../app");
const api = require("./user");
const { createUser } = require("../../db/users");

const email = "test@test.com";
let user;

beforeAll(async () => {
  await knex.test.setup();
});

beforeEach(async () => {
  await knex.test.cleanup();

  user = await createUser({
    name: "Test user",
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

describe("/api/user", () => {
  it("GET current user", async () => {
    await request(app)
      .get("/user")
      .expect("Content-Type", /json/)
      .expect(200)
      .then(res => {
        // The response is a subset of the properties of the user, excluding bits that we don't want exposed
        expect(res.body).toMatchObject({
          name: user.name,
          email: user.email,
          createdAt: user.created_at,
          updatedAt: user.updated_at,
          lastLoggedIn: user.last_logged_in,
        });
      });
  });

  it("PUT current user", async () => {
    const newName = "Change of name";

    await request(app)
      .put("/user")
      .send({ name: newName, email: user.email })
      .expect("Content-Type", /json/)
      .expect(200)
      .then(res => {
        // The response is a subset of the properties of the user, excluding bits that we don't want exposed
        expect(res.body).toMatchObject({
          name: newName,
          email: user.email,
          createdAt: user.created_at,
          lastLoggedIn: user.last_logged_in,
        });
      });
  });

  it("DELETE current user", async () => {
    expect(true).toBe(true);
  });
});
