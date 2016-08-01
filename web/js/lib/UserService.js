import RestService from './RestService';

export default class UserService extends RestService {

    session = false;

    checkSession(callback) {
        this.fetch('/session')
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

    login(credentials, callback) {
        this.fetch('/login', 'post', credentials)
            .then(data => {
                if (data.errors) {
                    callback(data.errors);
                } else {
                    callback(null, data.user);
                }
            })
            .catch((error) => {
                callback(error);
            });
    }

    register(user, callback) {
        this.fetch('/api/users', 'post', user)
            .then(data => {
                if (data.errors) {
                    callback(data.errors);
                } else {
                    this.session = data.user;
                    callback(null, data.user);
                }
            })
            .catch((error) => {
                callback(error);
            });
    }
}
