import React from "react";
import { configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { UpdateTaskForm } from "./UpdateTaskForm";
import parseISO from "date-fns/parseISO";
import waitForExpect from "wait-for-expect";

configure({ adapter: new Adapter() });

describe("<UpdateTaskForm />", () => {
  it("should render a form with an existing task and update it", () => {
    let lastSavedTask = null;

    const updateTask = task => {
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

    const view = mount(<UpdateTaskForm task={task} updateTask={updateTask} />);

    const name = view.find('input[name="name"]');

    expect(name.props().value).toEqual(task.name);

    const description = view.find('textarea[name="description"]');

    expect(description.props().value).toEqual(task.description);

    const due = view.find('input[name="due"]');

    expect(due.props().value).toEqual("06/12/2018 7:08AM");

    const completed = view.find('input[name="completed"]');

    expect(completed.props().checked).toEqual(true);

    const completedLabel = view.find('label[htmlFor="completed"]');

    expect(completedLabel.text().trim()).toEqual(
      "Completed on June 12th 2017, 7:08AM"
    );

    // Update the task name
    const newName = "New Task Name";
    name.simulate("change", {
      target: { name: "name", value: newName },
    });

    // Update the task description
    const newDescription = "New Task Description";
    description.simulate("change", {
      target: { name: "description", value: newDescription },
    });

    // Click the checkbox to toggle it
    completed.simulate("change", {
      target: { type: "checkbox", name: "completed", checked: false },
    });

    view.update();

    expect(completed.props().checked).toEqual(true);

    const form = view.find("form");

    form.simulate("submit");

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

  it("should render errors when a task cannot be updated", () => {
    const response = { errors: { name: "Unknown name error from backend" } };
    const updateTask = () => Promise.resolve(response);

    const task = {
      id: 1,
      name: "Name",
      description: "A brief description",
      due: parseISO("2018-06-12T07:08"),
      completed: parseISO("2017-06-12T07:08"),
      tags: [],
    };

    const view = mount(<UpdateTaskForm task={task} updateTask={updateTask} />);

    view.find("button#save-task").simulate("click");

    waitForExpect(() => {
      expect(view.find(".error").text()).toBe(response.errors.name);
    });
  });
});
