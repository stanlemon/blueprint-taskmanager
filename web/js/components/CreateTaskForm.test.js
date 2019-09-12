import React from "react";
import { mount, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import CreateTaskForm from "./CreateTaskForm";

configure({ adapter: new Adapter() });

describe("<CreateTaskForm />", () => {
  it("should render an empty form with and submit a new task in it", () => {
    let lastSavedTask = null;

    const actions = {
      createTask: task => {
        // Store the task so that we can reference it later
        lastSavedTask = task;
      },
    };

    const task = {
      id: null,
      name: "Test Task",
      description: "A brief description",
      due: null,
      completed: null,
    };

    const navigateTo = () => {};

    const view = mount(
      <CreateTaskForm task={task} actions={actions} navigateTo={navigateTo} />
    );

    const name = view.find('input[name="name"]');

    expect(name.props().value).toEqual("");

    const description = view.find('textarea[name="description"]');

    expect(description.props().value).toEqual("");

    const due = view.find('input[name="due"]');

    expect(due.props().value).toEqual("");

    const completed = view.find('input[name="completed"]');

    // Create form does not include the completed checkbox
    expect(completed.exists()).toBe(false);

    // Set the name field
    name.simulate("change", {
      target: { name: "name", value: task.name },
    });

    // Set the description field
    description.simulate("change", {
      target: { name: "description", value: task.description },
    });

    // Update the component
    view.update();

    const form = view.find("form");

    // Submit, the handler should fire and lastSavedTask updated to match our task object
    form.simulate("submit");

    expect(lastSavedTask).toEqual(task);
  });
});
