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
                callback(null, this.session, data.user);

                if (data.hasOwnProperty('user') && data.user !== false) {
                    this.session = Object.assign({}, data.user);
                } else {
                    this.session = false;
                }
            })
            .catch(err => {
                callback(err, null, null);
            });
    }
}
