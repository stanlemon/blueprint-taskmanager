'use strict';

import { assert } from 'chai';
import { makeDateTime } from '../../js/lib/Utils';

const tz = (d) => d.toString().substr(-11, 6).trim();

describe('Utils', () => {
    it('makeDateTime formats mysql friendly dates', () => {

        const dt1 = new Date('June 13, 1985 08:00:00');

        assert.equal(
            makeDateTime(dt1),
            '1985-06-13 13:00:00.000 ' + tz(dt1)
        );

        const dt2 = new Date('November 6, 2009 05:00:00');

        assert.equal(
            makeDateTime(dt2),
            '2009-11-06 10:00:00.000 ' + tz(dt2)
        );

        const dt3 = new Date('December 12, 2011 05:00:00');

        assert.equal(
            makeDateTime(dt3),
            '2011-12-12 10:00:00.000 ' + tz(dt2)
        );

        const dt4 = new Date('June 2, 2014 07:30:00');

        assert.equal(
            makeDateTime(dt4),
            '2014-06-02 11:30:00.000 ' + tz(dt4)
        );
    });
});
