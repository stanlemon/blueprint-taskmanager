import { render, screen } from "@testing-library/react";
import { SessionWatcher } from "./SessionWatcher";
import { navigateTo, getCurrentPathname } from "../lib/Navigation";
import { ROUTE_LOGIN, ROUTE_ROOT } from "./Routes";

function Component(props = {}) {
  return (
    <SessionWatcher checkSession={() => ({})} {...props}>
      <h1>Hello World</h1>
    </SessionWatcher>
  );
}

describe("<SessionWatcher />", () => {
  it("renders children", () => {
    navigateTo("/");

    // Initial state user is null, unauthed
    render(<Component />);

    expect(
      screen.getByRole("heading", { name: "Hello World" })
    ).toBeInTheDocument();
  });

  it("unauthenticated user is on root", () => {
    // Initial state user is null, unauthed
    const { rerender } = render(<Component loaded={["user"]} />);

    // Navigate to root
    navigateTo("/");

    // Rerender with null user
    rerender(<Component loaded={["user"]} user={null} />);

    // Unauthed user is redirected to the login screen
    expect(getCurrentPathname()).toEqual(ROUTE_LOGIN);
  });

  it("unauthenticated user is on an authenticated page", () => {
    navigateTo("/");

    // Initial state user is null, unauthed
    const { rerender } = render(<Component loaded={[]} />);

    rerender(<Component loaded={[]} user={null} />);

    // Unauthed user is redirected to the login screen
    expect(getCurrentPathname()).toEqual(ROUTE_LOGIN);
  });

  it("authenticated user is on an unauthenticated page", () => {
    navigateTo("/login");

    const { rerender } = render(<Component />);

    rerender(<Component loaded={["user"]} user={{}} />);

    // Unauthed user is redirected to the login screen
    expect(getCurrentPathname()).toEqual(ROUTE_ROOT);
  });

  it("user was authenticated and logged out", () => {
    // Initial state user is null, unauthed
    const { rerender } = render(<Component loaded={["user"]} user={{}} />);

    rerender(<Component loaded={["user"]} user={null} />);

    // Unauthed user is redirected to the login screen
    expect(getCurrentPathname()).toEqual(ROUTE_LOGIN);
  });

  it("user is authenticated on an authenticated page - noop", () => {
    navigateTo("/page1");

    const { rerender } = render(<Component loaded={["user"]} user={{}} />);

    navigateTo("/page2");

    rerender(<Component loaded={["user"]} user={{}} />);

    // navigateTo() should not be called, so the location should not change
    expect(getCurrentPathname()).toEqual("/page2");
  });
});
