import moment from 'moment';

export function makeDateTime(d = new Date()) {
    return moment(d).format('YYYY-MM-DD HH:mm:ss.SSS z');
}

/*eslint-disable */
export function mapErrors(errors = []) {
    const results = {};
    errors.forEach((error) => {
        if (typeof error === 'object') {
            results[error.field] = [error.message];
        } else {
            results.main = [error];
        }         
    });
    return results;
}
/*eslint-enable */

export function isDev() {
    return process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test';
}
