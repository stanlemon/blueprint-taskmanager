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
      .then((r) => r.json().then((data) => ({ status: r.status, body: data })))
      .then(({ status, body }) => {
        if (status !== 200) {
          throw new ServiceException(body);
        }
        return body;
      });
  }
}
