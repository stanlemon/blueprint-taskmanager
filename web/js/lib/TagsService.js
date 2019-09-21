import RestService from "./RestService";

export default class TagService extends RestService {
  loadTags() {
    return this.fetch(`${this.baseUrl}/api/tags/`);
  }
}
