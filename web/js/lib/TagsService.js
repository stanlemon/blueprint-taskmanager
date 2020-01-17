import RestService from "./RestService";

export default class TagService extends RestService {
  loadTags() {
    return this.fetch(`/api/tags/`);
  }
}
