const request = require("supertest");
const knex = require("../../connection");
const app = require("../../app");
const api = require("./index");
const { createUser, getUserById } = require("../../db/users");

beforeAll(async () => {
  await knex.test.setup();
});

beforeEach(async () => {
  await knex.test.cleanup();
});

afterAll(() => {
  knex.test.teardown();
});

describe("/auth", () => {
  app.use(api);

  // Disabling this linting rule because it is unaware of the supertest assertions
  /* eslint-disable jest/expect-expect */
  it("POST /register creates a user", async () => {
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

  it("POST /register returns error on empty data", async () => {
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

  it("POST /register returns error on invalid email", async () => {
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

  it("POST /register returns error on short password", async () => {
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

  it("POST /register returns error on too long password", async () => {
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

  it("POST /register returns error on already taken email address", async () => {
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

  it("GET /verify verifies email address", async () => {
    const user = await createUser({
      email: "test@test.com",
      name: "test",
      password: "test",
    });

    // New users do not start verified
    expect(user.verified).toBe(null);

    // First call will verify the email address
    await request(app)
      .get("/auth/verify/" + user.verification_token)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(200)
      .then(res => {
        expect(res.body.success).toEqual(true);
      });

    const refresh = await getUserById(user.id);

    expect(refresh.verified).not.toBe(null);

    // Subsequent calls are not successful because the email address is already verified
    await request(app)
      .get("/auth/verify/" + user.verification_token)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(200)
      .then(res => {
        expect(res.body.success).toEqual(false);
      });
  });
});
