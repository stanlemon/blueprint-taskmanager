import { mapErrors } from '../lib/Utils';
import RestServiceException from './RestServiceException';

export default class RestService {

    hasError(response) {
        return {}.hasOwnProperty.call(response, 'errors')
            && Array.isArray(response.errors)
            && response.errors.length > 0
        ;
    }

    checkForErrors(response) {
        if (this.hasError(response)) {
            throw new RestServiceException(mapErrors(response.errors));
        }

        return response;
    }

    fetch(url, method = 'get', data = null) {
        const options = {
            credentials: 'same-origin',
            method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        return fetch(url, options)
            .then(response => response.json())
            .then(response => this.checkForErrors(response))
        ;
    }
}
