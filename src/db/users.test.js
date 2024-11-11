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

    const refresh5 = await getUserByEmailAndPassword(
      user.email,
      "NOT CORRECT PASSWORD"
    );

    expect(refresh5).toEqual(false);
  });

  it("createUser() with existing username", async () => {
    const name = "Test Test";
    const email = "test@test.com";
    const password = "password";

    // Create the first user  with this email address
    await createUser({ email, password, name });

    // Actually an InvalidArgument, but this expectation doesn't work with that

    expect(createUser({ email, password, name })).rejects.toEqual(
      new Error("A user with this email address already exists")
    );
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
    // Note, verification token & passwords especially should not change
    expect(omit(refresh2, ["updated_at"])).toEqual(
      omit(Object.assign({}, refresh1, { name: name1 }), ["updated_at"])
    );

    expect(refresh2.updated_at).not.toEqual(refresh1.updated_at);
  });

  it("updateUser() with email change reset verification", async () => {
    const user = await createUser({
      name: "Test",
      email: "test@test.com",
      password: "foobar",
    });

    // Changing the email address will make a new verification token and reset the date
    const refresh = await updateUser(user.id, { email: "foo@foo.com" });

    expect(user.verification_token).not.toBe(refresh.verification_token);
    expect(refresh.verified).toBeNull();
  });

  it("updateUser() with password change", async () => {
    const data = {
      name: "Test",
      email: "test@test.com",
      password: "foo",
    };

    const user = await createUser(data);

    const refresh1 = await getUserByEmailAndPassword(user.email, data.password);

    // This user can be retrieved by its password
    expect(refresh1.id).toBe(user.id);

    const newPassword = "bar";

    // Changing the user's password
    await updateUser(user.id, { password: newPassword });

    const refresh2 = await getUserByEmailAndPassword(user.email, newPassword);

    // This user can be retrieved by its password
    expect(refresh2.id).toBe(user.id);
  });

  it("updateUser() non existent", async () => {
    let thrown = false;

    try {
      await updateUser(123456, {});
    } catch (error) {
      thrown = error instanceof Error;
    }

    expect(thrown).toBe(true);
  });
});
