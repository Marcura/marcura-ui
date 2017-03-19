describe('maHelper service', function() {
    var maHelper;

    beforeEach(module('marcuraUI.services'));
    beforeEach(inject(function(_maHelper_) {
        maHelper = _maHelper_;
    }));

    describe('isEmail method', function() {
        it('determines whether a specified value is an email', function() {
            expect(maHelper.isEmail('p.smith@gmail.com')).toEqual(true);
            expect(maHelper.isEmail('p.smithgmail.com')).toEqual(false);
            expect(maHelper.isEmail('p.smith@gmailcom')).toEqual(false);
            expect(maHelper.isEmail(null)).toEqual(false);
            expect(maHelper.isEmail(undefined)).toEqual(false);
            expect(maHelper.isEmail('')).toEqual(false);
            expect(maHelper.isEmail({})).toEqual(false);
        });
    });

    describe('isNullOrWhiteSpace method', function() {
        it('determines whether a specified string is null, empty, or consists only of white-space characters', function() {
            expect(maHelper.isNullOrWhiteSpace(null)).toEqual(true);
            expect(maHelper.isNullOrWhiteSpace('')).toEqual(true);
            expect(maHelper.isNullOrWhiteSpace(' ')).toEqual(true);
            expect(maHelper.isNullOrWhiteSpace('    ')).toEqual(true);
            expect(maHelper.isNullOrWhiteSpace(undefined)).toEqual(true);
            expect(maHelper.isNullOrWhiteSpace(false)).toEqual(false);
            expect(maHelper.isNullOrWhiteSpace(true)).toEqual(false);
            expect(maHelper.isNullOrWhiteSpace('data')).toEqual(false);
            expect(maHelper.isNullOrWhiteSpace({
                name: 'Data'
            })).toEqual(false);
            expect(maHelper.isNullOrWhiteSpace({})).toEqual(false);
            expect(maHelper.isNullOrWhiteSpace([{
                name: 'Data'
            }])).toEqual(false);
            expect(maHelper.isNullOrWhiteSpace(1100)).toEqual(false);
            expect(maHelper.isNullOrWhiteSpace(new Date())).toEqual(false);
            expect(maHelper.isNullOrWhiteSpace([])).toEqual(false);
        });
    });

    describe('getTextHeight method', function() {
        it('measures height of text', function() {
            expect(maHelper.getTextHeight('d\n\n\n', '12.8px Arial', '100px')).toEqual(60);
            expect(maHelper.getTextHeight('dddddddddddddddddddddddddddddddd', '12.8px Arial', '100px')).toEqual(45);
        });
    });

    describe('isGreater method', function() {
        it('determines whether a specified value is greater than other value', function() {
            // Number.
            expect(maHelper.isGreater(2, 1)).toEqual(true);
            expect(maHelper.isGreater(1, 2)).toEqual(false);
            expect(maHelper.isGreater(1, 1)).toEqual(false);
            expect(maHelper.isGreater(1, 1)).toEqual(false);
            expect(maHelper.isGreater('0', 0)).toEqual(false);
            expect(maHelper.isGreater('1', 0)).toEqual(true);

            // Date.
            expect(maHelper.isGreater('2016-09-26T00:00:00Z', '2016-09-16T00:00:00Z')).toEqual(true);
            expect(maHelper.isGreater('2016-09-16T00:00:00Z', '2016-09-26T00:00:00Z')).toEqual(false);
            expect(maHelper.isGreater('2016-09-16T00:00:00Z', '2016-09-16T00:00:00Z')).toEqual(false);

            // Date and time.
            expect(maHelper.isGreater('2016-09-26T01:00:00Z', '2016-09-26T00:00:00Z')).toEqual(true);
            expect(maHelper.isGreater('2016-09-26T00:00:00Z', '2016-09-26T01:00:00Z')).toEqual(false);
            expect(maHelper.isGreater('2016-09-26T00:00:00Z', '2016-09-26T00:00:00Z')).toEqual(false);

            // Date with time zone.
            expect(maHelper.isGreater('2016-09-26T10:00:00+01:00', '2016-09-26T10:00:00+02:00')).toEqual(true);
            expect(maHelper.isGreater('2016-09-26T10:00:00+02:00', '2016-09-26T10:00:00+01:00')).toEqual(false);
            expect(maHelper.isGreater('2016-09-26T10:00:00+01:00', '2016-09-26T10:00:00+01:00')).toEqual(false);
        });
    });

    describe('isGreaterOrEqual method', function() {
        it('determines whether a specified value is greater than or equal to other value', function() {
            // Number.
            expect(maHelper.isGreaterOrEqual(2, 1)).toEqual(true);
            expect(maHelper.isGreaterOrEqual(1, 2)).toEqual(false);
            expect(maHelper.isGreaterOrEqual(1, 1)).toEqual(true);
            expect(maHelper.isGreaterOrEqual('0', 0)).toEqual(true);
            expect(maHelper.isGreaterOrEqual('1', 0)).toEqual(true);

            // Date.
            expect(maHelper.isGreaterOrEqual('2016-09-26T00:00:00Z', '2016-09-16T00:00:00Z')).toEqual(true);
            expect(maHelper.isGreaterOrEqual('2016-09-16T00:00:00Z', '2016-09-26T00:00:00Z')).toEqual(false);
            expect(maHelper.isGreaterOrEqual('2016-09-16T00:00:00Z', '2016-09-16T00:00:00Z')).toEqual(true);

            // Date and time.
            expect(maHelper.isGreaterOrEqual('2016-09-26T01:00:00Z', '2016-09-26T00:00:00Z')).toEqual(true);
            expect(maHelper.isGreaterOrEqual('2016-09-26T00:00:00Z', '2016-09-26T01:00:00Z')).toEqual(false);
            expect(maHelper.isGreaterOrEqual('2016-09-26T00:00:00Z', '2016-09-26T00:00:00Z')).toEqual(true);

            // Date with time zone.
            expect(maHelper.isGreaterOrEqual('2016-09-26T10:00:00+01:00', '2016-09-26T10:00:00+02:00')).toEqual(true);
            expect(maHelper.isGreaterOrEqual('2016-09-26T10:00:00+02:00', '2016-09-26T10:00:00+01:00')).toEqual(false);
            expect(maHelper.isGreaterOrEqual('2016-09-26T10:00:00+01:00', '2016-09-26T10:00:00+01:00')).toEqual(true);
        });
    });

    describe('isLess method', function() {
        it('determines whether a specified value is less than other value', function() {
            // Number.
            expect(maHelper.isLess(2, 1)).toEqual(false);
            expect(maHelper.isLess(1, 2)).toEqual(true);
            expect(maHelper.isLess(1, 1)).toEqual(false);
            expect(maHelper.isLess('0', 0)).toEqual(false);
            expect(maHelper.isLess('0', 1)).toEqual(true);

            // Date.
            expect(maHelper.isLess('2016-09-26T00:00:00Z', '2016-09-16T00:00:00Z')).toEqual(false);
            expect(maHelper.isLess('2016-09-16T00:00:00Z', '2016-09-26T00:00:00Z')).toEqual(true);
            expect(maHelper.isLess('2016-09-16T00:00:00Z', '2016-09-16T00:00:00Z')).toEqual(false);

            // Date and time.
            expect(maHelper.isLess('2016-09-26T01:00:00Z', '2016-09-26T00:00:00Z')).toEqual(false);
            expect(maHelper.isLess('2016-09-26T00:00:00Z', '2016-09-26T01:00:00Z')).toEqual(true);
            expect(maHelper.isLess('2016-09-26T00:00:00Z', '2016-09-26T00:00:00Z')).toEqual(false);

            // Date with time zone.
            expect(maHelper.isLess('2016-09-26T10:00:00+01:00', '2016-09-26T10:00:00+02:00')).toEqual(false);
            expect(maHelper.isLess('2016-09-26T10:00:00+02:00', '2016-09-26T10:00:00+01:00')).toEqual(true);
            expect(maHelper.isLess('2016-09-26T10:00:00+01:00', '2016-09-26T10:00:00+01:00')).toEqual(false);
        });
    });

    describe('isLessOrEqual method', function() {
        it('determines whether a specified value is less than or equal to other value', function() {
            // Number.
            expect(maHelper.isLessOrEqual(2, 1)).toEqual(false);
            expect(maHelper.isLessOrEqual(1, 2)).toEqual(true);
            expect(maHelper.isLessOrEqual(1, 1)).toEqual(true);
            expect(maHelper.isLessOrEqual('0', 0)).toEqual(true);
            expect(maHelper.isLessOrEqual('0', 1)).toEqual(true);

            // Date.
            expect(maHelper.isLessOrEqual('2016-09-26T00:00:00Z', '2016-09-16T00:00:00Z')).toEqual(false);
            expect(maHelper.isLessOrEqual('2016-09-16T00:00:00Z', '2016-09-26T00:00:00Z')).toEqual(true);
            expect(maHelper.isLessOrEqual('2016-09-16T00:00:00Z', '2016-09-16T00:00:00Z')).toEqual(true);

            // Date and time.
            expect(maHelper.isLessOrEqual('2016-09-26T01:00:00Z', '2016-09-26T00:00:00Z')).toEqual(false);
            expect(maHelper.isLessOrEqual('2016-09-26T00:00:00Z', '2016-09-26T01:00:00Z')).toEqual(true);
            expect(maHelper.isLessOrEqual('2016-09-26T00:00:00Z', '2016-09-26T00:00:00Z')).toEqual(true);

            // Date with time zone.
            expect(maHelper.isLessOrEqual('2016-09-26T10:00:00+01:00', '2016-09-26T10:00:00+02:00')).toEqual(false);
            expect(maHelper.isLessOrEqual('2016-09-26T10:00:00+02:00', '2016-09-26T10:00:00+01:00')).toEqual(true);
            expect(maHelper.isLessOrEqual('2016-09-26T10:00:00+01:00', '2016-09-26T10:00:00+01:00')).toEqual(true);
        });
    });
});
