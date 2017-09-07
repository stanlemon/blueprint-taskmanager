import moment from 'moment';

export function makeDateTime(d = new Date()) {
    return moment(d).format('YYYY-MM-DD HH:mm:ss.SSS z');
}

/*eslint-disable */
export function mapErrors(errors = []) {
    const results = {};
    errors.forEach(error => {
        if (typeof error === 'object') {
            results[error.field] = [error.message];
        } else {
            results.main = [error];
        }
    });
    return results;
}
/*eslint-enable */

export function sortTasksByDate(tasks) {
    return tasks
        .concat()
        .sort((a, b) => moment(a.createdAt).isAfter(b.createdAt))
        .sort((a, b) => {
            if (!a.due && !b.due) {
                return 0;
            } else if (!a.due && b.due) {
                return 1;
            } else if (a.due && !b.due) {
                return -1;
            } else if (moment(a.due).isSame(b.due)) {
                return 0;
            }
            return moment(a.due).isAfter(b.due) ? 1 : -1;
        })
        .sort((a, b) => {
            if (!a.completed && b.completed) {
                return -1;
            } else if (a.completed && b.completed) {
                return moment(a.completed).isAfter(b.completed) ? -1 : 1;
            }
            return 1;
        });
}