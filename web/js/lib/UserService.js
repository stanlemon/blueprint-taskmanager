import RestService from './RestService';

export default class UserService extends RestService {
    checkSession() {
        return this.fetch('/session');
    }

    login(credentials) {
        return this.fetch('/login', 'post', credentials);
    }

    logout() {
        return this.fetch('/logout');
    }

    register(user) {
        return this.fetch('/api/users', 'post', user);
    }
}
