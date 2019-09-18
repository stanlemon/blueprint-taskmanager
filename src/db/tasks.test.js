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
const { createUser } = require("./users");

beforeEach(async done => {
  // Ensures that the database has been setup correctly.
  await knex.migrate.latest();
  done();
});

beforeEach(() => {
  knex.truncate("task_tags");
  knex.truncate("tasks");
  knex.truncate("tags");
});

afterAll(() => {
  fs.unlinkSync(config.connection.filename);
});

const setupUser = () => {
  return createUser({
    name: "Test",
    email: "test@test.com",
    password: "password",
  });
};

describe("tasks database access", () => {
  it("createTask() and getTasks() and getTaskById()", async done => {
    const user = await setupUser();

    const task1 = await createTask(user.id, { name: "Task1" });
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
    const task1 = await createTask(user.id, { name: "Task1", description });

    const name = "Task1 Updated";
    const update1 = await updateTask(user.id, task1.id, { name });

    const task2 = await getTaskById(user.id, task1.id);

    expect(update1).toEqual(task2);
    expect(update1.name).toEqual(name);
    expect(update1.created_at).toEqual(task1.created_at);
    expect(update1.description).toEqual(task1.description);
    // This should have been updated
    expect(update1.updated_at).not.toEqual(task1.updated_at);

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

  // TODO Test that you can't delete someone elses task
  // TODO Test that you can't update someone elses taks
});