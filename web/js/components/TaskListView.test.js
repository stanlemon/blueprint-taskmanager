import { fireEvent, render, screen } from "@testing-library/react";
import { renderConnected } from "../lib/test-utils";
import { TaskListView } from "./TaskListView";

describe("<TaskListView />", () => {
  it("should render a spinner while it waits to load", () => {
    render(<TaskListView loadTasks={() => {}} loaded={[]} tasks={[]} />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
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

    renderConnected(
      <TaskListView
        loadTasks={() => {}}
        loaded={["tasks"]}
        hasTasks={true}
        tasks={tasks}
        errors={{}}
      />
    );

    // List of tasks contains our first task
    expect(screen.getByText(tasks[0].name)).toBeInTheDocument();

    // List of tasks contains our second task
    expect(screen.getByText(tasks[1].name)).toBeInTheDocument();
  });

  it("should not render a list if there are no tasks", () => {
    const tasks = [];

    renderConnected(
      <TaskListView
        loadTasks={() => {}}
        loaded={["tasks"]}
        hasTasks={false}
        tasks={tasks}
        errors={{}}
      />
    );

    // List of tasks contains our second task
    expect(
      screen.getByRole("heading", { name: "You don't have any tasks!" })
    ).toBeInTheDocument();
  });

  it("should set filter when each filter button is clicked", () => {
    const tasks = [];
    let lastFilter;
    const setFilter = jest.fn((filter) => (lastFilter = filter));
    renderConnected(
      <TaskListView
        loadTasks={() => {}}
        setFilter={setFilter}
        loaded={["tasks"]}
        hasTasks={true}
        tasks={tasks}
        errors={{}}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Incomplete" }));

    expect(setFilter).toHaveBeenCalledTimes(1);
    expect(lastFilter).toBe("incomplete");

    fireEvent.click(screen.getByRole("button", { name: "Complete" }));

    expect(setFilter).toHaveBeenCalledTimes(2);
    expect(lastFilter).toBe("complete");

    fireEvent.click(screen.getByRole("button", { name: "All" }));

    expect(setFilter).toHaveBeenCalledTimes(3);
    expect(lastFilter).toBe("all");
  });
});
