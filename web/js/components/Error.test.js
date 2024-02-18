import { render } from "@testing-library/react";
import Error from "./Error";

describe("<Error />", () => {
  it("should render the error message", () => {
    const view = render(<Error message="An error occurred!" />);
    expect(view.getByText("An error occurred!")).toBeInTheDocument();
  });
});
