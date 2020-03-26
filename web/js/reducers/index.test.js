import { user, errors, loaded, tasks, tags, filter, page } from "./index";
import {
  AUTHENTICATED_USER,
  ERROR,
  LOAD_TASKS_ERROR,
  CREATE_TASK_ERROR,
  UPDATE_TASK_ERROR,
  DELETE_TASK_ERROR,
  AUTHENTICATION_ERROR,
  REGISTER_ERROR,
  CLEAR_ERRORS,
  LOAD_TASKS_SUCCESS,
  UNAUTHENTICATED_USER,
  DELETE_TASK_SUCCESS,
  UPDATE_TASK_SUCCESS,
  CREATE_TASK_SUCCESS,
  LOAD_TAGS_SUCCESS,
  SET_FILTER,
  SET_PAGE,
  GET_TASK_SUCCESS,
} from "../actions/index";

describe("reducers", () => {
  it("users()", () => {
    expect(user(null, { type: UNAUTHENTICATED_USER })).toEqual(null);

    expect(
      user(null, {
        type: AUTHENTICATED_USER,
        user: { username: "stanlemon" },
      })
    ).toEqual({ username: "stanlemon" });

    expect(user({ username: "stanlemon" }, { type: "unknown" })).toEqual({
      username: "stanlemon",
    });
  });

  it("errors()", () => {
    const types = [
      ERROR,
      LOAD_TASKS_ERROR,
      CREATE_TASK_ERROR,
      UPDATE_TASK_ERROR,
      DELETE_TASK_ERROR,
      AUTHENTICATION_ERROR,
      REGISTER_ERROR,
    ];

    types.forEach((type) => {
      expect(
        errors({ foo: "bar" }, { type: type, errors: { bar: "baz" } })
      ).toEqual({
        foo: "bar",
        bar: "baz",
      });
    });

    expect(errors({ foo: "bar" }, { type: "unknown" })).toEqual({
      foo: "bar",
    });

    expect(errors({ foo: "bar" }, { type: CLEAR_ERRORS })).toEqual({});
  });

  it("loaded()", () => {
    expect(loaded([], { type: GET_TASK_SUCCESS })).toEqual(["tasks"]);

    expect(loaded([], { type: LOAD_TASKS_SUCCESS })).toEqual(["tasks"]);
    expect(loaded(["tasks", "users"], { type: LOAD_TASKS_SUCCESS })).toEqual([
      "tasks",
      "users",
    ]);

    expect(loaded([], { type: UNAUTHENTICATED_USER })).toEqual(["user"]);
    expect(loaded(["tasks", "user"], { type: UNAUTHENTICATED_USER })).toEqual([
      "tasks",
      "user",
    ]);

    expect(loaded([], { type: AUTHENTICATED_USER })).toEqual(["user"]);
    expect(loaded(["tasks", "user"], { type: AUTHENTICATED_USER })).toEqual([
      "tasks",
      "user",
    ]);

    expect(loaded(["tasks", "user"], { type: "unknown" })).toEqual([
      "tasks",
      "user",
    ]);
  });

  it("tasks()", () => {
    const task1 = {
      id: 1,
      name: "Task One",
    };
    const task2 = {
      id: 2,
      name: "Task Two",
      completed: new Date(),
      due: new Date(),
    };

    // The second task is appended to the tasks we've already loaded
    expect(
      tasks(
        { tasks: [task1] },
        {
          type: GET_TASK_SUCCESS,
          task: task2,
        }
      )
    ).toMatchObject({ tasks: [task1, task2] });

    const task3 = { id: 3, name: "Task Three" };
    const task4 = { id: 4, name: "Task Four" };
    const modifiedTask4 = { ...task4, name: "Task Four Redux" };

    // If the task we're getting already exists, we replace it, because the individual request might
    // include more recent changes
    expect(
      tasks(
        { tasks: [task3, task4] },
        {
          type: GET_TASK_SUCCESS,
          task: modifiedTask4,
        }
      )
    ).toMatchObject({ tasks: [task3, modifiedTask4] });

    // State for tasks hasn't been set (not an array), still loads the task properly
    expect(
      tasks(
        { tasks: null },
        {
          type: GET_TASK_SUCCESS,
          task: task3,
        }
      )
    ).toMatchObject({ tasks: [task3] });

    expect(
      tasks(
        { tasks: [] },
        {
          type: LOAD_TASKS_SUCCESS,
          tasks: { tasks: [{ id: 1, name: "Task One" }] },
        }
      )
    ).toMatchObject({ tasks: [{ id: 1, name: "Task One" }] });

    // Task loading is not additive
    expect(
      tasks(
        { tasks: [{ id: 1, name: "Task One" }] },
        {
          type: LOAD_TASKS_SUCCESS,
          tasks: { tasks: [{ id: 2, name: "Task Two" }] },
        }
      )
    ).toMatchObject({ tasks: [{ id: 2, name: "Task Two" }] });

    let state;

    state = { tasks: [{ id: 1, name: "Task One" }] };

    expect(
      tasks(state, {
        type: CREATE_TASK_SUCCESS,
        task: { id: 2, name: "Task Two" },
      })
    ).toMatchObject(state);

    state = {
      tasks: [
        { id: 1, name: "Task One" },
        { id: 2, name: "Task Two" },
      ],
    };

    expect(
      tasks(state, {
        type: UPDATE_TASK_SUCCESS,
        task: { id: 1, name: "Task One Now Has A Longer Name" },
      })
    ).toMatchObject(state);

    state = {
      tasks: [
        { id: 1, name: "Task One" },
        { id: 2, name: "Task Two" },
      ],
    };

    expect(
      tasks(state, {
        type: DELETE_TASK_SUCCESS,
        taskId: 2,
      })
    ).toMatchObject(state);

    state = {
      tasks: [
        { id: 1, name: "Task One" },
        { id: 2, name: "Task Two" },
      ],
    };

    expect(
      tasks(state, {
        type: "unknown",
      })
    ).toMatchObject(state);
  });

  it("tags()", () => {
    const input1 = ["foo", "bar", "baz"];

    // Empty tags with new tags
    expect(
      tags([], {
        type: LOAD_TAGS_SUCCESS,
        tags: input1,
      })
    ).toMatchObject(input1);

    // Existing tags with new tags
    const input2 = ["bar", "baz"];

    expect(
      tags(["existing", "tags", "get", "cleared"], {
        type: LOAD_TAGS_SUCCESS,
        tags: input2,
      })
    ).toMatchObject(input2);

    // Unknown action doesn't change existing tags
    const existing = ["foo", "bar", "baz"];

    expect(
      tags(existing, {
        type: "UNKNOWN",
      })
    ).toMatchObject(existing);
  });

  it("filter()", () => {
    expect(filter(undefined, { type: SET_FILTER, filter: "all" })).toEqual(
      "all"
    );
    expect(filter("all", { type: "UNKNOWN" })).toEqual("all");
  });

  it("page()", () => {
    expect(page(undefined, { type: SET_PAGE, page: 1 })).toEqual(1);
    expect(page(1, { type: "UNKNOWN" })).toEqual(1);
  });
});
