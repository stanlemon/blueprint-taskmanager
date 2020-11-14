import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { UpdateTaskForm } from "./UpdateTaskForm";
import parseISO from "date-fns/parseISO";

describe("<UpdateTaskForm />", () => {
  it("should render a form with an existing task and update it", () => {
    let lastSavedTask = null;

    const updateTask = (task) => {
      // Store the task so that we can reference it later
      lastSavedTask = task;
    };

    const task = {
      id: 1,
      name: "Test Task",
      description: "A brief description",
      due: parseISO("2018-06-12T07:08"),
      completed: parseISO("2017-06-12T07:08"),
      tags: [],
    };

    render(<UpdateTaskForm task={task} updateTask={updateTask} />);

    expect(screen.getByLabelText("Name")).toHaveValue(task.name);
    expect(screen.getByLabelText("Due")).toHaveValue("06/12/2018 7:08AM");
    expect(
      screen.getByLabelText("Completed on June 12th 2017, 7:08AM")
    ).toBeChecked();
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

    // Uncheck the checkbox
    fireEvent.click(
      screen.getByLabelText("Completed on June 12th 2017, 7:08AM")
    );

    // Once the checkbox is flipped the label with the date should go away...
    expect(screen.queryByLabelText("Completed on June 12th 2017, 7:08AM")).toBe(
      null
    );
    // ...and just say completed
    expect(screen.getByLabelText("Completed")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    // When we submit we should have the original task, but with the new name and description fields
    expect(lastSavedTask).toEqual({
      id: task.id,
      name: newName,
      description: newDescription,
      due: task.due, // field is unchanged
      completed: null,
      tags: [],
    });
  });

  it("should render errors when a task cannot be updated", async () => {
    const errors = { name: "Error on name field" };
    const view = render(
      <UpdateTaskForm task={{}} errors={errors} updateTask={() => {}} />
    );

    expect(view.getByText(errors.name)).toBeInTheDocument();
  });
});
