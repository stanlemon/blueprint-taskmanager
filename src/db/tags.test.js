const knex = require("../connection");
const { getTags, createTag } = require("./tags");
const { createUser } = require("./users");

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
