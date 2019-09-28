const fs = require("fs");
const knex = require("../connection");
const config = require("../../knexfile")[process.env.NODE_ENV];
const {
  getTaskById,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require("./tasks");
const { createTag } = require("./tags");
const { createUser } = require("./users");

beforeEach(async done => {
  // Ensures that the database has been setup correctly.
  await knex.migrate.latest();
  done();
});

beforeEach(async () => {
  await knex.truncate("task_tags");
  await knex.truncate("tasks");
  await knex.truncate("tags");
});

afterAll(() => {
  fs.unlinkSync(config.connection.filename);
});

const setupUser = () => {
  return createUser({
    name: "Test",
    email: "test" + Date.now() + "@test.com",
    password: "password",
  });
};

describe("tasks database access", () => {
  it("createTask() and getTasks() and getTaskById()", async done => {
    const user = await setupUser();

    const task1 = await createTask(user.id, { name: "Task1", tags: ["foo"] });
    const task2 = await createTask(user.id, { name: "Task1" });
    const task3 = await createTask(user.id, { name: "Task1" });

    const tasks = await getTasks(user.id);

    expect([task1, task2, task3]).toMatchObject(tasks);

    const refresh1 = await getTaskById(user.id, task1.id);

    expect(task1).toEqual(refresh1);

    done();
  });

  it("updateTask()", async done => {
    const user = await setupUser();

    const description = "A task description should go unchanged.";
    const tags = ["foo", "bar"];
    const task1 = await createTask(user.id, {
      name: "Task1",
      description,
      tags,
    });

    const name = "Task1 Updated";
    const update1 = await updateTask(user.id, task1.id, {
      name,
      tags: ["foo", "baz"],
    });

    const task2 = await getTaskById(user.id, task1.id);

    expect(update1).toEqual(task2);
    expect(update1.name).toEqual(name);
    expect(update1.created_at).toEqual(task1.created_at);
    expect(update1.description).toEqual(task1.description);
    // This should have been updated
    expect(update1.updated_at).not.toEqual(task1.updated_at);
    expect(update1.tags).toEqual(["baz", "foo"]);

    done();
  });

  it("deleteTask()", async done => {
    const user = await setupUser();

    const task1 = await createTask(user.id, { name: "Task1" });

    const tasks1 = await getTasks(user.id);

    expect([task1]).toMatchObject(tasks1);

    await deleteTask(user.id, task1.id);

    const tasks2 = await getTasks(user.id);

    expect([]).toMatchObject(tasks2);

    done();
  });

  it("getTaskById() with tags", async done => {
    const user = await setupUser();

    await createTag(user.id, "baz");
    await createTag(user.id, "buzz");

    // This should create two new tags and map an existing one
    const tags1 = ["bar", "baz", "foo"]; // Sorted alphabetically
    const task = await createTask(user.id, { name: "Task1", tags: tags1 });

    const refresh1 = await getTaskById(user.id, task.id);

    expect(refresh1.tags).toMatchObject(tags1);

    // This should delete two tags, add one existing that's not mapped and one new one
    const tags2 = ["bar", "buzz", "fizz"];
    const refresh2 = await updateTask(user.id, task.id, { tags: tags2 });

    expect(refresh2.tags).toMatchObject(tags2);

    // Change something else about the task, don't set tags at all, they should all remain
    const refresh3 = await updateTask(user.id, task.id, { name: "New name" });

    expect(refresh3.tags).toMatchObject(tags2);

    // An empty array should clear out all of the tags for the task
    const refresh4 = await updateTask(user.id, task.id, { tags: [] });

    expect(refresh4.tags).toMatchObject([]);

    done();
  });

  it("deleteTask() for other user", async done => {
    const user1 = await setupUser();
    const user2 = await setupUser();

    const task1 = await createTask(user1.id, { name: "Task1" });

    const tasks1 = await getTasks(user1.id);

    expect(tasks1[0].id).toEqual(task1.id);

    const status = await deleteTask(user2.id, task1.id);

    expect(status).toBe(false);

    const tasks2 = await getTasks(user1.id);

    // Task is still there!
    expect(tasks2[0].id).toEqual(task1.id);

    done();
  });

  it("updateTask() for other user", async done => {
    const user1 = await setupUser();
    const user2 = await setupUser();

    const name = "Task1" + Date.now();
    const task1 = await createTask(user1.id, { name });

    const tasks1 = await getTasks(user1.id);

    expect(tasks1[0].id).toEqual(task1.id);
    expect(tasks1[0].name).toEqual(task1.name);

    await updateTask(user2.id, task1.id, {
      name: "Not " + name,
    });

    const tasks2 = await getTasks(user1.id);

    // Task hasn't changed!
    expect(tasks2[0].id).toEqual(task1.id);
    expect(tasks2[0].name).toEqual(task1.name);

    done();
  });
});
