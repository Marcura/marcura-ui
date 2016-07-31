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
                displayFormat = (scope.displayFormat ? scope.displayFormat : 'dd MMM yyyy').replace(/Y/g, 'y').replace(/D/g, 'd'),
                format = (scope.format ? scope.format : 'dd MMM yyyy').replace(/Y/g, 'y').replace(/D/g, 'd'),
                dateElement = angular.element(element[0].querySelector('.ma-date-box-date')),
                resetValueElement = angular.element(element[0].querySelector('.ma-reset-value')),
                previousDate = null,
                time = {
                    hours: 0,
                    minutes: 0,
                    seconds: 0
                },
                timeZone = scope.timeZone ? scope.timeZone.replace(/GMT/g, '') : null,
                getNumbers = function(count) {
                    var numbers = [];

                    for (var i = 0; i <= count; i++) {
                        numbers.push((i < 10 ? '0' + i : i).toString());
                    }

                    return numbers;
                },
                onChange = function(internalDate) {
                    var date = null;

                    if (internalDate) {
                        date = moment(new Date());

                        date.year(internalDate.year())
                            .month(internalDate.month())
                            .date(internalDate.date())
                            .hours(time.hours)
                            .minutes(time.minutes)
                            .seconds(time.seconds);
                    }

                    scope.$apply(function() {
                        scope.date = getDateInType(date);
                        scope.change({
                            date: scope.date
                        });
                    });
                },
                getDateInType = function(date) {
                    if (!date) {
                        return null;
                    } else if (dateType === 'Moment') {
                        return date;
                    } else {
                        if (timeZone) {
                            return maDateConverter.format(date, format).replace(/Z/g, timeZone);
                        }

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
                    return maDateConverter.format(date, displayFormat);
                },
                parseDate = function(date) {
                    if (!date) {
                        return null;
                    }

                    var parsedDate = null;

                    if (scope.parser) {
                        parsedDate = scope.parser(date);
                    } else {
                        parsedDate = maDateConverter.parse(date, scope.culture);

                        if (!parsedDate) {
                            return null;
                        }

                        parsedDate = addTimeToDate(parsedDate);
                        parsedDate = maDateConverter.offsetUtc(parsedDate);
                    }

                    return parsedDate;
                },
                addTimeToDate = function(date) {
                    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.hours, time.minutes, time.seconds);
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
                        var date = addTimeToDate(picker.getDate());
                        date = maDateConverter.offsetUtc(date);

                        if (!hasDateChanged(date)) {
                            return;
                        }

                        previousDate = date;
                        onChange(date);
                    }
                });

                // Move id to input
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

            // Set initial date
            if (scope.date) {
                // Determine initial date type
                if (scope.date && scope.date.isValid && scope.date.isValid()) {
                    dateType = 'Moment';
                }

                var date = null;

                if (dateType === 'String') {
                    date = maDateConverter.parse(scope.date, scope.culture);
                }

                date = maDateConverter.offsetUtc(date);

                if (!date) {
                    return;
                }

                dateElement.val(formatDisplayDate(date));
                previousDate = date;
                time.hours = date.hours();
                time.minutes = date.minutes();
                time.seconds = date.seconds();

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
