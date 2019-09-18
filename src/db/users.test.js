const knex = require("../connection");
const fs = require("fs");
const config = require("../../knexfile")[process.env.NODE_ENV];
const { parseISO, isSameDay } = require("date-fns");
const { omit } = require("lodash");
const {
  createUser,
  updateUser,
  getUserById,
  getUserByEmail,
  getUserByEmailAndPassword,
} = require("./users");

beforeAll(async done => {
  // Ensures that the database has been setup correctly.
  await knex.migrate.latest();
  done();
});

beforeEach(() => {
  knex.truncate("users");
});

afterAll(() => {
  fs.unlinkSync(config.connection.filename);
});

describe("users database access", () => {
  it("createUser() and getUserBy...()", async done => {
    const name = "Test Test";
    const email = "test@test.com";
    const password = "password";

    const user = await createUser({ email, password, name });

    expect(user.name).toEqual(name);
    expect(user.email).toEqual(email);
    expect(isSameDay(parseISO(user.created_at), Date.now())).toBe(true);
    expect(user.created_at).toEqual(user.updated_at);
    expect(user.active).toBe(1);

    const refresh1 = await getUserById(user.id);

    expect(refresh1).toEqual(user);

    const refresh2 = await getUserByEmail(user.email);

    expect(refresh2).toEqual(user);

    const refresh3 = await getUserByEmailAndPassword(user.email, password);

    expect(refresh3).toEqual(user);

    done();
  });

  it("updateUser()", async done => {
    const user = await createUser({
      name: "Test",
      email: "test@test.com",
      password: "foobar",
    });

    // Full refresh
    const refresh1 = await getUserById(user.id);

    const name1 = "Testing!";

    await updateUser(user.id, { name: name1 });

    const refresh2 = await getUserById(user.id);

    // Compare everything but update_at, which we know should now be different
    expect(omit(refresh2, ["updated_at"])).toEqual(
      omit(Object.assign({}, refresh1, { name: name1 }), ["updated_at"])
    );

    expect(refresh2.updated_at).not.toEqual(refresh1.updated_at);

    done();
  });

  // TODO: Test a failed user creation
  // TODO: Test a user with a bad password
});
