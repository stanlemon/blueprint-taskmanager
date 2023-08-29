import React from "react";
import { render } from "@testing-library/react";
import { Layout } from "./Layout";

describe("<Layout />", () => {
  it("should render nothing when there is no user", () => {
    const view = render(
      <Layout clearErrors={() => {}} loadTags={() => {}} logout={() => {}}>
        <div>Hello!!!</div>
      </Layout>
    );

    expect(view.container.firstChild).toMatchInlineSnapshot(`<div />`);
  });

  it("should render children when there is a user", () => {
    const text = "Hello World!";
    const view = render(
      <Layout
        loaded={["user"]}
        user={{ name: "Stan" }}
        clearErrors={() => {}}
        loadTags={() => {}}
        logout={() => {}}
      >
        <div>{text}</div>
      </Layout>
    );

    expect(view.getByText(text)).toBeInTheDocument();
  });
});
