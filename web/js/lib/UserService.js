import RestService from "./RestService";

export default class UserService extends RestService {
  checkSession() {
    return this.fetch("/auth/session");
  }

  login(credentials) {
    return this.fetch("/auth/login", "post", credentials);
  }

  logout() {
    return this.fetch("/auth/logout");
  }

  register(user) {
    return this.fetch("/auth/register", "post", user);
  }
}
