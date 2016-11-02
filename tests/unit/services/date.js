describe('MaDate', function() {
    var MaDate,
        currentDate = new Date(),
        currentYear = currentDate.getFullYear();

    beforeEach(module('marcuraUI.services'));
    beforeEach(inject(function(_MaDate_, $window) {
        MaDate = _MaDate_;
        window = $window;
        moment = $window.moment;
    }));

    describe('constructor', function() {
        it('creates empty instance', function() {
            var maDate = new MaDate();
            expect(maDate.date).toEqual(null);
            expect(maDate.offset()).toEqual(0);
        });

        it('creates instance', function() {
            var maDate = new MaDate(new Date(1987, 6, 1, 0, 0, 0), 60);
            expect(maDate.date.toString().slice(4, 15)).toEqual('Jul 01 1987');
            expect(maDate.offset()).toEqual(60);
        });

        it('parses date if it is string', function() {
            expect(new MaDate('1 7 87').date.toString().slice(4, 15)).toEqual('Jul 01 1987');
        });
    });

    describe('isDate method', function() {
        it('determines whether a specified value is a date', function() {
            expect(MaDate.isDate(new Date())).toEqual(true);
            expect(MaDate.isDate(new Date('invalid'))).toEqual(false);
            expect(MaDate.isDate('Mon Aug 24 2015 10:42:31 GMT+0700 (N. Central Asia Daylight Time)')).toEqual(false);
            expect(MaDate.isDate('2015-02-21')).toEqual(false);
            expect(MaDate.isDate('Simple string')).toEqual(false);
            expect(MaDate.isDate('')).toEqual(false);
            expect(MaDate.isDate(2015)).toEqual(false);
            expect(MaDate.isDate([])).toEqual(false);
            expect(MaDate.isDate([10, 20, 30])).toEqual(false);
            expect(MaDate.isDate({})).toEqual(false);
            expect(MaDate.isDate({
                name: 'Data'
            })).toEqual(false);
            expect(MaDate.isDate(true)).toEqual(false);
            expect(MaDate.isDate(false)).toEqual(false);
            expect(MaDate.isDate(null)).toEqual(false);
            expect(MaDate.isDate(undefined)).toEqual(false);
            expect(MaDate.isDate(NaN)).toEqual(false);
        });
    });

    describe('parse method', function() {
        it('returns passed date if it is already a valid MaDate object', function() {
            var date = MaDate.parse('2015-02-21T10:00:00Z');
            expect(MaDate.parse(date)).toEqual(date);
        });

        it('parses date in dd format', function() {
            var currentMonth = MaDate.format(currentDate, 'MMM');
            expect(MaDate.parse('21').date.toString().slice(4, 15)).toEqual(currentMonth + ' 21 ' + currentYear);
        });

        it('parses date in d/M format', function() {
            expect(MaDate.parse('1 7').date.toString().slice(4, 15)).toEqual('Jul 01 ' + currentYear);
            expect(MaDate.parse('1/7').date.toString().slice(4, 15)).toEqual('Jul 01 ' + currentYear);
            expect(MaDate.parse('1.7').date.toString().slice(4, 15)).toEqual('Jul 01 ' + currentYear);
            expect(MaDate.parse('1-7').date.toString().slice(4, 15)).toEqual('Jul 01 ' + currentYear);

            // en-GB
            expect(MaDate.parse('1 7', 'en-GB').date.toString().slice(4, 15)).toEqual('Jul 01 ' + currentYear);
            expect(MaDate.parse('7 1', 'en-GB').date.toString().slice(4, 15)).toEqual('Jan 07 ' + currentYear);
            expect(MaDate.parse('21 1', 'en-GB').date.toString().slice(4, 15)).toEqual('Jan 21 ' + currentYear);
            expect(MaDate.parse('1 13', 'en-GB').isEmpty()).toEqual(true);

            // en-US
            expect(MaDate.parse('1 7', 'en-US').date.toString().slice(4, 15)).toEqual('Jan 07 ' + currentYear);
            expect(MaDate.parse('7 1', 'en-US').date.toString().slice(4, 15)).toEqual('Jul 01 ' + currentYear);
            expect(MaDate.parse('7 21', 'en-US').date.toString().slice(4, 15)).toEqual('Jul 21 ' + currentYear);
            expect(MaDate.parse('13 1', 'en-US').isEmpty()).toEqual(true);
        });

        it('parses date in d/M/yy format', function() {
            expect(MaDate.parse('1 7 87').date.toString().slice(4, 15)).toEqual('Jul 01 1987');
            expect(MaDate.parse('1/7/87').date.toString().slice(4, 15)).toEqual('Jul 01 1987');
            expect(MaDate.parse('1/7/15').date.toString().slice(4, 15)).toEqual('Jul 01 2015');
            expect(MaDate.parse('1-7-87').date.toString().slice(4, 15)).toEqual('Jul 01 1987');
            expect(MaDate.parse('1.7.87').date.toString().slice(4, 15)).toEqual('Jul 01 1987');
        });

        it('parses date in d/MM/yy format', function() {
            expect(MaDate.parse('1 07 87').date.toString().slice(4, 15)).toEqual('Jul 01 1987');
            expect(MaDate.parse('1/07/87').date.toString().slice(4, 15)).toEqual('Jul 01 1987');
            expect(MaDate.parse('1-07-87').date.toString().slice(4, 15)).toEqual('Jul 01 1987');
            expect(MaDate.parse('1.07.87').date.toString().slice(4, 15)).toEqual('Jul 01 1987');
        });

        it('parses date in dd/MM format', function() {
            expect(MaDate.parse('2102').date.toString().slice(4, 15)).toEqual('Feb 21 ' + currentYear);
            expect(MaDate.parse('21 02').date.toString().slice(4, 15)).toEqual('Feb 21 ' + currentYear);
            expect(MaDate.parse('21-02').date.toString().slice(4, 15)).toEqual('Feb 21 ' + currentYear);
            expect(MaDate.parse('21/02').date.toString().slice(4, 15)).toEqual('Feb 21 ' + currentYear);
            expect(MaDate.parse('21.02').date.toString().slice(4, 15)).toEqual('Feb 21 ' + currentYear);

            // en-GB
            expect(MaDate.parse('1002', 'en-GB').date.toString().slice(4, 15)).toEqual('Feb 10 ' + currentYear);
            expect(MaDate.parse('0210', 'en-GB').date.toString().slice(4, 15)).toEqual('Oct 02 ' + currentYear);
            expect(MaDate.parse('1022', 'en-GB').isEmpty()).toEqual(true);

            // en-US
            expect(MaDate.parse('1002', 'en-US').date.toString().slice(4, 15)).toEqual('Oct 02 ' + currentYear);
            expect(MaDate.parse('0210', 'en-US').date.toString().slice(4, 15)).toEqual('Feb 10 ' + currentYear);
            expect(MaDate.parse('2210', 'en-US').isEmpty()).toEqual(true);
        });

        it('parses date in dd/M/yy format', function() {
            expect(MaDate.parse('01 7 87').date.toString().slice(4, 15)).toEqual('Jul 01 1987');
            expect(MaDate.parse('01/7/87').date.toString().slice(4, 15)).toEqual('Jul 01 1987');
            expect(MaDate.parse('01-7-87').date.toString().slice(4, 15)).toEqual('Jul 01 1987');
            expect(MaDate.parse('01.7.87').date.toString().slice(4, 15)).toEqual('Jul 01 1987');
        });

        it('parses date in dd/M/yyyy format', function() {
            expect(MaDate.parse('21 2 2015').date.toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(MaDate.parse('21/2/2015').date.toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(MaDate.parse('21-2-2015').date.toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(MaDate.parse('21.2.2015').date.toString().slice(4, 15)).toEqual('Feb 21 2015');
        });

        it('parses date in dd/MM/yy format', function() {
            expect(MaDate.parse('010787').date.toString().slice(4, 15)).toEqual('Jul 01 1987');
            expect(MaDate.parse('01 07 87').date.toString().slice(4, 15)).toEqual('Jul 01 1987');
            expect(MaDate.parse('01/07/87').date.toString().slice(4, 15)).toEqual('Jul 01 1987');
            expect(MaDate.parse('01-07-87').date.toString().slice(4, 15)).toEqual('Jul 01 1987');
            expect(MaDate.parse('01.07.87').date.toString().slice(4, 15)).toEqual('Jul 01 1987');

            // en-GB
            expect(MaDate.parse('010787', 'en-GB').date.toString().slice(4, 15)).toEqual('Jul 01 1987');
            expect(MaDate.parse('070187', 'en-GB').date.toString().slice(4, 15)).toEqual('Jan 07 1987');
            expect(MaDate.parse('011387', 'en-GB').isEmpty()).toEqual(true);

            // en-US
            expect(MaDate.parse('010787', 'en-US').date.toString().slice(4, 15)).toEqual('Jan 07 1987');
            expect(MaDate.parse('070187', 'en-US').date.toString().slice(4, 15)).toEqual('Jul 01 1987');
            expect(MaDate.parse('130187', 'en-US').isEmpty()).toEqual(true);
        });

        it('parses date in dd/MM/yyyy format', function() {
            expect(MaDate.parse('01071987').date.toString().slice(4, 15)).toEqual('Jul 01 1987');
            expect(MaDate.parse('01 07 1987').date.toString().slice(4, 15)).toEqual('Jul 01 1987');
            expect(MaDate.parse('01/07/1987').date.toString().slice(4, 15)).toEqual('Jul 01 1987');
            expect(MaDate.parse('01-07-1987').date.toString().slice(4, 15)).toEqual('Jul 01 1987');
            expect(MaDate.parse('01.07.1987').date.toString().slice(4, 15)).toEqual('Jul 01 1987');
        });

        it('parses date in dd/MMM/yy format', function() {
            expect(MaDate.parse('21Feb15').date.toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(MaDate.parse('21 Feb 15').date.toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(MaDate.parse('21/Feb/15').date.toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(MaDate.parse('21-Feb-15').date.toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(MaDate.parse('21.Feb.15').date.toString().slice(4, 15)).toEqual('Feb 21 2015');
        });

        it('parses date in dd/MMM/yyyy format', function() {
            expect(MaDate.parse('21Feb2015').date.toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(MaDate.parse('21 Feb 2015').date.toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(MaDate.parse('21/Feb/2015').date.toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(MaDate.parse('21-Feb-2015').date.toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(MaDate.parse('21.Feb.2015').date.toString().slice(4, 15)).toEqual('Feb 21 2015');
        });

        it('parses date in dd/MMMM/yy format', function() {
            expect(MaDate.parse('21February15').date.toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(MaDate.parse('21 February 15').date.toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(MaDate.parse('21/February/15').date.toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(MaDate.parse('21-February-15').date.toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(MaDate.parse('21.February.15').date.toString().slice(4, 15)).toEqual('Feb 21 2015');
        });

        it('parses date in dd/MMMM/yyyy format', function() {
            expect(MaDate.parse('21February2015').date.toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(MaDate.parse('21 February 2015').date.toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(MaDate.parse('21/February/2015').date.toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(MaDate.parse('21-February-2015').date.toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(MaDate.parse('21.February.2015').date.toString().slice(4, 15)).toEqual('Feb 21 2015');
        });

        it('parses date in MMM/dd/yy format', function() {
            expect(MaDate.parse('Feb2115').date.toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(MaDate.parse('Feb 21 15').date.toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(MaDate.parse('Feb/21/15').date.toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(MaDate.parse('Feb-21-15').date.toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(MaDate.parse('Feb.21.15').date.toString().slice(4, 15)).toEqual('Feb 21 2015');
        });

        it('parses date in MMM/dd/yyyy format', function() {
            expect(MaDate.parse('Feb212015').date.toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(MaDate.parse('Feb 21 2015').date.toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(MaDate.parse('Feb-21-2015').date.toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(MaDate.parse('Feb/21/2015').date.toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(MaDate.parse('Feb.21.2015').date.toString().slice(4, 15)).toEqual('Feb 21 2015');
        });

        it('parses date in yyyy/M/dd format', function() {
            expect(MaDate.parse('2015/2/21').date.toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(MaDate.parse('2015-2-21').date.toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(MaDate.parse('2015-2-9').date.toString().slice(4, 15)).toEqual('Feb 09 2015');
            expect(MaDate.parse('2015.2.21').date.toString().slice(4, 15)).toEqual('Feb 21 2015');
        });

        it('parses date in yyyy/MM/dd format', function() {
            expect(MaDate.parse('2015 02 21').date.toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(MaDate.parse('2015/02/21').date.toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(MaDate.parse('2015-02-21').date.toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(MaDate.parse('2015.02.21').date.toString().slice(4, 15)).toEqual('Feb 21 2015');
        });

        it('parses date in yyyy/MMMM/dd format', function() {
            expect(MaDate.parse('2015February21').date.toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(MaDate.parse('2015 February 21').date.toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(MaDate.parse('2015/February/21').date.toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(MaDate.parse('2015-February-21').date.toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(MaDate.parse('2015.February.21').date.toString().slice(4, 15)).toEqual('Feb 21 2015');
        });

        it('parses date with UTC time zone', function() {
            var date = MaDate.parse('2015-02-21T10:00:00Z');
            expect(date.date.toString().slice(4, 24)).toEqual('Feb 21 2015 10:00:00');
            expect(date.offset()).toEqual(0);
        });

        it('ignores time zones other than UTC', function() {
            var date = MaDate.parse('2015-02-21T10:00:00-03:00');
            expect(date.date.toString().slice(4, 24)).toEqual('Feb 21 2015 10:00:00');
            expect(date.offset()).toEqual(-180);
        });

        it('supports specific en-GB formats', function() {
            expect(MaDate.parse('Feb 21, 15').date.toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(MaDate.parse('Feb21,15').date.toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(MaDate.parse('Feb 21, 2015').date.toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(MaDate.parse('Feb21,2015').date.toString().slice(4, 15)).toEqual('Feb 21 2015');
        });

        it('returns empty instance if it can not parse date', function() {
            expect(MaDate.parse('Incorrect date').isEmpty()).toEqual(true);
            expect(MaDate.parse(null).isEmpty()).toEqual(true);
            expect(MaDate.parse(true).isEmpty()).toEqual(true);
            expect(MaDate.parse(false).isEmpty()).toEqual(true);
            expect(MaDate.parse(undefined).isEmpty()).toEqual(true);
            expect(MaDate.parse(1999).isEmpty()).toEqual(true);
            expect(MaDate.parse('29/29/1999').isEmpty()).toEqual(true);
            expect(MaDate.parse('12/33/1999').isEmpty()).toEqual(true);
            expect(MaDate.parse('42/11/1999').isEmpty()).toEqual(true);
            expect(MaDate.parse('data/11.1999').isEmpty()).toEqual(true);
            expect(MaDate.parse('99 Feburrr 12').isEmpty()).toEqual(true);
            expect(MaDate.parse('11 month 2000').isEmpty()).toEqual(true);
            expect(MaDate.parse('2015-02-21T10:00:00-25:00').isEmpty()).toEqual(true);
        });

        it('parses leap years', function() {
            expect(MaDate.parse('29 Feb 2015').isEmpty()).toEqual(true);
            expect(MaDate.parse('28 Feb 2015').date.toString().slice(4, 15)).toEqual('Feb 28 2015');
            expect(MaDate.parse('29 Feb 2012').date.toString().slice(4, 15)).toEqual('Feb 29 2012');
            expect(MaDate.parse('28 Feb 2012').date.toString().slice(4, 15)).toEqual('Feb 28 2012');
        });
    });

    describe('format method', function() {
        it('returns an null if it can not the date', function() {
            expect(MaDate.format(new Date(2015, 1, 21), null)).toEqual(null);
            expect(MaDate.format(new Date(2015, 1, 21), true)).toEqual(null);
            expect(MaDate.format(new Date(2015, 1, 21), false)).toEqual(null);
            expect(MaDate.format(new Date(2015, 1, 21), undefined)).toEqual(null);
        });

        it('supports day format', function() {
            expect(MaDate.format(new Date(2015, 1, 7), 'yyyy-MM-d')).toEqual('2015-02-7');
            expect(MaDate.format(new Date(2015, 1, 7), 'yyyy-MM-dd')).toEqual('2015-02-07');
        });

        it('supports month format', function() {
            expect(MaDate.format(new Date(2015, 1, 7), 'yyyy-M-dd')).toEqual('2015-2-07');
            expect(MaDate.format(new Date(2015, 1, 7), 'yyyy-MM-dd')).toEqual('2015-02-07');
            expect(MaDate.format(new Date(2015, 1, 7), 'yyyy-MMM-dd')).toEqual('2015-Feb-07');
            expect(MaDate.format(new Date(2015, 1, 7), 'yyyy-MMMM-dd')).toEqual('2015-February-07');
        });

        it('supports year format', function() {
            expect(MaDate.format(new Date(2015, 1, 7), 'yy-M-dd')).toEqual('15-2-07');
            expect(MaDate.format(new Date(2015, 1, 7), 'yyyy-M-dd')).toEqual('2015-2-07');
        });

        it('supports hours, minutes and seconds formats', function() {
            expect(MaDate.format(new Date(2015, 1, 7, 12, 0, 42), 'HH:mm:ss')).toEqual('12:00:42');
            expect(MaDate.format(new Date(2015, 1, 7, 12, 0, 7), 'yy-M-dd HH.mm.ss')).toEqual('15-2-07 12.00.07');
        });

        it('supports time zone', function() {
            expect(MaDate.format(new Date(2015, 1, 7, 12, 0, 7), 'yyyy-MM-dd HH:mm:ssZ', 'Z')).toEqual('2015-02-07 12:00:07Z');
            expect(MaDate.format(new Date(2015, 1, 7, 12, 0, 7), 'yyyy-MM-dd HH:mm:ssZ', '+00:00')).toEqual('2015-02-07 12:00:07+00:00');
            expect(MaDate.format(new Date(2015, 1, 7, 12, 0, 7), 'yyyy-MM-dd HH:mm:ssZ', '-00:00')).toEqual('2015-02-07 12:00:07-00:00');
            expect(MaDate.format(new Date(2015, 1, 7, 12, 0, 7), 'yyyy-MM-dd HH:mm:ssZ', '+03:00')).toEqual('2015-02-07 12:00:07+03:00');
            expect(MaDate.format(new Date(2015, 1, 7, 12, 0, 7), 'yyyy-MM-dd HH:mm:ssZ', '-03:00')).toEqual('2015-02-07 12:00:07-03:00');
        });

        it('supports different cultures', function() {
            expect(MaDate.format(new Date(2015, 1, 7, 12, 0), 'yy-MMM-dd', 'en-US')).toEqual('15-Feb-07');
            expect(MaDate.format(new Date(2015, 1, 7, 12, 0), 'yy-MMM-dd', 'en-GB')).toEqual('15-Feb-07');
            expect(MaDate.format(new Date(2015, 1, 7, 12, 0), 'yy-MMMM-dd', 'en-US')).toEqual('15-February-07');
            expect(MaDate.format(new Date(2015, 1, 7, 12, 0), 'yy-MMMM-dd', 'en-GB')).toEqual('15-February-07');
        });

        it('supports Moment.js', function() {
            expect(MaDate.format(moment([2015, 1, 7, 12, 0, 7]), 'yy-M-dd HH.mm.ss')).toEqual('15-2-07 12.00.07');
        });
    });

    describe('offsetUtc method', function() {
        it('offsets the date to UTC date', function() {
            expect(MaDate.offsetUtc('2016-07-25T10:00:00Z').toString().slice(4, 24)).toEqual('Jul 25 2016 10:00:00');
            expect(MaDate.offsetUtc(new Date(2016, 6, 25, 10, 0, 0)).toString().slice(4, 24)).toEqual('Jul 25 2016 10:00:00');
            expect(MaDate.offsetUtc(moment([2016, 6, 25, 10, 0, 0])).toString().slice(4, 24)).toEqual('Jul 25 2016 10:00:00');
        });

        it('offsets the date to a specified time zone offset', function() {
            expect(MaDate.offsetUtc('2016-07-25T10:00:00Z', 0).toString().slice(4, 24)).toEqual('Jul 25 2016 10:00:00');
            expect(MaDate.offsetUtc(new Date(2016, 6, 25, 10, 0, 0), 0).toString().slice(4, 24)).toEqual('Jul 25 2016 10:00:00');
            expect(MaDate.offsetUtc(moment([2016, 6, 25, 10, 0, 0]), 0).toString().slice(4, 24)).toEqual('Jul 25 2016 10:00:00');

            expect(MaDate.offsetUtc('2016-07-25T10:00:00Z', -600).toString().slice(4, 24)).toEqual('Jul 25 2016 00:00:00');
            expect(MaDate.offsetUtc(new Date(2016, 6, 25, 10, 0, 0), -600).toString().slice(4, 24)).toEqual('Jul 25 2016 00:00:00');
            expect(MaDate.offsetUtc(moment([2016, 6, 25, 10, 0, 0]), -600).toString().slice(4, 24)).toEqual('Jul 25 2016 00:00:00');

            expect(MaDate.offsetUtc('2016-07-25T06:00:00Z', -600).toString().slice(4, 24)).toEqual('Jul 24 2016 20:00:00');
            expect(MaDate.offsetUtc(new Date(2016, 6, 25, 6, 0, 0), -600).toString().slice(4, 24)).toEqual('Jul 24 2016 20:00:00');
            expect(MaDate.offsetUtc(moment([2016, 6, 25, 6, 0, 0]), -600).toString().slice(4, 24)).toEqual('Jul 24 2016 20:00:00');

            expect(MaDate.offsetUtc('2016-07-25T10:00:00Z', 600).toString().slice(4, 24)).toEqual('Jul 25 2016 20:00:00');
            expect(MaDate.offsetUtc(new Date(2016, 6, 25, 10, 0, 0), 600).toString().slice(4, 24)).toEqual('Jul 25 2016 20:00:00');
            expect(MaDate.offsetUtc(moment([2016, 6, 25, 10, 0, 0]), 600).toString().slice(4, 24)).toEqual('Jul 25 2016 20:00:00');

            expect(MaDate.offsetUtc('2016-07-25T20:00:00Z', 600).toString().slice(4, 24)).toEqual('Jul 26 2016 06:00:00');
            expect(MaDate.offsetUtc(new Date(2016, 6, 25, 20, 0, 0), 600).toString().slice(4, 24)).toEqual('Jul 26 2016 06:00:00');
            expect(MaDate.offsetUtc(moment([2016, 6, 25, 20, 0, 0]), 600).toString().slice(4, 24)).toEqual('Jul 26 2016 06:00:00');
        });
    });

    describe('valueOf method', function() {
        it('returns the primitive value of a date', function() {
            // Date.
            expect(MaDate.valueOf('2016-09-26T00:00:00Z')).toEqual(1474833600000);

            // Date and time.
            expect(MaDate.valueOf('2016-09-26T01:00:00Z')).toEqual(1474837200000);

            // Date with time zone.
            expect(MaDate.valueOf('2016-09-26T10:00:00+01:00')).toEqual(1474866000000);
        });
    });

    describe('valueOf difference', function() {
        it('returns difference in milliseconds between two dates', function() {
            expect(MaDate.difference('2016-09-26T00:00:00Z', '2016-09-26T00:00:00Z')).toEqual(0);
            expect(MaDate.difference('2016-09-26T00:00:01Z', '2016-09-26T00:00:00Z')).toEqual(1000);
            expect(MaDate.difference('2016-09-26T00:00:00Z', '2016-09-26T00:00:01Z')).toEqual(-1000);
        });
    });

    describe('parseTimeZone method', function() {
        it('parses time zone', function() {
            expect(MaDate.parseTimeZone('Z')).toEqual(0);
            expect(MaDate.parseTimeZone('00:00')).toEqual(0);
            expect(MaDate.parseTimeZone('-00:00')).toEqual(0);
            expect(MaDate.parseTimeZone('01:00')).toEqual(60);
            expect(MaDate.parseTimeZone('-01:00')).toEqual(-60);
            expect(MaDate.parseTimeZone('01:30')).toEqual(90);
            expect(MaDate.parseTimeZone('-01:30')).toEqual(-90);

            // GMT prefix.
            expect(MaDate.parseTimeZone('GMTZ')).toEqual(0);
            expect(MaDate.parseTimeZone('GMT+01:00')).toEqual(60);
            expect(MaDate.parseTimeZone('GMT-01:00')).toEqual(-60);

            // Incorrect time zone.
            expect(MaDate.parseTimeZone()).toEqual(0);
            expect(MaDate.parseTimeZone('000:00')).toEqual(0);
            expect(MaDate.parseTimeZone('--00:00')).toEqual(0);
            expect(MaDate.parseTimeZone('24:00')).toEqual(0);
            expect(MaDate.parseTimeZone('00:60')).toEqual(0);
        });
    });
});
