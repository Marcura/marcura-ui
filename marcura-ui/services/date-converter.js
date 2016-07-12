angular.module('marcuraUI.services').factory('maDateConverter', maDateConverter);

function maDateConverter(maHelper) {
    var months = [{
            language: 'en',
            items: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        }],
        daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    var isMatch = function(date, substring) {
        return date.match(new RegExp(substring, 'i'));
    };

    var getTotalDate = function(day, month, year) {
        var finalMonth;

        // convert YY to YYYY according to rules
        if (year <= 99) {
            if (year >= 0 && year < 30) {
                year = '20' + year;
            } else {
                year = '19' + year;
            }
        }

        // detect leap year and change amount of days in daysPerMonth for February
        var isLeap = new Date(year, 1, 29).getMonth() === 1;

        if (isLeap) {
            daysPerMonth[1] = 29;
        } else {
            daysPerMonth[1] = 28;
        }

        // convert month to number
        if (month.match(/([^\u0000-\u0080]|[a-zA-Z])$/) !== null) {
            for (var j = 0; j < months.length; j++) {
                for (var i = 0; i < months[j].items.length; i++) {
                    if (isMatch(month, months[j].items[i].slice(0, 3))) {
                        finalMonth = i + 1;
                        break;
                    }
                }
            }

            if (!finalMonth) {
                return null;
            }

            month = finalMonth;
        }

        if (month > 12) {
            return null;
        }

        if (day > daysPerMonth[month - 1]) {
            return null;
        }

        return new Date(year, month - 1, day);
    };

    var parse = function(value, culture) {
        var year, month, day, splittedDate, pattern;

        if (value instanceof Date) {
            return value;
        }

        if (!angular.isString(value)) {
            return null;
        }

        // 21-02
        pattern = /^(\d{1,2})(\/|-|\.|\s|)(\d{1,2})$/;

        if (value.match(pattern) !== null) {
            var parts = pattern.exec(value);
            day = parts[1];
            month = parts[3];
            year = new Date().getFullYear();

            return getTotalDate(day, month, year);
        }

        // 21 Feb 15
        // 21 February 2015
        pattern = /^(\d{1,2})(\/|-|\.|\s|)([^\u0000-\u0080]|[a-zA-Z]{1,12})(\/|-|\.|\s|)(\d{2,4}\b)/;

        if (value.match(pattern) !== null) {
            var parts = pattern.exec(value);
            day = parts[1];
            month = parts[3];
            year = parts[5];

            return getTotalDate(day, month, year);
        }

        // Feb 21, 15
        // Feb 21, 2015
        if (value.match(/([^\u0000-\u0080]|[a-zA-Z]){3}(\s)\d{1,2}(,)(\s)\d{2,4}$/) !== null) {
            splittedDate = value.split(/[-.\/\s]/);
            month = splittedDate[0];
            day = splittedDate[1].substring(0, splittedDate[1].length - 1);
            year = splittedDate[2];

            return getTotalDate(day, month, year);
        }

        // 2015-02-21
        if (value.match(/^\d{4}(\/|-|\.)\d{1,2}(\/|-|\.)\d{1,2}$/) !== null) {
            splittedDate = value.split(/[-.\/]/);
            day = splittedDate[2];
            month = splittedDate[1];
            year = splittedDate[0];

            return getTotalDate(day, month, year);
        }

        // 21-02-15
        // 21-02-2015
        pattern = /^(\d{1,2})(\/|-|\.|\s|)(\d{1,2})(\/|-|\.|\s|)(\d{2,4})$/

        if (value.match(pattern) !== null) {
            var parts = pattern.exec(value);
            day = parts[1];
            month = parts[3];
            year = parts[5];

            // handle difference in en-GB and en-US formats
            if (culture === 'en-GB' && month > 12) {
                return null;
            }

            if (culture === 'en-US') {
                day = parts[3];
                month = parts[1];

                if (month > 12) {
                    return null;
                }
            }

            // give priority to en-GB if culture is not set
            if (!culture && month > 12) {
                day = parts[3];
                month = parts[1];
            }

            return getTotalDate(day, month, year);
        }

        // 2015-February-21
        if (value.match(/^\d{4}(\/|-|\.)([^\u0000-\u0080]|[a-zA-Z]){1,12}(\/|-|\.)\d{1,2}$/) !== null) {
            splittedDate = value.split(/[-.\/]/);
            day = splittedDate[2];
            month = splittedDate[1];
            year = splittedDate[0];

            return getTotalDate(day, month, year);
        }

        return null;
    };

    var format = function(date, format) {
        var languageIndex = 0;

        if (!maHelper.isDate(date)) {
            return null;
        }

        if (!angular.isString(format)) {
            return null;
        }

        // possible formats of date parts (day, month, year)
        var datePartFormats = {
            m: ['mm'],
            H: ['HH'],
            d: ['d', 'dd'],
            M: ['M', 'MM', 'MMM', 'MMMM'],
            y: ['yy', 'yyyy']
        };

        // checks format string parts on conformity with available date formats
        var checkDatePart = function(dateChar) {
            var datePart = '';

            // try-catch construction because some sub-formats may be not listed
            try {
                datePart = format.match(new RegExp(dateChar + '+', ''))[0];
            } catch (error) {}

            return datePartFormats[dateChar].indexOf(datePart);
        };

        var formatNumber = function(number, length) {
            var string = '';

            for (var i = 0; i < length; i++) {
                string += '0';
            }

            return (string + number).slice(-length);
        };

        // formats date parts
        var formatDatePart = function(datePartFormat) {
            var datePart = '';

            switch (datePartFormat) {
                case datePartFormats.d[0]:
                    // d
                    {
                        datePart = date.getDate();
                        break;
                    }
                case datePartFormats.d[1]:
                    // dd
                    {
                        datePart = formatNumber(date.getDate(), 2);
                        break;
                    }
                case datePartFormats.M[0]:
                    // M
                    {
                        datePart = date.getMonth() + 1;
                        break;
                    }
                case datePartFormats.M[1]:
                    // MM
                    {
                        datePart = formatNumber(date.getMonth() + 1, 2);
                        break;
                    }
                case datePartFormats.M[2]:
                    // MMM
                    {
                        datePart = months[languageIndex].items[date.getMonth()].substr(0, 3);
                        break;
                    }
                case datePartFormats.M[3]:
                    // MMMM
                    {
                        datePart = months[languageIndex].items[date.getMonth()];
                        break;
                    }
                case datePartFormats.y[0]:
                    // yy
                    {
                        datePart = formatNumber(date.getFullYear(), 2);
                        break;
                    }
                case datePartFormats.y[1]:
                    // yyyy
                    {
                        datePart = date.getFullYear();
                        break;
                    }
                case datePartFormats.H[0]:
                    // HH
                    {
                        datePart = formatNumber(date.getHours(), 2);
                        break;
                    }
                case datePartFormats.m[0]:
                    // mm
                    {
                        datePart = formatNumber(date.getMinutes(), 2);
                        break;
                    }
                default:
                    {
                        return '';
                    }
            }

            return datePart;
        };

        // check format of each part of the obtained format
        var dateParts = {
            days: formatDatePart(datePartFormats.d[checkDatePart('d')]),
            months: formatDatePart(datePartFormats.M[checkDatePart('M')]),
            years: formatDatePart(datePartFormats.y[checkDatePart('y')]),
            hours: formatDatePart(datePartFormats.H[checkDatePart('H')]),
            minutes: formatDatePart(datePartFormats.m[checkDatePart('m')]),
            separator: /^\w+([^\w])/.exec(format)
        };

        // return formatted date string
        return format
            .replace(/d+/, dateParts.days)
            .replace(/y+/, dateParts.years)
            .replace(/M+/, dateParts.months)
            .replace(/H+/, dateParts.hours)
            .replace(/m+/, dateParts.minutes);
    };

    return {
        parse: parse,
        format: format
    };
}
