'use strict';

import { assert } from 'chai';
import { makeDateTime } from '../../js/lib/Utils';

describe('Utils', () => {
    it('makeDateTime formats mysql friendly dates', () => {
        assert.equal(
            makeDateTime(new Date('June 13, 1985 08:00:00 -0500')),
            '1985-06-13 13:00:00.000 -0500'
        );

        assert.equal(
            makeDateTime(new Date('November 6, 2009 05:00:00 -0500')),
            '2009-11-06 10:00:00.000 -0500'
        );

        assert.equal(
            makeDateTime(new Date('December 12, 2011 05:00:00 -0500')),
            '2011-12-12 10:00:00.000 -0500'
        );

        assert.equal(
            makeDateTime(new Date('June 2, 2014 07:30:00 -0400')),
            '2014-06-02 11:30:00.000 -0400'
        );
    });
});
