import React from "react";
import parse from "date-fns/parse";
import parseISO from "date-fns/parseISO";
import isSameDay from "date-fns/isSameDay";
import { fireEvent, render, screen } from "@testing-library/react";
import TaskForm from "./TaskForm";

describe("<TaskForm />", () => {
  it("should render an empty form with and submit a new task in it", () => {
    let lastSavedTask = null;

    const save = (task) => {
      // Store the task so that we can reference it later
      lastSavedTask = task;
      // Returning the value updates the form's state
      return task;
    };

    const task = {
      id: null,
      name: "Test Task",
      description: "A brief description",
      due: null,
      completed: null,
      tags: [],
    };

    render(<TaskForm task={{}} onSubmit={save} />);

    // Update the task name
    expect(screen.getByLabelText("Name")).toHaveValue("");
    fireEvent.change(screen.getByLabelText("Name"), {
      target: {
        value: task.name,
      },
    });
    expect(screen.getByLabelText("Name")).toHaveValue(task.name);

    // Update the task description
    expect(screen.getByLabelText("Description")).toHaveValue("");
    fireEvent.change(screen.getByLabelText("Description"), {
      target: {
        value: task.description,
      },
    });
    expect(screen.getByLabelText("Description")).toHaveValue(task.description);

    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(lastSavedTask).toEqual(task);
  });

  it("submitting a form without a task name triggers an error", () => {
    const save = (r) => r;

    render(<TaskForm onSubmit={save} />);

    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(
      screen.getByText("You must enter a name for this task.")
    ).toBeInTheDocument();
  });

  it("should render a form with an existing task and update it", () => {
    let lastSavedTask = null;

    const save = (task) => {
      // Store the task so that we can reference it later
      lastSavedTask = task;
      return task;
    };

    const task = {
      id: 1,
      name: "Test Task",
      description: "A brief description",
      due: parseISO("2018-06-12T07:08"),
      completed: null, // Note that you can't set completion when creating
    };

    render(<TaskForm task={task} onSubmit={save} />);

    // Check that the fields we have are set correctly
    expect(screen.getByLabelText("Name")).toHaveValue(task.name);
    expect(screen.getByLabelText("Due")).toHaveValue("06/12/2018 07:08AM");
    expect(screen.getByLabelText("Completed")).not.toBeChecked();
    expect(screen.getByLabelText("Description")).toHaveValue(task.description);

    // Update the task name
    const newName = "New Task Name";
    fireEvent.change(screen.getByLabelText("Name"), {
      target: {
        value: newName,
      },
    });

    // Update the task description
    const newDescription = "New Task Description";
    fireEvent.change(screen.getByLabelText("Description"), {
      target: {
        value: newDescription,
      },
    });

    // Check the checkbox, we validate the date on submit
    fireEvent.click(screen.getByLabelText("Completed"));

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    // When we submit we should have the original task, but with the new name and description fields
    expect(lastSavedTask).toMatchObject({
      id: task.id,
      name: newName,
      description: newDescription,
      due: task.due, // field is unchanged
      // Leave out completed, we'll check it next
    });

    expect(isSameDay(new Date(), lastSavedTask.completed)).toBe(true);
  });

  it("clicking on due opens a pop up", () => {
    const save = (r) => r;

    render(<TaskForm onSubmit={save} />);

    const dueInput = screen.getByLabelText("Due");

    expect(dueInput).toBeInTheDocument();

    // Clicking on the input should open the datepicker
    fireEvent.click(dueInput);

    // Click on today to set the date
    fireEvent.click(screen.getByText("Today"));

    const dueValue = parse(dueInput.value, "MM/dd/yyyy hh:mmaa", Date.now());

    expect(isSameDay(new Date(), dueValue)).toBe(true);
  });

  it("renders errors from actions", () => {
    const errorMessages = {
      description: "Error message about description",
      due: "Error message about due",
    };

    render(<TaskForm onSubmit={(t) => t} errors={errorMessages} />);

    expect(screen.getByText(errorMessages.description)).toBeInTheDocument();
    expect(screen.getByText(errorMessages.due)).toBeInTheDocument();
  });
});
