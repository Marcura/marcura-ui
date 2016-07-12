describe('maDateConverter', function() {
    var maDateConverter,
        currentYear = new Date().getFullYear();

    beforeEach(module('marcuraUI.services'));
    beforeEach(inject(function(_maDateConverter_) {
        maDateConverter = _maDateConverter_;
    }));

    describe('parse method', function() {
        it('parses date in d/M/yy format', function() {
            expect(maDateConverter.parse('1/7/87').toString().slice(4, 15)).toEqual('Jul 01 1987');
            expect(maDateConverter.parse('1/7/15').toString().slice(4, 15)).toEqual('Jul 01 2015');
            expect(maDateConverter.parse('1.7.87').toString().slice(4, 15)).toEqual('Jul 01 1987');
            expect(maDateConverter.parse('1-7-87').toString().slice(4, 15)).toEqual('Jul 01 1987');
        });

        it('parses date in dd/M/yy format', function() {
            expect(maDateConverter.parse('01/7/87').toString().slice(4, 15)).toEqual('Jul 01 1987');
            expect(maDateConverter.parse('01-7-87').toString().slice(4, 15)).toEqual('Jul 01 1987');
            expect(maDateConverter.parse('01.7.87').toString().slice(4, 15)).toEqual('Jul 01 1987');
        });

        it('parses date in d/MM/yy format', function() {
            expect(maDateConverter.parse('1/07/87').toString().slice(4, 15)).toEqual('Jul 01 1987');
            expect(maDateConverter.parse('1-07-87').toString().slice(4, 15)).toEqual('Jul 01 1987');
            expect(maDateConverter.parse('1.07.87').toString().slice(4, 15)).toEqual('Jul 01 1987');
        });

        it('parses date in dd/MM/yy format', function() {
            expect(maDateConverter.parse('010787').toString().slice(4, 15)).toEqual('Jul 01 1987');
            expect(maDateConverter.parse('01/07/87').toString().slice(4, 15)).toEqual('Jul 01 1987');
            expect(maDateConverter.parse('01-07-87').toString().slice(4, 15)).toEqual('Jul 01 1987');
            expect(maDateConverter.parse('01.07.87').toString().slice(4, 15)).toEqual('Jul 01 1987');
        });

        it('parses date in d/M format', function() {
            expect(maDateConverter.parse('1/7').toString().slice(4, 15)).toEqual('Jul 01 ' + currentYear);
            expect(maDateConverter.parse('1.7').toString().slice(4, 15)).toEqual('Jul 01 ' + currentYear);
            expect(maDateConverter.parse('1-7').toString().slice(4, 15)).toEqual('Jul 01 ' + currentYear);
        });

        it('parses date in dd/MM/yyyy format', function() {
            expect(maDateConverter.parse('21022015').toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(maDateConverter.parse('21/02/2015').toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(maDateConverter.parse('11.02.2015').toString().slice(4, 15)).toEqual('Feb 11 2015');
            expect(maDateConverter.parse('11-02-2015').toString().slice(4, 15)).toEqual('Feb 11 2015');

            // en-US
            expect(maDateConverter.parse('02212015').toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(maDateConverter.parse('02/21/2015').toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(maDateConverter.parse('02/21/2015').toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(maDateConverter.parse('02-21-2015').toString().slice(4, 15)).toEqual('Feb 21 2015');
        });

        it('parses date in dd/M/yyyy format', function() {
            expect(maDateConverter.parse('21/2/2015').toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(maDateConverter.parse('21.2.2015').toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(maDateConverter.parse('21-2-2015').toString().slice(4, 15)).toEqual('Feb 21 2015');
        });

        it('parses date in dd/MMMM/yy format', function() {
            expect(maDateConverter.parse('21February15').toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(maDateConverter.parse('21 February 15').toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(maDateConverter.parse('21-February-15').toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(maDateConverter.parse('21/February/15').toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(maDateConverter.parse('21.February.15').toString().slice(4, 15)).toEqual('Feb 21 2015');
        });

        it('parses date in dd/MMMM/yyyy format', function() {
            expect(maDateConverter.parse('21February2015').toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(maDateConverter.parse('21 February 2015').toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(maDateConverter.parse('21-February-2015').toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(maDateConverter.parse('21/February/2015').toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(maDateConverter.parse('21.February.2015').toString().slice(4, 15)).toEqual('Feb 21 2015');
        });

        it('parses date in dd/MMM/yyyy format', function() {
            // en-GB
            expect(maDateConverter.parse('Feb 21, 2015').toString().slice(4, 15)).toEqual('Feb 21 2015');

            // en-US
            expect(maDateConverter.parse('21Feb2015').toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(maDateConverter.parse('21 Feb 2015').toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(maDateConverter.parse('21-Feb-2015').toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(maDateConverter.parse('21/Feb/2015').toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(maDateConverter.parse('21.Feb.2015').toString().slice(4, 15)).toEqual('Feb 21 2015');
        });

        it('parses date in dd/MMM/yy format', function() {
            // en-GB
            expect(maDateConverter.parse('Feb 21, 15').toString().slice(4, 15)).toEqual('Feb 21 2015');

            // en-US
            expect(maDateConverter.parse('21Feb15').toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(maDateConverter.parse('21 Feb 15').toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(maDateConverter.parse('21-Feb-15').toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(maDateConverter.parse('21/Feb/15').toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(maDateConverter.parse('21.Feb.15').toString().slice(4, 15)).toEqual('Feb 21 2015');
        });

        // 21-02
        it('parses date in dd/MM format', function() {
            expect(maDateConverter.parse('2102').toString().slice(4, 15)).toEqual('Feb 21 ' + currentYear);
            expect(maDateConverter.parse('21 02').toString().slice(4, 15)).toEqual('Feb 21 ' + currentYear);
            expect(maDateConverter.parse('21-02').toString().slice(4, 15)).toEqual('Feb 21 ' + currentYear);
            expect(maDateConverter.parse('21/02').toString().slice(4, 15)).toEqual('Feb 21 ' + currentYear);
            expect(maDateConverter.parse('21.02').toString().slice(4, 15)).toEqual('Feb 21 ' + currentYear);
        });

        it('parses date in yyyy/MM/dd format', function() {
            expect(maDateConverter.parse('2015/02/21').toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(maDateConverter.parse('2015-02-21').toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(maDateConverter.parse('2015.02.21').toString().slice(4, 15)).toEqual('Feb 21 2015');
        });

        it('parses date in yyyy/M/dd format', function() {
            expect(maDateConverter.parse('2015-2-21').toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(maDateConverter.parse('2015-2-9').toString().slice(4, 15)).toEqual('Feb 09 2015');
            expect(maDateConverter.parse('2015/2/21').toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(maDateConverter.parse('2015.2.21').toString().slice(4, 15)).toEqual('Feb 21 2015');
        });

        it('parses date in yyyy-MMMM-dd format', function() {
            expect(maDateConverter.parse('2015-February-21').toString().slice(4, 15)).toEqual('Feb 21 2015');
        });

        it('parses dates where day is more than 12', function() {
            expect(maDateConverter.parse('11/22/2015').toString().slice(4, 15)).toEqual('Nov 22 2015');
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

        it('supports culture', function() {
            // give priority to en-GB if ulture is not set
            expect(maDateConverter.parse('21/02/2015').toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(maDateConverter.parse('02/21/2015').toString().slice(4, 15)).toEqual('Feb 21 2015');

            // en-GB
            expect(maDateConverter.parse('21/02/2015', 'en-GB').toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(maDateConverter.parse('02/21/2015', 'en-GB')).toEqual(null);

            // en-US
            expect(maDateConverter.parse('02/21/2015', 'en-US').toString().slice(4, 15)).toEqual('Feb 21 2015');
            expect(maDateConverter.parse('21/02/2015', 'en-US')).toEqual(null);
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

        it('supports hours and minutes formats', function() {
            expect(maDateConverter.format(new Date(2015, 1, 7, 12, 0), 'HH:mm')).toEqual('12:00');
            expect(maDateConverter.format(new Date(2015, 1, 7, 12, 0), 'yy-M-dd HH.mm')).toEqual('15-2-07 12.00');
        });

        it('supports different cultures', function() {
            expect(maDateConverter.format(new Date(2015, 1, 7, 12, 0), 'yy-MMM-dd', 'en-US')).toEqual('15-Feb-07');
            expect(maDateConverter.format(new Date(2015, 1, 7, 12, 0), 'yy-MMM-dd', 'en-GB')).toEqual('15-Feb-07');
            expect(maDateConverter.format(new Date(2015, 1, 7, 12, 0), 'yy-MMMM-dd', 'en-US')).toEqual('15-February-07');
            expect(maDateConverter.format(new Date(2015, 1, 7, 12, 0), 'yy-MMMM-dd', 'en-GB')).toEqual('15-February-07');
        });
    });
});
