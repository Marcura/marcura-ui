describe('MaDate', function() {
    var MaDate,
        currentDate = new Date(),
        currentYear = currentDate.getFullYear();

    beforeEach(module('marcuraUI.services'));
    beforeEach(inject(function(_MaDate_, $window) {
        MaDate = _MaDate_;
        window = $window;
    }));

    describe('constructor', function() {
        it('uses current date if date is not passed', function() {
            var maDate = new MaDate();
            expect(maDate.difference(new MaDate(new Date))).toEqual(0);
        });

        it('creates empty instance if passed date is incorrect', function() {
            expect(new MaDate(undefined).isEmpty()).toEqual(true);
            expect(new MaDate(1).isEmpty()).toEqual(true);
        });

        it('creates instance', function() {
            var maDate = new MaDate(new Date(1987, 6, 1, 0, 0, 0));
            expect(maDate.format()).toEqual('1987-07-01T00:00:00Z');
            expect(maDate.offset()).toEqual(0);
        });

        it('parses date', function() {
            expect(new MaDate('1 7 87').format()).toEqual('1987-07-01T00:00:00Z');
        });
    });

    describe('isDate method', function() {
        it('determines whether value is a date', function() {
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

    describe('isMaDate method', function() {
        it('determines whether value is a MaDate', function() {
            expect(MaDate.isMaDate()).toEqual(false);
            expect(MaDate.isMaDate(null)).toEqual(false);
            expect(MaDate.isMaDate(new MaDate())).toEqual(true);
        });
    });

    describe('parse method', function() {
        it('returns passed date if it is already a valid MaDate object', function() {
            var date = MaDate.parse('2015-02-21T10:00:00Z');
            expect(MaDate.parse(date)).toEqual(date);
        });

        it('parses date in dd format', function() {
            var currentMonth = MaDate.format(currentDate, 'MM');
            expect(MaDate.parse('21').format()).toEqual(currentYear + '-' + currentMonth + '-21T00:00:00Z');
        });

        it('parses date in d/M format', function() {
            expect(MaDate.parse('1 7').format()).toEqual(currentYear + '-07-01T00:00:00Z');
            expect(MaDate.parse('1/7').format()).toEqual(currentYear + '-07-01T00:00:00Z');
            expect(MaDate.parse('1.7').format()).toEqual(currentYear + '-07-01T00:00:00Z');
            expect(MaDate.parse('1-7').format()).toEqual(currentYear + '-07-01T00:00:00Z');

            // en-GB
            expect(MaDate.parse('1 7', 'en-GB').format()).toEqual(currentYear + '-07-01T00:00:00Z');
            expect(MaDate.parse('7 1', 'en-GB').format()).toEqual(currentYear + '-01-07T00:00:00Z');
            expect(MaDate.parse('21 1', 'en-GB').format()).toEqual(currentYear + '-01-21T00:00:00Z');
            expect(MaDate.parse('1 13', 'en-GB').isEmpty()).toEqual(true);

            // en-US
            expect(MaDate.parse('1 7', 'en-US').format()).toEqual(currentYear + '-01-07T00:00:00Z');
            expect(MaDate.parse('7 1', 'en-US').format()).toEqual(currentYear + '-07-01T00:00:00Z');
            expect(MaDate.parse('7 21', 'en-US').format()).toEqual(currentYear + '-07-21T00:00:00Z');
            expect(MaDate.parse('13 1', 'en-US').isEmpty()).toEqual(true);
        });

        it('parses date in d/M/yy format', function() {
            expect(MaDate.parse('1 7 87').format()).toEqual('1987-07-01T00:00:00Z');
            expect(MaDate.parse('1/7/87').format()).toEqual('1987-07-01T00:00:00Z');
            expect(MaDate.parse('1/7/15').format()).toEqual('2015-07-01T00:00:00Z');
            expect(MaDate.parse('1-7-87').format()).toEqual('1987-07-01T00:00:00Z');
            expect(MaDate.parse('1.7.87').format()).toEqual('1987-07-01T00:00:00Z');
        });

        it('parses date in d/MM/yy format', function() {
            expect(MaDate.parse('1 07 87').format()).toEqual('1987-07-01T00:00:00Z');
            expect(MaDate.parse('1/07/87').format()).toEqual('1987-07-01T00:00:00Z');
            expect(MaDate.parse('1-07-87').format()).toEqual('1987-07-01T00:00:00Z');
            expect(MaDate.parse('1.07.87').format()).toEqual('1987-07-01T00:00:00Z');
        });

        it('parses date in dd/MM format', function() {
            expect(MaDate.parse('2102').format()).toEqual(currentYear + '-02-21T00:00:00Z');
            expect(MaDate.parse('21 02').format()).toEqual(currentYear + '-02-21T00:00:00Z');
            expect(MaDate.parse('21-02').format()).toEqual(currentYear + '-02-21T00:00:00Z');
            expect(MaDate.parse('21/02').format()).toEqual(currentYear + '-02-21T00:00:00Z');
            expect(MaDate.parse('21.02').format()).toEqual(currentYear + '-02-21T00:00:00Z');

            // en-GB
            expect(MaDate.parse('1002', 'en-GB').format()).toEqual(currentYear + '-02-10T00:00:00Z');
            expect(MaDate.parse('0210', 'en-GB').format()).toEqual(currentYear + '-10-02T00:00:00Z');
            expect(MaDate.parse('1022', 'en-GB').isEmpty()).toEqual(true);

            // en-US
            expect(MaDate.parse('1002', 'en-US').format()).toEqual(currentYear + '-10-02T00:00:00Z');
            expect(MaDate.parse('0210', 'en-US').format()).toEqual(currentYear + '-02-10T00:00:00Z');
            expect(MaDate.parse('2210', 'en-US').isEmpty()).toEqual(true);
        });

        it('parses date in dd/M/yy format', function() {
            expect(MaDate.parse('01 7 87').format()).toEqual('1987-07-01T00:00:00Z');
            expect(MaDate.parse('01/7/87').format()).toEqual('1987-07-01T00:00:00Z');
            expect(MaDate.parse('01-7-87').format()).toEqual('1987-07-01T00:00:00Z');
            expect(MaDate.parse('01.7.87').format()).toEqual('1987-07-01T00:00:00Z');
        });

        it('parses date in dd/M/yyyy format', function() {
            expect(MaDate.parse('21 2 2015').format()).toEqual('2015-02-21T00:00:00Z');
            expect(MaDate.parse('21/2/2015').format()).toEqual('2015-02-21T00:00:00Z');
            expect(MaDate.parse('21-2-2015').format()).toEqual('2015-02-21T00:00:00Z');
            expect(MaDate.parse('21.2.2015').format()).toEqual('2015-02-21T00:00:00Z');
        });

        it('parses date in dd/MM/yy format', function() {
            expect(MaDate.parse('010787').format()).toEqual('1987-07-01T00:00:00Z');
            expect(MaDate.parse('01 07 87').format()).toEqual('1987-07-01T00:00:00Z');
            expect(MaDate.parse('01/07/87').format()).toEqual('1987-07-01T00:00:00Z');
            expect(MaDate.parse('01-07-87').format()).toEqual('1987-07-01T00:00:00Z');
            expect(MaDate.parse('01.07.87').format()).toEqual('1987-07-01T00:00:00Z');

            // en-GB
            expect(MaDate.parse('010787', 'en-GB').format()).toEqual('1987-07-01T00:00:00Z');
            expect(MaDate.parse('070187', 'en-GB').format()).toEqual('1987-01-07T00:00:00Z');
            expect(MaDate.parse('011387', 'en-GB').isEmpty()).toEqual(true);

            // en-US
            expect(MaDate.parse('010787', 'en-US').format()).toEqual('1987-01-07T00:00:00Z');
            expect(MaDate.parse('070187', 'en-US').format()).toEqual('1987-07-01T00:00:00Z');
            expect(MaDate.parse('130187', 'en-US').isEmpty()).toEqual(true);
        });

        it('parses date in dd/MM/yyyy format', function() {
            expect(MaDate.parse('01071987').format()).toEqual('1987-07-01T00:00:00Z');
            expect(MaDate.parse('01 07 1987').format()).toEqual('1987-07-01T00:00:00Z');
            expect(MaDate.parse('01/07/1987').format()).toEqual('1987-07-01T00:00:00Z');
            expect(MaDate.parse('01-07-1987').format()).toEqual('1987-07-01T00:00:00Z');
            expect(MaDate.parse('01.07.1987').format()).toEqual('1987-07-01T00:00:00Z');
        });

        it('parses date in dd/MMM/yy format', function() {
            expect(MaDate.parse('21Feb15').format()).toEqual('2015-02-21T00:00:00Z');
            expect(MaDate.parse('21 Feb 15').format()).toEqual('2015-02-21T00:00:00Z');
            expect(MaDate.parse('21/Feb/15').format()).toEqual('2015-02-21T00:00:00Z');
            expect(MaDate.parse('21-Feb-15').format()).toEqual('2015-02-21T00:00:00Z');
            expect(MaDate.parse('21.Feb.15').format()).toEqual('2015-02-21T00:00:00Z');
        });

        it('parses date in dd/MMM/yyyy format', function() {
            expect(MaDate.parse('21Feb2015').format()).toEqual('2015-02-21T00:00:00Z');
            expect(MaDate.parse('21 Feb 2015').format()).toEqual('2015-02-21T00:00:00Z');
            expect(MaDate.parse('21/Feb/2015').format()).toEqual('2015-02-21T00:00:00Z');
            expect(MaDate.parse('21-Feb-2015').format()).toEqual('2015-02-21T00:00:00Z');
            expect(MaDate.parse('21.Feb.2015').format()).toEqual('2015-02-21T00:00:00Z');
        });

        it('parses date in dd/MMMM/yy format', function() {
            expect(MaDate.parse('21February15').format()).toEqual('2015-02-21T00:00:00Z');
            expect(MaDate.parse('21 February 15').format()).toEqual('2015-02-21T00:00:00Z');
            expect(MaDate.parse('21/February/15').format()).toEqual('2015-02-21T00:00:00Z');
            expect(MaDate.parse('21-February-15').format()).toEqual('2015-02-21T00:00:00Z');
            expect(MaDate.parse('21.February.15').format()).toEqual('2015-02-21T00:00:00Z');
        });

        it('parses date in dd/MMMM/yyyy format', function() {
            expect(MaDate.parse('21February2015').format()).toEqual('2015-02-21T00:00:00Z');
            expect(MaDate.parse('21 February 2015').format()).toEqual('2015-02-21T00:00:00Z');
            expect(MaDate.parse('21/February/2015').format()).toEqual('2015-02-21T00:00:00Z');
            expect(MaDate.parse('21-February-2015').format()).toEqual('2015-02-21T00:00:00Z');
            expect(MaDate.parse('21.February.2015').format()).toEqual('2015-02-21T00:00:00Z');
        });

        it('parses date in MMM/dd/yy format', function() {
            expect(MaDate.parse('Feb2115').format()).toEqual('2015-02-21T00:00:00Z');
            expect(MaDate.parse('Feb 21 15').format()).toEqual('2015-02-21T00:00:00Z');
            expect(MaDate.parse('Feb/21/15').format()).toEqual('2015-02-21T00:00:00Z');
            expect(MaDate.parse('Feb-21-15').format()).toEqual('2015-02-21T00:00:00Z');
            expect(MaDate.parse('Feb.21.15').format()).toEqual('2015-02-21T00:00:00Z');
        });

        it('parses date in MMM/dd/yyyy format', function() {
            expect(MaDate.parse('Feb212015').format()).toEqual('2015-02-21T00:00:00Z');
            expect(MaDate.parse('Feb 21 2015').format()).toEqual('2015-02-21T00:00:00Z');
            expect(MaDate.parse('Feb-21-2015').format()).toEqual('2015-02-21T00:00:00Z');
            expect(MaDate.parse('Feb/21/2015').format()).toEqual('2015-02-21T00:00:00Z');
            expect(MaDate.parse('Feb.21.2015').format()).toEqual('2015-02-21T00:00:00Z');
        });

        it('parses date in yyyy/M/dd format', function() {
            expect(MaDate.parse('2015/2/21').format()).toEqual('2015-02-21T00:00:00Z');
            expect(MaDate.parse('2015-2-21').format()).toEqual('2015-02-21T00:00:00Z');
            expect(MaDate.parse('2015-2-9').format()).toEqual('2015-02-09T00:00:00Z');
            expect(MaDate.parse('2015.2.21').format()).toEqual('2015-02-21T00:00:00Z');
        });

        it('parses date in yyyy/MM/dd format', function() {
            expect(MaDate.parse('2015 02 21').format()).toEqual('2015-02-21T00:00:00Z');
            expect(MaDate.parse('2015/02/21').format()).toEqual('2015-02-21T00:00:00Z');
            expect(MaDate.parse('2015-02-21').format()).toEqual('2015-02-21T00:00:00Z');
            expect(MaDate.parse('2015.02.21').format()).toEqual('2015-02-21T00:00:00Z');
        });

        it('parses date in yyyy/MMMM/dd format', function() {
            expect(MaDate.parse('2015February21').format()).toEqual('2015-02-21T00:00:00Z');
            expect(MaDate.parse('2015 February 21').format()).toEqual('2015-02-21T00:00:00Z');
            expect(MaDate.parse('2015/February/21').format()).toEqual('2015-02-21T00:00:00Z');
            expect(MaDate.parse('2015-February-21').format()).toEqual('2015-02-21T00:00:00Z');
            expect(MaDate.parse('2015.February.21').format()).toEqual('2015-02-21T00:00:00Z');
        });

        it('parses date with UTC time zone', function() {
            var date = MaDate.parse('2015-02-21T10:00:00Z');
            expect(date.format()).toEqual('2015-02-21T10:00:00Z');
            expect(date.offset()).toEqual(0);
        });

        it('ignores time zones other than UTC', function() {
            var date = MaDate.parse('2015-02-21T10:00:00-03:00');
            expect(date.format()).toEqual('2015-02-21T10:00:00-03:00');
            expect(date.offset()).toEqual(-180);
        });

        it('supports specific en-GB formats', function() {
            expect(MaDate.parse('Feb 21, 15').format()).toEqual('2015-02-21T00:00:00Z');
            expect(MaDate.parse('Feb21,15').format()).toEqual('2015-02-21T00:00:00Z');
            expect(MaDate.parse('Feb 21, 2015').format()).toEqual('2015-02-21T00:00:00Z');
            expect(MaDate.parse('Feb21,2015').format()).toEqual('2015-02-21T00:00:00Z');
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
            expect(MaDate.parse('28 Feb 2015').format()).toEqual('2015-02-28T00:00:00Z');
            expect(MaDate.parse('29 Feb 2015').isEmpty()).toEqual(true);
            expect(MaDate.parse('29 Feb 2012').format()).toEqual('2012-02-29T00:00:00Z');
        });
    });

    describe('format method', function() {
        it('returns null if date is incorrect', function() {
            expect(MaDate.format()).toEqual(null);
        });

        it('formats date', function() {
            var date = new Date(2015, 1, 21);
            expect(MaDate.format(date)).toEqual('2015-02-21T00:00:00Z');
            expect(MaDate.format(new MaDate(date))).toEqual('2015-02-21T00:00:00Z');
        });

        it('formats date using format', function() {
            expect(MaDate.format(new Date(2015, 1, 21), 'yyyy-MM-dd')).toEqual('2015-02-21');
        });

        it('formats date using offset', function() {
            var date = new Date(2015, 1, 7, 12, 0, 7);
            expect(MaDate.format(date, 0)).toEqual('2015-02-07T12:00:07Z');
            expect(MaDate.format(date, 180)).toEqual('2015-02-07T12:00:07+03:00');
            expect(MaDate.format(date, -180)).toEqual('2015-02-07T12:00:07-03:00');
        });

        it('formats date using format and time zone offset', function() {
            var date = new Date(2015, 1, 7, 12, 0, 7);
            expect(MaDate.format(date, 'yyyy-MM-dd HH:mm:ssZ', 0)).toEqual('2015-02-07 12:00:07Z');
            expect(MaDate.format(date, 'yyyy-MM-dd HH:mm:ssZ', 180)).toEqual('2015-02-07 12:00:07+03:00');
            expect(MaDate.format(date, 'yyyy-MM-dd HH:mm:ssZ', -180)).toEqual('2015-02-07 12:00:07-03:00');
        });

        it('supports day format', function() {
            var date = new Date(2015, 1, 7);
            expect(MaDate.format(date, 'yyyy-MM-d')).toEqual('2015-02-7');
            expect(MaDate.format(date, 'yyyy-MM-dd')).toEqual('2015-02-07');
        });

        it('supports month format', function() {
            var date = new Date(2015, 1, 7);
            expect(MaDate.format(date, 'yyyy-M-dd')).toEqual('2015-2-07');
            expect(MaDate.format(date, 'yyyy-MM-dd')).toEqual('2015-02-07');
            expect(MaDate.format(date, 'yyyy-MMM-dd')).toEqual('2015-Feb-07');
            expect(MaDate.format(date, 'yyyy-MMMM-dd')).toEqual('2015-February-07');
        });

        it('supports year format', function() {
            var date = new Date(2015, 1, 7);
            expect(MaDate.format(date, 'yy-M-dd')).toEqual('15-2-07');
            expect(MaDate.format(date, 'yyyy-M-dd')).toEqual('2015-2-07');
        });

        it('supports hours, minutes and seconds formats', function() {
            expect(MaDate.format(new Date(2015, 1, 7, 12, 0, 42), 'HH:mm:ss')).toEqual('12:00:42');
            expect(MaDate.format(new Date(2015, 1, 7, 12, 0, 7), 'yy-M-dd HH.mm.ss')).toEqual('15-2-07 12.00.07');
        });
    });

    describe('instance format method', function() {
        it('formats date', function() {
            expect(new MaDate('2015-02-07T12:00:07Z').format()).toEqual('2015-02-07T12:00:07Z');
            expect(new MaDate('2015-02-07T12:00:07+03:00').format()).toEqual('2015-02-07T12:00:07+03:00');
            expect(new MaDate('2015-02-07T12:00:07-03:00').format()).toEqual('2015-02-07T12:00:07-03:00');
        });

        it('formats date using format', function() {
            expect(new MaDate(new Date(2015, 1, 21)).format('yyyy-MM-dd')).toEqual('2015-02-21');
        });
    });

    describe('valueOf method', function() {
        it('returns the primitive value of a date', function() {
            // Date.
            expect(new MaDate('2016-09-26T00:00:00Z').valueOf()).toEqual(1474833600000);

            // Date and time.
            expect(new MaDate('2016-09-26T01:00:00Z').valueOf()).toEqual(1474837200000);

            // Date with time zone.
            expect(new MaDate('2016-09-26T10:00:00+01:00').valueOf()).toEqual(1474866000000);
        });
    });

    describe('difference method', function() {
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

    describe('offsetToTimeZone method', function() {
        it('parses time zone', function() {
            expect(MaDate.offsetToTimeZone()).toEqual(null);
            expect(MaDate.offsetToTimeZone('')).toEqual(null);
            expect(MaDate.offsetToTimeZone(false)).toEqual(null);

            expect(MaDate.offsetToTimeZone(0)).toEqual('Z');
            expect(MaDate.offsetToTimeZone(60)).toEqual('+01:00');
            expect(MaDate.offsetToTimeZone(-60)).toEqual('-01:00');
            expect(MaDate.offsetToTimeZone(90)).toEqual('+01:30');
            expect(MaDate.offsetToTimeZone(-90)).toEqual('-01:30');

            // Minimun time zone is -12:00.
            expect(MaDate.offsetToTimeZone(-720)).toEqual('-12:00');
            expect(MaDate.offsetToTimeZone(-721)).toEqual(null);

            // Maximum time zone is 14:00.
            expect(MaDate.offsetToTimeZone(840)).toEqual('+14:00');
            expect(MaDate.offsetToTimeZone(841)).toEqual(null);
        });
    });

    describe('createEmpty method', function() {
        it('creates empty instance', function() {
            var maDate = MaDate.createEmpty();
            expect(maDate.isEmpty()).toEqual(true);
        });
    });

    describe('add method', function() {
        // Seconds.
        it('adds seconds', function() {
            var maDate = new MaDate('2015-02-21T10:45:30Z');
            maDate.add(2, 'second');
            expect(maDate.format()).toEqual('2015-02-21T10:45:32Z');

            maDate.add(28, 'second');
            expect(maDate.format()).toEqual('2015-02-21T10:46:00Z');
        });

        // Minutes.
        it('adds minutes', function() {
            var maDate = new MaDate('2015-02-21T10:45:30Z');
            maDate.add(2, 'minute');
            expect(maDate.format()).toEqual('2015-02-21T10:47:30Z');

            maDate.add(13, 'minute');
            expect(maDate.format()).toEqual('2015-02-21T11:00:30Z');
        });

        // Hours.
        it('adds hours', function() {
            var maDate = new MaDate('2015-02-21T10:45:30Z');
            maDate.add(2, 'hour');
            expect(maDate.format()).toEqual('2015-02-21T12:45:30Z');

            maDate.add(12, 'hour');
            expect(maDate.format()).toEqual('2015-02-22T00:45:30Z');
        });

        // Days.
        it('adds days', function() {
            var maDate = new MaDate('2015-02-21T10:45:30Z');
            maDate.add(2, 'day');
            expect(maDate.format()).toEqual('2015-02-23T10:45:30Z');

            maDate.add(6, 'day');
            expect(maDate.format()).toEqual('2015-03-01T10:45:30Z');
        });

        // Months.
        it('adds months', function() {
            var maDate = new MaDate('2015-02-21T10:45:30Z');
            maDate.add(2, 'month');
            expect(maDate.format()).toEqual('2015-04-21T10:45:30Z');

            maDate.add(9, 'month');
            expect(maDate.format()).toEqual('2016-01-21T10:45:30Z');
        });

        // Years.
        it('adds years', function() {
            var maDate = new MaDate('2015-02-21T10:45:30Z');
            maDate.add(2, 'year');
            expect(maDate.format()).toEqual('2017-02-21T10:45:30Z');
        });
    });

    describe('subtract method', function() {
        // Seconds.
        it('subtracts seconds', function() {
            var maDate = new MaDate('2015-02-21T10:45:30Z');
            maDate.subtract(2, 'second');
            expect(maDate.format()).toEqual('2015-02-21T10:45:28Z');

            maDate.subtract(29, 'second');
            expect(maDate.format()).toEqual('2015-02-21T10:44:59Z');
        });

        // Minutes.
        it('subtracts minutes', function() {
            var maDate = new MaDate('2015-02-21T10:45:30Z');
            maDate.subtract(2, 'minute');
            expect(maDate.format()).toEqual('2015-02-21T10:43:30Z');

            maDate.subtract(44, 'minute');
            expect(maDate.format()).toEqual('2015-02-21T09:59:30Z');
        });

        // Hours.
        it('subtracts hours', function() {
            var maDate = new MaDate('2015-02-21T10:45:30Z');
            maDate.subtract(2, 'hour');
            expect(maDate.format()).toEqual('2015-02-21T08:45:30Z');

            maDate.subtract(9, 'hour');
            expect(maDate.format()).toEqual('2015-02-20T23:45:30Z');
        });

        // Days.
        it('subtracts days', function() {
            var maDate = new MaDate('2015-02-21T10:45:30Z');
            maDate.subtract(2, 'day');
            expect(maDate.format()).toEqual('2015-02-19T10:45:30Z');

            maDate.subtract(19, 'day');
            expect(maDate.format()).toEqual('2015-01-31T10:45:30Z');
        });

        // Months.
        it('subtracts months', function() {
            var maDate = new MaDate('2015-02-21T10:45:30Z');
            maDate.subtract(1, 'month');
            expect(maDate.format()).toEqual('2015-01-21T10:45:30Z');

            maDate.subtract(1, 'month');
            expect(maDate.format()).toEqual('2014-12-21T10:45:30Z');
        });

        // Years.
        it('subtracts years', function() {
            var maDate = new MaDate('2015-02-21T10:45:30Z');
            maDate.subtract(2, 'year');
            expect(maDate.format()).toEqual('2013-02-21T10:45:30Z');
        });
    });

    describe('second method', function() {
        it('returns seconds', function() {
            var maDate = new MaDate('2015-02-21T10:45:30Z');
            expect(maDate.second()).toEqual(30);
        });

        it('sets seconds', function() {
            var maDate = new MaDate('2015-02-21T10:45:30Z');
            maDate.second(10);
            expect(maDate.second()).toEqual(10);
            expect(maDate.minute()).toEqual(45);

            maDate.second(80);
            expect(maDate.second()).toEqual(20);
            expect(maDate.minute()).toEqual(46);
        });
    });

    describe('minute method', function() {
        it('returns minutes', function() {
            var maDate = new MaDate('2015-02-21T10:45:00Z');
            expect(maDate.minute()).toEqual(45);
        });

        it('sets minutes', function() {
            var maDate = new MaDate('2015-02-21T10:45:30Z');
            maDate.minute(10);
            expect(maDate.minute()).toEqual(10);

            maDate.minute(80);
            expect(maDate.minute()).toEqual(20);
            expect(maDate.hour()).toEqual(11);
        });
    });

    describe('hour method', function() {
        it('returns hours', function() {
            var maDate = new MaDate('2015-02-21T10:45:00Z');
            expect(maDate.hour()).toEqual(10);
        });

        it('sets hours', function() {
            var maDate = new MaDate('2015-02-21T10:45:30Z');
            maDate.hour(20);
            expect(maDate.hour()).toEqual(20);
        });
    });

    describe('toUtc method', function() {
        it('does nothing if offset iz zero', function() {
            var maDate = new MaDate('2015-02-21T20:45:00Z');
            maDate.toUtc();
            expect(maDate.offset()).toEqual(0);
            expect(maDate.format()).toEqual('2015-02-21T20:45:00Z');
        });

        it('transforms date to UTC', function() {
            var maDate = new MaDate('2015-02-21T20:45:00+04:00');
            maDate.toUtc();
            expect(maDate.offset()).toEqual(0);
            expect(maDate.format()).toEqual('2015-02-21T16:45:00Z');

            maDate = new MaDate('2015-02-21T20:45:00-04:00');
            maDate.toUtc();
            expect(maDate.offset()).toEqual(0);
            expect(maDate.format()).toEqual('2015-02-22T00:45:00Z');
        });
    });
});
