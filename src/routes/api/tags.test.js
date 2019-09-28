const request = require("supertest");
const express = require("express");
const fs = require("fs");
const knex = require("../../connection");
const config = require("../../../knexfile")[process.env.NODE_ENV];
const api = require("./tags");
const { createUser } = require("../../db/users");
const { createTag } = require("../../db/tags");

beforeEach(async done => {
  // Ensures that the database has been setup correctly.
  await knex.migrate.latest();
  done();
});

beforeEach(() => {
  knex.truncate("tags");
});

afterAll(() => {
  fs.unlinkSync(config.connection.filename);
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

    const app = express();
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
