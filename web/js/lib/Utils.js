import moment from 'moment';

export function makeDateTime(d = new Date()) {
    return moment(d).format('YYYY-MM-DD HH:mm:ss.SSS z');
}

/*eslint-disable */
export function mapErrors(errors = []) {
    return errors.reduce((o, v) => {
        o[v.field] = [v.message];
        return o;
    }, {});
}
/*eslint-enable */
