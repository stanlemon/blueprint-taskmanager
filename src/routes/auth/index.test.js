const request = require("supertest");
const knex = require("../../connection");
const app = require("../../app");
const api = require("./index");
const { createUser } = require("../../db/users");

beforeAll(async () => {
  await knex.test.setup();
});

beforeEach(async () => {
  await knex.test.cleanup();
});

afterAll(() => {
  knex.test.teardown();
});

describe("/auth/register", () => {
  app.use(api);

  // Disabling this linting rule because it is unaware of the supertest assertions
  /* eslint-disable jest/expect-expect */
  it("POST creates a user", async () => {
    const name = "Test Tester";
    const email = "test@test.com";
    const password = "p@$$w0rd!";

    const data = {
      name,
      email,
      password,
    };

    await request(app)
      .post("/auth/register")
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .send(data)
      // Upon successful creation the user will be redirected to the session endpoint
      .expect(302)
      .expect("Location", "/auth/session");
  });
  /* eslint-enable jest/expect-expect */

  it("POST returns error on empty data", async () => {
    await request(app)
      .post("/auth/register")
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(400)
      .then(res => {
        expect(res.body.errors).not.toBe(undefined);
        expect(res.body.errors.name).not.toBe(undefined);
        expect(res.body.errors.email).not.toBe(undefined);
        expect(res.body.errors.password).not.toBe(undefined);
      });
  });

  it("POST returns error on invalid email", async () => {
    await request(app)
      .post("/auth/register")
      .send({
        email: "not an email address",
        name: "Test Tester",
        password: "p@$$w0rd!",
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(400)
      .then(res => {
        expect(res.body.errors).not.toBe(undefined);
        expect(res.body.errors.email).not.toBe(undefined);
      });
  });

  it("POST returns error on short password", async () => {
    await request(app)
      .post("/auth/register")
      .send({
        email: "test@test.com",
        name: "Test Tester",
        password: "short",
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(400)
      .then(res => {
        expect(res.body.errors).not.toBe(undefined);
        expect(res.body.errors.password).not.toBe(undefined);
      });
  });

  it("POST returns error on too long password", async () => {
    await request(app)
      .post("/auth/register")
      .send({
        email: "test@test.com",
        name: "Test Tester",
        password:
          "waytolongpasswordtobeusedforthisapplicationyoushouldtrysomethingmuchmuchshorter",
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(400)
      .then(res => {
        expect(res.body.errors).not.toBe(undefined);
        expect(res.body.errors.password).not.toBe(undefined);
      });
  });

  it("POST returns error on already taken email address", async () => {
    await createUser({
      email: "test@test.com",
      name: "test",
      password: "test",
    });

    await request(app)
      .post("/auth/register")
      .send({
        email: "test@test.com",
        name: "Test Tester",
        password: "p@$$w0rd!",
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(400)
      .then(res => {
        expect(res.body.errors).toEqual({
          email: "A user with this email address already exists",
        });
      });
  });
});
