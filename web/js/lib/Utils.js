import format from 'date-fns/format';
import isAfter from 'date-fns/isAfter';
import isSameMinute from 'date-fns/isSameMinute';

export function makeDateTime(d = new Date()) {
    return format(d, 'yyyy-MM-dd HH:mm:ss.SSS z');
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
        .sort((a, b) => isAfter(a.createdAt, b.createdAt))
        .sort((a, b) => {
            if (!a.due && !b.due) {
                return 0;
            } else if (!a.due && b.due) {
                return 1;
            } else if (a.due && !b.due) {
                return -1;
            } else if (isSameMinute(a.due, b.due)) {
                return 0;
            }
            return isAfter(a.due, b.due) ? 1 : -1;
        })
        .sort((a, b) => {
            if (!a.completed && b.completed) {
                return -1;
            } else if (a.completed && b.completed) {
                return isAfter(a.completed, b.completed) ? -1 : 1;
            }
            return 1;
        });
}
