const knex = require("../connection");
const { parseISO, isSameDay } = require("date-fns");
const { omit } = require("lodash");
const {
  createUser,
  updateUser,
  getUserById,
  getUserByEmail,
  getUserByEmailAndPassword,
  getUserByVerificationToken,
} = require("./users");

beforeAll(async () => {
  await knex.test.setup();
});

beforeEach(async () => {
  await knex.test.cleanup();
});

afterAll(() => {
  knex.test.teardown();
});

describe("users database access", () => {
  it("createUser() and getUserBy...()", async () => {
    const name = "Test Test";
    const email = "test@test.com";
    const password = "password";

    const user = await createUser({ email, password, name });

    expect(user.name).toEqual(name);
    expect(user.email).toEqual(email);
    expect(user.password).toBe(undefined);
    expect(isSameDay(parseISO(user.created_at), Date.now())).toBe(true);
    expect(user.created_at).toEqual(user.updated_at);
    expect(user.verification_token).not.toBe(null);
    expect(user.verified).toBe(null);
    expect(user.active).toBe(1);

    const refresh1 = await getUserById(user.id);

    expect(refresh1).toEqual(user);

    const refresh2 = await getUserByEmail(user.email);

    expect(refresh2).toEqual(user);

    const refresh3 = await getUserByEmailAndPassword(user.email, password);

    expect(refresh3).toEqual(user);

    const refresh4 = await getUserByVerificationToken(user.verification_token);

    expect(refresh4).toEqual(user);
  });

  it("updateUser()", async () => {
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
  });

  it("createUser() with existing username", async () => {
    const name = "Test Test";
    const email = "test@test.com";
    const password = "password";

    // Create the first user  with this email address
    await createUser({ email, password, name });

    // Actually an InvalidArgument, but this expectation doesn't work with that
    /* eslint-disable-next-line jest/valid-expect */
    expect(createUser({ email, password, name })).rejects.toEqual(
      new Error("A user with this email address already exists")
    );
  });
});
