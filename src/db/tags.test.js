const fs = require("fs");
const knex = require("../connection");
const config = require("../../knexfile")[process.env.NODE_ENV];
const { getTags, createTag } = require("./tags");
const { createUser } = require("./users");

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

describe("tags database access", () => {
  it("getTags()", async done => {
    const user = await createUser({
      name: "test",
      email: "test",
      password: "password",
    });
    await createTag(user.id, "foo");
    await createTag(user.id, "bar");
    await createTag(user.id, "baz");

    const tags = await getTags(user.id);

    expect(tags).toEqual(["bar", "baz", "foo"]);

    done();
  });
});
