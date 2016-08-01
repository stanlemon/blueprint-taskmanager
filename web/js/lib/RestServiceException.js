export default class ServiceException {
    errors = {};

    constructor(errors = {}) {
        this.errors = errors;
    }
}
