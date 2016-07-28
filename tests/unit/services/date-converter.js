describe('maDateConverter', function() {
    var maDateConverter,
        currentDate = new Date(),
        currentYear = currentDate.getFullYear();

    beforeEach(module('marcuraUI.services'));
    beforeEach(inject(function(_maDateConverter_, $window) {
        maDateConverter = _maDateConverter_;
        window = $window;
        moment = $window.moment;
    }));

    describe('parse method', function() {
        it('parses date in dd format', function() {
            var currentMonth = maDateConverter.format(currentDate, 'MMM');
            expect(maDateConverter.parse('21').toString().slice(4, 15)).toEqual(currentMonth + ' 21 ' + currentYear);
        });

        it('parses date in d/M format', function() {
            expect(maDateConverter.parse('1 7').toString().slice(4, 15)).toEqual('Jul 01 ' + currentYear);
            expect(maDateConverter.parse('1/7').toString().slice(4, 15)).toEqual('Jul 01 ' + currentYear);
            expect(maDateConverter.parse('1.7').toString().slice(4, 15)).toEqual('Jul 01 ' + currentYear);
            expect(maDateConverter.parse('1-7').toString().slice(4, 15)).toEqual('Jul 01 ' + currentYear);

            // en-GB
            expect(maDateConverter.parse('1 7', 'en-GB').toString().slice(4, 15)).toEqual('Jul 01 ' + currentYear);
            expect(maDateConverter.parse('7 1', 'en-GB').toString().slice(4, 15)).toEqual('Jan 07 ' + currentYear);
            expect(maDateConverter.parse('21 1', 'en-GB').toString().slice(4, 15)).toEqual('Jan 21 ' + currentYear);
            expect(maDateConverter.parse('1 13', 'en-GB')).toEqual(null);

            // en-US
            expect(maDateConverter.parse('1 7', 'en-US').toString().slice(4, 15)).toEqual('Jan 07 ' + currentYear);
            expect(maDateConverter.parse('7 1', 'en-US').toString().slice(4, 15)).toEqual('Jul 01 ' + currentYear);
            expect(maDateConverter.parse('7 21', 'en-US').toString().slice(4, 15)).toEqual('Jul 21 ' + currentYear);
            expect(maDateConverter.parse('13 1', 'en-US')).toEqual(null);
        });

        it('parses date in d/M/yy format', function() {
            expect(maDateConverter.parse('1 7 87').toString().slice(4, 15)).toEqual('Jul 01 1987');
            expect(maDateConverter.parse('1/7/87').toString().slice(4, 15)).toEqual('Jul 01 1987');
            expect(maDateConverter.parse('1/7/15').toString().slice(4, 15)).toEqual('Jul 01 2015');
            expect(maDateConverter.parse('1-7-87').toString().slice(4, 15)).toEqual('Jul 01 1987');
            expect(maDateConverter.parse('1.7.87').toString().slice(4, 15)).toEqual('Jul 01 1987');
        });

        it('parses date in d/MM/yy format', function() {
            expect(maDateConverter.parse('1 07 87').toString().slice(4, 15)).toEqual('Jul 01 1987');
            expect(maDateConverter.parse('1/07/87').toString().slice(4, 15)).toEqual('Jul 01 1987');
            expect(maDateConverter.parse('1-07-87').toString().slice(4, 15)).toEqual('Jul 01 1987');
            expect(maDateConverter.parse('1.07.87').toString().slice(4, 15)).toEqual('Jul 01 1987');
        });

        it('parses date in dd/MM format', function() {
            expect(maDateConverter.parse('2102').toString().slice(4, 15)).toEqual('Feb 21 ' + currentYear);
            expect(maDateConverter.parse('21 02').toString().slice(4, 15)).toEqual('Feb 21 ' + currentYear);
            expect(maDateConverter.parse('21-02').toString().slice(4, 15)).toEqual('Feb 21 ' + currentYear);
            expect(maDateConverter.parse('21/02').toString().slice(4, 15)).toEqual('Feb 21 ' + currentYear);
            expect(maDateConverter.parse('21.02').toString().slice(4, 15)).toEqual('Feb 21 ' + currentYear);

            // en-GB
            expect(maDateConverter.parse('1002', 'en-GB').toString().slice(4, 15)).toEqual('Feb 10 ' + currentYear);
            expect(maDateConverter.parse('0210', 'en-GB').toString().slice(4, 15)).toEqual('Oct 02 ' + currentYear);
            expect(maDateConverter.parse('1022', 'en-GB')).toEqual(null);

            // en-US
            expect(maDateConverter.parse('1002', 'en-US').toString().slice(4, 15)).toEqual('Oct 02 ' + currentYear);
            expect(maDateConverter.parse('0210', 'en-US').toString().slice(4, 15)).toEqual('Feb 10 ' + currentYear);
            expect(maDateConverter.parse('2210', 'en-US')).toEqual(null);
        });

        it('parses date in dd/M/yy format', function() {
            expect(maDateConverter.parse('01 7 87').toString().slice(4, 15)).toEqual('Jul 01 1987');
            expect(maDateConverter.parse('01/7/87').toString().slice(4, 15)).toEqual('Jul 01 1987');
            expect(maDateConverter.parse('01-7-87').toString().slice(4, 15)).toEqual('Jul 01 1987');
            expect(maDateConverter.parse('01.7.87').toString().slice(4, 15)).toEqual('Jul 01 1987');
        });

        it('parses date in dd/M/yyyy format', function() {
            expect(maDateConverter.parse('21 2 2015').toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(maDateConverter.parse('21/2/2015').toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(maDateConverter.parse('21-2-2015').toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(maDateConverter.parse('21.2.2015').toString().slice(4, 15)).toEqual('Feb 21 2015');
        });

        it('parses date in dd/MM/yy format', function() {
            expect(maDateConverter.parse('010787').toString().slice(4, 15)).toEqual('Jul 01 1987');
            expect(maDateConverter.parse('01 07 87').toString().slice(4, 15)).toEqual('Jul 01 1987');
            expect(maDateConverter.parse('01/07/87').toString().slice(4, 15)).toEqual('Jul 01 1987');
            expect(maDateConverter.parse('01-07-87').toString().slice(4, 15)).toEqual('Jul 01 1987');
            expect(maDateConverter.parse('01.07.87').toString().slice(4, 15)).toEqual('Jul 01 1987');

            // en-GB
            expect(maDateConverter.parse('010787', 'en-GB').toString().slice(4, 15)).toEqual('Jul 01 1987');
            expect(maDateConverter.parse('070187', 'en-GB').toString().slice(4, 15)).toEqual('Jan 07 1987');
            expect(maDateConverter.parse('011387', 'en-GB')).toEqual(null);

            // en-US
            expect(maDateConverter.parse('010787', 'en-US').toString().slice(4, 15)).toEqual('Jan 07 1987');
            expect(maDateConverter.parse('070187', 'en-US').toString().slice(4, 15)).toEqual('Jul 01 1987');
            expect(maDateConverter.parse('130187', 'en-US')).toEqual(null);
        });

        it('parses date in dd/MM/yyyy format', function() {
            expect(maDateConverter.parse('01071987').toString().slice(4, 15)).toEqual('Jul 01 1987');
            expect(maDateConverter.parse('01 07 1987').toString().slice(4, 15)).toEqual('Jul 01 1987');
            expect(maDateConverter.parse('01/07/1987').toString().slice(4, 15)).toEqual('Jul 01 1987');
            expect(maDateConverter.parse('01-07-1987').toString().slice(4, 15)).toEqual('Jul 01 1987');
            expect(maDateConverter.parse('01.07.1987').toString().slice(4, 15)).toEqual('Jul 01 1987');
        });

        it('parses date in dd/MMM/yy format', function() {
            expect(maDateConverter.parse('21Feb15').toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(maDateConverter.parse('21 Feb 15').toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(maDateConverter.parse('21/Feb/15').toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(maDateConverter.parse('21-Feb-15').toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(maDateConverter.parse('21.Feb.15').toString().slice(4, 15)).toEqual('Feb 21 2015');
        });

        it('parses date in dd/MMM/yyyy format', function() {
            expect(maDateConverter.parse('21Feb2015').toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(maDateConverter.parse('21 Feb 2015').toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(maDateConverter.parse('21/Feb/2015').toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(maDateConverter.parse('21-Feb-2015').toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(maDateConverter.parse('21.Feb.2015').toString().slice(4, 15)).toEqual('Feb 21 2015');
        });

        it('parses date in dd/MMMM/yy format', function() {
            expect(maDateConverter.parse('21February15').toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(maDateConverter.parse('21 February 15').toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(maDateConverter.parse('21/February/15').toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(maDateConverter.parse('21-February-15').toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(maDateConverter.parse('21.February.15').toString().slice(4, 15)).toEqual('Feb 21 2015');
        });

        it('parses date in dd/MMMM/yyyy format', function() {
            expect(maDateConverter.parse('21February2015').toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(maDateConverter.parse('21 February 2015').toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(maDateConverter.parse('21/February/2015').toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(maDateConverter.parse('21-February-2015').toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(maDateConverter.parse('21.February.2015').toString().slice(4, 15)).toEqual('Feb 21 2015');
        });

        it('parses date in MMM/dd/yy format', function() {
            expect(maDateConverter.parse('Feb2115').toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(maDateConverter.parse('Feb 21 15').toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(maDateConverter.parse('Feb/21/15').toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(maDateConverter.parse('Feb-21-15').toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(maDateConverter.parse('Feb.21.15').toString().slice(4, 15)).toEqual('Feb 21 2015');
        });

        it('parses date in MMM/dd/yyyy format', function() {
            expect(maDateConverter.parse('Feb212015').toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(maDateConverter.parse('Feb 21 2015').toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(maDateConverter.parse('Feb-21-2015').toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(maDateConverter.parse('Feb/21/2015').toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(maDateConverter.parse('Feb.21.2015').toString().slice(4, 15)).toEqual('Feb 21 2015');
        });

        it('parses date in yyyy/M/dd format', function() {
            expect(maDateConverter.parse('2015/2/21').toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(maDateConverter.parse('2015-2-21').toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(maDateConverter.parse('2015-2-9').toString().slice(4, 15)).toEqual('Feb 09 2015');
            expect(maDateConverter.parse('2015.2.21').toString().slice(4, 15)).toEqual('Feb 21 2015');
        });

        it('parses date in yyyy/MM/dd format', function() {
            expect(maDateConverter.parse('2015 02 21').toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(maDateConverter.parse('2015/02/21').toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(maDateConverter.parse('2015-02-21').toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(maDateConverter.parse('2015.02.21').toString().slice(4, 15)).toEqual('Feb 21 2015');
        });

        it('parses date in yyyy/MMMM/dd format', function() {
            expect(maDateConverter.parse('2015February21').toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(maDateConverter.parse('2015 February 21').toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(maDateConverter.parse('2015/February/21').toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(maDateConverter.parse('2015-February-21').toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(maDateConverter.parse('2015.February.21').toString().slice(4, 15)).toEqual('Feb 21 2015');
        });

        it('parses date with time zone', function() {
            expect(maDateConverter.parse('2015-02-21T10:00:00Z').toString().slice(4, 24)).toEqual('Feb 21 2015 10:00:00');
        });

        it('supports specific en-GB formats', function() {
            expect(maDateConverter.parse('Feb 21, 15').toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(maDateConverter.parse('Feb21,15').toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(maDateConverter.parse('Feb 21, 2015').toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(maDateConverter.parse('Feb21,2015').toString().slice(4, 15)).toEqual('Feb 21 2015');
        });

        it('returns null if it can not parse date', function() {
            expect(maDateConverter.parse('Incorrect date')).toEqual(null);
            expect(maDateConverter.parse(null)).toEqual(null);
            expect(maDateConverter.parse(true)).toEqual(null);
            expect(maDateConverter.parse(false)).toEqual(null);
            expect(maDateConverter.parse(undefined)).toEqual(null);
            expect(maDateConverter.parse(1999)).toEqual(null);
            expect(maDateConverter.parse('29/29/1999')).toEqual(null);
            expect(maDateConverter.parse('12/33/1999')).toEqual(null);
            expect(maDateConverter.parse('42/11/1999')).toEqual(null);
            expect(maDateConverter.parse('data/11.1999')).toEqual(null);
            expect(maDateConverter.parse('99 Feburrr 12')).toEqual(null);
            expect(maDateConverter.parse('11 month 2000')).toEqual(null);
        });

        it('parses leap years', function() {
            expect(maDateConverter.parse('29 Feb 2015')).toEqual(null);
            expect(maDateConverter.parse('28 Feb 2015').toString().slice(4, 15)).toEqual('Feb 28 2015');
            expect(maDateConverter.parse('29 Feb 2012').toString().slice(4, 15)).toEqual('Feb 29 2012');
            expect(maDateConverter.parse('28 Feb 2012').toString().slice(4, 15)).toEqual('Feb 28 2012');
        });
    });

    describe('format method', function() {
        it('returns an null if it can not the date', function() {
            expect(maDateConverter.format(new Date(2015, 1, 21), null)).toEqual(null);
            expect(maDateConverter.format(new Date(2015, 1, 21), true)).toEqual(null);
            expect(maDateConverter.format(new Date(2015, 1, 21), false)).toEqual(null);
            expect(maDateConverter.format(new Date(2015, 1, 21), undefined)).toEqual(null);
        });

        it('supports day format', function() {
            expect(maDateConverter.format(new Date(2015, 1, 7), 'yyyy-MM-d')).toEqual('2015-02-7');
            expect(maDateConverter.format(new Date(2015, 1, 7), 'yyyy-MM-dd')).toEqual('2015-02-07');
        });

        it('supports month format', function() {
            expect(maDateConverter.format(new Date(2015, 1, 7), 'yyyy-M-dd')).toEqual('2015-2-07');
            expect(maDateConverter.format(new Date(2015, 1, 7), 'yyyy-MM-dd')).toEqual('2015-02-07');
            expect(maDateConverter.format(new Date(2015, 1, 7), 'yyyy-MMM-dd')).toEqual('2015-Feb-07');
            expect(maDateConverter.format(new Date(2015, 1, 7), 'yyyy-MMMM-dd')).toEqual('2015-February-07');
        });

        it('supports year format', function() {
            expect(maDateConverter.format(new Date(2015, 1, 7), 'yy-M-dd')).toEqual('15-2-07');
            expect(maDateConverter.format(new Date(2015, 1, 7), 'yyyy-M-dd')).toEqual('2015-2-07');
        });

        it('supports hours, minutes and seconds formats', function() {
            expect(maDateConverter.format(new Date(2015, 1, 7, 12, 0, 42), 'HH:mm:ss')).toEqual('12:00:42');
            expect(maDateConverter.format(new Date(2015, 1, 7, 12, 0, 7), 'yy-M-dd HH.mm.ss')).toEqual('15-2-07 12.00.07');
        });

        it('supports different cultures', function() {
            expect(maDateConverter.format(new Date(2015, 1, 7, 12, 0), 'yy-MMM-dd', 'en-US')).toEqual('15-Feb-07');
            expect(maDateConverter.format(new Date(2015, 1, 7, 12, 0), 'yy-MMM-dd', 'en-GB')).toEqual('15-Feb-07');
            expect(maDateConverter.format(new Date(2015, 1, 7, 12, 0), 'yy-MMMM-dd', 'en-US')).toEqual('15-February-07');
            expect(maDateConverter.format(new Date(2015, 1, 7, 12, 0), 'yy-MMMM-dd', 'en-GB')).toEqual('15-February-07');
        });

        it('supports Moment.js', function() {
            expect(maDateConverter.format(moment([2015, 1, 7, 12, 0, 7]), 'yy-M-dd HH.mm.ss')).toEqual('15-2-07 12.00.07');
        });
    });

    describe('offset method', function() {
        it('offsets the date to UTC date', function() {
            expect(maDateConverter.offset('2016-07-25T10:00:00Z').toString().slice(4, 24)).toEqual('Jul 25 2016 10:00:00');
            expect(maDateConverter.offset(new Date(2016, 6, 25, 10, 0, 0)).toString().slice(4, 24)).toEqual('Jul 25 2016 10:00:00');
            expect(maDateConverter.offset(moment([2016, 6, 25, 10, 0, 0])).toString().slice(4, 24)).toEqual('Jul 25 2016 10:00:00');
        });

        // it('offsets the date to a date in a specified time zone', function() {
        //     expect(maDateConverter.offset('2016-07-25T10:00:00Z', 'GMT-10:00').toString().slice(4, 24)).toEqual('Jul 25 2016 00:00:00');
        //     // expect(maDateConverter.offset(new Date(2016, 6, 25, 10, 0, 0), 'GMT-10:00').toString().slice(4, 24)).toEqual('Jul 25 2016 00:00:00');
        //     // expect(maDateConverter.offset(moment([2016, 6, 25, 10, 0, 0]), 'GMT-10:00').toString().slice(4, 24)).toEqual('Jul 25 2016 00:00:00');
        //
        //     expect(maDateConverter.offset('2016-07-25T06:00:00Z', 'GMT-10:00').toString().slice(4, 24)).toEqual('Jul 24 2016 20:00:00');
        //     // expect(maDateConverter.offset(new Date(2016, 6, 25, 6, 0, 0), 'GMT-10:00').toString().slice(4, 24)).toEqual('Jul 24 2016 20:00:00');
        //     // expect(maDateConverter.offset(moment([2016, 6, 25, 6, 0, 0]), 'GMT-10:00').toString().slice(4, 24)).toEqual('Jul 24 2016 20:00:00');
        //
        //     expect(maDateConverter.offset('2016-07-25T10:00:00Z', 'GMT+10:00').toString().slice(4, 24)).toEqual('Jul 25 2016 20:00:00');
        //     // expect(maDateConverter.offset(new Date(2016, 6, 25, 10, 0, 0), 'GMT+10:00').toString().slice(4, 24)).toEqual('Jul 25 2016 20:00:00');
        //     // expect(maDateConverter.offset(moment([2016, 6, 25, 10, 0, 0]), 'GMT+10:00').toString().slice(4, 24)).toEqual('Jul 25 2016 20:00:00');
        //
        //     expect(maDateConverter.offset('2016-07-25T20:00:00Z', 'GMT+10:00').toString().slice(4, 24)).toEqual('Jul 26 2016 06:00:00');
        //     // expect(maDateConverter.offset(new Date(2016, 6, 25, 20, 0, 0), 'GMT+10:00').toString().slice(4, 24)).toEqual('Jul 26 2016 06:00:00');
        //     // expect(maDateConverter.offset(moment([2016, 6, 25, 20, 0, 0]), 'GMT+10:00').toString().slice(4, 24)).toEqual('Jul 26 2016 06:00:00');
        // });
    });
});
