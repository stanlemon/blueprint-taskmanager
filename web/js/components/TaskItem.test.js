import { shallow, configure } from "enzyme";
import subDays from "date-fns/subDays";
import addDays from "date-fns/addDays";
import isSameDay from "date-fns/isSameDay";
import parseISO from "date-fns/parseISO";
import Adapter from "enzyme-adapter-react-16";
import { makeDateTime } from "../lib/Utils";
import { history } from "../lib/Navigation";
import React from "react";
import { TaskItem } from "./TaskItem";
import { makeRoute } from "../lib/Navigation";
import { ROUTE_TASK_VIEW } from "./Routes";

configure({ adapter: new Adapter() });

describe("<TaskItem />", () => {
  const updateTask = () => {};
  const deleteTask = () => {};

  it("should render the task name", () => {
    const task = {
      id: 1,
      name: "Foobar",
      completed: null,
    };
    const wrapper = shallow(
      <TaskItem task={task} updateTask={updateTask} deleteTask={deleteTask} />
    );
    expect(wrapper.contains(task.name)).toBe(true);

    expect(wrapper.hasClass("task-completed")).toBe(false);
    expect(wrapper.hasClass("task-overdue")).toBe(false);
    expect(wrapper.hasClass("task-due-soon")).toBe(false);
  });

  it("should render a completed task with a checked checkbox", () => {
    const task = {
      id: 1,
      name: "Foobar",
      completed: makeDateTime(),
    };
    const wrapper = shallow(
      <TaskItem task={task} updateTask={updateTask} deleteTask={deleteTask} />
    );

    expect(wrapper.find("input").is("[checked=true]")).toBe(true);

    expect(wrapper.hasClass("task-completed")).toBe(true);
    expect(wrapper.hasClass("task-overdue")).toBe(false);
    expect(wrapper.hasClass("task-due-soon")).toBe(false);
  });

  it("should render an overdue task", () => {
    const task = {
      id: 1,
      name: "Foobar",
      completed: null,
      due: subDays(Date.now(), 2),
    };
    const wrapper = shallow(
      <TaskItem task={task} updateTask={updateTask} deleteTask={deleteTask} />
    );

    expect(wrapper.find("input").is("[checked=true]")).toBe(false);

    expect(wrapper.hasClass("task-completed")).toBe(false);
    expect(wrapper.hasClass("task-overdue")).toBe(true);
    expect(wrapper.hasClass("task-due-soon")).toBe(false);
  });

  it("should render an uncompleted task that is due soon", () => {
    const task = {
      id: 1,
      name: "Foobar",
      completed: null,
      due: addDays(Date.now(), 1),
    };
    const wrapper = shallow(
      <TaskItem task={task} updateTask={updateTask} deleteTask={deleteTask} />
    );

    expect(wrapper.find("input").is("[checked=true]")).toBe(false);

    expect(wrapper.hasClass("task-completed")).toBe(false);
    expect(wrapper.hasClass("task-overdue")).toBe(false);
    expect(wrapper.hasClass("task-due-soon")).toBe(true);
  });

  it("clicking on a task's name navigates to view it", () => {
    const task = {
      id: 1,
      name: "Foobar",
      completed: null,
      due: addDays(Date.now(), 2),
    };

    const wrapper = shallow(
      <TaskItem task={task} updateTask={updateTask} deleteTask={deleteTask} />
    );

    wrapper.find(".task-name").simulate("click");

    expect(history.location.pathname).toEqual(
      makeRoute(ROUTE_TASK_VIEW, { id: 1 })
    );
  });

  it("clicking on a task's delete button calls the delete action with the right id", () => {
    const task = {
      id: 1234,
      name: "Foobar",
      completed: null,
      due: addDays(Date.now(), 2),
    };

    let deletedTaskId;

    const wrapper = shallow(
      <TaskItem
        task={task}
        updateTask={updateTask}
        deleteTask={id => (deletedTaskId = id)}
      />
    );

    wrapper.find(".delete-task").simulate("click");

    expect(deletedTaskId).toEqual(task.id);
  });

  it("clicking on an incomplete task's checkbox marks it complete", () => {
    const task = {
      id: 1234,
      name: "Foobar",
      completed: null,
      due: addDays(Date.now(), 2),
    };

    let updatedTask;

    const wrapper = shallow(
      <TaskItem
        task={task}
        updateTask={t => {
          updatedTask = t;
        }}
        deleteTask={deleteTask}
      />
    );

    expect(wrapper.instance().props.task.completed).toBe(null);

    expect(
      wrapper.find('input[type="checkbox"].complete-task').props().checked
    ).toBe(false);

    // A click will fire the change event, with the checked property set to 'true'
    wrapper
      .find('input[type="checkbox"].complete-task')
      .simulate("change", { target: { checked: true } });

    expect(updatedTask.id).toEqual(task.id);
    expect(updatedTask.completed).not.toBe(null);

    // Date will be made a string before being passed to the action, so we need to convert it back to a Date object
    expect(isSameDay(parseISO(updatedTask.completed), Date.now())).toBe(true);
  });

  it("clicking on a completed task's checkbox clears it's completed date", () => {
    const task = {
      id: 1234,
      name: "Foobar",
      completed: makeDateTime(Date.now()),
      due: addDays(Date.now(), 2),
    };

    let updatedTask;

    const wrapper = shallow(
      <TaskItem
        task={task}
        updateTask={t => {
          updatedTask = t;
        }}
        deleteTask={deleteTask}
      />
    );

    expect(wrapper.instance().props.task.completed).not.toBe(null);

    expect(
      wrapper.find('input[type="checkbox"].complete-task').props().checked
    ).toBe(true);

    // A click will fire the change event, with the checked property set to 'true'
    wrapper
      .find('input[type="checkbox"].complete-task')
      .simulate("change", { target: { checked: false } });

    expect(updatedTask.id).toEqual(task.id);
    expect(updatedTask.completed).toBe(null);
  });
});
