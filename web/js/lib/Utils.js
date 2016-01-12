import { omit } from 'lodash';

export function makeDateTime(d = new Date()) {
    return d.toISOString().replace('T', ' ').replace('Z', '') + ' ' + d.toString().substr(-11, 6).trim();
}

export function mapErrors(errors = []) {
    return errors.reduce((o, v, i) => {
        o[v.field] = [v.message];
        return o;
    }, {});
}
