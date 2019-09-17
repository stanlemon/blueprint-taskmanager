import RestServiceException from "./RestServiceException";

export default class RestService {
  baseUrl;
  options;

  constructor(baseUrl = "", options = {}) {
    this.baseUrl = baseUrl;
    this.options = options;
  }

  hasError(response) {
    return (
      {}.hasOwnProperty.call(response, "errors") &&
      //Array.isArray(response.errors) &&
      Object.keys(response.errors).length > 0
    );
  }

  checkForErrors(response) {
    if (this.hasError(response)) {
      throw new RestServiceException(response.errors);
    }

    return response;
  }

  fetch(url, method = "get", data = null) {
    const options = {
      credentials: "same-origin",
      method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    return fetch(this.baseUrl + url, Object.assign({}, this.options, options))
      .then(response => response.json())
      .then(response => this.checkForErrors(response));
  }

  setBaseUrl(baseUrl) {
    this.baseUrl = baseUrl;
  }

  setOptions(options) {
    this.options = options;
  }
}
