import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { CreateTaskForm } from "./CreateTaskForm";

describe("<CreateTaskForm />", () => {
  it("should render an empty form with and submit a new task in it", () => {
    let lastSavedTask = null;

    const createTask = task => {
      // Store the task so that we can reference it later
      lastSavedTask = task;
    };

    const task = {
      id: null,
      name: "Test Task",
      description: "A brief description",
      due: null,
      completed: null,
      tags: [],
    };

    const view = render(<CreateTaskForm task={task} createTask={createTask} />);

    const name = view.getByLabelText("Name");

    expect(name.value).toEqual("");

    const description = view.getByLabelText("Description");

    expect(description.value).toEqual("");

    const due = view.getByLabelText("Due");

    expect(due.value).toEqual("");

    const completed = view.queryByLabelText("Completed");

    // Create form does not include the completed checkbox
    expect(completed).toBe(null);

    fireEvent.change(name, {
      target: {
        name: "name",
        value: task.name,
      },
    });

    fireEvent.change(description, {
      target: {
        name: "description",
        value: task.description,
      },
    });

    fireEvent.click(view.getByText("Save"));

    expect(lastSavedTask).toEqual(task);
  });
});
