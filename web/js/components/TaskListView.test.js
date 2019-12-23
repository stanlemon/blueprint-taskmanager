import React from "react";
import { mount, shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { TaskListView } from "./TaskListView";
// Use the connected version because we're just using it for a lookup
import TaskItem from "./TaskItem";
import CreateTaskForm from "./CreateTaskForm";

configure({ adapter: new Adapter() });

describe("<TaskListView />", () => {
  it("should render a spinner while it waits to load", () => {
    const view = mount(
      <TaskListView loadTasks={() => {}} loaded={[]} tasks={[]} />
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
        hasTasks={true}
        tasks={tasks}
        errors={{}}
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
    const tasks = [];

    const view = shallow(
      <TaskListView
        loadTasks={() => {}}
        loaded={["tasks"]}
        hasTasks={false}
        tasks={tasks}
        errors={{}}
      />
    );

    // There should be no task items
    expect(view.find(TaskItem).length).toBe(0);

    // There should be a form to create a task
    expect(view.find(CreateTaskForm).length).toBe(1);

    // List of tasks contains our second task
    expect(view.find("h1").text()).toEqual("You don't have any tasks!");
  });

  it("should set filter when each filter button is clicked", () => {
    const tasks = [];
    let lastFilter;
    const setFilter = jest.fn(filter => (lastFilter = filter));
    const view = shallow(
      <TaskListView
        loadTasks={() => {}}
        setFilter={setFilter}
        loaded={["tasks"]}
        hasTasks={true}
        tasks={tasks}
        errors={{}}
      />
    );

    view.find("#task-filter-incomplete").simulate("click");

    expect(setFilter).toHaveBeenCalledTimes(1);
    expect(lastFilter).toBe("incomplete");

    view.find("#task-filter-complete").simulate("click");

    expect(setFilter).toHaveBeenCalledTimes(2);
    expect(lastFilter).toBe("complete");

    view.find("#task-filter-all").simulate("click");

    expect(setFilter).toHaveBeenCalledTimes(3);
    expect(lastFilter).toBe("all");
  });

  it("should render no tasks when the current filter has no matching tasks", () => {
    const tasks = [];

    const view = shallow(
      <TaskListView
        loadTasks={() => {}}
        loaded={["tasks"]}
        hasTasks={true}
        tasks={tasks}
        errors={{}}
      />
    );

    expect(view.find(TaskItem).length).toBe(0);
    expect(view.find(".task-filter-none").text()).toEqual(
      "There are no tasks for this filter."
    );
  });
});
