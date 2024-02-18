import { fireEvent } from "@testing-library/react";
import { renderConnected } from "../lib/test-utils";
import { TaskView } from "./TaskView";
import { format, subDays } from "date-fns";
import { DATE_FORMAT_LONG } from "../lib/Utils";
import { navigateTo, getCurrentPathname } from "../lib/Navigation";
import { ROUTE_ROOT } from "./Routes";

describe("<TaskView />", () => {
  it("should render a task", () => {
    const task = {
      id: 2,
      name: "Second Task",
      description: "This is another task",
      due: null,
      completed: null,
      createdAt: subDays(Date.now(), 1),
      updatedAt: Date.now(),
    };

    navigateTo("/view/2");

    const view = renderConnected(<TaskView loaded={true} task={task} />);

    expect(
      view.getByText(format(task.createdAt, DATE_FORMAT_LONG))
    ).toBeInTheDocument();
    expect(
      view.getByText(format(task.updatedAt, DATE_FORMAT_LONG))
    ).toBeInTheDocument();
    expect(view.getByLabelText("Name")).toHaveValue(task.name);
    expect(view.getByLabelText("Description")).toHaveValue(task.description);
    expect(view.getByLabelText("Due")).toHaveValue("");
    expect(view.getByLabelText("Completed")).not.toBeChecked();
  });

  it("should render an error for an unfound task", () => {
    navigateTo("/view/3");

    const view = renderConnected(<TaskView loaded={true} task={null} />);

    expect(view.getByText("Task does not exist.")).toBeInTheDocument();
    expect(view.getByRole("button")).toBeInTheDocument();

    fireEvent.click(view.getByRole("button"));

    expect(getCurrentPathname()).toBe(ROUTE_ROOT);
  });

  it("should not render anything if tasks have not loaded", () => {
    const view = renderConnected(<TaskView loaded={false} />);

    expect(view.getByText("Loading...")).toBeInTheDocument();
  });
});
