const makeMatcher = require("wouter/matcher").default;

// This file contains function that obscure route navigation during
// development so that there are no hard dependencies outside of this file
// and the overall <Route /> component.
export function navigateTo(route) {
  window.history.pushState({}, window.document.title, route);
}

export function getCurrentPathname() {
  return window.location.pathname;
}

export function getRouteParam(route, param) {
  const matcher = makeMatcher();
  const [, params] = matcher(route, window.location.pathname);
  return params?.[param];
}

export const history = window.history;
