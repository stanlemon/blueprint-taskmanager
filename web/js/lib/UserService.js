import 'whatwg-fetch';

export default class UserService {

    constructor(baseUrl = '/session') {
        this.baseUrl = baseUrl;
        this.session = false;
    }

    checkSession(callback) {
        fetch(this.baseUrl)
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
                callback(err, null, null)
            });
    }
}
