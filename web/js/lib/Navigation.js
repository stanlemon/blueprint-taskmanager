const { makeMatcher } = require("wouter");
const { pathToRegexp, match } = require("path-to-regexp");

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
  console.log(route, window.location.pathname);
  const urlMatch = match(route, {
    decode: decodeURIComponent,
  });

  console.log(urlMatch(window.location.pathname));
  //=> { path: '/users/1234/photos', index: 0, params: { id: '1234', tab: 'photos' } }

  return "";
}

export const history = window.history;
