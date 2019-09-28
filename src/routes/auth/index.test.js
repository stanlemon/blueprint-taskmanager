const request = require("supertest");
const knex = require("../../connection");
const app = require("../../app");
const api = require("./index");
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

describe("/auth/register", () => {
  app.use(api);

  it("POST creates a user", async done => {
    const name = "Test Tester";
    const email = "test@test.com";
    const password = "p@$$w0rd!";

    const data = { name, email, password };

    request(app)
      .post("/auth/register")
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .send(data)
      // Upon successful creation the user will be redirected to the session endpoint
      .expect(302)
      .expect("Location", "/auth/session")
      .end((err, res) => {
        console.log(res.body);
        if (err) {
          throw err;
        }

        done();
      });
  });

  it("POST returns error on empty data", async done => {
    request(app)
      .post("/auth/register")
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(400)
      .end((err, res) => {
        if (err) {
          throw err;
        }

        expect(res.body.errors).not.toBe(undefined);
        expect(res.body.errors.name).not.toBe(undefined);
        expect(res.body.errors.email).not.toBe(undefined);
        expect(res.body.errors.password).not.toBe(undefined);

        done();
      });
  });

  it("POST returns error on invalid email", async done => {
    request(app)
      .post("/auth/register")
      .send({
        email: "not an email address",
        name: "Test Tester",
        password: "p@$$w0rd!",
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(400)
      .end((err, res) => {
        if (err) {
          throw err;
        }

        expect(res.body.errors).not.toBe(undefined);
        expect(res.body.errors.email).not.toBe(undefined);

        done();
      });
  });

  it("POST returns error on short password", async done => {
    request(app)
      .post("/auth/register")
      .send({
        email: "test@test.com",
        name: "Test Tester",
        password: "short",
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(400)
      .end((err, res) => {
        if (err) {
          throw err;
        }

        expect(res.body.errors).not.toBe(undefined);
        expect(res.body.errors.password).not.toBe(undefined);

        done();
      });
  });

  it("POST returns error on too long password", async done => {
    request(app)
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
      .end((err, res) => {
        if (err) {
          throw err;
        }

        expect(res.body.errors).not.toBe(undefined);
        expect(res.body.errors.password).not.toBe(undefined);

        done();
      });
  });

  it("POST returns error on already taken email address", async done => {
    await createUser({
      email: "test@test.com",
      name: "test",
      password: "test",
    });

    request(app)
      .post("/auth/register")
      .send({
        email: "test@test.com",
        name: "Test Tester",
        password: "p@$$w0rd!",
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(500)
      .end((err, res) => {
        // TODO: There needs to be a way to pass up a validation error to asyncHandler()
        expect(res.body.error).toEqual(
          "A user with this email address already exists"
        );

        done();
      });
  });
});
