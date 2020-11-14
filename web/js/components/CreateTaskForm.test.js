import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CreateTaskForm } from "./CreateTaskForm";

describe("<CreateTaskForm />", () => {
  it("should render an empty form with and submit a new task in it", () => {
    let lastSavedTask = null;

    const createTask = (task) => {
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

    // Upon a successful save, the fields we've filled out should be blank
    waitFor(() => {
      expect(view.getByLabelText("Name").value).toBe("");
      expect(view.getByLabelText("Description").value).toBe("");
    });
  });

  it("should render existing data when an error happens upon creation", () => {
    const response = { errors: { name: "Error on name field" } };
    const createTask = () => Promise.resolve(response);

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

    fireEvent.change(name, {
      target: {
        name: "name",
        value: task.name,
      },
    });

    fireEvent.click(view.getByText("Save"));

    // If the save had been successful this would have been blank
    expect(view.getByLabelText("Name").value).toBe(task.name);
    // Note we don't check for the pressence of the error in this call because it bubbles down as a prop
  });

  it("should render an error on the page", () => {
    const errors = { name: "Error on name field" };
    const view = render(
      <CreateTaskForm task={{}} errors={errors} createTask={() => {}} />
    );

    expect(view.getByText(errors.name)).toBeInTheDocument();
  });
});
