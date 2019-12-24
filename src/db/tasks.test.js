const knex = require("../connection");
const {
  getTaskById,
  getTasks,
  countTasks,
  createTask,
  updateTask,
  deleteTask,
} = require("./tasks");
const { createTag } = require("./tags");
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

const setupUser = () => {
  return createUser({
    name: "Test",
    email: "test" + Date.now() + "@test.com",
    password: "password",
  });
};

describe("tasks database access", () => {
  it("createTask() and getTasks() and getTaskById()", async () => {
    const user = await setupUser();

    const task1 = await createTask(user.id, { name: "Task1", tags: ["foo"] });
    const task2 = await createTask(user.id, { name: "Task1" });
    const task3 = await createTask(user.id, { name: "Task1" });

    const total = await countTasks(user.id);

    expect(total).toEqual(3);

    const tasks = await getTasks(user.id);

    expect([task1, task2, task3]).toMatchObject(tasks);

    const refresh1 = await getTaskById(user.id, task1.id);

    expect(task1).toEqual(refresh1);
  });

  it("updateTask()", async () => {
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
  });

  it("deleteTask()", async () => {
    const user = await setupUser();

    const task1 = await createTask(user.id, { name: "Task1" });

    const tasks1 = await getTasks(user.id);

    expect([task1]).toMatchObject(tasks1);

    await deleteTask(user.id, task1.id);

    const tasks2 = await getTasks(user.id);

    expect([]).toMatchObject(tasks2);
  });

  it("getTaskById() with tags", async () => {
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
  });

  it("deleteTask() for other user", async () => {
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
  });

  it("updateTask() for other user", async () => {
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
  });

  it("getTasks() paginates", async () => {
    const user = await setupUser();

    const task1 = await createTask(user.id, { name: "Task1" });
    const task2 = await createTask(user.id, { name: "Task2" });
    const task3 = await createTask(user.id, { name: "Task3" });
    const task4 = await createTask(user.id, { name: "Task4" });
    const task5 = await createTask(user.id, { name: "Task5" });
    const task6 = await createTask(user.id, { name: "Task6" });
    const task7 = await createTask(user.id, { name: "Task7" });
    const task8 = await createTask(user.id, { name: "Task8" });
    const task9 = await createTask(user.id, { name: "Task9" });
    const task10 = await createTask(user.id, { name: "Task10" });

    expect(await getTasks(user.id)).toMatchObject([
      task1,
      task2,
      task3,
      task4,
      task5,
      task6,
      task7,
      task8,
      task9,
      task10,
    ]);

    expect(await getTasks(user.id, "all", 1, 5)).toMatchObject([
      task1,
      task2,
      task3,
      task4,
      task5,
    ]);

    expect(await getTasks(user.id, "all", 2, 5)).toMatchObject([
      task6,
      task7,
      task8,
      task9,
      task10,
    ]);

    expect(await getTasks(user.id, "all", 3, 5)).toMatchObject([]);
  });

  it("getTasks() filters", async () => {
    const user = await setupUser();

    const task1 = await createTask(user.id, { name: "Task1" });
    const task2 = await createTask(user.id, {
      name: "Task2",
      completed: new Date(),
    });

    expect(await getTasks(user.id, "all")).toMatchObject([task1, task2]);
    expect(await getTasks(user.id, "complete")).toMatchObject([task2]);
    expect(await getTasks(user.id, "incomplete")).toMatchObject([task1]);
  });
});
