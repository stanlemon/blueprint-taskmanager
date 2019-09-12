import { user, errors, loaded, tasks } from "./index";
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

        types.forEach(type => {
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
        expect(loaded([], { type: LOAD_TASKS_SUCCESS })).toEqual(["tasks"]);
        expect(
            loaded(["tasks", "users"], { type: LOAD_TASKS_SUCCESS })
        ).toEqual(["tasks", "users"]);

        expect(loaded([], { type: UNAUTHENTICATED_USER })).toEqual(["user"]);
        expect(
            loaded(["tasks", "user"], { type: UNAUTHENTICATED_USER })
        ).toEqual(["tasks", "user"]);

        expect(loaded([], { type: AUTHENTICATED_USER })).toEqual(["user"]);
        expect(loaded(["tasks", "user"], { type: AUTHENTICATED_USER })).toEqual(
            ["tasks", "user"]
        );

        expect(loaded(["tasks", "user"], { type: "unknown" })).toEqual([
            "tasks",
            "user",
        ]);
    });

    it("tasks()", () => {
        expect(
            tasks([], {
                type: LOAD_TASKS_SUCCESS,
                tasks: [{ id: 1, name: "Task One" }],
            })
        ).toEqual([{ id: 1, name: "Task One" }]);

        // Task loading is not additive
        expect(
            tasks([{ id: 1, name: "Task One" }], {
                type: LOAD_TASKS_SUCCESS,
                tasks: [{ id: 2, name: "Task Two" }],
            })
        ).toEqual([{ id: 2, name: "Task Two" }]);

        expect(
            tasks([{ id: 1, name: "Task One" }], {
                type: CREATE_TASK_SUCCESS,
                task: { id: 2, name: "Task Two" },
            })
        ).toEqual([{ id: 1, name: "Task One" }, { id: 2, name: "Task Two" }]);

        expect(
            tasks([{ id: 1, name: "Task One" }, { id: 2, name: "Task Two" }], {
                type: UPDATE_TASK_SUCCESS,
                task: { id: 1, name: "Task One Now Has A Longer Name" },
            })
        ).toEqual([
            { id: 1, name: "Task One Now Has A Longer Name" },
            { id: 2, name: "Task Two" },
        ]);

        expect(
            tasks([{ id: 1, name: "Task One" }, { id: 2, name: "Task Two" }], {
                type: DELETE_TASK_SUCCESS,
                taskId: 2,
            })
        ).toEqual([{ id: 1, name: "Task One" }]);

        expect(
            tasks([{ id: 1, name: "Task One" }, { id: 2, name: "Task Two" }], {
                type: "unknown",
            })
        ).toEqual([{ id: 1, name: "Task One" }, { id: 2, name: "Task Two" }]);
    });
});
