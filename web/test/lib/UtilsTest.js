import { makeDateTime } from '../../js/lib/Utils';

describe('Utils', () => {
    it('makeDateTime formats mysql friendly dates', () => {
        expect(
            makeDateTime(new Date('June 13, 1985 13:00:00')).substring(0, 23),
        ).toEqual(
            '1985-06-13 13:00:00.000'
        );

        expect(
            makeDateTime(new Date('November 6, 2009 05:00:00')).substring(0, 23),
        ).toEqual(
            '2009-11-06 05:00:00.000'
        );

        expect(
            makeDateTime(new Date('December 12, 2011 22:00:00')).substring(0, 23),
        ).toEqual(
            '2011-12-12 22:00:00.000'
        );

        expect(
            makeDateTime(new Date('June 2, 2014 11:30:00')).substring(0, 23),
        ).toEqual(
            '2014-06-02 11:30:00.000'
        );
    });
});
