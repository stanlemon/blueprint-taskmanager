/* @flow weak */
export default class UserService {

    baseUrl = '/session';
    session = false;

    constructor(baseUrl = '/session') {
        this.baseUrl = baseUrl;
    }

    checkSession(callback) {
        fetch(this.baseUrl, {
            credentials: 'same-origin'
        })
            .then(response => response.json())
            .then(data => {
                // error, previous session value, current session value
                callback(null, this.session, data.user);

                if (data.hasOwnProperty('user') && data.user !== false) {
                    this.session = Object.assign({}, data.user);
                } else {
                    this.session = false;
                }
            })
            .catch((error) => {
                callback(error, null, null);
            });
    }
    
    login(data, callback) {
        fetch('/login', {
            credentials: 'same-origin',
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => response.json())
          .then(data => {
              if (data.errors) {
                  callback(data.errors);
              } else {
                  callback(null, data.user);
              }
          }).catch((error) => {
              callback(error);
          });
    }

    register(data, callback) {
        fetch('/api/users', {
            credentials: 'same-origin',
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => response.json())
          .then(data => {
              if (data.errors) {
                  callback(data.errors);
              } else {
                  callback(null, data.user);
              }
          }).catch((error) => {
              callback(error);
          });
      }
}
