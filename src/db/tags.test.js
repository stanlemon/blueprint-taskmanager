const knex = require("../connection");
const { getTags, upsertTags } = require("./tags");
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
  it("upsertTags() and getTags()", async () => {
    const user = await createUser({
      name: "test",
      email: "test",
      password: "password",
    });
    const tags1 = await upsertTags(user.id, ["foo"]);
    // Try inserting foo again, we should only get one 'foo'
    const tags2 = await upsertTags(user.id, ["foo", "bar", "baz"]);
    // Inserting exactly the same should change nothing down below
    await upsertTags(user.id, ["foo", "bar", "baz"]);

    // The object created in the first call should match the last one (they are ordered alphabetically) in the second
    // because it will not re-insert an existing tag
    expect(tags2[2]).toEqual(tags1[0]);

    // Returns just the strings
    const tags = await getTags(user.id);

    expect(tags).toEqual(["bar", "baz", "foo"]);
  });
});
