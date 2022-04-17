import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import subDays from "date-fns/subDays";
import addDays from "date-fns/addDays";
import isSameDay from "date-fns/isSameDay";
import parseISO from "date-fns/parseISO";
import { makeDateTime } from "../lib/Utils";
import { getCurrentPathname } from "../lib/Navigation";
import { TaskItem } from "./TaskItem";
import { ROUTE_TASK_VIEW } from "./Routes";

describe("<TaskItem />", () => {
  const updateTask = () => {};
  const deleteTask = () => {};

  it("should render the task name", () => {
    const task = {
      id: 1,
      name: "Foobar",
      due: null,
      completed: null,
    };

    const { container } = render(
      <TaskItem task={task} updateTask={updateTask} deleteTask={deleteTask} />
    );

    const taskName = screen.getByText(task.name);

    expect(taskName).toBeInTheDocument();

    // We shouldn't find these classes which communicate various states to the user about the given task
    expect(container.querySelector(".task-completed")).toBe(null);
    expect(container.querySelector(".task-overdue")).toBe(null);
    expect(container.querySelector(".task-due-soon")).toBe(null);
  });

  it("should render a completed task with a checked checkbox", () => {
    const task = {
      id: 1,
      name: "Foobar",
      completed: makeDateTime(),
    };

    render(
      <TaskItem task={task} updateTask={updateTask} deleteTask={deleteTask} />
    );

    const taskName = screen.getByText(task.name);

    expect(taskName).toBeInTheDocument();

    // Brittle check to make sure there is a line through the name of a completed task
    expect(taskName.style.getPropertyValue("text-decoration")).toEqual(
      "line-through"
    );
  });

  it("should render an overdue task", () => {
    const task = {
      id: 1,
      name: "Foobar",
      completed: false,
      due: subDays(Date.now(), 3),
    };

    render(
      <TaskItem task={task} updateTask={updateTask} deleteTask={deleteTask} />
    );

    const taskName = screen.getByText(task.name);

    expect(taskName).toBeInTheDocument();

    // Brittle test to check that the color of an overdue task is red
    expect(taskName.style.getPropertyValue("color")).toEqual("red");
    expect(taskName.style.getPropertyValue("text-decoration")).toEqual("none");
  });

  it("should render an uncompleted task that is due soon", () => {
    const task = {
      id: 1,
      name: "Foobar",
      completed: null,
      due: addDays(Date.now(), 1),
    };

    render(
      <TaskItem task={task} updateTask={updateTask} deleteTask={deleteTask} />
    );

    const taskName = screen.getByText(task.name);

    expect(taskName).toBeInTheDocument();

    // Brittle test to check that the color of a task due soon is orange
    expect(taskName.style.getPropertyValue("color")).toEqual("orange");
    expect(taskName.style.getPropertyValue("text-decoration")).toEqual("none");
  });

  it("clicking on a task's name navigates to view it", () => {
    const task = {
      id: 1,
      name: "Foobar",
      completed: null,
      due: addDays(Date.now(), 2),
    };

    render(
      <TaskItem task={task} updateTask={updateTask} deleteTask={deleteTask} />
    );

    const taskName = screen.getByText(task.name);

    expect(taskName).toBeInTheDocument();

    fireEvent.click(taskName);

    expect(getCurrentPathname()).toEqual(ROUTE_TASK_VIEW.replace(":id", 1));
  });

  it("clicking on a task's delete button calls the delete action with the right id", () => {
    const task = {
      id: 1234,
      name: "Foobar",
      completed: null,
      due: addDays(Date.now(), 2),
    };

    let deletedTaskId;

    render(
      <TaskItem
        task={task}
        updateTask={updateTask}
        deleteTask={(id) => (deletedTaskId = id)}
      />
    );

    // This should be the button on the task row
    fireEvent.click(screen.getByRole("button", { name: "Delete Task" }));

    // This text should appear in the modal
    expect(
      screen.getByText("Are you sure you want to delete this task?")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();

    // This should be the delete button on the modal
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));

    // Confirm that we deleted the right task
    expect(deletedTaskId).toEqual(task.id);

    // The modal should be closed
    expect(
      screen.queryByText("Are you sure you want to delete this task?")
    ).toBe(null);
  });

  it("clicking on an incomplete task's checkbox marks it complete", () => {
    const task = {
      id: 1234,
      name: "Foobar",
      completed: null,
      due: addDays(Date.now(), 2),
    };

    let updatedTask;

    render(
      <TaskItem
        task={task}
        updateTask={(t) => {
          updatedTask = t;
        }}
        deleteTask={deleteTask}
      />
    );

    expect(screen.getByRole("checkbox")).not.toBeChecked();

    fireEvent.click(screen.getByRole("checkbox")); // Do not check that its checked because this is handled by a prop

    expect(updatedTask.id).toEqual(task.id);
    expect(updatedTask.completed).not.toBe(null);

    // Date will be made a string before being passed to the action, so we need to convert it back to a Date object
    expect(isSameDay(parseISO(updatedTask.completed), Date.now())).toBe(true);
  });

  it("clicking on a completed task's checkbox clears it's completed date", async () => {
    const task = {
      id: 1234,
      name: "Foobar",
      completed: makeDateTime(Date.now()),
      due: addDays(Date.now(), 2),
    };

    let updatedTask;

    render(
      <TaskItem
        task={task}
        updateTask={(t) => {
          updatedTask = t;
        }}
        deleteTask={deleteTask}
      />
    );

    const checkbox = screen.getByRole("checkbox");

    expect(checkbox).toBeChecked();

    fireEvent.click(checkbox); // Do not check it's unchecked because that's handled by a prop not state

    expect(updatedTask.id).toEqual(task.id);
    expect(updatedTask.completed).toBe(null);
  });

  it("a task is overdue", () => {
    const task = {
      id: 1,
      name: "Foobar",
      completed: null,
      due: subDays(Date.now(), 7),
    };

    render(
      <TaskItem task={task} updateTask={updateTask} deleteTask={deleteTask} />
    );

    const taskName = screen.getByText(task.name);

    expect(taskName).toBeInTheDocument();

    // Brittle test to check the color of the task
    expect(taskName.style.getPropertyValue("color")).toEqual("red");
    expect(taskName.style.getPropertyValue("text-decoration")).toEqual("none");
  });

  it("a task is due soon", () => {
    const task1 = {
      id: 1,
      name: "Foobar",
      completed: null,
      due: addDays(Date.now(), 1),
    };

    render(
      <TaskItem task={task1} updateTask={updateTask} deleteTask={deleteTask} />
    );

    const taskName = screen.getByText(task1.name);

    expect(taskName).toBeInTheDocument();

    // Brittle test to check the color of the task
    expect(taskName.style.getPropertyValue("color")).toEqual("orange");
    expect(taskName.style.getPropertyValue("text-decoration")).toEqual("none");
  });

  it("a task is due, but not soon", () => {
    // If the task is due far out, it's not due soon
    const task2 = {
      id: 2,
      name: "Foobar",
      completed: null,
      due: addDays(Date.now(), 3), // tasks due within 2 days are due 'soon'
    };

    render(
      <TaskItem task={task2} updateTask={updateTask} deleteTask={deleteTask} />
    );

    const taskName = screen.getByText(task2.name);

    expect(taskName).toBeInTheDocument();

    // Brittle test to check the color of the task
    expect(taskName.style.getPropertyValue("color")).toEqual("");
    expect(taskName.style.getPropertyValue("text-decoration")).toEqual("none");
  });
});
