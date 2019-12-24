import { createBrowserHistory } from "history";
import { matchPath, generatePath } from "react-router";

// This file contains function that obscure react-router from view during
// development so that there are no hard dependencies outside of this file
// and the overall <Route /> component.

export const history = createBrowserHistory();

export function navigateTo(route) {
  history.push(route);
}

export function getCurrentPathname() {
  return history.location.pathname;
}

export function getRouteParam(route, param) {
  const path = matchPath(history.location.pathname, route);

  if (path && path.params && path.params[param] !== undefined) {
    return path.params[param];
  }

  return undefined;
}

export function makeRoute(route, params) {
  return generatePath(route, params);
}

export default navigateTo;
