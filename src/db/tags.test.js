const knex = require("../connection");
const { getTags, createTag } = require("./tags");
const { createUser } = require("./users");

beforeAll(async () => {
  await knex.test.setup();
});

beforeEach(async () => {
  await knex.test.cleanup();
});

afterAll(() => {
  knex.test.teardown();
});

describe("tags database access", () => {
  it("getTags()", async () => {
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
  });
});
