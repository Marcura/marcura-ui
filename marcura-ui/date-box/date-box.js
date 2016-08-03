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
                    \'ma-date-box-is-invalid\': ((isRequired && isEmpty()) || isInvalid),\
                    \'ma-date-box-is-resettable\': _isResettable,\
                    \'ma-date-box-is-focused\': isFocused\
                }">\
                <input class="ma-date-box-date" type="text" id="{{id}}"\
                    ng-required="isRequired"\
                    ng-focus="onFocus()"\
                    ng-blur="onBlur()"/><input class="ma-date-box-hours" type="text"\
                        maxlength="2"\
                        ng-show="hasTime"\
                        ng-blur="onBlur()"\
                        ng-keydown="timeKeydown($event)"\
                        /><div class="ma-date-box-colon" ng-if="hasTime">:</div><input \
                        class="ma-date-box-minutes" type="text"\
                        maxlength="2"\
                        ng-show="hasTime"\
                        ng-blur="onBlur()"\
                        ng-keydown="timeKeydown($event)"/>\
                <i class="ma-date-box-icon fa fa-calendar"></i>\
                <ma-reset-value\
                    ng-show="_isResettable && date"\
                    ng-click="onReset()">\
                </ma-reset-value>\
            </div>';

            return html;
        },
        link: function(scope, element) {
            var picker = null,
                dateType = 'String',
                displayFormat = (scope.displayFormat ? scope.displayFormat : 'dd MMM yyyy').replace(/Y/g, 'y').replace(/D/g, 'd'),
                format = (scope.format ? scope.format : 'dd MMM yyyy').replace(/Y/g, 'y').replace(/D/g, 'd'),
                dateElement = angular.element(element[0].querySelector('.ma-date-box-date')),
                hoursElement = angular.element(element[0].querySelector('.ma-date-box-hours')),
                minutesElement = angular.element(element[0].querySelector('.ma-date-box-minutes')),
                previousDate = null,
                timeZone = scope.timeZone ? scope.timeZone.replace(/GMT/g, '') : 'Z',
                timeZoneOffset = moment().utcOffset(timeZone).utcOffset(),
                onChange = function(internalDate) {
                    var date = null;

                    if (internalDate) {
                        date = moment(new Date());

                        date.year(internalDate.year())
                            .month(internalDate.month())
                            .date(internalDate.date())
                            .hours(internalDate.hours())
                            .minutes(internalDate.minutes())
                            .seconds(0);
                    }

                    scope.date = getDateInType(date);
                    scope.change({
                        date: scope.date
                    });
                },
                getDateInType = function(date) {
                    if (!date) {
                        return null;
                    } else if (dateType === 'Moment') {
                        return date;
                    } else {
                        return maDateConverter.format(date, format, timeZone);
                    }
                },
                hasDateChanged = function(date) {
                    if ((previousDate === null && date === null) || (previousDate && date && previousDate.diff(date) === 0)) {
                        return false;
                    }

                    return true;
                },
                formatDisplayDate = function(date) {
                    return maDateConverter.format(maDateConverter.offsetUtc(date, timeZoneOffset), displayFormat);
                },
                setDisplayDate = function(date) {
                    dateElement.val(date ? formatDisplayDate(date) : '');
                    setCalendarDate(date);

                    if (scope.hasTime) {
                        hoursElement.val(date ? maDateConverter.format(date, 'HH') : '00');
                        minutesElement.val(date ? maDateConverter.format(date, 'mm') : '00');
                    }
                },
                setCalendarDate = function(date) {
                    if (picker) {
                        picker.setDate(date ? date.toDate() : null);
                    }
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

                        parsedDate = maDateConverter.offsetUtc(parsedDate);
                    }

                    return parsedDate;
                },
                addTimeToDate = function(date) {
                    return moment([date.year(), date.month(), date.date(), Number(hoursElement.val()), Number(minutesElement.val()), 0]);
                };

            scope._isResettable = scope.isResettable === false ? false : true;
            scope.isFocused = false;

            scope.isEmpty = function() {
                return dateElement.val() === '';
            };

            scope.onFocus = function() {
                scope.isFocused = true;
            };

            scope.onBlur = function() {
                scope.isFocused = false;
                scope.isInvalid = false;
                var date = dateElement.val().trim(),
                    isEmptyDate = date === '',
                    isValidDate = true;
                date = parseDate(date);

                if (scope.hasTime) {
                    date = addTimeToDate(date);
                }

                if (!hasDateChanged(date)) {
                    setDisplayDate(date);
                    scope.isInvalid = false;

                    return;
                }

                if (date) {
                    setDisplayDate(date);
                    previousDate = date;
                }

                isValidDate = date !== null;

                if (!isEmptyDate && !isValidDate) {
                    scope.isInvalid = true;

                    return;
                }

                if (date || isEmptyDate) {
                    scope.isInvalid = scope.isRequired && isEmptyDate && !isValidDate;
                    onChange(date);
                }
            };

            scope.timeKeydown = function(event) {
                if (
                    // Allow backspace, tab, delete
                    $.inArray(event.keyCode, [maHelper.keyCode.backspace, maHelper.keyCode.tab, maHelper.keyCode.delete]) !== -1 ||
                    // Allow left, right
                    (event.keyCode === 37 || event.keyCode === 39)) {
                    return;
                }

                // Ensure that it is a number and stop the keypress
                if ((event.shiftKey || (event.keyCode < 48 || event.keyCode > 57)) && (event.keyCode < 96 || event.keyCode > 105)) {
                    event.preventDefault();
                }
            };

            scope.onReset = function() {
                previousDate = null;
                onChange();
            };

            $timeout(function() {
                var isFirstDateSelection = true;

                picker = new Pikaday({
                    field: angular.element(element[0].querySelector('.ma-date-box-icon'))[0],
                    position: 'bottom right',
                    onSelect: function() {
                        // This is to prevent the event from firing when the date
                        // is set for the first time with setCalendarDate method
                        if (isFirstDateSelection) {
                            isFirstDateSelection = false;
                            return;
                        }

                        date = maDateConverter.offsetUtc(picker.getDate());

                        if (scope.hasTime) {
                            date = addTimeToDate(date);
                        }

                        if (!hasDateChanged(date)) {
                            return;
                        }

                        previousDate = date;

                        // Use $timeout to apply scope changes instead of $apply,
                        // which throws digest error at this point
                        $timeout(function() {
                            onChange(date);
                        });
                    }
                });

                setCalendarDate(previousDate);

                // Move id to input
                element.removeAttr('id');
                dateElement.attr('id', scope.id);
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

                setDisplayDate(date);
                previousDate = date;
            }

            scope.$watch('date', function(newDate, oldDate) {
                if (newDate === null && oldDate === null) {
                    return;
                }

                var date = parseDate(newDate);

                if (date === null) {
                    previousDate = null;
                    setDisplayDate(null);
                }

                if (!hasDateChanged(date)) {
                    setDisplayDate(date);
                    return;
                }

                setDisplayDate(date);
                previousDate = date;
            });
        }
    };
}]);
