describe('MaHelper service', function () {
    var MaHelper;

    beforeEach(module('marcuraUI.services'));
    beforeEach(inject(function (_MaHelper_) {
        MaHelper = _MaHelper_;
    }));

    describe('isEmail method', function () {
        it('determines whether a specified value is an email', function () {
            expect(MaHelper.isEmail('p.smith@gmail.com')).toEqual(true);
            expect(MaHelper.isEmail('p.smithgmail.com')).toEqual(false);
            expect(MaHelper.isEmail('p.smith@gmailcom')).toEqual(false);
            expect(MaHelper.isEmail(null)).toEqual(false);
            expect(MaHelper.isEmail(undefined)).toEqual(false);
            expect(MaHelper.isEmail('')).toEqual(false);
            expect(MaHelper.isEmail({})).toEqual(false);
        });
    });

    describe('isNullOrWhiteSpace method', function () {
        it('determines whether a specified string is null, empty, or consists only of white-space characters', function () {
            expect(MaHelper.isNullOrWhiteSpace(null)).toEqual(true);
            expect(MaHelper.isNullOrWhiteSpace('')).toEqual(true);
            expect(MaHelper.isNullOrWhiteSpace(' ')).toEqual(true);
            expect(MaHelper.isNullOrWhiteSpace('    ')).toEqual(true);
            expect(MaHelper.isNullOrWhiteSpace(undefined)).toEqual(true);
            expect(MaHelper.isNullOrWhiteSpace(false)).toEqual(false);
            expect(MaHelper.isNullOrWhiteSpace(true)).toEqual(false);
            expect(MaHelper.isNullOrWhiteSpace('data')).toEqual(false);
            expect(MaHelper.isNullOrWhiteSpace({
                name: 'Data'
            })).toEqual(false);
            expect(MaHelper.isNullOrWhiteSpace({})).toEqual(false);
            expect(MaHelper.isNullOrWhiteSpace([{
                name: 'Data'
            }])).toEqual(false);
            expect(MaHelper.isNullOrWhiteSpace(1100)).toEqual(false);
            expect(MaHelper.isNullOrWhiteSpace(new Date())).toEqual(false);
            expect(MaHelper.isNullOrWhiteSpace([])).toEqual(false);
        });
    });

    describe('getTextHeight method', function () {
        it('measures height of text', function () {
            expect(MaHelper.getTextHeight('d\n\n\n', '12.8px Arial', '100px')).toEqual(60);
            expect(MaHelper.getTextHeight('dddddddddddddddddddddddddddddddd', '12.8px Arial', '100px')).toEqual(45);
        });
    });

    describe('isGreater method', function () {
        it('determines whether a specified value is greater than other value', function () {
            // Number.
            expect(MaHelper.isGreater(2, 1)).toEqual(true);
            expect(MaHelper.isGreater(1, 2)).toEqual(false);
            expect(MaHelper.isGreater(1, 1)).toEqual(false);
            expect(MaHelper.isGreater(1, 1)).toEqual(false);
            expect(MaHelper.isGreater('0', 0)).toEqual(false);
            expect(MaHelper.isGreater('1', 0)).toEqual(true);

            // Date.
            expect(MaHelper.isGreater('2016-09-26T00:00:00Z', '2016-09-16T00:00:00Z')).toEqual(true);
            expect(MaHelper.isGreater('2016-09-16T00:00:00Z', '2016-09-26T00:00:00Z')).toEqual(false);
            expect(MaHelper.isGreater('2016-09-16T00:00:00Z', '2016-09-16T00:00:00Z')).toEqual(false);

            // Date and time.
            expect(MaHelper.isGreater('2016-09-26T01:00:00Z', '2016-09-26T00:00:00Z')).toEqual(true);
            expect(MaHelper.isGreater('2016-09-26T00:00:00Z', '2016-09-26T01:00:00Z')).toEqual(false);
            expect(MaHelper.isGreater('2016-09-26T00:00:00Z', '2016-09-26T00:00:00Z')).toEqual(false);

            // Date with time zone.
            expect(MaHelper.isGreater('2016-09-26T10:00:00+01:00', '2016-09-26T10:00:00+02:00')).toEqual(true);
            expect(MaHelper.isGreater('2016-09-26T10:00:00+02:00', '2016-09-26T10:00:00+01:00')).toEqual(false);
            expect(MaHelper.isGreater('2016-09-26T10:00:00+01:00', '2016-09-26T10:00:00+01:00')).toEqual(false);
        });
    });

    describe('isGreaterOrEqual method', function () {
        it('determines whether a specified value is greater than or equal to other value', function () {
            // Number.
            expect(MaHelper.isGreaterOrEqual(2, 1)).toEqual(true);
            expect(MaHelper.isGreaterOrEqual(1, 2)).toEqual(false);
            expect(MaHelper.isGreaterOrEqual(1, 1)).toEqual(true);
            expect(MaHelper.isGreaterOrEqual('0', 0)).toEqual(true);
            expect(MaHelper.isGreaterOrEqual('1', 0)).toEqual(true);

            // Date.
            expect(MaHelper.isGreaterOrEqual('2016-09-26T00:00:00Z', '2016-09-16T00:00:00Z')).toEqual(true);
            expect(MaHelper.isGreaterOrEqual('2016-09-16T00:00:00Z', '2016-09-26T00:00:00Z')).toEqual(false);
            expect(MaHelper.isGreaterOrEqual('2016-09-16T00:00:00Z', '2016-09-16T00:00:00Z')).toEqual(true);

            // Date and time.
            expect(MaHelper.isGreaterOrEqual('2016-09-26T01:00:00Z', '2016-09-26T00:00:00Z')).toEqual(true);
            expect(MaHelper.isGreaterOrEqual('2016-09-26T00:00:00Z', '2016-09-26T01:00:00Z')).toEqual(false);
            expect(MaHelper.isGreaterOrEqual('2016-09-26T00:00:00Z', '2016-09-26T00:00:00Z')).toEqual(true);

            // Date with time zone.
            expect(MaHelper.isGreaterOrEqual('2016-09-26T10:00:00+01:00', '2016-09-26T10:00:00+02:00')).toEqual(true);
            expect(MaHelper.isGreaterOrEqual('2016-09-26T10:00:00+02:00', '2016-09-26T10:00:00+01:00')).toEqual(false);
            expect(MaHelper.isGreaterOrEqual('2016-09-26T10:00:00+01:00', '2016-09-26T10:00:00+01:00')).toEqual(true);
        });
    });

    describe('isLess method', function () {
        it('determines whether a specified value is less than other value', function () {
            // Number.
            expect(MaHelper.isLess(2, 1)).toEqual(false);
            expect(MaHelper.isLess(1, 2)).toEqual(true);
            expect(MaHelper.isLess(1, 1)).toEqual(false);
            expect(MaHelper.isLess('0', 0)).toEqual(false);
            expect(MaHelper.isLess('0', 1)).toEqual(true);

            // Date.
            expect(MaHelper.isLess('2016-09-26T00:00:00Z', '2016-09-16T00:00:00Z')).toEqual(false);
            expect(MaHelper.isLess('2016-09-16T00:00:00Z', '2016-09-26T00:00:00Z')).toEqual(true);
            expect(MaHelper.isLess('2016-09-16T00:00:00Z', '2016-09-16T00:00:00Z')).toEqual(false);

            // Date and time.
            expect(MaHelper.isLess('2016-09-26T01:00:00Z', '2016-09-26T00:00:00Z')).toEqual(false);
            expect(MaHelper.isLess('2016-09-26T00:00:00Z', '2016-09-26T01:00:00Z')).toEqual(true);
            expect(MaHelper.isLess('2016-09-26T00:00:00Z', '2016-09-26T00:00:00Z')).toEqual(false);

            // Date with time zone.
            expect(MaHelper.isLess('2016-09-26T10:00:00+01:00', '2016-09-26T10:00:00+02:00')).toEqual(false);
            expect(MaHelper.isLess('2016-09-26T10:00:00+02:00', '2016-09-26T10:00:00+01:00')).toEqual(true);
            expect(MaHelper.isLess('2016-09-26T10:00:00+01:00', '2016-09-26T10:00:00+01:00')).toEqual(false);
        });
    });

    describe('isLessOrEqual method', function () {
        it('determines whether a specified value is less than or equal to other value', function () {
            // Number.
            expect(MaHelper.isLessOrEqual(2, 1)).toEqual(false);
            expect(MaHelper.isLessOrEqual(1, 2)).toEqual(true);
            expect(MaHelper.isLessOrEqual(1, 1)).toEqual(true);
            expect(MaHelper.isLessOrEqual('0', 0)).toEqual(true);
            expect(MaHelper.isLessOrEqual('0', 1)).toEqual(true);

            // Date.
            expect(MaHelper.isLessOrEqual('2016-09-26T00:00:00Z', '2016-09-16T00:00:00Z')).toEqual(false);
            expect(MaHelper.isLessOrEqual('2016-09-16T00:00:00Z', '2016-09-26T00:00:00Z')).toEqual(true);
            expect(MaHelper.isLessOrEqual('2016-09-16T00:00:00Z', '2016-09-16T00:00:00Z')).toEqual(true);

            // Date and time.
            expect(MaHelper.isLessOrEqual('2016-09-26T01:00:00Z', '2016-09-26T00:00:00Z')).toEqual(false);
            expect(MaHelper.isLessOrEqual('2016-09-26T00:00:00Z', '2016-09-26T01:00:00Z')).toEqual(true);
            expect(MaHelper.isLessOrEqual('2016-09-26T00:00:00Z', '2016-09-26T00:00:00Z')).toEqual(true);

            // Date with time zone.
            expect(MaHelper.isLessOrEqual('2016-09-26T10:00:00+01:00', '2016-09-26T10:00:00+02:00')).toEqual(false);
            expect(MaHelper.isLessOrEqual('2016-09-26T10:00:00+02:00', '2016-09-26T10:00:00+01:00')).toEqual(true);
            expect(MaHelper.isLessOrEqual('2016-09-26T10:00:00+01:00', '2016-09-26T10:00:00+01:00')).toEqual(true);
        });
    });

    describe('isNumber method', function () {
        it('determines whether a specified value is a number', function () {
            // Number.
            expect(MaHelper.isNumber()).toEqual(false);
            expect(MaHelper.isNumber(null)).toEqual(false);
            expect(MaHelper.isNumber(undefined)).toEqual(false);
            expect(MaHelper.isNumber('')).toEqual(false);
            expect(MaHelper.isNumber('d10.10')).toEqual(false);
            expect(MaHelper.isNumber('10.10d')).toEqual(false);
            expect(MaHelper.isNumber(0)).toEqual(true);
            expect(MaHelper.isNumber(-0)).toEqual(true);
            expect(MaHelper.isNumber(+0)).toEqual(true);
            expect(MaHelper.isNumber(1)).toEqual(true);
            expect(MaHelper.isNumber(1.00)).toEqual(true);
            expect(MaHelper.isNumber(1.00)).toEqual(true);
            expect(MaHelper.isNumber(1.10)).toEqual(true);
            expect(MaHelper.isNumber(10.10)).toEqual(true);
            expect(MaHelper.isNumber(10.)).toEqual(true);
            expect(MaHelper.isNumber('10.10')).toEqual(true);
            expect(MaHelper.isNumber('10.')).toEqual(true);
        });
    });
});