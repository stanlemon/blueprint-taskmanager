export class ServiceException {
  errors = {};

  constructor(errors = {}) {
    this.errors = errors;
  }
}

export default class RestService {
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

    return fetch(url, options)
      .then(response => response.json())
      .then(response => {
        if (response && response.errors) {
          throw new ServiceException(response.errors);
        }
        return response;
      });
  }
}
