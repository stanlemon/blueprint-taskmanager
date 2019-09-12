import React from "react";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { TaskView } from "./TaskView";
import UpdateTaskForm from "./UpdateTaskForm";
import Error from "./Error";
import { format, subDays } from "date-fns";
import { DATE_FORMAT_LONG } from "../lib/Utils";

configure({ adapter: new Adapter() });

describe("<TaskView />", () => {
  const navigateTo = () => {};

  it("should render a task", () => {
    const tasks = [
      {
        id: 1,
        name: "First Task",
        description: "This is a task",
        due: null,
        completed: null,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        id: 2,
        name: "Second Task",
        description: "This is another task",
        due: null,
        completed: null,
        createdAt: subDays(Date.now(), 1),
        updatedAt: Date.now(),
      },
    ];

    const view = shallow(
      <TaskView
        loaded={["tasks"]}
        tasks={tasks}
        match={{ params: { id: 2 } }}
        errors={{}}
        navigateTo={navigateTo}
        actions={{}}
      />
    );

    expect(view.find(UpdateTaskForm).length).toBe(1);

    expect(view.find(UpdateTaskForm).props().task).toEqual(tasks[1]);

    // Find the created at date, which is read only text
    expect(
      view.findWhere(
        n =>
          n.type() === "span" &&
          n.text() === format(tasks[1].createdAt, DATE_FORMAT_LONG)
      ).length
    ).toBe(1);

    // Find the updated at date, which is read only text
    expect(
      view.findWhere(
        n =>
          n.type() === "span" &&
          n.text() === format(tasks[1].updatedAt, DATE_FORMAT_LONG)
      ).length
    ).toBe(1);
  });

  it("should render an error for an unfound task", () => {
    const tasks = [
      {
        id: 1,
        name: "First Task",
        description: "This is a task",
        due: null,
        completed: null,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        id: 2,
        name: "Second Task",
        description: "This is another task",
        due: null,
        completed: null,
        createdAt: subDays(Date.now(), 1),
        updatedAt: Date.now(),
      },
    ];

    let destUrl;

    const view = shallow(
      <TaskView
        loaded={["tasks"]}
        tasks={tasks}
        match={{ params: { id: 3 } }}
        errors={{}}
        navigateTo={r => (destUrl = r)}
        actions={{}}
      />
    );

    expect(view.find(Error).length).toBe(1);

    expect(view.find("button").length).toBe(1);

    view.find("button").simulate("click");

    expect(destUrl).toBe("/");
  });

  it("should not render anything if tasks have not loaded", () => {
    const view = shallow(
      <TaskView
        loaded={[]}
        tasks={[]}
        match={{ params: { id: 3 } }}
        errors={{}}
        navigateTo={navigateTo}
        actions={{}}
      />
    );

    expect(view.find(UpdateTaskForm).length).toBe(0);

    expect(view.children().length).toBe(0);
  });
});
