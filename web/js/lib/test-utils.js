// Taken from: https://redux.js.org/recipes/writing-tests/
import PropTypes from "prop-types";
import { render } from "@testing-library/react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import reducer from "../reducers";

function renderConnected(
  ui,
  {
    initialState,
    store = createStore(reducer, initialState),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>;
  }
  Wrapper.propTypes = {
    children: PropTypes.element,
  };
  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// override render method
export { renderConnected };
