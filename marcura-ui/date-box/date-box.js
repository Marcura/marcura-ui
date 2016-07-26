angular.module('marcuraUI.components').directive('maDateBox', ['$timeout', 'maDateConverter', 'maHelper', function($timeout, maDateConverter, maHelper) {
    return {
        restrict: 'E',
        scope: {
            id: '@',
            date: '=',
            timeZone: '=',
            culture: '=',
            isRequired: '=',
            change: '&',
            isResettable: '=',
            displayFormat: '=',
            format: '=',
            hasTime: '=',
            parser: '='
        },
        replace: true,
        template: function() {
            var html = '\
            <div class="ma-date-box" ng-class="{\
                    \'ma-date-box-has-time\': hasTime,\
                    \'has-error\': ((isRequired && isEmpty()) || isInvalid),\
                    \'ma-date-box-is-resettable\': isResettable,\
                }">\
                <div class="ma-date-box-wrapper">\
                    <input class="ma-date-box-date form-control input-sm" type="text" id="{{id}}"\
                        ng-required="isRequired"/>\
                    <i class="ma-date-box-icon fa fa-calendar"></i>\
                    <ma-reset-value ng-show="isResettable && date"></ma-reset-value>\
                </div><select ui-select2="{ minimumResultsForSearch: -1 }"\
                    class="ma-date-box-hours"\
                    ng-model="hours"\
                    ng-if="hasTime">\
                    <option ng-repeat="hour in hoursList" value="{{hour}}">{{hour}}</option>\
                </select><select ui-select2="{ minimumResultsForSearch: -1 }"\
                    class="ma-date-box-minutes"\
                    ng-model="minutes"\
                    ng-if="hasTime">\
                    <option ng-repeat="minute in minutesList" value="{{minute}}">{{minute}}</option>\
                </select>\
            </div>';

            return html;
        },
        link: function(scope, element) {
            var picker = null,
                dateType = 'String',
                displayFormat = scope.displayFormat ? scope.displayFormat : 'dd MMM yyyy',
                format = scope.format ? scope.format : 'dd MMM yyyy',
                dateElement = angular.element(element[0].querySelector('.ma-date-box-date')),
                resetValueElement = angular.element(element[0].querySelector('.ma-reset-value')),
                previousDate = null,
                getNumbers = function(count) {
                    var numbers = [];

                    for (var i = 0; i <= count; i++) {
                        numbers.push((i < 10 ? '0' + i : i).toString());
                    }

                    return numbers;
                },
                getTimeZoneDate = function(date) {
                    date = scope.timeZone ? moment(date).utcOffset(scope.timeZone) : moment(date);

                    if (!scope.hasTime) {
                        date = date.startOf('day');
                    }

                    return date.isValid() ? date : null;
                },
                onChange = function(internalDate) {
                    var date = null,
                        hours = scope.hours ? parseInt(scope.hours) : 0,
                        minutes = scope.minutes ? parseInt(scope.minutes) : 0;

                    if (internalDate) {
                        date = moment(new Date());

                        if (scope.timeZone) {
                            date = date.utcOffset(scope.timeZone);
                        }

                        date.year(internalDate.year())
                            .month(internalDate.month())
                            .date(internalDate.date())
                            .hour(hours)
                            .minutes(minutes)
                            .seconds(0);
                    }

                    scope.$apply(function() {
                        scope.date = getDateInType(date);
                        scope.change({
                            date: scope.date,
                            momentDate: date,
                            hours: hours,
                            minutes: minutes
                        });
                    });
                },
                getDateInType = function(date) {
                    if (!date) {
                        return null;
                    } else if (dateType === 'Date') {
                        return date.toDate();
                    } else if (dateType === 'Moment') {
                        return date;
                    } else {
                        return maDateConverter.format(date, format);
                    }
                },
                hasDateChanged = function(date) {
                    if ((previousDate === null && date === null) || (previousDate && date && previousDate.diff(date) === 0)) {
                        return false;
                    }

                    return true;
                },
                formatDisplayDate = function(date) {
                    if (!date) {
                        return '';
                    }

                    var formattedDate = maDateConverter.format(date, displayFormat);

                    // fall back to Moment
                    if (!formattedDate) {
                        formattedDate = date.format(displayFormat.replace(/y/g, 'Y').replace(/d/g, 'D'));
                    }

                    return formattedDate;
                },
                parseDate = function(date) {
                    var parsedDate = null;

                    if (!date) {
                        return null;
                    }

                    if (scope.parser) {
                        parsedDate = scope.parser(date);
                    } else {
                        parsedDate = maDateConverter.parse(date, scope.culture);

                        if (!parsedDate) {
                            // fall back to Moment
                            parsedDate = moment(date);
                        } else {
                            // create Moment from string, not from JavaScript Date, for the date to be a valid ISO date
                            parsedDate = moment(maDateConverter.format(parsedDate, 'yyyy-MM-ddT00:00:00Z'));
                        }

                        if (!isValidMomentDate(parsedDate)) {
                            return null;
                        }

                        parsedDate = getTimeZoneDate(parsedDate);
                    }

                    return parsedDate;
                },
                isValidMomentDate = function(date) {
                    return date && date._pf && date._pf.iso;
                };

            scope.hoursList = getNumbers(23);
            scope.minutesList = getNumbers(59);

            scope.isEmpty = function() {
                return dateElement.val() === '';
            };

            $timeout(function() {
                picker = new Pikaday({
                    field: angular.element(element[0].querySelector('.ma-date-box-icon'))[0],
                    position: 'bottom right',
                    minDate: null,
                    maxDate: null,
                    onSelect: function() {
                        var date = getTimeZoneDate(picker.getDate());

                        if (!hasDateChanged(date)) {
                            return;
                        }

                        previousDate = date;
                        onChange(date);
                    }
                });

                // move id to input
                element.removeAttr('id');
                dateElement.attr('id', scope.id);
            });

            resetValueElement.on('click', function() {
                previousDate = null;
                onChange();
            });

            dateElement.on('blur', function() {
                scope.isInvalid = false;
                var date = dateElement.val().trim(),
                    isEmptyDate = date === '',
                    isValidDate = true;
                date = parseDate(date);

                if (!hasDateChanged(date)) {
                    dateElement.val(formatDisplayDate(date));
                    scope.$apply(function() {
                        scope.isInvalid = false;
                    });

                    return;
                }

                if (date) {
                    dateElement.val(formatDisplayDate(date));
                    previousDate = date;
                }

                isValidDate = date !== null;

                if (!isEmptyDate && !isValidDate) {
                    scope.$apply(function() {
                        scope.isInvalid = true;
                    });

                    return;
                }

                if (date || isEmptyDate) {
                    scope.isInvalid = scope.isRequired && isEmptyDate && !isValidDate;
                    onChange(date);
                }
            });

            // set initial date
            if (scope.date) {
                // determine initial date type
                if (scope.date) {
                    if (maHelper.isDate(scope.date)) {
                        dateType = 'Date';
                    } else if (scope.date.isValid && scope.date.isValid()) {
                        dateType = 'Moment';
                    }
                }

                var date = getTimeZoneDate(scope.date);

                if (!date) {
                    return;
                }

                dateElement.val(formatDisplayDate(date));
                previousDate = date;

                if (scope.hasTime) {
                    scope.hours = date.format('HH');
                    scope.minutes = date.format('mm');
                }
            }

            scope.$watch('date', function(newDate, oldDate) {
                if (newDate === null && oldDate === null) {
                    return;
                }

                var date = parseDate(newDate);

                if (date === null) {
                    previousDate = null;
                    dateElement.val('');
                }

                if (!hasDateChanged(date)) {
                    dateElement.val(formatDisplayDate(date));
                    return;
                }

                dateElement.val(formatDisplayDate(date));
                previousDate = date;
            });

            // TODO: Fix time functionality
            // if (scope.hasTime) {
            //     scope.$watch('hours', function() {
            //         onChange();
            //     });
            //
            //     scope.$watch('minutes', function() {
            //         onChange();
            //     });
            // }
        }
    };
}]);
