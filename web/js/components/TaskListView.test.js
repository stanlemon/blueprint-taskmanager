import React from "react";
import { mount, shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import keyBy from "lodash/keyBy";
import { TaskListView } from "./TaskListView";
// Use the connected version because we're just using it for a lookup
import TaskItem from "./TaskItem";
import CreateTaskForm from "./CreateTaskForm";

configure({ adapter: new Adapter() });

describe("<TaskListView />", () => {
  it("should render a spinner while it waits to load", () => {
    const view = mount(
      <TaskListView loadTasks={() => {}} loaded={[]} tasks={{}} actions={{}} />
    );

    expect(view.text().trim()).toBe("Loading...");
  });

  it("should render a list of tasks", () => {
    const tasks = [
      {
        id: 1,
        name: "First Task",
        description: "This is a task",
        due: null,
        completed: null,
      },
      {
        id: 2,
        name: "Second Task",
        description: "This is another task",
        due: null,
        completed: null,
      },
    ];

    const view = shallow(
      <TaskListView
        loadTasks={() => {}}
        loaded={["tasks"]}
        tasks={{ byId: keyBy(tasks, t => t.id) }}
        errors={{}}
        actions={{}}
      />
    );

    // List of tasks contains our first task
    expect(
      view
        .find(TaskItem)
        .at(0)
        .props().task
    ).toEqual(tasks[0]);

    // List of tasks contains our second task
    expect(
      view
        .find(TaskItem)
        .at(1)
        .props().task
    ).toEqual(tasks[1]);
  });

  it("should not render a list if there are no tasks", () => {
    const tasks = { byId: {} };

    const view = shallow(
      <TaskListView
        loadTasks={() => {}}
        loaded={["tasks"]}
        tasks={tasks}
        errors={{}}
        actions={{}}
      />
    );

    // There should be no task items
    expect(view.find(TaskItem).length).toBe(0);

    // There should be a form to create a task
    expect(view.find(CreateTaskForm).length).toBe(1);

    // List of tasks contains our second task
    expect(view.find("h1").text()).toEqual("You don't have any tasks!");
  });

  it("should render only incomplete tasks when the filter is selected", () => {
    const tasks = [
      {
        id: 1,
        name: "Completed task",
        description: "",
        due: null,
        completed: Date.now(),
      },
      {
        id: 2,
        name: "Incomplete Task",
        description: "",
        due: null,
        completed: null,
      },
    ];

    const view = shallow(
      <TaskListView
        loadTasks={() => {}}
        loaded={["tasks"]}
        tasks={{ byId: keyBy(tasks, t => t.id) }}
        errors={{}}
        actions={{}}
      />
    );

    view.find("#task-filter-incomplete").simulate("click");

    expect(view.find(TaskItem).length).toBe(1);
    expect(
      view
        .find(TaskItem)
        .at(0)
        .props().task.id
    ).toBe(2);

    // Clicking back on all should show every task, essentially clear out the filter
    view.find("#task-filter-all").simulate("click");

    expect(view.find(TaskItem).length).toBe(2);
  });

  it("should render only complete tasks when the filter is selected", () => {
    const tasks = [
      {
        id: 1,
        name: "Completed task",
        description: "",
        due: null,
        completed: Date.now(),
      },
      {
        id: 2,
        name: "Incomplete Task",
        description: "",
        due: null,
        completed: null,
      },
    ];

    const view = shallow(
      <TaskListView
        loadTasks={() => {}}
        loaded={["tasks"]}
        tasks={{ byId: keyBy(tasks, t => t.id) }}
        errors={{}}
        actions={{}}
      />
    );

    view.find("#task-filter-complete").simulate("click");

    expect(view.find(TaskItem).length).toBe(1);
    expect(
      view
        .find(TaskItem)
        .at(0)
        .props().task.id
    ).toBe(1);

    // Clicking back on all should show every task, essentially clear out the filter
    view.find("#task-filter-all").simulate("click");

    expect(view.find(TaskItem).length).toBe(2);
  });

  it("should render only no tasks when the completed filter is selected because there are no complete tasks", () => {
    const tasks = [
      {
        id: 1,
        name: "Incomplete task",
        description: "",
        due: null,
        completed: null,
      },
      {
        id: 2,
        name: "Incomplete Task",
        description: "",
        due: null,
        completed: null,
      },
    ];

    const view = shallow(
      <TaskListView
        loadTasks={() => {}}
        loaded={["tasks"]}
        tasks={{ byId: keyBy(tasks, t => t.id) }}
        errors={{}}
        actions={{}}
      />
    );

    view.find("#task-filter-complete").simulate("click");

    expect(view.find(TaskItem).length).toBe(0);
    expect(view.find(".task-filter-none").text()).toEqual(
      "There are no tasks for this filter."
    );

    // Clicking back on all should show every task, essentially clear out the filter
    view.find("#task-filter-all").simulate("click");

    expect(view.find(TaskItem).length).toBe(2);
  });
});
