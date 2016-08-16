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

    describe('isDate method', function() {
        it('determines whether a specified value is a date', function() {
            expect(maHelper.isDate(new Date())).toEqual(true);
            expect(maHelper.isDate(new Date('invalid'))).toEqual(false);
            expect(maHelper.isDate('Mon Aug 24 2015 10:42:31 GMT+0700 (N. Central Asia Daylight Time)')).toEqual(false);
            expect(maHelper.isDate('2015-02-21')).toEqual(false);
            expect(maHelper.isDate('Simple string')).toEqual(false);
            expect(maHelper.isDate('')).toEqual(false);
            expect(maHelper.isDate(2015)).toEqual(false);
            expect(maHelper.isDate([])).toEqual(false);
            expect(maHelper.isDate([10, 20, 30])).toEqual(false);
            expect(maHelper.isDate({})).toEqual(false);
            expect(maHelper.isDate({
                name: 'Data'
            })).toEqual(false);
            expect(maHelper.isDate(true)).toEqual(false);
            expect(maHelper.isDate(false)).toEqual(false);
            expect(maHelper.isDate(null)).toEqual(false);
            expect(maHelper.isDate(undefined)).toEqual(false);
            expect(maHelper.isDate(NaN)).toEqual(false);
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
});
